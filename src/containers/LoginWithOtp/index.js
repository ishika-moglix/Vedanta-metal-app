import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  StatusBar,
  NativeModules,
  Button,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  InteractionManager,
  Modal,
} from 'react-native';
import styles from './style';
import {
  Text,
  View,
  TextInput,
  ActionSheetIOS,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import Dimension from '../../Theme/Dimension';
// import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FloatingLabelInputField from '../../component/FloatingInput';
import { ScannerService } from '../../services/scannerService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../services/constant';
// import AzureAuth from 'react-native-azure-auth';
import ENV from '../../services/url';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../redux/actions/auth';
import { setAuth } from '../../redux/feature/authslice';
import { STATE_STATUS } from '../../redux/constants';
import AesUtil from '../../generic/index';
import CryptoJS from 'crypto-js';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../../component/Header';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import { emailRegex } from '../../constants';
import Toast from 'react-native-toast-message';
import CustomLoader from '../../component/customLoader';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { setBranchAccess } from '../../redux/feature/branchSlice';
import { getCreditBalanceRequest, getLCBGBalanceRequest, getSearchPlantRequest } from '../../redux/feature/homeSlice';
import { saveNotification } from '../../services/notificationService';
import config from '../../services';
const CLIENT_ID = ENV[config.PROJECT_ENV].MICROSOFT_CLIENT_ID; //'ac5fc872-17f9-4f59-af74-3abbe885956e'; //'ff1fe9da-d218-4ceb-a11f-05ea54a985fb';

// const azureAuth = new AzureAuth({
//   clientId: CLIENT_ID,
// });

const LoginWithOtpScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [checkboxState, setCheckboxState] = useState(false);
  const [selectedProd, setProd] = useState('');
  const [result, setResult] = useState('Select Business Unit');
  const [isVisible, setIsVisible] = useState(false);
  const [emailOtp, setEmailOtp] = useState(''); // State for OTP input
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(true);
  const [ipAddress, setIpAddress] = useState('');
  const [deviceUUID, setDeviceUUID] = useState('');
  const [enableOtp, setEnableOtp] = useState(false);
  const [changeView, setChangeView] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [phone, setPhone] = useState('');
  const [timer, setTimer] = useState(300);
  const inputRef = useRef();
  const intervalRef = useRef(null);

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

  // useEffect(() => {
  //   if (email && email.match(emailRegex)) {
  //     setEmailError(false);
  //   } else if (email?.length == 10 && !isNaN(email)) {
  //     setEmailError(false);
  //   } else {
  //     if (email == '' && email.length == 0) {
  //       setEmailError(false);
  //       setEmailErrorMessage('');
  //     } else {
  //       setEmailError(true);
  //       setEmailErrorMessage(
  //         'Please enter a valid email address/phone number.',
  //       );
  //     }
  //   }
  // }, [email]);

  useEffect(() => {
    if (email && email.match(emailRegex)) {
      setEmailError(false);
    } else {
      if (email == '' && email.length == 0) {
        setEmailError(false);
        setEmailErrorMessage('');
      } else {
        setEmailError(true);
        setEmailErrorMessage(
          'Invalid email. Please enter a valid email address.',
        );
      }
    }
  }, [email]);

  const isCtaDisabled = () => {
    if (email.length > 0) {
      return !email.match(emailRegex) || emailOtp.trim().length !== 6;
    }
    //  else if (phone.length > 0) {
    //   return phone.length !== 10 || emailOtp.trim().length !== 6;
    // }
    return true;
  };

  const handleLoginWithOtp = () => {
    setIsOtpLogin(true);
  };

  const onAutoFocus = () => {
    if (inputRef && inputRef.current && !otpCorrect) {
      inputRef.current.blur();
      inputRef.current.focus();
    }
  };

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

  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@user_info', jsonValue);
    } catch (e) {
      console.log(e);
      // saving error
    }
  };
  let ProductList = [
    { _id: 'Aluminium', _label: 'Aluminium' },
    { _id: 'Copper', _label: 'Copper' },
    { _id: 'Zinc', _label: 'Hindustan Zinc Ltd' },
  ];
  // let productLists = ProductList.map(itemValue => {
  //   return (
  //     <Picker.Item
  //       key={itemValue._label}
  //       value={itemValue._id}
  //       label={itemValue._label}
  //       fontFamily={Dimension.CustomMediumFont}
  //       style={styles.pickerStyle}
  //       fontSize={Dimension.font14}
  //     />
  //   );
  // });

  const handleOptionSelect = option => {
    if (option === 'Hindustan Zinc Ltd') {
      setProd('Zinc');
    } else {
      setProd(option);
    }
    setResult(option);
    setIsVisible(false);
  };

  console.log(selectedProd, '||');

  const handleCloseModal = () => {
    setIsVisible(false);
  };
  const BUSelect = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          'Select Business Unit',
          'Aluminium',
          'Copper',
          'Hindustan Zinc Ltd',
        ],
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          setResult('Aluminium');
          setProd('Aluminium');
        } else if (buttonIndex === 2) {
          setResult('Copper');
          setProd('Copper');
        } else {
          setResult('Hindustan Zinc Ltd');
          setProd('Zinc');
        }
      },
    );
  const openCatWebview = () => {
    let navURL = CONSTANTS.WEBURL.CATEGORY;
    navigation.navigate('WebView', {
      URL: navURL,
      fromExp: 'exploreText',
      showBack: true,
    });
  };

  const openContactWebview = () => {
    let navURL =
      CONSTANTS.WEBURL.CATEGORY.replace('?isApp=true', '') + '#contact';
    navigation.navigate('WebView', {
      URL: navURL,
      fromExp: 'exploreText',
      showBack: true,
    });
  };

  const webSignup = () => {
    let navURL = CONSTANTS.WEBURL.SIGNUP;
    navigation.navigate('WebView', { URL: navURL });
  };

  useEffect(() => {
    fetchDeviceUUID();
    fetchIpAddress();
  }, []);

  const fetchDeviceUUID = async () => {
    const uuid = await DeviceInfo.getUniqueId();
    console.log('uuid', uuid);
    setDeviceUUID(uuid);
  };

  const fetchIpAddress = async () => {
    try {
      const response = await axios.get('https://jsonip.com/');
      console.log('ipAdd', response.data.ip);

      setIpAddress(response.data.ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
    } finally {
      setLoader(false);
    }
  };

  const handleToken = async (obj) => {
    try {
      const getToken = await AsyncStorage.getItem('fcm_token');
      if (getToken) {
        // const token = JSON.parse(getToken);
        const dataObj = {
          idUser: obj?.userId || obj?.idUser,
          token: getToken,
        }
        const data = await saveNotification(obj, dataObj);
        console.log("save token response : ", data);
      }
    } catch (err) {
      console.log("Token Error: ", err);

    }
  }

  const getSession = async (obj) => {
    try {
      console.log("hit 1");

      const dataObj = { authData: obj, dataType: 2 };
      const data = await ScannerService.getSession(dataObj);
      if (data?.data?.successful) {
        const branchId = Object.keys(data?.data?.data?.companyData?.branchNames)[0];
        const companyId = Object.keys(data?.data?.data?.companyData?.companyNames)[0];

        await AsyncStorage.setItem('@plantId', JSON.stringify({ plantId: branchId }));
        await AsyncStorage.setItem('@get_session', JSON.stringify({
          branchId,
          companyId,
          moglixB2BToken: obj?.token,
          moglixB2BUserId: obj?.userId || obj?.idUser,
        }));
        await getBranchAccess({
          idBranch: branchId,
          idUser: obj?.userId || obj?.idUser,
        }, obj);
        // handleToken(obj);
      }
    } catch (err) {
      console.log("error session", err);
    }
  };

  const getBranchAccess = async (incomingDataObj = null, obj) => {
    try {
      console.log("Object is ", obj);
      setLoader(true);
      const sessionData = await AsyncStorage.getItem('@get_session');
      const getPlantId = await AsyncStorage.getItem('@plantId');
      let jsonSessionData = JSON.parse(sessionData);
      let plantId = JSON.parse(getPlantId);
      let dataObj;
      if (incomingDataObj) {
        dataObj = incomingDataObj;
      } else {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);

        dataObj = {
          idBranch: plantId?.plantId,
          idUser: authData?.userId || jsonSessionData?.moglixB2BUserId || authData?.idUser,
        };
      }

      const data = await ScannerService.branchAccess(dataObj);

      if (data?.data?.successful) {
        const { plantCode, roleNames } = data?.data?.data?.branchModules;
        console.log("plantCode from data", plantCode);
        await AsyncStorage.setItem('@plantCode', JSON.stringify({ plantCode }));
        const isCustomer = roleNames?.includes('Customer') ||
          roleNames?.includes('Company Super Admin');
        dispatch(
          setAuth({
            status: STATE_STATUS.FETCHED,
            data: obj,
            isLoggedIn: true,
          }),
        );
        dispatch(
          setBranchAccess({
            status: STATE_STATUS.FETCHED,
            data: data?.data?.data,
            isCustomer,
          })
        );
        dispatch(getSearchPlantRequest({ searchString: '' }));
        // dispatch(getSearchPlantRequest({ searchString: '' }));
        dispatch(
          getCreditBalanceRequest({
            plantId: plantId?.plantId,
            businessUnit: obj?.businessUnit,
            companyId: jsonSessionData?.companyId,
          }),
        );
        dispatch(
          getLCBGBalanceRequest({
            customerCode: plantCode,
            companyId: jsonSessionData?.companyId,
            businessUnit: obj?.businessUnit,
          }),
        );
      }
      setBranchLoader(false);
    } catch (err) {
      setBranchLoader(false);
      console.log('error', err);
    }
  };

  const onSendOtp = async type => {
    try {
      setOtpLoader(true);
      const data =
        type == 'email'
          ? await ScannerService.sendEmailOtp(email)
          : await ScannerService.sendPhoneOtp(phone);

      if (data?.data?.successful) {
        setEnableOtp(true);
        setOtpLoader(false);
        setChangeView(true);
        Toast.show({
          type: 'success',
          text2: data?.data?.message || 'OTP sent successfully',
          visibilityTime: 4000,
          autoHide: true,
        });
      } else {
        setOtpLoader(false);
        Toast.show({
          type: 'error',
          text2: data?.data?.message || 'Failure',
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    } catch (e) {
      console.log('Error is', e);
      setOtpLoader(false);
    }
  };

  const onPressLogin = async () => {
    try {
      let obj = {
        userName: email,
        password: '',
        phone: '',
        phoneOtp: '',
        emailOtp: emailOtp || '',
        application: '1',
        source: 'mapp',
        businessUnit: selectedProd,
        osName: Platform.OS,
        uuid: deviceUUID || '',
        ipAddress: ipAddress || '',
        browserName: 'browser',
        captchaValidated: false,
      };
      if (!selectedProd.trim().length) {
        Toast.show({
          type: 'error',
          text2: 'Please Select Business Unit',
          visibilityTime: 4000,
          autoHide: true,
        });
        setLoader(false);
      } else {
        setLoader(true);
        const data = await ScannerService.Login(obj);
        console.log("data login", data);

        if (data.successful) {
          let obj = data.data.session.userData;
          obj['unencrypt_pwd'] = pwd;
          storeData(data.data.session.userData);
          await getSession(obj);
          await handleToken(obj);
          Toast.show({
            type: 'success',
            text2: data?.message || 'Logged in successfully',
            visibilityTime: 4000,
            autoHide: true,
          });
        } else {
          Toast.show({
            type: 'error',
            text2: data?.message || 'Failure',
            visibilityTime: 4000,
            autoHide: true,
          });
          // setLoader(false);
          //  alert(data.message);
        }
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        text2: 'Something went wrong!',
        visibilityTime: 4000,
        autoHide: true,
      });
    } finally {
      setLoader(false);
    }
  }
  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* <StatusBar
          translucent
          backgroundColor="#F0F7FF"
          barStyle={'dark-content'}
        /> */}
        {loader && (
          <CustomLoader fullScreen />
        )}
        <Header
          showBack
          showText={'Login with OTP'}
          //showDiscard
          //fromHome
          beforeLogin
          //auth={auth}
          navigation={navigation}
        />
        <LinearGradient
          colors={['#E8F5FF', '#FFFFFF']}
          style={{
            width: '100%',
            flex: 1,
          }}>
          {/* <View style={styles.LoginBg}> */}
          {/* <KeyboardAvoidingView
          behavior={Platform.OS == 'android' ? 'padding' : 'position'}> */}

          {/* <ScrollView style={styles.container}>  */}
          <View style={styles.container}>
            <View style={styles.titleWrap}>
              <Text style={styles.title}> Sign in to </Text>
              <Text style={styles.title2}> World’s Largest Metalbazaar</Text>
            </View>
            {Platform.OS === 'ios' ? (
              <View style={styles.pickerWrap}>
                <TouchableOpacity
                  onPress={BUSelect}
                  style={styles.pickerWrapBtn}>
                  {result != 'Select Business Unit' ? (
                    <Text style={styles.result} numberOfLines={1}>
                      Vedanta {result}
                    </Text>
                  ) : (
                    <Text style={styles.result} numberOfLines={1}>
                      {result}
                    </Text>
                  )}
                  {/* <Text style={styles.result} numberOfLines={1}>
                    Vedanta {result}
                  </Text> */}
                  <MaterialCommunityIcon
                    name={'chevron-down'}
                    size={18}
                    color={'#0466A9'}
                    onPress={BUSelect}
                    style={{ position: 'absolute', right: 15, top: 12 }}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.pickerWrap}>
                <TouchableOpacity
                  onPress={() => setIsVisible(true)}
                  style={styles.pickerWrapBtn}>
                  {result != 'Select Business Unit' ? (
                    <Text style={styles.result} numberOfLines={1}>
                      Vedanta {result}
                    </Text>
                  ) : (
                    <Text style={styles.result} numberOfLines={1}>
                      {result}
                    </Text>
                  )}
                  <MaterialCommunityIcon
                    name={'menu-down'}
                    size={22}
                    color={'#0466A9'}
                    onPress={() => setIsVisible(true)}
                    style={{ position: 'absolute', right: 15, top: 8 }}
                  />
                </TouchableOpacity>
                <Modal
                  visible={isVisible}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={() => setIsVisible(false)}>
                  <View style={styles.modalOverlay}>
                    <TouchableOpacity
                      onPress={handleCloseModal}
                      style={{
                        //bottom:-5,
                        // position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: [{ translateX: -20 }],
                        zIndex: 1,
                      }}>
                      <AntDesign
                        name="close"
                        size={35}
                        color="#fff"
                        style={{ position: 'absolute', top: -10, left: 0 }}
                      />
                      <AntDesign
                        name="closecircle"
                        size={35}
                        color="#000"
                        style={{ top: -10, left: 0 }}
                      />
                    </TouchableOpacity>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>
                        Select Business Unit
                      </Text>
                      <View style={styles.separator} />
                      <TouchableOpacity
                        onPress={() => handleOptionSelect('Aluminium')}>
                        <Text style={styles.option}>Aluminium</Text>
                      </TouchableOpacity>
                      <View style={styles.separator} />
                      <TouchableOpacity
                        onPress={() => handleOptionSelect('Copper')}>
                        <Text style={styles.option}>Copper</Text>
                      </TouchableOpacity>
                      <View style={styles.separator} />
                      <TouchableOpacity
                        onPress={() =>
                          handleOptionSelect('Hindustan Zinc Ltd')
                        }>
                        <Text style={styles.option}>Hindustan Zinc Ltd</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            )}
            <Text
              style={{
                color: '#000000',
                fontSize: 12,
                marginBottom: Dimension.margin8,
                marginTop: Dimension.margin20,
              }}>
              Email Address
              {/* Email Address/Phone Number* */}
            </Text>
            <View style={styles.inputView}>
              <FloatingLabelInputField
                // placeholder={'Enter Email Address/Phone Number*'}
                placeholder={'Enter Email Address'}
                disabledLabel
                onChangeText={val => {
                  setEmail(val);
                }}
                // onChangeText={val => {
                //   if (/^\d+$/.test(val)) {
                //     setPhone(val);
                //     setEmail('');
                //   } else {
                //     setEmail(val);
                //     setPhone('');
                //   }
                // }}

                // value={phone.length > 0 ? phone : email}
                value={email}
                //keyboardType={phone.length > 0 ? 'number-pad' : 'email-address'}
                // maxLength={phone.length > 0 ? 10 : 100}
                maxLength={100}
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
                    onPress={() => {
                      // onSendOtp(phone.length > 0 ? 'phone' : 'email')
                      onSendOtp('email');
                      startTimer();
                    }}
                    disabled={
                      otpLoader ||
                      !email.match(emailRegex) ||
                      (timer < 300 && timer > 0)
                    }
                    // disabled={
                    //   (phone.length === 0 && email.length === 0) ||
                    //   emailError ||
                    //   (phone.length > 0 && phone.length !== 10)
                    // }
                    style={{
                      backgroundColor: '#fff',
                      padding: 10,
                      borderRadius: 5,
                    }}>
                    {/* <Text
                      style={{
                        color:
                          (phone.length === 0 && email.length === 0) ||
                          emailError ||
                          (phone.length > 0 && phone.length !== 10)
                            ? '#D9D9D9'
                            : '#0064A8',
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}>
                      Send OTP
                    </Text> */}
                    <View style={styles.row}>
                      {otpLoader ? (
                        <ActivityIndicator
                          style={styles.loader}
                          color={'#0064A8'}
                          size={15}
                        />
                      ) : (
                        <Text
                          style={{
                            color:
                              email.match(emailRegex) &&
                                (timer == 300 || timer == 0)
                                ? '#0064A8'
                                : '#D9D9D9',
                            // color:
                            //   (phone.length === 0 && email.length === 0) ||
                            //   emailError
                            //     ? (phone.length > 0 && phone.length !== 10)
                            //       '#D9D9D9'
                            //     : '#0064A8',
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}>
                          Send OTP
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                }
              //maxLength={10}
              //keyboardType=""
              />
            </View>
            {emailError && (
              <Text style={styles.errorText}>{emailErrorMessage}</Text>
            )}
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
                value={emailOtp}
                onChangeText={setEmailOtp}
                style={styles.input}
                maxLength={6}
                keyboardType="number-pad"
                editable={enableOtp}
                textStyle={{
                  backgroundColor: !enableOtp ? '#F0F0F0' : '#FFF',
                }}
              />
            </View>
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
                      fontWeight: '800',
                      marginTop: Dimension.margin5,
                    },
                  ]}>
                  Resend in {String(Math.floor(timer / 60)).padStart(2, '0')}:
                  {String(timer % 60).padStart(2, '0')}
                </Text>
              </View>
              <TouchableOpacity
                disabled={timer != 0}
                onPress={() => {
                  onSendOtp();
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
              onPress={onPressLogin}
              disabled={isCtaDisabled()}
              style={[
                styles.loginBtn,
                { backgroundColor: isCtaDisabled() ? '#B0B0B0' : '#0063A7' },
              ]}>
              {/* {loader ? (
                <ActivityIndicator
                  color={'#fff'}
                  size={'small'}
                  // style={{marginRight: 12}}
                />
              ) : null} */}
              <Text style={[styles.loginText, { marginLeft: loader ? 8 : 0 }]}>
                Sign In{' '}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                //marginTop: 89,
              }}>
              <TouchableOpacity onPress={openCatWebview}>
                <Text style={styles.exloreTxt}>Explore Catalog</Text>
              </TouchableOpacity>

              <View
                style={{
                  marginHorizontal: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 18,
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
          </View>
          {/* </ScrollView> */}
          {/* </KeyboardAvoidingView> */}
        </LinearGradient>
      </View>
    </>
  );
};

export default LoginWithOtpScreen;
