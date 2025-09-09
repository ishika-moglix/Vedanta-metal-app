import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import styles from './style';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import Dimension from '../../Theme/Dimension';
import { ScannerService } from '../../services/scannerService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../services/constant';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import BiometricAuth from '../../utils/BiometricAuth';
import { setBranchAccess } from '../../redux/feature/branchSlice';
import { STATE_STATUS } from '../../redux/constants';
import { setCartCount } from '../../redux/feature/homeSlice';
const LoginFirstScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth?.data);
  const [loader, setLoader] = useState(false);
  const [selectedProd, setProd] = useState('');

  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@user_info', jsonValue);
    } catch (e) {
      console.log(e);
      // saving error
    }
  };

  useEffect(() => {
    dispatch(
      setBranchAccess({
        status: STATE_STATUS.UNFETCHED,
        data: {},
      }),
    );
    dispatch(
      setCartCount({
        status: STATE_STATUS.UNFETCHED,
        count: 0,
      }),
    );
    // dispatch(
    //   setBusinessDetails({
    //     status: STATE_STATUS.UNFETCHED,
    //     data: {},
    //   }),
    // );
    // dispatch(
    //   setPlantDetails({
    //     status: STATE_STATUS.UNFETCHED,
    //     data: {},
    //   }),
    // );
    // dispatch(
    //   setBankDetails({
    //     status: STATE_STATUS.UNFETCHED,
    //     data: {},
    //   }),
    // );
  }, []);

  const sessionDetail = () => {
    ScannerService.Login(obj).then(data => {
      if (data.successful) {
        console.log(data.data.session.userData);
        navigation.navigate('Feed');
      }
    });
  };

  const openCatWebview = () => {
    let navURL = CONSTANTS.WEBURL.CATEGORY;
    navigation?.navigate('WebView', {
      URL: navURL,
      beforeLogin: true,
      fromExp: 'exploreText',
      showBack: true,
    });
  };

  const openContactWebview = () => {
    let navURL =
      CONSTANTS.WEBURL.CATEGORY.replace('?isApp=true', '') + '#contact';
    navigation?.navigate('WebView', {
      URL: navURL,
      fromExp: 'exploreText',
      showBack: true,
    });
  };

  // const openCatWebview = () => {
  //   let navURL = CONSTANTS.WEBURL.CATEGORY;
  //   console.log('explore text message', navURL);

  //   navigation.navigate('WebView', {
  //     URL: navURL,
  //     fromExp: 'exploreText',
  //     showBack: true,
  //   });
  // };

  // const openContactWebview = () => {
  //   let navURL =
  //     CONSTANTS.WEBURL.CATEGORY.replace('?isApp=true', '') + '#contact';
  //   navigation.navigate('WebView', {
  //     URL: navURL,
  //     beforeLogin: true,
  //     fromExp: 'exploreText',
  //     showBack: true,
  //   });
  // };

  const webSignup = () => {
    let navURL = CONSTANTS.WEBURL.SIGNUP;
    navigation.navigate('WebView', { URL: navURL });
  };

  return (
    <>
      {/* <StatusBar
        translucent
        backgroundColor="#F0F7FF"
        barStyle={'dark-content'}
      /> */}
      <LinearGradient
        colors={['#E8F5FF', '#FFFFFF']}
        style={{
          width: '100%',
          flex: 1,
        }}>
        <View style={styles.container}>
          <Image
            style={styles.Logo}
            source={require('../../assets/images/logo.png')}
            resizeMode="contain"></Image>
          <Image
            style={styles.image}
            source={require('../../assets/images/img1.png')}
            resizeMode="contain"></Image>
          <View style={styles.titleWrap}>
            <Text style={styles.title}> Welcome to the </Text>
            <Text style={[styles.title2]}>
              <Text style={{ color: '#0063A7' }}> World’s Largest </Text>
              <Text style={{ color: '#82C458' }}>Metalbazaar</Text>
            </Text>
          </View>
          <Text style={styles.descriptionText}>
            {' '}
            Experience Next Generation Metal Buying and
          </Text>
          <Text
            style={{
              fontSize: Dimension.font15,
              color: '#000000',
              alignSelf: 'center',
              marginTop: Dimension.margin3,
              fontFamily: Dimension.CustomMediumFont,
              // marginBottom: 30,
            }}>
            {' '}
            Grow Your Business with Us{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.push('Login')}
            style={styles.loginBtn}>
            {loader && (
              <ActivityIndicator
                color={'#fff'}
                size={'small'}
                style={{ marginRight: 12 }}
              />
            )}
            <Text style={styles.loginText}>Sign In </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => navigation.push('SignUp')}
            style={styles.signupBtn}>
            <Text style={styles.signupText}>Sign Up as Buyer </Text>
          </TouchableOpacity> */}
          <View
            style={[
              styles.row,
              {
                marginTop: Dimension.margin30,
                paddingBottom: Dimension.padding50,
              },
            ]}>
            <TouchableOpacity onPress={openCatWebview}>
              <Text style={styles.exloreTxt}>Explore Catalog</Text>
            </TouchableOpacity>

            <View
              style={{
                marginHorizontal: Dimension.margin30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: Dimension.font18,
                  color: '#000',
                  textAlign: 'center',
                }}>
                |
              </Text>
            </View>

            <TouchableOpacity onPress={openContactWebview}>
              <Text style={styles.exloreTxt}>Contact Us</Text>
            </TouchableOpacity>
          </View>
          {/* {selectedProd != 'Zinc' ? null : (
            <TouchableOpacity onPress={onLogin} style={styles.loginBtn}>
              <Text style={styles.loginText}>Login with Microsoft </Text>
            </TouchableOpacity>
          )} */}
          <View style={styles.BottomTxtWrap}>
            <Text style={styles.BottomTxt}>
              © Copyrights {new Date().getFullYear()} Vedanta Metalbazaar
            </Text>
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

