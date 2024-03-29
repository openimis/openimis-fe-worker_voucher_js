import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Divider, Grid, Typography, Button, Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import {
  useModulesManager, useTranslations, journalize, useHistory, historyPush,
} from '@openimis/fe-core';
import { specificVoucherValidation, acquireSpecificVoucher } from '../actions';
import { MODULE_NAME, REF_ROUTE_WORKER_VOUCHERS, USER_ECONOMIC_UNIT_STORAGE_KEY } from '../constants';
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
  const history = useHistory();
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
      const { payload } = await dispatch(specificVoucherValidation(
        voucherAcquirement?.employer?.code,
        voucherAcquirement?.workers,
        voucherAcquirement?.dateRanges,
      ));
      setAcquirementSummary(payload);
    } catch (error) {
      throw new Error(`[VOUCHER_ACQUIREMENT_SPECIFIC_VOUCHER]: Validation error. ${error}`);
    } finally {
      setAcquirementSummaryLoading(false);
    }
  };

  const onPaymentConfirmation = async () => {
    try {
      await dispatch(acquireSpecificVoucher(
        voucherAcquirement?.employer?.code,
        voucherAcquirement?.workers,
        voucherAcquirement?.dateRanges,
        'Acquire Specific Voucher',
      ));
    } catch (error) {
      throw new Error(`[VOUCHER_ACQUIREMENT_SPECIFIC_VOUCHER]: Acquirement error. ${error}`);
    }

    historyPush(modulesManager, history, REF_ROUTE_WORKER_VOUCHERS);
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
        isLoading={acquirementSummaryLoading}
        acquirementSummary={acquirementSummary}
        type="acquireAssignedValidation"
      />
    </>
  );
}

export default VoucherAcquirementSpecificWorker;
