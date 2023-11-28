import React from 'react';

import { Divider, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { FormattedMessage } from '@openimis/fe-core';
import VoucherDetailsEmployer from './VoucherDetailsEmployer';
import VoucherDetailsVoucher from './VoucherDetailsVoucher';
import VoucherDetailsWorker from './VoucherDetailsWorker';

const useStyles = makeStyles((theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: '100%',
  },
}));

function VoucherDetailsPanel({ workerVoucher, readOnly = true, formatMessage }) {
  const classes = useStyles();

  return (
    <>
      <Grid container className={classes.tableTitle}>
        <Grid
          container
          align="start"
          justify="center"
          direction="column"
          className={classes.fullHeight}
        >
          <Grid item>
            <Typography>
              <FormattedMessage module="workerVoucher" id="workerVoucher.VoucherDetailsPanel.subtitle" />
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <VoucherDetailsVoucher
        workerVoucher={workerVoucher}
        readOnly={readOnly}
        classes={classes}
        formatMessage={formatMessage}
      />
      <VoucherDetailsWorker
        workerVoucher={workerVoucher}
        readOnly={readOnly}
        classes={classes}
      />
      <VoucherDetailsEmployer
        workerVoucher={workerVoucher}
        readOnly={readOnly}
        classes={classes}
      />
    </>
  );
}

export default VoucherDetailsPanel;