export default LoginFirstScreen;

// const LoginFirstScreen = () => {
//   const [biometricType, setBiometricType] = useState(null);
//   const [isAvailable, setIsAvailable] = useState(false);
//   const [hasFaceAuth, setHasFaceAuth] = useState(false);

//   useEffect(() => {
//     console.log('hit');

//     checkBiometrics();
//   }, []);

//   const checkBiometrics = async () => {
//     const {available, type} = await BiometricAuth.isBiometricsAvailable();
//     console.log('available', available, 'type', type);

//     const {available: faceAvailable} =
//       await BiometricAuth.isFaceAuthAvailable();
//     console.log('available', available, faceAvailable);
//     setIsAvailable(available);
//     setBiometricType(type);
//     setHasFaceAuth(faceAvailable);
//   };

//   const handleFingerprint = async () => {
//     if (!isAvailable) {
//       Alert.alert('Error', 'Fingerprint authentication is not available');
//       return;
//     }

//     const {success, error} = await BiometricAuth.authenticate(
//       'Authenticate using fingerprint',
//     );

//     if (success) {
//       Alert.alert('Success', 'Fingerprint authentication successful!');
//     } else {
//       Alert.alert('Error', error || 'Authentication failed');
//     }
//   };

//   const handleFaceAuthentication = async () => {
//     const rnBiometrics = new ReactNativeBiometrics();
//     // Check if biometrics are available
//     const {available, biometryType} = await rnBiometrics.isSensorAvailable();
//     console.log(biometryType, 'type!!');

//     if (available && biometryType === BiometryTypes.Biometrics) {
//       // Prompt user for biometric authentication
//       const {success} = await rnBiometrics.simplePrompt({
//         promptMessage: 'Confirm your identity',
//         cancelButtonText: 'Cancel',
//       });

//       if (success) {
//         Alert.alert('Authenticated successfully!');
//       } else {
//         Alert.alert('Authentication failed or canceled.');
//       }
//     } else {
//       Alert.alert(
//         'Biometric authentication not available',
//         `Available type: ${biometryType || 'None'}`,
//       );
//     }
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//       }}>
//       <Text
//         style={{
//           fontSize: 24,
//           fontWeight: 'bold',
//           marginBottom: 20,
//         }}>
//         Biometric Authentication
//       </Text>
//       <Text
//         style={{
//           fontSize: 16,
//           marginBottom: 30,
//           textAlign: 'center',
//         }}>
//         {isAvailable
//           ? `${biometricType} is available`
//           : 'Biometric authentication is not available'}
//       </Text>

//       {isAvailable && (
//         <TouchableOpacity
//           style={{
//             backgroundColor: '#007AFF',
//             padding: 15,
//             borderRadius: 10,
//             width: '80%',
//             marginBottom: 15,
//           }}
//           onPress={handleFingerprint}>
//           <Text
//             style={{
//               color: 'white',
//               fontSize: 16,
//               textAlign: 'center',
//               fontWeight: '600',
//             }}>
//             Authenticate with Fingerprint
//           </Text>
//         </TouchableOpacity>
//       )}

//       {hasFaceAuth && (
//         <TouchableOpacity
//           style={{
//             backgroundColor: '#007AFF',
//             padding: 15,
//             borderRadius: 10,
//             width: '80%',
//             marginBottom: 15,
//             backgroundColor: '#34C759',
//           }}
//           onPress={handleFaceAuthentication}>
//           <Text
//             style={{
//               color: 'white',
//               fontSize: 16,
//               textAlign: 'center',
//               fontWeight: '600',
//             }}>
//             Authenticate with{' '}
//             {Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition'}
//           </Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// export default LoginFirstScreen;
