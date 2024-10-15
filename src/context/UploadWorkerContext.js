import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { useSelector } from 'react-redux';

import { baseApiUrl, useTranslations } from '@openimis/fe-core';
import { EMPTY_STRING, MODULE_NAME, UPLOAD_STAGE } from '../constants';

const UploadWorkerContext = createContext();

export function UploadWorkerProvider({ children }) {
  const { economicUnit } = useSelector((state) => state.policyHolder);
  const { formatMessage } = useTranslations(MODULE_NAME);
  const [uploadStage, setUploadStage] = useState(UPLOAD_STAGE.FILE_UPLOAD);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [validationError, setValidationError] = useState(EMPTY_STRING);
  const [validationSuccess, setValidationSuccess] = useState(EMPTY_STRING);
  const [validationWarning, setValidationWarning] = useState(EMPTY_STRING);
  const [uploadSummary, setUploadSummary] = useState({
    affectedRows: 0,
    totalNumberOfRecordsInFile: 0,
    skippedRows: 0,
  });

  const onFileUpload = (uploadedFile) => {
    try {
      setFile(uploadedFile);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('[UPLOAD_WORKER_CONTEXT]: Error while uploading file', error);
    } finally {
      setIsUploading(false);
      setIsUploaded(true);
    }
  };

  const uploadWorkers = async () => {
    setIsUploading(true);

    const uploadUrl = new URL(`${window.location.origin}${baseApiUrl}/worker_voucher/worker_upload/`);
    uploadUrl.searchParams.append('economic_unit_code', economicUnit.code);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        setValidationError(formatMessage('UploadWorkerModal.workerUploadError'));
        return;
      }

      const data = await response.json();

      console.log(response);
      console.log(data);
    } catch (error) {
      setValidationError(formatMessage('UploadWorkerModal.workerUploadError'));
    } finally {
      setIsUploading(false);
      setIsUploaded(true);
    }
  };

  const onWorkersUpload = async () => {
    setUploadStage(UPLOAD_STAGE.WORKER_UPLOAD);

    await uploadWorkers();
  };

  const resetFile = () => {
    setFile(null);
    setIsUploaded(false);
    setValidationError(EMPTY_STRING);
    setValidationSuccess(EMPTY_STRING);
    setValidationWarning(EMPTY_STRING);
    setUploadStage(UPLOAD_STAGE.FILE_UPLOAD);
    setUploadSummary({
      affectedRows: 0,
      totalNumberOfRecordsInFile: 0,
      skippedRows: 0,
    });
  };

  useEffect(() => {
    resetFile();
  }, [economicUnit.code]);

  const memoizedContextValue = useMemo(
    () => ({
      file,
      isUploading,
      isUploaded,
      validationError,
      validationSuccess,
      validationWarning,
      uploadSummary,
      uploadStage,
      onWorkersUpload,
      setFile,
      setIsUploading,
      setValidationError,
      setValidationSuccess,
      setValidationWarning,
      onFileUpload,
      setUploadSummary,
      resetFile,
    }),
    [file, isUploading, uploadStage, uploadSummary, isUploaded, validationError, validationSuccess, validationWarning],
  );

  return <UploadWorkerContext.Provider value={memoizedContextValue}>{children}</UploadWorkerContext.Provider>;
}

export const useUploadWorkerContext = () => useContext(UploadWorkerContext);
