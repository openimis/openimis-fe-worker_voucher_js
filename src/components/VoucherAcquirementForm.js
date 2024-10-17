import React, { useState } from 'react';

import {
  Divider, Grid, Paper, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useModulesManager, useTranslations, PublishedComponent } from '@openimis/fe-core';
import { ACQUIREMENT_METHOD, DEFAULT, MODULE_NAME } from '../constants';
import VoucherAcquirementGenericVoucher from './VoucherAcquirementGenericVoucher';
import VoucherAcquirementSpecificWorker from './VoucherAcquirementSpecificWorker';

export const useStyles = makeStyles((theme) => ({
  paper: { ...theme.paper.paper, margin: '10px 0 0 0' },
  paperHeaderTitle: theme.paper.title,
  tableTitle: theme.table.title,
  item: theme.paper.item,
}));

function VoucherAcquirementForm() {
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const genericVoucherEnabled = modulesManager.getConf(
    'fe-worker_voucher',
    'genericVoucherEnabled',
    DEFAULT.GENERIC_VOUCHER_ENABLED,
  );
  const [acquirementMethod, setAcquirementMethod] = useState(
    genericVoucherEnabled ? null : ACQUIREMENT_METHOD.SPECIFIC_WORKER,
  );

  return (
    <>
      <Grid container>
        <Grid xs={12}>
          <Paper className={classes.paper}>
            <Grid xs={12}>
              <Grid>
                <Typography className={classes.paperHeaderTitle}>
                  {formatMessage('workerVoucher.menu.voucherAcquirement')}
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            { genericVoucherEnabled && (
            <Grid className={classes.item}>
              <Typography>{formatMessage('workerVoucher.VoucherAcquirementForm.subtitle')}</Typography>
            </Grid>
            )}
            <Divider />
            <Grid container>
              <Grid item xs={3} className={classes.item}>
                <PublishedComponent
                  pubRef="workerVoucher.VoucherAcquirementMethodPicker"
                  label="workerVoucher.acquirement.method"
                  acquirementMethod={acquirementMethod}
                  setAcquirementMethod={setAcquirementMethod}
                  readOnly={!genericVoucherEnabled}
                  required
                  withNull={false}
                  withLabel
                />
              </Grid>
            </Grid>
            <Divider style={{ margin: '12px 0' }} />
          </Paper>
        </Grid>
      </Grid>
      <Grid container>
        <Grid xs={12}>
          <Paper className={classes.paper}>
            {genericVoucherEnabled && acquirementMethod === ACQUIREMENT_METHOD.GENERIC_VOUCHER && (
            <VoucherAcquirementGenericVoucher />
            )}
            {acquirementMethod === ACQUIREMENT_METHOD.SPECIFIC_WORKER && (
            <VoucherAcquirementSpecificWorker />
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default VoucherAcquirementForm;
