import React from 'react';

import { Grid, Paper, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ClearIcon from '@material-ui/icons/Clear';
import ErrorIcon from '@material-ui/icons/Error';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/styles';

import { FormattedMessage, ProgressOrError, TextInput } from '@openimis/fe-core';
import { EMPTY_STRING } from '../constants';

const useStyles = makeStyles((theme) => ({
  paper: theme.paper.paper,
  tableTitle: theme.table.title,
  item: theme.paper.item,
  notFoundItem: {
    ...theme.paper.item,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default function WorkerMConnectPreview({ isLoading = false, error = null, searchWorker }) {
  const classes = useStyles();

  const renderWorkerOutput = (worker) => {
    if (!worker?.lastName && !worker?.otherNames) {
      return (
        <Grid container className={classes.notFoundItem}>
          {error ? <ClearIcon color="error" fontSize="large" /> : <PersonIcon color="primary" fontSize="large" />}
          <FormattedMessage
            module="workerVoucher"
            id={error ? 'workerVoucher.WorkerMConnectAddForm.notFound' : 'workerVoucher.WorkerMConnectAddForm.detail'}
          />
        </Grid>
      );
    }

    return (
      <Grid container className={classes.item}>
        <Grid container className={classes.item}>
          <Grid item xs={4} className={classes.item}>
            <TextInput
              module="workerVoucher"
              label="workerVoucher.worker.lastName"
              value={worker?.lastName ?? EMPTY_STRING}
              readOnly
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <TextInput
              module="workerVoucher"
              label="workerVoucher.worker.otherNames"
              value={worker?.otherNames ?? EMPTY_STRING}
              readOnly
            />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderIcon = () => {
    if (error && !searchWorker?.lastName && !searchWorker?.otherNames) {
      return <ErrorIcon size="large" color="error" />;
    }

    if (searchWorker.chfId) {
      return <CheckCircleIcon size="large" color="primary" />;
    }

    return EMPTY_STRING;
  };

  return (
    <Paper className={classes.paper}>
      <Grid className={classes.tableTitle}>
        <Grid item xs={12} container alignItems="center" justifyContent="space-between" className={classes.item}>
          <Typography variant="h6">
            <FormattedMessage module="workerVoucher" id="workerVoucher.WorkerMConnectAddForm.preview" />
          </Typography>
          <div className={classes.center}>
            {renderIcon()}
          </div>
        </Grid>
      </Grid>
      {isLoading ? (
        <Grid container className={classes.item}>
          <ProgressOrError progress={isLoading} />
        </Grid>
      ) : (
        renderWorkerOutput(searchWorker)
      )}
    </Paper>
  );
}
