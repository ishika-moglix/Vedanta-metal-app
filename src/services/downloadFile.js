import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from './constant';
import axios from 'axios';

export const downloadTcFile = async url => {
  try {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    const jsonSessionData = sessionData ? JSON.parse(sessionData) : null;
    const plantId = getPlantId ? JSON.parse(getPlantId) : null;

    const response = await axios.get(
      `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.ISFILE_EXISTS}`,
      {
        params: {
          url: url,
        },
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
    console.error('Error Download file:', error);
    throw error;
  }
};
