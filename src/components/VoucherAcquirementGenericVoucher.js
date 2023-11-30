import React, { useState } from 'react';

import {
  Divider, Grid, Typography, Button, Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useModulesManager, useTranslations } from '@openimis/fe-core';
import { MODULE_NAME } from '../constants';
import AcquirementGenericVoucherForm from './AcquirementGenericVoucherForm';

export const useStyles = makeStyles((theme) => ({
  paper: { ...theme.paper.paper, margin: '10px 0 0 0' },
  paperHeaderTitle: {
    ...theme.paper.title,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: '100%',
  },
}));

function VoucherAcquirementGenericVoucher() {
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [voucherAcquirement, setVoucherAcquirement] = useState({});

  const onVoucherAcquire = () => {
    // TODO: Open Payment modal
    console.log(voucherAcquirement);
  };

  return (
    <>
      <Grid xs={12}>
        <Grid container className={classes.paperHeaderTitle}>
          <Typography variant="h5">{formatMessage('workerVoucher.acquirement.method.GENERIC_VOUCHER')}</Typography>
          <Tooltip title={formatMessage('workerVoucher.acquire.voucher.specificWorkers')}>
            <Button variant="outlined" style={{ border: 0 }} onClick={onVoucherAcquire}>
              {formatMessage('workerVoucher.acquire.voucher')}
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <Divider />
      <AcquirementGenericVoucherForm
        edited={voucherAcquirement}
        onEditedChange={setVoucherAcquirement}
        formatMessage={formatMessage}
        classes={classes}
      />
    </>
  );
}

export default VoucherAcquirementGenericVoucher;
