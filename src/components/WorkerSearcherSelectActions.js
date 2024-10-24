import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  MenuItem, Tooltip, Typography, Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import DeleteIcon from '@material-ui/icons/Delete';

import { SelectDialog, useTranslations } from '@openimis/fe-core';
import { deleteWorkersFromEconomicUnit } from '../actions';
import { MODULE_NAME } from '../constants';

const useStyles = makeStyles((theme) => ({
  uppercase: {
    textTransform: 'uppercase',
  },
  trigger: {
    marginLeft: theme.spacing(1),
  },
}));

function WorkerSearcherSelectActions({
  selection: selectedWorkers,
  refetch: refetchWorkers,
  clearSelected,
  withSelection,
  downloadWithIconButton = false,
}) {
  const prevEconomicUnitRef = useRef();
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const { economicUnit } = useSelector((state) => state.policyHolder);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME);
  const isWorkerSelected = !!selectedWorkers.length;

  const onBulkDeleteConfirm = async () => {
    try {
      await dispatch(deleteWorkersFromEconomicUnit(economicUnit, selectedWorkers, 'Bulk Delete Workers'));
      refetchWorkers();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('[WORKER_SEARCHER_SELECT_ACTIONS]: Bulk delete failed.', error);
    } finally {
      setIsBulkDeleteDialogOpen(false);
    }
  };

  const onBulkDeleteClose = () => setIsBulkDeleteDialogOpen(false);

  useEffect(() => {
    if (prevEconomicUnitRef.current !== undefined && prevEconomicUnitRef.current !== economicUnit) {
      if (selectedWorkers.length) {
        clearSelected();
      }
    }

    prevEconomicUnitRef.current = economicUnit;
  }, [economicUnit, selectedWorkers, clearSelected]);

  if (!withSelection) {
    return null;
  }

  return (
    <>
      <Tooltip title={formatMessage('workerVoucher.tooltip.bulkDelete')}>
        {downloadWithIconButton ? (
          <Button
            onClick={setIsBulkDeleteDialogOpen}
            disabled={!isWorkerSelected}
            variant="contained"
            color="primary"
            startIcon={<DeleteIcon />}
            className={classes.trigger}
          >
            <Typography variant="body2">{formatMessage('workerVoucher.WorkerSearcherSelectActions.delete')}</Typography>
          </Button>
        ) : (
          <MenuItem onClick={setIsBulkDeleteDialogOpen} disabled={!isWorkerSelected}>
            <span className={classes.uppercase}>
              {formatMessage('workerVoucher.WorkerSearcherSelectActions.delete')}
            </span>
          </MenuItem>
        )}
      </Tooltip>
      <SelectDialog
        module={MODULE_NAME}
        confirmState={isBulkDeleteDialogOpen}
        onConfirm={onBulkDeleteConfirm}
        onClose={onBulkDeleteClose}
        confirmTitle="workerVoucher.WorkerSearcherSelectActions.dialog.title"
        confirmMessageWithValues="workerVoucher.WorkerSearcherSelectActions.dialog.message"
        translationVariables={{ count: selectedWorkers.length }}
        confirmationButton="workerVoucher.WorkerSearcherSelectActions.dialog.confirm"
        rejectionButton="workerVoucher.WorkerSearcherSelectActions.dialog.abandon"
      />
    </>
  );
}

export default WorkerSearcherSelectActions;
