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
  useTranslations, useModulesManager, AmountInput,
} from '@openimis/fe-core';
import { MODULE_NAME } from '../constants';

export const useStyles = makeStyles((theme) => ({
  primaryButton: theme.dialog.primaryButton,
  secondaryButton: theme.dialog.secondaryButton,
  item: theme.paper.item,
}));

function VoucherAcquirementPaymentModal({
  type,
  openState,
  onClose,
  onConfirm,
  isLoading,
  acquirementSummary,
  readOnly = true,
}) {
  const classes = useStyles();
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [acceptAcquirement, setAcceptAcquirement] = useState(false);
  const acquireButtonDisabled = !acceptAcquirement || isLoading || acquirementSummary?.errors;

  const renderContent = () => {
    if (isLoading) {
      return <CircularProgress />;
    }

    if (acquirementSummary?.errors) {
      return (
        <Typography color="error">
          {acquirementSummary?.errors?.map(({ message }, index) => `${index + 1}. ${message}.`)}
        </Typography>
      );
    }

    return (
      <Grid container>
        <Grid xs={4} className={classes.item}>
          <AmountInput
            module="workerVoucher"
            label="workerVoucher.vouchersQuantity"
            value={acquirementSummary?.data?.[type]?.count}
            readOnly={readOnly}
          />
        </Grid>
        <Grid xs={4} className={classes.item}>
          <AmountInput
            module="workerVoucher"
            label="workerVoucher.pricePerVoucher"
            value={acquirementSummary?.data?.[type]?.pricePerVoucher}
            readOnly={readOnly}
            displayZero
          />
        </Grid>
        <Grid xs={4} className={classes.item}>
          <AmountInput
            module="workerVoucher"
            label="workerVoucher.toBePaid"
            value={acquirementSummary?.data?.[type]?.price}
            readOnly={readOnly}
            displayZero
          />
        </Grid>
        <FormControlLabel
          style={{ margin: '12px 0 0 0' }}
          control={(
            <Checkbox
              color="primary"
              checked={acceptAcquirement}
              onChange={(e) => setAcceptAcquirement(e.target.checked)}
            />
          )}
          label={formatMessage('workerVoucher.acquire.confirmation')}
        />
      </Grid>
    );
  };

  return (
    <Dialog open={openState} onClose={onClose}>
      <DialogTitle>{formatMessage('workerVoucher.VoucherAcquirementPaymentModal.title')}</DialogTitle>
      <Divider />
      <DialogContent>{renderContent()}</DialogContent>
      <Divider style={{ margin: '12px 0' }} />
      <DialogActions>
        <Button onClick={onClose} className={classes.secondaryButton}>
          {formatMessage('workerVoucher.close')}
        </Button>
        {acquireButtonDisabled ? (
          <Tooltip title={formatMessage('workerVoucher.VoucherAcquirementPaymentModal.confirm.tooltip')}>
            <span>
              <Button onClick={onConfirm} autoFocus className={classes.primaryButton} disabled={acquireButtonDisabled}>
                {formatMessage('workerVoucher.VoucherAcquirementPaymentModal.confirm')}
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Button onClick={onConfirm} autoFocus className={classes.primaryButton} disabled={acquireButtonDisabled}>
            {formatMessage('workerVoucher.VoucherAcquirementPaymentModal.confirm')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default VoucherAcquirementPaymentModal;
