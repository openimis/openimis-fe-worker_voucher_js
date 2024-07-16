import React, { useState, useMemo } from 'react';

import { Button } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import {
  useGraphqlQuery, useTranslations, Autocomplete, useModulesManager, parseData,
} from '@openimis/fe-core';
import WorkerImportDialog from '../components/WorkerImportDialog';
import {
  MODULE_NAME,
  USER_ECONOMIC_UNIT_STORAGE_KEY,
  WORKER_IMPORT_PREVIOUS_WORKERS,
  WORKER_THRESHOLD,
} from '../constants';

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

  const { isLoading, data, error } = useGraphqlQuery(
    `
    query WorkerMultiplePicker($economicUnitCode: String!) {
      allInsurees: insurees {
        edges {
          node ${modulesManager.getProjection('insuree.InsureePicker.projection')}
        }
      }
      previousInsurees: previousWorkers(economicUnitCode: $economicUnitCode) {
        edges {
          node ${modulesManager.getProjection('insuree.InsureePicker.projection')}
        }
      },
      previousDayInsurees: previousWorkers(economicUnitCode: $economicUnitCode) {
        edges {
          node ${modulesManager.getProjection('insuree.InsureePicker.projection')}
        }
      },
    }    
    `,
    {
      economicUnitCode: userEconomicUnit?.code || '',
    },
  );

  const { workers, previousWorkers, previousDayWorkers } = useMemo(() => {
    const currentWorkersData = data?.allInsurees;
    const previousWorkersData = data?.previousInsurees;
    const previousDayWorkersData = data?.previousDayInsurees;

    return {
      workers: parseData(currentWorkersData),
      previousWorkers: parseData(previousWorkersData),
      previousDayWorkers: parseData(previousDayWorkersData),
    };
  }, [data]);

  const filterOptions = (options) => {
    if (searchString.length < WORKER_THRESHOLD) {
      return [];
    }

    const filteredOptions = options.filter((option) => option?.chfId.includes(searchString));
    return filteredOptions;
  };

  const handleImportDialogOpen = () => {
    setConfigurationDialogOpen((prevState) => !prevState);
  };

  const handleImport = () => {
    setConfigurationDialogOpen(false);

    const currentValueSet = new Set(value.map((worker) => worker.id));
    const getUniqueWorkers = (workers) => workers.filter((worker) => !currentValueSet.has(worker.id));

    onChange([...value, ...getUniqueWorkers(
      importPlan === WORKER_IMPORT_PREVIOUS_WORKERS ? previousWorkers : previousDayWorkers,
    )]);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        alignItems: 'start',
      }}
    >
      <Autocomplete
        multiple={multiple}
        required={required}
        error={error}
        options={workers}
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
