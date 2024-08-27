import React from 'react';

import {
  Divider,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';

import {
  FormPanel,
  FormattedMessage,
  withModulesManager,
} from '@openimis/fe-core';
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
  updateChfId = (chfId) => {
    this.updateAttribute('chfId', chfId);
  };

  render() {
    const {
      classes, edited, searchWorker, setSearchWorker,
    } = this.props;

    return (
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid className={classes.tableTitle}>
              <Grid item xs={12} container alignItems="center" className={classes.item}>
                <Typography variant="h5">
                  <FormattedMessage module="workerVoucher" id="workerVoucher.WorkerMConnectAddForm.title" />
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid>
              <Grid item xs={12} container alignItems="center" className={classes.item}>
                <FormattedMessage module="workerVoucher" id="workerVoucher.WorkerMConnectAddForm.tip" />
              </Grid>
            </Grid>
            <Divider />
            <WorkerMConnectAddForm
              edited={edited}
              searchWorker={searchWorker}
              setSearchWorker={setSearchWorker}
              updateChfId={this.updateChfId}
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withModulesManager(withTheme(withStyles(styles)(WorkerMConnectMasterPanel)));
