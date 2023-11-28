import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IconButton, Tooltip } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';

import {
  Searcher, useHistory, useModulesManager, useTranslations,
} from '@openimis/fe-core';
import { fetchWorkerVouchers } from '../actions';
import {
  DEFAULT_PAGE_SIZE, MODULE_NAME, REF_ROUTE_WORKER_VOUCHER, ROWS_PER_PAGE_OPTIONS, VOUCHER_RIGHT_SEARCH,
} from '../constants';
import VoucherFilter from './VoucherFilter';

function VoucherSearcher() {
  const history = useHistory();
  const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);
  const {
    fetchingWorkerVouchers,
    fetchedWorkerVouchers,
    errorWorkerVouchers,
    workerVouchers,
    workerVouchersPageInfo,
    workerVouchersTotalCount,
  } = useSelector((state) => state.workerVoucher);

  const fetchVouchers = (params) => {
    try {
      dispatch(fetchWorkerVouchers(modulesManager, params));
    } catch (error) {
      throw new Error(`[VOUCHER_SEARCHER]: Fetching vouchers failed. ${error}`);
    }
  };

  const headers = () => [
    'workerVoucher.code',
    'workerVoucher.employer',
    'workerVoucher.worker',
    'workerVoucher.status',
    'workerVoucher.assignedDate',
    'workerVoucher.expiryDate',
    'emptyLabel',
  ];

  const sorts = () => [
    ['code', true],
    ['policyholder', true],
    ['insuree', true],
    ['status', true],
    ['assignedDate', true],
    ['expiryDate', true],
  ];

  const rowIdentifier = (workerVoucher) => workerVoucher.uuid;

  const openWorkerVoucher = (workerVoucher) => rights.includes(VOUCHER_RIGHT_SEARCH) && history.push(
    `/${modulesManager.getRef(REF_ROUTE_WORKER_VOUCHER)}/${workerVoucher?.uuid}`,
  );

  const onDoubleClick = (workerVoucher) => openWorkerVoucher(workerVoucher);

  const itemFormatters = () => [
    (workerVoucher) => workerVoucher.code,
    (workerVoucher) => `${workerVoucher.policyholder.code} ${workerVoucher.policyholder.tradeName}`,
    (workerVoucher) => `${workerVoucher.insuree.chfId} ${workerVoucher.insuree.lastName}`,
    (workerVoucher) => workerVoucher.status,
    (workerVoucher) => workerVoucher.assignedDate,
    (workerVoucher) => workerVoucher.expiryDate,
    (workerVoucher) => (
      <Tooltip title={formatMessage('workerVoucher.tooltip.details')}>
        <IconButton onClick={() => openWorkerVoucher(workerVoucher)}>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
    ),
  ];

  const voucherFilter = ({ filters, onChangeFilters }) => (
    <VoucherFilter filters={filters} onChangeFilters={onChangeFilters} formatMessage={formatMessage} />
  );

  return (
    <Searcher
      module="workerVoucher"
      FilterPane={voucherFilter}
      fetch={fetchVouchers}
      items={workerVouchers}
      itemsPageInfo={workerVouchersPageInfo}
      fetchedItems={fetchedWorkerVouchers}
      fetchingItems={fetchingWorkerVouchers}
      errorItems={errorWorkerVouchers}
      tableTitle={formatMessageWithValues('workerVoucher.searcherResultsTitle', { workerVouchersTotalCount })}
      headers={headers}
      itemFormatters={itemFormatters}
      sorts={sorts}
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      defaultPageSize={DEFAULT_PAGE_SIZE}
      rowIdentifier={rowIdentifier}
      onDoubleClick={onDoubleClick}
    />
  );
}

export default VoucherSearcher;
