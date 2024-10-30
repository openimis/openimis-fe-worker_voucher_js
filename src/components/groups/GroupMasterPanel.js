import React from 'react';

import {
  Divider, Grid, Paper, Typography, Button, CircularProgress,
} from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

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
      classes, edited, isSaving, onEditedChanged, save, formatMessage, canSave,
    } = this.props;

    return (
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Grid container className={classes.tableTitle}>
            <Grid item xs={6} container alignItems="center" className={classes.item}>
              <Typography variant="h5">
                <FormattedMessage module="workerVoucher" id={edited?.id ? 'group.edit' : 'group.new'} />
              </Typography>
            </Grid>
            <Grid item xs={6} container alignItems="center" justifyContent="flex-end">
              <Button
                onClick={() => save(edited)}
                disabled={!canSave() || isSaving}
                startIcon={isSaving ? <CircularProgress size={20} color="secondary" /> : <SaveAltIcon />}
                variant="contained"
                color="primary"
              >
                <Typography variant="body2">{formatMessage(`workerVoucher.${edited.id ? 'save' : 'add'}`)}</Typography>
              </Button>
            </Grid>
          </Grid>
          <Divider />
          <Grid item xs={4} className={classes.item}>
            <TextInput
              module="workerVoucher"
              label="group.name"
              required
              readOnly={isSaving}
              value={edited?.name ?? EMPTY_STRING}
              onChange={(v) => this.updateAttribute('name', v)}
            />
          </Grid>
          <Divider />
          <Grid container>
            <GroupWorkerManagePanel edited={edited} onChange={onEditedChanged} disabled={isSaving} />
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

export default withModulesManager(withTheme(withStyles(styles)(GroupMasterPanel)));
