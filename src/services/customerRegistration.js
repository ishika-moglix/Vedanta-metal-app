// import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from './constant';
import axios from 'axios';

export const customerListing = async dataObj => {
    try {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        return await axios.post(
            `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.CUSTOMERLISTING}`,
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
        console.log("Error", error);
    }
};

export const getPlantRequest = async dataObj => {
    try {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        return await axios.post(
            `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.PLANTREQUEST}`,
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
        console.log("Error", error);
    }
};

export const getAllByCompany = async dataObj => {
    try {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        console.log("getAllByCompany dataonj", dataObj);
        
        return await axios.post(
            `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.GETALLBYCOMPANY}`,
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
        console.log("Error", error);
    }
};

export const getDetailsCustomer = async dataObj => {
    try {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        console.log("GETDETAILS dataoBj", dataObj);
        
        return await axios.post(
            `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.GETDETAILS}`,
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
        console.log("Error", error);
    }
};
export const getByCompany = async dataObj => {
    try {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        console.log("getByCompany dataonj", dataObj);
        return await axios.post(
            `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.GETBYCOMPANY}`,
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
        console.log("Error", error);
    }
};

export const userGet = async dataObj => {
    try {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        console.log("userGet dataonj", dataObj);
        return await axios.post(
            `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.USER_GET}`,
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
        console.log("Error", error);
    }
};

export const companyGet = async dataObj => {
    try {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        console.log("companyGet dataonj", dataObj);
        return await axios.post(
            `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.COMPANY_GET}`,
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
        console.log("Error", error);
    }
};

export const approveAction = async dataObj => {
    try {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        console.log("companyGet dataonj", dataObj);
        return await axios.post(
            `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.APPROVEACTION}`,
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
        console.log("Error", error);
    }
};
export const updateCustomerUser = async dataObj => {
    try {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        console.log("updateCustomerUser dataonj", dataObj);
        return await axios.post(
            `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.UPDATE_CUSTOMERUSER}`,
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
        console.log("Error", error);
    }
};

export const rejectAction = async dataObj => {
    try {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        console.log("rejectAction dataonj", dataObj);
        return await axios.post(
            `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.REJECTACTION}`,
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
        console.log("Error", error);
    }
};

