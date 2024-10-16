import React, {
  forwardRef, useState, useEffect, useMemo,
} from 'react';
import { useDispatch } from 'react-redux';

import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useTranslations, useModulesManager } from '@openimis/fe-core';
import {
  EMPTY_STRING, MODULE_NAME, REF_GET_BILL_LINE_ITEM, WORKER_VOUCHER_STATUS,
} from '../constants';
import { extractEmployerName, extractWorkerName } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  '@global': {
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '320px',
    padding: '24px',
    justifyContent: 'space-between',
    borderLeft: `10px solid ${theme.palette.primary.main}`,
    borderRight: `10px solid ${theme.palette.primary.main}`,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  voucherValue: {
    fontSize: '48px',
    fontWeight: 900,
    letterSpacing: '-2px',
    textAlign: 'right',
  },
  annotation: {
    fontSize: '12px',
    fontStyle: 'italic',
  },
  voucherTitle: {
    fontSize: '32px',
    fontWeight: 900,
    textTransform: 'uppercase',
  },
  voucherDetail: {
    fontSize: '16px',
    fontWeight: 400,
  },
  workerInfo: {
    fontSize: '16px',
    fontWeight: 500,
  },
  manualFill: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
}));

const VoucherDetailsPrintTemplate = forwardRef(({ workerVoucher, logo }, ref) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues } = useTranslations(modulesManager, MODULE_NAME);
  const isAssignedStatus = workerVoucher.status === WORKER_VOUCHER_STATUS.ASSIGNED;
  const [voucherValue, setVoucherValue] = useState(null);
  const getBillLineItem = useMemo(() => modulesManager.getRef(REF_GET_BILL_LINE_ITEM), [modulesManager]);

  useEffect(() => {
    const fetchVoucherValue = async () => {
      try {
        const value = await dispatch(getBillLineItem([`lineId: "${workerVoucher.uuid}"`])).then(
          (response) => response?.payload?.data?.billItem?.edges?.[0]?.node?.unitPrice,
        );

        setVoucherValue(value);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching voucher value:', error);
      }
    };

    fetchVoucherValue();
  }, [dispatch, getBillLineItem, workerVoucher.uuid]);

  return (
    <div ref={ref} className={classes.container}>
      <div className={classes.section}>
        {isAssignedStatus ? (
          EMPTY_STRING
        ) : (
          <p className={classes.annotation}>{formatMessage('workerVoucher.template.validityAnnotation')}</p>
        )}

        <div>
          <p className={classes.voucherTitle}>{formatMessage('workerVoucher.template.employmentVoucher')}</p>
          <p className={classes.voucherDetail}>
            {formatMessageWithValues('workerVoucher.template.voucherIdNo', {
              idNo: workerVoucher.code,
            })}
          </p>
          <p className={classes.voucherDetail}>
            {formatMessageWithValues('workerVoucher.template.voucherEmployer', {
              employer: extractEmployerName(workerVoucher.policyholder),
            })}
          </p>
        </div>

        <div className={classes.manualFill}>
          <div>
            <p className={classes.workerInfo}>{extractWorkerName(workerVoucher.insuree, isAssignedStatus)}</p>
            <Divider />
            <p className={classes.annotation}>{formatMessage('workerVoucher.template.workerAnnotation')}</p>
          </div>
          <div>
            <p className={classes.workerInfo}>
              {isAssignedStatus && workerVoucher?.assignedDate ? workerVoucher.assignedDate : EMPTY_STRING}
            </p>
            <Divider />
            <p className={classes.annotation}>{formatMessage('workerVoucher.template.validOn')}</p>
          </div>
        </div>
      </div>

      <div className={classes.section}>
        <div className={classes.ministryLogo}>
          <img
            src={logo}
            style={{ width: '240px' }}
            alt="Logo of Ministerul Muncii și Protecţiei Sociale al Republicii Moldova"
          />
        </div>
        <p className={classes.voucherValue}>{`${voucherValue || 0} ${formatMessage('currency')}`}</p>
      </div>
    </div>
  );
});

export default VoucherDetailsPrintTemplate;
