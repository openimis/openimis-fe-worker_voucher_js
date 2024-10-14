import React from 'react';
import { useSelector } from 'react-redux';

import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';

import {
  historyPush, Helmet, useModulesManager, useTranslations, withTooltip, useHistory,
} from '@openimis/fe-core';
import { MODULE_NAME, RIGHT_GROUP_ADD, RIGHT_GROUP_SEARCH } from '../constants';
import GroupSearcher from '../components/groups/GroupSearcher';

export const useStyles = makeStyles((theme) => ({
  page: theme.page,
  fab: theme.fab,
}));

function GroupsPage() {
  const modulesManager = useModulesManager();
  const history = useHistory();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);

  const onAddRedirect = () => {
    historyPush(modulesManager, history, 'workerVoucher.route.group');
  };

  if (!rights.includes(RIGHT_GROUP_SEARCH)) return null;

  return (
    <div className={classes.page}>
      <Helmet title={formatMessage('workerVoucher.menu.groupList')} />
      <GroupSearcher />
      {rights.includes(RIGHT_GROUP_ADD)
        && withTooltip(
          <div className={classes.fab}>
            <Fab color="primary" onClick={onAddRedirect}>
              <AddIcon />
            </Fab>
          </div>,
          formatMessage('workerVoucher.GroupsPage.addTooltip'),
        )}
    </div>
  );
}

export default GroupsPage;
