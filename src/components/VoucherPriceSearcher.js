import React from 'react';

import { Searcher, useModulesManager, useTranslations } from '@openimis/fe-core';
import { MODULE_NAME, VOUCHER_PRICE_DEFAULT_PAGE_SIZE, VOUCHER_PRICE_ROWS_PER_PAGE } from '../constants';
import VoucherPriceFilter from './VoucherPriceFilter';

function VoucherPriceSearcher({
  fetch, items, fetchedItems, errorItems, itemsPageInfo, voucherPricesTotalCount,
}) {
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);

  const headers = () => ['workerVoucher.searcher.price', 'workerVoucher.validFrom', 'workerVoucher.validTo'];

  const itemFormatters = () => [
    (voucherPrice) => voucherPrice.price,
    (voucherPrice) => voucherPrice.validFrom,
    (voucherPrice) => voucherPrice.validTo,
  ];

  const sorts = () => [
    ['price', true],
    ['validFrom', true],
    ['validTo', true],
  ];

  const voucherPriceFilter = ({ filters, onChangeFilters }) => (
    <VoucherPriceFilter filters={filters} onChangeFilters={onChangeFilters} formatMessage={formatMessage} />
  );

  return (
    <Searcher
      module="workerVoucher"
      FilterPane={voucherPriceFilter}
      itemsPageInfo={itemsPageInfo}
      items={items}
      fetchedItems={fetchedItems}
      errorItems={errorItems}
      fetch={fetch}
      tableTitle={formatMessageWithValues('workerVoucher.searcher.title', { count: voucherPricesTotalCount })}
      defaultOrderBy="price"
      headers={headers}
      itemFormatters={itemFormatters}
      sorts={sorts}
      rowsPerPageOptions={VOUCHER_PRICE_ROWS_PER_PAGE}
      defaultPageSize={VOUCHER_PRICE_DEFAULT_PAGE_SIZE}
    />
  );
}

export default VoucherPriceSearcher;
