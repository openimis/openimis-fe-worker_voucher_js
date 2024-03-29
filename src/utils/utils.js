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
