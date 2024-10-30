import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import {
  Button, Divider, Grid, Paper, Tooltip, Typography,
} from '@material-ui/core';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import { makeStyles } from '@material-ui/styles';

import {
  InfoButton,
  coreAlert,
  historyPush,
  useHistory,
  useModulesManager,
  useTranslations,
  parseData,
} from '@openimis/fe-core';
import {
  assignVouchers, deleteVoucherDraftForm, fetchVoucherDraftForm, voucherAssignmentValidation,
} from '../actions';
import { MODULE_NAME, REF_ROUTE_WORKER_VOUCHERS } from '../constants';
import AssignmentVoucherForm from './AssignmentVoucherForm';
import VoucherAssignmentConfirmModal from './VoucherAssignmentConfirmModal';
import VoucherAssignmentProgressTracker from './VoucherAssignmentProgressTracker';

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
  listItem: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(0.5),
    backgroundColor: theme.palette.background.paper,
  },
  infoSection: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

function VoucherAssignmentForm() {
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
  const { economicUnit } = useSelector((state) => state.policyHolder);
  const prevEconomicUnitRef = useRef();

  const assignmentBlocked = (voucherAssignment) => !voucherAssignment?.workers?.length
  || !voucherAssignment?.dateRanges?.length;

  const onVoucherAssign = async () => {
    setIsConfirmationModalOpen((prevState) => !prevState);
    setAssignmentSummaryLoading(true);
    try {
      const { payload } = await dispatch(
        voucherAssignmentValidation(
          voucherAssignment?.employer?.code,
          voucherAssignment?.workers,
          voucherAssignment?.dateRanges,
        ),
      );
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
      await dispatch(
        assignVouchers(
          voucherAssignment?.employer?.code,
          voucherAssignment?.workers,
          voucherAssignment?.dateRanges,
          'Assign Vouchers',
        ),
      );
      await dispatch(deleteVoucherDraftForm(economicUnit, 'Delete Voucher Draft'));
      historyPush(modulesManager, history, REF_ROUTE_WORKER_VOUCHERS);
      dispatch(
        coreAlert(
          formatMessage('menu.voucherAssignmentSuccess'),
          formatMessage('workerVoucher.VoucherAssignmentForm.assignmentConfirmation'),
        ),
      );
    } catch (error) {
      throw new Error(`[ASSIGN_VOUCHERS]: Assignment error. ${error}`);
    } finally {
      setIsAssignmentLoading(false);
    }

    setIsConfirmationModalOpen((prevState) => !prevState);
  };

  useEffect(async () => {
    if (_.isEqual(economicUnit, prevEconomicUnitRef.current)) {
      return;
    }

    try {
      const response = await dispatch(fetchVoucherDraftForm(modulesManager, economicUnit.code));

      if (response.error) {
        // eslint-disable-next-line no-console
        console.error(`[ERROR]: Error while fetching voucher draft form. ${response.error}`);
      }

      const voucherFormDraft = parseData(response.payload.data.voucherFormDraft)?.[0];

      if (!voucherFormDraft) {
        setVoucherAssignment(() => ({
          employer: economicUnit,
          workers: [],
          dateRanges: [],
        }));
        return;
      }

      setVoucherAssignment(() => ({
        employer: voucherFormDraft.policyholder,
        workers: voucherFormDraft.workers,
        dateRanges: voucherFormDraft.dateRanges,
      }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`[ERROR]: Error during assignment init. ${error}`);
    }
  }, [setVoucherAssignment, economicUnit]);

  return (
    <Grid container>
      <Grid xs={12}>
        <Paper className={classes.paper}>
          <Grid xs={12}>
            <Grid container className={classes.paperHeaderTitle}>
              <div className={classes.infoSection}>
                <InfoButton
                  content={formatMessage('VoucherAssignmentForm.form.moreInfo')}
                  iconSize="large"
                  maxWidth="large"
                />
                <Typography variant="h5">{formatMessage('workerVoucher.menu.voucherAssignment')}</Typography>
              </div>
              <Tooltip
                title={
                  assignmentBlocked(voucherAssignment)
                    ? formatMessage('workerVoucher.vouchers.required')
                    : formatMessage('workerVoucher.assign.vouchers')
                }
              >
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AssignmentIndIcon />}
                    onClick={onVoucherAssign}
                    disabled={assignmentBlocked(voucherAssignment)}
                  >
                    <Typography variant="body2">{formatMessage('workerVoucher.assign.voucher')}</Typography>
                  </Button>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
          <Divider />
          <VoucherAssignmentProgressTracker voucherAssignment={voucherAssignment} />
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
