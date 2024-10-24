import {
  formatPageQueryWithCount,
  graphql,
  formatMutation,
  graphqlWithVariables,
  formatGQLString,
  parseData,
  decodeId,
} from '@openimis/fe-core';
import { ACTION_TYPE } from './reducer';
import {
  CLEAR, ERROR, REQUEST, SUCCESS,
} from './utils/action-type';
import { EMPTY_STRING } from './constants';

const WORKER_VOUCHER_PROJECTION = (modulesManager) => [
  'id',
  'billId',
  'code',
  'status',
  'assignedDate',
  'expiryDate',
  'dateCreated',
  'dateUpdated',
  `insuree ${modulesManager.getProjection('insuree.InsureePicker.projection')}`,
  `policyholder ${modulesManager.getProjection('policyHolder.PolicyHolderPicker.projection')}`,
];

const WORKER_VOUCHER_CHECK_PROJECTION = [
  'isExisted',
  'isValid',
  'assignedDate',
  'employerCode',
  'employerName',
];

const VOUCHER_PRICE_PROJECTION = () => ['id', 'uuid', 'key', 'value', 'dateValidFrom', 'dateValidTo', 'isDeleted'];

// eslint-disable-next-line no-unused-vars
const WORKER_PROJECTION = (modulesManager) => [
  'id',
  'uuid',
  'validityFrom',
  'validityTo',
  'chfId',
  'otherNames',
  'lastName',
  'phone',
  'gender { code }',
  'dob',
  'marital',
  'status',
  'jsonExt',
  'photo { photo }',
];

