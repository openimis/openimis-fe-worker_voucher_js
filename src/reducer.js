/* eslint-disable default-param-last */

import {
  decodeId,
  formatGraphQLError,
  formatServerError,
  pageInfo,
  parseData,
} from '@openimis/fe-core';
import {
  ERROR, REQUEST, SUCCESS,
} from './utils/action-type';

export const ACTION_TYPE = {
  SEARCH_WORKER_VOUCHERS: 'WORKER_VOUCHER_WORKER_VOUCHERS',
};

const STORE_STATE = {
  fetchingWorkerVouchers: false,
  fetchedWorkerVouchers: false,
  errorWorkerVouchers: null,
  workerVouchers: [],
  workerVouchersPageInfo: {},
  workerVouchersTotalCount: 0,
};

function reducer(
  state = STORE_STATE,
  action,
) {
  switch (action.type) {
    case REQUEST(ACTION_TYPE.SEARCH_WORKER_VOUCHERS):
      return {
        ...state,
        fetchingWorkerVouchers: true,
        fetchedWorkerVouchers: false,
        errorWorkerVouchers: null,
        workerVouchers: [],
        workerVouchersPageInfo: {},
        workerVouchersTotalCount: 0,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_WORKER_VOUCHERS):
      return {
        ...state,
        fetchingWorkerVouchers: false,
        fetchedWorkerVouchers: true,
        errorWorkerVouchers: formatGraphQLError(action.payload),
        workerVouchers: parseData(action.payload.data.workerVoucher)?.map((voucher) => ({
          ...voucher,
          uuid: decodeId(voucher.id),
        })),
        workerVouchersPageInfo: pageInfo(action.payload.data.workerVoucher),
        workerVouchersTotalCount: action.payload.data.workerVoucher?.totalCount ?? 0,
      };
    case ERROR(ACTION_TYPE.SEARCH_WORKER_VOUCHERS):
      return {
        ...state,
        fetchingWorkerVouchers: false,
        errorWorkerVouchers: formatServerError(action.payload),
      };
    default:
      return state;
  }
}

export default reducer;
