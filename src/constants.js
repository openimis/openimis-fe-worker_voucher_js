export const VOUCHER_RIGHT_SEARCH = 204001;
export const MODULE_NAME = 'workerVoucher';

export const REF_ROUTE_WORKER_VOUCHER = 'workerVoucher.route.workerVoucher';

export const DEFAULT_DEBOUNCE_TIME = 800;
export const DEFAULT_PAGE_SIZE = 10;
export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];
export const EMPTY_STRING = '';
export const CONTAINS_LOOKUP = 'Icontains';

const WORKER_VOUCHER_STATUS = {
  AWAITING_PAYMENT: 'AWAITING_PAYMENT',
  UNASSIGNED: 'UNASSIGNED',
  ASSIGNED: 'ASSIGNED',
  EXPIRED: 'EXPIRED',
  CANCELED: 'CANCELED',
  CLOSED: 'CLOSED',
};

const ACQUIREMENT_METHOD = {
  GENERIC_VOUCHER: 'GENERIC_VOUCHER',
  SPECIFIC_WORKER: 'SPECIFIC_WORKER',
};

export const ACQUIREMENT_METHOD_LIST = [
  ACQUIREMENT_METHOD.GENERIC_VOUCHER, ACQUIREMENT_METHOD.SPECIFIC_WORKER,
];

export const WORKER_VOUCHER_STATUS_LIST = [
  WORKER_VOUCHER_STATUS.AWAITING_PAYMENT,
  WORKER_VOUCHER_STATUS.UNASSIGNED,
  WORKER_VOUCHER_STATUS.ASSIGNED,
  WORKER_VOUCHER_STATUS.EXPIRED,
  WORKER_VOUCHER_STATUS.CANCELED,
  WORKER_VOUCHER_STATUS.CLOSED,
];
