import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IconButton, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';

import {
  Searcher,
  SelectDialog,
  useToast,
  useHistory,
  useModulesManager,
  useTranslations,
  decodeId,
} from '@openimis/fe-core';
import { deleteGroup, fetchGroupsAction } from '../../actions';
import {
  ADMIN_RIGHT,
  DEFAULT_PAGE_SIZE,
  EMPTY_STRING,
  MODULE_NAME,
  RIGHT_GROUP_DELETE,
  RIGHT_GROUP_EDIT,
  RIGHT_GROUP_SEARCH,
  ROWS_PER_PAGE_OPTIONS,
} from '../../constants';
import GroupFilter from './GroupFilter';
import { getLastMutationLog } from '../../utils/utils';

function GroupSearcher({ searcherActions, enableActionButtons }) {
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
    groupsPageInfo,
    groupsTotalCount,
    mutation,
    submittingMutation,
  } = useSelector((state) => state.workerVoucher);
  const { economicUnit } = useSelector((state) => state.policyHolder);

  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);
  const { showSuccess, showError } = useToast();

  const [queryParams, setQueryParams] = useState([]);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const isAdmin = rights.includes(ADMIN_RIGHT);

  const fetchGroups = useCallback(
    (params) => {
      try {
        const actionParams = [...params];

        if (!isAdmin && economicUnit?.code) {
          actionParams.push(`economicUnitCode:"${economicUnit.code}"`);
        }

        actionParams.push('isDeleted: false');

        dispatch(fetchGroupsAction(modulesManager, actionParams));
      } catch (error) {
        throw new Error(`[GROUP_SEARCHER]: Fetching groups failed.. ${error}`);
      }
    },
    [economicUnit],
  );

  const headers = () => [
    'workerVoucher.GroupSearcher.groupName',
    'workerVoucher.GroupSearcher.dateCreated',
    'workerVoucher.GroupSearcher.workersCount',
    'emptyLabel',
  ];

  const sorts = () => [['name', true], ['dateCreated', true], null];

  const rowIdentifier = (group) => group.uuid;

  const openGroup = (group) => rights.includes(RIGHT_GROUP_SEARCH)
    && history.push(`/${modulesManager.getRef('workerVoucher.route.group')}/${decodeId(group.id)}`);

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
      dispatch(deleteGroup(economicUnit, [groupToDelete], 'Delete Group'));
    } catch (error) {
      throw new Error(`[GROUP_SEARCHER]: Deletion failed. ${error}`);
    } finally {
      setDeleteGroupDialogOpen((prevState) => !prevState);
    }
  };

  const itemFormatters = () => [
    (group) => group.name,
    (group) => group.dateCreated.split('T')[0],
    (group) => group.groupWorkers.totalCount,
    (group) => (
      <div style={{ textAlign: 'right' }}>
        {rights.includes(RIGHT_GROUP_EDIT) && (
          <Tooltip title={formatMessage('workerVoucher.tooltip.edit')}>
            <IconButton onClick={() => openGroup(group)}>
              <VisibilityIcon />
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

  useEffect(async () => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      const mutationLog = await getLastMutationLog(dispatch, mutation?.clientMutationId || EMPTY_STRING);

      if (mutationLog?.error) {
        const { detail } = JSON.parse(mutationLog.error);

        showError(
          formatMessageWithValues('GroupDetailsPage.delete.error', {
            detail,
          }),
        );
        return;
      }

      showSuccess(formatMessage('GroupDetailsPage.delete.success'));
      fetchGroups(queryParams);
    }
  }, [submittingMutation, mutation]);

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
        itemsPageInfo={groupsPageInfo}
        fetchedItems={fetchedGroups}
        fetchingItems={fetchingGroups}
        errorItems={errorGroups}
        filtersToQueryParams={filtersToQueryParams}
        tableTitle={formatMessageWithValues('workerVoucher.GroupSearcher.resultsTitle', { groupsTotalCount })}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        rowIdentifier={rowIdentifier}
        onDoubleClick={onDoubleClick}
        enableActionButtons={enableActionButtons}
        searcherActions={searcherActions}
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
