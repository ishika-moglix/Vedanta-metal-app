// import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from './constant';
import axios from 'axios';
import { getPhoneNumber } from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '.';

async function submitFeedback(auth, obj) {
  try {
    const { data } = await axios({
      method: 'post',
      url: `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.SUBMIT_FEEDBACK}`,
      data: obj,
      headers: {
        // 'Content-Type': 'multipart/form-data',
        idBranch: auth.branchId,
        idCompany: auth.companyId,
        idUser: auth.userId,
        token: auth.token,
        application: auth.application,
      },
    });
    //   `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.SUBMIT_FEEDBACK}`,
    //   {...obj},
    //   {
    //     headers: {
    //       'content-type': 'application/json',
    //       'Content-Disposition':
    //         'form-data; name="feedbackDto"; filename="blob"',
    //       idBranch: auth.branchId,
    //       idCompany: auth.companyId,
    //       idUser: auth.userId,
    //       token: auth.token,
    //       application: auth.application,
    //     },
    //   },
    // );
    return data;
  } catch (exception) {
    alert(exception);
  }
}

async function getToken() {
  try {
    const { data } = await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.GET_TOKEN}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return CONSTANTS.TOKEN_RESP;
  } catch (e) {
    // alert(e);
    return CONSTANTS.TOKEN_RESP;
  }
}

async function Login(OBJ) {
  try {
    const { data } = await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.LOGIN}`,
      OBJ,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return data;
  } catch (e) {
    // alert(e);
    return CONSTANTS.TOKEN_RESP;
  }
}
async function forgotPassword(email) {
  try {
    const { data } = await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.FORGETPASSWORD}`,
      {
        email,
        application: 1,
        resetUrl: 'https://vedantametalbazaar.moglix.com/#/forgetotp',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return data;
  } catch (error) {
    console.error('Error in forgotPassword API:', error);
    return error;
  }
}

// async function forgotPassword(email) {
//   try {
//      const {data} = await axios.post(
//       `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.FORGETPASSWORD}`,
//       {
//         email,
//         application: 4,
//         resetUrl: 'https://vedantametalbazaar.moglix.com/#/forgetotp',
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       },
//     );
//     return data;
//   } catch (error) {
//     console.error('Error in forgotPassword API:', error);
//     return error;
//   }
// }

// async function signUp(userDetails) {
//   try {
//     const { data } = await axios.post(
//       `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.SIGNUP}`,
//       userDetails,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//    // console.log("data of api", data);
//     return data;

//   } catch (error) {
//     console.error('Error in signUp API:', error);
//     return error.response ? error.response.data : { success: false, message: 'An error occurred during signup' };
//   }
// }

const signUp = async userDetails => {
  try {
    const response = await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.SIGNUP}`,
      userDetails,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    // console.log('signup response', response);

    return response;
  } catch (error) {
    console.error(
      'Error fetching taxpayer details:',
      error.response?.data || error.message,
    );
  }
};

async function getSaltInfo(OBJ) {
  try {
    const { data } = await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.GETUSER_DATA}`,
      OBJ,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return data;
  } catch (e) {
    // alert(e);
    return CONSTANTS.TOKEN_RESP;
  }
}

async function ScanData(code, auth) {
  try {
    const { data } = await axios.get(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.QR_DETAIL}${code}`,
      {
        headers: {
          idBranch: auth.branchId,
          idCompany: auth.companyId,
          idUser: auth.userId,
          token: auth.token,
          application: auth.application,
        },
      },
    );
    return data;
  } catch (exception) {
    // alert(exception);
    return exception;
    // return {
    //   code: 200,
    //   success: true,
    //   message: 'Data fetched Successfully ',
    //   data: {
    //     id: '4716481',
    //     batchNo: '22A3561401',
    //     matCode: 'IP11997',
    //     grossWt: 1003,
    //     netWt: 1003,
    //     matDesc: 'EC INGOT 99.7% -P1020',
    //     pieces: 44,
    //     matType: 'Ingot',
    //     invoiceNum: 'F22152106798',
    //     salesOrg: 'VALC',
    //     productCode: 10,
    //   },
    // };
  }
}

async function ScanBatchData(code, auth) {
  try {
    const { data } = await axios.get(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.QR_BATCH_DETAIL}${code}`,
      {
        headers: {
          idBranch: auth.branchId,
          idCompany: auth.companyId,
          idUser: auth.userId,
          token: auth.token,
          application: auth.application,
        },
      },
    );
    return data;
  } catch (exception) {
    // alert(exception);
    return exception;
    // return {
    //   code: 200,
    //   success: true,
    //   message: 'Data fetched Successfully ',
    //   data: {
    //     id: '4716481',
    //     batchNo: '22A3561401',
    //     matCode: 'IP11997',
    //     grossWt: 1003,
    //     netWt: 1003,
    //     matDesc: 'EC INGOT 99.7% -P1020',
    //     pieces: 44,
    //     matType: 'Ingot',
    //     invoiceNum: 'F22152106798',
    //     salesOrg: 'VALC',
    //     productCode: 10,
    //   },
    // };
  }
}

