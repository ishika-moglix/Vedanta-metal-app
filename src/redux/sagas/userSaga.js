// import {call, put, fork, takeLatest} from 'redux-saga/effects';
// import {
//   signUpFailure,
//   signUpRequest,
//   signUpSuccess,
// } from '../feature/userSlice';
// import CONSTANTS from '../constants';
// import {ScannerService} from '../../services/scannerService';

// function* handleSignUp({payload}) {
//   try {
//     const {data} = yield call(ScannerService.signUp, payload);
//     console.log('data sign up ', data);

//     if (data?.isSuccess) {
//       yield put(
//         signUpSuccess({
//           data: data?.data,
//         }),
//       );
//     } else {
//       yield put(signUpFailure());
//     }
//   } catch (error) {
//     console.log(error);
//     yield put(signUpFailure());
//   }
// }

// export function* watchSignUp() {
//   yield takeLatest(signUpRequest.type, handleSignUp);
// }

// export const homesaga = [fork(watchSignUp)];
