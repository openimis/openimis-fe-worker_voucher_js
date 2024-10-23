import React from 'react';

import { Grid, Divider } from '@material-ui/core';

import { PublishedComponent, TextInput } from '@openimis/fe-core';
import WorkerVoucherStatusPicker from '../pickers/WorkerVoucherStatusPicker';
import VoucherQRCode from './VoucherQRCode';

function VoucherDetailsVoucher({
  workerVoucher, classes, readOnly, formatMessage,
}) {
  return (
    <>
      <Grid container style={{ marginTop: '12px' }}>
        <Grid xs={3}>
          <VoucherQRCode voucher={workerVoucher} />
        </Grid>
        <Grid container xs={9}>
          <Grid item xs={4} className={classes.item}>
            <TextInput
              module="workerVoucher"
              label="workerVoucher.code"
              value={workerVoucher?.code}
              readOnly={readOnly}
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <WorkerVoucherStatusPicker
              nullLabel={formatMessage('workerVoucher.placeholder.any')}
              withLabel
              value={workerVoucher?.status}
              readOnly={readOnly}
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="workerVoucher"
              label="workerVoucher.assignedDate"
              value={workerVoucher?.assignedDate}
              readOnly={readOnly}
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="workerVoucher"
              label="workerVoucher.expiryDate"
              value={workerVoucher?.expiryDate}
              readOnly={readOnly}
            />
          </Grid>
          <Grid item xs={4} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="workerVoucher"
              label="workerVoucher.createdDate"
              value={workerVoucher?.dateCreated}
              readOnly={readOnly}
            />
          </Grid>
        </Grid>
      </Grid>
      <Divider style={{ margin: '12px 0' }} />
    </>
  );
}

export default VoucherDetailsVoucher;
