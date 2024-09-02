import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import {
  Autocomplete, useModulesManager, useTranslations,
} from '@openimis/fe-core';
import WorkerImportDialog from '../components/WorkerImportDialog';
import {
  MAX_CELLS,
  MODULE_NAME,
  USER_ECONOMIC_UNIT_STORAGE_KEY,
  WORKER_IMPORT_ALL_WORKERS,
  WORKER_IMPORT_PREVIOUS_DAY,
  WORKER_IMPORT_PREVIOUS_WORKERS,
  WORKER_THRESHOLD,
} from '../constants';
import { getYesterdaysDate } from '../utils/utils';
import { fetchAllAvailableWorkers } from '../actions';

function WorkerMultiplePicker({
  readOnly, value, onChange, required, multiple = true, filterSelectedOptions,
}) {
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const dispatch = useDispatch();
  const [allWorkers, setAllWorkers] = useState([]);
  const [previousWorkers, setPreviousWorkers] = useState([]);
  const [previousDayWorkers, setPreviousDayWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchString, setSearchString] = useState('');
  const isDisabled = readOnly || isLoading;
  const [configurationDialogOpen, setConfigurationDialogOpen] = useState(false);
  const [importPlan, setImportPlan] = useState(undefined);
  const yesterday = getYesterdaysDate();

  const storedUserEconomicUnit = localStorage.getItem(USER_ECONOMIC_UNIT_STORAGE_KEY);
  const userEconomicUnit = JSON.parse(storedUserEconomicUnit);
  const economicUnitCode = userEconomicUnit?.code || '';

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const {
          allAvailableWorkers,
          previousWorkers,
          previousDayWorkers,
        } = await fetchAllAvailableWorkers(dispatch, economicUnitCode, { startDate: yesterday, endDate: yesterday });
        setAllWorkers(allAvailableWorkers);
        setPreviousWorkers(previousWorkers);
        setPreviousDayWorkers(previousDayWorkers);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dispatch, economicUnitCode, yesterday]);

  const filterOptionsBySearchString = (options) => options.filter((option) => {
    const filterableSearchString = searchString.toLowerCase();
    return (
      option?.chfId.includes(filterableSearchString)
      || option?.lastName.toLowerCase().includes(filterableSearchString)
      || option?.otherNames.toLowerCase().includes(filterableSearchString)
    );
  });

  const filterOptions = (options) => {
    if (searchString.length < WORKER_THRESHOLD || isLoading) {
      return [];
    }
    return filterOptionsBySearchString(options);
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
        readOnly={isDisabled}
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
