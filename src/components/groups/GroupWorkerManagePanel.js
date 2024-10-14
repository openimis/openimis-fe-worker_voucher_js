import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Avatar,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/styles';

import {
  FormattedMessage,
  ProgressOrError,
  parseData,
  useModulesManager,
  useTranslations,
} from '@openimis/fe-core';
import { fetchWorkers } from '../../actions';
import { EMPTY_STRING, MODULE_NAME } from '../../constants';
import { ACTION_TYPE } from '../../reducer';

const useStyles = makeStyles((theme) => ({
  paper: { ...theme.paper.paper, width: '100%' },
  tableTitle: theme.table.title,
  item: theme.paper.item,
  paperHeader: theme.paper.paperHeader,
  list: {
    width: '100%',
    height: '368px',
    position: 'relative',
    overflow: 'auto',
  },
  filter: {
    width: '100%',
  },
  listItemText: {
    textTransform: 'capitalize',
  },
  reversedArrow: {
    transform: 'rotate(180deg)',
  },
  listTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '5px',
  },
}));

function GroupWorkerManagePanel({ edited, onChange }) {
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { formatMessage } = useTranslations(MODULE_NAME);
  const [filterValue, setFilterValue] = useState(EMPTY_STRING);
  const { economicUnit } = useSelector((state) => state.policyHolder);
  const [isLoading, setIsLoading] = useState(false);
  const [workers, setWorkers] = useState([]);

  const filterOutWorkers = (workers, filterValue) => {
    if (filterValue === EMPTY_STRING) return workers;
    return workers.filter((worker) => {
      const workerName = `${worker.chfId} ${worker.otherNames} ${worker.lastName}`;
      return workerName.toLowerCase().includes(filterValue.toLowerCase());
    });
  };

  const filteredWorkers = filterOutWorkers(workers, filterValue);

  const fetchAllAvailableWorkers = useCallback(async () => {
    setIsLoading(true);
    try {
      const workerData = await dispatch(
        fetchWorkers(modulesManager, [`economicUnitCode:"${economicUnit.code}"`], ACTION_TYPE.REQUEST),
      );
      const parsedWorkers = parseData(workerData.payload.data.worker);
      setWorkers(parsedWorkers);
    } catch (error) {
      throw new Error(`[GROUP_WORKER_MANAGE_PANEL] Error fetching workers: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [economicUnit.code]);

  useEffect(() => {
    // TODO: If EU changes, apart from fetching workers, we should navigate back
    fetchAllAvailableWorkers();
  }, [economicUnit.code, fetchAllAvailableWorkers]);

  const handleWorkerSelection = (selectedWorker) => {
    if (edited.workers?.includes(selectedWorker)) return;

    setWorkers(workers.filter((w) => w !== selectedWorker));

    const newWorkers = edited.workers ? [...edited.workers, selectedWorker] : [selectedWorker];
    onChange({ ...edited, workers: newWorkers });
  };

  const handleWorkerRemoval = (workerToRemove) => {
    setWorkers([...workers, workerToRemove]);

    const newWorkers = edited.workers.filter((worker) => worker !== workerToRemove);
    onChange({ ...edited, workers: newWorkers });
  };

  const addAllFilteredWorkers = () => {
    const newWorkers = edited.workers ? [...edited.workers, ...filteredWorkers] : [...filteredWorkers];
    setWorkers([]);
    onChange({ ...edited, workers: newWorkers });
  };

  const removeAllWorkers = () => {
    setWorkers([...workers, ...edited.workers]);
    onChange({ ...edited, workers: [] });
  };

  return (
    <Paper className={classes.paper} xs={12}>
      <Grid className={classes.tableTitle}>
        <Grid item xs={12} container alignItems="center" justifyContent="space-between" className={classes.item}>
          <Typography variant="h6">
            <FormattedMessage module="workerVoucher" id="GroupWorkerManagePanel.title" />
          </Typography>
        </Grid>
      </Grid>
      <Grid container className={classes.item}>
        <Grid className={classes.item}>
          <Paper>
            <Grid item className={classes.item}>
              <TextField
                className={classes.filter}
                variant="outlined"
                label={formatMessage('GroupWorkerManagePanel.workerFilter')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </Grid>
          </Paper>
        </Grid>
        <Grid container justify="space-between" alignItems="center">
          <Grid item xs={6} className={classes.item}>
            <Grid className={classes.listTitle}>
              <Typography variant="h6">
                <FormattedMessage module="workerVoucher" id="GroupWorkerManagePanel.availableWorkers" />
              </Typography>
              <Tooltip
                title={<FormattedMessage module="workerVoucher" id="GroupWorkerManagePanel.tooltip.addAllFiltered" />}
              >
                <IconButton color="primary" onClick={addAllFilteredWorkers}>
                  <DoubleArrowIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Paper>
              <List className={classes.list} subheader={<li />}>
                <ProgressOrError progress={isLoading} />
                {filteredWorkers.map((worker) => (
                  <ListItem button divider key={worker.uuid}>
                    <ListItemAvatar>
                      <Avatar alt={`${worker.firstName} ${worker.lastName} Avatar`} src={worker.photo} />
                    </ListItemAvatar>
                    <ListItemText
                      className={classes.listItemText}
                      primary={`${worker.chfId} ${worker.otherNames} ${worker.lastName}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleWorkerSelection(worker)}>
                        <PersonAddIcon color="primary" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={6} className={classes.item}>
            <Grid className={classes.listTitle}>
              <Tooltip
                title={<FormattedMessage module="workerVoucher" id="GroupWorkerManagePanel.tooltip.removeAll" />}
              >
                <IconButton color="primary" onClick={removeAllWorkers}>
                  <DoubleArrowIcon className={classes.reversedArrow} />
                </IconButton>
              </Tooltip>
              <Typography variant="h6">
                <FormattedMessage module="workerVoucher" id="GroupWorkerManagePanel.chosenWorkers" />
              </Typography>
            </Grid>
            <Paper>
              <List className={classes.list} subheader={<li />}>
                <ProgressOrError />
                {edited?.workers?.map((worker) => (
                  <ListItem button divider>
                    <ListItemAvatar>
                      <Avatar alt={`${worker.firstName} ${worker.lastName} Avatar`} src={worker.photo} />
                    </ListItemAvatar>
                    <ListItemText
                      className={classes.listItemText}
                      primary={`${worker.chfId} ${worker.otherNames} ${worker.lastName}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleWorkerRemoval(worker)}>
                        <ClearIcon color="primary" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default GroupWorkerManagePanel;
