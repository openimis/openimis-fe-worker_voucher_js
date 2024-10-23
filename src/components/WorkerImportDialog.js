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

import { useModulesManager, useTranslations, InfoButton } from '@openimis/fe-core';
import { MODULE_NAME, WORKER_IMPORT_GROUP_OF_WORKERS, WORKER_IMPORT_PLANS } from '../constants';
import GroupPicker from '../pickers/GroupPicker';

export const useStyles = makeStyles((theme) => ({
  primaryButton: theme.dialog.primaryButton,
  secondaryButton: theme.dialog.secondaryButton,
  dialogTitle: {
    display: 'flex',
    gap: '4px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

function WorkerImportDialog({
  open, onClose, importPlan, setImportPlan, onConfirm, handleGroupChange, currentGroup,
}) {
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const radioGroupRef = React.useRef(null);

  const importDisabled = !importPlan || (importPlan === WORKER_IMPORT_GROUP_OF_WORKERS && !currentGroup);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>
        <div className={classes.dialogTitle}>
          {formatMessage('workerVoucher.workerImport.title')}
          <InfoButton content={formatMessage('workerVoucher.WorkerImportDialog.moreInfo')} />
        </div>
      </DialogTitle>
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
            <>
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio color="primary" />}
                label={formatMessage(labelKey)}
              />
              {importPlan === WORKER_IMPORT_GROUP_OF_WORKERS && <GroupPicker onChange={handleGroupChange} />}
            </>
          ))}
        </RadioGroup>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} className={classes.secondaryButton}>
          {formatMessage('workerVoucher.workerImport.cancel')}
        </Button>
        <Button onClick={onConfirm} autoFocus className={classes.primaryButton} disabled={importDisabled}>
          {formatMessage('workerVoucher.workerImport.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default WorkerImportDialog;
