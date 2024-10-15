import React, { useRef, useState } from 'react';

import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DescriptionIcon from '@material-ui/icons/Description';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/styles';

import { useModulesManager, useTranslations } from '@openimis/fe-core';
import { MODULE_NAME, UPLOAD_STAGE } from '../constants';
import { useUploadWorkerContext } from '../context/UploadWorkerContext';

const useStyles = makeStyles((theme) => ({
  primaryButton: theme.dialog.primaryButton,
  secondaryButton: theme.dialog.secondaryButton,
  errorButton: {
    ...theme.dialog.primaryButton,
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.error.main, 0.5),
      color: theme.palette.error.main,
    },
  },
  wrapper: {
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
  },
  uploadBox: {
    width: '100%',
    minHeight: '140px',
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  input: {
    display: 'none',
  },
  statusBox: {
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    flexDirection: 'row',
    marginBottom: theme.spacing(1),
  },
  successBox: {
    backgroundColor: '#e0f7fa',
    border: '1px solid #009688',
    color: '#00796b',
  },
  warningBox: {
    backgroundColor: '#fff3e0',
    border: '1px solid #ff9800',
    color: '#e65100',
  },
  errorBox: {
    backgroundColor: '#ffebee',
    border: '1px solid #f44336',
    color: '#c62828',
  },
  summaryTextField: {
    width: '100%',
  },
}));

function UploadWorkerModal({ open, onClose }) {
  const classes = useStyles();
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);
  const fileInputRef = useRef(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const maxSizeInMB = 10;

  const {
    file,
    isUploading,
    uploadStage,
    validationError,
    validationSuccess,
    validationWarning,
    onFileUpload,
    isUploaded,
    onWorkersUpload,
    uploadSummary,
    resetFile,
  } = useUploadWorkerContext();

  const isFileUploadStage = uploadStage === UPLOAD_STAGE.FILE_UPLOAD;
  const isWorkerUploadStage = uploadStage === UPLOAD_STAGE.WORKER_UPLOAD;

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];

    if (!uploadedFile) {
      setFileUploadError(formatMessage('UploadWorkerModal.fileRequired'));
      return;
    }

    if (uploadedFile.size > maxSizeInMB * 1024 * 1024) {
      setFileUploadError(
        formatMessageWithValues('UploadWorkerModal.fileSizeError', {
          fileSize: maxSizeInMB,
        }),
      );
      return;
    }

    onFileUpload(uploadedFile);
  };

  const handleDeleteFile = () => {
    resetFile();
    fileInputRef.current.value = null;
  };

  return (
    <Dialog open={open} onClose={onClose} disableBackdropClick>
      <DialogTitle>{formatMessage('UploadWorkerModal.dialogTitle')}</DialogTitle>
      <DialogContent className={classes.wrapper}>
        {isFileUploadStage && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              className={classes.input}
              disabled={isUploading}
              onChange={handleFileChange}
              accept=".csv, .xlsx"
            />

            <ButtonBase className={classes.uploadBox} onClick={() => fileInputRef.current.click()}>
              {isUploading && <CircularProgress />}

              {!isUploading && fileUploadError && (
                <Box className={`${classes.statusBox} ${classes.errorBox}`}>
                  <ErrorIcon />
                  <Typography variant="subtitle1">{fileUploadError}</Typography>
                </Box>
              )}

              {!isUploading && !fileUploadError && !isUploaded && (
                <>
                  <CloudUploadIcon fontSize="large" />
                  <Typography variant="subtitle1">{formatMessage('UploadWorkerModal.uploadPrompt')}</Typography>
                  <Typography variant="caption">{formatMessage('UploadWorkerModal.uploadCaption')}</Typography>
                </>
              )}

              {!isUploading && !fileUploadError && isUploaded && file && (
                <>
                  <DescriptionIcon fontSize="large" />
                  <Typography variant="subtitle1">
                    {formatMessageWithValues('UploadWorkerModal.uploadSuccess', {
                      button: <strong>{formatMessage('UploadWorkerModal.upload')}</strong>,
                    })}
                  </Typography>
                  <Typography variant="caption">
                    {formatMessageWithValues('UploadWorkerModal.uploadSuccessCaption', {
                      fileName: <strong>{file.name}</strong>,
                      fileSize: <strong>{(file.size / 1024 / 1024).toFixed(2)}</strong>,
                    })}
                  </Typography>
                </>
              )}
            </ButtonBase>
          </>
        )}
        {isWorkerUploadStage && (
          <>
            {!isUploading && (
              <Grid item xs={12}>
                {validationError && (
                  <Box className={`${classes.statusBox} ${classes.errorBox}`}>
                    <ErrorIcon />
                    <Typography variant="subtitle1">{validationError}</Typography>
                  </Box>
                )}
                {validationSuccess && (
                  <Box className={`${classes.statusBox} ${classes.successBox}`}>
                    <CheckCircleIcon />
                    <Typography variant="subtitle1">{validationSuccess}</Typography>
                  </Box>
                )}
                {validationWarning && (
                  <Box className={`${classes.statusBox} ${classes.warningBox}`}>
                    <WarningIcon />
                    <Typography variant="subtitle1">{validationWarning}</Typography>
                  </Box>
                )}
              </Grid>
            )}

            <div className={classes.uploadBox} style={{ gap: '16px' }}>
              {isUploading ? (
                <CircularProgress />
              ) : (
                Object.entries(uploadSummary).map(([key, value]) => (
                  <TextField
                    key={key}
                    className={classes.summaryTextField}
                    label={formatMessage(`UploadWorkerModal.${key}`)}
                    value={value}
                    disabled
                  />
                ))
              )}
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        {isFileUploadStage && (
          <>
            <Button disabled={isUploading} onClick={onClose} className={classes.secondaryButton}>
              {formatMessage('UploadWorkerModal.close')}
            </Button>
            {isUploaded && !fileUploadError && file && (
              <>
                <Button disabled={isUploading} onClick={handleDeleteFile} className={classes.errorButton}>
                  {formatMessage('UploadWorkerModal.clearFile')}
                </Button>
                <Button disabled={isUploading} onClick={onWorkersUpload} className={classes.primaryButton}>
                  {formatMessage('UploadWorkerModal.upload')}
                </Button>
              </>
            )}
          </>
        )}
        {isWorkerUploadStage && (
          <Button
            onClick={() => {
              resetFile();
              onClose();
            }}
            disabled={isUploading}
            className={classes.secondaryButton}
          >
            {formatMessage('UploadWorkerModal.close')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default UploadWorkerModal;
