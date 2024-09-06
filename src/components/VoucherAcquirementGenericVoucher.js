import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button, Divider, Grid, Tooltip, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import {
  coreAlert,
  historyPush,
  journalize,
  parseData,
  useHistory,
  useModulesManager,
  useTranslations,
} from '@openimis/fe-core';
import { acquireGenericVoucher, fetchMutation, genericVoucherValidation } from '../actions';
import {
  MODULE_NAME, REF_ROUTE_BILL, USER_ECONOMIC_UNIT_STORAGE_KEY, VOUCHER_QUANTITY_THRESHOLD,
} from '../constants';
import { payWithMPay } from '../utils/utils';
import AcquirementGenericVoucherForm from './AcquirementGenericVoucherForm';
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

function VoucherAcquirementGenericVoucher() {
  const prevSubmittingMutationRef = useRef();
  const modulesManager = useModulesManager();
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [voucherAcquirement, setVoucherAcquirement] = useState({});
  const [acquirementSummary, setAcquirementSummary] = useState({});
  const [acquirementSummaryLoading, setAcquirementSummaryLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { mutation, submittingMutation } = useSelector((state) => state.workerVoucher);
  const { economicUnit } = useSelector((state) => state.policyHolder);

  const acquirementBlocked = (voucherAcquirement) => !voucherAcquirement?.quantity
  || voucherAcquirement?.quantity > VOUCHER_QUANTITY_THRESHOLD;

  const onVoucherAcquire = async () => {
    setIsPaymentModalOpen((prevState) => !prevState);
    setAcquirementSummaryLoading(true);
    try {
      const { payload } = await dispatch(
        genericVoucherValidation(voucherAcquirement?.employer?.code, voucherAcquirement?.quantity),
      );
      setAcquirementSummary(payload);
    } catch (error) {
      throw new Error(`[VOUCHER_ACQUIREMENT_GENERIC_VOUCHER]: Validation error. ${error}`);
    } finally {
      setAcquirementSummaryLoading(false);
    }
  };

  const onPaymentConfirmation = async () => {
    setIsPaymentLoading(true);
    try {
      const { payload } = await dispatch(
        acquireGenericVoucher(
          voucherAcquirement?.employer?.code,
          voucherAcquirement?.quantity,
          'Acquire Generic Voucher',
        ),
      );

      const { clientMutationId } = payload.data.acquireUnassignedVouchers;
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
      historyPush(modulesManager, history, REF_ROUTE_BILL, [billId]);
    } catch (error) {
      throw new Error(`[VOUCHER_ACQUIREMENT_GENERIC_VOUCHER]: Acquirement error. ${error}`);
    } finally {
      setIsPaymentLoading(false);
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

      setVoucherAcquirement((prevState) => ({ ...prevState, employer: userEconomicUnit, quantity: 0 }));
    }
  }, [setVoucherAcquirement, economicUnit]);

  return (
    <>
      <Grid xs={12}>
        <Grid container className={classes.paperHeaderTitle}>
          <Typography variant="h5">{formatMessage('workerVoucher.acquirement.method.GENERIC_VOUCHER')}</Typography>
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
        isLoading={acquirementSummaryLoading || isPaymentLoading}
        acquirementSummary={acquirementSummary}
        type="acquireUnassignedValidation"
      />
    </>
  );
}

export default VoucherAcquirementGenericVoucher;
