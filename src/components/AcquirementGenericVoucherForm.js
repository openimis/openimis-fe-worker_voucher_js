import React from 'react';

import { Grid, Divider } from '@material-ui/core';

import { NumberInput, TextInput } from '@openimis/fe-core';
import { VOUCHER_QUANTITY_THRESHOLD } from '../constants';

function AcquirementGenericVoucherForm({
  classes, readOnly = false, edited, onEditedChange, formatMessage,
}) {
  return (
    <>
      <Grid container direction="row">
        <Grid item xs={3} className={classes.item}>
          <NumberInput
            module="workerVoucher"
            label="workerVoucher.vouchersQuantity"
            value={edited?.quantity}
            onChange={(quantity) => onEditedChange({ ...edited, quantity })}
            required
            max={VOUCHER_QUANTITY_THRESHOLD}
            readOnly={readOnly}
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
    </>
  );
}

export default AcquirementGenericVoucherForm;
