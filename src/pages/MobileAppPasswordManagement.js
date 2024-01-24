import React from 'react';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/styles';

import { Helmet, useModulesManager, useTranslations } from '@openimis/fe-core';
import { MODULE_NAME, ADMIN_RIGHT, INSPECTOR_RIGHT } from '../constants';
import MobileAppPasswordForm from '../components/MobileAppPasswordForm';

export const useStyles = makeStyles((theme) => ({
  page: theme.page,
}));

function MobileAppPasswordManagement() {
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);

  return (
    rights.includes(INSPECTOR_RIGHT || ADMIN_RIGHT) && (
    <div className={classes.page}>
      <Helmet title={formatMessage('workerVoucher.menu.mobileAppPassword')} />
      <MobileAppPasswordForm />
    </div>
    )
  );
}

export default MobileAppPasswordManagement;
