import React from 'react';

import { Grid, Button, Typography } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

import { useModulesManager, useTranslations } from '@openimis/fe-core';
import { BILL_PAID_STATUS, MODULE_NAME } from '../constants';
import { payWithMPay } from '../utils/utils';

function MPayBillButton({ bill }) {
  const modulesManager = useModulesManager();

  if (!bill || bill.status === BILL_PAID_STATUS) return null;

  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);

  const handleOnClick = async (e) => {
    e.preventDefault();
    await payWithMPay(bill.id);
  };

  return (
    <Grid item>
      <Button
        size="small"
        variant="contained"
        color="primary"
        startIcon={<AccountBalanceIcon />}
        onClick={handleOnClick}
      >
        <Typography variant="subtitle1">{formatMessage('workerVoucher.MPayBillButton')}</Typography>
      </Button>
    </Grid>
  );
}

export default MPayBillButton;
