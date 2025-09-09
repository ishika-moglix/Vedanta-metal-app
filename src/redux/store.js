import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feature/authslice';
import userReducer from './feature/userSlice';
import businessDetailsReducer from './feature/businessDetailsSlice';
import bankDetailsReducer from './feature/BankDetailsSlice';
import documentsReducer from './feature/documentsSlice';
import plantsReducer from './feature/plantsSlice';
import rootSaga from './sagas/rootSaga';
import createSagaMiddleware from 'redux-saga';
import headerReducer from './feature/homeSlice';
import sessionReducer from './feature/homeSlice';
import searchPlantsReducer from './feature/homeSlice';
import dispatchDetailsReducer from './feature/dispatchDetailsSlice';
import branchAccessReducer from './feature/branchSlice';
import MOUListReducer from './feature/mouslice';
import vocListReducer from './feature/vocSlice';
import notiReducer from './feature/notification';
import customerRegistrationReducer from './feature/customerRegSlice'
import dashboardReducer from './feature/dashboardSlice';

// const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    bankDetail: bankDetailsReducer,
    businessDetails: businessDetailsReducer,
    plantDetails: plantsReducer,
    documentDetails: documentsReducer,
    wallet: headerReducer,
    session: sessionReducer,
    searchPlants: searchPlantsReducer,
    dispatchDetails: dispatchDetailsReducer,
    branchAccess: branchAccessReducer,
    mouList: MOUListReducer,
    vocList: vocListReducer,
    notification: notiReducer,
    customerRegistration: customerRegistrationReducer,
    dashboard: dashboardReducer,
  },
  // middleware: getDefaultMiddleware =>
  //   getDefaultMiddleware().concat(sagaMiddleware),
});

// sagaMiddleware.run(rootSaga);

export default store;
