import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MenuItem, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { SelectDialog, journalize, useTranslations } from '@openimis/fe-core';
import { deleteWorkersFromEconomicUnit } from '../actions';
import { MODULE_NAME } from '../constants';

const useStyles = makeStyles(() => ({
  uppercase: {
    textTransform: 'uppercase',
  },
}));

function WorkerSearcherSelectActions({
  selection: selectedWorkers,
  refetch: refetchWorkers,
  clearSelected,
  withSelection,
}) {
  const prevSubmittingMutationRef = useRef();
  const prevEconomicUnitRef = useRef();
  const [isBulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const { economicUnit } = useSelector((state) => state.policyHolder);
  const { mutation, submittingMutation } = useSelector((state) => state.workerVoucher);
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
      setBulkDeleteDialogOpen(false);
    }
  };

  const onBulkDeleteClose = () => setBulkDeleteDialogOpen(false);

  useEffect(() => {
    if (prevEconomicUnitRef.current !== undefined && prevEconomicUnitRef.current !== economicUnit) {
      if (selectedWorkers.length) {
        clearSelected();
      }
    }

    prevEconomicUnitRef.current = economicUnit;
  }, [economicUnit, selectedWorkers, clearSelected]);

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      dispatch(journalize(mutation));
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  if (!withSelection) {
    return null;
  }

  return (
    <>
      <Tooltip title={formatMessage('workerVoucher.tooltip.bulkDelete')}>
        <MenuItem onClick={setBulkDeleteDialogOpen} disabled={!isWorkerSelected}>
          <span className={classes.uppercase}>{formatMessage('workerVoucher.WorkerSearcherSelectActions.delete')}</span>
        </MenuItem>
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
