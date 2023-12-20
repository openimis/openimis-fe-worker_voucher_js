import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Divider, Grid, Paper, Typography, Button, Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import {
  useModulesManager, useTranslations, journalize,
  // coreAlert,
} from '@openimis/fe-core';
import { MODULE_NAME } from '../constants';
import PriceManagementForm from './PriceManagementForm';
import VoucherPriceSearcher from './VoucherPriceSearcher';

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
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [priceManagement, setPriceManagement] = useState({});
  const { mutation, submittingMutation } = useSelector((state) => state.workerVoucher);

  const priceManagementBlocked = (priceManagement) => !priceManagement?.price
  || !priceManagement?.validFrom || !priceManagement?.validTo;

  const fetchVoucherPrices = async (params) => {
    try {
      // TODO: Fetch vouchers
      console.log(params);
    } catch (error) {
      throw new Error(`[VOUCHER_PRICE_SEARCHER]: Fetching voucher prices failed. ${error}`);
    }
  };

  const onPriceManagementChange = async () => {
    try {
      // TODO: alert if error
      // < ----- >
      await fetchVoucherPrices();
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
                <Typography variant="h5">{formatMessage('workerVoucher.menu.priceManagement')}</Typography>
                <Tooltip
                  title={
                    priceManagementBlocked(priceManagement)
                      ? formatMessage('workerVoucher.vouchers.required')
                      : formatMessage('workerVoucher.priceManagement')
                  }
                >
                  <span>
                    <Button
                      variant="outlined"
                      style={{ border: 0 }}
                      onClick={onPriceManagementChange}
                      disabled={priceManagementBlocked(priceManagement)}
                    >
                      <Typography variant="subtitle1">{formatMessage('workerVoucher.priceManagement')}</Typography>
                    </Button>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
            <Divider />
            <Grid>
              <Typography variant="subtitle1" style={{ padding: '4px' }}>
                {formatMessage('workerVoucher.priceManagement.subtitle')}
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
        fetch={fetchVoucherPrices}
        items={[{}]}
        fetchedItems={false}
        voucherPricesTotalCount={0}
        itemsPageInfo={{}}
        errorItems={null}
      />
    </>
  );
}

export default VoucherPriceManagementForm;
