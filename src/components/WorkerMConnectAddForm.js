import React, { useState } from 'react';

import { Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import _debounce from 'lodash/debounce';

import { TextInput, useModulesManager, useTranslations } from '@openimis/fe-core';
import { DEFAULT_DEBOUNCE_TIME, EMPTY_STRING, MODULE_NAME } from '../constants';
import WorkerMConnectPreview from './WorkerMConnectPreview';

const useStyles = makeStyles((theme) => ({
  item: {
    ...theme.paper.item,
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
  },
}));

export default function WorkerMConnectAddForm({
  updateChfId, searchWorker, setSearchWorker, edited,
}) {
  const classes = useStyles();
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateWorker = async (chfId) => {
    setIsLoading(true);
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Determines if the error it returned or not
          const isError = true;

          if (isError) {
            reject(new Error(formatMessage('workerVoucher.WorkerMConnectAddForm.error')));
          } else {
            setSearchWorker({ chfId });
            resolve();
          }
        }, 2000);
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearchWorker = _debounce(async (chfId) => {
    setError(null);
    updateChfId(chfId);
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
        <WorkerMConnectPreview
          isLoading={isLoading}
          error={error}
          searchWorker={searchWorker}
          edited={edited}
        />
      </Grid>
    </Grid>
  );
}