async function ScanBarCode(code, auth) {
  try {
    const { data } = await axios.get(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.BAR_DETAIL}${code}`,
      {
        headers: {
          idBranch: auth.branchId,
          idCompany: auth.companyId,
          idUser: auth.userId,
          token: auth.token,
          application: auth.application,
        },
      },
    );
    return data;
  } catch (exception) {
    return exception;
    // return {
    //   code: 200,
    //   success: true,
    //   message: 'Data fetched Successfully ',
    //   data: {
    //     id: '4716481',
    //     batchNo: '22A3561401',
    //     matCode: 'IP11997',
    //     grossWt: 1003,
    //     netWt: 1003,
    //     matDesc: 'EC INGOT 99.7% -P1020',
    //     pieces: 44,
    //     matType: 'Ingot',
    //     invoiceNum: 'F22152106798',
    //     salesOrg: 'VALC',
    //     productCode: 10,
    //   },
    // };
  }
}

async function FeedList(auth, type, userType) {
  const BUtype = JSON.parse(await AsyncStorage.getItem('@user_info'));
  try {
    const { data } = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.FEEDBACK_LIST}`,
      {
        complaintType: type,
        offset: 0,
        limit: 200,
        customerCode: userType == 'Supplier' ? undefined : auth.companyId,
        businessUnit: BUtype.businessUnit,
        user: userType,
        endTimeMillis: Date.now(),
        startTimeMillis: new Date().setMonth(new Date().getMonth() - 6),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          idBranch: auth.branchId,
          idCompany: auth.companyId,
          idUser: auth.userId,
          token: auth.token,
          application: auth.application,
        },
      },
    );
    return data;
  } catch (exception) {
    // console.log(exception);

    // alert(exception);
  }
}

async function SearchList(auth, compNo) {
  const BUtype = JSON.parse(await AsyncStorage.getItem('@user_info'));
  // compNo
  try {
    const { data } = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.FEEDBACK_LIST}`,
      {
        complaintNo: compNo,
        offset: 0,
        limit: 200,
        customerCode: auth.companyId,
        businessUnit: BUtype.businessUnit,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          idBranch: auth.branchId,
          idCompany: auth.companyId,
          idUser: auth.userId,
          token: auth.token,
          application: auth.application,
        },
      },
    );
    return data;
  } catch (exception) {
    // console.log(exception);
  }
}

async function OpenSubCategory(auth, code) {
  try {
    const request = new Request(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.SUB_LIST}` + code,
      {
        method: 'GET',
        headers: new Headers({
          'content-type': 'application/json',
          idBranch: auth.branchId,
          idCompany: auth.companyId,
          idUser: auth.userId,
          token: auth.token,
          application: auth.application,
        }),
      },
    );
    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Auth Failed');
        }
        return response
          .json()
          .then(res => {
            return res;
          })
          .catch(err => {
            throw new Error('really wierd');
          });
      })
      .catch(err => {
        // console.log(err);
        throw new Error(err);
      });
  } catch (exception) {
    // console.log(exception);
  }
}

async function GetSession(message) {
  try {
    let sOBJ = {
      idUser: message.userId,
      application: '1',
      token: message.token,
      dataType: 2,
    };
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const { data } = await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.SESSION_ID}`,
      sOBJ,
      {
        headers: {
          'Content-Type': 'application/json',
          idUser: jsonSessionData?.moglixB2BUserId || message.userId,
          application: 1,
          token: jsonSessionData?.moglixB2BToken || message.token,
        },
      },
    );
    return data;
  } catch (e) {
    // alert(e);
    return CONSTANTS.TOKEN_RESP;
  }
}

async function GetBranchAcc(auth) {
  try {
    let sOBJ = { idUser: auth.userId, idBranch: auth.branchId };
    const { data } = await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.BRANCH_ACCESS}`,
      sOBJ,
      {
        headers: {
          'Content-Type': 'application/json',
          application: 1,
          idBranch: auth.branchId,
          idCompany: auth.companyId,
          idUser: auth.userId,
          token: auth.token,
        },
      },
    );
    return data;
  } catch (e) {
    // alert(e);
    return CONSTANTS.TOKEN_RESP;
  }
}

