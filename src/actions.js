import {
  formatPageQueryWithCount,
  graphql,
  formatMutation,
  graphqlWithVariables,
} from '@openimis/fe-core';
import { ACTION_TYPE } from './reducer';
import {
  CLEAR, ERROR, REQUEST, SUCCESS,
} from './utils/action-type';

const WORKER_VOUCHER_PROJECTION = (modulesManager) => [
  'id',
  'code',
  'status',
  'assignedDate',
  'expiryDate',
  'dateCreated',
  'dateUpdated',
  `insuree ${modulesManager.getProjection('insuree.InsureePicker.projection')}`,
  `policyholder ${modulesManager.getProjection('policyHolder.PolicyHolderPicker.projection')}`,
];

export function fetchWorkerVouchers(modulesManager, params) {
  const queryParams = [...params, 'isDeleted: false'];
  const payload = formatPageQueryWithCount('workerVoucher', queryParams, WORKER_VOUCHER_PROJECTION(modulesManager));
  return graphql(payload, ACTION_TYPE.SEARCH_WORKER_VOUCHERS);
}

export function fetchWorkerVoucher(modulesManager, params) {
  const payload = formatPageQueryWithCount('workerVoucher', params, WORKER_VOUCHER_PROJECTION(modulesManager));
  return graphql(payload, ACTION_TYPE.GET_WORKER_VOUCHER);
}

export const clearWorkerVoucher = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GET_WORKER_VOUCHER),
  });
};

export function genericVoucherValidation(phCode, quantity) {
  return graphqlWithVariables(
    `
    query genericVoucherValidation($phCode: ID!, $quantity: Int) {
      acquireUnassignedValidation (
        economicUnitCode: $phCode,
        count: $quantity,
      ) {
        count,
        price,
        pricePerVoucher
      }
    }
    `,
    { phCode, quantity },
  );
}

export function acquireGenericVoucher(phCode, quantity, clientMutationLabel) {
  const mutationInput = `
  ${phCode ? `economicUnitCode: "${phCode}"` : ''}
  ${quantity ? `count: ${quantity}` : ''}
  `;
  const mutation = formatMutation('acquireUnassignedVouchers', mutationInput, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.ACQUIRE_GENERIC_VOUCHER), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.ACQUIRE_GENERIC_VOUCHER,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}
