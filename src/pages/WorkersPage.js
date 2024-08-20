import React from 'react';
import { useSelector } from 'react-redux';

import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';

import {
  historyPush, Helmet, useModulesManager, useTranslations, withTooltip, useHistory,
} from '@openimis/fe-core';
import { MODULE_NAME, RIGHT_WORKER_ADD, RIGHT_WORKER_SEARCH } from '../constants';
import WorkerSearcher from '../components/WorkerSearcher';

export const useStyles = makeStyles((theme) => ({
  page: theme.page,
  fab: theme.fab,
}));

function WorkersPage() {
  const modulesManager = useModulesManager();
  const history = useHistory();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const rights = useSelector((state) => (state.core?.user?.i_user?.rights ?? []));

  const onAddRedirect = () => {
    historyPush(modulesManager, history, 'workerVoucher.route.worker');
  };

  return (
    rights.includes(RIGHT_WORKER_SEARCH) && (
      <div className={classes.page}>
        <Helmet title={formatMessage('workerVoucher.menu.workersList')} />
        <WorkerSearcher />
        {rights.includes(RIGHT_WORKER_ADD)
          && withTooltip(
            <div className={classes.fab}>
              <Fab color="primary" onClick={onAddRedirect}>
                <AddIcon />
              </Fab>
            </div>,
            formatMessage('workerVoucher.WorkersPage.addTooltip'),
          )}
      </div>
    )
  );
}

export default WorkersPage;
