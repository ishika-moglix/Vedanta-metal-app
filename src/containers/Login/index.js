import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  StatusBar,
  NativeModules,
  Button,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
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
// import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import Dimension from '../../Theme/Dimension';
// import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FloatingLabelInputField from '../../component/FloatingInput';
import { ScannerService } from '../../services/scannerService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../../services/constant';
// import AzureAuth from 'react-native-azure-auth';
import ENV from '../../services/url';
import { useSelector, useDispatch } from 'react-redux';
import { setLogin } from '../../redux/actions/auth';
import AesUtil from '../../generic/index';
import CryptoJS from 'crypto-js';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { setAuth } from '../../redux/feature/authslice';
import { STATE_STATUS } from '../../redux/constants';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import { emailRegex } from '../../constants';
import Header from '../../component/Header';
import Toast from 'react-native-toast-message';
import BiometricAuth from '../../utils/BiometricAuth';
import EnableButton from '../../component/Button';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { request, PERMISSIONS, RESULTS, check } from 'react-native-permissions';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getCreditBalanceRequest,
  getLCBGBalanceRequest,
  getSearchPlantRequest,
  getSessionRequest,
} from '../../redux/feature/homeSlice';
import { setBranchAccess } from '../../redux/feature/branchSlice';
import CustomLoader from '../../component/customLoader';
import { saveNotification } from '../../services/notificationService';
import { setCartCount } from '../../redux/feature/homeSlice';
import { setNotiCount } from '../../redux/feature/notification';
import config from '../../services';
const CLIENT_ID = ENV[config.PROJECT_ENV].MICROSOFT_CLIENT_ID; //'ac5fc872-17f9-4f59-af74-3abbe885956e'; //'ff1fe9da-d218-4ceb-a11f-05ea54a985fb';
// const azureAuth = new AzureAuth({
//   clientId: CLIENT_ID,
// });
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginScreen = props => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth.data);
  const authStatus = useSelector(state => state.auth);
  const [inputType, setInputType] = useState(true);
  const [loader, setLoader] = useState(false);
  const [branchLoader, setBranchLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [pwd, setPwd] = useState('');
  const [selectedProd, setProd] = useState('');
  const [result, setResult] = useState('Select Business Unit');
  const [isVisible, setIsVisible] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [deviceUUID, setDeviceUUID] = useState('');
  const [openModal, setOnOpenModal] = useState(false);
  const [closeModal, setOnCloseModal] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [hasFaceAuth, setHasFaceAuth] = useState(false);
  const [modalShown, setModalShown] = useState(false);
  const [userData, setUserData] = useState('');
  const [isUserInfo, setUserInfo] = useState(false);
  const [isSkip, setisSkip] = useState('');
  const [userType, setUserType] = useState(false);
  // const [isCustomer, setCustomer] = useState(false);
  const refreshDetails = async () => {
    try {
      const val1 = await AsyncStorage.removeItem('rfcCase_BusinessDetails');
      const val2 = await AsyncStorage.removeItem('rfcCase_PlantDetails');
      const val3 = await AsyncStorage.removeItem('rfcCase_BankDetails');
    } catch (e) {
      console.log(e);
      // error reading value
    }
  };
  useEffect(() => {
    // validateAuth();
    checkDetail();
    refreshDetails();
  }, []);
  // useEffect(() => {
  //   getSession();
  // }, []);

  // const getSession = async () => {
  //   let jsonValue = await AsyncStorage.getItem('@user_info');
  //   jsonValue = jsonValue != null ? JSON.parse(jsonValue) : null;
  //   setAuth(jsonValue);
  //   CallSession(jsonValue);
  // };

  // const CallSession = message => {
  //   ScannerService.GetSession(message)
  //     .then(data => {
  //       if (data.successful) {
  //         message['branchId'] = Object.keys(
  //           data.data.companyData.branchNames,
  //         )[0];
  //         message['companyId'] = Object.keys(
  //           data.data.companyData.companyNames,
  //         )[0];
  //         message['companyName'] = Object.values(
  //           data.data.companyData.companyNames,
  //         )[0];
  //         getDataFunc(message);
  //       }
  //     })
  //     .catch(err => {
  //       // Logout();
  //       //console.log(err);
  //     });
  // };

  const isCtaDisabled = () => {
    return (
      !email?.length || emailError || pwd.length < 3
      // !selectedProd.trim().length
    );
  };

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

  const validateAuth = async () => {
    const jsonValue = await AsyncStorage.getItem('@user_info');
    if (jsonValue) {
      checkBiometrics();
    }
  };

  useEffect(() => {
    validateAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      console.log('modal shown hit');
      const jsonValue = await AsyncStorage.getItem('@user_info');
      const isSkipPressed = await AsyncStorage.getItem('@isSkip');
      setisSkip(isSkipPressed);
      if (jsonValue) {
        setUserInfo(true);
        setUserData(JSON.parse(jsonValue));
      }
      console.log(
        'firstTime logout',
        props?.route?.params?.firstLoginAfterLogout,
        'isSkipped',
        isSkipPressed,
        'isskip',
        isSkip,
      );
      if (props?.route?.params?.firstLoginAfterLogout === 'true') {
        setOnOpenModal(true);
        if (Platform.OS == 'android') {
          setModalShown(true);
        }
      } else if (
        props?.route?.params?.firstLoginAfterLogout === 'false' &&
        jsonValue
      ) {
        setOnOpenModal(true);
        if (isSkipPressed === 'false') {
          handleFingerprint();
        }
      }
    };

    fetchData();
  }, [isAvailable]);

   const notificationCount = async (obj) => {
      try {
        const dataObj = {
          userId:  obj?.userId || obj?.idUser,
        }
        const data = await ScannerService.getUnreadCount(dataObj)
        console.log("data noti count", data?.data.data.unreadCount);
        dispatch(
          setNotiCount({
            status: STATE_STATUS.FETCHED,
            data: data?.data.data,
            notiCount: data?.data.data.unreadCount
          }),
        );
        // setNotiCount(data?.data.data.unreadCount)
      } catch (err) {
        console.log("Error", );
        
      }
   }
  
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
  const addToCartCount = async (obj) => {
    try {
      const CartCount = await ScannerService.cartCount({ userId: obj?.userId || authData?.userId || authData?.idUser })
      console.log("Cart Count is Login ", CartCount, CartCount?.result?.itemCount);
      if (CartCount?.data?.status == 200) {
        dispatch(setCartCount({
          status: STATE_STATUS.FETCHED,
          count: CartCount?.data.result?.itemCount || 0
        }))
      }
      else {
        dispatch(setCartCount({
          status: STATE_STATUS.FETCHED,
          count: 0
        }))
      }
    } catch (err) {
      console.log("Error", err);
    }
  }

  const getSession = async (obj) => {
    try {
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
      setBranchLoader(true);
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
        setBranchLoader(false);
      }
     
    } catch (err) {
      setBranchLoader(false);
      console.log('error', err);
    }
  };

  const openBioModal = async () => {
    setOnOpenModal(true);
    if (Platform.OS == 'android') {
      setModalShown(true);
    } else {
      if (Platform.OS === 'ios' && hasFaceAuth) {
        handleFaceAuthentication();
      } else {
        handleFingerprint();
      }
    }
  };

  const onCloseBioModal = async () => {
    setOnOpenModal(false);
  };

  const closeBioModal = async () => {
    setisSkip('true');
    const val1 = await AsyncStorage.setItem('@isSkip', 'true');
    setOnOpenModal(false);
  };

  const getDataFunc = async jsonValue => {
    if (jsonValue) {
      const userData = await ScannerService.GetBranchAcc({
        ...jsonValue,
      });
      if (
        !userData?.data?.branchModules?.roleNames?.includes(
          'Product Manager',
        ) &&
        !userData?.data?.branchModules?.roleNames?.includes('Customer') &&
        !userData?.data?.branchModules?.roleNames?.includes(
          'Company Super Admin',
        ) &&
        jsonValue?.businessUnit == 'Aluminium'
      ) {
        setShowCreateNew(false);
      }
      setIsDisabled(false);
    }
  };

  const getData2 = (salt, iv) => {
    let aesUtil = new AesUtil(128, 1000);
    let newciphertext = aesUtil.encrypt(
      salt, //salt
      iv, //iv
      '1234567891234567', //key
      pwd, //text
    );
    let decryptedText = aesUtil.decrypt(
      salt,
      iv,
      '1234567891234567',
      newciphertext,
    );

    let txt = iv + '::' + salt + '::' + newciphertext;
    onPressLogin(Base64.btoa(txt));
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

  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@user_info', jsonValue);
    } catch (e) {
      //console.log(e);
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

  // const onLogin = async () => {
  //   try {
  //     let tokens = await azureAuth.webAuth.authorize({
  //       prompt: 'login',
  //       scope: 'openid profile User.Read offline_access',
  //     });
  //     let info = await azureAuth.auth.msGraphRequest({
  //       token: tokens.accessToken,
  //       path: 'me',
  //       scope: 'openid profile User.Read offline_access',
  //     });
  //     if (tokens?.accessToken && tokens?.refreshToken && info?.id) {
  //       let obj = {
  //         userName: email,
  //         password: null,
  //         application: '1',
  //         businessUnit: selectedProd,
  //         uuid: info?.id,
  //         isSocialLogin: true,
  //         socialAccessToken: tokens?.accessToken,
  //         socialLoginType: 'MICROSOFT',
  //         source: 'mapp',
  //         osName: Platform.OS,
  //       };
  //       ScannerService.Login(obj)
  //         .then(data => {
  //           if (data.successful) {
  //             let obj = data.data.session.userData;
  //             obj['unencrypt_pwd'] = pwd;
  //             storeData(data.data.session.userData);
  //             // navigation.navigate('NewTab');
  //             dispatch(setLogin(route.params.setIsLoggedIn));
  //             route.params.setIsLoggedIn(true);
  //           } else {
  //             alert(data.message);
  //           }
  //           setLoader(false);
  //         })
  //         .catch(e => {
  //           setLoader(false);
  //           alert(e);
  //         });
  //     } else {
  //     }
  //   } catch (error) {
  //     // setLoading(false);
  //     // alert(error);
  //     //console.log('', error);
  //   }
  // };

  // const sessionDetail = () =>{
  //     ScannerService.Login(obj).then(data => {
  //         if(data.successful){
  //             //console.log(data.data.session.userData);
  //             navigation.navigate("Feed")
  //         }else{
  //             alert(data.message)
  //         }

  //         })
  // }

  // const showActionSheet = () => {
  //   actionSheetRef.current.show();
  // };

  const handleActionPress = buttonIndex => {
    if (buttonIndex === 0) {
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
  };

  const handleOptionSelect = option => {
    if (option === 'Hindustan Zinc Ltd') {
      setProd('Zinc');
    } else {
      setProd(option);
    }
    setResult(option);
    setIsVisible(false);
  };

  // console.log(selectedProd, '...');

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
    props?.navigation.navigate('WebView', {
      URL: navURL,
      beforeLogin: true,
      fromExp: 'exploreText',
      showBack: true,
    });
  };

  const openContactWebview = () => {
    let navURL =
      CONSTANTS.WEBURL.CATEGORY.replace('?isApp=true', '') + '#contact';
    props?.navigation.navigate('WebView', {
      URL: navURL,
      fromExp: 'exploreText',
      showBack: true,
    });
  };

  const webSignup = () => {
    let navURL = CONSTANTS.WEBURL.SIGNUP;
    props?.navigation.navigate('WebView', { URL: navURL });
  };

  const getRandomInt = (min = 1, max = 999) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  };

  const randomArray = () => {
    return [getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt()];
  };

  useEffect(() => {
    fetchDeviceUUID();
    fetchIpAddress();
  }, []);

  const getHomePageData = async obj => {
    getSession(obj);
    // dispatch(getSessionRequest({ authData: obj, dataType: 2 }));
    // getBranchAccess();

  };
  const fetchDeviceUUID = async () => {
    const uuid = await DeviceInfo.getUniqueId();
    //console.log('uuid', uuid);
    setDeviceUUID(uuid);
  };

  const fetchIpAddress = async () => {
    try {
      const response = await axios.get('https://jsonip.com/');
      //console.log('ipAdd', response.data.ip);

      setIpAddress(response?.data?.ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
    } finally {
      setBranchLoader(false);
    }
  };
  const onPressLoginNew = () => {
    if (!selectedProd.trim().length) {
      //console.log('hit');
      Toast.show({
        type: 'error',
        text2: 'Please Select Business Unit',
        visibilityTime: 4000,
        autoHide: true,
      });
      setBranchLoader(false);
    } else {
      setBranchLoader(true);
      let dataObj = {
        email: email?.match(emailRegex) ? email : undefined,
        phone: email?.length == 10 && !isNaN(email) ? email : undefined,
        businessUnit: selectedProd,
      };
      // console.log(dataObj, 'dataObjdataObj');

      ScannerService.getSaltInfo(dataObj)
        .then(data => {
          if (data.data != null && data?.data?.data_on && data?.data?.test_on) {
            getData2(data.data.data_on, data.data.test_on);
          } else {
            //Generated iv and salt
            // let iv1 = CryptoJS.lib.WordArray.create(
            //   secureRandom.randomArray(4),
            // ).toString(CryptoJS.enc.Hex);
            // let salt1 = CryptoJS.lib.WordArray.create(
            //   secureRandom.randomArray(4),
            // ).toString(CryptoJS.enc.Hex);
            let iv1 = CryptoJS.lib.WordArray.create(randomArray()).toString(
              CryptoJS.enc.Hex,
            );
            let salt1 = CryptoJS.lib.WordArray.create(randomArray()).toString(
              CryptoJS.enc.Hex,
            );
            getData2(salt1, iv1);
          }
        })
        .catch(err => {
          setBranchLoader(false);
          Toast.show({
            type: 'error',
            text2: 'Something went wrong!',
            visibilityTime: 4000,
            autoHide: true,
          });
          // alert('Something went wrong!');
        });
    }
  };

  // const onPressLogin = async newPWD => {
  //   let obj = {
  //     userName: email,
  //     password: newPWD,
  //     application: '1',
  //     source: 'mapp',
  //     businessUnit: selectedProd,
  //     osName: Platform.OS,
  //     uuid: deviceUUID || '',
  //     ipAddress: ipAddress || '',
  //     browserName: 'browser',
  //     captchaValidated: false,
  //   };

  //   setLoader(true);

  //   try {
  //     const data = await ScannerService.Login(obj);

  //     if (data.successful) {
  //       await getBranchAccess();

  //       await AsyncStorage.setItem(
  //         'profileImage',
  //         JSON.stringify(data?.data?.session?.userData?.profileUrl || ''),
  //       );

  //       let userObj = data.data.session.userData;
  //       userObj['unencrypt_pwd'] = newPWD;

  //       storeData(userObj);

  //       dispatch(
  //         setAuth({
  //           status: STATE_STATUS.FETCHED,
  //           data: userObj,
  //           isLoggedIn: true,
  //         }),
  //       );

  //       console.log('login obj', userObj);

  //       getHomePageData(userObj);

  //       Toast.show({
  //         type: 'success',
  //         text2: data?.message || 'Logged in successfully',
  //         visibilityTime: 4000,
  //         autoHide: true,
  //       });
  //     } else {
  //       Toast.show({
  //         type: 'error',
  //         text2: data?.message || 'Invalid username/password',
  //         visibilityTime: 4000,
  //         autoHide: true,
  //       });
  //     }
  //   } catch (e) {
  //     console.error('Login error:', e);
  //     Toast.show({
  //       type: 'error',
  //       text2: 'Something went wrong!',
  //       visibilityTime: 4000,
  //       autoHide: true,
  //     });
  //   } finally {
  //     setLoader(false);
  //   }
  // };



  // const onPressLogin = async newPWD => {
  //   let obj = {
  //     userName: email,
  //     password: "MDAwMDAwODIwMDAwMDAzZTAwMDAwMDYxMDAwMDAwNmU6OjAwMDAwMGQ2MDAwMDAwYzAwMDAwMDBjNTAwMDAwMGYxOjpBZkJjR1h0TFg2djBhelVCQ1RaZThRPT0=" || newPWD,
  //     application: '1',
  //     source: 'mapp',
  //     businessUnit: selectedProd,
  //     osName: Platform.OS,
  //     uuid: deviceUUID || '',
  //     ipAddress: ipAddress || '',
  //     browserName: 'browser',
  //     captchaValidated: false,
  //   };

  //   ScannerService.Login(obj)
  //     .then(data => {
  //       if (data.successful) {
  //         let obj = data.data.session.userData;
  //         obj['unencrypt_pwd'] = pwd;
  //         storeData(data.data.session.userData);
  //         dispatch(
  //           setAuth({
  //             status: STATE_STATUS.FETCHED,
  //             data: obj,
  //             isLoggedIn: true,
  //           }),
  //         );
  //         // handleToken(obj);
  //         // getHomePageData(obj);
  //        await getSession(obj);
  //          handleToken(obj);
  //         Toast.show({
  //           type: 'success',
  //           text2: data?.message || 'Logged in successfully',
  //           visibilityTime: 4000,
  //           autoHide: true,
  //         });
  //       } else {
  //         Toast.show({
  //           type: 'error',
  //           text2: data?.message || 'Invalid username/password',
  //           visibilityTime: 4000,
  //           autoHide: true,
  //         });
  //         // alert(data.message);
  //       }
  //       setLoader(false);
  //     })
  //     .catch(e => {
  //       setLoader(false);
  //       Toast.show({
  //         type: 'error',
  //         text2: 'Something went wrong!',
  //         visibilityTime: 4000,
  //         autoHide: true,
  //       });
  //       //  alert('Something went wrong!');
  //     });
  // };
  const onPressLogin = async newPWD => {
    try {
      setBranchLoader(true);
      let obj = {
        userName: email,
        // password: "MDAwMDAwODIwMDAwMDAzZTAwMDAwMDYxMDAwMDAwNmU6OjAwMDAwMGQ2MDAwMDAwYzAwMDAwMDBjNTAwMDAwMGYxOjpBZkJjR1h0TFg2djBhelVCQ1RaZThRPT0=" || newPWD,
        // newPWD,
        password:newPWD,
        application: '1',
        source: 'mapp',
        businessUnit: selectedProd,
        osName: Platform.OS,
        uuid: deviceUUID || '',
        ipAddress: ipAddress || '',
        browserName: 'browser',
        captchaValidated: false,
      };

      const data = await ScannerService.Login(obj);
      // console.log("Login data", data);

      if (data.successful) {
        let obj = data.data.session.userData;
        obj['unencrypt_pwd'] = pwd;
        storeData(data.data.session.userData);
        // dispatch(
        //   setAuth({
        //     status: STATE_STATUS.FETCHED,
        //     data: obj,
        //     isLoggedIn: true,
        //   }),
        // );

        await getSession(obj);
        await handleToken(obj);
        // await notificationCount(obj);
        // await addToCartCount(obj);
        Toast.show({
          type: 'success',
          text2: data?.message || 'Logged in successfully',
          visibilityTime: 4000,
          autoHide: true,
        });
      } else {
        Toast.show({
          type: 'error',
          text2: data?.message || 'Invalid username/password',
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        text2: 'Something went wrong!',
        visibilityTime: 4000,
        autoHide: true,
      });
    } finally {
      setBranchLoader(false);
    }
  };

  const handleLoginWithOtp = async () => {
    props?.navigation.navigate('LoginWithOtp');
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_info');

      if (jsonValue) {
        const userInfo = JSON.parse(jsonValue);

        // dispatch(
        //   setAuth({
        //     status: STATE_STATUS.FETCHED,
        //     data: userInfo,
        //     isLoggedIn: true,
        //   }),
        // );
      } else {
        props?.navigation.replace('Login');
      }
    } catch (e) {
      //console.log(e);
      // error reading value
    }
  };
  const checkDetail = async () => {
    try {
      const info = JSON.parse(await AsyncStorage.getItem('@user_info'));
      if (
        info?.userEmail?.split('@')?.[1] == 'vedanta.co.in' ||
        info?.userEmail?.split('@')?.[1] == 'moglix.com'
      ) {
        setUserType(true);
      } else {
        setUserType(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const checkBiometrics = async () => {
    const { available, type } = await BiometricAuth.isBiometricsAvailable();
    const { available: faceAvailable } =
      await BiometricAuth.isFaceAuthAvailable();
    if (Platform.OS == 'ios' && faceAvailable) {
      request(PERMISSIONS.IOS.FACE_ID).then(permissionStatus => {
        if ([RESULTS.GRANTED, RESULTS.LIMITED]?.includes(permissionStatus)) {
          // handleFaceAuthentication();
        }
      });
    } else {
      if (
        props?.route?.params?.firstLoginAfterLogout === 'false' &&
        isUserInfo
      ) {
        if (!isSkip) {
          handleFingerprint();
        }
      }
    }
    console.log(faceAvailable, 'available, type');
    setIsAvailable(available);
    setBiometricType(type);
    setHasFaceAuth(faceAvailable);
  };
  // const activeFingerPrint = async () => {
  //   const rnBiometrics = new ReactNativeBiometrics();
  //   if (Platform.OS === 'android') {
  //     const {success, error} = await BiometricAuth.authenticate(
  //       'Authenticate using fingerprint',
  //     );
  //     if (success) {
  //       getHomePageData(userData);
  //       getData();
  //     } else {
  //       console.log('Error', error, 'Authentication failed');
  //     }
  //   } else {
  //     const {success} = await rnBiometrics.simplePrompt({
  //       promptMessage: 'Confirm your identity',
  //       cancelButtonText: 'Cancel',
  //     });
  //     if (success) {
  //       getHomePageData(userData);
  //       getData();
  //     }
  //   }
  // };

  const handleFingerprint = async () => {
    // const rnBiometrics = new ReactNativeBiometrics();

    // if (Platform.OS == 'android') {
    //   const {success, error} = await BiometricAuth.authenticate(
    //     'Authenticate using fingerprint',
    //   );
    //   if (success) {
    //     //   dispatch(
    //     //     setAuth({
    //     //       status: STATE_STATUS.FETCHED,
    //     //       data: userInfo,
    //     //       isLoggedIn: true,
    //     //     }),
    //     //   );
    //     getData();
    //     console.log('Success', 'Fingerprint authentication successful!');
    //   } else {
    //     console.log('Error', error, 'Authentication failed');
    //   }
    // } else {
    //   // if (biometryType === BiometryTypes.TouchID) {
    //   const {success} = await rnBiometrics.simplePrompt({
    //     promptMessage: 'Confirm your identity',
    //     cancelButtonText: 'Cancel',
    //   });
    //   if (success) {
    //     getData();
    //     console.log('Authenticated successfully!');
    //   } else {
    //     console.log('Authentication failed or canceled.');
    //   }
    //   //do something fingerprint specific
    //   // }
    // }
    try {
      if (isSkip === 'true') {
        const val = await AsyncStorage.setItem('@isSkip', 'false');
        setisSkip(false);
      } else {
        console.log('Authentication failed or canceled.');
        console.log('hit ');

        const rnBiometrics = new ReactNativeBiometrics();
        if (Platform.OS === 'android') {
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
            // getHomePageData(userData);
            await getData();
            await getSession(userData);
            await handleToken(userData);
            // await  notificationCount(userData);
            // await addToCartCount(userData);
            // getBranchAccess();

            console.log('Success', 'Fingerprint authentication successful!');
          } else {
            console.log('Error', error, 'Authentication failed');
          }
        } else {
          // if (biometryType === BiometryTypes.TouchID) {
          const { success } = await rnBiometrics.simplePrompt({
            promptMessage: 'Confirm your identity',
            cancelButtonText: 'Cancel',
          });
          if (success) {
            await getData();
            await getSession(userData);
            await handleToken(userData);
            // await notificationCount(userData);
            console.log('Authenticated successfully!');
          } else {
            console.log('Authentication failed or canceled.');
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleFaceAuthentication = async () => {
    console.log("hit number of times");
    
    const rnBiometrics = new ReactNativeBiometrics();
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    console.log("available", available);
    if (!available) {
      Toast.show({
        type: 'error',
        text2: 'Please Enable Face Authentication',
        visibilityTime: 4000,
        autoHide: true,
      });
    }
    if (Platform.OS == 'android') {
      if (available && biometryType === BiometryTypes.Biometrics) {
        const { success } = await rnBiometrics.simplePrompt({
          promptMessage: 'Confirm your identity',
          cancelButtonText: 'Cancel',
        });

        if (success) {
          await getData();
          await getSession(userData);
          await handleToken(userData)
          // await notificationCount(userData);
          console.log('Authenticated successfully!');
        } else {
          console.log('Authentication failed or canceled.');
        }
      } else {
        Toast.show({
          type: 'error',
          text2: 'Biometric authentication not available',
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    } else {
      if (biometryType === BiometryTypes.FaceID) {
        const { success } = await rnBiometrics.simplePrompt({
          promptMessage: 'Confirm your identity',
          cancelButtonText: 'Cancel',
        });
        if (success) {
          await getData();
          await getSession(userData);
          await handleToken(userData);
          // await notificationCount(userData);
          console.log('Authenticated successfully!');
        } else {

          console.log('Authentication failed or canceled.');
        }
      }
    }
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* <StatusBar
          translucent
          backgroundColor="#F0F7FF"
          barStyle={'dark-content'}
        /> */}
        {branchLoader && (
          <CustomLoader fullScreen />
        )}
        <LinearGradient
          colors={['#E8F5FF', '#FFFFFF']}
          style={{
            width: '100%',
            flex: 1,
          }}>
          {/* <View style={styles.LoginBg}> */}
          {/* <KeyboardAvoidingView
            behavior={Platform.OS == 'android' ? 'margin' : 'position'}> */}

          {/* <ScrollView> */}
          <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
            <View style={styles.container}>

              <Image
                style={styles.Logo}
                source={require('../../assets/images/logo.png')}
                resizeMode="contain"></Image>
              <View style={styles.titleWrap}>
                <Text style={styles.title}> Sign in to</Text>
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
                    <MaterialCommunityIcon
                      name={'chevron-down'}
                      size={18}
                      color={'#0466A9'}
                      onPress={BUSelect}
                      style={{ position: 'absolute', right: 15 }}
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
                      style={{ position: 'absolute', right: 15}}
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
                          <Text style={styles.option}>Hindutan Zinc Ltd</Text>
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
                Email Address*
              </Text>
              <View style={styles.inputView}>
                <FloatingLabelInputField
                  style={styles.input}
                  placeholder={'Enter Email Address'}
                  onChangeText={val => setEmail(val)}
                  value={email}
                  textStyle={{
                    fontSize: Dimension.font14,
                    fontFamily: Dimension.CustomRegularFont,
                    // borderWidth: 1,
                    // borderRightWidth: 0,
                    // borderTopRightRadius: 0,
                    // borderBottomRightRadius: 0,
                  }}
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
                Enter Password*
              </Text>
              <View style={styles.inputView}>
                <FloatingLabelInputField
                  placeholder={'Enter Password'}
                  value={pwd}
                  onChangeText={text => setPwd(text)}
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
                        padding: Dimension.padding10,
                        borderRadius: 5,
                      }}>
                      <AntDesign name="eyeo" size={18} color="#000" />
                    </TouchableOpacity>
                  }
                />
              </View>

              <TouchableOpacity
                onPress={() => props?.navigation.navigate('ForgetPassword')} style={{alignSelf: 'flex-start' }}>
                <Text style={styles.forgotpassTxt}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onPressLoginNew}
                disabled={isCtaDisabled()}
                style={[
                  styles.loginBtn,
                  { backgroundColor: isCtaDisabled() ? '#B0B0B0' : '#0063A7' },
                ]}>
                <Text style={[styles.loginText, { marginLeft: loader ? 8 : 0 }]}>
                  Sign In{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLoginWithOtp}
                style={[
                  styles.signupBtn,
                  { marginBottom: !isUserInfo ? Dimension.margin40 : 0 },
                ]}>
                <Text style={styles.signupText}>Login with OTP </Text>
              </TouchableOpacity>
              {isUserInfo ? (
                <TouchableOpacity
                  onPress={() => {
                    if (isSkip === 'true') {
                      openBioModal();
                    } else {
                      if (Platform.OS === 'ios' && hasFaceAuth) {
                        handleFaceAuthentication();
                      } else {
                        handleFingerprint();
                      }
                    }
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: Dimension.padding30,
                    paddingBottom: Platform.OS === 'ios' ? Dimension.padding30 : Dimension.padding20,
                  }}>
                  <MaterialCommunityIcon
                    name={
                      Platform.OS === 'ios' && hasFaceAuth
                        ? 'face-recognition'
                        : 'fingerprint'
                    }
                    size={25}
                    color={'#0064A8'}
                    style={{
                      marginRight: 20,
                    }}
                  />
                  <Text style={[styles.result, { width: 'auto' }]}>
                    {Platform.OS === 'ios' && hasFaceAuth
                      ? 'Face ID'
                      : 'Fingerprint'}{' '}
                    login
                  </Text>
                </TouchableOpacity>
              ) : null}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',

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
          </TouchableWithoutFeedback>
          {modalShown && (
            <Modal
              visible={openModal}
              animationType="slide"
              transparent={true}
              onRequestClose={onCloseBioModal}>
              <View style={styles.modalOverlay}>
                <TouchableOpacity
                  onPress={onCloseBioModal}
                  style={{
                    top: -10,
                    left: '50%',
                    transform: [{ translateX: -20 }],
                    zIndex: 1,
                  }}>
                  <AntDesign name="closecircle" size={35} color="#000" />
                </TouchableOpacity>
                <View
                  style={{
                    height: windowHeight / 1.2,
                    width: windowWidth,
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    paddingHorizontal: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: Dimension.font16,
                      fontFamily: Dimension.CustomExtraBoldFont,
                      fontWeight: '700',
                      color: '#000',
                      marginVertical: 20,
                    }}>
                    Touch ID
                  </Text>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: '#EFEFEF',
                      width: windowWidth,
                    }}
                  />
                  <MaterialCommunityIcon
                    name={
                      Platform.OS === 'ios' && hasFaceAuth
                        ? 'face-recognition'
                        : 'fingerprint'
                    }
                    size={65}
                    color={'#000'}
                    style={{
                      marginBottom: 20,
                      alignSelf: 'center',
                      alignItems: 'center',
                      marginTop: Dimension.margin100,
                      marginBottom: 0,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: Dimension.font16,
                      fontFamily: Dimension.CustomExtraBoldFont,
                      fontWeight: '700',
                      textAlign: 'center',
                      color: '#000',
                      marginTop: 43,
                      marginBottom: 16,
                    }}>
                    Enabling Touch ID will give you faster access to your
                    information
                  </Text>
                  <Text
                    style={{
                      fontSize: Dimension.font14,
                      fontFamily: Dimension.CustomExtraBoldFont,
                      fontWeight: '600',
                      textAlign: 'center',
                      color: '#000',
                      marginBottom: 30,
                    }}>
                    You can turn this on and off at any time under settings
                  </Text>

                  <View
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      width: windowWidth,
                    }}>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: '#EFEFEF',
                        width: '100%',
                        marginVertical: 10,
                      }}
                    />
                    <EnableButton
                      button1={'Skip'}
                      button2={'Enable'}
                      fromEditProfile
                      firstButton={closeBioModal}
                      secondButton={
                        !hasFaceAuth
                          ? () => {
                            handleFaceAuthentication();
                            onCloseBioModal();
                          }
                          : () => {
                            handleFingerprint();
                            onCloseBioModal();
                          }
                      }
                      enableButton
                    />
                  </View>
                </View>
              </View>
            </Modal>
          )}
          {/* </ScrollView> */}
          {/* </KeyboardAvoidingView> */}
        </LinearGradient>
      </View>
    </>
  );
};

export default LoginScreen;
