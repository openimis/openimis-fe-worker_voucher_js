import React from 'react';

import { ConstantBasedPicker } from '@openimis/fe-core';
import { WORKER_VOUCHER_STATUS_LIST } from '../constants';

function WorkerVoucherStatusPicker({
  required = false,
  withNull = false,
  readOnly = false,
  nullLabel = null,
  withLabel = false,
  value,
  onChange,
}) {
  return (
    <ConstantBasedPicker
      module="workerVoucher"
      label="workerVoucher.status"
      constants={WORKER_VOUCHER_STATUS_LIST}
      required={required}
      withNull={withNull}
      readOnly={readOnly}
      onChange={onChange}
      value={value}
      nullLabel={nullLabel}
      withLabel={withLabel}
    />
  );
}

export default WorkerVoucherStatusPicker;
