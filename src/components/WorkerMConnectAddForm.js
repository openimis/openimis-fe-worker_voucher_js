import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Divider, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import _debounce from 'lodash/debounce';

import { TextInput, useModulesManager, useTranslations } from '@openimis/fe-core';

import { validateMConnectWorker } from '../actions';
import {
  DEFAULT_DEBOUNCE_TIME, EMPTY_STRING, MODULE_NAME, USER_ECONOMIC_UNIT_STORAGE_KEY,
} from '../constants';
import WorkerMConnectPreview from './WorkerMConnectPreview';

const useStyles = makeStyles((theme) => ({
  item: {
    ...theme.paper.item,
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
  },
}));

export default function WorkerMConnectAddForm({ updateWorkerData, edited }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const storedUserEconomicUnit = localStorage.getItem(USER_ECONOMIC_UNIT_STORAGE_KEY);
  const userEconomicUnit = JSON.parse(storedUserEconomicUnit ?? '{}');

  const validateWorker = async (chfId) => {
    setIsLoading(true);
    try {
      const mConnectValidation = await dispatch(validateMConnectWorker(chfId, userEconomicUnit?.code));

      if (mConnectValidation?.error) {
        throw new Error(formatMessage('workerVoucher.WorkerMConnectAddForm.serverError'));
      }

      const { lastName, otherNames } = mConnectValidation?.payload?.data?.onlineWorkerData ?? {};

      if (!lastName || !otherNames) {
        updateWorkerData({ chfId, lastName: EMPTY_STRING, otherNames: EMPTY_STRING });
        throw new Error(formatMessage('workerVoucher.WorkerMConnectAddForm.error'));
      }

      updateWorkerData({ chfId, lastName, otherNames });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearchWorker = _debounce(async (chfId) => {
    setError(null);
    await validateWorker(chfId);
  }, DEFAULT_DEBOUNCE_TIME);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid item xs={4} className={classes.item}>
          <TextInput
            type="number"
            module="workerVoucher"
            label="workerVoucher.worker.chfId"
            value={edited?.chfId ?? EMPTY_STRING}
            onChange={debouncedSearchWorker}
            error={error}
          />
        </Grid>
        <Divider />
        <WorkerMConnectPreview isLoading={isLoading} error={error} searchWorker={edited} />
      </Grid>
    </Grid>
  );
}
