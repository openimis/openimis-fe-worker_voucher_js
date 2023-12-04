import React, { useState, useEffect } from 'react';

import {
  Divider, Grid, Typography, Button, Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useModulesManager, useTranslations } from '@openimis/fe-core';
import { MODULE_NAME, USER_ECONOMIC_UNIT_STORAGE_KEY } from '../constants';
import AcquirementSpecificWorkerForm from './AcquirementSpecificWorkerForm';
import VoucherAcquirementPaymentModal from './VoucherAcquirementPaymentModal';

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
}));

function VoucherAcquirementSpecificWorker() {
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [voucherAcquirement, setVoucherAcquirement] = useState({});
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const acquirementBlocked = (voucherAcquirement) => !voucherAcquirement?.workers?.length
  || !voucherAcquirement?.dateRanges?.length;

  const onVoucherAcquire = () => {
    setIsPaymentModalOpen((prevState) => !prevState);
    // TODO: Fetch info about payment (acquirementSummary)
  };

  const onPaymentConfirmation = () => {
    // TODO: After summary fetch, redirect to the MPay.
    setIsPaymentModalOpen((prevState) => !prevState);
    console.log('Redirect to the MPay...');
  };

  useEffect(() => {
    const storedUserEconomicUnit = localStorage.getItem(USER_ECONOMIC_UNIT_STORAGE_KEY);

    if (storedUserEconomicUnit) {
      const userEconomicUnit = JSON.parse(storedUserEconomicUnit);

      setVoucherAcquirement((prevState) => ({ ...prevState, employer: userEconomicUnit }));
    }
  }, [setVoucherAcquirement]);

  return (
    <>
      <Grid xs={12}>
        <Grid container className={classes.paperHeaderTitle}>
          <Typography variant="h5">{formatMessage('workerVoucher.acquirement.method.SPECIFIC_WORKER')}</Typography>
          <Tooltip title={acquirementBlocked(voucherAcquirement)
            ? formatMessage('workerVoucher.vouchers.required')
            : formatMessage('workerVoucher.acquire.vouchers')}
          >
            <span>
              <Button
                variant="outlined"
                style={{ border: 0 }}
                onClick={onVoucherAcquire}
                disabled={acquirementBlocked(voucherAcquirement)}
              >
                <Typography variant="subtitle1">{formatMessage('workerVoucher.acquire.voucher')}</Typography>
              </Button>
            </span>
          </Tooltip>
        </Grid>
      </Grid>
      <Divider />
      <AcquirementSpecificWorkerForm
        edited={voucherAcquirement}
        onEditedChange={setVoucherAcquirement}
        formatMessage={formatMessage}
        classes={classes}
      />
      <VoucherAcquirementPaymentModal
        openState={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen((prevState) => !prevState)}
        onConfirm={onPaymentConfirmation}
        // TODO: Change after BE implementation
        isLoading={false}
        error={false}
        acquirementSummary={{
          pricePerVoucher: 50,
          qtyOfVouchers: 50,
          amountToBePaid: 2500,
        }}
      />
    </>
  );
}

export default VoucherAcquirementSpecificWorker;
