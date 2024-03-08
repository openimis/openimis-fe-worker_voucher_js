import React from 'react';

import { Grid, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import {
  FormattedMessage, PublishedComponent, NumberInput, TextInput,
} from '@openimis/fe-core';
import MPayBillButton from './MPayBillButton';

const useStyles = makeStyles((theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: '100%',
  },
}));

function BillVoucherHeadPanel({ bill }) {
  const classes = useStyles();
  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="center" className={classes.tableTitle}>
        <Grid item>
          <Grid>
            <Grid item>
              <Typography>
                <FormattedMessage module="invoice" id="bill.headPanelTitle" />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <MPayBillButton bill={bill} />
      </Grid>
      <Divider />
      <Grid container className={classes.item}>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="bill.code" value={bill?.code} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="bill.dateBill"
            value={bill?.dateBill}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="bill.datePayed"
            value={bill?.datePayed}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <NumberInput module="invoice" label="bill.amountTotal" displayZero value={bill?.amountTotal} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="invoice.InvoiceStatusPicker"
            label="invoice.status.label"
            withNull
            value={bill?.status}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="bill.currencyCode" value={bill?.currencyCode} readOnly />
        </Grid>
      </Grid>
    </>
  );
}

export default BillVoucherHeadPanel;
