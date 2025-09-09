import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import Toast from 'react-native-toast-message';
import { AlLiveTrackingLink } from '../constants';
import { Alert } from 'react-native';
class BiometricAuth {
  constructor() {
    this.rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true,
    });
  }

  async isBiometricsAvailable() {
    try {
      const { available, biometryType } =
        await this.rnBiometrics.isSensorAvailable();

      if (available) {
        switch (biometryType) {
          case BiometryTypes.TouchID:
            return { available: true, type: 'TouchID' };
          case BiometryTypes.FaceID:
            return { available: true, type: 'FaceID' };
          case BiometryTypes.Biometrics:
            return { available: true, type: 'Biometrics' };
          default:
            return { available: false, type: null };
        }
      }

      return { available: false, type: null };
    } catch (error) {
      console.error('Error checking biometrics:', error);
      return { available: false, type: null, error };
    }
  }

  async createKeys() {
    try {
      const { publicKey } = await this.rnBiometrics.createKeys();
      return { success: true, publicKey };
    } catch (error) {
      console.error('Error creating keys:', error);
      return { success: false, error };
    }
  }

  async authenticate(promptMessage = 'Confirm your identity') {
    try {
      const { success, error } = await this.rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Cancel',
      });

      return { success, error };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error };
    }
  }

  async signData(payload) {
    try {
      const { success, signature } = await this.rnBiometrics.createSignature({
        promptMessage: 'Sign in to continue',
        payload,
        cancelButtonText: 'Cancel',
      });

      return { success, signature };
    } catch (error) {
      console.error('Signing error:', error);
      return { success: false, error };
    }
  }

  async isFaceAuthAvailable() {
    try {
      const { available, biometryType } =
        await this.rnBiometrics.isSensorAvailable();

      if (available) {
        if (
          biometryType === BiometryTypes.FaceID ||
          (biometryType === BiometryTypes.Biometrics &&
            Platform.OS === 'android')
        ) {
          return {
            available: true,
            type:
              biometryType === BiometryTypes.FaceID ? 'FaceID' : 'Face Auth',
          };
        }
      }
      return { available: false, type: null };
    } catch (error) {
      console.error('Error checking face auth:', error);
      return { available: false, type: null, error };
    }
  }

  async authenticateWithFace() {
    try {
      const {
        available,
        type,
        error: availabilityError,
      } = await this.isFaceAuthAvailable();

      if (!available) {
        return {
          success: false,
          error:
            availabilityError ||
            'Face authentication is not available on this device',
        };
      }

      const promptMessage =
        Platform.OS === 'ios'
          ? 'Authenticate with Face ID'
          : 'Look at the camera to authenticate';

      const { success, error } = await this.rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Cancel',
        fallbackPromptMessage: 'Please use face authentication to continue',
        confirmationRequired: true,
      });

      if (success) {
        return {
          success: true,
          type,
          message: `Successfully authenticated using ${type}`,
        };
      } else {
        return {
          success: false,
          error: error || 'Face authentication failed',
          type,
        };
      }
    } catch (error) {
      console.error('Face authentication error:', error);
      return {
        success: false,
        error: error.message || 'Face authentication failed',
        type: null,
      };
    }
  }

  async signDataWithFace(payload) {
    try {
      const { available, type } = await this.isFaceAuthAvailable();

      if (!available) {
        return {
          success: false,
          error: 'Face authentication is not available',
        };
      }

      const promptMessage =
        Platform.OS === 'ios'
          ? 'Sign with Face ID'
          : 'Look at the camera to sign';

      const { success, signature } = await this.rnBiometrics.createSignature({
        promptMessage,
        payload,
        cancelButtonText: 'Cancel',
      });

      return {
        success,
        signature,
        type,
        error: success
          ? null
          : 'Failed to create signature with face authentication',
      };
    } catch (error) {
      console.error('Error signing with face:', error);
      return {
        success: false,
        error: error.message || 'Failed to sign with face authentication',
      };
    }
  }
}
export const convertedDate = epochTime => {
  try {
    const date = new Date(epochTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day}/${month}/${year}`;
    // return `${day}/${month}/${year} | ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  } catch (error) {
    return '';
  }
};

export const convertedDated = epochTime => {
  try {
    const date = new Date(epochTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    // return `${day}/${month}/${year}`;
    return `${day}/${month}/${year} | ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  } catch (error) {
    return '';
  }
};

export function convertDateToEndOfDayTimestamp(dateString) {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day, 23, 59, 59, 999);
  return date.getTime();
}

export function convertDateToTimestamp(dateString) {
  const [day, month, year] = dateString.split('/').map(Number);
  const timestamp = new Date(year, month - 1, day).getTime();
  return timestamp;
}
// export const convertedDate = time => {
//   try {
//     const date = new Date(time);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();

//     let hours = date.getHours();
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';

//     hours = hours % 12;
//     hours = hours ? hours : 12;

//     return `${day}/${month}/${year} | ${String(hours).padStart(
//       2,
//       '0',
//     )}:${minutes} ${ampm}`;
//   } catch (error) {
//     return '';
//   }
// };
export const convertEpochToDate = (epoch) => {
  if (!epoch) return '';

  const date = new Date(epoch);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export const convertDate = time => {
  try {
    return new Date(time).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  } catch (error) {
    return new Date();
  }
};

export const formatIndianCurrency = amount => {
  return parseFloat(amount)
    .toFixed(2)
    .replace(/\B(?=(\d{3})(\d{2})*(?!\d))/g, ',');
};
export const showMessage = (type, message) => {
  if (type === 'error') {
    // Alert.alert(message)
    Toast.show({
      type: 'error',
      text2: message,
      visibilityTime: 4000,
      autoHide: true,
    });
    // alert(message);
  }
};

export const formatTimeStatus = (sentAt) => {
  const now = new Date();
  const date = new Date(sentAt);
  const isToday = now.toDateString() === date.toDateString();

  if (isToday) {
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      // year: 'numeric',
  }); 
};

export const roundToTwoDecimals = (number) => {
  if (!isNaN(number)) {
    return parseFloat(number).toFixed(2);
  }
  return '0.00';
};

export default new BiometricAuth();
