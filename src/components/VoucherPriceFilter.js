import React from 'react';

import { Grid, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { PublishedComponent } from '@openimis/fe-core';

export const useStyles = makeStyles((theme) => ({
  item: theme.paper.item,
}));

function VoucherPriceFilter({ filters, onChangeFilters, formatMessage }) {
  const classes = useStyles();

  const filterValue = (filterName) => filters?.[filterName]?.value;

  return (
    <>
      <Grid xs={12}>
        <Typography variant="subtitle1" style={{ padding: '4px' }}>
          {formatMessage('workerVoucher.priceManagement.tip')}
        </Typography>
        <Divider />
      </Grid>
      <Grid container className={classes.form}>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="workerVoucher"
            label="filter.date"
            value={filterValue('date')}
            // TODO: Adjust filters
            onChange={(date) => onChangeFilters([
              {
                id: 'date',
                value: date,
                filter: `date: "${date}"`,
              },
            ])}
          />
        </Grid>
      </Grid>
    </>

  );
}

export default VoucherPriceFilter;
