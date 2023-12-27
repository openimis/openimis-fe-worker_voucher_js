import React from 'react';

import { Grid, Divider } from '@material-ui/core';

import { PublishedComponent, AmountInput } from '@openimis/fe-core';

function PriceManagementForm({
  classes, readOnly = false, edited, onEditedChange, formatMessage,
}) {
  return (
    <>
      <Grid container direction="row">
        <Grid xs={3} className={classes.item}>
          <AmountInput
            module="workerVoucher"
            label="workerVoucher.pricePerVoucher"
            value={edited?.price}
            onChange={(price) => onEditedChange({ ...edited, price })}
            readOnly={readOnly}
            displayZero
            required
          />
        </Grid>
        <Grid xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="workerVoucher"
            label={formatMessage('workerVoucher.validFrom')}
            value={edited.validFrom}
            onChange={(validFrom) => onEditedChange({ ...edited, validFrom })}
            readOnly={readOnly}
            required
              // NOTE: maxDate cannot be passed if endDate does not exist.
              // Passing any other falsy value will block months manipulation.
              // eslint-disable-next-line react/jsx-props-no-spreading
            {...(edited?.validTo ? { maxDate: edited.validTo } : null)}
          />
        </Grid>
        <Grid xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="workerVoucher"
            label={formatMessage('workerVoucher.validTo')}
            value={edited.validTo}
            onChange={(validTo) => onEditedChange({ ...edited, validTo })}
            readOnly={readOnly}
            required
              // NOTE: minDate cannot be passed if startDate does not exist.
              // Passing any other falsy value will block months manipulation.
              // eslint-disable-next-line react/jsx-props-no-spreading
            {...(edited?.validFrom ? { minDate: edited.validFrom } : null)}
          />
        </Grid>
      </Grid>
      <Divider style={{ margin: '12px 0' }} />
    </>
  );
}

export default PriceManagementForm;
