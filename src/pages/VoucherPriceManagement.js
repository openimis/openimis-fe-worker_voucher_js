import React from 'react';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/styles';

import { Helmet, useModulesManager, useTranslations } from '@openimis/fe-core';
import { MODULE_NAME, VOUCHER_PRICE_MANAGEMENT_RIGHT } from '../constants';
import VoucherPriceManagementForm from '../components/VoucherPriceManagementForm';

export const useStyles = makeStyles((theme) => ({
  page: theme.page,
}));

function VoucherPriceManagement() {
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);

  return (
    rights.includes(VOUCHER_PRICE_MANAGEMENT_RIGHT) && (
      <div className={classes.page}>
        <Helmet title={formatMessage('workerVoucher.menu.priceManagement')} />
        <VoucherPriceManagementForm />
      </div>
    )
  );
}

export default VoucherPriceManagement;
