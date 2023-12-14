import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  CircularProgress,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import {
  useTranslations, useModulesManager, NumberInput, AmountInput,
} from '@openimis/fe-core';
import { MODULE_NAME } from '../constants';

export const useStyles = makeStyles((theme) => ({
  primaryButton: theme.dialog.primaryButton,
  secondaryButton: theme.dialog.secondaryButton,
  item: theme.paper.item,
}));

function VoucherAssignmentConfirmModal({
  openState,
  onClose,
  onConfirm,
  isLoading,
  assignmentSummary,
  readOnly = true,
}) {
  const classes = useStyles();
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [acceptAssignment, setAcceptAssignment] = useState(false);
  const acquireButtonDisabled = !acceptAssignment || isLoading || assignmentSummary?.errors;

  const renderContent = () => {
    if (isLoading) {
      return <CircularProgress />;
    }

    if (assignmentSummary?.errors) {
      return (
        <Typography color="error">
          {assignmentSummary?.errors?.map(({ message }, index) => `${index + 1}. ${message}.`)}
        </Typography>
      );
    }

    return (
      <Grid container>
        <Grid xs={4} className={classes.item}>
          <NumberInput
            module="workerVoucher"
            label="workerVoucher.vouchersQuantity"
            value={assignmentSummary?.data?.assignVouchersValidation?.count}
            readOnly={readOnly}
          />
        </Grid>
        <Grid xs={4} className={classes.item}>
          <AmountInput
            module="workerVoucher"
            label="workerVoucher.pricePerVoucher"
            value={assignmentSummary?.data?.assignVouchersValidation?.pricePerVoucher}
            readOnly={readOnly}
            displayZero
          />
        </Grid>
        <Grid xs={4} className={classes.item}>
          <AmountInput
            module="workerVoucher"
            label="workerVoucher.toBePaid"
            value={assignmentSummary?.data?.assignVouchersValidation?.price}
            readOnly={readOnly}
            displayZero
          />
        </Grid>
        <FormControlLabel
          style={{ margin: '12px 0 0 0' }}
          control={(
            <Checkbox
              color="primary"
              checked={acceptAssignment}
              onChange={(e) => setAcceptAssignment(e.target.checked)}
            />
          )}
          label={formatMessage('workerVoucher.assign.confirmation')}
        />
      </Grid>
    );
  };

  return (
    <Dialog open={openState} onClose={onClose}>
      <DialogTitle>{formatMessage('workerVoucher.VoucherAssignmentConfirmModal.title')}</DialogTitle>
      <Divider />
      <DialogContent>{renderContent()}</DialogContent>
      <Divider style={{ margin: '12px 0' }} />
      <DialogActions>
        <Button onClick={onClose} className={classes.secondaryButton}>
          {formatMessage('workerVoucher.close')}
        </Button>
        {acquireButtonDisabled ? (
          <Tooltip title={formatMessage('workerVoucher.VoucherAssignmentConfirmModal.confirm.tooltip')}>
            <span>
              <Button onClick={onConfirm} autoFocus className={classes.primaryButton} disabled={acquireButtonDisabled}>
                {formatMessage('workerVoucher.VoucherAssignmentConfirmModal.confirm')}
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Button onClick={onConfirm} autoFocus className={classes.primaryButton} disabled={acquireButtonDisabled}>
            {formatMessage('workerVoucher.VoucherAssignmentConfirmModal.confirm')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default VoucherAssignmentConfirmModal;
