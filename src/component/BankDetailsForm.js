import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Dimension from '../Theme/Dimension';
import Colors from '../Theme/Colors';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FloatingLabelInputField from '../component/FloatingInput';
import { useDispatch, useSelector } from 'react-redux';
import { ScannerService } from '../services/scannerService';
import { setBankDetails } from '../redux/feature/BankDetailsSlice';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { STATE_STATUS } from '../redux/constants';
import {
  bankNameExp,
  accountNOExp,
  ifscExp,
  ifscExp2,
  branchAddressExp,
} from '../constants';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CONSTANTS from '../services/constant';
const BankDetailsForm = props => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth?.data);
  const bankData = useSelector(state => state.bankDetail?.data?.[0]);
  const isrfcMain = authData?.rfcMain || false;
  const isRfc = authData?.bankDetails?.[0]?.rfc || false;
  const [loader, setLoader] = useState(false);
  const [bankDetails, setBankDetailsState] = useState([]);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [rfcCase, setRfcCase] = useState(false);
  const [errors, setErrors] = useState([{}]);
  const isCtaDisabled = () => {
    const val = bankDetails.some(
      detail =>
        !detail.accountNO.match(accountNOExp) ||
        !detail?.accountNO?.length ||
        detail?.accountNO?.length < 9 ||
        detail?.accountNO?.length > 20 ||
        !detail.bankName.match(bankNameExp) ||
        !detail.branchAddress.match(branchAddressExp) ||
        !detail.ifscCode.match(ifscExp),
    );

    return val;
  };

  const validateField = (field, value) => {
    let error = '';

    switch (field) {
      case 'accountNO':
        if (
          !accountNOExp.test(value) ||
          !value?.length ||
          value?.length < 9 ||
          value?.length > 20
        ) {
          error = 'Invalid account number';
        }
        break;
      case 'bankName':
        if (!bankNameExp.test(value)) {
          error = 'Invalid bank name';
        }
        break;
      case 'branchAddress':
        //('Checking IFSC:', value);
        if (!branchAddressExp.test(value)) {
          error = 'Invalid branch address';
        }
        break;
      case 'ifscCode':
        //  console.log('Checking IFSC:', value);
        if (!ifscExp.test(value)) {
          error = 'Invalid IFSC code';
        }
        break;
      default:
        break;
    }

    return error;
  };

  useEffect(() => {
    if (authData?.bankDetails?.length > 0) {
      setBankDetailsState(authData.bankDetails);
    } else {
      setBankDetailsState([
        {
          accountNO:
            authData?.bankDetails?.accountNO || bankData?.accountNO || '',
          bankName: authData?.bankDetails?.bankName || bankData?.bankName || '',
          branchAddress:
            authData?.bankDetails?.branchAddress ||
            bankData?.branchAddress ||
            '',
          ifscCode: authData?.bankDetails?.ifscCode || bankData?.ifscCode || '',
        },
        //  {accountNO: '', bankName: '', branchAddress: '', ifscCode: ''},
      ]);
    }
  }, [authData]);

  // console.log(bankData.length);

  useEffect(() => {
    if (Object.keys(bankData ?? {})?.length > 0) {
      setIsFormDisabled(true);
      props.onSave(true);
      props.onEnable(3);
    } else {
      // console.log('hit 2');
      if (authData?.bankDetails?.length > 0) {
        setBankDetailsState(authData.bankDetails);
        setIsFormDisabled(true);
        props.onSave(true);
        props.onEnable(3);
      } else {
        console.log('hit 3');
        setBankDetailsState([
          {
            accountNO:
              authData?.bankDetails?.accountNO || bankData?.accountNO || '',
            bankName:
              authData?.bankDetails?.bankName || bankData?.bankName || '',
            branchAddress:
              authData?.bankDetails?.branchAddress ||
              bankData?.branchAddress ||
              '',
            ifscCode:
              authData?.bankDetails?.ifscCode || bankData?.ifscCode || '',
          },
        ]);
        setIsFormDisabled(false);
        {
          authData?.businessUnit === 'Aluminium'
            ? (props.onSave(true), props.onEnable(3))
            : props.onSave(false);
        }
      }
    }
  }, [authData]);

  useEffect(() => {
    const newErrors = bankDetails.map((detail, index) => {
      const detailErrors = {};
      for (const [field, value] of Object.entries(detail)) {
        // console.log('field', field, value);
        if (
          value !== null &&
          value !== undefined &&
          value.toString().trim().length !== 0
        ) {
          detailErrors[field] = validateField(field, value);
        }
      }
      return detailErrors;
    });

    setErrors(newErrors);
  }, [bankDetails]);

  useEffect(() => {
    const checkRfcCase = async () => {
      const savedRfcCase = await AsyncStorage.getItem('rfcCase_BankDetails');

      if (savedRfcCase !== null) {
        setRfcCase(JSON.parse(savedRfcCase));
      }
    };
    checkRfcCase();
  }, []);
  const rfcList = authData?.rfcList || [];

  const flatArray = rfcList.map(item => item.id);

  console.log(flatArray);

  const isIdPresent = id => {
    return flatArray.includes(id);
  };

  const handleInputChange = (index, field, value) => {
    const updatedDetails = [...bankDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value,
    };
    setBankDetailsState(updatedDetails);
  };

  const handleDeleteBankDetail = async (index, bankId, accountNO) => {
    try {
      const response = await axios.post(
        `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.API_URL.DELETE_BANKDETAILS}`,
        {
          companyId: authData.companyId,
          bankId: bankId,
          accountNO: accountNO,
        },
      );
      if (response?.data?.success) {
        const updatedDetails = bankDetails.filter((_, i) => i !== index);
        setBankDetailsState(updatedDetails);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text2: data?.data?.message || 'Error',
        visibilityTime: 4000,
        autoHide: true,
      });
      console.error('Error deleting bank details:', error);
    }
  };

  const handleSaveOrEdit = async () => {
    console.log('isFormDisabled', isFormDisabled);
    if (isFormDisabled && !isRfc) {
      setIsFormDisabled(false);
      props.onSave(false);
    } else {
      if (!isCtaDisabled()) {
        // setIsFormDisabled(true);
        try {
          props?.loader(true);
          // setLoader(true);
          const response = await ScannerService.bankDetails(
            bankDetails.map(detail => ({
              ...detail,
              companyId: authData.companyId,
              bankKey: detail.bankKey || '',
              bankId: detail.bankId || null,
            })),
          );
          if (response?.data?.successful) {
            await AsyncStorage.setItem(
              'rfcCase_BankDetails',
              JSON.stringify(true),
            );
            setRfcCase(true);
            Toast.show({
              type: 'success',
              text2:
                response?.data?.message || 'Bank Details Saved Successfully',
              visibilityTime: 4000,
              autoHide: true,
            });
            dispatch(
              setBankDetails({
                status: STATE_STATUS.FETCHED,
                data: response.data.data,
              }),
            );
            props.onSave(true);
            props.onEnable(3);
            props?.loader(false);
            // setLoader(false);
            setIsFormDisabled(true);
          } else {
            props?.loader(false);
            // setLoader(false);
            Toast.show({
              type: 'error',
              text2: response?.data?.message || 'Failed to save bank details.',
              visibilityTime: 4000,
              autoHide: true,
            });
            // Alert.alert(
            //   'Error',
            //   response.data?.message || 'Failed to save bank details.',
            // );
          }
        } catch (error) {
          props?.loader(false)
          // setLoader(false);
          console.error('Error saving bank details:', error);
        }
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: Dimension.padding12 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Bank Information</Text>
        {isRfc ? (
          !rfcCase && (
            <TouchableOpacity
              onPress={handleSaveOrEdit}
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
            onPress={handleSaveOrEdit}
            disabled={!isFormDisabled && isCtaDisabled()}
            style={[
              styles.loginBtn,
              {
                backgroundColor: isFormDisabled
                  ? '#0063A7'
                  : isCtaDisabled()
                    ? '#ccc'
                    : '#0063A7',
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
          onPress={handleSaveOrEdit}
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
        {bankDetails.map((detail, index) => (
          <View key={index} style={styles.formGroup}>
            <View style={styles.inputView}>
              {authData?.businessUnit === 'Aluminium' ? (
                <FloatingLabelInputField
                  label=" Account Number "
                  value={detail.accountNO}
                  maxLength={20}
                  keyboardType={'num-pad'}
                  editable={
                    isRfc
                      ? !rfcCase
                        ? isIdPresent(7)
                        : false
                      : !isFormDisabled
                  }
                  onChangeText={value =>
                    handleInputChange(index, 'accountNO', value)
                  }
                  textStyle={{
                    backgroundColor: isRfc
                      ? !rfcCase
                        ? !isIdPresent(7)
                          ? '#EAEAEA'
                          : '#FFF'
                        : '#EAEAEA'
                      : isFormDisabled
                        ? '#EAEAEA'
                        : '#FFF',
                  }}
                />
              ) : (
                <FloatingLabelInputField
                  label=" Account Number* "
                  value={detail.accountNO}
                  editable={
                    isRfc
                      ? !rfcCase
                        ? isIdPresent(7)
                        : false
                      : !isFormDisabled
                  }
                  maxLength={20}
                  keyboardType="number-pad"
                  onChangeText={value =>
                    handleInputChange(index, 'accountNO', value)
                  }
                  textStyle={{
                    backgroundColor: isRfc
                      ? !rfcCase
                        ? !isIdPresent(7)
                          ? '#EAEAEA'
                          : '#FFF'
                        : '#EAEAEA'
                      : isFormDisabled
                        ? '#EAEAEA'
                        : '#FFF',
                  }}
                />
              )}
            </View>
            {errors[index]?.accountNO && (
              <Text style={styles.errorText}>{errors[index].accountNO}</Text>
            )}
            <View style={styles.inputView}>
              {authData?.businessUnit === 'Aluminium' ? (
                <FloatingLabelInputField
                  label=" Bank Name "
                  value={detail.bankName}
                  editable={
                    isRfc
                      ? !rfcCase
                        ? isIdPresent(8)
                        : false
                      : !isFormDisabled
                  }
                  onChangeText={value =>
                    handleInputChange(index, 'bankName', value)
                  }
                  textStyle={{
                    backgroundColor: isRfc
                      ? !rfcCase
                        ? !isIdPresent(8)
                          ? '#EAEAEA'
                          : '#FFF'
                        : '#EAEAEA'
                      : isFormDisabled
                        ? '#EAEAEA'
                        : '#FFF',
                  }}
                />
              ) : (
                <FloatingLabelInputField
                  label=" Bank Name* "
                  value={detail.bankName}
                  editable={
                    isRfc
                      ? !rfcCase
                        ? isIdPresent(8)
                        : false
                      : !isFormDisabled
                  }
                  onChangeText={value =>
                    handleInputChange(index, 'bankName', value)
                  }
                  textStyle={{
                    backgroundColor: isRfc
                      ? !rfcCase
                        ? !isIdPresent(8)
                          ? '#EAEAEA'
                          : '#FFF'
                        : '#EAEAEA'
                      : isFormDisabled
                        ? '#EAEAEA'
                        : '#FFF',
                  }}
                />
              )}
            </View>
            {errors[index]?.bankName && (
              <Text style={styles.errorText}>{errors[index].bankName}</Text>
            )}
            <View style={styles.inputView}>
              {authData?.businessUnit === 'Aluminium' ? (
                <FloatingLabelInputField
                  label=" Branch Address "
                  value={detail.branchAddress}
                  editable={
                    isRfc
                      ? !rfcCase
                        ? isIdPresent(9)
                        : false
                      : !isFormDisabled
                  }
                  onChangeText={value =>
                    handleInputChange(index, 'branchAddress', value)
                  }
                  textStyle={{
                    backgroundColor: isRfc
                      ? !rfcCase
                        ? !isIdPresent(9)
                          ? '#EAEAEA'
                          : '#FFF'
                        : '#EAEAEA'
                      : isFormDisabled
                        ? '#EAEAEA'
                        : '#FFF',
                  }}
                />
              ) : (
                <FloatingLabelInputField
                  label=" Branch Address* "
                  value={detail.branchAddress}
                  editable={
                    isRfc
                      ? !rfcCase
                        ? isIdPresent(9)
                        : false
                      : !isFormDisabled
                  }
                  onChangeText={value =>
                    handleInputChange(index, 'branchAddress', value)
                  }
                  textStyle={{
                    backgroundColor: isRfc
                      ? !rfcCase
                        ? !isIdPresent(9)
                          ? '#EAEAEA'
                          : '#FFF'
                        : '#EAEAEA'
                      : isFormDisabled
                        ? '#EAEAEA'
                        : '#FFF',
                  }}
                />
              )}
            </View>
            {errors[index]?.branchAddress && (
              <Text style={styles.errorText}>
                {errors[index].branchAddress}
              </Text>
            )}

            <View style={styles.inputView}>
              {authData?.businessUnit === 'Aluminium' ? (
                <FloatingLabelInputField
                  label=" IFSC Code "
                  value={detail.ifscCode}
                  editable={
                    isRfc
                      ? !rfcCase
                        ? isIdPresent(10)
                        : false
                      : !isFormDisabled
                  }
                  onChangeText={value =>
                    handleInputChange(index, 'ifscCode', value)
                  }
                  textStyle={{
                    backgroundColor: isRfc
                      ? !rfcCase
                        ? !isIdPresent(10)
                          ? '#EAEAEA'
                          : '#FFF'
                        : '#EAEAEA'
                      : isFormDisabled
                        ? '#EAEAEA'
                        : '#FFF',
                  }}
                />
              ) : (
                <FloatingLabelInputField
                  label=" IFSC Code* "
                  value={detail.ifscCode}
                  editable={
                    isRfc
                      ? !rfcCase
                        ? isIdPresent(10)
                        : false
                      : !isFormDisabled
                  }
                  onChangeText={value =>
                    handleInputChange(index, 'ifscCode', value)
                  }
                  textStyle={{
                    backgroundColor: isRfc
                      ? !rfcCase
                        ? !isIdPresent(10)
                          ? '#EAEAEA'
                          : '#FFF'
                        : '#EAEAEA'
                      : isFormDisabled
                        ? '#EAEAEA'
                        : '#FFF',
                  }}
                />
              )}
            </View>
            {errors[index]?.ifscCode && (
              <Text style={styles.errorText}>{errors[index].ifscCode}</Text>
            )}

            {authData?.businessUnit === 'Copper' ? (
              <View style={styles.inputView}>
                <FloatingLabelInputField
                  label=" Bank Key "
                  value={detail.bankKey}
                  editable={
                    isRfc
                      ? !rfcCase
                        ? isIdPresent(23)
                        : false
                      : !isFormDisabled
                  }
                  onChangeText={value =>
                    handleInputChange(index, 'bankKey', value)
                  }
                  textStyle={{
                    backgroundColor: isRfc
                      ? !rfcCase
                        ? !isIdPresent(23)
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

            {index !== 0 && isFormDisabled && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() =>
                  handleDeleteBankDetail(index, detail.bankId, detail.accountNO)
                }>
                <MaterialCommunityIcon name="close" size={18} color="#000" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignContent: 'center',
    borderRadius: 5,
    borderColor: '#EBEBEB',
    borderWidth: 1,
    paddingBottom: 30,
    paddingHorizontal: 15,
  },
  title: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Dimension.margin5,
    marginTop: Dimension.margin15,
  },
  formGroup: {
    marginBottom: 15,
  },
  inputView: {
    width: '100%',
    // marginBottom: Dimension.margin20,
    marginBottom: Dimension.margin8,
    marginTop: Dimension.margin20,
    //    paddingVertical: 10
  },
  addButton: {
    backgroundColor: '#0063A7',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#0063A7',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  loginText: {
    color: '#000',
    fontSize: Dimension.font16,
    fontWeight: '700',
    fontFamily: Dimension.CustomExtraBoldFont,
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
  errorText: {
    color: 'red',
    fontSize: Dimension.font13,
    fontFamily: Dimension.CustomRegularFont,
  },
});

export default BankDetailsForm;
