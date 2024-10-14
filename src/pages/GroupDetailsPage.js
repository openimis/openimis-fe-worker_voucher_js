import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/styles';

import {
  Form, Helmet, journalize, parseData, useHistory, useModulesManager, useTranslations,
} from '@openimis/fe-core';
import {
  clearGroup, createGroup, fetchGroup, updateGroup,
} from '../actions';
import {
  EMPTY_OBJECT, EMPTY_STRING, MODULE_NAME, RIGHT_GROUP_SEARCH,
} from '../constants';
import GroupMasterPanel from '../components/groups/GroupMasterPanel';

const useStyles = makeStyles((theme) => ({
  page: theme.page,
}));

function GroupDetailsPage({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const modulesManager = useModulesManager();
  const dispatch = useDispatch();
  const { economicUnit } = useSelector((state) => state.policyHolder);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const { group } = useSelector((state) => state.workerVoucher);
  const { mutation, submittingMutation } = useSelector((state) => state.workerVoucher);
  const prevSubmittingMutationRef = useRef();
  const [edited, setEdited] = useState(group || EMPTY_OBJECT);
  const groupUuid = match?.params?.group_uuid;
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);

  const titleParams = (group) => ({
    name: group?.name ?? EMPTY_STRING,
  });

  useEffect(async () => {
    try {
      if (groupUuid) {
        const params = [`uuid: "${groupUuid}", economicUnitCode: "${economicUnit.code}"`];
        const groupData = await dispatch(fetchGroup(modulesManager, params));

        const group = parseData(groupData.payload.data.group)?.[0];

        setEdited(group);
      }
    } catch (error) {
      throw new Error(`[GROUP_DETAILS_PAGE]: Fetching group failed. ${error}`);
    }
  }, [groupUuid, dispatch]);

  useEffect(() => () => dispatch(clearGroup()), []);

  const canSave = () => !!(edited?.name && edited?.workers?.length);

  const onSave = () => {
    try {
      if (groupUuid) {
        dispatch(updateGroup(edited, 'UpdateGroup'));
      } else {
        dispatch(createGroup(edited, 'CreateGroup'));
      }
    } catch (error) {
      throw new Error(`[GROUP_DETAILS_PAGE]: Saving group failed. ${error}`);
    }
  };

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      dispatch(journalize(mutation));
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  if (!rights.includes(RIGHT_GROUP_SEARCH)) return null;

  return (
    <div className={classes.page}>
      <Helmet title={formatMessageWithValues('workerVoucher.GroupDetailsPage.title', titleParams(group))} />
      <Form
        module="workerVoucher"
        title={formatMessageWithValues('workerVoucher.GroupDetailsPage.title', titleParams(group))}
        titleParams={titleParams(group)}
        edited={edited}
        back={() => history.goBack()}
        Panels={[GroupMasterPanel]}
        formatMessage={formatMessage}
        rights={rights}
        onEditedChanged={setEdited}
        canSave={canSave}
        save={onSave}
        openDirty={!edited?.uuid}
      />
    </div>
  );
}

export default GroupDetailsPage;
