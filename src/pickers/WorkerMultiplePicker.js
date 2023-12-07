import React, { useState, useMemo } from 'react';

import { Checkbox, FormControlLabel } from '@material-ui/core';

import {
  useGraphqlQuery, useTranslations, Autocomplete, useModulesManager, parseData,
} from '@openimis/fe-core';
import { MODULE_NAME, USER_ECONOMIC_UNIT_STORAGE_KEY, WORKER_THRESHOLD } from '../constants';

function WorkerMultiplePicker({
  readOnly,
  value,
  onChange,
  required,
  multiple = true,
  filterSelectedOptions,
  previousWorkersCheckbox,
}) {
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [previousWorkersChecked, setPreviousWorkersChecked] = useState(false);
  const [searchString, setSearchString] = useState('');
  const storedUserEconomicUnit = localStorage.getItem(USER_ECONOMIC_UNIT_STORAGE_KEY);
  const userEconomicUnit = JSON.parse(storedUserEconomicUnit);

  const {
    isLoading,
    data,
    error,
  } = useGraphqlQuery(
    `
    query WorkerMultiplePicker($economicUnitCode: String!, $fetchPreviousWorkers: Boolean!) {
      allInsurees: insurees @skip(if: $fetchPreviousWorkers) {
        edges {
          node ${modulesManager.getProjection('insuree.InsureePicker.projection')}
        }
      }
      previousInsurees: previousWorkers(economicUnitCode: $economicUnitCode) @include(if: $fetchPreviousWorkers) {
        edges {
          node ${modulesManager.getProjection('insuree.InsureePicker.projection')}
        }
      }
    }    
    `,
    {
      economicUnitCode: userEconomicUnit?.code || '',
      fetchPreviousWorkers: previousWorkersChecked,
    },
  );

  const workers = useMemo(() => {
    const currentWorkersData = previousWorkersChecked ? data?.previousInsurees : data?.allInsurees;

    return parseData(currentWorkersData);
  }, [previousWorkersChecked, data]);

  const filterOptions = (options) => {
    if (!searchString || (!previousWorkersChecked && searchString.length < WORKER_THRESHOLD)) {
      return [];
    }

    const filteredOptions = options.filter((option) => option?.chfId.includes(searchString));
    return filteredOptions;
  };

  return (
    <>
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
          (!previousWorkersChecked && searchString.length < WORKER_THRESHOLD)
            ? formatMessage('workerVoucher.WorkerMultiplePicker.underThreshold')
            : formatMessage('workerVoucher.WorkerMultiplePicker.noOptions')
        }
        filterOptions={filterOptions}
        getOptionLabel={({ chfId, lastName, otherNames }) => `${chfId} ${lastName} ${otherNames}`}
        filterSelectedOptions={filterSelectedOptions}
        onInputChange={() => {}}
        setCurrentString={setSearchString}
      />
      {previousWorkersCheckbox && (
        <FormControlLabel
          control={(
            <Checkbox
              color="primary"
              checked={previousWorkersChecked}
              onChange={(e) => {
                setPreviousWorkersChecked(e.target.checked);
                if (e.target.checked) {
                  setSearchString('');
                }
              }}
            />
          )}
          label={formatMessage('workerVoucher.WorkerMultiplePicker.checkbox.label')}
        />
      )}
    </>
  );
}

export default WorkerMultiplePicker;
