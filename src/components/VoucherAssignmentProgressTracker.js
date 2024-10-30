import React, {
  useEffect, useRef, useState, useCallback,
} from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import _debounce from 'lodash/debounce';

import { CircularProgress, Grid, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { makeStyles } from '@material-ui/styles';

import { useToast, useTranslations } from '@openimis/fe-core';
import { createOrUpdateVoucherDraftForm } from '../actions';
import { DEFAULT_DEBOUNCE_TIME, MODULE_NAME } from '../constants';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    gap: '4px',
    padding: theme.spacing(1),
  },
}));

function VoucherAssignmentProgressTracker({ voucherAssignment }) {
  const prevVoucherAssignment = useRef();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { showError } = useToast();
  const { formatMessage } = useTranslations(MODULE_NAME);
  const [isSaving, setIsSaving] = useState(false);

  const saveAssignmentDraft = useCallback(
    _debounce(async (voucherAssignment) => {
      try {
        await dispatch(createOrUpdateVoucherDraftForm(voucherAssignment, 'Save Assignment Draft'));
      } catch (error) {
        showError('[ERROR]: Error while saving the progress.');
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        setIsSaving(false);
      }
    }, DEFAULT_DEBOUNCE_TIME * 2),
    [dispatch, showError],
  );

  useEffect(() => {
    if (
      !_.isEqual(voucherAssignment, prevVoucherAssignment.current)
      && !_.isEmpty(voucherAssignment)
    ) {
      setIsSaving(true);
      prevVoucherAssignment.current = voucherAssignment;
      saveAssignmentDraft(voucherAssignment);
    }
  }, [voucherAssignment, saveAssignmentDraft]);

  return (
    <Grid className={classes.container}>
      {isSaving ? (
        <>
          <CircularProgress size={16} thickness={5} />
          <Typography variant="body2">{formatMessage('VoucherAssignmentProgressTracker.saving')}</Typography>
        </>
      ) : (
        <>
          <CheckCircleIcon color="primary" fontSize="small" />
          <Typography variant="body2">{formatMessage('VoucherAssignmentProgressTracker.upToDate')}</Typography>
        </>
      )}
    </Grid>
  );
}

export default VoucherAssignmentProgressTracker;
