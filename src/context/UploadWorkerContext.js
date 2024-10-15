import React, {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { useSelector } from 'react-redux';

import { baseApiUrl, useTranslations, openBlob } from '@openimis/fe-core';
import {
  EMPTY_OBJECT, EMPTY_STRING, MODULE_NAME, UPLOAD_STAGE,
} from '../constants';

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
  const [workersWithError, setWorkersWithError] = useState(EMPTY_OBJECT);
  const [uploadSummary, setUploadSummary] = useState({
    affectedRows: 0,
    totalNumberOfRecordsInFile: 0,
    skippedRows: 0,
  });

  const uploadUrl = useMemo(() => {
    const url = new URL(`${window.location.origin}${baseApiUrl}/worker_voucher/worker_upload/`);
    url.searchParams.append('economic_unit_code', economicUnit.code);
    return url;
  }, [economicUnit.code]);

  const uploadErrorUrl = useMemo(() => {
    const url = new URL(`${window.location.origin}${baseApiUrl}/worker_voucher/download_worker_upload_file/`);
    url.searchParams.append('economic_unit_code', economicUnit.code);
    url.searchParams.append('filename', file?.name);
    return url;
  }, [economicUnit.code, file]);

  const onFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setIsUploading(false);
    setIsUploaded(true);
  };

  const uploadWorkers = async () => {
    setIsUploading(true);

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

      setUploadSummary({
        affectedRows: data.summary?.affected_rows || 0,
        totalNumberOfRecordsInFile: data.summary?.total_number_of_records_in_file || 0,
        skippedRows: data.summary?.skipped_items || 0,
      });

      if (!data.success) {
        setValidationError(formatMessage('UploadWorkerModal.workerUploadError'));
        return;
      }

      if (!!data?.summary?.skipped_items && !!Object.keys(data?.error).length) {
        setWorkersWithError(data.error);
        setValidationWarning(formatMessage('UploadWorkerModal.workerUploadWarning'));
        return;
      }

      setValidationSuccess(formatMessage('UploadWorkerModal.workerUploadSuccess'));
    } catch (error) {
      setValidationError(formatMessage('UploadWorkerModal.workerUploadError'));
    } finally {
      setIsUploading(false);
      setIsUploaded(true);
    }
  };

  const downloadWorkersWithError = async () => {
    try {
      const response = await fetch(uploadErrorUrl);
      const blob = await response.blob();
      return openBlob(blob, `errors_${file.name}`, file.type);
    } catch (error) {
      // eslint-disable-next-line no-console
      throw new Error(`[UPLOAD_WORKER_CONTEXT]: Upload failed. ${error}`);
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
    setWorkersWithError(EMPTY_OBJECT);
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
      workersWithError,
      onWorkersUpload,
      setFile,
      setIsUploading,
      setValidationError,
      setValidationSuccess,
      setValidationWarning,
      onFileUpload,
      setUploadSummary,
      resetFile,
      downloadWorkersWithError,
    }),
    [
      file,
      isUploading,
      workersWithError,
      uploadStage,
      uploadSummary,
      isUploaded,
      validationError,
      validationSuccess,
      validationWarning,
    ],
  );

  return <UploadWorkerContext.Provider value={memoizedContextValue}>{children}</UploadWorkerContext.Provider>;
}

export const useUploadWorkerContext = () => useContext(UploadWorkerContext);
