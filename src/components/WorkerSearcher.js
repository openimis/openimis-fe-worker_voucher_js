import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  IconButton, Button, Tooltip, Dialog, DialogActions, DialogTitle, DialogContent,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';

import {
  Searcher, useHistory, useModulesManager, useTranslations, downloadExport,
} from '@openimis/fe-core';
import { fetchWorkers, downloadWorkers, clearWorkersExport } from '../actions';
import {
  DEFAULT_PAGE_SIZE,
  MODULE_NAME,
  RIGHT_WORKER_DELETE,
  RIGHT_WORKER_SEARCH,
  ROWS_PER_PAGE_OPTIONS,
} from '../constants';
import WorkerFilter from './WorkerFilter';

function WorkerSearcher({ downloadWorkers, fetchWorkers: fetchWorkersAction, clearWorkersExport }) {
  const history = useHistory();
  const modulesManager = useModulesManager();
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);
  const {
    fetchingWorkers,
    fetchedWorkers,
    errorWorkers,
    workers,
    workersPageInfo,
    workersTotalCount,
    workersExport,
    errorWorkersExport,
  } = useSelector((state) => state.workerVoucher);
  const { economicUnit } = useSelector((state) => state.policyHolder);
  const [failedExport, setFailedExport] = useState(false);
  const [queryParams, setQueryParams] = useState([]);
  const exportConfiguration = {
    exportFields: ['chf_id', 'last_name', 'other_names'],
    exportFieldsColumns: {
      chf_id: formatMessage('worker.chfId'),
      last_name: formatMessage('worker.lastName'),
      other_names: formatMessage('worker.otherNames'),
    },
  };

  const fetchWorkers = useCallback(
    (params) => {
      try {
        const actionParams = [...params];

        if (economicUnit?.code) {
          actionParams.push(`policyHolderCode:"${economicUnit.code}"`);
        }

        fetchWorkersAction(modulesManager, actionParams);
      } catch (error) {
        throw new Error(`[WORKER_SEARCHER]: Fetching workers failed. ${error}`);
      }
    },
    [economicUnit],
  );

  const headers = () => [
    'workerVoucher.worker.chfId',
    'workerVoucher.worker.lastName',
    'workerVoucher.worker.otherNames',
    'emptyLabel',
  ];

  const sorts = () => [
    ['chfId', true],
    ['lastName', true],
    ['otherNames', true],
  ];

  const rowIdentifier = (worker) => worker.uuid;

  const openWorker = (worker) => rights.includes(RIGHT_WORKER_SEARCH)
    && history.push(`/${modulesManager.getRef('workerVoucher.route.worker')}/${worker?.uuid}`);

  // eslint-disable-next-line no-unused-vars
  const deleteWorker = (worker) => {
    // TODO: Implement delete worker
  };

  const onDoubleClick = (worker) => openWorker(worker);

  const itemFormatters = () => [
    (worker) => worker.chfId,
    (worker) => worker.lastName,
    (worker) => worker.otherNames,
    (worker) => (
      <>
        {rights.includes(RIGHT_WORKER_SEARCH) && (
          <Tooltip title={formatMessage('workerVoucher.tooltip.details')}>
            <IconButton onClick={() => openWorker(worker)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        )}
        {rights.includes(RIGHT_WORKER_DELETE) && (
          <Tooltip title={formatMessage('workerVoucher.tooltip.delete')}>
            <IconButton onClick={() => deleteWorker(worker)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </>
    ),
  ];

  useEffect(() => {
    if (errorWorkersExport) {
      setFailedExport(true);
    }
  }, [errorWorkersExport]);

  useEffect(() => {
    if (workersExport) {
      downloadExport(workersExport, `${formatMessage('export.workers.filename')}.csv`)();
      clearWorkersExport();
    }

    return setFailedExport(false);
  }, [workersExport]);

  const handleExportErrorDialogClose = () => {
    setFailedExport(false);
  };

  const workerFilters = ({ filters, onChangeFilters }) => (
    <WorkerFilter filters={filters} onChangeFilters={onChangeFilters} />
  );

  const filtersToQueryParams = ({
    filters, pageSize, beforeCursor, afterCursor, orderBy,
  }) => {
    const queryParams = Object.keys(filters)
      .filter((f) => !!filters[f].filter)
      .map((f) => filters[f].filter);
    if (!beforeCursor && !afterCursor) {
      queryParams.push(`first: ${pageSize}`);
    }
    if (afterCursor) {
      queryParams.push(`after: "${afterCursor}"`);
      queryParams.push(`first: ${pageSize}`);
    }
    if (beforeCursor) {
      queryParams.push(`before: "${beforeCursor}"`);
      queryParams.push(`last: ${pageSize}`);
    }
    if (orderBy) {
      queryParams.push(`orderBy: ["${orderBy}"]`);
    }
    setQueryParams(queryParams);
    return queryParams;
  };

  useEffect(() => {
    if (queryParams.length) {
      fetchWorkers(queryParams);
    }
  }, [economicUnit, queryParams]);

  return (
    <>
      <Searcher
        module="workerVoucher"
        FilterPane={workerFilters}
        fetch={fetchWorkers}
        items={workers}
        itemsPageInfo={workersPageInfo}
        fetchedItems={fetchedWorkers}
        fetchingItems={fetchingWorkers}
        errorItems={errorWorkers}
        filtersToQueryParams={filtersToQueryParams}
        tableTitle={formatMessageWithValues('workerVoucher.WorkerSearcher.resultsTitle', { workersTotalCount })}
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        rowIdentifier={rowIdentifier}
        onDoubleClick={onDoubleClick}
        exportable={!!workers?.length}
        exportFetch={downloadWorkers}
        exportFields={exportConfiguration.exportFields}
        exportFieldsColumns={exportConfiguration.exportFieldsColumns}
        exportFieldLabel={formatMessage('export.workers')}
        chooseExportableColumns
      />
      {failedExport && (
        <Dialog open={failedExport} fullWidth maxWidth="sm">
          <DialogTitle>{errorWorkersExport?.message}</DialogTitle>
          <DialogContent>
            <strong>{`${errorWorkersExport?.code}:`}</strong>
            {errorWorkersExport?.detail}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleExportErrorDialogClose()} color="primary" variant="contained">
              {formatMessage('workerVoucher.WorkerSearcher.exportClose')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

const mapDispatchToProps = (dispatch) => bindActionCreators(
  {
    downloadWorkers,
    fetchWorkers,
    clearWorkersExport,
  },
  dispatch,
);

export default connect(null, mapDispatchToProps)(WorkerSearcher);
