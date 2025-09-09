// import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from './constant';
import axios from 'axios';

export const pendingTasks = async dataObj => {
  try {
    console.log('data pending tasks payload', dataObj);

    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const response = await axios.post(
      `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.PENDING_TASKS}`,
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