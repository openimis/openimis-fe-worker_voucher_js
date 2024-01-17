import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Divider, Grid, Paper, Typography, Button, Tooltip, Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  useModulesManager, useTranslations, useGraphqlMutation, TextInput, coreAlert,

} from '@openimis/fe-core';
import { MODULE_NAME } from '../constants';

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

function MobileAppPasswordForm() {
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const userHasPassword = useSelector((state) => state.core.user.i_user.has_password);
  const [passwordEntries, setPasswordEntries] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const { mutate, isLoading } = useGraphqlMutation(
    `
    mutation changePassword ($input: ChangePasswordMutationInput!) {
      changePassword(input: $input) {
        clientMutationId
        success
        error
      }
    }
  `,
    { wait: false },
  );

  const formBlocked = (values) => {
    const { newPassword, confirmPassword, oldPassword } = values;

    const isBlocked = isLoading
    || !newPassword
    || !confirmPassword
    || newPassword !== confirmPassword;

    return userHasPassword ? (isBlocked || !oldPassword || oldPassword === newPassword) : isBlocked;
  };

  const onPasswordChange = async (e) => {
    e.preventDefault();

    try {
      const response = await mutate({
        oldPassword: passwordEntries.oldPassword,
        newPassword: passwordEntries.newPassword,
      });

      if (response?.changePassword?.error) {
        setPasswordEntries({ oldPassword: '', newPassword: '', confirmPassword: '' });
        dispatch(coreAlert(formatMessage('action.failed'), userHasPassword
          ? formatMessage('password.failed') : formatMessage('password.set.failed')));
        return;
      }

      setPasswordEntries({ oldPassword: '', newPassword: '', confirmPassword: '' });
      dispatch(coreAlert(formatMessage('action.success'), userHasPassword
        ? formatMessage('password.success') : formatMessage('password.set.success')));
    } catch (error) {
      throw new Error(`[MOBILE_APP_PASSWORD_CHANGE]: Password change failed. ${error}`);
    }
  };

  return (
    <Grid container>
      <Grid xs={12}>
        <Paper className={classes.paper}>
          <Grid xs={12}>
            <Grid container className={classes.paperHeaderTitle}>
              <Typography variant="h5">{formatMessage('menu.mobileAppPassword')}</Typography>
              <Tooltip
                title={
                formBlocked(passwordEntries)
                  ? formatMessage('vouchers.required')
                  : formatMessage('mobileAppPassword')
              }
              >
                <span>
                  <Button
                    variant="outlined"
                    style={{ border: 0 }}
                    onClick={onPasswordChange}
                    disabled={formBlocked(passwordEntries)}
                  >
                    <Typography variant="subtitle1">{formatMessage('mobileAppPassword')}</Typography>
                  </Button>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
          <Divider />
          <Grid>
            {!userHasPassword && (
            <Box style={{
              backgroundColor: 'khaki',
              padding: '15px',
              margin: '16px 8px 8px 8px',
              borderLeft: '5px solid #ffa000',
              borderRadius: '10px',
            }}
            >
              <Typography variant="subtitle1">
                <strong>
                  {formatMessage('mobileAppPassword.header.warning')}
                  {' '}
                </strong>
                {formatMessage('mobileAppPassword.warning')}
              </Typography>
            </Box>
            )}
            <Box padding="10px">
              <Grid container spacing={2}>
                <Grid xs={3} item>
                  <TextInput
                    module="profile"
                    required={userHasPassword}
                    readOnly={!userHasPassword}
                    type="password"
                    label="ChangePasswordPage.oldPasswordLabel"
                    value={passwordEntries.oldPassword}
                    onChange={(oldPassword) => setPasswordEntries((entries) => ({ ...entries, oldPassword }))}

                  />
                </Grid>
                <Grid xs={3} item>
                  <TextInput
                    module="profile"
                    required
                    type="password"
                    label="ChangePasswordPage.newPasswordLabel"
                    value={passwordEntries.newPassword}
                    onChange={(newPassword) => setPasswordEntries((entries) => ({ ...entries, newPassword }))}
                    error={
                      passwordEntries.oldPassword
                      && passwordEntries.newPassword
                      && passwordEntries.oldPassword === passwordEntries.newPassword
                      && formatMessage('password.oldAndNew')
                    }
                  />
                </Grid>
                <Grid xs={3} item>
                  <TextInput
                    module="profile"
                    required
                    type="password"
                    label="ChangePasswordPage.confirmPasswordLabel"
                    error={
                      passwordEntries.newPassword
                      && passwordEntries.confirmPassword
                      && passwordEntries.newPassword !== passwordEntries.confirmPassword
                      && formatMessage('password.mustMatch')
                    }
                    value={passwordEntries.confirmPassword}
                    onChange={(confirmPassword) => setPasswordEntries((entries) => ({ ...entries, confirmPassword }))}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Divider />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default MobileAppPasswordForm;
