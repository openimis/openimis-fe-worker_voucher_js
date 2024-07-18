import React, {
  forwardRef, useState, useEffect, useMemo,
} from 'react';
import { useDispatch } from 'react-redux';

import { Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useTranslations, useModulesManager, formatDateFromISO } from '@openimis/fe-core';
import { MODULE_NAME, REF_GET_BILL_LINE_ITEM } from '../constants';

const useStyles = makeStyles(() => ({
  topHeader: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    width: '100%',

    '& img': {
      minWidth: '250px',
      maxWidth: '300px',
      width: 'auto',
      height: 'auto',
    },
  },
  printContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontWeight: '500',
  },
  date: {
    fontSize: '16px',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    width: '100%',
  },
  detailRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px',
  },
  detailName: {
    fontWeight: '600',
    fontSize: '16px',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontWeight: '500',
    backgroundColor: '#f5f5f5',
    padding: '6px',
    borderRadius: '8px',
    fontSize: '15px',
  },
  containerPadding: {
    padding: '32px',
  },
  dividerMargin: {
    margin: '12px 0',
  },
}));

const VoucherDetailsPrintTemplate = forwardRef(({ workerVoucher, logo }, ref) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations(modulesManager, MODULE_NAME);

  const getBillLineItem = useMemo(() => modulesManager.getRef(REF_GET_BILL_LINE_ITEM), [modulesManager]);
  const [voucherValue, setVoucherValue] = useState(null);

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
    <div ref={ref} className={classes.containerPadding}>
      <div className={classes.topHeader}>
        <img src={logo} alt="Logo of Ministerul Muncii și Protecţiei Sociale al Republicii Moldova" />
      </div>
      <Divider className={classes.dividerMargin} />
      <div className={classes.detailsContainer}>
        <div className={classes.detailRow}>
          <p className={classes.detailName}>{formatMessage('workerVoucher.template.voucherCode')}</p>
          <p className={classes.detailValue}>{workerVoucher.code}</p>
        </div>
        <div className={classes.detailRow}>
          <p className={classes.detailName}>{formatMessage('workerVoucher.template.status')}</p>
          <p className={classes.detailValue}>{workerVoucher.status}</p>
        </div>
        <div className={classes.detailRow}>
          <p className={classes.detailName}>{formatMessage('workerVoucher.template.worker')}</p>
          <p className={classes.detailValue}>
            {`${workerVoucher.insuree?.otherNames} ${workerVoucher.insuree?.lastName}`}
          </p>
        </div>
        <div className={classes.detailRow}>
          <p className={classes.detailName}>{formatMessage('workerVoucher.template.employer')}</p>
          <p className={classes.detailValue}>
            {`${workerVoucher.policyholder?.code} ${workerVoucher.policyholder?.tradeName}`}
          </p>
        </div>
        <div className={classes.detailRow}>
          <p className={classes.detailName}>{formatMessage('workerVoucher.template.createdDate')}</p>
          <p className={classes.detailValue}>{formatDateFromISO(modulesManager, null, workerVoucher.dateCreated)}</p>
        </div>
        <div className={classes.detailRow}>
          <p className={classes.detailName}>{formatMessage('workerVoucher.template.assignedDate')}</p>
          <p className={classes.detailValue}>{formatDateFromISO(modulesManager, null, workerVoucher.assignedDate)}</p>
        </div>
        <div className={classes.detailRow}>
          <p className={classes.detailName}>{formatMessage('workerVoucher.template.valueOfVoucher')}</p>
          <p className={classes.detailValue}>{`${formatMessage('currency')} ${voucherValue}`}</p>
        </div>
      </div>
    </div>
  );
});

export default VoucherDetailsPrintTemplate;
