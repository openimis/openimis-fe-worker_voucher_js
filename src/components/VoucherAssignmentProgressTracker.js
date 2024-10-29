import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/styles';
import _ from 'lodash';

import { Grid, CircularProgress, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import { useTranslations } from '@openimis/fe-core';
import { MODULE_NAME } from '../constants';

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
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!_.isEqual(voucherAssignment, prevVoucherAssignment.current)) {
      setIsSaving(true);
      prevVoucherAssignment.current = voucherAssignment;

      // TODO: After BE integration, call the API to save the voucher assignment
      setTimeout(() => {
        setIsSaving(false);
      }, 1500);
    }
  }, [voucherAssignment]);

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
