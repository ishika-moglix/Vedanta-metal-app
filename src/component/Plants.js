import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Dimension from '../Theme/Dimension';
import Colors from '../Theme/Colors';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FloatingLabelInputField from '../component/FloatingInput';
import { useDispatch, useSelector } from 'react-redux';
import { ScannerService } from '../services/scannerService';
import { setPlantDetails } from '../redux/feature/plantsSlice';
import { STATE_STATUS } from '../redux/constants';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import axios from 'axios';
const PlantsForm = props => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth.data);
  const plantData = useSelector(state => state.plantDetails?.data?.[0]);
  const [loader, setLoader] = useState(false);
  const [phoneNo, setPhoneNo] = useState(
    plantData?.phone || authData?.shippingAddress?.phone || '',
  );
  const [name, setName] = useState(
    plantData?.name || authData?.shippingAddress?.name || '',
  );
  const [altPhoneNo, setAltPhoneNo] = useState(
    plantData?.altPhone || authData?.shippingAddress?.altPhone || '',
  );
  const [email, setEmail] = useState(
    plantData?.emailId || authData.userDetails?.email || authData?.email || '',
  );
  const [pincode, setPincode] = useState(
    plantData?.pincode || authData?.shippingAddress?.pincode || '',
  );
  const [city, setCity] = useState(authData?.shippingAddress?.city || '');
  const [state, setState] = useState(authData?.shippingAddress?.state || '');
  const [country, setCountry] = useState(
    authData?.shippingAddress?.country || '',
  );
  const [gstin, setGstin] = useState(
    props?.route.params?.GSTIN || plantData?.gstn || '',
  );
  const [address1, setAddressLine1] = useState(
    plantData?.addressLine1 || authData?.shippingAddress?.address1 || '',
  );
  const [address2, setAddressLine2] = useState(
    plantData?.addressLine2 || authData?.shippingAddress?.address2 || '',
  );
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [pinCodeError, setPincodeError] = useState('');
  const [rfcCase, setRfcCase] = useState(false);
  const [wrongPincode, setWrongPincode] = useState(false);
  const isRfc = authData?.shippingAddress?.rfc || false;
  const isrfcMain = authData?.rfcMain || false;
  useEffect(() => {
    if (pincode.length === 6) {
      onGetPincodeDetails(pincode);
    }
  }, [pincode]);

  useEffect(() => {
    if (/^\d*$/.test(pincode)) {
      setPincodeError('');
    } else {
      setPincodeError('Pincode should only contain numbers');
    }
  }, [pincode]);

  useEffect(() => {
    const checkRfcCase = async () => {
      const savedRfcCase = await AsyncStorage.getItem('rfcCase_PlantDetails');

      if (savedRfcCase !== null) {
        setRfcCase(JSON.parse(savedRfcCase));
      }
    };
    checkRfcCase();
  }, []);

  // console.log(
  //   phoneNo?.trim()?.length != 10,
  //   !name?.trim()?.length,
  //   !address1?.trim()?.length,

  //   pincode?.trim()?.length != 6,
  //   wrongPincode,
  //   'testing pincode',
  // );

  const isCtaDisabled = () => {
    const val =
      phoneNo?.trim()?.length != 10 ||
      !name?.trim()?.length ||
      !address1?.trim()?.length ||
      pincode?.trim()?.length != 6 ||
      wrongPincode;

    return val;
  };
  const rfcList = authData?.rfcList || [];

  const flatArray = rfcList.map(item => item.id);

  const isIdPresent = id => {
    return flatArray.includes(id);
  };

  const onGetPincodeDetails = async pincode => {
    const data = await ScannerService.pinCodes(pincode);

    if (data?.data?.data?.[0]?.Status === 'Success') {
      setCity(data?.data?.data[0].PostOffice[0].District);
      setState(data?.data?.data[0].PostOffice[0].State);
      setCountry(data?.data?.data[0].PostOffice[0].Country);
      setWrongPincode(false);
    } else {
      setWrongPincode(true);
      Toast.show({
        type: 'error',
        text2: 'Enter Valid Pincode',
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  useEffect(() => {
    if (Object.keys(plantData ?? {})?.length > 0) {
      setIsFormDisabled(true);
      props.onSave(true);
      props.onEnable(2);
    } else {
      if (
        authData?.gstNO &&
        authData?.shippingAddress?.name &&
        authData?.shippingAddress?.phone &&
        authData?.userDetails?.email &&
        authData?.shippingAddress?.address1 &&
        authData?.shippingAddress?.pincode
      ) {
        setIsFormDisabled(true);
        props.onEnable(2);
        // props.onSave(true);
      } else {
        setIsFormDisabled(false);
        props.onSave(false);
      }
    }
  }, [authData]);

  const multipleAddress = [
    {
      addressType: 'Billing Address',
      idBranch: authData.branchId || '',
      address: {
        name: name,
        gstn: authData.gstNO || '',
        address1: address1,
        address2: address2,
        phone: phoneNo,
        altPhone: altPhoneNo,
        pincode: pincode,
        city: city,
        state: state,
        country: country,
        isDefault: true,
        idAddress: authData?.shippingAddress?.idAddress || '',
        alias: null,
        aliasName: null,
        emailId: email || authData?.email || authData?.userDetails?.email || '',
      },
    },
    {
      addressType: 'Shipping Address',
      idBranch: authData.branchId || '',
      address: {
        name: name,
        gstn: authData.gstNO || '',
        address1: address1,
        address2: address2,
        phone: phoneNo,
        altPhone: altPhoneNo,
        pincode: pincode,
        city: city,
        state: state,
        country: country,
        idAddress: authData?.shippingAddress?.idAddress || '',
        alias: null,
        aliasName: null,
        emailId: email || authData?.email || authData?.userDetails?.email || '',
      },
    },
  ];
  const handleSave = async () => {
    if (isFormDisabled && !isRfc) {
      setIsFormDisabled(false);
      props.onSave(false);
    } else {
      if (!isCtaDisabled()) {
        // setIsFormDisabled(true);
        try {
          props?.loader(true)
          // setLoader(true);
          const data = await ScannerService.saveMultipleAddress(
            multipleAddress,
          );
          // const response = await axios.post(
          //   'https://vedanta-authuat.moglilabs.com/login/customer/saveMultipleAddresses',
          //   [
          //     {
          //       addressType: 'Billing Address',
          //       idBranch: authData.branchId || '',
          //       address: {
          //         name: name,
          //         gstn: authData.gstNO || '',
          //         address1: address1,
          //         address2: address2,
          //         phone: phoneNo,
          //         altPhone: altPhoneNo,
          //         pincode: pincode,
          //         city: city,
          //         state: state,
          //         country: country,
          //         isDefault: true,
          //         idAddress: '',
          //         alias: '',
          //         aliasName: '',
          //         emailId: authData.userDetails.email,
          //       },
          //     },
          //     {
          //       addressType: 'Shipping Address',
          //       idBranch: authData.branchId || '',
          //       address: {
          //         name: name,
          //         gstn: authData.gstNO || '',
          //         address1: address1,
          //         address2: address2,
          //         phone: phoneNo,
          //         altPhone: altPhoneNo,
          //         pincode: pincode,
          //         city: city,
          //         state: state,
          //         country: country,
          //         isDefault: true,
          //         idAddress: '',
          //         alias: '',
          //         aliasName: '',
          //         emailId: authData.userDetails.email,
          //       },
          //     },
          //   ],
          // );
          //     const data = await ScannerService.saveBusinessDetails(
          //       {
          //           "addressType": "Billing Address",
          //           "idBranch": authData.branchId || '',
          //           "address": {
          //               "name": name,
          //               "gstn":authData.gstNO || '',
          //               "address1": address1,
          //               "address2": address2,
          //               "phone": phoneNo,
          //               "altPhone": altPhoneNo,
          //               "pincode": pincode,
          //               "city": city,
          //               "state": state,
          //               "country": country,
          //               "isDefault": true,
          //               "idAddress": 123877,
          //               "alias": null,
          //               "aliasName": null,
          //               "emailId": authData.userDetails.email
          //           }
          //       },
          //       {
          //           "addressType": "Shipping Address",
          //           "idBranch": authData.branchId || '',
          //           "address": {
          //             "name": name,
          //             "gstn":authData.gstNO || '',
          //             "address1": address1,
          //             "address2": address2,
          //             "phone": phoneNo,
          //             "altPhone": altPhoneNo,
          //             "pincode": pincode,
          //             "city": city,
          //             "state": state,
          //             "country": country,
          //             "isDefault": true,
          //             "idAddress": 123877,
          //             "alias": null,
          //             "aliasName": null,
          //             "emailId": authData.userDetails.email
          //         }
          //       }
          //   ]
          // );
          if (data?.data?.successful) {
            await AsyncStorage.setItem(
              'rfcCase_PlantDetails',
              JSON.stringify(true),
            );
            setRfcCase(true);
            props?.loader(false)
            // setLoader(false);
            setIsFormDisabled(true);
            Toast.show({
              type: 'success',
              text2: 'Plant details saved successfully',
              visibilityTime: 4000,
              autoHide: true,
            });
            props.onSave(true);
            props.onEnable(2);
            // storeData(data?.data?.data);
            dispatch(
              setPlantDetails({
                status: STATE_STATUS.FETCHED,
                data: data?.data?.data,
              }),
            );
          } else {
            props?.loader(false);
            // setLoader(false);
            Toast.show({
              type: 'error',
              text2: data?.data?.message || 'Error',
              visibilityTime: 4000,
              autoHide: true,
            });
          }
        } catch (e) {
          console.log(e);
          props?.loader(false);
          // setLoader(false);
        }
      }
    }
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: 20 }}>
      <View
        style={{
          backgroundColor: '#fff',
          alignContent: 'center',
          borderRadius: 5,
          borderColor: '#EBEBEB',
          borderWidth: 1,
          paddingBottom: 30,
          paddingHorizontal: 15,
        }}>
        <Text
          style={{
            color: '#000000',
            fontSize: 14,
            fontWeight: '600',
            marginBottom: Dimension.margin5,
            marginTop: Dimension.margin15,
          }}>
          Billing and Shipping Address
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
                    { color: '#fff', marginLeft: loader ? 8 : 0 },
                  ]}>
                  Save
                </Text>
              </View>
            </TouchableOpacity>
          )
        ) : isrfcMain ? (
          ''
        ) : (
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isFormDisabled && isCtaDisabled()}
            style={[
              styles.loginBtn,
              {
                backgroundColor: isCtaDisabled() ? '#ccc' : '#0063A7',
              },
            ]}>
            <View style={styles.row}>
              {loader ? (
                <ActivityIndicator
                  style={styles.loader}
                  color={'#fff'}
                  size={'small'}
                />
              ) : null}
              <Text style={[styles.loginText, { color: '#FFF' }]}>
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
            <Text style={[styles.loginText, {color: '#FFF'}]}>
              {isFormDisabled ? 'Edit' : 'Save'}
            </Text>
          </View>
        </TouchableOpacity> */}
        <View style={styles.inputView}>
          <FloatingLabelInputField
            label={' Name* '}
            onChangeText={val => setName(val)}
            value={name}
            editable={
              isRfc ? (!rfcCase ? isIdPresent(6) : false) : !isFormDisabled
            }
            textStyle={{
              backgroundColor: isRfc
                ? !rfcCase
                  ? !isIdPresent(6)
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
            label={' GSTIN* '}
            value={gstin}
            editable={false}
            textStyle={{
              backgroundColor: '#EAEAEA',
            }}
          />
        </View>

        <View style={styles.inputView}>
          <FloatingLabelInputField
            // placeholder={'Enter Designation'}
            label={' Address Line 1* '}
            onChangeText={val => setAddressLine1(val)}
            value={address1}
            editable={
              isRfc ? (!rfcCase ? isIdPresent(6) : false) : !isFormDisabled
            }
            textStyle={{
              backgroundColor: isRfc
                ? !rfcCase
                  ? !isIdPresent(6)
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
            // placeholder={'Enter Designation'}
            label={' Address LIne 2 '}
            onChangeText={val => setAddressLine2(val)}
            value={address2}
            editable={
              isRfc ? (!rfcCase ? isIdPresent(6) : false) : !isFormDisabled
            }
            textStyle={{
              backgroundColor: isRfc
                ? !rfcCase
                  ? !isIdPresent(6)
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
            // placeholder={'Enter Password'}
            label={' Phone No.* '}
            onChangeText={val => setPhoneNo(val)}
            value={phoneNo}
            keyboardType="number-pad"
            maxLength={10}
            editable={
              isRfc ? (!rfcCase ? isIdPresent(6) : false) : !isFormDisabled
            }
            textStyle={{
              backgroundColor: isRfc
                ? !rfcCase
                  ? !isIdPresent(6)
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
            label={' Alt Phone No. '}
            onChangeText={val => setAltPhoneNo(val)}
            value={altPhoneNo}
            keyboardType="number-pad"
            maxLength={10}
            editable={
              isRfc ? (!rfcCase ? isIdPresent(6) : false) : !isFormDisabled
            }
            textStyle={{
              backgroundColor: isRfc
                ? !rfcCase
                  ? !isIdPresent(6)
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
            // placeholder={'Enter Designation'}
            label={' PIN Code* '}
            onChangeText={val => setPincode(val)}
            value={pincode}
            maxLength={6}
            keyboardType="number-pad"
            editable={
              isRfc ? (!rfcCase ? isIdPresent(6) : false) : !isFormDisabled
            }
            textStyle={{
              backgroundColor: isRfc
                ? !rfcCase
                  ? !isIdPresent(6)
                    ? '#EAEAEA'
                    : '#FFF'
                  : '#EAEAEA'
                : isFormDisabled
                  ? '#EAEAEA'
                  : '#FFF',
            }}
          />
        </View>
        {pinCodeError ? (
          <Text style={styles.errorText}>{pinCodeError}</Text>
        ) : null}
        <View style={styles.inputView}>
          <FloatingLabelInputField
            // placeholder={'Enter Designation'}
            label={' City* '}
            value={city}
            editable={false}
            textStyle={{
              backgroundColor: '#EAEAEA',
            }}
          />
        </View>

        <View style={styles.inputView}>
          <FloatingLabelInputField
            // placeholder={'Enter Designation'}
            label={' State* '}
            value={state}
            editable={false}
            textStyle={{
              backgroundColor: '#EAEAEA',
            }}
          />
        </View>

        <View style={styles.inputView}>
          <FloatingLabelInputField
            // placeholder={'Enter Designation'}
            label={' Country* '}
            value={country}
            editable={false}
            textStyle={{
              backgroundColor: '#EAEAEA',
            }}
          />
        </View>
      </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  errorText: {
    color: 'red',
    fontSize: 10,
    fontFamily: Dimension.CustomRegularFont,
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
    color: '#000',
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
    fontWeight: 'bold',
    marginVertical: 0,
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
export default PlantsForm;
