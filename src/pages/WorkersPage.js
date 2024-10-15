import React, { useState } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/styles';

import {
  Helmet,
  historyPush,
  useHistory,
  useModulesManager, useTranslations, withTooltip,
} from '@openimis/fe-core';
import WorkerSearcher from '../components/WorkerSearcher';
import {
  MODULE_NAME, RIGHT_WORKER_ADD, RIGHT_WORKER_SEARCH, RIGHT_WORKER_UPLOAD,
} from '../constants';
import { UploadWorkerProvider } from '../context/UploadWorkerContext';
import UploadWorkerModal from '../components/UploadWorkerModal';

export const useStyles = makeStyles((theme) => ({
  page: theme.page,
  fab: theme.fab,
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

function WorkersPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const modulesManager = useModulesManager();
  const history = useHistory();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const leftPlacement = 'left';

  const onAddRedirect = () => {
    historyPush(modulesManager, history, 'workerVoucher.route.worker');
  };

  const onUploadOpen = () => {
    setUploadOpen(true);
  };

  const onUploadClose = () => {
    setUploadOpen(false);
  };

  return (
    rights.includes(RIGHT_WORKER_SEARCH) && (
      <UploadWorkerProvider>
        <UploadWorkerModal open={uploadOpen} onClose={onUploadClose} />
        <div className={classes.page}>
          <Helmet title={formatMessage('workerVoucher.menu.workersList')} />
          <WorkerSearcher />
          <div className={clsx(classes.fab, classes.wrapper)}>
            {rights.includes(RIGHT_WORKER_UPLOAD)
              && withTooltip(
                <Fab color="primary" onClick={onUploadOpen}>
                  <CloudUploadIcon />
                </Fab>,
                formatMessage('workerVoucher.WorkersPage.uploadTooltip'),
                leftPlacement,
              )}
            {rights.includes(RIGHT_WORKER_ADD)
              && withTooltip(
                <Fab color="primary" onClick={onAddRedirect}>
                  <AddIcon />
                </Fab>,
                formatMessage('workerVoucher.WorkersPage.addTooltip'),
                leftPlacement,
              )}
          </div>
        </div>
      </UploadWorkerProvider>
    )
  );
}

export default WorkersPage;
