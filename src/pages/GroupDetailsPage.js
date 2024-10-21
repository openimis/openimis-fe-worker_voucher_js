import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/styles';

import {
  Form,
  Helmet,
  useToast,
  parseData,
  useHistory,
  useModulesManager,
  useTranslations,
  coreAlert,
  historyPush,
} from '@openimis/fe-core';
import {
  clearGroup, createGroup, fetchGroup, updateGroup,
} from '../actions';
import {
  EMPTY_OBJECT, EMPTY_STRING, MODULE_NAME, REF_ROUTE_GROUP_LIST, RIGHT_GROUP_SEARCH,
} from '../constants';
import GroupMasterPanel from '../components/groups/GroupMasterPanel';
import { getLastMutationLog } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  page: theme.page,
}));

function GroupDetailsPage({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const modulesManager = useModulesManager();
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();
  const { economicUnit } = useSelector((state) => state.policyHolder);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const { group } = useSelector((state) => state.workerVoucher);
  const { mutation, submittingMutation } = useSelector((state) => state.workerVoucher);
  const prevSubmittingMutationRef = useRef();
  const [edited, setEdited] = useState(group || EMPTY_OBJECT);
  const groupUuid = match?.params?.group_uuid;
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);
  const [reset, setReset] = useState(0);

  const titleParams = (group) => ({
    name: group?.name ?? EMPTY_STRING,
  });

  useEffect(async () => {
    try {
      if (groupUuid) {
        const params = [`id: "${groupUuid}", economicUnitCode: "${economicUnit.code}"`];
        const groupData = await dispatch(fetchGroup(modulesManager, params));

        if (groupData?.payload?.errors?.length) {
          dispatch(coreAlert(formatMessage('workerVoucher.request.error'), groupData.payload.errors[0]?.message));
          return;
        }

        const group = parseData(groupData.payload.data.groupOfWorker)?.[0];
        const savedGroupWorkers = parseData(group.groupWorkers);

        const extendedGroup = {
          ...group,
          workers: savedGroupWorkers?.map(({ insuree }) => insuree) ?? [],
        };

        setEdited(extendedGroup);
      }
    } catch (error) {
      showError(
        formatMessageWithValues('workerVoucher.request.failed', {
          detail: error,
        }),
      );
    }
  }, [groupUuid, dispatch]);

  useEffect(() => () => dispatch(clearGroup()), []);

  const canSave = () => !!(edited?.name && edited?.workers?.length);

  const onSave = () => {
    try {
      if (groupUuid) {
        dispatch(updateGroup(economicUnit, edited, 'Update Group'));
      } else {
        dispatch(createGroup(economicUnit, edited, 'Create Group'));
      }
    } catch (error) {
      showError(
        formatMessageWithValues('workerVoucher.action.failed', {
          detail: error,
        }),
      );
    }
  };

  useEffect(async () => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      const mutationLog = await getLastMutationLog(dispatch, mutation?.clientMutationId || EMPTY_STRING);

      if (mutationLog?.error) {
        const { detail } = JSON.parse(mutationLog.error);

        showError(
          formatMessageWithValues('GroupDetailsPage.mutation.error', {
            detail,
          }),
        );
        setReset((prevReset) => prevReset + 1);
        return;
      }

      showSuccess(formatMessage('GroupDetailsPage.mutation.success'));
      historyPush(modulesManager, history, REF_ROUTE_GROUP_LIST);
    }
  }, [submittingMutation, mutation]);

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
        reset={reset}
      />
    </div>
  );
}

export default GroupDetailsPage;
