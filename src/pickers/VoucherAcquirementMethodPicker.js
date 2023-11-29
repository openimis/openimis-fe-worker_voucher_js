import React from 'react';

import { ConstantBasedPicker } from '@openimis/fe-core';
import { ACQUIREMENT_METHOD_LIST } from '../constants';

function VoucherAcquirementMethodPicker({
  label,
  acquirementMethod,
  setAcquirementMethod,
  required,
  withNull,
  readOnly = false,
  nullLabel,
  withLabel,
}) {
  return (
    <ConstantBasedPicker
      module="workerVoucher"
      constants={ACQUIREMENT_METHOD_LIST}
      value={acquirementMethod}
      onChange={(method) => setAcquirementMethod(method)}
      label={label}
      required={required}
      withNull={withNull}
      readOnly={readOnly}
      nullLabel={nullLabel}
      withLabel={withLabel}
    />
  );
}

export default VoucherAcquirementMethodPicker;
