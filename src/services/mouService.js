// import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from './constant';
import axios from 'axios';

export const mouList = async dataObj => {
  try {
    console.log('data mou payload', dataObj);

    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.MOU_LIST}`,
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
    return response.data;
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

export const zincList = async dataObj => {
  try {
    console.log('data zinc payload', dataObj);
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.ZINC_LIST}`,
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
    return response.data;
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};
export const zincDraftList = async dataObj => {
  try {
    console.log('data zinc payload', dataObj);
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.ZINC_DRAFTMOU}`,
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
    return response.data;
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

export const getAllMouStatus = async () => {
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return await axios.get(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.GET_MOUSTATUS}`,
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

export const getZincMouStatus = async () => {
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return await axios.get(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.DRAFT_MOUZINCLIST}`,
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

export const fetchCreatorNameData = async dataObj => {
  try {
    console.log('creator name payload', dataObj);

    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.FETCH_CREATORNAME}`,
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
    return response.data;
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

export const fetchMOUApproverEmailId = async dataObj => {
  try {
    console.log('data mou payload', dataObj);

    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.FETCH_MOUAPPROVER_EMAILNAME}`,
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
    return response.data;
  } catch (error) {
    console.error('Error fetching Approver Email id', error);
    throw error;
  }
};

export const approvedCustomerList = async dataObj => {
  try {
    console.log('approved customer list payload', dataObj);

    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.APPROVED_CUSTOMERLIST}`,
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
    return response.data;
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

export const getApproverType = async () => {
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return await axios.get(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.GET_APPROVERTYPE}`,
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

export const nfaList = async dataObj => {
  try {
    console.log('data nfa payload', dataObj);

    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.NFALISTING}`,
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
    return response.data;
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

export const exportContractList = async dataObj => {
  try {
    console.log('export contract list', dataObj);

    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.EXPORT_CONTRACTLIST}`,
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
    return response.data;
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

export const exportZincMou = async dataObj => {
  try {
    console.log('export DraftMou list', dataObj);

    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.EXPORT_ZINCMOU}`,
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
    return response.data;
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

export const exportNFA = async dataObj => {
  try {
    console.log('export DraftMou list', dataObj);

    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.EXPORTNFA}`,
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
    return response.data;
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

export const exportZincDraft = async dataObj => {
  try {
    console.log('export DraftMou list', dataObj);

    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.EXPORT_ZINCDRAFT}`,
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
    return response.data;
  } catch (error) {
    console.error('Error fetching credit balance', error);
    throw error;
  }
};

export const mouCustomerList = async dataObj => {
  try {
    console.log('mou customer list', dataObj);

    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.MOU_CUSTOMER_LIST}`,
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
    return response.data;
  } catch (error) {
    console.error('Error mou customer list', error);
    throw error;
  }
};

export const nfaApproverUserIdList = async dataObj => {
  try {
    console.log('nfa userid list', dataObj);

    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.NFA_APPROVER_USERID_NAMELIST}`,
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
    return response.data;
  } catch (error) {
    console.error('Error nfa user id list', error);
    throw error;
  }
};

export const getNfa = async dataObj => {
  try {
    // console.log('nfa view', dataObj);
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.GET_NFA}`,
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
    return response.data;
  } catch (error) {
    console.error('Error nfa user id list', error);
    throw error;
  }
};

export const downloadNFAPdf = async (nfaId) => {
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    return await axios.get(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.DOWNLOAD_NFA_PDF}${nfaId}`,
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

export const draftMou = async () => {
  try {
    // console.log('DRAFT MOU', dataObj);
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.get(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.DRAFT_MOU}`,
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
    console.error('Error nfa user id list', error);
    throw error;
  }
};

export const fetchDraftMou = async dataObj => {
  try {
    console.log('fetch DRAFT MOU', dataObj);
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.FETCH_DRAFTMOU}`,
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
    return response.data;
  } catch (error) {
    console.error('Error nfa user id list', error);
    throw error;
  }
};

export const exportDraftMou = async dataObj => {
  try {
    console.log('export DRAFT MOU', dataObj);
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.EXPORT_DRAFTCONTRACT_MOU}`,
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
    return response.data;
  } catch (error) {
    console.error('Error nfa user id list', error);
    throw error;
  }
};