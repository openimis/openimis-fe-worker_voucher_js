# openIMIS Frontend Worker Voucher module

This repository holds the files of the openIMIS Frontend Worker Voucher module.
It is dedicated to be bootstrap development of [openimis-fe_js](https://github.com/openimis/openimis-fe_js) modules, providing an empty (yet deployable) module.

Please refer to [openimis-fe_js](https://github.com/openimis/openimis-fe_js) to see how to build and and deploy (in developement or server mode).

The module is built with [rollup](https://rollupjs.org/).
In development mode, you can use `npm link` and `npm start` to continuously scan for changes and automatically update your development server.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/openimis/openimis-fe-tasks_management_js.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/openimis/openimis-fe-tasks_management_js/alerts/)

## Main Menu Contributions

__Workers and Vouchers__ ('worker.MainMenu') - it is displayed if __"isWorker"__ variable is set to __true__.
    **Workers** ('menu.workers') - workers list, it is displayed if __"isWorker"__ variable is set to __true__.
    **Voucher List** ('menu.voucherList') - vouchers list, it is displayed if user has `204001` right
    **Voucher Acquirement** ('menu.voucherAcquirement') - voucher acquirement form, it is displayed if user has `204001` right 
    **Voucher Assignment** ('menu.voucherAssignment') - voucher assignment form, it is displayed if user has `204001` right

__Administration__ ('admin.mainMenu') - it is displayed by default, main entry of admin module
    **Voucher Price Management** ('menu.priceManagement') - voucher price management page, it is displayed if user has `205001` right

## Other Contributions

* `core.Router`: registering `voucher/vouchers`, `voucher/vouchers/voucher`, `voucher/acquirement`, `voucher/assignment`, `voucher/price` routes in openIMIS client-side router

## Available Contribution Points

* `workerVoucher.VoucherHeadPanel`: Designed to showcase essential information about a voucher's bill, this contribution point facilitates clear and customizable bill displays.

## Dispatched Redux Actions

* `WORKER_VOUCHER_MUTATION`, mutates and changes the state of worker voucher
* `WORKER_VOUCHER_ACQUIRE_GENERIC_VOUCHER`, handles the process of acquiring a generic voucher for worker
* `WORKER_VOUCHER_ACQUIRE_SPECIFIC_VOUCHER`, handles the process of acquiring a specific voucher for worker
* `WORKER_VOUCHER_ASSIGN_VOUCHERS`, handles the assignment of one or more vouchers to workers
* `WORKER_VOUCHER_WORKER_VOUCHERS`, fetches all worker vouchers associated with a particular employer
* `WORKER_VOUCHER_GET_WORKER_VOUCHER`, fetches information about a specific worker voucher
* `WORKER_VOUCHER_VOUCHER_PRICES`, fetches the voucher prices
* `WORKER_VOUCHER_MANAGE_VOUCHER_PRICE`, manages and updates the price of worker vouchers for specific time period
* `WORKER_VOUCHER_DELETE_VOUCHER_PRICE`, deletes the price of a worker voucher within the context of a specific time frame

## Other Modules Listened Redux Actions

--- None ---

## Other Modules Redux State Bindings

* `state.core.user`, to access user info (rights,...)

## Configurations Options

- `isWorker`: Specifies whether the individual should be classified and managed as a worker or a standard insuree. In Moldova, the Insuree entity is also used to represent workers. When set to true, the system displays 'Workers and Vouchers' instead of the default 'Insurees and Policies', aligning the interface with the specific needs of worker representation. Default: __false__.
- `genericVoucherEnabled`: Specifies whether the system should enable the use of generic vouchers for the worker. When set to true, the system provides additional functionalities for handling generic vouchers, aligning the interface with the specific needs of voucher management. Default: __false__.
