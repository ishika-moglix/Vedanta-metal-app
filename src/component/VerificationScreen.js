import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  StatusBar,
  NativeModules,
  Button,
  ScrollView,
  ActivityIndicator,
  InteractionManager,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
} from 'react-native';
// import styles from './style';
import {
  Text,
  View,
  TextInput,
  ActionSheetIOS,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import Dimension from '../Theme/Dimension';
// import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FloatingLabelInputField from '../component/FloatingInput';
import { ScannerService } from '../services/scannerService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../services/constant';
// import AzureAuth from 'react-native-azure-auth';
import ENV from '../services/url';
import { useDispatch } from 'react-redux';
import AesUtil from '../generic/index';
import CryptoJS from 'crypto-js';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../component/Header';
import { Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import { passwordExp } from '../constants';
const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
import Colors from '../Theme/Colors';
import config from '../services';

const CLIENT_ID = ENV[config.PROJECT_ENV].MICROSOFT_CLIENT_ID; //'ac5fc872-17f9-4f59-af74-3abbe885956e'; //'ff1fe9da-d218-4ceb-a11f-05ea54a985fb';

// const azureAuth = new AzureAuth({
//   clientId: CLIENT_ID,
// });

const VerificationScreen = props => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [checkboxState, setCheckboxState] = useState(false);
  const [selectedProd, setProd] = useState('');
  const [result, setResult] = useState('Select Business Unit');
  const [isVisible, setIsVisible] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [timer, setTimer] = useState(300);
  const [changeView, setChangeView] = useState(true);
  const [forgotResp, setForgotResp] = useState('');
  // const [pwd, setPwd] = useState('');
  const [confirmpwd, setConfirmPwd] = useState('');
  const [inputType, setInputType] = useState(true);
  // const [selectedProd, setProd] = useState('');
  const [errorMesg, setErrorMessage] = useState('');
  const [pwdError, setPwdError] = useState(false);
  const inputRef = useRef();
  const intervalRef = useRef(null);

  const isCtaDisabled = () => {
    return (
      otp.length != 6 ||
      !pwd.match(passwordExp) ||
      !confirmpwd.match(passwordExp) ||
      pwd !== confirmpwd
    );
  };
  const handleLoginWithOtp = () => {
    setIsOtpLogin(true); // Switch to OTP login
  };

  const onAutoFocus = () => {
    if (inputRef && inputRef.current && !otpCorrect) {
      inputRef.current.blur();
      inputRef.current.focus();
    }
  };
  useEffect(() => {
    if (changeView) {
      InteractionManager.runAfterInteractions(() => {
        onAutoFocus();
      });
      startTimer();
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [changeView]);

  const startTimer = () => {
    setTimer(300);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return 0;
        }
      });
    }, 1000);
  };

  useEffect(() => {
    if (confirmpwd && pwd !== confirmpwd) {
      setPwdError(true);
      setErrorMessage('Passwords do not match.');
    } else {
      setPwdError(false);
      setErrorMessage('');
    }
  }, [pwd, confirmpwd]);
  const getData2 = (salt, iv) => {
    let aesUtil = new AesUtil(128, 1000);
    let encryptedPassword = aesUtil.encrypt(
      salt, //salt
      iv, //iv
      '1234567891234567', //key
      pwd, //text
    );

    let encryptedConfirmPassword = aesUtil.encrypt(
      salt, // salt
      iv, // iv
      '1234567891234567', // key
      confirmpwd, // text (confirm password)
    );

    let encryptedPwdString = iv + '::' + salt + '::' + encryptedPassword;
    let encryptedConfirmPwdString =
      iv + '::' + salt + '::' + encryptedConfirmPassword;

    let finalPassword = Base64.btoa(encryptedPwdString);
    let finalConfirmPassword = Base64.btoa(encryptedConfirmPwdString);
    //console.log(finalConfirmPassword === finalPassword);

    handleResetPassword(finalPassword, finalConfirmPassword);
  };

  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  const Base64 = {
    btoa: input => {
      let str = input;
      let output = '';

      for (
        let block = 0, charCode, i = 0, map = chars;
        str.charAt(i | 0) || ((map = '='), i % 1);
        output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
      ) {
        charCode = str.charCodeAt((i += 3 / 4));

        if (charCode > 0xff) {
          throw new Error(
            "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
          );
        }
        block = (block << 8) | charCode;
      }
      return output;
    },
  };
  const getRandomInt = (min = 1, max = 999) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  };

  const randomArray = () => {
    return [getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt()];
  };

  // //console.log('otp', props);

  const handleResetPassword = async newPwd => {
    setLoader(true);
    try {
      const response = await ScannerService.resetPassword(
        newPwd,
        props?.route?.params?.data?.userId ||
        props?.route?.params?.data?.userId,
        props?.route?.params?.data?.key || props?.route?.params?.data?.key,
        otp,
      );

      if (response?.data?.successful) {
        //console.log('hit');

        Toast.show({
          type: 'success',
          text2: response?.message || 'Password reset successfully ',
          visibilityTime: 4000,
          autoHide: true,
        });
        props?.navigation.navigate('Login');
      } else {
        Toast.show({
          type: 'error',
          text2: response?.message || 'Invalid Otp',
          visibilityTime: 4000,
          autoHide: true,
        });
        setLoader(false);
        // props?.navigation?.pop();
      }
    } catch (error) {
      setLoader(false);
      Toast.show({
        type: 'error',
        text2: response?.message || 'Invalid Otp',
        visibilityTime: 4000,
        autoHide: true,
      });
      //alert('Failed to send OTP. Please try again.');
      console.error(error);
    }
  };
  const onPressResetPwd = () => {
    let iv1 = CryptoJS.lib.WordArray.create(randomArray()).toString(
      CryptoJS.enc.Hex,
    );
    let salt1 = CryptoJS.lib.WordArray.create(randomArray()).toString(
      CryptoJS.enc.Hex,
    );
    getData2(salt1, iv1);
    // setPwd('');
  };
  const handleForgetPassword = async () => {
    try {
      const response = await ScannerService.forgotPassword(
        props?.route.params.email,
      );
      if (response?.successful) {
        setChangeView(true);
        //console.log('data fp', response);
        const data = response.data;
        setForgotResp(data);
        Toast.show({
          type: 'success',
          text2: response?.message || 'Success',
          visibilityTime: 4000,
          autoHide: true,
        });
        // navigation.navigate('Verification', {data});
      } else {
        Toast.show({
          type: 'error',
          text2: response?.message || 'Success',
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    } catch (error) {
      setLoader(false);
      Toast.show({
        type: 'error',
        text2: response?.data?.message || 'Success',
        visibilityTime: 4000,
        autoHide: true,
      });
      console.error(error);
    }
  };

  // const handleVerification = () => {
  //   props?.navigation.push('ChoosePassword', {
  //     otp,
  //     data: props?.route?.params || forgotResp,
  //   });
  // };
  // //console.log('props', props);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
          <Header
            showBack
            showText={'Verification Code'}
            beforeLogin
            // auth={auth}
            navigation={props?.navigation}
          />
          {/* <View style={styles.LoginBg}> */}
          {/* <KeyboardAvoidingView
            behavior={Platform.OS == 'android' ? 'padding' : 'position'}> */}
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.titleWrap}>
                <Text style={styles.title}>Enter Verification Code </Text>
                <Text style={styles.title2}>
                  For your security, we have sent the code to your email{' '}
                  {props?.route?.params?.email}
                  {/* & mobile no. xxxxxxx156 */}
                </Text>
              </View>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 12,
                  marginBottom: Dimension.margin8,
                  marginTop: Dimension.margin20,
                }}>
                Enter OTP*
              </Text>
              <View style={styles.inputView}>
                <FloatingLabelInputField
                  placeholder={'Enter OTP'}
                  //label="Enter OTP"
                  value={otp}
                  onChangeText={setOtp}
                  style={styles.input}
                  maxLength={6}
                  keyboardType="number-pad"
                />
              </View>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 12,
                  marginBottom: Dimension.margin8,
                  marginTop: Dimension.margin20,
                }}>
                New Password*
              </Text>
              <View style={styles.inputView}>
                <FloatingLabelInputField
                  placeholder={'Enter New Password'}
                  value={pwd}
                  onChangeText={text => setPwd(text)}
                  maxLength={20}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 12,
                  marginBottom: Dimension.margin8,
                  marginTop: Dimension.margin20,
                }}>
                Confirm New Password*
              </Text>
              <View style={styles.inputView}>
                <FloatingLabelInputField
                  placeholder={'Confirm New Password'}
                  value={confirmpwd}
                  onChangeText={text => setConfirmPwd(text)}
                  style={styles.input}
                  maxLength={20}
                  secureTextEntry={inputType}
                  textStyle={{
                    fontSize: Dimension.font14,
                    fontFamily: Dimension.CustomRegularFont,
                    borderWidth: 1,
                    borderRightWidth: 0,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                  buttonEnabled
                  buttonComponent={
                    <TouchableOpacity
                      onPress={() => setInputType(!inputType)}
                      style={{
                        backgroundColor: '#fff',
                        padding: 10,
                        borderRadius: 5,
                      }}>
                      <AntDesign name="eyeo" size={18} color="#000" />
                    </TouchableOpacity>
                  }
                />
              </View>
              {pwdError && <Text style={styles.errorText}>{errorMesg}</Text>}
              {/* <TouchableOpacity
                onPress={onPressResetPwd}
                disabled={isCtaDisabled()}
                style={[
                  styles.loginBtn,
                  {backgroundColor: isCtaDisabled() ? '#CCCCCC' : '#0064A8'},
                ]}> */}
              <View style={styles.resendOtpContainer}>
                <View style={{ width: '60%' }}>
                  <Text style={styles.codeNotReceivedText}>
                    Didn't receive the code?
                  </Text>
                  <Text
                    style={[
                      styles.codeNotReceivedText,
                      {
                        fontFamily: Dimension.CustomBoldFont,
                        marginTop: Dimension.margin5,
                        fontWeight: '800',
                      },
                    ]}>
                    Resend in {String(Math.floor(timer / 60)).padStart(2, '0')}:
                    {String(timer % 60).padStart(2, '0')}
                  </Text>
                </View>
                <TouchableOpacity
                  disabled={timer != 0}
                  onPress={() => {
                    handleForgetPassword();
                    startTimer();
                  }}>
                  <Text
                    style={[
                      styles.resendOtpText,
                      { color: timer != 0 ? '#D9D9D9' : '#0064A8' },
                    ]}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={onPressResetPwd}
                disabled={loader || isCtaDisabled()}
                style={[
                  styles.loginBtn,
                  { backgroundColor: isCtaDisabled() ? '#CCCCCC' : '#0064A8' },
                ]}>
                {loader && (
                  <ActivityIndicator
                    color={'#fff'}
                    size={'small'}
                    style={{ marginRight: 12 }}
                  />
                )}
                <Text style={styles.loginText}>Reset Password </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={handleVerification}
                disabled={isCtaDisabled()}
                style={[
                  styles.loginBtn,
                  {backgroundColor: isCtaDisabled() ? '#CCCCCC' : '#0064A8'},
                ]}>
                {loader && (
                  <ActivityIndicator
                    color={'#fff'}
                    size={'small'}
                    style={{marginRight: 12}}
                  />
                )}
                <Text style={styles.loginText}>Submit Code </Text>
              </TouchableOpacity> */}
            </View>
          </ScrollView>
          {/* </KeyboardAvoidingView> */}
        </LinearGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  btntxt:
    Platform.OS === 'ios'
      ? {
        color: Colors.WhiteColor,
        fontSize: Dimension.font14,
        fontFamily: Dimension.CustomBoldFont,
        fontWeight: '700',
      }
      : {
        color: Colors.WhiteColor,
        fontSize: Dimension.font14,
        fontFamily: Dimension.CustomBoldFont,
        alignSelf: 'center',
      },
  btnStyle: {
    backgroundColor: '#0262a8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: Dimension.padding20,
    height: Dimension.height45,
  },
  btnContainer: {
    backgroundColor: '#0262a8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    height: Dimension.height45,
    marginTop: Dimension.margin100,
  },
  result: {
    fontSize: 12,
    textAlign: 'center',
    color: '#0064A8',
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  Logo: {
    //width:"100%",
    height: 36,
    alignSelf: 'center',
    //backgroundColor:"#ccc",
    width: 175,
  },
  container: {
    padding: Dimension.padding20,
    position: 'relative',
    flex: 1,
    paddingTop: Dimension.padding0,
  },

  exploreBtn: {
    //backgroundColor: '#0262a8',
    paddingVertical: Dimension.padding12,

    marginVertical: Dimension.margin10,
    marginBottom: Dimension.margin40,
  },
  pickerContainer: {
    //position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  pickerStyle: {
    color: Colors.FontColor,
    //color : "#0064A8",
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font14,
    marginLeft: 8,
    marginVertical: 11,
  },
  exloreTxt: {
    alignSelf: 'center',
    color: '#0064A8',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  LoginBg: {
    width: '100%',
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleWrap: {
    marginTop: 97,
  },
  title: {
    fontFamily: Dimension.CustomBoldFont,
    fontSize: Dimension.font22,
    color: Colors.FontColor1,
    marginBottom: 15,
  },
  title2: {
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font14,
    color: Colors.FontColor1,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#0064A8',
    borderRadius: 4,
    padding: 1,
    marginBottom: Dimension.margin10,
    width: Dimension.width210,
    height: Dimension.height50,
    backgroundColor: '#fff',
  },
  // pickerWrap: {
  //   borderWidth: 1,
  //   borderColor: '#363636',
  //   width: '100%',
  //   // height: 45,
  //   borderRadius: 4,
  // padding: 1,
  // marginBottom: Dimension.margin20,
  // },
  pickerWrapBtn: {
    height: 40,
    paddingLeft: Dimension.padding8,
    alignItems: 'flex-start',
    paddingVertical: 13,
    position: 'relative',
  },
  PickerTxt: {
    color: '#0064A8',
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font12,
    marginTop: Dimension.margin5,
  },
  inputView: {
    width: '100%',
    // marginBottom: Dimension.margin20,
    padding: 0,
  },
  forgotPassWrap: {
    marginVertical: Dimension.margin10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forgotpassTxt: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomRegularFont,
    color: '#278BED',
    marginTop: Dimension.margin15,
    //marginBottom: 50
  },
  resendOtpText: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomBoldFont,
    color: '#0064A8',
    marginTop: Dimension.margin20,
    fontWeight: '800',
    lineHeight: Dimension.font20,
    textTransform: 'uppercase',
  },
  resendOtpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Dimension.margin10,
    justifyContent: 'space-between',
  },
  codeNotReceivedText: {
    fontSize: Dimension.font12,
    color: '#000000',
    marginTop: Dimension.margin25,
  },
  Checkboxlabel: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    color: '#1B1B1B',
    marginLeft: Dimension.margin10,
    marginTop: 1,
  },
  forgotAndSignUpText: {
    color: 'white',
    fontSize: 11,
  },
  BottomTxtWrap: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    flex: 1,
    alignSelf: 'center',
  },
  BottomTxt: {
    color: Colors.FontColor1,
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font10,
  },
  loginBtn: {
    backgroundColor: '#0064A8',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Dimension.padding15,
    marginTop: Dimension.margin122,
    marginBottom: Dimension.margin30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#00000029',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  signupBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Dimension.padding15,
    marginBottom: 89,
  },
  signupText: {
    color: '#0064A8',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountText: {
    fontSize: Dimension.font14,
    color: '#000000',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    fontWeight: '800',
  },
  errorText: {
    color: 'red',
    fontSize: Dimension.font13,
    fontFamily: Dimension.CustomRegularFont,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    textAlign: 'center',
  },
  option: {
    fontSize: 14,
    color: '#363636',
    fontWeight: 'bold',
    marginVertical: 25,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 14,
    color: '#363636',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#EFEFEF',
    width: '100%',
  },
});

export default VerificationScreen;
