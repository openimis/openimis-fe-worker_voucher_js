import React from 'react';
import _debounce from 'lodash/debounce';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { PublishedComponent, TextInput } from '@openimis/fe-core';
import {
  DATE_TIME_SUFFIX, DEFAULT_DEBOUNCE_TIME, EMPTY_STRING, STARTS_WITH_LOOKUP,
} from '../constants';

export const useStyles = makeStyles((theme) => ({
  item: theme.paper.item,
}));

function VoucherPriceFilter({ filters, onChangeFilters }) {
  const classes = useStyles();

  const debouncedOnChangeFilters = _debounce(onChangeFilters, DEFAULT_DEBOUNCE_TIME);

  const filterValue = (filterName) => filters?.[filterName]?.value;
  const filterTextFieldValue = (filterName) => filters?.[filterName]?.value ?? EMPTY_STRING;

  return (
    <Grid container className={classes.form}>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="workerVoucher"
          label="searcher.price"
          value={filterTextFieldValue('value')}
          onChange={(price) => debouncedOnChangeFilters([
            {
              id: 'value',
              value: price,
              filter: `value_${STARTS_WITH_LOOKUP}: "${price}"`,
            },
          ])}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="workerVoucher"
          label="validFrom"
          value={filterValue('dateValidFrom_Gte')}
          onChange={(validFrom) => onChangeFilters([
            {
              id: 'dateValidFrom_Gte',
              value: validFrom,
              filter: `dateValidFrom_Gte: "${validFrom}${DATE_TIME_SUFFIX}"`,
            },
          ])}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          module="workerVoucher"
          label="validTo"
          value={filterValue('dateValidTo_Lte')}
          onChange={(validTo) => onChangeFilters([
            {
              id: 'dateValidTo_Lte',
              value: validTo,
              filter: `dateValidTo_Lte: "${validTo}${DATE_TIME_SUFFIX}"`,
            },
          ])}
        />
      </Grid>
    </Grid>

  );
}

export default VoucherPriceFilter;
