/* eslint-disable import/no-extraneous-dependencies */
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import {
  Divider, Grid, Typography, Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import PrintIcon from '@material-ui/icons/Print';
import ReceiptIcon from '@material-ui/icons/Receipt';

import {
  FormattedMessage, useModulesManager, useHistory, historyPush,
} from '@openimis/fe-core';
import { REF_ROUTE_BILL, VOUCHER_RIGHT_SEARCH } from '../constants';
import VoucherDetailsEmployer from './VoucherDetailsEmployer';
import VoucherDetailsVoucher from './VoucherDetailsVoucher';
import VoucherDetailsWorker from './VoucherDetailsWorker';
import VoucherDetailsPrintTemplate from './VoucherDetailsPrintTemplate';

const useStyles = makeStyles((theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: '100%',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
  },
}));

function VoucherDetailsPanel({
  workerVoucher, readOnly = true, formatMessage, rights, logo,
}) {
  const modulesManager = useModulesManager();
  const history = useHistory();
  const voucherPrintTemplateRef = useRef(null);
  const classes = useStyles();

  const handlePrint = useReactToPrint({
    documentTitle: `Print ${workerVoucher.code} Voucher`,
  });

  const redirectToTheLinkedBill = () => historyPush(modulesManager, history, REF_ROUTE_BILL, [workerVoucher.billId]);

  return (
    <div>
      <Grid container className={classes.tableTitle}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className={classes.fullHeight}
        >
          <Grid item>
            <Typography>
              <FormattedMessage module="workerVoucher" id="workerVoucher.VoucherDetailsPanel.subtitle" />
            </Typography>
          </Grid>
          {rights.includes(VOUCHER_RIGHT_SEARCH) && (
            <Grid item className={classes.actionButtons}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<PrintIcon />}
                onClick={(e) => {
                  e.preventDefault();
                  handlePrint(null, () => voucherPrintTemplateRef.current);
                }}
              >
                <Typography variant="subtitle1">{formatMessage('workerVoucher.printVoucher')}</Typography>
              </Button>
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<ReceiptIcon />}
                onClick={redirectToTheLinkedBill}
              >
                <Typography variant="subtitle1">{formatMessage('workerVoucher.navigateToTheBill.tooltip')}</Typography>
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Divider />
      <VoucherDetailsVoucher
        workerVoucher={workerVoucher}
        readOnly={readOnly}
        classes={classes}
        formatMessage={formatMessage}
      />
      <VoucherDetailsWorker workerVoucher={workerVoucher} readOnly={readOnly} classes={classes} />
      <VoucherDetailsEmployer workerVoucher={workerVoucher} readOnly={readOnly} classes={classes} />
      <div style={{ display: 'none' }}>
        <VoucherDetailsPrintTemplate ref={voucherPrintTemplateRef} logo={logo} workerVoucher={workerVoucher} />
      </div>
    </div>
  );
}

export default VoucherDetailsPanel;
