// import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from './constant';
import axios from 'axios';

export const saveNotification = async (auth, dataObj) => {
    console.log("token object is", dataObj);
    try {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        const jsonSessionData = sessionData ? JSON.parse(sessionData) : null;
        const plantId = getPlantId ? JSON.parse(getPlantId) : null;
        console.log('session dta', jsonSessionData);

        const response = await axios.post(
            `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.SAVE_TOKEN}`,
            dataObj,
            {
                headers: {
                    'Content-Type': 'application/json',
                    idbranch: plantId?.plantId,
                    idcompany: jsonSessionData?.companyId,
                    iduser: auth?.userId,
                    token: auth?.token,
                    application: '1',
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error Save Token:', error);
        throw error;
    }
};

export const removeToken = async dataObj => {
    console.log("remove token object is", dataObj);
    try {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        const jsonSessionData = sessionData ? JSON.parse(sessionData) : null;
        const plantId = getPlantId ? JSON.parse(getPlantId) : null;
        console.log('session dta', jsonSessionData);

        const response = await axios.post(
            `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.REMOVE_TOKEN}`,
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
        console.error('Error remove token:', error);
        throw error;
    }
};