async function GetData() {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_info');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // console.log(e);
    // error reading value
  }
}

const deactivateAccount = async (OBJ, auth) =>
  axios.post(
    `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.DEACTIVATE_USER}`,
    OBJ,
    {
      headers: {
        'Content-Type': 'application/json',
        application: 1,
        idBranch: auth.branchId,
        idCompany: auth.companyId,
        idUser: auth.userId,
        token: auth.token,
      },
    },
  );

const logoutApi = async data =>
  axios.post(
    `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.LOGOUT}`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        application: 1,
        ...data,
      },
    },
  );

const getTaxpayerByGstin = async gstin => {
  try {
    const response = await axios.get(
      `https://address.moglix.com/address/getTaxpayerByGstin?gstin=${gstin}`,
      {
        headers: {
          'Content-Type': 'application/json',
          application: 1,
        },
      },
    );
    return response;
  } catch (error) {
    console.error(
      'Error fetching taxpayer details:',
      error.response?.data || error.message,
    );
  }
};

const sendPhoneOtp = async phone =>
  axios.post(
    `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.SEND_OTP}`,
    { phone },
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        idUser: '278',
        token: `${CONSTANTS.TOKEN[config.PROJECT_TOKEN]}`,
        //  '0f35d83c-4535-468f-9baa-30be6677b7b7',
        idBranch: '1',
        idCompany: '1',
        application: '1',
      },
    },
  );

const sendEmailOtp = async email =>
  axios.post(
    `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.SEND_OTP}`,
    { email },
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        idUser: '278',
        token: `${CONSTANTS.TOKEN[config.PROJECT_TOKEN]}`,
        // '0f35d83c-4535-468f-9baa-30be6677b7b7',
        idBranch: '1',
        idCompany: '1',
        application: '1',
      },
    },
  );

const getAllProductVariants = async product => {
  return axios.post(
    `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.PRODUCTVARIANTS}`,
    { businessUnit: product },
    {
      headers: {
        Referer: '',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        application: '1',
        idBranch: '1',
        'Access-Control-Allow-Origin': '*',
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        Accept: 'application/json, text/plain, */*',
        idUser: '278',
        'Content-Type': 'application/json',
        token: `${CONSTANTS.TOKEN[config.PROJECT_TOKEN]}`,
        idCompany: '1',
      },
    },
  );
};

const isGstinExist = async (gstNo, businessUnit) => {
  // console.log(gstNo, businessUnit);

  return axios.post(
    `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.ISGSTINEXIST}`,
    {
      gstNo,
      businessUnit,
    },
  );
};

const getData = async (businessUnit, email) => {
  return axios.post(
    `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.GETUSER_DATA}`,
    { businessUnit },
    { email },
  );
};

const updateDetails = async (obj, auth) => {
  try {
    // console.log('auth in scanner', auth, '\n', auth.idUser);
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.UPDATE_DETAILS}`,
      obj,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

const resetPassword = async (password, userId, key, otp) => {
  //// console.log(password, userId, key, otp);

  return axios.post(
    `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.RESET_PASSWORD}`,
    {
      password,
      userId,
      key,
      otp,
    },
  );
};

// const uploadFile = async (formData, auth) => {

const uploadFile = async formData => {
  try {
    const response = await fetch(
      `${CONSTANTS.PROCUREMENT_BASE_URL}${CONSTANTS.API_URL.PROCUREMENT_UPLOAD}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
          idUser: '278',
          token: `${CONSTANTS.TOKEN[config.PROJECT_TOKEN]}`,
          //  '0f35d83c-4535-468f-9baa-30be6677b7b7',
          idBranch: '1',
          idCompany: '1',
          application: '1',
        },
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

const saveBusinessDetails = async obj =>
  axios.post(
    `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.SAVE_BUSINESS_DETAILS}`,
    obj,
  );
const saveMultipleAddress = async obj =>
  axios.post(
    `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.SAVE_MULTIPLE_ADDRESS}`,
    obj,
  );

