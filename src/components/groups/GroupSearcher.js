import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IconButton, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import {
  Searcher, SelectDialog, journalize, useHistory, useModulesManager, useTranslations,
} from '@openimis/fe-core';
import { deleteGroup, fetchGroupsAction } from '../../actions';
import {
  DEFAULT_PAGE_SIZE,
  MODULE_NAME,
  RIGHT_GROUP_DELETE,
  RIGHT_GROUP_EDIT,
  RIGHT_GROUP_SEARCH,
  ROWS_PER_PAGE_OPTIONS,
} from '../../constants';
import GroupFilter from './GroupFilter';

function GroupSearcher() {
  const history = useHistory();
  const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const prevSubmittingMutationRef = useRef();

  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const {
    fetchingGroups,
    fetchedGroups,
    errorGroups,
    groups,
    // TODO: Uncomment when BE is ready
    // groupsPageInfo,
    // groupsTotalCount,
    mutation,
    submittingMutation,
  } = useSelector((state) => state.workerVoucher);
  const { economicUnit } = useSelector((state) => state.policyHolder);

  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);

  const [queryParams, setQueryParams] = useState([]);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const fetchGroups = useCallback(
    (params) => {
      try {
        const actionParams = [...params];

        if (economicUnit?.code) {
          actionParams.push(`economicUnitCode:"${economicUnit.code}"`);
        }

        dispatch(fetchGroupsAction(modulesManager, actionParams));
      } catch (error) {
        throw new Error(`[GROUP_SEARCHER]: Fetching groups failed. ${error}`);
      }
    },
    [economicUnit],
  );

  const headers = () => [
    'workerVoucher.GroupSearcher.groupName',
    'workerVoucher.GroupSearcher.dateCreated',
    'emptyLabel',
  ];

  const sorts = () => [
    ['groupName', true],
    ['dateCreated', true],
  ];

  const rowIdentifier = (group) => group.uuid;

  const openGroup = (group) => rights.includes(RIGHT_GROUP_SEARCH)
    && history.push(`/${modulesManager.getRef('workerVoucher.route.group')}/${group?.uuid}`);

  const onDoubleClick = (group) => openGroup(group);

  const onDeleteGroupDialogOpen = (group) => {
    setDeleteGroupDialogOpen((prevState) => !prevState);
    setGroupToDelete(group);
  };

  const onDeleteGroupDialogClose = () => {
    setDeleteGroupDialogOpen((prevState) => !prevState);
    setGroupToDelete(null);
  };

  const onDeleteGroupConfirm = () => {
    try {
      dispatch(deleteGroup(economicUnit, groupToDelete, 'Delete Group'));
      fetchGroups(queryParams);
    } catch (error) {
      throw new Error(`[GROUP_SEARCHER]: Deletion failed. ${error}`);
    } finally {
      setDeleteGroupDialogOpen((prevState) => !prevState);
    }
  };

  const itemFormatters = () => [
    (group) => group.chfId,
    (group) => group.lastName,
    (group) => group.otherNames,
    (group) => (
      <div style={{ textAlign: 'right' }}>
        {rights.includes(RIGHT_GROUP_EDIT) && (
          <Tooltip title={formatMessage('workerVoucher.tooltip.edit')}>
            <IconButton onClick={() => openGroup(group)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
        {rights.includes(RIGHT_GROUP_DELETE) && (
          <Tooltip title={formatMessage('workerVoucher.tooltip.delete')}>
            <IconButton onClick={() => onDeleteGroupDialogOpen(group)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    ),
  ];

  const groupFilters = ({ filters, onChangeFilters }) => (
    <GroupFilter filters={filters} onChangeFilters={onChangeFilters} />
  );

  const filtersToQueryParams = ({
    filters, pageSize, beforeCursor, afterCursor, orderBy,
  }) => {
    const queryParams = Object.keys(filters)
      .filter((f) => !!filters[f].filter)
      .map((f) => filters[f].filter);
    if (!beforeCursor && !afterCursor) {
      queryParams.push(`first: ${pageSize}`);
    }
    if (afterCursor) {
      queryParams.push(`after: "${afterCursor}"`);
      queryParams.push(`first: ${pageSize}`);
    }
    if (beforeCursor) {
      queryParams.push(`before: "${beforeCursor}"`);
      queryParams.push(`last: ${pageSize}`);
    }
    if (orderBy) {
      queryParams.push(`orderBy: ["${orderBy}"]`);
    }
    setQueryParams(queryParams);
    return queryParams;
  };

  useEffect(() => {
    if (queryParams.length) {
      fetchGroups(queryParams);
    }
  }, [economicUnit, queryParams]);

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      dispatch(journalize(mutation));
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  return (
    <>
      <Searcher
        module="workerVoucher"
        FilterPane={groupFilters}
        fetch={fetchGroups}
        items={groups}
        // TODO: Uncomment when BE is ready
        // itemsPageInfo={groupsPageInfo}
        itemsPageInfo={{ totalCount: 0 }}
        fetchedItems={fetchedGroups}
        fetchingItems={fetchingGroups}
        errorItems={errorGroups}
        filtersToQueryParams={filtersToQueryParams}
        // TODO: Uncomment when BE is ready
        // tableTitle={formatMessageWithValues('workerVoucher.GroupSearcher.resultsTitle', { groupsTotalCount })}
        tableTitle={formatMessageWithValues('workerVoucher.GroupSearcher.resultsTitle', { groupsTotalCount: 0 })}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        rowIdentifier={rowIdentifier}
        onDoubleClick={onDoubleClick}
      />
      <SelectDialog
        confirmState={deleteGroupDialogOpen}
        onConfirm={() => onDeleteGroupConfirm()}
        onClose={() => onDeleteGroupDialogClose()}
        module="workerVoucher"
        confirmTitle="GroupSearcher.dialog.title"
        confirmMessage="GroupSearcher.dialog.message"
        confirmationButton="GroupSearcher.dialog.confirm"
        rejectionButton="GroupSearcher.dialog.abandon"
      />
    </>
  );
}

export default GroupSearcher;
