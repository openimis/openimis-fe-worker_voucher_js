import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { IconButton, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import {
  Searcher, useModulesManager, useTranslations, AmountInput, toISODate, SelectDialog,
} from '@openimis/fe-core';
import VoucherPriceFilter from './VoucherPriceFilter';
import { deleteVoucherPrice } from '../actions';
import { MODULE_NAME, VOUCHER_PRICE_DEFAULT_PAGE_SIZE, VOUCHER_PRICE_ROWS_PER_PAGE } from '../constants';

function VoucherPriceSearcher({
  fetch, items, fetchedItems, errorItems, itemsPageInfo, voucherPricesTotalCount,
}) {
  const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [priceToDelete, setPriceToDelete] = useState(null);

  const onDialogOpen = (voucherPriceId) => {
    setDialogOpen((prevState) => !prevState);
    setPriceToDelete(voucherPriceId);
  };

  const onDialogClose = () => {
    setDialogOpen((prevState) => !prevState);
    setPriceToDelete(null);
  };

  const onDialogConfirm = async () => {
    try {
      await dispatch(deleteVoucherPrice(priceToDelete, 'Delete Voucher Price'));
    } catch (error) {
      throw new Error(`[VOUCHER_PRICE_SEARCHER]: Deletion failed. ${error}`);
    } finally {
      setDialogOpen((prevState) => !prevState);
    }
  };

  const isRowDisabled = (_, row) => !!row.isDeleted;

  const headers = () => ['searcher.price', 'validFrom', 'validTo'];

  const itemFormatters = () => [
    (voucherPrice) => (
      <AmountInput module="workerVoucher" withLabel={false} value={voucherPrice?.value} readOnly displayZero />
    ),
    (voucherPrice) => toISODate(voucherPrice.dateValidFrom),
    (voucherPrice) => toISODate(voucherPrice.dateValidTo),
    (voucherPrice) => (
      <Tooltip title={formatMessage('voucherPrice.delete')}>
        <IconButton onClick={() => onDialogOpen(voucherPrice.uuid)} disabled={voucherPrice.isDeleted}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    ),
  ];

  const sorts = () => [
    ['value', true],
    ['date_valid_from', true],
    ['date_valid_to', true],
  ];

  const voucherPriceFilter = ({ filters, onChangeFilters }) => (
    <VoucherPriceFilter
      filters={filters}
      onChangeFilters={onChangeFilters}
      formatMessage={formatMessage}
    />
  );

  return (
    <>
      <Searcher
        module="workerVoucher"
        FilterPane={voucherPriceFilter}
        itemsPageInfo={itemsPageInfo}
        items={items}
        fetchedItems={fetchedItems}
        errorItems={errorItems}
        fetch={fetch}
        tableTitle={formatMessageWithValues('searcher.title', { count: voucherPricesTotalCount })}
        defaultOrderBy="value"
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={VOUCHER_PRICE_ROWS_PER_PAGE}
        defaultPageSize={VOUCHER_PRICE_DEFAULT_PAGE_SIZE}
        rowDisabled={isRowDisabled}
        rowHighlightedAlt={isRowDisabled}
      />
      <SelectDialog
        confirmState={dialogOpen}
        onConfirm={() => onDialogConfirm()}
        onClose={() => onDialogClose()}
        module="workerVoucher"
        confirmTitle="priceManagement.dialog.title"
        confirmMessage="priceManagement.dialog.message"
        confirmationButton="priceManagement.dialog.confirm"
        rejectionButton="priceManagement.dialog.abandon"
      />
    </>
  );
}

export default VoucherPriceSearcher;
