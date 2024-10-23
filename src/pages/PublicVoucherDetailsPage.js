import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';

import {
  Box, Button, Divider, Grid, Paper, Typography,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/styles';

import {
  decodeId, parseData, useHistory, useModulesManager, useTranslations,
} from '@openimis/fe-core';
import { fetchPublicVoucherDetails } from '../actions';
import { EMPTY_STRING, MODULE_NAME } from '../constants';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  paper: {
    ...theme.paper.paper,
    padding: theme.spacing(4),
    textAlign: 'center',
    maxWidth: 600,
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  logo: {
    maxWidth: 200,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      maxWidth: 120,
    },
  },
  title: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.5rem',
    },
  },
  content: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.9rem',
    },
  },
  box: {
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing(1),
    fontSize: '1.2rem',
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    wordBreak: 'break-word',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1rem',
      alignItems: 'center',
      flexDirection: 'column',
    },
  },
  notFoundBox: {
    backgroundColor: '#ffebee',
    border: '1px solid #f44336',
    color: '#c62828',
  },
  warningBox: {
    backgroundColor: '#fff3e0',
    border: '1px solid #ff9800',
    color: '#f57c00',
  },
  foundBox: {
    backgroundColor: '#e0f7fa',
    border: '1px solid #009688',
    color: '#00796b',
  },
  button: theme.dialog.primaryButton,
}));

export default function PublicVoucherDetailsPage({ match, logo }) {
  const modulesManager = useModulesManager();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME);
  const voucherUuid = match.params.voucher_uuid;
  const [voucherSearcher, setVoucherSearcher] = useState({
    isExisted: false,
    isValid: false,
    assignedDate: EMPTY_STRING,
    employerCode: EMPTY_STRING,
    employerName: EMPTY_STRING,
  });

  useEffect(() => {
    const fetchVoucher = async () => {
      if (voucherUuid) {
        try {
          const response = await dispatch(fetchPublicVoucherDetails(voucherUuid));
          const vouchers = parseData(response.payload.data.workerVoucher);
          const voucherData = vouchers?.map((voucher) => ({
            ...voucher,
            uuid: decodeId(voucher.id),
          }))?.[0];

          setVoucherSearcher({
            isFound: Boolean(voucherData),
            voucherDetails: voucherData || {},
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`[PUBLIC_VOUCHER_DETAILS_PAGE]: Fetching voucher details failed. ${error}`);
        }
      }
    };

    fetchVoucher();
  }, [voucherUuid, dispatch, modulesManager]);

  if (!voucherUuid) {
    return (
      <RootLayout logo={logo}>
        <InfoBox
          icon={<ErrorIcon />}
          message={formatMessage('PublicVoucherDetailsPage.noVoucherUuid')}
          className={clsx(classes.box, classes.notFoundBox)}
        />
      </RootLayout>
    );
  }

  const {
    isExisted, isValid, assignedDate, employerCode, employerName,
  } = voucherSearcher;

  const renderMessage = () => {
    if (!isExisted) {
      return formatMessage('PublicVoucherDetailsPage.voucherNotFound');
    }

    return formatMessageWithValues(
      isValid ? 'PublicVoucherDetailsPage.voucherFound' : 'PublicVoucherDetailsPage.invalidVoucherFound',
      {
        assignedDate,
        employerCode,
        employerName,
      },
    );
  };

  const renderIcon = () => {
    if (!isExisted) {
      return <ErrorIcon />;
    }

    return isValid ? <CheckIcon /> : <WarningIcon />;
  };

  return (
    <RootLayout logo={logo}>
      <InfoBox
        icon={renderIcon()}
        message={renderMessage()}
        className={clsx({
          [classes.box]: true,
          [classes.notFoundBox]: !isExisted,
          [classes.foundBox]: isExisted && isValid,
          [classes.warningBox]: isExisted && !isValid,
        })}
      />
    </RootLayout>
  );
}

function InfoBox({ icon, message, className }) {
  return (
    <Box className={className}>
      {icon}
      <Typography variant="body1">{message}</Typography>
    </Box>
  );
}

function RootLayout({ children, logo }) {
  const classes = useStyles();
  const history = useHistory();
  const { formatMessage } = useTranslations(MODULE_NAME);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ position: 'relative' }}>
            <Button
              onClick={() => history.push('/')}
              startIcon={<ArrowBackIcon />}
              color="primary"
              variant="text"
              style={{ position: 'absolute', left: 0, top: 0 }}
            >
              {formatMessage('PublicVoucherDetailsPage.backButton')}
            </Button>
            <img src={logo} alt="Logo" className={classes.logo} />
            <Typography variant="h5" className={classes.title}>
              {formatMessage('PublicVoucherDetailsPage.title')}
            </Typography>
            <Divider />
            <div className={classes.content}>{children}</div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
