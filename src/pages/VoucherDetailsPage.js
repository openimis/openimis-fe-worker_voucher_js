import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/styles';

import {
  Form, Helmet, useHistory, useModulesManager, useTranslations,
} from '@openimis/fe-core';
import { clearWorkerVoucher, fetchWorkerVoucher } from '../actions';
import {
  EMPTY_STRING, MODULE_NAME, VOUCHER_RIGHT_SEARCH,
} from '../constants';
import VoucherDetailsPanel from '../components/VoucherDetailsPanel';

const useStyles = makeStyles((theme) => ({
  page: theme.page,
}));

function VoucherDetailsPage({ match, logo }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const history = useHistory();
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);
  const workerVoucherUuid = match?.params?.voucher_uuid;
  const { workerVoucher, fetchingWorkerVoucher, errorWorkerVoucher } = useSelector((state) => state.workerVoucher);

  const titleParams = (workerVoucher) => ({
    code: workerVoucher?.code ?? EMPTY_STRING,
  });

  useEffect(() => {
    try {
      if (workerVoucherUuid) {
        const params = [`id: "${workerVoucherUuid}"`];
        dispatch(fetchWorkerVoucher(modulesManager, params));
      }
    } catch (error) {
      throw new Error(`[VOUCHER_DETAILS_PAGE]: Fetching worker voucher failed. ${error}`);
    }

    return () => dispatch(clearWorkerVoucher());
  }, [workerVoucherUuid]);

  return (
    rights.includes(VOUCHER_RIGHT_SEARCH) && (
      <div className={classes.page}>
        <Helmet title={formatMessageWithValues('workerVoucher.VoucherDetailsPage.title', titleParams(workerVoucher))} />
        <Form
          module="workerVoucher"
          title={formatMessageWithValues('workerVoucher.VoucherDetailsPage.title', titleParams(workerVoucher))}
          titleParams={titleParams(workerVoucher)}
          openDirty
          workerVoucher={workerVoucher}
          fetchingWorkerVoucher={fetchingWorkerVoucher}
          errorWorkerVoucher={errorWorkerVoucher}
          back={() => history.goBack()}
          HeadPanel={VoucherDetailsPanel}
          readOnly
          logo={logo}
          formatMessage={formatMessage}
          rights={rights}
        />
      </div>
    )
  );
}

export default VoucherDetailsPage;
