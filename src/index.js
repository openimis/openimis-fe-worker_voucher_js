/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable import/prefer-default-export */
/* eslint-disable camelcase */

import React from 'react';

import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import VpnLockIcon from '@material-ui/icons/VpnLock';

import { FormattedMessage } from '@openimis/fe-core';
import {
  ADMIN_RIGHT,
  EMPLOYER_RIGHT_SEARCH,
  INSPECTOR_RIGHT,
  VOUCHER_PRICE_MANAGEMENT_RIGHT,
  VOUCHER_RIGHT_SEARCH,
} from './constants';
import VoucherAcquirementPage from './pages/VoucherAcquirementPage';
import VoucherAssignmentPage from './pages/VoucherAssignmentPage';
import VoucherDetailsPage from './pages/VoucherDetailsPage';
import VouchersPage from './pages/VouchersPage';
import WorkerVoucherStatusPicker from './pickers/WorkerVoucherStatusPicker';
import reducer from './reducer';
import messages_en from './translations/en.json';
import VoucherAcquirementMethodPicker from './pickers/VoucherAcquirementMethodPicker';
import WorkerMultiplePicker from './pickers/WorkerMultiplePicker';
import WorkerDateRangePicker from './pickers/WorkerDateRangePicker';
import VoucherPriceManagement from './pages/VoucherPriceManagement';
import MobileAppPasswordManagement from './pages/MobileAppPasswordManagement';

const ROUTE_WORKER_VOUCHERS_LIST = 'voucher/vouchers';
const ROUTE_WORKER_VOUCHER = 'voucher/vouchers/voucher';
const ROUTE_WORKER_VOUCHER_ACQUIREMENT = 'voucher/acquirement';
const ROUTE_WORKER_VOUCHER_ASSIGNMENT = 'voucher/assignment';
const ROUTE_WORKER_VOUCHER_PRICE_MANAGEMENT = 'voucher/price';
const ROUTE_CHANGE_MOBILE_APP_PASSWORD = 'profile/mobile/password';

const DEFAULT_CONFIG = {
  translations: [{ key: 'en', messages: messages_en }],
  reducers: [{ key: 'workerVoucher', reducer }],
  refs: [
    { key: 'workerVoucher.route.workerVouchers', ref: ROUTE_WORKER_VOUCHERS_LIST },
    { key: 'workerVoucher.route.workerVoucher', ref: ROUTE_WORKER_VOUCHER },
    { key: 'workerVoucher.WorkerVoucherStatusPicker', ref: WorkerVoucherStatusPicker },
    { key: 'workerVoucher.VoucherAcquirementMethodPicker', ref: VoucherAcquirementMethodPicker },
    { key: 'workerVoucher.WorkerMultiplePicker', ref: WorkerMultiplePicker },
    { key: 'workerVoucher.WorkerDateRangePicker', ref: WorkerDateRangePicker },
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
      filter: (rights) => [VOUCHER_RIGHT_SEARCH].some((right) => rights.includes(right))
        && ![INSPECTOR_RIGHT, ADMIN_RIGHT].some((right) => rights.includes(right)),
    },
    {
      text: <FormattedMessage module="workerVoucher" id="menu.voucherAssignment" />,
      icon: <GroupAddIcon />,
      route: `/${ROUTE_WORKER_VOUCHER_ASSIGNMENT}`,
      filter: (rights, config) => config.genericVoucherEnabled
      && [VOUCHER_RIGHT_SEARCH].some((right) => rights.includes(right)),
    },
  ],
  'admin.MainMenu': [
    {
      text: <FormattedMessage module="workerVoucher" id="menu.priceManagement" />,
      icon: <MonetizationOnIcon />,
      route: `/${ROUTE_WORKER_VOUCHER_PRICE_MANAGEMENT}`,
      filter: (rights) => [VOUCHER_PRICE_MANAGEMENT_RIGHT].some((right) => rights.includes(right)),
    },
  ],
  'core.Router': [
    {
      path: ROUTE_WORKER_VOUCHERS_LIST,
      component: VouchersPage,
      requiredRights: [VOUCHER_RIGHT_SEARCH],
    },
    {
      path: `${ROUTE_WORKER_VOUCHER}/:voucher_uuid?`,
      component: VoucherDetailsPage,
      requiredRights: [VOUCHER_RIGHT_SEARCH],
    },
    {
      path: ROUTE_WORKER_VOUCHER_ACQUIREMENT,
      component: VoucherAcquirementPage,
      requiredRights: [EMPLOYER_RIGHT_SEARCH],
    },
    {
      path: ROUTE_WORKER_VOUCHER_ASSIGNMENT,
      component: VoucherAssignmentPage,
      requiredRights: [VOUCHER_RIGHT_SEARCH],
    },
    {
      path: ROUTE_WORKER_VOUCHER_PRICE_MANAGEMENT,
      component: VoucherPriceManagement,
      requiredRights: [VOUCHER_PRICE_MANAGEMENT_RIGHT],
    },
    {
      path: ROUTE_CHANGE_MOBILE_APP_PASSWORD,
      component: MobileAppPasswordManagement,
      requiredRights: [INSPECTOR_RIGHT, ADMIN_RIGHT],
    },
  ],
  'profile.MainMenu': [
    {
      text: <FormattedMessage module="workerVoucher" id="menu.mobileAppPassword" />,
      icon: <VpnLockIcon />,
      route: `/${ROUTE_CHANGE_MOBILE_APP_PASSWORD}`,
      filter: (rights) => [INSPECTOR_RIGHT, ADMIN_RIGHT].some((right) => rights.includes(right)),
    },
  ],
};

export const WorkerVoucherModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
