export const VOUCHER_RIGHT_SEARCH = 204001;
export const EMPLOYER_RIGHT_SEARCH = 203000;
export const VOUCHER_PRICE_MANAGEMENT_RIGHT = 205001;
export const INSPECTOR_RIGHT = 204005;
export const ADMIN_RIGHT = 204004;
export const MODULE_NAME = 'workerVoucher';

export const REF_ROUTE_WORKER_VOUCHER = 'workerVoucher.route.workerVoucher';
export const REF_ROUTE_WORKER_VOUCHERS = 'workerVoucher.route.workerVouchers';
export const REF_ROUTE_BILL = 'bill.route.bill';
export const REF_GET_BILL_LINE_ITEM = 'bill.action.fetchBillLineItems';
export const ECONOMIC_UNIT_STORAGE_KEY = 'userEconomicUnit';

export const MPAY_BILL_URL = '/msystems/mpay_payment/';
export const BILL_PAID_STATUS = '2';
export const DEFAULT_DEBOUNCE_TIME = 800;
export const DEFAULT_PAGE_SIZE = 10;
export const VOUCHER_PRICE_DEFAULT_PAGE_SIZE = 5;
export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];
export const VOUCHER_PRICE_ROWS_PER_PAGE = [5, 10, 20, 50];
export const EMPTY_STRING = '';
export const CONTAINS_LOOKUP = 'Icontains';
export const STARTS_WITH_LOOKUP = 'Istartswith';
export const WORKER_THRESHOLD = 3;
export const VOUCHER_QUANTITY_THRESHOLD = 10000;
export const USER_ECONOMIC_UNIT_STORAGE_KEY = 'userEconomicUnit';
export const VOUCHER_PRICE_MANAGEMENT_BUSINESS_KEY = 'VOUCHER_PRICE_MANAGEMENT_KEY';
export const DATE_TIME_SUFFIX = 'T00:00:00';
export const DEFAULT_VOUCHER_PRICE_FILTERS = [
  'first: 5',
  'orderBy: ["value"]',
];

const WORKER_VOUCHER_STATUS = {
  AWAITING_PAYMENT: 'AWAITING_PAYMENT',
  UNASSIGNED: 'UNASSIGNED',
  ASSIGNED: 'ASSIGNED',
  EXPIRED: 'EXPIRED',
  CANCELED: 'CANCELED',
  CLOSED: 'CLOSED',
};

export const ACQUIREMENT_METHOD = {
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

export const DEFAULT = {
  GENERIC_VOUCHER_ENABLED: false,
  IS_WORKER: false,
};

export const WORKER_IMPORT_PREVIOUS_WORKERS = 'previousWorkers';
export const WORKER_IMPORT_PREVIOUS_DAY = 'previousDay';

export const WORKER_IMPORT_PLANS = [
  {
    value: WORKER_IMPORT_PREVIOUS_WORKERS,
    labelKey: 'workerVoucher.workerImport.previousWorkers',
  },
  {
    value: WORKER_IMPORT_PREVIOUS_DAY,
    labelKey: 'workerVoucher.workerImport.previousDay',
  },
];
