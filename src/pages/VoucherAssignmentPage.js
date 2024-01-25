import React from 'react';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/styles';

import { Helmet, useModulesManager, useTranslations } from '@openimis/fe-core';
import { MODULE_NAME, VOUCHER_RIGHT_SEARCH } from '../constants';
import VoucherAssignmentForm from '../components/VoucherAssignmentForm';

export const useStyles = makeStyles((theme) => ({
  page: theme.page,
}));

function VoucherAssignmentPage() {
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);

  return (
    rights.includes(VOUCHER_RIGHT_SEARCH) && (
      <div className={classes.page}>
        <Helmet title={formatMessage('workerVoucher.menu.voucherAssignment')} />
        <VoucherAssignmentForm />
      </div>
    )
  );
}

export default VoucherAssignmentPage;
