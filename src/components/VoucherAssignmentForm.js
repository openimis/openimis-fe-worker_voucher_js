import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Divider, Grid, Paper, Typography, Button, Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import {
  useModulesManager, useTranslations, journalize, historyPush, useHistory,
} from '@openimis/fe-core';
import { assignVouchers, voucherAssignmentValidation } from '../actions';
import { MODULE_NAME, REF_ROUTE_WORKER_VOUCHERS, USER_ECONOMIC_UNIT_STORAGE_KEY } from '../constants';
import AssignmentVoucherForm from './AssignmentVoucherForm';
import VoucherAssignmentConfirmModal from './VoucherAssignmentConfirmModal';

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

function VoucherAssignmentForm() {
  const prevSubmittingMutationRef = useRef();
  const modulesManager = useModulesManager();
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [voucherAssignment, setVoucherAssignment] = useState({});
  const [assignmentSummary, setAssignmentSummary] = useState({});
  const [assignmentSummaryLoading, setAssignmentSummaryLoading] = useState(false);
  const [isAssignmentLoading, setIsAssignmentLoading] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const { mutation, submittingMutation } = useSelector((state) => state.workerVoucher);
  const { economicUnit } = useSelector((state) => state.policyHolder);

  const assignmentBlocked = (voucherAssignment) => !voucherAssignment?.workers?.length
  || !voucherAssignment?.dateRanges?.length;

  const onVoucherAssign = async () => {
    setIsConfirmationModalOpen((prevState) => !prevState);
    setAssignmentSummaryLoading(true);
    try {
      const { payload } = await dispatch(voucherAssignmentValidation(
        voucherAssignment?.employer?.code,
        voucherAssignment?.workers,
        voucherAssignment?.dateRanges,
      ));
      setAssignmentSummary(payload);
    } catch (error) {
      throw new Error(`[VOUCHER_ASSIGNMENT]: Validation error. ${error}`);
    } finally {
      setAssignmentSummaryLoading(false);
    }
  };

  const onAssignmentConfirmation = async () => {
    setIsAssignmentLoading(true);
    try {
      await dispatch(assignVouchers(
        voucherAssignment?.employer?.code,
        voucherAssignment?.workers,
        voucherAssignment?.dateRanges,
        'Assign Vouchers',
      ));
      historyPush(modulesManager, history, REF_ROUTE_WORKER_VOUCHERS);
    } catch (error) {
      throw new Error(`[ASSIGN_VOUCHERS]: Assignment error. ${error}`);
    } finally {
      setIsAssignmentLoading(false);
    }

    setIsConfirmationModalOpen((prevState) => !prevState);
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

      setVoucherAssignment((prevState) => ({
        ...prevState, employer: userEconomicUnit, workers: [], dateRanges: [],
      }));
    }
  }, [setVoucherAssignment, economicUnit]);

  return (
    <Grid container>
      <Grid xs={12}>
        <Paper className={classes.paper}>
          <Grid xs={12}>
            <Grid container className={classes.paperHeaderTitle}>
              <Typography variant="h5">{formatMessage('workerVoucher.menu.voucherAssignment')}</Typography>
              <Tooltip
                title={
                  assignmentBlocked(voucherAssignment)
                    ? formatMessage('workerVoucher.vouchers.required')
                    : formatMessage('workerVoucher.assign.vouchers')
                }
              >
                <span>
                  <Button
                    variant="outlined"
                    style={{ border: 0 }}
                    onClick={onVoucherAssign}
                    disabled={assignmentBlocked(voucherAssignment)}
                  >
                    <Typography variant="subtitle1">{formatMessage('workerVoucher.assign.voucher')}</Typography>
                  </Button>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
          <Divider />
          <AssignmentVoucherForm
            edited={voucherAssignment}
            onEditedChange={setVoucherAssignment}
            formatMessage={formatMessage}
            classes={classes}
          />
          <VoucherAssignmentConfirmModal
            openState={isConfirmationModalOpen}
            onClose={() => setIsConfirmationModalOpen((prevState) => !prevState)}
            onConfirm={onAssignmentConfirmation}
            isLoading={assignmentSummaryLoading || isAssignmentLoading}
            assignmentSummary={assignmentSummary}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default VoucherAssignmentForm;
