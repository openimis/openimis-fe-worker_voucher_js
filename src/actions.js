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

function formatGraphQLDateRanges(dateRanges) {
  const rangeStrings = dateRanges.map((range) => `{ startDate: "${range.startDate}", endDate: "${range.endDate}" }`);
  return `[${rangeStrings.join(', ')}]`;
}

function formatGraphQLStringArray(inputArray) {
  const formattedArray = inputArray.map((item) => `"${item}"`).join(', ');
  return `[${formattedArray}]`;
}

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

export function specificVoucherValidation(phCode, workers, dateRanges) {
  const workersNationalIDs = workers?.map((worker) => worker?.chfId) ?? [];

  return graphqlWithVariables(
    `
    query specificVoucherValidation($phCode: ID!, $workers: [ID], $dateRanges: [DateRangeInclusiveInputType]) {
      acquireAssignedValidation(
        economicUnitCode: $phCode
        workers: $workers
        dateRanges: $dateRanges
      ) {
        count
        price
        pricePerVoucher
      }
    }
    `,
    { phCode, workers: workersNationalIDs, dateRanges },
  );
}

export function acquireSpecificVoucher(phCode, workers, dateRanges, clientMutationLabel) {
  const formattedDateRanges = formatGraphQLDateRanges(dateRanges ?? []);
  const formattedWorkers = formatGraphQLStringArray(workers?.map((worker) => worker?.chfId) ?? []);

  const mutationInput = `
  ${phCode ? `economicUnitCode: "${phCode}"` : ''}
  ${workers ? `workers: ${formattedWorkers}` : ''}
  ${dateRanges ? `dateRanges: ${formattedDateRanges}` : ''}
  `;
  const mutation = formatMutation('acquireAssignedVouchers', mutationInput, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.ACQUIRE_SPECIFIC_VOUCHER), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.ACQUIRE_SPECIFIC_VOUCHER,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}
