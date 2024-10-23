/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Button, CircularProgress, TextField } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Popper from '@material-ui/core/Popper';

import { useModulesManager, useTranslations, parseData } from '@openimis/fe-core';
import WorkerImportDialog from '../components/WorkerImportDialog';
import {
  MAX_CELLS,
  MODULE_NAME,
  USER_ECONOMIC_UNIT_STORAGE_KEY,
  WORKER_IMPORT_ALL_WORKERS,
  WORKER_IMPORT_GROUP_OF_WORKERS,
  WORKER_IMPORT_PREVIOUS_DAY,
  WORKER_IMPORT_PREVIOUS_WORKERS,
  WORKER_THRESHOLD,
} from '../constants';
import { getYesterdaysDate } from '../utils/utils';
import { fetchAllAvailableWorkers } from '../actions';

function WorkerMultiplePicker({
  readOnly, value, onChange, required, filterSelectedOptions,
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
  const [group, setGroup] = useState(null);
  const yesterday = getYesterdaysDate();

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" color="primary" />;

  const storedUserEconomicUnit = localStorage.getItem(USER_ECONOMIC_UNIT_STORAGE_KEY);
  const userEconomicUnit = JSON.parse(storedUserEconomicUnit);
  const economicUnitCode = userEconomicUnit?.code || '';

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { allAvailableWorkers, previousWorkers, previousDayWorkers } = await fetchAllAvailableWorkers(
          dispatch,
          economicUnitCode,
          { startDate: yesterday, endDate: yesterday },
        );
        setAllWorkers(allAvailableWorkers || []);
        setPreviousWorkers(previousWorkers || []);
        setPreviousDayWorkers(previousDayWorkers || []);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dispatch, economicUnitCode, yesterday]);

  const filterOptionsBySearchString = (options) => {
    const splitByWhitespaceRegex = /\s+/;
    const filterableSearchString = searchString.toLowerCase().trim();
    const searchTerms = filterableSearchString.split(splitByWhitespaceRegex);

    return options.filter((option) => {
      const chfId = option?.chfId?.toLowerCase() || '';
      const lastName = option?.lastName?.toLowerCase() || '';
      const otherNames = option?.otherNames?.toLowerCase() || '';

      return searchTerms.every((term) => chfId.includes(term) || lastName.includes(term) || otherNames.includes(term));
    });
  };

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
      case WORKER_IMPORT_GROUP_OF_WORKERS:
        return parseData(group.groupWorkers)?.map((groupWorker) => groupWorker.insuree);
      default:
        return [];
    }
  };

  const handleImport = () => {
    setConfigurationDialogOpen(false);

    const currentWorkersSet = new Set(value.map((worker) => worker.uuid));
    const importedWorkers = importPlanWorkers(importPlan);
    const uniqueImportedWorkers = importedWorkers.filter((worker) => !currentWorkersSet.has(worker.uuid));
    const updatedWorkers = [...value, ...uniqueImportedWorkers];

    onChange(null, updatedWorkers);
  };

  const handleGroupChange = (group) => {
    setGroup(group);
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
        multiple
        required={required}
        limitTags={MAX_CELLS}
        id="checkboxes-tags-demo"
        disabled={isDisabled}
        error={error}
        isLoading={isLoading}
        options={allWorkers}
        onChange={onChange}
        value={value}
        getOptionSelected={(option, value) => option.uuid === value.uuid}
        filterOptions={filterOptions}
        noOptionsText={
          searchString.length < WORKER_THRESHOLD
            ? formatMessage('workerVoucher.WorkerMultiplePicker.underThreshold')
            : formatMessage('workerVoucher.WorkerMultiplePicker.noOptions')
        }
        filterSelectedOptions={filterSelectedOptions}
        onInputChange={(_, newInputValue) => setSearchString(newInputValue)}
        setCurrentString={setSearchString}
        disableCloseOnSelect
        getOptionLabel={({ chfId, lastName, otherNames }) => `${chfId} ${lastName} ${otherNames}`}
        renderOption={(option, { selected }) => (
          <>
            <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
            {`${option.chfId} ${option.lastName} ${option.otherNames}`}
          </>
        )}
        fullWidth
        PopperComponent={(props) => {
          const inputRect = props.anchorEl?.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const spaceBelow = windowHeight - Number(inputRect?.bottom);
          const dropdownMaxHeight = Math.min(spaceBelow - 8, 300);

          return (
            <Popper
              {...props}
              modifiers={{
                offset: {
                  enabled: true,
                  offset: '0, 2',
                },
                preventOverflow: {
                  enabled: true,
                  boundariesElement: 'viewport',
                  padding: 8,
                },
                flip: {
                  enabled: false,
                },
              }}
              placement="bottom-start"
              style={{
                zIndex: 1300,
                maxHeight: dropdownMaxHeight,
                overflowY: 'auto',
              }}
            />
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={formatMessage('workerVoucher.workers')}
            placeholder={formatMessage('workerVoucher.WorkerMultiplePicker.placeholder')}
          />
        )}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={isLoading ? <CircularProgress size={20} color="secondary" /> : <PersonAddIcon />}
        disabled={isDisabled}
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
        handleGroupChange={handleGroupChange}
        currentGroup={group}
      />
    </div>
  );
}

export default WorkerMultiplePicker;
