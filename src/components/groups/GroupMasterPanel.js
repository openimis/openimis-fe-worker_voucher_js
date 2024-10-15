import React from 'react';

import {
  Divider,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';

import {
  FormattedMessage, FormPanel, TextInput, withModulesManager,
} from '@openimis/fe-core';
import { EMPTY_STRING } from '../../constants';
import GroupWorkerManagePanel from './GroupWorkerManagePanel';

const styles = (theme) => ({
  paper: theme.paper.paper,
  tableTitle: theme.table.title,
  item: theme.paper.item,
});

class GroupMasterPanel extends FormPanel {
  render() {
    const {
      classes, edited, readOnly, onEditedChanged,
    } = this.props;

    return (
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Grid container className={classes.tableTitle}>
            <Grid item xs={3} container alignItems="center" className={classes.item}>
              <Typography variant="h5">
                <FormattedMessage
                  module="workerVoucher"
                  id={edited?.uuid ? 'group.edit' : 'group.new'}
                  values={{
                    name: edited?.name ?? EMPTY_STRING,
                  }}
                />
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          <Grid item xs={4} className={classes.item}>
            <TextInput
              module="workerVoucher"
              label="group.name"
              required
              readOnly={readOnly}
              value={edited?.name ?? EMPTY_STRING}
              onChange={(v) => this.updateAttribute('name', v)}
            />
          </Grid>
          <Divider />
          <Grid container>
            <GroupWorkerManagePanel edited={edited} onChange={onEditedChanged} />
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

export default withModulesManager(withTheme(withStyles(styles)(GroupMasterPanel)));
