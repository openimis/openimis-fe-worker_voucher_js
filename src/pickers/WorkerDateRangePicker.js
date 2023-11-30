/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';

import {
  Grid,
  Button,
  List,
  ListItem,
  IconButton,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  ListItemAvatar,
  Typography,
  Tooltip,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import DateRangeIcon from '@material-ui/icons/DateRange';

import { PublishedComponent, useTranslations, useModulesManager } from '@openimis/fe-core';
import { MODULE_NAME } from '../constants';

function WorkerDateRangePicker({
  classes, readOnly, value, onChange, required,
}) {
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const addDateRange = () => {
    const newRange = { start: startDate, end: endDate };
    onChange([...value, newRange]);
    setStartDate(null);
    setEndDate(null);
  };

  const deleteDateRange = (index) => {
    const newDateRanges = value.filter((_, i) => i !== index);
    onChange(newDateRanges);
  };

  return (
    <Grid container>
      <Grid xs={4}>
        <Grid container direction="row">
          <Grid xs={6} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="workerVoucher"
              label={formatMessage('workerVoucher.WorkerDateRangePicker.startDate')}
              value={startDate}
              onChange={handleStartDateChange}
              readOnly={readOnly}
              required={required}
              // NOTE: maxDate cannot be passed if endDate does not exist.
              // Passing any other falsy value will block months manipulation.
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...(endDate ? { maxDate: endDate } : null)}
            />
          </Grid>
          <Grid xs={6} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="workerVoucher"
              label={formatMessage('workerVoucher.WorkerDateRangePicker.endDate')}
              value={endDate}
              onChange={handleEndDateChange}
              readOnly={readOnly}
              required={required}
              // NOTE: minDate cannot be passed if startDate does not exist.
              // Passing any other falsy value will block months manipulation.
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...(startDate ? { minDate: startDate } : null)}
            />
          </Grid>
        </Grid>
        <Grid className={classes.item}>
          <Button variant="contained" color="primary" onClick={addDateRange} disabled={!startDate || !endDate}>
            {formatMessage('workerVoucher.WorkerDateRangePicker.addButton')}
          </Button>
        </Grid>
      </Grid>
      <Grid container xs={8} style={{ padding: '0 10px 0 0' }}>
        <Grid xs={12}>
          <Typography variant="subtitle1" style={{ padding: '10px 0 0 0' }}>
            {formatMessage('workerVoucher.WorkerDateRangePicker.dateRanges')}
          </Typography>
          {value.length === 0 ? (
            <Typography variant="caption">{formatMessage('workerVoucher.WorkerDateRangePicker.noRanges')}</Typography>
          ) : (
            <List>
              {value.map((range, index) => (
                <ListItem key={index} className={classes.listItem}>
                  <ListItemAvatar>
                    <Avatar>
                      <DateRangeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Date Range" secondary={`${range.start} | ${range.end}`} />
                  <ListItemSecondaryAction>
                    <Tooltip title={formatMessage('workerVoucher.WorkerDateRangePicker.deleteRange')}>
                      <IconButton
                        onClick={() => deleteDateRange(index)}
                        edge="end"
                        aria-label="delete"
                        disabled={readOnly}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default WorkerDateRangePicker;
