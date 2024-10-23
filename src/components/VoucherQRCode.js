import React from 'react';
import QRCode from 'react-qr-code';
import { makeStyles } from '@material-ui/styles';

import { Grid } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  qrContainer: {
    height: 'auto',
    margin: '12px auto',
    maxWidth: 128,
    width: '100%',
  },
  qrCode: {
    height: 'auto',
    maxWidth: '100%',
    width: '100%',
  },
}));

export default function VoucherQRCode({ voucher, bgColor = '#e4f2ff' }) {
  if (!voucher) {
    return null;
  }

  const classes = useStyles();
  const voucherUrl = new URL(`${window.location.origin}${process.env.PUBLIC_URL}/voucher/check/${voucher.code}`);

  return (
    <Grid item xs={12}>
      <div className={classes.qrContainer}>
        <QRCode
          size={128}
          className={classes.qrCode}
          value={voucherUrl.toString()}
          viewBox="0 0 256 256"
          level="H"
          bgColor={bgColor}
          fgColor="#000000"
        />
      </div>
    </Grid>
  );
}
