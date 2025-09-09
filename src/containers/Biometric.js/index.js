import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
// import styles from './style';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import BiometricAuth from '../../utils/BiometricAuth';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../redux/actions/auth';
import { setAuth } from '../../redux/feature/authslice';
import { STATE_STATUS } from '../../redux/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dimension from '../../Theme/Dimension';
import colors from '../../Theme/Colors';

const BiometricScreen = () => {
  const [biometricType, setBiometricType] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [hasFaceAuth, setHasFaceAuth] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    //console.log('hit');
    // getData();
    checkBiometrics();
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_info');
      //console.log(jsonValue);

      if (jsonValue) {
        const userInfo = JSON.parse(jsonValue);
        dispatch(
          setAuth({
            status: STATE_STATUS.FETCHED,
            data: userInfo,
            isLoggedIn: true,
          }),
        );
        // dispatch(setLogin(route.params.setIsLoggedIn));
        // route.params.setIsLoggedIn(true);
        //navigation.navigate("Feed",{userInfo:JSON.parse(jsonValue)})
      } else {
        navigation.replace('Verification');
      }
    } catch (e) {
      //console.log(e);
      // error reading value
    }
  };

  const checkBiometrics = async () => {
    const { available, type } = await BiometricAuth.isBiometricsAvailable();
    //console.log('available', available, 'type', type);

    const { available: faceAvailable } =
      await BiometricAuth.isFaceAuthAvailable();
    //console.log('available', available, faceAvailable);
    setIsAvailable(available);
    setBiometricType(type);
    setHasFaceAuth(faceAvailable);
  };

  const handleFingerprint = async () => {
    if (!isAvailable) {
      Toast.show({
        type: 'error',
        text2:
          response?.message || 'Fingerprint authentication is not available',
        visibilityTime: 4000,
        autoHide: true,
      });
      // Alert.alert('Error', 'Fingerprint authentication is not available');
      return;
    }

    const { success, error } = await BiometricAuth.authenticate(
      'Authenticate using fingerprint',
    );

    if (success) {
      //   dispatch(
      //     setAuth({
      //       status: STATE_STATUS.FETCHED,
      //       data: userInfo,
      //       isLoggedIn: true,
      //     }),
      //   );
      getData();
      Toast.show({
        type: 'success',
        text2: response?.message || 'Fingerprint authentication successful!',
        visibilityTime: 4000,
        autoHide: true,
      });
      // Alert.alert('Success', 'Fingerprint authentication successful!');
    } else {
      Toast.show({
        type: 'error',
        text2: response?.message || 'Authentication failed',
        visibilityTime: 4000,
        autoHide: true,
      });
      //  Alert.alert('Error', error || 'Authentication failed');
    }
  };

  const handleFaceAuthentication = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    //console.log(biometryType, 'type!!');

    if (available && biometryType === BiometryTypes.Biometrics) {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Confirm your identity',
        cancelButtonText: 'Cancel',
      });

      if (success) {
        Toast.show({
          type: 'success',
          text2: response?.message || 'Authenticated successfully!',
          visibilityTime: 4000,
          autoHide: true,
        });
        //Alert.alert('Authenticated successfully!');
      } else {
        Toast.show({
          type: 'success',
          text2: response?.message || 'Authentication failed or canceled.',
          visibilityTime: 4000,
          autoHide: true,
        });
        // Alert.alert('Authentication failed or canceled.');
      }
    } else {
      Toast.show({
        type: 'success',
        text2: response?.message || 'Biometric authentication not available',
        visibilityTime: 4000,
        autoHide: true,
      });
      // Alert.alert(
      //   'Biometric authentication not available',
      //   `Available type: ${biometryType || 'None'}`,
      // );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
      <Image
        resizeMode={'contain'}
        style={styles.logoImage}
        source={require('../../assets/images/logo.png')}
      // resizeMode="contain"
      ></Image>
      {/* <Text
        style={{
          fontSize: 16,
          marginBottom: 30,
          textAlign: 'center',
        }}>
        {isAvailable
          ? `${biometricType} is available`
          : 'Biometric authentication is not available'}
      </Text> */}

      {!hasFaceAuth && isAvailable ? (
        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            padding: 15,
            borderRadius: 10,
            width: '80%',
            marginBottom: 15,
          }}
          onPress={handleFingerprint}>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              textAlign: 'center',
              fontWeight: '600',
            }}>
            Authenticate with Fingerprint
          </Text>
        </TouchableOpacity>
      ) : null}
      {hasFaceAuth ? (
        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            padding: 15,
            borderRadius: 10,
            width: '80%',
            marginBottom: 15,
            backgroundColor: '#34C759',
          }}
          onPress={handleFaceAuthentication}>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              textAlign: 'center',
              fontWeight: '600',
            }}>
            Authenticate with{' '}
            {Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  logoImage: {
    width: Dimension.width133,
    height: Dimension.height28,
    //  marginLeft:Dimension.margin10
  },
});
export default BiometricScreen;
