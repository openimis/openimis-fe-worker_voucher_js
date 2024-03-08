import React from 'react';

import { Grid, Button, Typography } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

import { useModulesManager, useTranslations, baseApiUrl } from '@openimis/fe-core';
import {
  BILL_PAID_STATUS, MODULE_NAME, MPAY_BILL_URL,
} from '../constants';

function MPayBillButton({ bill }) {
  const modulesManager = useModulesManager();

  if (!bill || bill.status === BILL_PAID_STATUS) return null;

  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);

  const handleOnClick = (e) => {
    e.preventDefault();

    try {
      const redirectToURL = new URL(`${window.location.origin}${baseApiUrl}${MPAY_BILL_URL}`);
      redirectToURL.searchParams.set('bill', bill.id);

      window.open(redirectToURL.href, '_blank');
    } catch (error) {
      throw new Error('Redirection failed.', error);
    }
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
