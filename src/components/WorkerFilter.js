import React from 'react';
import _debounce from 'lodash/debounce';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { TextInput } from '@openimis/fe-core';
import { CONTAINS_LOOKUP, DEFAULT_DEBOUNCE_TIME, EMPTY_STRING } from '../constants';

export const useStyles = makeStyles((theme) => ({
  form: {
    padding: '0 0 10px 0',
    width: '100%',
  },
  item: {
    padding: theme.spacing(1),
  },
}));

function WorkerFilter({ filters, onChangeFilters }) {
  const classes = useStyles();

  const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFAULT_DEBOUNCE_TIME);

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
      <Grid item xs={4} className={classes.item}>
        <TextInput
          module="workerVoucher"
          label="workerVoucher.worker.chfId"
          value={filterTextFieldValue('chfId')}
          onChange={onChangeStringFilter('chfId', CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={4} className={classes.item}>
        <TextInput
          module="workerVoucher"
          label="workerVoucher.worker.lastName"
          value={filterTextFieldValue('lastName')}
          onChange={onChangeStringFilter('lastName', CONTAINS_LOOKUP)}
        />
      </Grid>
      <Grid item xs={4} className={classes.item}>
        <TextInput
          module="workerVoucher"
          label="workerVoucher.worker.otherNames"
          value={filterTextFieldValue('otherNames')}
          onChange={onChangeStringFilter('otherNames', CONTAINS_LOOKUP)}
        />
      </Grid>
    </Grid>
  );
}

export default WorkerFilter;
