/* eslint-disable default-param-last */

import {
  decodeId,
  dispatchMutationErr,
  dispatchMutationReq,
  dispatchMutationResp,
  formatGraphQLError,
  formatServerError,
  pageInfo,
  parseData,
} from '@openimis/fe-core';
import {
  CLEAR, ERROR, REQUEST, SUCCESS,
} from './utils/action-type';

export const ACTION_TYPE = {
  MUTATION: 'WORKER_VOUCHER_MUTATION',
  ACQUIRE_GENERIC_VOUCHER: 'WORKER_VOUCHER_ACQUIRE_GENERIC_VOUCHER',
  ACQUIRE_SPECIFIC_VOUCHER: 'WORKER_VOUCHER_ACQUIRE_SPECIFIC_VOUCHER',
  ASSIGN_VOUCHERS: 'WORKER_VOUCHER_ASSIGN_VOUCHERS',
  APPEND_WORKER: 'WORKER_VOUCHER_APPEND_WORKER',
  SEARCH_WORKER_VOUCHERS: 'WORKER_VOUCHER_WORKER_VOUCHERS',
  GET_WORKER_VOUCHER: 'WORKER_VOUCHER_GET_WORKER_VOUCHER',
  SEARCH_VOUCHER_PRICES: 'WORKER_VOUCHER_VOUCHER_PRICES',
  MANAGE_VOUCHER_PRICE: 'WORKER_VOUCHER_MANAGE_VOUCHER_PRICE',
  DELETE_VOUCHER_PRICE: 'WORKER_VOUCHER_DELETE_VOUCHER_PRICE',
  EXPORT_WORKER_VOUCHER: 'WORKER_VOUCHER_VOUCHER_EXPORT',
  GET_WORKERS: 'WORKER_VOUCHER_GET_WORKERS',
  GET_WORKER: 'WORKER_VOUCHER_GET_WORKER',
  WORKERS_EXPORT: 'WORKER_VOUCHER_WORKERS_EXPORT',
  VOUCHER_COUNT: 'WORKER_VOUCHER_VOUCHER_COUNT',
  DELETE_WORKER: 'WORKER_VOUCHER_DELETE_WORKER'
};

const STORE_STATE = {
  submittingMutation: false,
  mutation: {},
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
  fetchingVoucherPrices: false,
  fetchedVoucherPrices: false,
  errorVoucherPrices: null,
  voucherPrices: [],
  voucherPricesPageInfo: {},
  voucherPricesTotalCount: 0,
  fetchingWorkerVoucherExport: false,
  fetchedWorkerVoucherExport: false,
  workerVoucherExport: null,
  workerVoucherExportPageInfo: {},
  errorWorkerVoucherExport: null,
  workers: [],
  workersTotalCount: 0,
  fetchingWorkers: false,
  fetchedWorkers: false,
  errorWorkers: null,
  workersPageInfo: {},
  fetchingWorkersExport: false,
  fetchedWorkersExport: false,
  workersExport: null,
  errorWorkersExport: null,
  fetchingWorker: true,
  fetchedWorker: false,
  worker: {},
  errorWorker: null,
};

