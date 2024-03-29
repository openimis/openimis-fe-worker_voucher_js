import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Divider, Grid, Typography, Button, Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import {
  useModulesManager, useTranslations, journalize, parseData, coreAlert,
} from '@openimis/fe-core';
import { specificVoucherValidation, acquireSpecificVoucher, fetchMutation } from '../actions';
import { MODULE_NAME, USER_ECONOMIC_UNIT_STORAGE_KEY } from '../constants';
import { payWithMPay } from '../utils/utils';
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
  const prevSubmittingMutationRef = useRef();
  const modulesManager = useModulesManager();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [voucherAcquirement, setVoucherAcquirement] = useState({});
  const [acquirementSummary, setAcquirementSummary] = useState({});
  const [acquirementSummaryLoading, setAcquirementSummaryLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { mutation, submittingMutation } = useSelector((state) => state.workerVoucher);

  const acquirementBlocked = (voucherAcquirement) => !voucherAcquirement?.workers?.length
  || !voucherAcquirement?.dateRanges?.length;

  const onVoucherAcquire = async () => {
    setIsPaymentModalOpen((prevState) => !prevState);
    setAcquirementSummaryLoading(true);
    try {
      const { payload } = await dispatch(
        specificVoucherValidation(
          voucherAcquirement?.employer?.code,
          voucherAcquirement?.workers,
          voucherAcquirement?.dateRanges,
        ),
      );
      setAcquirementSummary(payload);
    } catch (error) {
      throw new Error(`[VOUCHER_ACQUIREMENT_SPECIFIC_VOUCHER]: Validation error. ${error}`);
    } finally {
      setAcquirementSummaryLoading(false);
    }
  };

  const onPaymentConfirmation = async () => {
    try {
      const { payload } = await dispatch(
        acquireSpecificVoucher(
          voucherAcquirement?.employer?.code,
          voucherAcquirement?.workers,
          voucherAcquirement?.dateRanges,
          'Acquire Specific Voucher',
        ),
      );

      const { clientMutationId } = payload.data.acquireAssignedVouchers;
      const acquirementMutation = await dispatch(fetchMutation(clientMutationId));
      const currentMutation = parseData(acquirementMutation.payload.data.mutationLogs)?.[0];

      if (currentMutation.error) {
        const errorDetails = JSON.parse(currentMutation.error);

        dispatch(
          coreAlert(formatMessage('menu.voucherAcquirement'), formatMessage(errorDetails?.detail || 'NOT_FOUND')),
        );
        return;
      }

      const {
        worker_voucher: { bill_id: billId },
      } = JSON.parse(currentMutation.jsonExt);

      await payWithMPay(billId);
    } catch (error) {
      throw new Error(`[VOUCHER_ACQUIREMENT_SPECIFIC_VOUCHER]: Acquirement error. ${error}`);
    }

    setIsPaymentModalOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      dispatch(journalize(mutation));
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

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
          <Tooltip
            title={
              acquirementBlocked(voucherAcquirement)
                ? formatMessage('workerVoucher.vouchers.required')
                : formatMessage('workerVoucher.acquire.vouchers')
            }
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
        isLoading={acquirementSummaryLoading}
        acquirementSummary={acquirementSummary}
        type="acquireAssignedValidation"
      />
    </>
  );
}

export default VoucherAcquirementSpecificWorker;
