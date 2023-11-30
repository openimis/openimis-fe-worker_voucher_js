import React, { useState } from 'react';

import { Checkbox, FormControlLabel } from '@material-ui/core';

import {
  useGraphqlQuery, useTranslations, Autocomplete, useModulesManager, parseData,
} from '@openimis/fe-core';
import { MODULE_NAME, WORKER_THRESHOLD } from '../constants';

function WorkerMultiplePicker({
  readOnly,
  value,
  onChange,
  required,
  multiple = true,
  filterSelectedOptions,
  previousWorkers,
}) {
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [previousWorkersChecked, setPreviousWorkersChecked] = useState(false);
  const [searchString, setSearchString] = useState('');

  // TODO: Add possibility to fetch only workers employer was working with - after BE implementation
  const { isLoading, data: allWorkers, error } = useGraphqlQuery(
    `
    {
        insurees {
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
    { },
    { skip: previousWorkersChecked },
  );

  const workers = parseData(allWorkers?.insurees);

  const filtersOptions = (options) => {
    if (!searchString || searchString.length < WORKER_THRESHOLD) {
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
        noOptionsText={formatMessage('workerVoucher.WorkerMultiplePicker.noOptions')}
        filterOptions={filtersOptions}
        getOptionLabel={({ chfId, lastName, otherNames }) => `${chfId} ${lastName} ${otherNames}`}
        filterSelectedOptions={filterSelectedOptions}
        onInputChange={() => {}}
        setCurrentString={setSearchString}
      />
      {previousWorkers && (
        <FormControlLabel
          control={(
            <Checkbox
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