export const GROUP_PROJECTION = (modulesManager) => [
  'id',
  'name',
  'isDeleted',
  'dateCreated',
  `policyholder ${modulesManager.getProjection('policyHolder.PolicyHolderPicker.projection')}`,
  `groupWorkers {
    edges {
      node {
        isDeleted,
        insuree ${modulesManager.getProjection('insuree.InsureePicker.projection')},
      }
    }
    totalCount
  }`,
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

export function voucherAssignmentValidation(phCode, workers, dateRanges) {
  const workersNationalIDs = workers?.map((worker) => worker?.chfId) ?? [];

  return graphqlWithVariables(
    `
    query voucherAssignmentValidation($phCode: ID!, $workers: [ID], $dateRanges: [DateRangeInclusiveInputType]) {
      assignVouchersValidation(
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

export function assignVouchers(phCode, workers, dateRanges, clientMutationLabel) {
  const formattedDateRanges = formatGraphQLDateRanges(dateRanges ?? []);
  const formattedWorkers = formatGraphQLStringArray(workers?.map((worker) => worker?.chfId) ?? []);

  const mutationInput = `
  ${phCode ? `economicUnitCode: "${phCode}"` : ''}
  ${workers ? `workers: ${formattedWorkers}` : ''}
  ${dateRanges ? `dateRanges: ${formattedDateRanges}` : ''}
  `;
  const mutation = formatMutation('assignVouchers', mutationInput, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.ASSIGN_VOUCHERS), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.ASSIGN_VOUCHERS,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function manageVoucherPrice(key, value, dateValidFrom, dateValidTo, clientMutationLabel) {
  const mutationInput = `
  ${key ? `key: "${key}"` : ''}
  ${value ? `value: "${value}"` : ''}
  ${dateValidFrom ? `dateValidFrom: "${dateValidFrom}"` : ''}
  ${dateValidTo ? `dateValidTo: "${dateValidTo}"` : ''}
  `;
  const mutation = formatMutation('createBusinessConfig', mutationInput, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.MANAGE_VOUCHER_PRICE), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.MANAGE_VOUCHER_PRICE,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function fetchMutation(clientMutationId) {
  return graphqlWithVariables(
    `
    query fetchMutation($clientMutationId: String!) {
      mutationLogs(clientMutationId: $clientMutationId) {
        edges {
          node {
            id
            status
            error
            clientMutationId
            clientMutationLabel
            clientMutationDetails
            requestDateTime
            jsonExt
            autogeneratedCode
          }
        }
      }
    }
    `,
    { clientMutationId },
  );
}

export function fetchVoucherPrices(params) {
  const payload = formatPageQueryWithCount('businessConfig', params, VOUCHER_PRICE_PROJECTION());
  return graphql(payload, ACTION_TYPE.SEARCH_VOUCHER_PRICES);
}

export function deleteVoucherPrice(voucherPriceUuid, clientMutationLabel) {
  const voucherPricesUuids = `ids: ["${voucherPriceUuid}"]`;
  const mutation = formatMutation('deleteBusinessConfig', voucherPricesUuids, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.DELETE_VOUCHER_PRICE), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.DELETE_VOUCHER_PRICE,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function downloadWorkerVoucher(params) {
  const payload = `
  {
    workerVoucherExport${!!params && params.length ? `(${params.join(',')})` : ''}
  }`;
  return graphql(payload, ACTION_TYPE.EXPORT_WORKER_VOUCHER);
}

export function clearWorkerVoucherExport() {
  return (dispatch) => {
    dispatch({
      type: CLEAR(ACTION_TYPE.EXPORT_WORKER_VOUCHER),
    });
  };
}

export function fetchWorkers(modulesManager, params, actionType = ACTION_TYPE.GET_WORKERS) {
  const queryParams = [...params];
  const payload = formatPageQueryWithCount('worker', queryParams, WORKER_PROJECTION(modulesManager));
  return graphql(payload, actionType);
}

export function fetchWorker(modulesManager, params) {
  const queryParams = [...params];
  const payload = formatPageQueryWithCount('worker', queryParams, WORKER_PROJECTION(modulesManager));
  return graphql(payload, ACTION_TYPE.GET_WORKER);
}

const processCategoryData = (category, data, allData) => {
  if (data[category]) {
    allData[category].push(...parseData(data[category]));
    return {
      hasNextPage: data[category].pageInfo.hasNextPage,
      endCursor: data[category].pageInfo.endCursor,
    };
  }
  return { hasNextPage: false, endCursor: null };
};

export async function fetchAllPages(dispatch, query, variables) {
  const allData = {
    allAvailableWorkers: [],
    previousWorkers: [],
    previousDayWorkers: [],
  };
  let hasNextPage = true;
  let after = 'YXJyYXljb25uZWN0aW9uOi0x'; // arrayconnection:-1

  while (hasNextPage) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await dispatch(
        graphqlWithVariables(query, { ...variables, after }),
      );
      const data = response?.payload?.data || {};

      const allAvailableWorkersInfo = processCategoryData('allAvailableWorkers', data, allData);
      const previousWorkersInfo = processCategoryData('previousWorkers', data, allData);
      const previousDayWorkersInfo = processCategoryData('previousDayWorkers', data, allData);

      hasNextPage = allAvailableWorkersInfo.hasNextPage
        || previousWorkersInfo.hasNextPage
        || previousDayWorkersInfo.hasNextPage;

      after = allAvailableWorkersInfo.endCursor
        || previousWorkersInfo.endCursor
        || previousDayWorkersInfo.endCursor;

      if (
        !allAvailableWorkersInfo.hasNextPage
        && !previousWorkersInfo.hasNextPage
        && !previousDayWorkersInfo.hasNextPage
      ) {
        hasNextPage = false;
      }
    } catch (error) {
      hasNextPage = false;
    }
  }
  return allData;
}

export async function fetchAllAvailableWorkers(dispatch, economicUnitCode, dateRange) {
  const query = `
    query WorkerMultiplePicker($economicUnitCode: String!, $dateRange: DateRangeInclusiveInputType, $after: String!) {
      allAvailableWorkers: worker(economicUnitCode: $economicUnitCode, after: $after) {
        edges {
          node {
            id
            uuid
            chfId
            lastName
            otherNames
            dob
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
      previousWorkers: previousWorkers(economicUnitCode: $economicUnitCode, after: $after) {
        edges {
            node {
              id
              uuid
              chfId
              lastName
              otherNames
              dob
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
    }
    previousDayWorkers: previousWorkers(
        economicUnitCode: $economicUnitCode
        dateRange: $dateRange
        after: $after
      ) {
        edges {
          node {
            id
            uuid
            chfId
            lastName
            otherNames
            dob
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }  
  `;
  const response = await fetchAllPages(dispatch, query, { economicUnitCode, dateRange });
  return response;
}

export function downloadWorkers(params) {
  const payload = `
  {
    workerExport${!!params && params.length ? `(${params.join(',')})` : ''}
  }`;
  return graphql(payload, ACTION_TYPE.WORKERS_EXPORT);
}

export function clearWorkersExport() {
  return (dispatch) => {
    dispatch({
      type: CLEAR(ACTION_TYPE.WORKERS_EXPORT),
    });
  };
}

export const clearWorker = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GET_WORKER),
  });
};

export function fetchWorkerVoucherCount(workerId, economicUnitCode) {
  return graphqlWithVariables(
    `
      query ($workerId: String!, $economicUnitCode: String!) {
        worker(uuid: $workerId, economicUnitCode: $economicUnitCode) {
          edges {
            node {
              vouchersThisYear
            }
          }
        } 
      }
    `,
    { workerId, economicUnitCode },
    ACTION_TYPE.VOUCHER_COUNT,
  );
}

export function appendWorkerToEconomicUnit(phCode, worker, clientMutationLabel) {
  const mutationInput = `
    ${phCode ? `economicUnitCode: "${phCode}"` : ''}
    ${worker.chfId ? `chfId: "${formatGQLString(worker.chfId)}"` : ''}
    ${worker.lastName ? `lastName: "${formatGQLString(worker.lastName)}"` : ''}
    ${worker.otherNames ? `otherNames: "${formatGQLString(worker.otherNames)}"` : ''}
    ${!!worker.gender && !!worker.gender.code ? `genderId: "${worker.gender.code}"` : ''}
    ${worker.dob ? `dob: "${worker.dob}"` : ''}
  `;

  const mutation = formatMutation('createWorker', mutationInput, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.APPEND_WORKER), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.APPEND_WORKER,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function deleteWorkerFromEconomicUnit(economicUnit, workerToDelete, clientMutationLabel) {
  const mutationInput = `
    ${economicUnit.code ? `economicUnitCode: "${economicUnit.code}"` : ''}
    ${workerToDelete.uuid ? `uuid: "${workerToDelete.uuid}"` : ''}
  `;

  const mutation = formatMutation('deleteWorker', mutationInput, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.DELETE_WORKER), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.DELETE_WORKER,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function deleteWorkersFromEconomicUnit(economicUnit, workersToDelete, clientMutationLabel) {
  const workersUuids = workersToDelete.map((worker) => worker.uuid);
  const workerUuidsString = workersUuids.map((uuid) => `"${uuid}"`).join(', ');
  const mutationInput = `
    ${economicUnit.code ? `economicUnitCode: "${economicUnit.code}"` : ''}
    ${workersUuids.length ? `uuids: [${workerUuidsString}]` : ''}
  `;

  const mutation = formatMutation('deleteWorker', mutationInput, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.DELETE_WORKERS), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.DELETE_WORKERS,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function validateMConnectWorker(nationalId, economicUnitCode) {
  return graphqlWithVariables(
    `
    query validateMConnectWorker($nationalId: String!, $economicUnitCode: ID!) {
      onlineWorkerData(nationalId: $nationalId, economicUnitCode: $economicUnitCode) {
        lastName
        otherNames
      }
    }
  `,
    { nationalId, economicUnitCode },
  );
}

export function fetchGroupsAction(modulesManager, params) {
  const queryParams = [...params];
  const payload = formatPageQueryWithCount('groupOfWorker', queryParams, GROUP_PROJECTION(modulesManager));
  return graphql(payload, ACTION_TYPE.GET_GROUPS);
}

export function fetchGroup(modulesManager, params) {
  const queryParams = [...params];
  const payload = formatPageQueryWithCount('groupOfWorker', queryParams, GROUP_PROJECTION(modulesManager));
  return graphql(payload, ACTION_TYPE.GET_GROUP);
}

export const clearGroup = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GET_GROUP),
  });
};

export function createGroup(economicUnit, groupToCreate, clientMutationLabel) {
  const workersChfIds = groupToCreate?.workers?.map((worker) => worker.chfId) ?? [];
  const workerChfIdsString = workersChfIds.map((chfId) => `"${chfId}"`).join(', ');

  const mutationInput = `
    ${economicUnit.code ? `economicUnitCode: "${economicUnit.code}"` : EMPTY_STRING}
    ${groupToCreate.name ? `name: "${formatGQLString(groupToCreate.name)}"` : EMPTY_STRING}
    ${workerChfIdsString.length ? `insureesChfId: [${workerChfIdsString}]` : EMPTY_STRING}
  `;

  const mutation = formatMutation('createOrUpdateGroupOfWorkers', mutationInput, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.CREATE_GROUP), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.CREATE_GROUP,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function updateGroup(economicUnit, groupToUpdate, clientMutationLabel) {
  const workersChfIds = groupToUpdate?.workers?.map((worker) => worker.chfId) ?? [];
  const workerChfIdsString = workersChfIds.map((chfId) => `"${chfId}"`).join(', ');

  const mutationInput = `
    ${groupToUpdate.id ? `id: "${decodeId(groupToUpdate.id)}"` : EMPTY_STRING}
    ${economicUnit.code ? `economicUnitCode: "${economicUnit.code}"` : EMPTY_STRING}
    ${groupToUpdate.name ? `name: "${formatGQLString(groupToUpdate.name)}"` : EMPTY_STRING}
    ${workerChfIdsString.length ? `insureesChfId: [${workerChfIdsString}]` : EMPTY_STRING}
  `;

  const mutation = formatMutation('createOrUpdateGroupOfWorkers', mutationInput, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.UPDATE_GROUP), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.UPDATE_GROUP,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function deleteGroup(economicUnit, groupsToDelete, clientMutationLabel) {
  const groupsUuids = groupsToDelete.map((group) => decodeId(group.id));
  const groupUuidsString = groupsUuids.map((uuid) => `"${uuid}"`).join(', ');

  const mutationInput = `
    ${economicUnit.code ? `economicUnitCode: "${economicUnit.code}"` : EMPTY_STRING}
    ${groupsToDelete.length ? `uuids: [${groupUuidsString}]` : EMPTY_STRING}
  `;

  const mutation = formatMutation('deleteGroupOfWorkers', mutationInput, clientMutationLabel);
  const requestedDateTime = new Date();

  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION_TYPE.DELETE_GROUP), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION_TYPE.DELETE_GROUP,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
}

export function fetchPublicVoucherDetails(voucherUuid) {
  return graphqlWithVariables(
    `
    query checkVoucherValidity($voucherUuid: String!) {
      voucherCheck(code: $voucherUuid) {
      ${WORKER_VOUCHER_CHECK_PROJECTION.join('\n')}
      }
    }
    `,
    { voucherUuid },
  );
}
