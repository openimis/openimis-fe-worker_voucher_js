import React from 'react';

import {
  Divider, Grid, Paper, Typography,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/styles';

import {
  FormattedMessage, ProgressOrError, PublishedComponent, TextInput,
} from '@openimis/fe-core';
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
}));

export default function WorkerMConnectPreview({
  isLoading = false, error = null, searchWorker, edited,
}) {
  const classes = useStyles();

  const renderWorkerOutput = (worker) => {
    if (!worker) {
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
        <Grid item xs={12} className={classes.item}>
          <PublishedComponent pubRef="insuree.Avatar" photo={edited?.photo ?? null} readOnly withMeta={false} />
        </Grid>
        <Divider />
        <Grid container className={classes.item}>
          <Grid item xs={4} className={classes.item}>
            <TextInput
              module="workerVoucher"
              label="workerVoucher.worker.lastName"
              value={edited?.lastName ?? EMPTY_STRING}
              readOnly
            />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Paper className={classes.paper}>
      <Grid className={classes.tableTitle}>
        <Grid item xs={12} container alignItems="center" className={classes.item}>
          <Typography variant="h6">
            <FormattedMessage module="workerVoucher" id="workerVoucher.WorkerMConnectAddForm.preview" />
          </Typography>
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
