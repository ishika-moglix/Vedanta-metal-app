import React, { useState, useEffect, useRef } from 'react';
import {
  StatusBar,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Dimension from '../Theme/Dimension';
import Colors from '../Theme/Colors';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FloatingLabelInputField from '../component/FloatingInput';
import { useDispatch, useSelector } from 'react-redux';
import {
  annualRegex,
  panRegex,
  phoneLengthChecker,
  phoneValidator,
} from '../constants';
import { emailRegex, tanRegex } from '../constants';
import { ScannerService } from '../services/scannerService';
import { setBusinessDetails } from '../redux/feature/businessDetailsSlice';
import { STATE_STATUS } from '../redux/constants';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Select from '../component/Select';
import CustomLoader from './customLoader';
const BusinessDetailsForm = props => {
  // console.log('props', props);

  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth?.data);
  const businessDetailsdata = useSelector(state => state.businessDetails?.data);
  const isRfc = authData?.userDetails?.rfc || false;
  const isRfcMain = authData?.rfcMain || false;
  const businessUnit = useSelector(state => state.auth?.data?.businessUnit);
  const [loader, setLoader] = useState(false);
  const [phoneNo, setPhoneNo] = useState(props?.route?.params?.phoneNo || '');

  const [altPhoneNo, setAltPhoneNo] = useState(
    authData?.userDetails?.altPhoneNumber || '',
  );
  const [email, setEmail] = useState(
    authData.userDetails?.email || authData?.email || '',
  );
  const [anyprod, setAnyProd] = useState('');
  const [tanNo, setTanNo] = useState(
    authData?.userDetails?.tan || businessDetailsdata?.tan || '',
  );
  const [tinNo, setTinNo] = useState(
    authData?.userDetails?.tinNumber || businessDetailsdata?.tinNumber || '',
  );
  const [companyName, setCompanyName] = useState(
    props?.route?.params?.companyName || '',
  );
  const [panNo, setPanNo] = useState(
    props?.route?.params?.panNumber || authData?.pan || '',
  );
  const [tradeName, setTradeName] = useState(
    props?.route?.params?.tradeName ||
    businessDetailsdata?.tradeName ||
    authData?.companyName ||
    authData?.userDetails?.tradeName ||
    '',
  );
  const [annualTro, setAnnualTro] = useState(
    businessDetailsdata?.annualTurnover ||
    authData?.userDetails?.annualTurnover ||
    0,
  );
  const [firstName, setFirstName] = useState(
    businessDetailsdata?.firstName ||
    authData?.userDetails?.firstName ||
    authData?.firstName ||
    '',
  );
  const [lastName, setLastName] = useState(
    businessDetailsdata?.secondName ||
    authData?.userDetails?.secondName ||
    authData?.secondName ||
    '',
  );
  const [gstinStatus, setGstinSTatus] = useState(authData?.gstStatus || '');
  const [businessNature, setBusinessNature] = useState(
    authData?.userDetails?.businessNature || authData?.businessNature || '',
  );
  const [regAddress, setRegAddressed] = useState(
    authData?.userDetails?.registeredAddress ||
    authData?.registeredAddress ||
    '',
  );
  const [remarks, setRemarks] = useState('');
  const [customerModal, setCustomerModal] = useState('');
  const [industryModal, setIndustryModal] = useState('');
  const [customerOption, setCustomerOption] = useState(
    businessDetailsdata?.customerGroupSAP ||
    authData?.userDetails?.customerGroupSAP ||
    '',
  );
  const [companyModal, setCompanyTypeModal] = useState(false);
  const [natureCompanyModal, setNatureCompanyModal] = useState(false);
  const [natureOfCompanyOption, setNatureOfComapnyOption] = useState(
    businessDetailsdata?.natureOfCompany ||
    authData?.userDetails?.natureOfCompany ||
    '',
  );
  const [campanyTypeOption, setCompanyTypeOption] = useState(
    businessDetailsdata?.companyType ||
    authData?.userDetails?.companyType ||
    '',
  );
  const [industryOption, setIndustryOption] = useState(
    businessDetailsdata?.industryIdSAP ||
    authData?.userDetails?.industryIdSAP ||
    '',
  );
  const [productQuantity, setProductQuantity] = useState(
    businessDetailsdata?.productQuantity,
    authData?.userDetails?.productQuantity,
  );
  const [companyType, setCompanyType] = useState(
    businessDetailsdata?.companyType ||
    authData?.userDetails?.companyType ||
    '',
  );
  const [panNoErrorMessage, setPanNoErrorMessage] = useState('');
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
  const [altPhoneErrorMessage, setAltPhoneErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [altphoneError, setAltPhoneError] = useState(false);
  const [panNoError, setPanNoError] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [annualError, setAnnualError] = useState('');
  const [annualErrorMessage, setAnnualErrorMessage] = useState('');
  const [buttonType, setButtonType] = useState('Save');
  const [rfcCase, setRfcCase] = useState(false);
  const [tanError, setTanError] = useState(false);
  const [tanErrorMessage, setTanErrorMessage] = useState('');
  const mapArray = [
    { id: 1, name: 'First Name' },
    { id: 2, name: 'Last Name' },
    { id: 3, name: 'Phone Number' },
    { id: 4, name: 'Alternate Phone Number' },
    // { id: 5, name: "PAN Number" },
    { id: 6, name: 'Billing and Shipping Address' },
    { id: 7, name: 'Bank Account No.' },
    { id: 8, name: 'Bank Name' },
    { id: 9, name: 'Branch' },
    { id: 10, name: 'IFSC Code' },
    { id: 11, name: 'PAN Card' },
    { id: 12, name: 'GST Certificate' },
    { id: 13, name: 'Company Registration Certificate' },
    { id: 14, name: 'Credit Profile' },
    { id: 15, name: 'Cancelled Cheque' },
    //{ id: 16, name: "Additional Documents" },
    { id: 17, name: 'TIN Number' },
    { id: 18, name: 'Annual Turnover' },
    { id: 19, name: 'Product Quantity' },
    { id: 20, name: 'Customer Group' },
    { id: 21, name: 'Industry Name' },
    { id: 22, name: 'Remarks' },
    { id: 23, name: 'Bank Key' },
    { id: 24, name: 'TAN Certificate' },
    { id: 26, name: 'Trade Name' },
    { id: 25, name: 'Company Type' },
    { id: 26, name: 'Trade Name' },
    { id: 27, name: 'Nature of Company' },
    { id: 28, name: 'Industry Type' },
    { id: 29, name: 'TAN Number' },
  ];

  // const openCustomerModal = () => {
  //   setCustomerModal(!customerModal);
  // };

  // const openIndustryModal = () => {
  //   setIndustryModal(!industryModal);
  // };

  // const openCompanyTypeModal = () => {
  //   setCompanyTypeModal(!companyModal);
  // };

  // const openNatureCompanyModal = () => {
  //   setNatureCompanyModal(!natureCompanyModal);
  // };

  // const closeNatureCompanyModal = () => {
  //   setNatureCompanyModal(false);
  // };
  // const openNatureCompanyModal = () => {
  //   setNatureCompanyModal(!natureCompanyModal);
  // };

  // const handleOptionSelect = option => {
  //   setCustomerOption(option);
  //   setCustomerModal(!customerModal);
  // };
  // const handleCompanyTypeSelect = option => {
  //   setCompanyTypeOption(option);
  //   setCompanyTypeModal(!companyModal);
  // };
  // const handleCompanyNatureSelect = option => {
  //   setNatureOfComapnyOption(option);
  //   setNatureCompanyModal(!natureCompanyModal);
  // };
  // const handleIndustryOptionSelect = option => {
  //   setIndustryOption(option);
  //   setIndustryModal(!industryModal);
  // };

  const rfcList = authData?.rfcList || [];

  const flatArray = rfcList.map(item => item.id);

  const isCtaDisabled = () => {
    const commonValidation =
      !(phoneNo?.trim()?.length === 10) ||
      !(firstName?.trim()?.length > 2) ||
      !(lastName?.trim()?.length > 2);

    let alumCase = false;
    if (businessUnit === 'Aluminium') {
      alumCase =
        !tradeName?.trim()?.length ||
        // !tinNo?.trim()?.length ||
        !tanNo?.trim()?.length ||
        !(annualTro > 0) ||
        annualError ||
        !customerOption ||
        !industryOption ||
        !panNo?.trim()?.length ||
        panNoError;
    }

    let copperCase = false;
    if (businessUnit === 'Copper') {
      copperCase = !regAddress?.trim()?.length || !businessNature;
    }
    let zincCase = false;
    if (businessUnit === 'Zinc') {
      zincCase =
        !tradeName?.trim()?.length ||
        !campanyTypeOption ||
        !natureOfCompanyOption;
    }
    return commonValidation || alumCase || copperCase || zincCase;
  };

  console.log('...', annualTro, annualTro > 0);

  // const isCtaDisabled = () => {
  //   const val =
  //     !(phoneNo?.trim()?.length == 10) ||
  //     !firstNmae?.trim()?.length > 2 ||
  //     !lastName?.trim()?.length > 2;

  //     if(businessUnit === 'Aluminium'){
  //   const alumCase =
  //     !tradeName.trim().length ||
  //     !tinNo.trim().length ||
  //     !tan.trim().length ||
  //     !annualTro.trim().length ||
  //     !customerOption ||
  //     !industryOption ||
  //     !pan.trim().length;}

  //     if(businessUnit === 'Copper'){
  //   const copperCase = !regAddress.trim().length || !natureOfCompanyOption;
  //     }
  //   return (val && copperCase) || (val && alumCase);
  // };

  useEffect(() => {
    if (Object.keys(businessDetailsdata ?? {})?.length > 0) {
      setIsFormDisabled(true);
      props.onSave(true);
      props.onEnable(1);
    } else {
      if (
        businessUnit === 'Aluminium' &&
        authData?.gstNO &&
        authData?.companyName &&
        authData?.userDetails?.secondName &&
        authData?.userDetails?.firstName &&
        authData?.userDetails?.email &&
        authData?.userDetails?.phoneNumber &&
        authData?.userDetails?.tradeName &&
        // authData?.userDetails?.tinNumber &&
        authData?.userDetails?.tan &&
        authData?.userDetails?.annualTurnover &&
        authData?.userDetails?.customerGroupSAP &&
        authData?.userDetails?.industryIdSAP &&
        authData?.userDetails?.pan
      ) {
        setIsFormDisabled(true);
        props.onSave(true);
        props.onEnable(1);
      } else if (
        businessUnit === 'Copper' &&
        authData?.gstNO &&
        authData?.companyName &&
        authData?.userDetails?.secondName &&
        authData?.userDetails?.firstName &&
        authData?.userDetails?.email &&
        authData?.userDetails?.phoneNumber &&
        authData?.userDetails?.businessNature &&
        authData?.userDetails?.registeredAddress
      ) {
        setIsFormDisabled(true);
        props.onSave(true);
        props.onEnable(1);
      } else if (
        businessUnit === 'Zinc' &&
        authData?.gstNO &&
        authData?.companyName &&
        authData?.userDetails?.secondName &&
        authData?.userDetails?.firstName &&
        authData?.userDetails?.email &&
        authData?.userDetails?.phoneNumber &&
        authData?.userDetails?.companyType &&
        authData?.userDetails?.tradeName &&
        authData?.userDetails?.natureOfCompany
      ) {
        setIsFormDisabled(true);
        props.onSave(true);
        props.onEnable(1);
      } else {
        setIsFormDisabled(false);
        props.onSave(false);
      }
    }
  }, [authData]);

  console.log('businessdata', businessDetailsdata);

  useEffect(() => {
    if (annualTro > 0 && annualRegex.test(annualTro)) {
      setAnnualError(false);
      setAnnualErrorMessage('');
    } else {
      if (annualTro == 0) {
        setAnnualError(false);
        setAnnualErrorMessage('');
      } else {
        setAnnualError(true);
        setAnnualErrorMessage('Please enter only numbers.');
      }
    }
  }, [annualTro]);
  useEffect(() => {
    const validatePhoneNumber = (phone, setError, setErrorMessage) => {
      if (phone.length === 0) {
        setError(false);
      } else if (phone) {
        if (!phoneLengthChecker(phone)) {
          setError(true);
          setErrorMessage('Mobile number must be 10 digits');
        } else if (!phoneValidator(phone)) {
          setError(true);
          setErrorMessage('Please enter a valid mobile number');
        } else {
          setError(false);
        }
      }
    };
    validatePhoneNumber(phoneNo, setPhoneError, setPhoneErrorMessage);
    validatePhoneNumber(altPhoneNo, setAltPhoneError, setAltPhoneErrorMessage);
  }, [phoneNo, altPhoneNo]);

  useEffect(() => {
    if (panNo && panNo?.match(panRegex)) {
      setPanNoError(false);
    } else {
      if (!panNo?.length) {
        setPanNoErrorMessage('');
        setPanNoError(false);
      } else {
        setPanNoError(true);
        setPanNoErrorMessage('Please enter a valid pan number.');
      }
    }
  }, [panNo]);

  useEffect(() => {
    if (tanNo && tanNo.match(tanRegex)) {
      setTanError(false);
    } else {
      if (tanNo.length == 0) {
        setTanError(false);
        setTanErrorMessage('');
      } else {
        setTanError(true);
        setTanErrorMessage('Please enter a valid tan number.');
      }
    }
  }, [tanNo]);

  const isIdPresent = id => {
    return flatArray.includes(id);
  };
  console.log(isIdPresent(1), rfcCase, isRfc);

  const handleSave = async () => {
    // console.log(isRfc, isFormDisabled, isCtaDisabled());

    if (isFormDisabled && !isRfc) {
      setIsFormDisabled(false);
      props.onSave(false);
    } else {
      if (!isCtaDisabled()) {
        // setIsFormDisabled(true);
        try {
          props.loader(true);
          // setLoader(true);
          const data = await ScannerService.saveBusinessDetails({
            gstStatus: authData?.userDetails?.gstStatus || '',
            businessNature: authData?.userDetails?.businessNature || '',
            registeredAddress:
              authData?.userDetails?.registeredAddress || regAddress || '',
            firstName: firstName,
            secondName: lastName,
            email: authData?.userDetails?.email || email || '',
            phoneNumber: phoneNo,
            altPhoneNumber: altPhoneNo,
            pan: authData?.userDetails?.pan || panNo || '',
            tan: tanNo,
            tinNumber: tinNo,
            annualTurnover: annualTro,
            customerGroupSAP: customerOption,
            industryIdSAP: industryOption,
            companyType: campanyTypeOption || '',
            tradeName: tradeName,
            natureOfCompany:
              natureOfCompanyOption ||
              authData?.userDetails?.businessNature ||
              '',
            industryType: authData?.userDetails?.industryType,
            productQuantity: productQuantity,
            remarks: remarks,
            companyId: authData?.companyId,
            branchId: authData?.branchId,
            countryCode: '91',
            businessUnit: businessUnit,
          });
          if (data?.data?.successful) {
            await AsyncStorage.setItem(
              'rfcCase_BusinessDetails',
              JSON.stringify(true),
            );
            setIsFormDisabled(true);
            setRfcCase(true);
            props.loader(false);
            // setLoader(false);
            Toast.show({
              type: 'success',
              text2:
                data?.data?.message || 'Business Details Saved Successfully',
              visibilityTime: 4000,
              autoHide: true,
            });

            props.onSave(true);
            props.onEnable(1);
            // storeData(data?.data?.data);
            dispatch(
              setBusinessDetails({
                status: STATE_STATUS.FETCHED,
                data: data?.data?.data,
              }),
            );
          } else {
            props.loader(false);
            // setLoader(false);
            Toast.show({
              type: 'error',
              text2: data?.data?.message,
              visibilityTime: 4000,
              autoHide: true,
            });
          }
        } catch (e) {
          console.log(e);
          props.loader(false);
          // setLoader(false);
        }
      }
    }
  };

  const checkRfcCase = async () => {
    const savedRfcCase = await AsyncStorage.getItem('rfcCase_BusinessDetails');

    if (savedRfcCase !== null) {
      setRfcCase(JSON.parse(savedRfcCase));
    }
  };

  useEffect(() => {
    checkRfcCase();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: 20 }}>
      {/* {!loader && (
        <CustomLoader fullScreen />
      )} */}
      <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
        <View
          style={{
            backgroundColor: '#fff',
            alignContent: 'center',
            borderRadius: 5,
            borderColor: '#EBEBEB',
            borderWidth: 1,
            //   padding: 15,
            paddingBottom: 60,
            // paddingTop: 10,
            paddingHorizontal: 15,
            // marginTop: 20,
          }}>
          <Text
            style={{
              color: '#000000',
              fontSize: 14,
              fontWeight: '600',
              marginBottom: Dimension.margin5,
              marginTop: Dimension.margin15,
            }}>
            Business Details
          </Text>
          <Text
            style={{
              color: '#727272',
              fontSize: 10,
              fontWeight: '600',
              marginBottom: Dimension.margin8,
              // marginTop: Dimension.margin5,
            }}>
            Please keep your company documents handy to upload in the next page.
          </Text>
          {isRfc ? (
            !rfcCase && (
              <TouchableOpacity
                onPress={handleSave}
                style={[
                  styles.loginBtn,
                  { backgroundColor: isCtaDisabled() ? '#ccc' : '#0063A7' },
                ]}
                disabled={!isFormDisabled && isCtaDisabled()}>
                <View style={styles.row}>
                  {/* {loader ? (
                    <ActivityIndicator
                      style={styles.loader}
                      color={'#fff'}
                      size={'small'}
                    />
                  ) : null} */}
                  <Text
                    style={[
                      styles.loginText,
                      { color: '#fff', marginLeft: loader ? 8 : 0 },
                    ]}>
                    Save
                  </Text>
                </View>
              </TouchableOpacity>
            )
          ) : isRfcMain ? (
            ''
          ) : (
            <TouchableOpacity
              onPress={handleSave}
              disabled={!isFormDisabled && isCtaDisabled()}
              style={[
                styles.loginBtn,
                { backgroundColor: isCtaDisabled() ? '#ccc' : '#0063A7' },
              ]}>
              <View style={styles.row}>
                {loader ? (
                  <ActivityIndicator
                    style={styles.loader}
                    color={'#fff'}
                    size={'small'}
                  />
                ) : null}
                <Text
                  style={[
                    styles.loginText,
                    { color: '#FFF', marginLeft: loader ? 8 : 0 },
                  ]}>
                  {isFormDisabled ? 'Edit' : 'Save'}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity
            onPress={handleSave}
            disabled={!isFormDisabled && isCtaDisabled()}
            style={[
              styles.loginBtn,
              {backgroundColor: isCtaDisabled() ? '#ccc' : '#0063A7'},
            ]}>
            <View style={styles.row}>
              {loader ? (
                <ActivityIndicator
                  style={styles.loader}
                  color={'#fff'}
                  size={'small'}
                />
              ) : null}
              <Text
                style={[
                  styles.loginText,
                  {color: '#FFF', marginLeft: loader ? 8 : 0},
                ]}>
                  
                {isRfc  ? 'Save' : isFormDisabled ? 'Edit' : 'Save'}
                {/* {rfcCase ? 'Save' : null} 
              </Text>
            </View>
          </TouchableOpacity> */}

          {/* <TouchableOpacity
          onPress={handleSave}
          disabled={isFormDisabled ? false : isCtaDisabled()}
          style={[
            styles.loginBtn,
            {backgroundColor: isCtaDisabled() ? '#ccc' : '#0063A7'},
          ]}>
          <Text style={[styles.loginText, {color: '#FFF'}]}>
            {isFormDisabled ? 'Edit' : 'Save'}
            
          </Text>
        </TouchableOpacity> */}
          <View style={styles.inputView}>
            <FloatingLabelInputField
              label={' GSTIN* '}
              value={props?.route?.params?.GSTIN}
              editable={false}
              textStyle={{
                backgroundColor: '#EAEAEA',
              }}
            />
          </View>

          <View style={styles.inputView}>
            <FloatingLabelInputField
              label={' Company Name* '}
              value={companyName}
              editable={false}
              textStyle={{
                backgroundColor: '#EAEAEA',
              }}
            />
          </View>
          {businessUnit === 'Zinc' && (
            <>
              <Select
                selectedValue={campanyTypeOption}
                label={' Company Type* '}
                placeHolder="Select"
                onChange={val => setCompanyTypeOption(val)}
                fromDD={false}
                options={[
                  {
                    value: 'Proprietorship Firm',
                    label: 'Proprietorship Firm',
                  },
                  {
                    value: 'Partnership Firm',
                    label: 'Partnership Firm',
                  },
                  {
                    value: 'Private Limited',
                    label: 'Private Limited',
                  },
                  {
                    value: 'Public Limited',
                    label: 'Public Limited',
                  },
                  {
                    value: 'Other',
                    label: 'Other',
                  },
                ]}
                containerStyle={{
                  borderColor: !campanyTypeOption ? '#cbcbcb' : '#0063a7',
                  backgroundColor: isRfc
                    ? !rfcCase
                      ? !isIdPresent(25)
                        ? '#EAEAEA'
                        : '#FFF'
                      : '#EAEAEA'
                    : isFormDisabled
                      ? '#EAEAEA'
                      : '#FFF',
                }}
                disabled={
                  isRfc ? (!rfcCase ? !isIdPresent(25) : true) : isFormDisabled
                }
              />
            </>
          )}

          {businessUnit === 'Aluminium' || businessUnit === 'Zinc' ? (
            <View style={styles.inputView}>
              <FloatingLabelInputField
                label={' Trade Name* '}
                onChangeText={val => setTradeName(val)}
                value={tradeName}
                editable={
                  isRfc ? (!rfcCase ? isIdPresent(26) : false) : !isFormDisabled
                }
                // editable={!isFormDisabled}
                textStyle={{
                  backgroundColor: isRfc
                    ? !rfcCase
                      ? !isIdPresent(26)
                        ? '#EAEAEA'
                        : '#FFF'
                      : '#EAEAEA'
                    : isFormDisabled
                      ? '#EAEAEA'
                      : '#FFF',
                }}
              />
            </View>
          ) : null}
          {businessUnit === 'Aluminium' && (
            <>
              <View style={styles.inputView}>
                <FloatingLabelInputField
                  // placeholder={'Enter Designation'}
                  label={' TIN Number '}
                  onChangeText={val => setTinNo(val)}
                  value={tinNo}
                  editable={
                    isRfc
                      ? !rfcCase
                        ? isIdPresent(17)
                        : false
                      : !isFormDisabled
                  }
                  // editable={!isFormDisabled}
                  textStyle={{
                    backgroundColor: isRfc
                      ? !rfcCase
                        ? !isIdPresent(17)
                          ? '#EAEAEA'
                          : '#FFF'
                        : '#EAEAEA'
                      : isFormDisabled
                        ? '#EAEAEA'
                        : '#FFF',
                  }}
                //maxLength={10}
                //keyboardType=""
                />
              </View>

              <View style={styles.inputView}>
                <FloatingLabelInputField
                  // placeholder={'Enter Phone Number'}
                  label={' TAN Number* '}
                  onChangeText={val => setTanNo(val)}
                  value={tanNo}
                  editable={
                    isRfc
                      ? !rfcCase
                        ? isIdPresent(29)
                        : false
                      : !isFormDisabled
                  }
                  // editable={!isFormDisabled}
                  textStyle={{
                    backgroundColor: isRfc
                      ? !rfcCase
                        ? !isIdPresent(29)
                          ? '#EAEAEA'
                          : '#FFF'
                        : '#EAEAEA'
                      : isFormDisabled
                        ? '#EAEAEA'
                        : '#FFF',
                  }}
                />
              </View>
              {tanError && (
                <Text style={styles.errorText}>{tanErrorMessage}</Text>
              )}
              <View style={styles.inputView}>
                <FloatingLabelInputField
                  // placeholder={'Enter Phone OTP'}
                  label={' Annual Turnover(Cr.)* '}
                  onChangeText={val => setAnnualTro(val)}
                  value={annualTro}
                  editable={
                    isRfc
                      ? !rfcCase
                        ? isIdPresent(18)
                        : false
                      : !isFormDisabled
                  }
                  // editable={!isFormDisabled}
                  keyboardType="number-pad"
                  textStyle={{
                    backgroundColor: isRfc
                      ? !rfcCase
                        ? !isIdPresent(18)
                          ? '#EAEAEA'
                          : '#FFF'
                        : '#EAEAEA'
                      : isFormDisabled
                        ? '#EAEAEA'
                        : '#FFF',
                  }}
                //maxLength={10}
                //keyboardType=""
                />
              </View>
              {annualError && (
                <Text style={styles.errorText}>{annualErrorMessage}</Text>
              )}
              <View style={styles.inputView}>
                <FloatingLabelInputField
                  // placeholder={'Enter Email'}
                  label={' Product Quantity '}
                  onChangeText={val => setProductQuantity(val)}
                  value={productQuantity}
                  keyboardType="number-pad"
                  editable={
                    isRfc
                      ? !rfcCase
                        ? isIdPresent(19)
                        : false
                      : !isFormDisabled
                  }
                  // editable={!isFormDisabled}
                  textStyle={{
                    backgroundColor: isRfc
                      ? !rfcCase
                        ? !isIdPresent(19)
                          ? '#EAEAEA'
                          : '#FFF'
                        : '#EAEAEA'
                      : isFormDisabled
                        ? '#EAEAEA'
                        : '#FFF',
                  }}
                />
              </View>
              <Select
                selectedValue={customerOption}
                label={' Customer Group* '}
                placeHolder="Select"
                onChange={val => setCustomerOption(val)}
                options={[
                  { label: 'OEM', value: 'OEM' },
                  { label: 'Government', value: 'Government' },
                  { label: 'Dealer/Trader', value: 'Dealer/Trader' },
                  { label: 'Channel Partner', value: 'Channel Partner' },
                  { label: 'MSME', value: 'MSME' },
                ]}
                containerStyle={{
                  borderColor: !customerOption ? '#cbcbcb' : '#0063a7',
                  backgroundColor: isRfc
                    ? !rfcCase
                      ? !isIdPresent(20)
                        ? '#EAEAEA'
                        : '#FFF'
                      : '#EAEAEA'
                    : isFormDisabled
                      ? '#EAEAEA'
                      : '#FFF',
                  // backgroundColor: isFormDisabled ? '#EAEAEA' : '#fff',
                }}
                disabled={
                  isRfc ? (!rfcCase ? !isIdPresent(20) : true) : isFormDisabled
                }
              />
              {/* <TouchableOpacity
                onPress={openCustomerModal}
                activeOpacity={0.7}
                disabled={
                  isRfc ? (!rfcCase ? !isIdPresent(20) : true) : isFormDisabled
                }>
                <View
                  style={[
                    styles.inputViews,
                    {
                      borderColor: !customerOption ? '#cbcbcb' : '#0063a7',
                      backgroundColor: isRfc
                        ? !rfcCase
                          ? !isIdPresent(20)
                            ? '#EAEAEA'
                            : '#FFF'
                          : '#EAEAEA'
                        : isFormDisabled
                        ? '#EAEAEA'
                        : '#FFF',
                      // backgroundColor: isFormDisabled ? '#EAEAEA' : '#fff',
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        position: 'absolute',
                        left: 0,
                        top: -5,
                        fontSize: Dimension.font12,
                        color: '#A5A5A5',
                        marginLeft: Dimension.margin10,
                        zIndex: 9,
                        backgroundColor: '#FFF',
                        zIndex: 2,
                        fontFamily: Dimension.CustomSemiBoldFont,
                      },
                    ]}>
                    {' '}
                    Customer Group*{' '}
                  </Text>
                  <TextInput
                    value={customerOption}
                    placeholder="Customer Group*"
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
              </TouchableOpacity> */}
              {/* {customerModal && (
                <View
                  style={[
                    {
                      borderWidth: 1,
                      flex: 1,
                      borderTopWidth: 0,
                      borderColor: '#AFAFAF',
                      backgroundColor: '#fff',
                      maxHeight: Dimension.height221,
                      width: 258,
                      zIndex: 100000000,
                      position: 'absolute',
                      elevation: 16,
                      // alignSelf: "center",
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: Dimension.responsiveValue12,
                      },
                      shadowOpacity: 0.58,
                      shadowRadius: 16.0,
                    },
                    {
                      top: Dimensions.get('window').height * 0.85,
                      left: Dimension.padding20,
                    },
                  ]}>
                  <Text style={[styles.option, {marginLeft: 10}]}>Select</Text>
                  <TouchableOpacity onPress={() => handleOptionSelect('OEM')}>
                    <Text style={[styles.option, {marginLeft: 10}]}>OEM</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleOptionSelect('Government')}>
                    <Text style={[styles.option, {marginLeft: 10}]}>
                      Government
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleOptionSelect('Dealer/Trader')}>
                    <Text style={[styles.option, {marginLeft: 10}]}>
                      Dealer/Trader
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleOptionSelect('Channel partner')}>
                    <Text style={[styles.option, {marginLeft: 10}]}>
                      Channel partner
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleOptionSelect('MSME')}>
                    <Text style={[styles.option, {marginLeft: 10}]}>MSME</Text>
                  </TouchableOpacity>
                </View>
              )} */}

              <Select
                selectedValue={industryOption}
                label={' Industry Name* '}
                placeHolder="Select"
                onChange={val => setIndustryOption(val)}
                options={[
                  { label: 'Industry', value: 'Industry' },
                  { label: 'Tech Consultancy', value: 'Tech Consultancy' },
                  // {label: 'Dealer/Trader', value: 'Dealer/Trader'},
                  { label: 'Electrical', value: 'Electrical' },
                  { label: 'Transport', value: 'Transport' },
                  { label: 'Consumer Durables', value: 'Consumer Durables' },
                  { label: 'Packaging', value: 'Packaging' },
                  {
                    label: 'Building & Construct',
                    value: 'Building & Construct',
                  },
                  { label: 'Industrial', value: 'Industrial' },
                  { label: 'Extrusion', value: 'Extrusion' },
                  { label: 'Dealers/Others', value: 'Dealers/Others' },
                  {
                    label: 'Defense/Paramilitary',
                    value: 'Defense/Paramilitary',
                  },
                  { label: 'Education/ Teaching', value: 'Education/ Teaching' },
                  { label: 'Engg / Machinery', value: 'Engg / Machinery' },
                  { label: 'Export/ Import', value: 'Export/ Import' },
                  { label: 'Automobile', value: 'Automobile' },
                  { label: 'Mining', value: 'Mining' },
                  { label: 'Non-Ferrous Metal', value: 'Non-Ferrous Metal' },
                  { label: 'Oil/Gas/Refinery', value: 'Oil/Gas/Refinery' },
                  { label: 'Power', value: 'Power' },
                  { label: 'Steel/Icon', value: 'Steel/Icon' },
                  { label: 'Aviation', value: 'Aviation' },
                  { label: 'Telecom', value: 'Telecom' },
                  { label: 'Transportation', value: 'Transportation' },
                  { label: 'Others', value: 'Others' },
                  { label: 'CONDUCTORS', value: 'CONDUCTORS' },
                  { label: 'TRANSFORMERS', value: 'TRANSFORMERS' },
                  { label: 'CABLES', value: 'CABLES' },
                  { label: 'COOKWARE', value: 'COOKWARE' },
                  { label: 'METAL POWDER', value: 'METAL POWDER' },
                  { label: 'CASTINGS', value: 'CASTINGS' },
                  { label: 'Chemical / Pharma', value: 'Chemical / Pharma' },
                  { label: 'Construction', value: 'Construction' },
                  { label: 'Electronic', value: 'Electronic' },
                  { label: 'Energy', value: 'Energy' },
                  { label: 'Engineering', value: 'Engineering' },
                  { label: 'Oil Exploration', value: 'Oil Exploration' },
                  { label: 'Financial Services', value: 'Financial Services' },
                  { label: 'Government', value: 'Government' },
                ]}
                containerStyle={{
                  borderColor: !industryOption ? '#cbcbcb' : '#0063a7',
                  backgroundColor: isRfc
                    ? !rfcCase
                      ? !isIdPresent(21)
                        ? '#EAEAEA'
                        : '#FFF'
                      : '#EAEAEA'
                    : isFormDisabled
                      ? '#EAEAEA'
                      : '#FFF',
                  // backgroundColor: isFormDisabled ? '#EAEAEA' : '#fff',
                }}
                disabled={
                  isRfc ? (!rfcCase ? !isIdPresent(21) : true) : isFormDisabled
                }
              />

              {/* <TouchableOpacity
                onPress={openIndustryModal}
                activeOpacity={0.7}
                disabled={
                  isRfc ? (!rfcCase ? !isIdPresent(21) : true) : isFormDisabled
                }>
                <View
                  style={[
                    styles.inputViews,
                    {
                      borderColor: !industryOption ? '#cbcbcb' : '#0063a7',
                      backgroundColor: isRfc
                        ? !rfcCase
                          ? !isIdPresent(21)
                            ? '#EAEAEA'
                            : '#FFF'
                          : '#EAEAEA'
                        : isFormDisabled
                        ? '#EAEAEA'
                        : '#FFF',
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        position: 'absolute',
                        left: 0,
                        top: -5,
                        fontSize: Dimension.font12,
                        color: '#A5A5A5',
                        marginLeft: Dimension.margin10,
                        zIndex: 9,
                        backgroundColor: '#FFF',
                        zIndex: 2,
                        fontFamily: Dimension.CustomSemiBoldFont,
                      },
                    ]}>
                    {' '}
                    Industry Name*{' '}
                  </Text>
                  <TextInput
                    value={industryOption}
                    placeholder="Industry Name*"
                    style={[styles.inputFields]}
                    editable={false}
                  />
                  <MaterialCommunityIcon
                    name={'menu-down'}
                    size={22}
                    color={'#000'}
                    style={styles.iconStyles}
                  />
                </View>
              </TouchableOpacity> */}
              {/* {industryModal && (
                <TouchableWithoutFeedback onPressIn={Keyboard.dismiss}>
                  <View
                    style={[
                      {
                        borderWidth: 1,
                        flex: 1,
                        borderTopWidth: 0,
                        borderColor: '#AFAFAF',
                        backgroundColor: '#fff',
                        maxHeight: Dimension.height221,
                        width: 260,
                        zIndex: 100000000,
                        position: 'absolute',
                        elevation: 16,
                        // alignSelf: "center",
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: Dimension.responsiveValue12,
                        },
                        shadowOpacity: 0.58,
                        shadowRadius: 16.0,
                      },
                      {
                        top: Dimensions.get('window').height * 0.93,
                        left: Dimension.padding20,
                      },
                    ]}>
                    <ScrollView
                      nestedScrollEnabled={true}
                      contentContainerStyle={{paddingVertical: 10}}>
                      <Text style={[styles.option, {marginLeft: 10}]}>
                        Select
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleIndustryOptionSelect('Industry')}>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Industry
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Tech Consultancy')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Tech Consultancy
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Dealer/Trader')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Dealer/Trader
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Electrical')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Electrical
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleIndustryOptionSelect('Transport')}>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Transport
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Consumer Durables')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Consumer Durables
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleIndustryOptionSelect('Packaging')}>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Packaging
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Building & Construcy')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Building & Construcy
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Industrial')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Industrial
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleIndustryOptionSelect('Extrusion')}>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Extrusion
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Dealers/Others')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Dealers/Others
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Defense/Paramilitary')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Defense/Paramilitary
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Education/ Teaching')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Education/ Teaching
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect(' Engg / Machinary')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Engg / Machinary
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Export/ Import')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Export/ Import
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Automobile')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Automobile
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleIndustryOptionSelect('Mining')}>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Mining
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Non-Ferrous Metal')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Non-Ferrous Metal
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Oil/Gas/Refinery')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Oil/Gas/Refinery
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleIndustryOptionSelect('Power')}>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Power
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Steel/Icon')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Steel/Icon
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleIndustryOptionSelect('Aviation')}>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Aviation
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleIndustryOptionSelect('Telecom')}>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Telecom
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Transportation')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Transportation
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleIndustryOptionSelect('Others')}>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Others
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('CONDUCTORS')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          CONDUCTORS
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('TRANSFORMERS')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          TRANSFORMERS
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleIndustryOptionSelect('CABLES')}>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          CABLES
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleIndustryOptionSelect('COOKWARE')}>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          COOKWARE
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('METAL POWDER')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          METAL POWDER
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleIndustryOptionSelect('CASTING')}>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          CASTING
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect(' Chemical / Pharma')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Chemical / Pharma
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Construction')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Construction
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Electronic')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Electronic
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleIndustryOptionSelect('Energy')}>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Energy
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Engineering')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Engineering
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Oil Exploration')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Oil Exploration
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Financial Services')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Financial Services
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleIndustryOptionSelect('Government')
                        }>
                        <Text style={[styles.option, {marginLeft: 10}]}>
                          Government
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                </TouchableWithoutFeedback>
              )} */}
              {/* </View>  */}
            </>
          )}

          {businessUnit === 'Copper' && (
            <>
              <View style={styles.inputView}>
                <FloatingLabelInputField
                  label={' GSTIN / UIN Status* '}
                  value={gstinStatus}
                  // editable={isIdPresent(29)}
                  editable={false}
                  textStyle={{
                    backgroundColor: '#EAEAEA',
                  }}
                />
              </View>
              <View style={styles.inputView}>
                <FloatingLabelInputField
                  label={' Nature of Core Business Activity* '}
                  onChangeText={val => setBusinessNature(val)}
                  value={businessNature}
                  editable={false}
                  textStyle={{
                    backgroundColor: '#EAEAEA',
                  }}
                //editable={isRfc ? false : !isFormDisabled}
                // textStyle={{
                //   backgroundColor: isRfc
                //     ? '#EAEAEA'
                //     : isFormDisabled
                //     ? '#EAEAEA'
                //     : '#fff',
                // }}
                />
              </View>
              <View style={styles.inputView}>
                <FloatingLabelInputField
                  // placeholder={'Enter Name'}
                  label={' Registered Address* '}
                  onChangeText={val => setRegAddressed(val)}
                  value={regAddress}
                  editable={false}
                  textStyle={{
                    backgroundColor: '#EAEAEA',
                  }}
                // editable={isRfc ? false : !isFormDisabled}
                // textStyle={{
                //   backgroundColor: isRfc
                //     ? '#EAEAEA'
                //     : isFormDisabled
                //     ? '#EAEAEA'
                //     : '#fff',
                // }}
                />
              </View>
            </>
          )}

          {businessUnit === 'Zinc' && (
            <Select
              selectedValue={natureOfCompanyOption}
              label={' Nature of Company* '}
              placeHolder="Select"
              onChange={val => setNatureOfComapnyOption(val)}
              options={[
                {
                  value: 'End User',
                  label: 'End User',
                },
                {
                  value: 'Trader',
                  label: 'Trader',
                },
                {
                  value: 'Other',
                  label: 'Other',
                },
              ]}
              containerStyle={{
                borderColor: !natureOfCompanyOption ? '#cbcbcb' : '#0063a7',
                backgroundColor: isRfc
                  ? !rfcCase
                    ? !isIdPresent(27)
                      ? '#EAEAEA'
                      : '#FFF'
                    : '#EAEAEA'
                  : isFormDisabled
                    ? '#EAEAEA'
                    : '#FFF',
              }}
              disabled={
                isRfc ? (!rfcCase ? !isIdPresent(27) : true) : isFormDisabled
              }
            />
            // <TouchableOpacity
            //   onPress={openNatureCompanyModal}
            //   activeOpacity={0.7}
            //   disabled={
            //     isRfc ? (!rfcCase ? !isIdPresent(27) : true) : isFormDisabled
            //   }>
            //   {/* disabled={isIdPresent(27)}> */}
            //   {/* disabled={isFormDisabled}> */}
            //   <View
            //     style={[
            //       styles.inputViews,
            //       {
            //         borderColor: !natureOfCompanyOption ? '#cbcbcb' : '#0063a7',
            //         backgroundColor: isRfc
            //           ? !rfcCase
            //             ? !isIdPresent(27)
            //               ? '#EAEAEA'
            //               : '#FFF'
            //             : '#EAEAEA'
            //           : isFormDisabled
            //           ? '#EAEAEA'
            //           : '#FFF',
            //       },
            //     ]}>
            //     <Text
            //       style={{
            //         position: 'absolute',
            //         left: 0,
            //         top: -5,
            //         fontSize: Dimension.font12,
            //         color: '#A5A5A5',
            //         marginLeft: Dimension.margin10,
            //         backgroundColor: '#FFF',
            //         fontFamily: Dimension.CustomSemiBoldFont,
            //       }}>
            //       {' '}
            //       Nature of Company*{' '}
            //     </Text>
            //     <TextInput
            //       value={natureOfCompanyOption}
            //       style={styles.inputFields}
            //       editable={false}
            //     />
            //     <MaterialCommunityIcon
            //       name="menu-down"
            //       size={22}
            //       color="#000"
            //       style={styles.iconStyles}
            //     />
            //   </View>
            // </TouchableOpacity>
          )}

          {/* <View style={styles.inputView}> */}
          {/* <FloatingLabelInputField
                label={' Nature of Company* '}
                value={natureOfCompanyOption}
                // editable={!isFormDisabled}
                textStyle={{
                  fontSize: Dimension.font14,
                  fontFamily: Dimension.CustomRegularFont,
                  borderWidth: 1,
                  borderRightWidth: 0,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  backgroundColor: isFormDisabled ? '#EAEAEA' : '#fff',
                }}
                editable={false}
                buttonEnabled
                buttonComponent={
                  <TouchableOpacity
                    onPress={openNatureCompanyModal}
                    disabled={isFormDisabled}
                    style={{
                      backgroundColor: '#fff',
                      paddingVertical: 8,
                      borderRadius: 5,
                    }}>
                    <MaterialCommunityIcon
                      name={'menu-down'}
                      size={22}
                      color={'#000'}
                    />
                  </TouchableOpacity>
                }
              /> */}
          {/* {natureCompanyModal && (
            <View
              style={[
                {
                  borderWidth: 1,
                  flex: 1,
                  borderTopWidth: 0,
                  borderColor: '#AFAFAF',
                  backgroundColor: '#fff',
                  maxHeight: Dimension.height221,
                  width: 258,
                  zIndex: 100000000,
                  position: 'absolute',
                  elevation: 16,
                  // alignSelf: "center",
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: Dimension.responsiveValue12,
                  },
                  shadowOpacity: 0.58,
                  shadowRadius: 16.0,
                },
                {
                  top: Dimensions.get('window').height * 0.59,
                  left: Dimension.padding20,
                },
              ]}>
              <Text style={[styles.option, {marginLeft: 10}]}>Select</Text>
              <TouchableOpacity
                onPress={() =>
                  handleCompanyNatureSelect('Proprietorship Firm')
                }>
                <Text style={[styles.option, {marginLeft: 10}]}>
                  Proprietorship Firm
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleCompanyNatureSelect('Partnership Firm')}>
                <Text style={[styles.option, {marginLeft: 10}]}>
                  Partnership Firm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCompanyNatureSelect('Private Limited')}>
                <Text style={[styles.option, {marginLeft: 10}]}>
                  Private Limited
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleCompanyNatureSelect('Public Limited')}>
                <Text style={[styles.option, {marginLeft: 10}]}>
                  Public Limited
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCompanyNatureSelect('Other')}>
                <Text style={[styles.option, {marginLeft: 10}]}>Other</Text>
              </TouchableOpacity>
            </View>
          )} */}

          {/* </View>
          )} */}
          <View style={styles.inputView}>
            <FloatingLabelInputField
              label={' First Name* '}
              onChangeText={val => {
                const trimmedVal = val.replace(/\s/g, '');
                setFirstName(trimmedVal);
              }}
              //onChangeText={val => setFirstName(val)}
              value={firstName}
              editable={
                isRfc ? (!rfcCase ? isIdPresent(1) : false) : !isFormDisabled
              }
              // editable={!isFormDisabled}
              textStyle={{
                backgroundColor: isRfc
                  ? !rfcCase
                    ? !isIdPresent(1)
                      ? '#EAEAEA'
                      : '#FFF'
                    : '#EAEAEA'
                  : isFormDisabled
                    ? '#EAEAEA'
                    : '#FFF',
              }}
            />
          </View>

          <View style={styles.inputView}>
            <FloatingLabelInputField
              // placeholder={'Enter Confirm Password'}
              label={' Last Name* '}
              onChangeText={val => {
                const trimmedVal = val.replace(/\s/g, '');
                setLastName(trimmedVal);
              }}
              // onChangeText={val => setLastName(val)}
              value={lastName}
              editable={
                isRfc ? (!rfcCase ? isIdPresent(2) : false) : !isFormDisabled
              }
              // editable={!isFormDisabled}
              textStyle={{
                backgroundColor: isRfc
                  ? !rfcCase
                    ? !isIdPresent(2)
                      ? '#EAEAEA'
                      : '#FFF'
                    : '#EAEAEA'
                  : isFormDisabled
                    ? '#EAEAEA'
                    : '#FFF',
              }}
            //maxLength={10}
            //keyboardType=""
            />
          </View>

          <View style={styles.inputView}>
            <FloatingLabelInputField
              // placeholder={'Enter Password'}
              label={' Email* '}
              value={email}
              editable={false}
              textStyle={{
                backgroundColor: '#EAEAEA',
              }}
            />
          </View>

          <View style={styles.inputView}>
            <FloatingLabelInputField
              label={' Phone No.* '}
              onChangeText={val => setPhoneNo(val)}
              value={phoneNo}
              keyboardType="number-pad"
              maxLength={10}
              editable={
                isRfc ? (!rfcCase ? isIdPresent(3) : false) : !isFormDisabled
              }
              // editable={!isFormDisabled}
              textStyle={{
                backgroundColor: isRfc
                  ? !rfcCase
                    ? !isIdPresent(3)
                      ? '#EAEAEA'
                      : '#FFF'
                    : '#EAEAEA'
                  : isFormDisabled
                    ? '#EAEAEA'
                    : '#FFF',
              }}
            />
          </View>
          {phoneError && (
            <Text style={styles.errorText}>{phoneErrorMessage}</Text>
          )}
          <View style={styles.inputView}>
            <FloatingLabelInputField
              // placeholder={'Enter Password'}
              label={' Alt Phone No. '}
              onChangeText={val => setAltPhoneNo(val)}
              value={altPhoneNo}
              keyboardType="number-pad"
              maxLength={10}
              editable={
                isRfc ? (!rfcCase ? isIdPresent(4) : false) : !isFormDisabled
              }
              // editable={!isFormDisabled}
              textStyle={{
                backgroundColor: isRfc
                  ? !rfcCase
                    ? !isIdPresent(4)
                      ? '#EAEAEA'
                      : '#FFF'
                    : '#EAEAEA'
                  : isFormDisabled
                    ? '#EAEAEA'
                    : '#FFF',
              }}
            //keyboardType=""
            />
          </View>
          {altphoneError && (
            <Text style={styles.errorText}>{altPhoneErrorMessage}</Text>
          )}
          <View style={styles.inputView}>
            <FloatingLabelInputField
              // placeholder={'Enter Password'}
              label={' PAN No.* '}
              onChangeText={val => setPanNo(val)}
              value={panNo}
              autoCapitalize={'characters'}
              editable={isRfc ? false : !isFormDisabled}
              textStyle={{
                backgroundColor: isRfc
                  ? '#EAEAEA'
                  : isFormDisabled
                    ? '#EAEAEA'
                    : '#fff',
              }}
            //maxLength={10}
            //keyboardType=""
            />
          </View>
          {panNoError && (
            <Text style={styles.errorText}>{panNoErrorMessage}</Text>
          )}
          {businessUnit === 'Aluminium' ? (
            <>
              <View style={styles.inputView}>
                <FloatingLabelInputField
                  placeholder={'Please enter text here'}
                  label={' Remarks '}
                  onChangeText={val => setRemarks(val)}
                  value={remarks}
                  inputHeight
                  editable={
                    isRfc
                      ? !rfcCase
                        ? isIdPresent(22)
                        : false
                      : !isFormDisabled
                  }
                  // editable={!isFormDisabled}
                  textStyle={{
                    backgroundColor: isRfc
                      ? !rfcCase
                        ? !isIdPresent(22)
                          ? '#EAEAEA'
                          : '#FFF'
                        : '#EAEAEA'
                      : isFormDisabled
                        ? '#EAEAEA'
                        : '#FFF',
                  }}
                />
              </View>
            </>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    //alignSelf: 'center',
    marginVertical: 15,
    //backgroundColor:"#ccc",
    width: 175,
  },
  image: {
    //width:"100%",
    height: 265,
    alignSelf: 'center',
    //backgroundColor:"#ccc",
    width: 315,
    marginVertical: 40,
  },
  container: {
    padding: Dimension.padding20,
    position: 'relative',
    flex: 1,
    paddingTop: Dimension.padding50,
    backgroundColor: '#F7F7F7',
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
    // margin: Dimension.margin49,
  },
  title: {
    alignSelf: 'center',
    fontFamily: Dimension.CustomBoldFont,
    fontSize: Dimension.font24,
    color: Colors.FontColor1,
  },
  title2: {
    alignSelf: 'center',
    fontFamily: Dimension.CustomBoldFont,
    fontSize: Dimension.font20,
    marginTop: 3,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#0064A8',
    borderRadius: 4,
    padding: 1,
    marginTop: 50,
    marginBottom: Dimension.margin40,
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
    marginBottom: Dimension.margin8,
    marginTop: Dimension.margin20,
    //    paddingVertical: 10
  },
  forgotPassWrap: {
    marginTop: Dimension.margin50,
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
  Checkboxlabel: {
    fontSize: Dimension.font13,
    fontFamily: Dimension.CustomRegularFont,
    color: '#000000',
    marginLeft: Dimension.margin3,
    alignSelf: 'center',
    // marginTop: 1,
  },
  forgotAndSignUpText: {
    color: 'white',
    fontSize: 11,
  },
  BottomTxtWrap: {
    position: 'absolute',
    bottom: 10,
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
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    paddingVertical: Dimension.padding13,
    paddingHorizontal: Dimension.padding20,
    marginVertical: Dimension.margin10,
    alignItems: 'center',
    alignSelf: 'flex-start',
    elevation: 5,
    shadowColor: '#00000029',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderColor: '#cbcbcb',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0064A8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Dimension.padding15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#00000029',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  signupText: {
    color: '#0064A8',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  descriptionText: {
    fontSize: Dimension.font15,
    color: '#000000',
    alignSelf: 'center',
    marginTop: 15,
    // marginBottom: 30
  },
  accountText: {
    fontSize: Dimension.font14,
    color: '#000000',
    marginBottom: 42,
  },
  loginText: {
    color: '#FFF',
    fontSize: Dimension.font16,
    fontWeight: '700',
    fontFamily: Dimension.CustomExtraBoldFont,
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
    marginVertical: 4,
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
  errorText: {
    color: 'red',
    fontSize: 10,
    fontFamily: Dimension.CustomRegularFont,
  },
  inputViews: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbcbcb',
    borderRadius: 5,
    paddingLeft: Dimension.padding8,
    paddingRight: Dimension.padding15,
    backgroundColor: '#fff',
    marginBottom: 7,
    marginTop: Dimension.margin16,
  },
  inputFields: {
    flex: 1,
    fontSize: Dimension.font12,
    fontFamily: 'CustomRegularFont',
    paddingVertical: Dimension.padding5,
    color: '#000',
  },
  iconStyles: {
    marginLeft: Dimension.margin10,
  },
});
//ehey
export default BusinessDetailsForm;
