import React, {
  forwardRef, useState, useEffect, useMemo,
} from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';

import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useTranslations, useModulesManager } from '@openimis/fe-core';
import {
  EMPTY_STRING, MODULE_NAME, REF_GET_BILL_LINE_ITEM, WORKER_VOUCHER_STATUS,
} from '../constants';
import { extractEmployerName, extractWorkerName } from '../utils/utils';
import VoucherQRCode from './VoucherQRCode';

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
    padding: '12px',
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
    textAlign: 'left',
  },
  annotation: {
    fontSize: '12px',
    fontStyle: 'italic',
  },
  voucherTitle: {
    fontSize: '28px',
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
  fields: {
    display: 'flex',
    flexDirection: 'column',
  },
  manualFill: {
    gap: '16px',
  },
  assignedFields: {
    gap: '4px',
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

        <div
          className={clsx({
            [classes.fields]: true,
            [classes.manualFill]: !isAssignedStatus,
            [classes.assignedFields]: isAssignedStatus,
          })}
        >
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
          <p className={classes.voucherValue}>{`${voucherValue || 0} ${formatMessage('currency')}`}</p>
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
        <div>
          <VoucherQRCode voucher={workerVoucher} bgColor="#FFFFFF" size={256} />
        </div>
      </div>
    </div>
  );
});

export default VoucherDetailsPrintTemplate;
