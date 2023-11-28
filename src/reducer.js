/* eslint-disable default-param-last */

import {
  decodeId,
  formatGraphQLError,
  formatServerError,
  pageInfo,
  parseData,
} from '@openimis/fe-core';
import {
  CLEAR,
  ERROR, REQUEST, SUCCESS,
} from './utils/action-type';

export const ACTION_TYPE = {
  SEARCH_WORKER_VOUCHERS: 'WORKER_VOUCHER_WORKER_VOUCHERS',
  GET_WORKER_VOUCHER: 'WORKER_VOUCHER_GET_WORKER_VOUCHER',
};

const STORE_STATE = {
  fetchingWorkerVouchers: false,
  fetchedWorkerVouchers: false,
  errorWorkerVouchers: null,
  workerVouchers: [],
  workerVouchersPageInfo: {},
  workerVouchersTotalCount: 0,
  fetchingWorkerVoucher: false,
  fetchedWorkerVoucher: false,
  workerVoucher: {},
  errorWorkerVoucher: null,
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
    case REQUEST(ACTION_TYPE.GET_WORKER_VOUCHER):
      return {
        ...state,
        fetchingWorkerVoucher: true,
        fetchedWorkerVoucher: false,
        workerVoucher: {},
        errorWorkerVoucher: null,
      };
    case SUCCESS(ACTION_TYPE.GET_WORKER_VOUCHER):
      return {
        ...state,
        fetchingWorkerVoucher: false,
        fetchedWorkerVoucher: true,
        workerVoucher: parseData(action.payload.data.workerVoucher)?.map((voucher) => ({
          ...voucher,
          uuid: decodeId(voucher.id),
        }))?.[0],
        errorWorkerVoucher: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.GET_WORKER_VOUCHER):
      return {
        ...state,
        fetchingWorkerVoucher: false,
        errorWorkerVoucher: formatServerError(action.payload),
      };
    case CLEAR(ACTION_TYPE.GET_WORKER_VOUCHER):
      return {
        ...state,
        fetchingWorkerVoucher: false,
        fetchedWorkerVoucher: false,
        workerVoucher: {},
        errorWorkerVoucher: null,
      };
    default:
      return state;
  }
}

export default reducer;
