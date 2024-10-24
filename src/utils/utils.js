/* eslint-disable import/prefer-default-export */

import { baseApiUrl, parseData } from '@openimis/fe-core';
import { EMPTY_STRING, MPAY_BILL_URL, WORKER_VOUCHER_STATUS } from '../constants';
import { fetchMutation } from '../actions';

const fetchMPayArgs = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  return data;
};

const submitMPayPOST = async (url, args) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;
  form.target = '_blank';

  Object.entries(args).forEach(([key, value]) => {
    const input = document.createElement('input');

    input.type = 'hidden';
    input.name = key;
    input.value = value;

    form.appendChild(input);
  });

  document.body.appendChild(form);

  form.submit();
};

export const payWithMPay = async (billId) => {
  try {
    const redirectToURL = new URL(`${window.location.origin}${baseApiUrl}${MPAY_BILL_URL}`);
    redirectToURL.searchParams.set('bill', billId);

    const { url, args } = await fetchMPayArgs(redirectToURL.href);

    await submitMPayPOST(url, args);
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

export const getLastMutationLog = async (dispatch, mutationId) => {
  const mutation = await dispatch(fetchMutation(mutationId));

  return parseData(mutation.payload.data.mutationLogs)?.[0];
};

export const isTheVoucherExpired = (voucher) => voucher.status === WORKER_VOUCHER_STATUS.EXPIRED
|| new Date(voucher.expiryDate) < new Date();

export const trimDate = (date) => {
  if (!date) return EMPTY_STRING;

  return date.split('T')?.[0] ?? date;
};
