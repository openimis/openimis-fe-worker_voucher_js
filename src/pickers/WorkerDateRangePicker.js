/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';

import {
  Grid,
  Button,
  List,
  ListItem,
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
  classes, readOnly, value, onChange,
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
    const newRange = { startDate, endDate };
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
      <Grid xs={5}>
        <Typography variant="subtitle1" style={{ padding: '10px 0 0 10px' }}>
          {formatMessage('workerVoucher.WorkerDateRangePicker.selectDate')}
        </Typography>
        <Grid container direction="row">
          <Grid xs={6} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="workerVoucher"
              label={formatMessage('workerVoucher.WorkerDateRangePicker.startDate')}
              value={startDate}
              onChange={handleStartDateChange}
              readOnly={readOnly}
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
              // NOTE: minDate cannot be passed if startDate does not exist.
              // Passing any other falsy value will block months manipulation.
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...(startDate ? { minDate: startDate } : null)}
            />
          </Grid>
        </Grid>
        <Grid className={classes.item}>
          {!startDate || !endDate ? (
            <Tooltip title={formatMessage('workerVoucher.WorkerDateRangePicker.noDates')}>
              <span>
                <Button variant="contained" color="primary" onClick={addDateRange} disabled={!startDate || !endDate}>
                  {formatMessage('workerVoucher.WorkerDateRangePicker.addButton')}
                </Button>
              </span>
            </Tooltip>
          ) : (
            <span>
              <Button variant="contained" color="primary" onClick={addDateRange} disabled={!startDate || !endDate}>
                {formatMessage('workerVoucher.WorkerDateRangePicker.addButton')}
              </Button>
            </span>
          )}
        </Grid>
      </Grid>
      <Grid container xs={7} style={{ padding: '0 10px 0 0' }}>
        <Grid xs={12} style={{ margin: '0 0 0 12px' }}>
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
                  <ListItemText
                    primary={formatMessage('workerVoucher.WorkerDateRangePicker.dateRange')}
                    secondary={`${range.startDate} | ${range.endDate}`}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title={formatMessage('workerVoucher.WorkerDateRangePicker.deleteRange')}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => deleteDateRange(index)}
                        edge="end"
                        aria-label="delete"
                        disabled={readOnly}
                        startIcon={<DeleteIcon />}
                      >
                        <Typography variant="body2">
                          {formatMessage('workerVoucher.WorkerDateRangePicker.deleteRange')}
                        </Typography>
                      </Button>
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