function reducer(state = STORE_STATE, action) {
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
    case REQUEST(ACTION_TYPE.SEARCH_VOUCHER_PRICES):
      return {
        ...state,
        fetchingVoucherPrices: true,
        fetchedVoucherPrices: false,
        errorVoucherPrices: null,
        voucherPrices: [],
        voucherPricesPageInfo: {},
        voucherPricesTotalCount: 0,
      };
    case SUCCESS(ACTION_TYPE.SEARCH_VOUCHER_PRICES):
      return {
        ...state,
        fetchingVoucherPrices: false,
        fetchedVoucherPrices: true,
        errorVoucherPrices: formatGraphQLError(action.payload),
        voucherPrices: parseData(action.payload.data.businessConfig),
        voucherPricesPageInfo: pageInfo(action.payload.data.businessConfig),
        voucherPricesTotalCount: action.payload.data.businessConfig?.totalCount ?? 0,
      };
    case ERROR(ACTION_TYPE.SEARCH_VOUCHER_PRICES):
      return {
        ...state,
        fetchingVoucherPrices: false,
        errorVoucherPrices: formatServerError(action.payload),
      };
    case CLEAR(ACTION_TYPE.SEARCH_VOUCHER_PRICES):
      return {
        ...state,
        fetchingVoucherPrices: false,
        fetchedVoucherPrices: false,
        errorVoucherPrices: null,
        voucherPrices: [],
        voucherPricesPageInfo: {},
        voucherPricesTotalCount: 0,
      };
    case REQUEST(ACTION_TYPE.EXPORT_WORKER_VOUCHER):
      return {
        ...state,
        fetchingWorkerVoucherExport: true,
        fetchedWorkerVoucherExport: false,
        workerVoucherExport: null,
        workerVoucherExportPageInfo: {},
        errorWorkerVoucherExport: null,
      };
    case SUCCESS(ACTION_TYPE.EXPORT_WORKER_VOUCHER):
      return {
        ...state,
        fetchingWorkerVoucherExport: false,
        fetchedWorkerVoucherExport: true,
        workerVoucherExport: action.payload.data.workerVoucherExport,
        workerVoucherExportPageInfo: pageInfo(action.payload.data.workerVoucherExportPageInfo),
        errorWorkerVoucherExport: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.EXPORT_WORKER_VOUCHER):
      return {
        ...state,
        fetchingWorkerVoucherExport: false,
        errorWorkerVoucherExport: formatServerError(action.payload),
      };
    case CLEAR(ACTION_TYPE.EXPORT_WORKER_VOUCHER):
      return {
        ...state,
        fetchingWorkerVoucherExport: false,
        fetchedWorkerVoucherExport: false,
        workerVoucherExport: null,
        workerVoucherExportPageInfo: {},
        errorWorkerVoucherExport: null,
      };
    case REQUEST(ACTION_TYPE.GET_WORKERS):
      return {
        ...state,
        fetchingWorkers: true,
        fetchedWorkers: false,
        errorWorkers: null,
        workers: [],
        workersPageInfo: {},
        workersTotalCount: 0,
      };
    case SUCCESS(ACTION_TYPE.GET_WORKERS):
      return {
        ...state,
        fetchingWorkers: false,
        fetchedWorkers: true,
        errorWorkers: formatGraphQLError(action.payload),
        workers: parseData(action.payload.data.worker),
        workersPageInfo: pageInfo(action.payload.data.worker),
        workersTotalCount: action.payload.data.worker?.totalCount ?? 0,
      };
    case ERROR(ACTION_TYPE.GET_WORKERS):
      return {
        ...state,
        fetchingWorkers: false,
        errorWorkers: formatServerError(action.payload),
      };
    case CLEAR(ACTION_TYPE.GET_WORKERS):
      return {
        ...state,
        fetchingWorkers: false,
        fetchedWorkers: false,
        errorWorkers: null,
        workers: [],
      };
    case REQUEST(ACTION_TYPE.WORKERS_EXPORT):
      return {
        ...state,
        fetchingWorkersExport: true,
        fetchedWorkersExport: false,
        workersExport: null,
        errorWorkersExport: null,
      };
    case SUCCESS(ACTION_TYPE.WORKERS_EXPORT):
      return {
        ...state,
        fetchingWorkersExport: false,
        fetchedWorkersExport: true,
        workersExport: action.payload.data.workerExport,
        errorWorkersExport: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.WORKERS_EXPORT):
      return {
        ...state,
        fetchingWorkersExport: false,
        errorWorkersExport: formatServerError(action.payload),
      };
    case CLEAR(ACTION_TYPE.WORKERS_EXPORT):
      return {
        ...state,
        fetchingWorkersExport: false,
        fetchedWorkersExport: false,
        workersExport: null,
        errorWorkersExport: null,
      };
    case REQUEST(ACTION_TYPE.GET_WORKER):
      return {
        ...state,
        fetchingWorker: true,
        fetchedWorker: false,
        worker: {},
        errorWorker: null,
      };
    case SUCCESS(ACTION_TYPE.GET_WORKER):
      return {
        ...state,
        fetchingWorker: false,
        fetchedWorker: true,
        worker: parseData(action.payload.data.worker)?.[0],
        errorWorker: formatGraphQLError(action.payload),
      };
    case ERROR(ACTION_TYPE.GET_WORKER):
      return {
        ...state,
        fetchingWorker: false,
        errorWorker: formatServerError(action.payload),
      };
    case CLEAR(ACTION_TYPE.GET_WORKER):
      return {
        ...state,
        fetchingWorker: false,
        fetchedWorker: false,
        worker: {},
        errorWorker: null,
      };
    case REQUEST(ACTION_TYPE.MUTATION):
      return dispatchMutationReq(state, action);
    case ERROR(ACTION_TYPE.MUTATION):
      return dispatchMutationErr(state, action);
    case SUCCESS(ACTION_TYPE.ACQUIRE_GENERIC_VOUCHER):
      return dispatchMutationResp(state, 'acquireUnassignedVouchers', action);
    case SUCCESS(ACTION_TYPE.ACQUIRE_SPECIFIC_VOUCHER):
      return dispatchMutationResp(state, 'acquireAssignedVouchers', action);
    case SUCCESS(ACTION_TYPE.ASSIGN_VOUCHERS):
      return dispatchMutationResp(state, 'assignVouchers', action);
    case SUCCESS(ACTION_TYPE.APPEND_WORKER):
      return dispatchMutationResp(state, 'createWorker', action);
    case SUCCESS(ACTION_TYPE.DELETE_WORKER):
      return dispatchMutationResp(state, 'deleteWorker', action);
    case SUCCESS(ACTION_TYPE.MANAGE_VOUCHER_PRICE):
      return dispatchMutationResp(state, 'createBusinessConfig', action);
    case SUCCESS(ACTION_TYPE.DELETE_VOUCHER_PRICE):
      return dispatchMutationResp(state, 'deleteBusinessConfig', action);
    default:
      return state;
  }
}

export default reducer;
