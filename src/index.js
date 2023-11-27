/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable import/prefer-default-export */
/* eslint-disable camelcase */

import React from 'react';

import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';

import { FormattedMessage } from '@openimis/fe-core';
import { VOUCHER_RIGHT_SEARCH } from './constants';
import VoucherAcquirementPage from './pages/VoucherAcquirementPage';
import VoucherAssignmentPage from './pages/VoucherAssignmentPage';
import VoucherDetailsPage from './pages/VoucherDetailsPage';
import VouchersPage from './pages/VouchersPage';
import WorkerVoucherStatusPicker from './pickers/WorkerVoucherStatusPicker';
import reducer from './reducer';
import messages_en from './translations/en.json';

const ROUTE_WORKER_VOUCHERS_LIST = 'voucher/vouchers';
const ROUTE_WORKER_VOUCHER = 'voucher/vouchers/voucher';
const ROUTE_WORKER_VOUCHER_ACQUIREMENT = 'voucher/acquirement';
const ROUTE_WORKER_VOUCHER_ASSIGNMENT = 'voucher/assignment';

const DEFAULT_CONFIG = {
  translations: [{ key: 'en', messages: messages_en }],
  reducers: [{ key: 'workerVoucher', reducer }],
  refs: [
    { key: 'workerVoucher.route.workerVouchers', ref: ROUTE_WORKER_VOUCHERS_LIST },
    { key: 'workerVoucher.route.workerVoucher', ref: ROUTE_WORKER_VOUCHER },
    { key: 'workerVoucher.WorkerVoucherStatusPicker', ref: WorkerVoucherStatusPicker },
  ],
  'worker.MainMenu': [
    {
      text: <FormattedMessage module="workerVoucher" id="menu.voucherList" />,
      icon: <ListAltIcon />,
      route: `/${ROUTE_WORKER_VOUCHERS_LIST}`,
      filter: (rights) => [VOUCHER_RIGHT_SEARCH].some((right) => rights.includes(right)),
    },
    {
      text: <FormattedMessage module="workerVoucher" id="menu.voucherAcquirement" />,
      icon: <LocalAtmIcon />,
      route: `/${ROUTE_WORKER_VOUCHER_ACQUIREMENT}`,
      filter: (rights) => [VOUCHER_RIGHT_SEARCH].some((right) => rights.includes(right)),
    },
    {
      text: <FormattedMessage module="workerVoucher" id="menu.voucherAssignment" />,
      icon: <GroupAddIcon />,
      route: `/${ROUTE_WORKER_VOUCHER_ASSIGNMENT}`,
      filter: (rights) => [VOUCHER_RIGHT_SEARCH].some((right) => rights.includes(right)),
    },
  ],
  'core.Router': [
    { path: ROUTE_WORKER_VOUCHERS_LIST, component: VouchersPage },
    { path: `${ROUTE_WORKER_VOUCHER}/:voucher_uuid?`, component: VoucherDetailsPage },
    { path: ROUTE_WORKER_VOUCHER_ACQUIREMENT, component: VoucherAcquirementPage },
    { path: ROUTE_WORKER_VOUCHER_ASSIGNMENT, component: VoucherAssignmentPage },
  ],
};

export const WorkerVoucherModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
