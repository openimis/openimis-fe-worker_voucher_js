import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useModulesManager, useTranslations, Autocomplete } from '@openimis/fe-core';
import { fetchGroupsAction } from '../actions';
import { ADMIN_RIGHT, MODULE_NAME } from '../constants';

function GroupPicker({
  withLabel = true, withPlaceholder = true, label, onChange, currentGroup,
}) {
  const modulesManager = useModulesManager();
  const dispatch = useDispatch();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);

  const {
    groups, fetchingGroups, fetchedGroups, errorGroups,
  } = useSelector((state) => state.workerVoucher);
  const { economicUnit } = useSelector((state) => state.policyHolder);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);

  const isAdmin = useMemo(() => rights.includes(ADMIN_RIGHT), [rights]);

  useEffect(() => {
    const actionParams = ['isDeleted: false'];

    if (!isAdmin && economicUnit?.code) {
      actionParams.push(`economicUnitCode:"${economicUnit.code}"`);
    }

    dispatch(fetchGroupsAction(modulesManager, actionParams));
  }, [isAdmin, economicUnit, modulesManager, dispatch]);

  const groupLabel = (option) => option.name;

  const handleChange = (selectedGroup) => {
    onChange(selectedGroup);
  };

  return (
    <Autocomplete
      label={label ?? formatMessage('GroupPicker.label')}
      error={errorGroups}
      withLabel={withLabel}
      withPlaceholder={withPlaceholder}
      options={groups}
      isLoading={fetchingGroups}
      isFetched={fetchedGroups}
      value={currentGroup}
      getOptionLabel={groupLabel}
      onChange={handleChange}
      onInputChange={() => {}}
    />
  );
}

export default GroupPicker;