const pinCodes = async pincode =>
  axios.get(
    `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.VALIDATE_PINCODE}${pincode}`,
  );

const bankDetails = async obj =>
  axios.post(
    `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.BANK_DETAILS}`,
    obj,
  );

const uploadDocuments = async (documentPath, businessUnit) => {
  try {
    const response = await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.SAVE_DOCUMENTS}`,
      { documentPath, businessUnit, requestType:'Plant Onboarding' },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response;
  } catch (error) {
    console.error('Error uploading documents:', error);
    throw error; // Rethrow error if you want to handle it elsewhere
  }
};

const rfcSubmit = async id =>
  axios.get(`${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.RFCSUBMIT}${id}`);

const getCreditBalance = async payload => {
  const sessionData = await AsyncStorage.getItem('@get_session');
  const getPlantId = await AsyncStorage.getItem('@plantId');
  let jsonSessionData = JSON.parse(sessionData);
  let plantId = JSON.parse(getPlantId);
  try {
    const response = await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.GET_CREDIT_BALANCE}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

const getLCBGreditBalance = async payload => {
  const sessionData = await AsyncStorage.getItem('@get_session');
  const getPlantId = await AsyncStorage.getItem('@plantId');
  let jsonSessionData = JSON.parse(sessionData);
  let plantId = JSON.parse(getPlantId);
  try {
    const response = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.GET_LCBG_BALANCE}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

const getSession = async data => {
  // console.log("data from payload", data);

  return axios.post(
    `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.GET_SESSION}`,

    { dataType: data?.dataType },
    {
      headers: {
        'Content-Type': 'application/json',
        idUser: data?.authData?.userId,
        token: data?.authData?.token,
        application: '1',
      },
    },
  );
};

const searchPlantsByCompany = async data => {
  const sessionData = await AsyncStorage.getItem('@get_session');
  const getPlantId = await AsyncStorage.getItem('@plantId');
  let jsonSessionData = JSON.parse(sessionData);
  let plantId = JSON.parse(getPlantId);
  return axios.post(
    `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.SEARCH_PLANTS}`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        idbranch: plantId?.plantId,
        idcompany: jsonSessionData?.companyId,
        iduser: jsonSessionData?.moglixB2BUserId,
        token: jsonSessionData?.moglixB2BToken,
        application: '1',
      },
    },
  );
};

const fetchDispatchDetails = async params => {
  const sessionData = await AsyncStorage.getItem('@get_session');
  const getPlantId = await AsyncStorage.getItem('@plantId');
  let jsonSessionData = JSON.parse(sessionData);
  let plantId = JSON.parse(getPlantId);
  // console.log('fetchdetails params ', params?.requestedPayload);

  // const requestedPayload = {
  //   query: {
  //     bool: {
  //       must: [
  //         {
  //           terms: {
  //             buyerId: ['14626'],
  //           },
  //         },
  //         {
  //           match: {
  //             businessUnit: 'Aluminium',
  //           },
  //         },
  //       ],
  //     },
  //   },
  //   sort: [
  //     {
  //       documentDate: {
  //         order: 'desc',
  //       },
  //     },
  //     {
  //       invoiceNo: {
  //         order: 'desc',
  //       },
  //     },
  //   ],
  //   aggs: {
  //     statuses: {
  //       terms: {
  //         field: 'status',
  //       },
  //     },
  //   },
  // };

  try {
    // const page = new URLSearchParams(params.page).toString();
    // const pageSize = new URLSearchParams(params.pageSize).toString();
    const response = await axios.post(
      `${CONSTANTS.PROCUREMENT_BASE_URL}${CONSTANTS.API_URL.DISPATCH_SEARCH_DETAILS}?page=${params?.page}&pageSize=${params?.pageSize}`,
      // `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.DISPATCH_SEARCH_DETAILS}?${...params}`,
      // {...params},
      params?.requestedPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching dispatch details:', error);
    throw error;
  }
};

const getShipmentTimeStamp = async dataObj => {
  const sessionData = await AsyncStorage.getItem('@get_session');
  const getPlantId = await AsyncStorage.getItem('@plantId');
  let jsonSessionData = JSON.parse(sessionData);
  let plantId = JSON.parse(getPlantId);
  try {
    return await axios.get(
      `${CONSTANTS.MONITORING_BASE_URL}${CONSTANTS.API_URL.SHIPMENT_TIMESTAMP}${dataObj?.plantCode}/${dataObj?.BU}`,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

const refreshData = async dataObj => {
  const sessionData = await AsyncStorage.getItem('@get_session');
  const getPlantId = await AsyncStorage.getItem('@plantId');
  let jsonSessionData = JSON.parse(sessionData);
  let plantId = JSON.parse(getPlantId);
  try {
    return await axios.post(
      `${CONSTANTS.SAP_BASE_URL}${CONSTANTS.API_URL.REFRESH_DATA}`,
      dataObj,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

const branchAccess = async dataObj => {
  const sessionData = await AsyncStorage.getItem('@get_session');
  const getPlantId = await AsyncStorage.getItem('@plantId');
  let jsonSessionData = JSON.parse(sessionData);
  let plantId = JSON.parse(getPlantId);
  // console.log('dataObj is ', dataObj);

  try {
    return await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.BRANCH_ACCESS}`,
      dataObj,

      {
        headers: {
          'Content-Type': 'application/json',
          // idbranch: plantId?.plantId,
          // idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

const regionByPlants = async () => {
  const sessionData = await AsyncStorage.getItem('@get_session');
  const getPlantId = await AsyncStorage.getItem('@plantId');
  let jsonSessionData = JSON.parse(sessionData);
  let plantId = JSON.parse(getPlantId);
  try {
    return await axios.get(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.REGION_BY_PLANTS}`,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

const customerList = async dataObj => {
  const sessionData = await AsyncStorage.getItem('@get_session');
  const getPlantId = await AsyncStorage.getItem('@plantId');
  let jsonSessionData = JSON.parse(sessionData);
  let plantId = JSON.parse(getPlantId);
  try {
    return await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.CUSTOMER_LIST}`,
      dataObj,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

const exportData = async (dataObj, businessUnit) => {
  const sessionData = await AsyncStorage.getItem('@get_session');
  const getPlantId = await AsyncStorage.getItem('@plantId');
  let jsonSessionData = JSON.parse(sessionData);
  let plantId = JSON.parse(getPlantId);
  // console.log("Data oBject", dataObj, businessUnit);

  try {
    return await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.EXPORT_DATA}${businessUnit}`,
      dataObj,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

const reportSAP = async dataObj => {
  const sessionData = await AsyncStorage.getItem('@get_session');
  const getPlantId = await AsyncStorage.getItem('@plantId');
  let jsonSessionData = JSON.parse(sessionData);
  let plantId = JSON.parse(getPlantId);
  try {
    return await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.SAP_REPORT}`,
      dataObj,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

const cartCount = async dataObj => {
  // console.log("Cart Count", dataObj);

  const sessionData = await AsyncStorage.getItem('@get_session');
  const getPlantId = await AsyncStorage.getItem('@plantId');
  let jsonSessionData = JSON.parse(sessionData);
  let plantId = JSON.parse(getPlantId);
  try {
    return await axios.get(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.CART_COUNT}${dataObj?.userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

const vocListing = async dataObj => {
  // console.log("VOC dataOBj", dataObj);

  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.FEEDBACK_LIST}`,
      dataObj?.dataObj,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    // console.log("Error", error);
  }
}
const vocAdminListing = async dataObj => {
  // console.log("VOC admin listing dataOBj", dataObj);
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.ADMIN_LISTING}`,
      dataObj?.dataObj,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    // console.log("Error", error);
  }
}

const getComplaintById = async dataObj => {
  // console.log("getComplaint by id", dataObj);
  const sessionData = await AsyncStorage.getItem('@get_session');
  const getPlantId = await AsyncStorage.getItem('@plantId');
  let jsonSessionData = JSON.parse(sessionData);
  let plantId = JSON.parse(getPlantId);
  try {
    return await axios.get(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.GET_COMPLAINT}/${dataObj?.id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

const getAllCCHPProductVariants = async dataObj => {
  // console.log("get all cchh dataOBj", dataObj, "...", dataObj?.businessUnit);
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.GET_ALL_CCHPPRODUCTVARIANTS}`,
      dataObj,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    // console.log("Error", error);
  }
}

const getShipment = async (dataObj) => {
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return await axios.get(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.GET_SHIPMENT}${dataObj?.businessUnit}/${dataObj?.salesOrg}`,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    // console.log("Error", error);
  }
}

const getUserByRoleRM = async (dataObj) => {
  // console.log("Role name ", dataObj);
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    // console.log("check this plantId?.plantId", plantId?.plantId, jsonSessionData?.companyId);

    return await axios.get(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.GET_USERBYROLE}${plantId?.plantId}/${jsonSessionData?.companyId}/Regional Manager`,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    // console.log("Error", error);
  }
}
const getUserByRoleRMSEZ = async (dataObj) => {
  // console.log("Role name ", dataObj);
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    // console.log("check this plantId?.plantId", plantId?.plantId, jsonSessionData?.companyId);

    return await axios.get(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.GET_USERBYROLE}${plantId?.plantId}/${jsonSessionData?.companyId}/Regional Manager - SEZ`,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    // console.log("Error", error);
  }
}
const getUserByRolePM = async (dataObj) => {
  // console.log("Role name ", dataObj);
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    // console.log("check this plantId?.plantId", plantId?.plantId, jsonSessionData?.companyId);

    return await axios.get(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.GET_USERBYROLE}${plantId?.plantId}/${jsonSessionData?.companyId}/Product Manager`,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    // console.log("Error", error);
  }
}

const getUserByRolePMSEZ = async (dataObj) => {
  // console.log("Role name ", dataObj);
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    // console.log("check this plantId?.plantId", plantId?.plantId, jsonSessionData?.companyId);

    return await axios.get(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.GET_USERBYROLE}${plantId?.plantId}/${jsonSessionData?.companyId}/Product Manager - SEZ`,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    // console.log("Error", error);
  }
}
const getComplaintMail = async (dispatchCompanyId) => {
  console.log("Complaint mail", dispatchCompanyId);
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return await axios.get(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.COMPLAINTS_MAIL}${dispatchCompanyId?.dispatchCompanyId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    // console.log("Error", error);
  }
}
const feedbackCategory = async (dataObj) => {
  // console.log("feedbackCategory", dataObj);
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return await axios.get(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.FEEDBACK_CATEGORY}${dataObj?.role}/${dataObj?.businessUnit}`,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    // console.log("Error", error);
  }
}
const feedbackSubCategory = async (dataObj) => {
  // console.log("feedback Sub Category", dataObj);
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.FEEDBACK_SUBCATEGORY}`,
      dataObj,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    // console.log("Error", error);
  }
}
const getNotifications = async (dataObj) => {
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return await axios.get(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.GETNOTIFICATION}${dataObj?.userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    // console.log("Error", error);
  }
}
const getUnreadCount = async (dataObj) => {
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return await axios.get(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.GETUNREADCOUNT}${dataObj?.userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    // console.log("Error", error);
  }
}

const markAsRead = async (dataObj) => {
  try {
    console.log("dataObj markAsRead", dataObj);
    
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.MARKASREAD}${dataObj?.typeId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    // console.log("Error", error);
  }
}
const deleteNoti = async (dataObj) => {
  try {
    console.log("dataObj markAsRead", dataObj);
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.DELETENOTI}${dataObj?.typeId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
      },
    );
  } catch (error) {
    // console.log("Error", error);
  }
}

export const ScannerService = {
  ScanData,
  ScanBarCode,
  Login,
  signUp,
  getSaltInfo,
  OpenSubCategory,
  getToken,
  SearchList,
  FeedList,
  submitFeedback,
  GetSession,
  GetBranchAcc,
  GetData,
  deactivateAccount,
  ScanBatchData,
  logoutApi,
  forgotPassword,
  getTaxpayerByGstin,
  saveMultipleAddress,
  sendEmailOtp,
  getAllProductVariants,
  isGstinExist,
  getData,
  updateDetails,
  resetPassword,
  uploadFile,
  saveBusinessDetails,
  pinCodes,
  bankDetails,
  uploadDocuments,
  sendEmailOtp,
  sendPhoneOtp,
  rfcSubmit,
  getCreditBalance,
  getSession,
  searchPlantsByCompany,
  fetchDispatchDetails,
  getShipmentTimeStamp,
  refreshData,
  branchAccess,
  regionByPlants,
  customerList,
  exportData,
  reportSAP,
  getLCBGreditBalance,
  cartCount,
  vocListing,
  vocAdminListing,
  getComplaintById,
  getAllCCHPProductVariants,
  getShipment,
  getComplaintMail,
  getUserByRoleRM,
  getUserByRolePMSEZ,
  getUserByRolePM,
  getUserByRoleRMSEZ,
  feedbackCategory,
  feedbackSubCategory,
  getNotifications,
  deleteNoti,
  markAsRead,
  getUnreadCount
};
