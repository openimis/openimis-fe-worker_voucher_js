import React, { useMemo, useState } from 'react';

import { Button } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import {
  Autocomplete, parseData, useGraphqlQuery, useModulesManager, useTranslations,
} from '@openimis/fe-core';
import WorkerImportDialog from '../components/WorkerImportDialog';
import {
  EMPTY_STRING,
  MAX_CELLS,
  MODULE_NAME,
  USER_ECONOMIC_UNIT_STORAGE_KEY,
  WORKER_IMPORT_ALL_WORKERS,
  WORKER_IMPORT_PREVIOUS_DAY,
  WORKER_IMPORT_PREVIOUS_WORKERS,
  WORKER_THRESHOLD,
} from '../constants';
import { getYesterdaysDate } from '../utils/utils';

function WorkerMultiplePicker({
  readOnly, value, onChange, required, multiple = true, filterSelectedOptions,
}) {
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [searchString, setSearchString] = useState('');
  const storedUserEconomicUnit = localStorage.getItem(USER_ECONOMIC_UNIT_STORAGE_KEY);
  const userEconomicUnit = JSON.parse(storedUserEconomicUnit);
  const [configurationDialogOpen, setConfigurationDialogOpen] = useState(false);
  const [importPlan, setImportPlan] = useState(undefined);
  const yesterday = getYesterdaysDate();

  const { isLoading, data, error } = useGraphqlQuery(
    `
      query WorkerMultiplePicker($economicUnitCode: String!, $dateRange: DateRangeInclusiveInputType) {
        allAvailableWorkers: worker(economicUnitCode: $economicUnitCode) {
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
        }
        previousWorkers: previousWorkers(economicUnitCode: $economicUnitCode) {
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
        }
        previousDayWorkers: previousWorkers(
          economicUnitCode: $economicUnitCode
          dateRange: $dateRange
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
        }
      }
    `,
    {
      economicUnitCode: userEconomicUnit?.code || EMPTY_STRING,
      dateRange: {
        startDate: yesterday,
        endDate: yesterday,
      },
    },
  );

  const { allWorkers, previousWorkers, previousDayWorkers } = useMemo(() => {
    const currentWorkersData = data?.allAvailableWorkers;
    const previousWorkersData = data?.previousWorkers;
    const previousDayWorkersData = data?.previousDayWorkers;

    return {
      allWorkers: parseData(currentWorkersData),
      previousWorkers: parseData(previousWorkersData),
      previousDayWorkers: parseData(previousDayWorkersData),
    };
  }, [data]);

  const filterOptionsBySearchString = (options) => options.filter((option) => {
    const filterableSearchString = searchString.toLowerCase();

    return (
      option?.chfId.includes(filterableSearchString)
        || option?.lastName.toLowerCase().includes(filterableSearchString)
        || option?.otherNames.toLowerCase().includes(filterableSearchString)
    );
  });

  const filterOptions = (options) => {
    if (searchString.length < WORKER_THRESHOLD) {
      return [];
    }

    const filteredOptions = filterOptionsBySearchString(options);
    return filteredOptions;
  };

  const handleImportDialogOpen = () => {
    setConfigurationDialogOpen((prevState) => !prevState);
  };

  const importPlanWorkers = (importPlan) => {
    switch (importPlan) {
      case WORKER_IMPORT_ALL_WORKERS:
        return allWorkers;
      case WORKER_IMPORT_PREVIOUS_WORKERS:
        return previousWorkers;
      case WORKER_IMPORT_PREVIOUS_DAY:
        return previousDayWorkers;
      default:
        return [];
    }
  };

  const handleImport = () => {
    setConfigurationDialogOpen(false);

    const currentValueSet = new Set(value.map((worker) => worker.id));
    const getUniqueWorkers = (workers) => workers.filter((worker) => !currentValueSet.has(worker.id));

    onChange([...value, ...getUniqueWorkers(importPlanWorkers(importPlan))]);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'end',
      }}
    >
      <Autocomplete
        multiple={multiple}
        required={required}
        error={error}
        options={allWorkers}
        limitTags={MAX_CELLS}
        onChange={onChange}
        value={value}
        isLoading={isLoading}
        label={formatMessage('workerVoucher.workers')}
        readOnly={readOnly}
        placeholder={formatMessage('workerVoucher.WorkerMultiplePicker.placeholder')}
        noOptionsText={
          searchString.length < WORKER_THRESHOLD
            ? formatMessage('workerVoucher.WorkerMultiplePicker.underThreshold')
            : formatMessage('workerVoucher.WorkerMultiplePicker.noOptions')
        }
        filterOptions={filterOptions}
        getOptionLabel={({ chfId, lastName, otherNames }) => `${chfId} ${lastName} ${otherNames}`}
        filterSelectedOptions={filterSelectedOptions}
        onInputChange={() => {}}
        setCurrentString={setSearchString}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<PersonAddIcon />}
        size="large"
        onClick={handleImportDialogOpen}
      >
        {formatMessage('workerVoucher.workerImport.confirm')}
      </Button>
      <WorkerImportDialog
        open={configurationDialogOpen}
        onClose={handleImportDialogOpen}
        importPlan={importPlan}
        setImportPlan={setImportPlan}
        onConfirm={handleImport}
      />
    </div>
  );
}

export default WorkerMultiplePicker;
