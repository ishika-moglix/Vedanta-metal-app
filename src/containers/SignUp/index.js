import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  StatusBar,
  NativeModules,
  Button,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Linking,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
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
import { useSelector, useDispatch } from 'react-redux';
import AesUtil from '../../generic/index';
import CryptoJS from 'crypto-js';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { signUpRequest } from '../../redux/feature/userSlice';
import { setAuth } from '../../redux/feature/authslice';
import { gstinRegex, phoneLengthChecker, phoneValidator } from '../../constants';
import { emailRegex, passwordExp, nameRegex } from '../../constants';
import { STATE_STATUS } from '../../redux/constants';
import BiometricAuth from '../../utils/BiometricAuth';
import { setBusinessDetails } from '../../redux/feature/businessDetailsSlice';
import { setPlantDetails } from '../../redux/feature/plantsSlice';
import { setBankDetails } from '../../redux/feature/BankDetailsSlice';
import Toast from 'react-native-toast-message';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Select from '../../component/Select';
import CustomLoader from '../../component/customLoader';
import config from '../../services';
// import ENV from './url';

// import {useSelector} from 'react-redux';
const CLIENT_ID = ENV[config.PROJECT_ENV].MICROSOFT_CLIENT_ID; //'ac5fc872-17f9-4f59-af74-3abbe885956e'; //'ff1fe9da-d218-4ceb-a11f-05ea54a985fb';

// const azureAuth = new AzureAuth({
//   clientId: CLIENT_ID,
// });

const SignUpScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [gstin, setGstin] = useState('');
  const [CompanyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [productVariants, setProductVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [anyprod, setAnyProd] = useState('');
  const [checkboxState, setCheckboxState] = useState(false);
  const [selectedProd, setProd] = useState('');
  const [result, setResult] = useState('Select Business Unit');
  const [metal, setMetal] = useState('Select Metal');
  const [checkedItem, setCheckedItem] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [useraddress, setUserAddress] = useState('');
  const [address, setAddress] = useState([]);
  const [businessUnitModal, setOnBusinessUnitModal] = useState(false);
  const [metalModal, setOnMetalModal] = useState(false);
  const [productModal, setOnProductModal] = useState(false);
  const [gstinExist, setGstinExist] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [pwdError, setPwdError] = useState(false);
  const [pwdErrorMessage, setPwdErrorMessage] = useState('');
  const [cnfrmPwdError, setCnfrmPwdError] = useState(false);
  const [cnfrmPwdErrorMessage, setCnfrmPwdErrorMessage] = useState('');
  const [inputType, setInputType] = useState(true);
  const [taxPayerData, setTaxpayeerData] = useState('');
  const [nameError, setNameError] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [enableOtp, setEnableOtp] = useState(false);
  const [changeView, setChangeView] = useState(false);
  const searchTopRef = useRef(0);
  const [enablePhoneOtp, setEnablePhoneOtp] = useState(false);
  const [phoneOtpLoader, setPhoneOtpLoader] = useState(false);
  const authData = useSelector(state => state.auth?.data);
  const isCtaDisabled = () => {
    let alumCase = false;
    if (selectedProd === 'Aluminium') {
      alumCase =
        !name.trim().length ||
        !designation.trim().length ||
        checkedItem.length === 0;
    }
    const commonValidation =
      !(phoneNo?.trim()?.length == 10) ||
      !gstin ||
      !CompanyName ||
      !email.match(emailRegex) ||
      (!gstinExist &&
        (!pwd.match(passwordExp) || !confirmPwd.match(passwordExp))) ||
      !phoneOtp ||
      !emailOtp ||
      !checkboxState;

    return alumCase || commonValidation;
  };
  const refreshDetails = async () => {
    try {
      await AsyncStorage.removeItem('rfcCase_BusinessDetails');
      await AsyncStorage.removeItem('rfcCase_PlantDetails');
      await AsyncStorage.removeItem('rfcCase_BankDetails');
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    refreshDetails();
    dispatch(
      setAuth({
        data: {},
        status: STATE_STATUS.UNFETCHED,
        isLoggedIn: false,
      }),
    );
    dispatch(
      setBusinessDetails({
        data: {},
        status: STATE_STATUS.UNFETCHED,
      }),
    );
    dispatch(
      setPlantDetails({
        data: {},
        status: STATE_STATUS.UNFETCHED,
      }),
    );
    dispatch(
      setBankDetails({
        data: {},
        status: STATE_STATUS.UNFETCHED,
      }),
    );
  }, []);

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
      confirmPwd, // text (confirm password)
    );

    let encryptedPwdString = iv + '::' + salt + '::' + encryptedPassword;
    let encryptedConfirmPwdString =
      iv + '::' + salt + '::' + encryptedConfirmPassword;

    let finalPassword = Base64.btoa(encryptedPwdString);
    let finalConfirmPassword = Base64.btoa(encryptedConfirmPwdString);

    onCreateAccount(finalPassword, finalConfirmPassword);
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

  const onPressSignupNew = () => {
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
      let dataObj = {
        email: email,
        businessUnit: selectedProd,
      };

      ScannerService.getSaltInfo(dataObj)
        .then(data => {
          if (data.data != null && data?.data?.data_on && data?.data?.test_on) {
            getData2(data.data.data_on, data.data.test_on);
          } else {
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
          setLoader(false);
          Toast.show({
            type: 'error',
            text2: 'Something went wrong!',
            visibilityTime: 4000,
            autoHide: true,
          });
        });
    }
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

  const handleCheckedItem = product => {
    let prod = [];
    setCheckedItem(prevChecked => {
      let updatedChecked;
      if (prevChecked.includes(product)) {
        updatedChecked = prevChecked.filter(item => item !== product);
      } else {
        updatedChecked = [...prevChecked, product];
      }
      const selectedProducts = updatedChecked.map(selectedProduct => {
        const variant = productVariants.find(
          variant => variant.description === selectedProduct,
        );
        prod.push({
          productId: variant?.product?.id,
          productName: variant?.description,
        });
        setProducts(prod);
      });
      return updatedChecked;
    });
  };

  const handleOptionSelect = option => {
    if (option === 'Hindustan Zinc Ltd') {
      setProd('Zinc');
    } else {
      setProd(option);
    }
    setResult(option);
    setIsVisible(false);
    openBusinessUnitModal(false);
  };

  const handleMetalSelect = option => {
    setMetal(option);
    // setProd(option);
    setOnMetalModal(false);
    setIsVisible(false);
  };

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
    navigation.navigate('WebView', { URL: navURL });
  };

  const webSignup = () => {
    let navURL = CONSTANTS.WEBURL.SIGNUP;
    navigation.navigate('WebView', { URL: navURL });
  };

  const webTerms = async url => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        console.log('Terms opened successfully');
        return;
      }
    } catch (error) {
      console.error(`Error trying to open WhatsApp with URL ${url}:`, error);
    }
    // let navURL = CONSTANTS.WEBURL.TERMS;
    // console.log('url', navURL);
    // await Linking.openURL(url);
    // navigation.navigate('WebView', {URL: navURL});
  };
  const getRandomInt = (min = 1, max = 999) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  };

  const randomArray = () => {
    return [getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt()];
  };

  const onGetTaxpayerByGstin = async gstin => {
    try {
      const { data } = await ScannerService.getTaxpayerByGstin(
        gstin.toUpperCase(),
      );
      if (data?.valid) {
        console.log('yes hit');
        const address = data?.taxpayerDetails.billing_address.addr;
        const formattedAddressForUI = `${address.flno}${address.bno}, ${address.bnm}, ${address.st}, ${address.loc}, ${address.stcd}, ${address.pncd}.`;
        setUserAddress(formattedAddressForUI);
        setAddress(address);
        setTaxpayeerData(data);
        setCompanyName(data.taxpayerDetails.legal_name_of_business);
        // Toast.show({
        //   type: 'success',
        //   text2: data?.message || 'Failure',
        //   visibilityTime: 4000,
        //   autoHide: true,
        // });
      } else {
       Toast.show({
          type: 'error',
          text2: data?.message || 'Failure',
          visibilityTime: 4000,
          autoHide: true,
        });
        setTaxpayeerData([]);
        setCompanyName('');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const isGstinExist = async (gstin, businessUnit) => {
    try {
      const data = await ScannerService.isGstinExist(
        gstin.toUpperCase(),
        businessUnit,
      );
      console.log('duyj', data);

      setGstinExist(data?.data?.successful);
    } catch (error) {
      console.log('error', error);
    }
  };

  const getData = async (businessUnit, email) => {
    try {
      const { data } = await ScannerService.getData(businessUnit, email);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const isValidGstin = gstinRegex.test(gstin.toUpperCase());
    if (isValidGstin) {
      onGetTaxpayerByGstin(gstin);
      isGstinExist(gstin, selectedProd);
    } else {
      setCompanyName('');
      setUserAddress('');
    }
  }, [gstin]);

  // useEffect(() => {
  //   if (gstin.length >= 10) {
  //     onGetTaxpayerByGstin(gstin);
  //     isGstinExist(gstin, selectedProd);
  //   }
  // }, [gstin]);

  const phoneLengthChecker = phoneNo => phoneNo.length === 10;

  useEffect(() => {
    if (phoneNo.length === 0) {
      setPhoneError(false);
    } else if (phoneNo) {
      if (!phoneValidator(phoneNo) && phoneLengthChecker) {
        setPhoneError(true);
        setPhoneErrorMessage(
          'Please enter valid mobile number (starting with 6-9)',
        );
      } else {
        setPhoneError(false);
      }
    }
  }, [phoneNo]);

  // useEffect(() => {
  //   if (phoneNo.length == 0) {
  //     setPhoneError(false);
  //   } else if (phoneNo) {
  //     if (!phoneLengthChecker(phoneNo)) {
  //       setPhoneError(true);
  //       setPhoneErrorMessage('Mobile number must be 10 digits');
  //     } else if (!phoneValidator(phoneNo)) {
  //       setPhoneError(true);
  //       setPhoneErrorMessage('Please enter valid mobile number');
  //     } else {
  //       setPhoneError(false);
  //     }
  //   }
  // }, [phoneNo]);

  useEffect(() => {
    if (pwd && pwd.match(passwordExp)) {
      setPwdError(false);
    } else {
      if (pwd == '' && pwd.length == 0) {
        setPwdError(false);
        setPwdErrorMessage('');
      } else {
        setPwdError(true);
        setPwdErrorMessage(
          'Enter a strong password and At least 8 characters long',
        );
      }
    }
  }, [pwd]);

  useEffect(() => {
    if (confirmPwd && confirmPwd.match(passwordExp)) {
      setCnfrmPwdError(false);
    } else {
      if (confirmPwd == '' && confirmPwd.length == 0) {
        setCnfrmPwdError(false);
        setCnfrmPwdErrorMessage('');
      } else {
        setCnfrmPwdError(true);
        setCnfrmPwdErrorMessage(
          'Confirm Password should be same as Password and At least 8 characters long',
        );
      }
    }
  }, [confirmPwd]);

  useEffect(() => {
    if (name && name.match(nameRegex)) {
      setNameError(false);
    } else {
      if (name.length == 0) {
        setNameError(false);
        setNameErrorMessage('');
      } else {
        setNameError(true);
        setNameErrorMessage(
          'Name cannot contain special characters or numbers.',
        );
      }
    }
  }, [name]);

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
  console.log('bu', selectedProd);

  const onCreateAccount = async (newPwd, newCnfrmPwd) => {
    if (!selectedProd.trim().length) {
      Toast.show({
        type: 'error',
        text2: 'Please Select Business Unit',
        visibilityTime: 4000,
        autoHide: true,
      });
      setLoader(false);
    } else {
      try {
        if (selectedProd === 'Zinc' || result == 'Hindustan Zinc Ltd') {
          if (!metal.trim().length || metal == 'Select Metal') {
            Toast.show({
              type: 'error',
              text2: 'Please Select Sub Business Unit',
              visibilityTime: 4000,
              autoHide: true,
            });
            setLoader(false);
            return;
          }
        }
        setLoader(true);
        getData(selectedProd, email);
        const data = await ScannerService.signUp({
          gstNO: gstin.toUpperCase(),
          cin: '',
          companyName: CompanyName || '',
          email,
          password: newPwd,
          confirmPassword: newCnfrmPwd,
          businessUnit: selectedProd,
          existingGstIn: gstinExist,
          firstName: name,
          lastName: name,
          gstCompanyAddress: {
            addressLine1: `${address.flno}${address.bno}, ${address.bnm}, ${address.st},`,
            city: address.loc,
            state: address.stcd,
            pincode: address.pncd,
            addressType: 'Business Address',
          },
          products: products,
          otherProduct: '',
          designation: designation,
          phoneNumber: phoneNo || '',
          phoneOtp: phoneOtp || '',
          emailOtp: emailOtp || '',
          subBusinessUnit: metal,
        });

        if (data?.data?.successful) {
          if (gstinExist) {
            console.log('yest hit to store data');
            // storeData(data?.data);
            setLoader(false);
            navigation.navigate('Login');
          } else {
            dispatch(
              setAuth({
                status: STATE_STATUS.FETCHED,
                data: data?.data?.data,
              }),
            );
            navigation.replace('BusinessDetails', {
              GSTIN: data?.data?.data?.gstNO,
              companyName: data?.data?.data?.companyName,
              tradeName: data?.data?.data?.tradeName,
              email: data?.data?.data?.userDetails?.email,
              phoneNo: data?.data?.data?.userDetails?.phoneNumber || phoneNo,
              panNumber: data?.data?.data?.userDetails?.pan,
            });
            Toast.show({
              type: 'success',
              text2: data?.data?.message || 'Success',
              visibilityTime: 2000,
              autoHide: true,
            });
            setLoader(false);
          }
        } else {
          setLoader(false);
          Toast.show({
            type: 'error',
            text2: data?.data?.message || 'Error',
            visibilityTime: 4000,
            autoHide: true,
          });
        }
        console.log('data signup', data);
      } catch (e) {
        console.log(e);
        setLoader(false);
      }
    }
  };

  const onSendEmailOtp = async () => {
    try {
      setOtpLoader(true);
      const data = await ScannerService.sendEmailOtp(email);
      console.log('data for email', data);

      if (data?.data?.successful) {
        console.log('jit');
        setEnableOtp(true);
        setChangeView(true);
        setOtpLoader(false);
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

  const onSendPhoneOtp = async () => {
    try {
      setPhoneOtpLoader(true);
      const data = await ScannerService.sendPhoneOtp(phoneNo);
      if (data?.data?.successful) {
        console.log('pit');
        setEnablePhoneOtp(true);
        setChangeView(true);
        setPhoneOtpLoader(false);
        Toast.show({
          type: 'success',
          text2: data?.data?.message || 'OTP sent successfully',
          visibilityTime: 4000,
          autoHide: true,
        });
      } else {
        setPhoneOtpLoader(false);
        Toast.show({
          type: 'error',
          text2: data?.data?.message || 'Failure',
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    } catch (e) {
      console.log('Error is', e);
      setPhoneOtpLoader(false);
    }
  };

  // const onSendOtp = async (datano, field) => {
  //   try {
  //     const data = await ScannerService.sendOtp(datano);
  //     console.log(enablePhoneOtp);

  //     if (data?.data?.successful) {
  //       Toast.show({
  //         type: 'success',
  //         text2: data?.data?.message || 'Otp send successfully',
  //         visibilityTime: 4000,
  //         autoHide: true,
  //       });
  //       setEnablePhoneOtp(prevState => ({
  //         ...prevState,
  //         [field]: true,
  //       }));
  //       console.log(enablePhoneOtp);
  //     } else {
  //       Toast.show({
  //         type: 'error',
  //         text2: data?.data?.message || 'Failure',
  //         visibilityTime: 4000,
  //         autoHide: true,
  //       });
  //     }
  //   } catch (e) {
  //     console.log('Error is', e);
  //   }
  // };
  const getAllProductVariants = async prod => {
    try {
      const { data } = await ScannerService.getAllProductVariants(prod);
      console.log('data', data);
      if (data?.success) {
        setProductVariants(data?.data?.result);
      } else {
        setProductVariants([]);
      }
    } catch (e) {
      console.log('Error is', e);
    }
  };

  useEffect(() => {
    getAllProductVariants(selectedProd);
  }, [selectedProd]);

  const openBusinessUnitModal = () => {
    setOnBusinessUnitModal(!businessUnitModal);
  };
  const openMetalModal = () => {
    setOnMetalModal(!metalModal);
  };

  const openProductModal = () => {
    setOnProductModal(!productModal);
  };

  const closeProductModal = () => {
    setOnProductModal(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {loader && (
        <CustomLoader fullScreen />
      )}
      <View
        style={{ flex: 1, backgroundColor: '#fff' }}
      // behavior={'height'}
      >
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
          {/* <View style={styles.LoginBg}> */}
          <KeyboardAvoidingView
            behavior={Platform.OS == 'android' ? 'margin' : 'position'}>
            <ScrollView>
              <View style={styles.container}>
                {selectedProd === 'Aluminium' ? (
                  <Image
                    style={styles.Logo}
                    source={require('../../assets/images/logo.png')}
                    resizeMode="contain"
                  />
                ) : selectedProd === 'Zinc' ||
                  selectedProd === 'Silver' ||
                  selectedProd === 'Lead' ||
                  selectedProd === 'Scrap' ||
                  selectedProd === 'Hindustan Zinc Ltd' ? (
                  <Image
                    style={[
                      styles.Logo,
                      { height: Dimension.height40, width: Dimension.width250 },
                    ]}
                    source={require('../../assets/images/HZLlogo.jpg')}
                    resizeMode="contain"
                  />
                ) : selectedProd === 'Copper' ? (
                  <>
                    <Image
                      style={[
                        styles.Logo,
                        { height: Dimension.height40, width: Dimension.width250 },
                      ]}
                      source={require('../../assets/images/CULogo.jpeg')}
                      resizeMode="contain"
                    />
                  </>
                ) : (
                  <Image
                    style={styles.Logo}
                    source={require('../../assets/images/logo.png')}
                    resizeMode="contain"
                  />
                )}

                {Platform.OS === 'ios' ? (
                  <>
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
                          style={{ position: 'absolute', right: 15, top: 12 }}
                        />
                      </TouchableOpacity>
                    </View>
                    {result === 'Hindustan Zinc Ltd' && (
                      <View style={[styles.pickerWrap, { marginTop: 0 }]}>
                        <TouchableOpacity
                          onPress={openMetalModal}
                          style={styles.pickerWrapBtn}>
                          <Text
                            style={[styles.result, { width: 'auto' }]}
                            numberOfLines={1}>
                            {metal}
                          </Text>
                          <MaterialCommunityIcon
                            name={'menu-down'}
                            size={22}
                            color={'#0466A9'}
                            // onPress={openBusinessUnitModal}
                            style={{ position: 'absolute', right: 15, top: 8 }}
                          />
                        </TouchableOpacity>
                        {metalModal && (
                          <Modal
                            visible={metalModal}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={openMetalModal}>
                            <View style={styles.modalOverlay}>
                              <TouchableOpacity
                                onPress={openMetalModal}
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
                                  style={{
                                    position: 'absolute',
                                    top: -10,
                                    left: 0,
                                  }}
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
                                  Select Metal
                                </Text>
                                <View style={styles.separator} />
                                <TouchableOpacity
                                  onPress={() => handleMetalSelect('Zinc')}
                                  style={{ marginVertical: 20 }}>
                                  <Text style={styles.option}>Zinc</Text>
                                </TouchableOpacity>
                                <View style={styles.separator} />
                                <TouchableOpacity
                                  onPress={() => handleMetalSelect('Lead')}
                                  style={{ marginVertical: 20 }}>
                                  <Text style={styles.option}>Lead</Text>
                                </TouchableOpacity>
                                <View style={styles.separator} />
                                <TouchableOpacity
                                  onPress={() => handleMetalSelect('Scrap')}
                                  style={{ marginVertical: 20 }}>
                                  <Text style={styles.option}>Scrap</Text>
                                </TouchableOpacity>
                                <View style={styles.separator} />
                                <TouchableOpacity
                                  onPress={() => handleMetalSelect('Silver')}
                                  style={{ marginVertical: 20 }}>
                                  <Text style={styles.option}>Silver</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </Modal>
                        )}
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    <View
                      style={[
                        styles.pickerWrap,
                        { marginTop: 50, marginBottom: Dimension.margin20 },
                      ]}>
                      <TouchableOpacity
                        onPress={openBusinessUnitModal}
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
                          // onPress={openBusinessUnitModal}
                          style={{ position: 'absolute', right: 15, top: 8 }}
                        />
                      </TouchableOpacity>
                      {businessUnitModal && (
                        <Modal
                          visible={businessUnitModal}
                          animationType="slide"
                          transparent={true}
                          onRequestClose={openBusinessUnitModal}>
                          <View style={styles.modalOverlay}>
                            <TouchableOpacity
                              onPress={openBusinessUnitModal}
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
                                style={{
                                  position: 'absolute',
                                  top: -10,
                                  left: 0,
                                }}
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
                                onPress={() => handleOptionSelect('Aluminium')}
                                style={{ marginVertical: 25 }}>
                                <Text style={styles.option}>Aluminium</Text>
                              </TouchableOpacity>
                              <View style={styles.separator} />
                              <TouchableOpacity
                                onPress={() => handleOptionSelect('Copper')}
                                style={{ marginVertical: 25 }}>
                                <Text style={styles.option}>Copper</Text>
                              </TouchableOpacity>
                              <View style={styles.separator} />
                              <TouchableOpacity
                                onPress={() =>
                                  handleOptionSelect('Hindustan Zinc Ltd')
                                }
                                style={{ marginVertical: 25 }}>
                                <Text style={styles.option}>
                                  Hindustan Zinc Ltd
                                </Text>
                              </TouchableOpacity>
                              {/* <View style={styles.separator} /> */}
                              {/* <TouchableOpacity
                              onPress={() => handleOptionSelect('Acid')}
                              style={{marginVertical: 25}}>
                              <Text style={styles.option}>Acid</Text>
                            </TouchableOpacity> */}
                            </View>
                          </View>
                        </Modal>
                      )}
                    </View>
                    {result === 'Hindustan Zinc Ltd' && (
                      <View style={[styles.pickerWrap, { marginTop: 0 }]}>
                        <TouchableOpacity
                          onPress={openMetalModal}
                          style={styles.pickerWrapBtn}>
                          <Text style={styles.result} numberOfLines={1}>
                            {metal}
                          </Text>
                          <MaterialCommunityIcon
                            name={'menu-down'}
                            size={22}
                            color={'#0466A9'}
                            // onPress={openBusinessUnitModal}
                            style={{ position: 'absolute', right: 15, top: 8 }}
                          />
                        </TouchableOpacity>
                        {metalModal && (
                          <Modal
                            visible={metalModal}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={openMetalModal}>
                            <View style={styles.modalOverlay}>
                              <TouchableOpacity
                                onPress={openMetalModal}
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
                                  style={{
                                    position: 'absolute',
                                    top: -10,
                                    left: 0,
                                  }}
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
                                  Select Metal
                                </Text>
                                <View style={styles.separator} />
                                <TouchableOpacity
                                  onPress={() => handleMetalSelect('Zinc')}
                                  style={{ marginVertical: 20 }}>
                                  <Text style={styles.option}>Zinc</Text>
                                </TouchableOpacity>
                                <View style={styles.separator} />
                                <TouchableOpacity
                                  onPress={() => handleMetalSelect('Lead')}
                                  style={{ marginVertical: 20 }}>
                                  <Text style={styles.option}>Lead</Text>
                                </TouchableOpacity>
                                <View style={styles.separator} />
                                <TouchableOpacity
                                  onPress={() => handleMetalSelect('Scrap')}
                                  style={{ marginVertical: 20 }}>
                                  <Text style={styles.option}>Scrap</Text>
                                </TouchableOpacity>
                                <View style={styles.separator} />
                                <TouchableOpacity
                                  onPress={() => handleMetalSelect('Silver')}
                                  style={{ marginVertical: 20 }}>
                                  <Text style={styles.option}>Silver</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </Modal>
                        )}
                      </View>
                    )}
                  </>
                )}
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 12,
                    marginBottom: Dimension.margin8,
                    marginTop: Dimension.margin20,
                  }}>
                  GSTIN*
                </Text>
                <View style={[styles.inputView]}>
                  <FloatingLabelInputField
                    placeholder={'Enter GSTIN'}
                    value={gstin}
                    autoCapitalize={'characters'}
                    onChangeText={text => setGstin(text)}
                  />
                </View>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 12,
                    marginBottom: Dimension.margin8,
                    marginTop: Dimension.margin20,
                  }}>
                  Company Name*
                </Text>
                <View style={styles.inputView}>
                  <FloatingLabelInputField
                    placeholder={'EnterCompany Name'}
                    onChangeText={val => setCompanyName(val)}
                    value={CompanyName}
                    editable={false}
                    textStyle={{
                      backgroundColor: '#EAEAEA',
                    }}
                  />
                </View>
                {selectedProd === 'Aluminium' && (
                  <>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 12,
                        marginBottom: Dimension.margin8,
                        marginTop: Dimension.margin20,
                      }}>
                      Name*
                    </Text>
                    <View style={styles.inputView}>
                      <FloatingLabelInputField
                        placeholder={'Enter Name'}
                        disabledLabel
                        onChangeText={val => setName(val)}
                        value={name}
                      />
                    </View>
                    {nameError && (
                      <Text style={styles.errorText}>{nameErrorMessage}</Text>
                    )}
                  </>
                )}
                {selectedProd === 'Aluminium' && (
                  <>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 12,
                        marginBottom: Dimension.margin8,
                        marginTop: Dimension.margin20,
                      }}>
                      Designation*
                    </Text>
                    <View style={styles.inputView}>
                      <FloatingLabelInputField
                        placeholder={'Enter Designation'}
                        disabledLabel
                        onChangeText={val => setDesignation(val)}
                        value={designation}
                      />
                    </View>
                  </>
                )}
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 12,
                    marginBottom: Dimension.margin8,
                    marginTop: Dimension.margin20,
                  }}>
                  Phone Number*
                </Text>
                <View style={styles.inputView}>
                  <FloatingLabelInputField
                    placeholder={'Enter Phone Number'}
                    disabledLabel
                    onChangeText={val => setPhoneNo(val)}
                    value={phoneNo}
                    maxLength={10}
                    keyboardType="number-pad"
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
                        onPress={() => onSendPhoneOtp(phoneNo)}
                        disabled={phoneOtpLoader || !phoneValidator(phoneNo)}
                        style={{
                          backgroundColor: '#fff',
                          padding: 10,
                          borderRadius: 5,
                        }}>
                        <View style={styles.row}>
                          {phoneOtpLoader ? (
                            <ActivityIndicator
                              style={styles.loader}
                              color={'#0064A8'}
                              size={15}
                            />
                          ) : (
                            <Text
                              style={{
                                color: phoneValidator(phoneNo)
                                  ? '#0064A8'
                                  : '#D9D9D9',
                                fontSize: 12,
                                fontWeight: 'bold',
                              }}>
                              Send OTP
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    }
                  />
                </View>
                {phoneError && (
                  <Text style={styles.errorText}>{phoneErrorMessage}</Text>
                )}
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 12,
                    marginBottom: Dimension.margin8,
                    marginTop: Dimension.margin20,
                  }}>
                  Phone OTP*
                </Text>
                <View style={styles.inputView}>
                  <FloatingLabelInputField
                    placeholder={'Enter Phone OTP'}
                    disabledLabel
                    onChangeText={val => setPhoneOtp(val)}
                    value={phoneOtp}
                    maxLength={6}
                    keyboardType="number-pad"
                    editable={enablePhoneOtp}
                    // editable={enablePhoneOtp.phoneNo}
                    textStyle={{
                      backgroundColor: !enablePhoneOtp ? '#F0F0F0' : '#FFF',
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 12,
                    marginBottom: Dimension.margin8,
                    marginTop: Dimension.margin20,
                  }}>
                  Email*
                </Text>
                <View style={styles.inputView}>
                  <FloatingLabelInputField
                    placeholder={'Enter Email'}
                    disabledLabel
                    onChangeText={val => {
                      setEmail(val);
                      // setEmailError(emailRegex.test(val));
                    }}
                    value={email}
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
                        onPress={() => onSendEmailOtp(email)}
                        disabled={otpLoader || !email.match(emailRegex)}
                        style={{
                          backgroundColor: '#fff',
                          padding: 10,
                          borderRadius: 5,
                        }}>
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
                                color: email.match(emailRegex)
                                  ? '#0064A8'
                                  : '#D9D9D9',
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
                  Email OTP*
                </Text>
                <View style={styles.inputView}>
                  <FloatingLabelInputField
                    placeholder={'Enter Email OTP'}
                    disabledLabel
                    onChangeText={val => setEmailOtp(val)}
                    value={emailOtp}
                    maxLength={6}
                    keyboardType="number-pad"
                    editable={enableOtp}
                    // editable={setEnablePhoneOtp}
                    textStyle={{
                      backgroundColor: !enableOtp ? '#F0F0F0' : '#FFF',
                    }}
                  />
                </View>
                {selectedProd === 'Aluminium' && (
                  <>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 12,
                        marginBottom: Dimension.margin8,
                        marginTop: Dimension.margin20,
                      }}>
                      Company Address
                    </Text>
                    <View style={styles.inputView}>
                      <FloatingLabelInputField
                        disabledLabel
                        value={useraddress}
                      />
                    </View>
                  </>
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
                    editable={!gstinExist}
                    onChangeText={val => setPwd(val)}
                    value={pwd}
                    maxLength={20}
                    secureTextEntry
                    textStyle={{
                      backgroundColor: gstinExist ? '#F0F0F0' : '#FFF',
                    }}
                  />
                </View>
                {pwdError && (
                  <Text style={styles.errorText}>{pwdErrorMessage}</Text>
                )}
                <Text
                  style={{
                    color: '#000000',
                    fontSize: 12,
                    marginBottom: Dimension.margin8,
                    marginTop: Dimension.margin20,
                  }}>
                  Confirm Password*
                </Text>
                <View style={styles.inputView}>
                  <FloatingLabelInputField
                    placeholder={'Enter Confirm Password'}
                    editable={!gstinExist}
                    onChangeText={val => setConfirmPwd(val)}
                    value={confirmPwd}
                    maxLength={20}
                    secureTextEntry={inputType}
                    textStyle={{
                      fontSize: Dimension.font14,
                      fontFamily: Dimension.CustomRegularFont,
                      borderWidth: 1,
                      borderRightWidth: gstinExist ? 1 : 0,
                      borderTopRightRadius: gstinExist ? 4 : 0,
                      borderBottomRightRadius: gstinExist ? 4 : 0,
                      backgroundColor: gstinExist ? '#F0F0F0' : '#FFF',
                    }}
                    buttonEnabled
                    buttonComponent={
                      !gstinExist && (
                        <TouchableOpacity
                          onPress={() => setInputType(!inputType)}
                          style={{
                            backgroundColor: '#fff',
                            padding: 10,
                            borderRadius: 5,
                          }}>
                          <AntDesign name="eyeo" size={18} color="#000" />
                        </TouchableOpacity>
                      )
                    }
                  />
                </View>
                {cnfrmPwdError && (
                  <Text style={styles.errorText}>{cnfrmPwdErrorMessage}</Text>
                )}
                {selectedProd === 'Aluminium' && (
                  <>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 12,
                        marginBottom: Dimension.margin8,
                        marginTop: Dimension.margin20,
                      }}>
                      Products*
                    </Text>
                    <TouchableOpacity onPress={openProductModal}>
                      <View
                        style={[
                          styles.inputViews,
                          {
                            borderColor: !checkedItem.length
                              ? '#cbcbcb'
                              : '#0063a7',
                          },
                        ]}>
                        <TextInput
                          value={checkedItem.join(', ')}
                          style={styles.inputFields}
                          editable={false}
                        />
                        <MaterialCommunityIcon
                          name={'menu-down'}
                          size={22}
                          color={'#000'}
                          style={styles.iconStyles}
                        />
                      </View>
                    </TouchableOpacity>
                    {/* <View style={styles.inputView}>
                    <FloatingLabelInputField
                      disabledLabel
                      //onChangeText={val => setProducts(val)}
                      value={checkedItem.join(', ')}
                      textStyle={{
                        fontSize: Dimension.font14,
                        fontFamily: Dimension.CustomRegularFont,
                        borderWidth: 1,
                        borderRightWidth: 0,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                      editable={false}
                      buttonEnabled
                      buttonComponent={
                        <TouchableOpacity
                          onPress={openProductModal}
                          style={{
                            backgroundColor: '#fff',
                            padding: 10,
                            borderRadius: 5,
                          }}>
                          <MaterialCommunityIcon
                            name={'menu-down'}
                            size={22}
                            color={'#000'}
                          />
                        </TouchableOpacity>
                      }
                    />
                  </View> */}

                    {productModal && (
                      <Modal
                        visible={productModal}
                        animationType="none"
                        transparent={true}
                        onRequestClose={closeProductModal}
                        onBackButtonPress={() => {
                          closeProductModal();
                        }}
                        onDismiss={() => {
                          closeProductModal();
                        }}>
                        <TouchableWithoutFeedback onPress={closeProductModal}>
                          <View
                            style={{
                              flex: 1,
                              justifyContent: 'flex-end',
                            }}>
                            <View
                              style={{
                                backgroundColor: '#fff',
                                elevation: 5,
                                height: Dimensions.get('window').height * 0.3,
                                width: Dimensions.get('window').width * 0.8,

                                bottom: Dimensions.get('window').height * 0.15,
                                left: Dimension.padding40,

                                // bottom:
                                //   searchTopRef.current + Dimension.padding110,
                                // left: Dimension.padding40,
                                textAlign: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    padding: 10,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() => handleCheckedItem('Billet')}
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <MaterialCommunityIcon
                                      name={
                                        checkedItem.includes('Billet')
                                          ? 'checkbox-marked'
                                          : 'checkbox-blank-outline'
                                      }
                                      size={18}
                                      color={
                                        checkedItem.includes('Billet')
                                          ? '#0064A8'
                                          : '#000'
                                      }
                                    />
                                    <Text
                                      style={[styles.option, { marginLeft: 10 }]}>
                                      Billet
                                    </Text>
                                  </TouchableOpacity>
                                </View>

                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                  }}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleCheckedItem('Flip Coil')
                                    }
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <MaterialCommunityIcon
                                      name={
                                        checkedItem.includes('Flip Coil')
                                          ? 'checkbox-marked'
                                          : 'checkbox-blank-outline'
                                      }
                                      size={18}
                                      color={
                                        checkedItem.includes('Flip Coil')
                                          ? '#0064A8'
                                          : '#000'
                                      }
                                    />
                                    <Text
                                      style={[styles.option, { marginLeft: 10 }]}>
                                      Flip Coil
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    padding: 10,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleCheckedItem('Hot Metal')
                                    }
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <MaterialCommunityIcon
                                      name={
                                        checkedItem.includes('Hot Metal')
                                          ? 'checkbox-marked'
                                          : 'checkbox-blank-outline'
                                      }
                                      size={18}
                                      color={
                                        checkedItem.includes('Hot Metal')
                                          ? '#0064A8'
                                          : '#000'
                                      }
                                    />
                                    <Text
                                      style={[styles.option, { marginLeft: 10 }]}>
                                      Hot Metal
                                    </Text>
                                  </TouchableOpacity>
                                </View>

                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                  }}>
                                  <TouchableOpacity
                                    onPress={() => handleCheckedItem('Ingot')}
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <MaterialCommunityIcon
                                      name={
                                        checkedItem.includes('Ingot')
                                          ? 'checkbox-marked'
                                          : 'checkbox-blank-outline'
                                      }
                                      size={18}
                                      color={
                                        checkedItem.includes('Ingot')
                                          ? '#0064A8'
                                          : '#000'
                                      }
                                    />
                                    <Text
                                      style={[styles.option, { marginLeft: 10 }]}>
                                      Ingot
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    padding: 10,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() => handleCheckedItem('PFA')}
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <MaterialCommunityIcon
                                      name={
                                        checkedItem.includes('PFA')
                                          ? 'checkbox-marked'
                                          : 'checkbox-blank-outline'
                                      }
                                      size={18}
                                      color={
                                        checkedItem.includes('PFA')
                                          ? '#0064A8'
                                          : '#000'
                                      }
                                    />
                                    <Text
                                      style={[styles.option, { marginLeft: 10 }]}>
                                      PFA
                                    </Text>
                                  </TouchableOpacity>
                                </View>

                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                  }}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleCheckedItem('Rolled Coil')
                                    }
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <MaterialCommunityIcon
                                      name={
                                        checkedItem.includes('Rolled Coil')
                                          ? 'checkbox-marked'
                                          : 'checkbox-blank-outline'
                                      }
                                      size={18}
                                      color={
                                        checkedItem.includes('Rolled Coil')
                                          ? '#0064A8'
                                          : '#000'
                                      }
                                    />
                                    <Text
                                      style={[styles.option, { marginLeft: 10 }]}>
                                      Rolled Coil
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    padding: 10,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleCheckedItem('Rolled Plate')
                                    }
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <MaterialCommunityIcon
                                      name={
                                        checkedItem.includes('Rolled Plate')
                                          ? 'checkbox-marked'
                                          : 'checkbox-blank-outline'
                                      }
                                      size={18}
                                      color={
                                        checkedItem.includes('Rolled Plate')
                                          ? '#0064A8'
                                          : '#000'
                                      }
                                    />
                                    <Text
                                      style={[styles.option, { marginLeft: 10 }]}>
                                      Rolled Plate
                                    </Text>
                                  </TouchableOpacity>
                                </View>

                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                  }}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleCheckedItem('Rolled Sheet')
                                    }
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <MaterialCommunityIcon
                                      name={
                                        checkedItem.includes('Rolled Sheet')
                                          ? 'checkbox-marked'
                                          : 'checkbox-blank-outline'
                                      }
                                      size={18}
                                      color={
                                        checkedItem.includes('Rolled Sheet')
                                          ? '#0064A8'
                                          : '#000'
                                      }
                                    />
                                    <Text
                                      style={[styles.option, { marginLeft: 10 }]}>
                                      Rolled Sheet
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  // backgroundColor: 'yellow',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    padding: 10,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() => handleCheckedItem('Slab')}
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <MaterialCommunityIcon
                                      name={
                                        checkedItem.includes('Slab')
                                          ? 'checkbox-marked'
                                          : 'checkbox-blank-outline'
                                      }
                                      size={18}
                                      color={
                                        checkedItem.includes('Slab')
                                          ? '#0064A8'
                                          : '#000'
                                      }
                                    />
                                    <Text
                                      style={[styles.option, { marginLeft: 10 }]}>
                                      Slab
                                    </Text>
                                  </TouchableOpacity>
                                </View>

                                <View
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                  }}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleCheckedItem('Wire Rod')
                                    }
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <MaterialCommunityIcon
                                      name={
                                        checkedItem.includes('Wire Rod')
                                          ? 'checkbox-marked'
                                          : 'checkbox-blank-outline'
                                      }
                                      size={18}
                                      color={
                                        checkedItem.includes('Wire Rod')
                                          ? '#0064A8'
                                          : '#000'
                                      }
                                    />
                                    <Text
                                      style={[styles.option, { marginLeft: 10 }]}>
                                      Wire Rod
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      </Modal>
                    )}
                  </>
                )}
                {selectedProd === 'Aluminium' && (
                  <>
                    <Text
                      style={{
                        color: '#000000',
                        fontSize: 12,
                        marginBottom: Dimension.margin8,
                        marginTop: Dimension.margin20,
                      }}>
                      Any other product(s)
                    </Text>
                    <View style={styles.inputView}>
                      <FloatingLabelInputField
                        disabledLabel
                        onChangeText={val => setAnyProd(val)}
                        value={anyprod}
                        inputHeight

                      //maxLength={10}
                      //keyboardType=""
                      />
                    </View>
                  </>
                )}
                <View style={styles.forgotPassWrap}>
                  {/* <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '60%',
                  }}> */}
                  <MaterialCommunityIcon
                    onPress={() => setCheckboxState(!checkboxState)}
                    name={
                      checkboxState
                        ? 'checkbox-marked'
                        : 'checkbox-blank-outline'
                    }
                    size={20}
                    color={'#CCCCCC'}
                    style={{ marginRight: Dimension.margin5 }}
                  />
                  <Text style={styles.Checkboxlabel}>
                    By accepting you agree to our {/* <TouchableOpacity */}
                    <Text
                      onPress={() => webTerms(`${ENV[config.PROJECT_ENV].URL}/#/terms`)}
                      style={{
                        color: '#4889F3',
                        fontWeight: '600',
                        fontSize: Dimension.font13,
                        fontFamily: Dimension.CustomRegularFont,
                      }}>
                      {' '}
                      Terms & Conditions
                    </Text>
                    {/* </TouchableOpacity> */}
                    <Text> & </Text>
                    {/* </View> */}
                    {/* <TouchableOpacity
                    > */}
                    <Text
                      onPress={() => webTerms(`${ENV[config.PROJECT_ENV].URL}/#/terms`)}
                      style={{
                        color: '#4889F3',
                        fontWeight: '600',
                        fontSize: Dimension.font13,
                        fontFamily: Dimension.CustomRegularFont,

                        // marginLeft: Dimension.margin25,
                      }}>
                      Privacy Policy.
                    </Text>
                    {/* </TouchableOpacity> */}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={onPressSignupNew}
                  disabled={loader || isCtaDisabled()}
                  // onPress={() =>
                  // navigation.navigate('BusinessDetails', {
                  //   GSTIN: authData.gstNo || '12345678910',
                  //   companyName: authData.companyName || 'HINDUSTAN COPPER LTD',
                  //   tradeName: authData.tradeName || 'HINDUSTAN COPPER LTD',
                  //   email: authData.email || 'abc@gmail.com',
                  //   phoneNo: authData.phoneNumber || '999999999',
                  //   panNumber: authData.pan || '1234456abc098x765',
                  // })
                  // }
                  style={[
                    styles.loginBtn,
                    { backgroundColor: isCtaDisabled() ? '#B0B0B0' : '#0063A7' },
                  ]}>
                  {/* {loader ? (
                    <ActivityIndicator
                      style={styles.loader}
                      color={'#fff'}
                      size={'small'}
                    />
                  ) : null} */}
                  <Text
                    style={[styles.loginText, { marginLeft: loader ? 8 : 0 }]}>
                    Sign Up{' '}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.accountText}>
                    {' '}
                    Already have an Account ?{' '}
                    <Text
                      style={{
                        color: '#0063A7',
                        fontFamily: Dimension.CustomMediumFont,
                        fontWeight: '800',
                      }}>
                      Sign In
                    </Text>{' '}
                  </Text>
                </TouchableOpacity>
                <View style={styles.BottomTxtWrap}>
                  <Text style={styles.BottomTxt}>
                    © Copyrights {new Date().getFullYear()} Vedanta Metalbazaar
                  </Text>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </View>
    </View>
  );
};

export default SignUpScreen;
