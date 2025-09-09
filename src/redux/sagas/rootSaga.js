import { all } from 'redux-saga/effects';
import { homeSaga } from './homeSaga';
import { dispatchDetailsSaga } from './dispatchDetailsSaga';
import { mouListSaga } from './mouListSaga';
import { vocListSaga } from './vocListSaga';
import { customerRegistrationSaga } from './customerRegistrationSaga';
import { dashboardSaga } from './dashboardSaga';

export default function* rootSaga() {
  yield all([...homeSaga, ...dispatchDetailsSaga, ...mouListSaga, ...vocListSaga, ...customerRegistrationSaga, ...dashboardSaga]);
}
