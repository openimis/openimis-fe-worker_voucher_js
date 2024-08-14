import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/styles';

import {
  Form, Helmet, useHistory, useModulesManager, useTranslations, parseData, journalize,
} from '@openimis/fe-core';
import {
  appendWorkerToEconomicUnit, clearWorker, fetchWorker, fetchWorkerVoucherCount,
} from '../actions';
import { EMPTY_STRING, MODULE_NAME, RIGHT_WORKER_SEARCH } from '../constants';
import WorkerMasterPanel from '../components/WorkerMasterPanel';

const useStyles = makeStyles((theme) => ({
  page: theme.page,
}));

function WorkerDetailsPage({ match }) {
  const prevSubmittingMutationRef = useRef();
  const classes = useStyles();
  const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const history = useHistory();
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);
  const { economicUnit } = useSelector((state) => state.policyHolder);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const workerUuid = match?.params?.worker_uuid;
  const { worker } = useSelector((state) => state.workerVoucher);
  const [edited, setEdited] = useState(worker);
  const [reset, setReset] = useState(0);
  const [workerVoucherCount, setWorkerVoucherCount] = useState(0);
  const { mutation, submittingMutation } = useSelector((state) => state.workerVoucher);

  const titleParams = (worker) => ({
    chfId: worker?.chfId ?? EMPTY_STRING,
  });

  useEffect(async () => {
    try {
      if (workerUuid) {
        const params = [`uuid: "${workerUuid}"`];
        const workerData = await dispatch(fetchWorker(modulesManager, params));
        const workerVoucherCountData = await dispatch(fetchWorkerVoucherCount(workerUuid));

        const worker = parseData(workerData.payload.data.worker)?.[0];
        const workerVoucherCount = parseData(workerVoucherCountData.payload.data.worker)?.[0]?.vouchersThisYear;

        setEdited(worker);
        setWorkerVoucherCount(workerVoucherCount);
      }
    } catch (error) {
      throw new Error(`[WORKER_DETAILS_PAGE]: Fetching worker failed. ${error}`);
    }
  }, [workerUuid, dispatch]);

  useEffect(() => () => dispatch(clearWorker()), []);

  // TODO: Adjust the canSave function when the BE is ready
  const canSave = () => {
    if (edited?.uuid || !edited?.chfId || !edited?.lastName || !edited?.otherNames) {
      return false;
    }

    return true;
  };

  const saveWorker = (data) => {
    try {
      // TODO: We need to hardcode dob and gender for now, as they are not part of the worker data
      /* eslint-disable no-param-reassign */
      data.dob = '1990-01-01';
      data.gender = {
        code: 'M',
      };

      dispatch(appendWorkerToEconomicUnit(economicUnit.code, data, 'Append Worker to Economic Unit')).then(
        () => history.goBack(),
      );
    } catch (error) {
      setReset((prevReset) => prevReset + 1);
      throw new Error(`[WORKER_DETAILS_PAGE]: Saving worker failed. ${error}`);
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

  return (
    rights.includes(RIGHT_WORKER_SEARCH) && (
      <div className={classes.page}>
        <Helmet title={formatMessageWithValues('workerVoucher.WorkerDetailsPage.title', titleParams(worker))} />
        <Form
          module="workerVoucher"
          title={formatMessageWithValues('workerVoucher.WorkerDetailsPage.title', titleParams(worker))}
          titleParams={titleParams(worker)}
          edited={edited}
          back={() => history.goBack()}
          Panels={[WorkerMasterPanel]}
          formatMessage={formatMessage}
          rights={rights}
          onEditedChanged={setEdited}
          canSave={canSave}
          save={saveWorker}
          reset={reset}
          openDirty={!edited?.uuid}
          workerVoucherCount={workerVoucherCount}
        />
      </div>
    )
  );
}

export default WorkerDetailsPage;
