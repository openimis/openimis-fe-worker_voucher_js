import React from 'react';

import { Grid, Divider } from '@material-ui/core';

import { PublishedComponent, TextInput } from '@openimis/fe-core';

function VoucherDetailsWorker({
  workerVoucher, classes, readOnly,
}) {
  return (
    <>
      <Grid container>
        <Grid item xs={3} className={classes.item}>
          <TextInput
            module="workerVoucher"
            label="workerVoucher.worker.code"
            value={workerVoucher?.insuree?.chfId}
            readOnly={readOnly}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput
            module="workerVoucher"
            label="workerVoucher.worker.lastName"
            value={workerVoucher?.insuree?.lastName}
            readOnly={readOnly}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput
            module="workerVoucher"
            label="workerVoucher.worker.otherNames"
            value={workerVoucher?.insuree?.otherNames}
            readOnly={readOnly}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="workerVoucher"
            label="workerVoucher.worker.dob"
            value={workerVoucher?.insuree?.dob}
            readOnly={readOnly}
          />
        </Grid>
      </Grid>
      <Divider style={{ margin: '12px 0' }} />
    </>
  );
}

export default VoucherDetailsWorker;
