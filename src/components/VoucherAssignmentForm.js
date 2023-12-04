import React, { useState, useEffect } from 'react';

import {
  Divider, Grid, Paper, Typography, Button, Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useModulesManager, useTranslations } from '@openimis/fe-core';
import { MODULE_NAME, USER_ECONOMIC_UNIT_STORAGE_KEY } from '../constants';
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
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [voucherAssignment, setVoucherAssignment] = useState({});
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const assignmentBlocked = (voucherAssignment) => !voucherAssignment?.workers?.length
  || !voucherAssignment?.dateRanges?.length;

  const onVoucherAssign = () => {
    setIsConfirmationModalOpen((prevState) => !prevState);
    // TODO: Fetch info about assignment (assignmentSummary)
  };

  const onAssignmentConfirmation = () => {
    // TODO: After summary fetch, assign vouchers to the Workers.
    setIsConfirmationModalOpen((prevState) => !prevState);
    console.log('Assign Vouchers to the Workers');
  };

  useEffect(() => {
    const storedUserEconomicUnit = localStorage.getItem(USER_ECONOMIC_UNIT_STORAGE_KEY);

    if (storedUserEconomicUnit) {
      const userEconomicUnit = JSON.parse(storedUserEconomicUnit);

      setVoucherAssignment((prevState) => ({ ...prevState, employer: userEconomicUnit }));
    }
  }, [setVoucherAssignment]);

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
            // TODO: Change after BE implementation
            isLoading={false}
            error={false}
            assignmentSummary={{
              vouchers: 100,
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default VoucherAssignmentForm;
