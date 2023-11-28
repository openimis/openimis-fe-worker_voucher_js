import React from 'react';

import { Grid, Divider } from '@material-ui/core';

import { TextInput } from '@openimis/fe-core';

function VoucherDetailsEmployer({
  workerVoucher, classes, readOnly,
}) {
  return (
    <>
      <Grid container>
        <Grid item xs={3} className={classes.item}>
          <TextInput
            module="workerVoucher"
            label="workerVoucher.employer.code"
            value={workerVoucher?.policyholder?.code}
            readOnly={readOnly}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput
            module="workerVoucher"
            label="workerVoucher.employer.tradename"
            value={workerVoucher?.policyholder?.tradeName}
            readOnly={readOnly}
          />
        </Grid>
      </Grid>
      <Divider style={{ margin: '12px 0' }} />
    </>
  );
}

export default VoucherDetailsEmployer;
