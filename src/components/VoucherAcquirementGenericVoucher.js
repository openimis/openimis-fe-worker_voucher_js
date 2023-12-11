import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  Divider, Grid, Typography, Button, Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useModulesManager, useTranslations } from '@openimis/fe-core';
import { MODULE_NAME, USER_ECONOMIC_UNIT_STORAGE_KEY, VOUCHER_QUANTITY_THRESHOLD } from '../constants';
import AcquirementGenericVoucherForm from './AcquirementGenericVoucherForm';
import VoucherAcquirementPaymentModal from './VoucherAcquirementPaymentModal';
import { acquireGenericVoucher, genericVoucherValidation } from '../actions';

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

function VoucherAcquirementGenericVoucher() {
  const modulesManager = useModulesManager();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [voucherAcquirement, setVoucherAcquirement] = useState({});
  const [acquirementSummary, setAcquirementSummary] = useState({});
  const [acquirementSummaryLoading, setAcquirementSummaryLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const acquirementBlocked = (voucherAcquirement) => !voucherAcquirement?.quantity
  || voucherAcquirement?.quantity > VOUCHER_QUANTITY_THRESHOLD;

  const onVoucherAcquire = async () => {
    setIsPaymentModalOpen((prevState) => !prevState);
    setAcquirementSummaryLoading(true);
    try {
      const { payload } = await dispatch(genericVoucherValidation(
        voucherAcquirement?.employer?.code,
        voucherAcquirement?.quantity,
      ));
      setAcquirementSummary(payload);
    } catch (error) {
      throw new Error(`[VOUCHER_ACQUIREMENT_GENERIC_VOUCHER]: Validation error. ${error}`);
    } finally {
      setAcquirementSummaryLoading(false);
    }
  };

  const onPaymentConfirmation = async () => {
    try {
      await dispatch(acquireGenericVoucher(
        voucherAcquirement?.employer?.code,
        voucherAcquirement?.quantity,
        'Acquire Generic Voucher',
      ));
    } catch (error) {
      throw new Error(`[VOUCHER_ACQUIREMENT_GENERIC_VOUCHER]: Acquirement error. ${error}`);
    }

    // TODO: Redirect to the MPay.
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
          <Typography variant="h5">{formatMessage('workerVoucher.acquirement.method.GENERIC_VOUCHER')}</Typography>
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
      <AcquirementGenericVoucherForm
        edited={voucherAcquirement}
        onEditedChange={setVoucherAcquirement}
        formatMessage={formatMessage}
        classes={classes}
      />
      <VoucherAcquirementPaymentModal
        openState={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen((prevState) => !prevState)}
        onConfirm={onPaymentConfirmation}
        isLoading={acquirementSummaryLoading}
        acquirementSummary={acquirementSummary}
      />
    </>
  );
}

export default VoucherAcquirementGenericVoucher;
