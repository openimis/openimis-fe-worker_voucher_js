import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  RadioGroup,
  DialogTitle,
  Divider,
  Radio,
  FormControlLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useModulesManager, useTranslations } from '@openimis/fe-core';
import { MODULE_NAME, WORKER_IMPORT_PLANS } from '../constants';

export const useStyles = makeStyles((theme) => ({
  primaryButton: theme.dialog.primaryButton,
  secondaryButton: theme.dialog.secondaryButton,
}));

function WorkerImportDialog({
  open, onClose, importPlan, setImportPlan, onConfirm,
}) {
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const radioGroupRef = React.useRef(null);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>{formatMessage('workerVoucher.workerImport.title')}</DialogTitle>
      <Divider />
      <DialogContent>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="importPlan"
          name="importPlan"
          value={importPlan}
          onChange={(event) => setImportPlan(event.target.value)}
        >
          {WORKER_IMPORT_PLANS.map(({ value, labelKey }) => (
            <FormControlLabel
              key={value}
              value={value}
              control={<Radio color="primary" />}
              label={formatMessage(labelKey)}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} className={classes.secondaryButton}>
          {formatMessage('workerVoucher.workerImport.cancel')}
        </Button>
        <Button onClick={onConfirm} autoFocus className={classes.primaryButton}>
          {formatMessage('workerVoucher.workerImport.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default WorkerImportDialog;
