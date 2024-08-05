/* eslint-disable import/prefer-default-export */

import { baseApiUrl } from '@openimis/fe-core';
import { MPAY_BILL_URL } from '../constants';

export const payWithMPay = async (billId) => {
  try {
    const redirectToURL = new URL(`${window.location.origin}${baseApiUrl}${MPAY_BILL_URL}`);
    redirectToURL.searchParams.set('bill', billId);

    window.location.href = redirectToURL.href;
  } catch (error) {
    throw new Error('Redirection to MPay failed.', error);
  }
};

export const getYesterdaysDate = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return yesterday.toISOString().split('T')[0];
};

export const extractWorkerName = (worker, isAssignedStatus) => {
  if (!worker || !isAssignedStatus) return '';

  return `${worker.chfId} ${worker.otherNames} ${worker.lastName}`;
};

export const extractEmployerName = (employer) => {
  if (!employer) return '';

  return `${employer.code} ${employer.tradeName}`;
};
