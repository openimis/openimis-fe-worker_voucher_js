import React from 'react';

import {
  Divider, Grid, Paper, Typography, Button,
} from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

import { FormPanel, FormattedMessage, withModulesManager } from '@openimis/fe-core';
import WorkerMConnectAddForm from './WorkerMConnectAddForm';

const styles = (theme) => ({
  paper: theme.paper.paper,
  tableTitle: theme.table.title,
  item: theme.paper.item,
  lockedPage: theme.page.locked,
  fullHeight: {
    height: '100%',
  },
});

class WorkerMConnectMasterPanel extends FormPanel {
  updateWorkerData = (attributes) => {
    this.updateAttributes(attributes);
  };

  render() {
    const {
      classes, edited, save, canSave, readOnly, formatMessage,
    } = this.props;

    return (
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container className={classes.tableTitle}>
              <Grid item xs={6} container alignItems="center" className={classes.item}>
                <Typography variant="h5">
                  <FormattedMessage module="workerVoucher" id="workerVoucher.WorkerMConnectAddForm.title" />
                </Typography>
              </Grid>
              <Grid item xs={6} container alignItems="center" justifyContent="flex-end">
                <Button
                  onClick={() => save(edited)}
                  disabled={!canSave() || readOnly}
                  startIcon={<SaveAltIcon />}
                  variant="contained"
                  color="primary"
                >
                  <Typography variant="body2">{formatMessage('workerVoucher.add')}</Typography>
                </Button>
              </Grid>
            </Grid>
            <Divider />
            <Grid>
              <Grid item xs={12} container alignItems="center" className={classes.item}>
                <FormattedMessage module="workerVoucher" id="workerVoucher.WorkerMConnectAddForm.tip" />
              </Grid>
            </Grid>
            <Divider />
            <WorkerMConnectAddForm edited={edited} updateWorkerData={this.updateWorkerData} />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withModulesManager(withTheme(withStyles(styles)(WorkerMConnectMasterPanel)));
