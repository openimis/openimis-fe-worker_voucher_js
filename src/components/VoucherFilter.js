import React from 'react';
import _debounce from 'lodash/debounce';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { PublishedComponent, TextInput } from '@openimis/fe-core';
import { CONTAINS_LOOKUP, DEFAULT_DEBOUNCE_TIME, EMPTY_STRING } from '../constants';
import WorkerVoucherStatusPicker from '../pickers/WorkerVoucherStatusPicker';

export const useStyles = makeStyles((theme) => ({
  form: {
    padding: '0 0 10px 0',
    width: '100%',
  },
  item: {
    padding: theme.spacing(1),
  },
}));

function VoucherFilter({ filters, onChangeFilters, formatMessage }) {
  const classes = useStyles();

  const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFAULT_DEBOUNCE_TIME);

  const filterValue = (filterName) => filters?.[filterName]?.value;
  const filterTextFieldValue = (filterName) => filters?.[filterName]?.value ?? EMPTY_STRING;

  const onChangeStringFilter = (filterName, lookup = null) => (value) => {
    if (lookup) {
      debouncedOnChangeFilters([
        {
          id: filterName,
          value,
          filter: `${filterName}_${lookup}: "${value}"`,
        },
      ]);
    } else {
      onChangeFilters([
        {
          id: filterName,
          value,
          filter: `${filterName}: "${value}"`,
        },
      ]);
    }
  };

  return (
    <Grid container className={classes.form}>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="workerVoucher"
          label="workerVoucher.code"
          value={filterTextFieldValue('code')}
          onChange={onChangeStringFilter('code', CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <WorkerVoucherStatusPicker
          value={filterValue('status')}
          nullLabel={formatMessage('workerVoucher.placeholder.any')}
          withLabel
          withNull
          onChange={(status) => onChangeFilters([
            {
              id: 'status',
              status,
              filter: `status: ${status}`,
            },
          ])}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="workerVoucher"
          label="workerVoucher.assignedDate"
          value={filterValue('assignedDate')}
          onChange={(assignedDate) => onChangeFilters([
            {
              id: 'assignedDate',
              value: assignedDate,
              filter: `assignedDate: "${assignedDate}"`,
            },
          ])}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="workerVoucher"
          label="workerVoucher.expiryDate"
          value={filterValue('expiryDate')}
          onChange={(expiryDate) => onChangeFilters([
            {
              id: 'expiryDate',
              value: expiryDate,
              filter: `expiryDate: "${expiryDate}"`,
            },
          ])}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="workerVoucher"
          label="workerVoucher.employer.code"
          value={filterTextFieldValue('policyholder_Code')}
          onChange={onChangeStringFilter('policyholder_Code', CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="workerVoucher"
          label="workerVoucher.employer.tradename"
          value={filterTextFieldValue('policyholder_TradeName')}
          onChange={onChangeStringFilter('policyholder_TradeName', CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="workerVoucher"
          label="workerVoucher.worker.code"
          value={filterTextFieldValue('insuree_ChfId')}
          onChange={onChangeStringFilter('insuree_ChfId', CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="workerVoucher"
          label="workerVoucher.worker.lastName"
          value={filterTextFieldValue('insuree_LastName')}
          onChange={onChangeStringFilter('insuree_LastName', CONTAINS_LOOKUP)}
        />
      </Grid>
    </Grid>
  );
}

export default VoucherFilter;
