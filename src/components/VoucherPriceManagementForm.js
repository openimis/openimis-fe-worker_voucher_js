import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Divider, Grid, Paper, Typography, Button, Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import {
  useModulesManager, useTranslations, journalize, parseData, coreAlert,
} from '@openimis/fe-core';
import PriceManagementForm from './PriceManagementForm';
import VoucherPriceSearcher from './VoucherPriceSearcher';
import { fetchMutation, fetchVoucherPrices, manageVoucherPrice } from '../actions';
import { DEFAULT_VOUCHER_PRICE_FILTERS, MODULE_NAME, VOUCHER_PRICE_MANAGEMENT_BUSINESS_KEY } from '../constants';

export const useStyles = makeStyles((theme) => ({
  paper: { ...theme.paper.paper, margin: '10px 0 0 0' },
  paperHeaderTitle: {
    ...theme.paper.title,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableTitle: theme.table.title,
  item: theme.paper.item,
}));

function VoucherPriceManagementForm() {
  const prevSubmittingMutationRef = useRef();
  const modulesManager = useModulesManager();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);
  const [priceManagement, setPriceManagement] = useState({});
  const { mutation, submittingMutation } = useSelector((state) => state.workerVoucher);
  const {
    voucherPrices,
    voucherPricesTotalCount,
    voucherPricesPageInfo,
    fetchedVoucherPrices,
    errorVoucherPrices,
  } = useSelector((state) => state.workerVoucher);

  const priceManagementBlocked = (priceManagement) => !priceManagement?.price
  || !priceManagement?.validFrom
  || !priceManagement?.validTo;

  const fetchPrices = async (params) => {
    try {
      const queryParams = [...params, `key: "${VOUCHER_PRICE_MANAGEMENT_BUSINESS_KEY}"`];
      dispatch(fetchVoucherPrices(queryParams));
    } catch (error) {
      throw new Error(`[VOUCHER_PRICE_SEARCHER]: Fetching voucher prices failed. ${error}`);
    }
  };

  const onPriceManagementChange = async () => {
    try {
      const { payload } = await dispatch(
        manageVoucherPrice(
          VOUCHER_PRICE_MANAGEMENT_BUSINESS_KEY,
          priceManagement?.price,
          priceManagement?.validFrom,
          priceManagement?.validTo,
          'Manage Voucher Price',
        ),
      );

      const { clientMutationId } = payload.data.createBusinessConfig;
      const mutationResponse = await dispatch(fetchMutation(clientMutationId));
      const currentMutation = parseData(mutationResponse.payload.data.mutationLogs)?.[0];

      if (currentMutation.error) {
        const errorDetails = JSON.parse(currentMutation.error);

        dispatch(
          coreAlert(
            formatMessage('menu.priceManagement'),
            formatMessage(errorDetails?.detail || 'NOT_FOUND'),
          ),
        );
        return;
      }

      dispatch(
        coreAlert(
          formatMessage('menu.priceManagement'),
          formatMessageWithValues('priceManagement.success', {
            price: priceManagement.price,
            dateFrom: priceManagement.validFrom,
            dateTo: priceManagement.validTo,
          }),
        ),
      );

      setPriceManagement({});
      await fetchPrices(DEFAULT_VOUCHER_PRICE_FILTERS);
    } catch (error) {
      throw new Error(`[VOUCHER_PRICE_MANAGEMENT]: Price change failed. ${error}`);
    }
  };

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      dispatch(journalize(mutation));
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  return (
    <>
      <Grid container>
        <Grid xs={12}>
          <Paper className={classes.paper}>
            <Grid xs={12}>
              <Grid container className={classes.paperHeaderTitle}>
                <Typography variant="h5">{formatMessage('menu.priceManagement')}</Typography>
                <Tooltip
                  title={
                    priceManagementBlocked(priceManagement)
                      ? formatMessage('vouchers.required')
                      : formatMessage('priceManagement')
                  }
                >
                  <span>
                    <Button
                      variant="outlined"
                      style={{ border: 0 }}
                      onClick={onPriceManagementChange}
                      disabled={priceManagementBlocked(priceManagement)}
                    >
                      <Typography variant="subtitle1">{formatMessage('priceManagement')}</Typography>
                    </Button>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
            <Divider />
            <Grid>
              <Typography variant="subtitle1" style={{ padding: '4px' }}>
                {formatMessage('priceManagement.subtitle')}
              </Typography>
            </Grid>
            <Divider />
            <PriceManagementForm
              edited={priceManagement}
              onEditedChange={setPriceManagement}
              formatMessage={formatMessage}
              classes={classes}
            />
          </Paper>
        </Grid>
      </Grid>
      <VoucherPriceSearcher
        fetch={fetchPrices}
        items={voucherPrices}
        fetchedItems={fetchedVoucherPrices}
        voucherPricesTotalCount={voucherPricesTotalCount}
        itemsPageInfo={voucherPricesPageInfo}
        errorItems={errorVoucherPrices}
      />
    </>
  );
}

export default VoucherPriceManagementForm;
