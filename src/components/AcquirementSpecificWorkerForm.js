import React from 'react';

import { Grid, Divider } from '@material-ui/core';

import { PublishedComponent, TextInput } from '@openimis/fe-core';

function AcquirementSpecificWorkerForm({
  classes, readOnly = false, edited, onEditedChange, formatMessage,
}) {
  return (
    <>
      <Grid container direction="row">
        <Grid item xs={12} className={classes.item}>
          <PublishedComponent
            module="workerVoucher"
            pubRef="workerVoucher.WorkerMultiplePicker"
            readOnly={readOnly}
            required
            classes={classes}
            value={edited?.workers ?? []}
            onChange={(_, workers) => onEditedChange({ ...edited, workers })}
          />
        </Grid>
      </Grid>
      <Divider style={{ margin: '12px 0' }} />
      <Grid container xs={12}>
        <Grid item xs={3} className={classes.item}>
          <TextInput
            module="workerVoucher"
            label="workerVoucher.employer.code"
            value={edited?.employer?.code ?? formatMessage('workerVoucher.WorkerDateRangePicker.notAvailable')}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput
            module="workerVoucher"
            label="workerVoucher.employer.tradename"
            value={edited?.employer?.code ?? formatMessage('workerVoucher.WorkerDateRangePicker.notAvailable')}
            readOnly
          />
        </Grid>
      </Grid>
      <Divider style={{ margin: '12px 0' }} />
      <Grid container xs={12}>
        <PublishedComponent
          module="workerVoucher"
          pubRef="workerVoucher.WorkerDateRangePicker"
          readOnly={readOnly}
          required
          classes={classes}
          value={edited?.dateRanges ?? []}
          onChange={(dateRanges) => onEditedChange({ ...edited, dateRanges })}
        />
      </Grid>
      <Divider style={{ margin: '12px 0' }} />
    </>
  );
}

export default AcquirementSpecificWorkerForm;
