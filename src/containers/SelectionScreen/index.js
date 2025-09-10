import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';
import {
  Button,
  View,
  Text,
  ToastAndroid,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { ScannerService } from '../../services/scannerService';
import RadioGroup from 'react-native-radio-buttons-group';
import Dimension from '../../Theme/Dimension';
import Colors from '../../Theme/Colors';
import Scanner from '../../component/Scanner';
import CustomeIcon from '../../component/CustomeIcon';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getApprovedCustomerListRequest } from '../../redux/feature/mouslice';
import { useSelector, useDispatch } from 'react-redux';
import { getCCHPProductVariantsRequest, getFeedbackCategoryRequest } from '../../redux/feature/vocSlice';
const SelectionScreen = ({ route, navigation }) => {
  //const navigation = useNavigation();
  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth?.data);
  const authReducer = useSelector(state => state.auth?.data);
  const branchAccessData = useSelector(state => state.branchAccess);
  const radioButtonsData = [
    {
      id: '1',
      label: 'Complaint',
      value: 'Complaint',
      selected: true,
      borderColor: '#0063A7',
      color: '#0063A7',
      labelStyle: styles.radioTxt,
      containerStyle: styles.radioWrap,
  
    },
    {
      id: '2',
      label: 'Suggestion',
      value: 'Feedback',
      selected: false,
      borderColor: '#0063A7',
      color: '#0063A7',
      labelStyle: styles.radioTxt,
    },
  ];
  const [loader, setLoader] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [showCreateNew, setShowCreateNew] = useState(true);
  const [auth, setAuth] = useState({});
  const [byPass, setbyPass] = useState(true);
  const [barcode, setBarcode] = useState('');
  const [showQR, setQR] = useState(false);
  const [showType, setScanType] = useState('');
  const [radioButtons, setRadioButtons] = useState(radioButtonsData);
  const [userInfo, setUser] = useState();
  const [onPress, setOnPress] = useState(1);

  useEffect(() => {
    checkTYpe();
    getSession();
  }, []);
console.log("selection props", route);

  const getSession = async () => {
    let jsonValue = await AsyncStorage.getItem('@user_info');
    jsonValue = jsonValue != null ? JSON.parse(jsonValue) : null;
    setAuth(jsonValue);
    CallSession(jsonValue);
  };

  const CallSession = message => {
    setUser(message);
    ScannerService.GetSession(message)
      .then(data => {
        if (data.successful) {
          message['branchId'] = Object.keys(
            data?.data?.companyData?.branchNames,
          )[0];
          message['companyId'] = Object.keys(
            data?.data?.companyData?.companyNames,
          )[0];
          message['companyName'] = Object.values(
            data?.data?.companyData?.companyNames,
          )[0];
          setUser(message);
          getDataFunc(message);
        }
      })
      .catch(err => {
        // Logout();
        console.log(err);
      });
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

  const checkTYpe = async () => {
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.CAMERA).then(cameraStatus => { });
    }
    const BUtype = JSON.parse(await AsyncStorage.getItem('@user_info'));
    if (BUtype.businessUnit != 'Aluminium') {
      setbyPass();
      continueNavigate();
    }
  };
  const onPressRadioButton = radioButtonsArray => {
    console.log(radioButtonsArray, "radioButtonsArray");
    setOnPress(radioButtonsArray)
    // setRadioButtons(radioButtonsArray);
  };

  console.log(radioButtons, "radioButtons");
  
  const responseValue = value => {
    //setLoader(true);
    //alert(value.data)
    //alert(JSON.stringify(value));
    //console.log(showType)
    //    ScannerService.ScanData('4716481', auth)
    // .then(response => {
    //   if (response.success && response.code == 200) {
    //     setValue(response.data);
    //     setOrg(response.data.salesOrg);
    //     setProd(response.data.matType);
    //     setQty(JSON.stringify(response.data.pieces));
    //     setInvoice(response.data.invoiceNum);
    //     setBatch(response.data.batchNo);
    //     setDetail(response.data.matDesc);
    //     setRadioButtons([
    //       {id: '1', label: 'Complaint', value: 'Complaint', selected: false},
    //       {id: '2', label: 'Feedback', value: 'Feedback', selected: true},
    //     ]);
    //     setType('Feedback');
    //   } else {
    //     setValue('');
    //     alert(response.message);
    //   }
    // })
    // .catch(err => {
    //   console.log(err);
    // });
    if (showType == 'QR') {
      (value.fromTextInput
        ? ScannerService.ScanBatchData(
          value.data,
          route?.params?.info || userInfo,
        )
        : ScannerService.ScanData(value?.data, route?.params?.info || userInfo)
      )
        .then(response => {
          setLoader(false);
          if (response.success && response.code == 200) {
            if (response.data == null) {
              ToastAndroid.show(
                'No value related to QRCode',
                ToastAndroid.LONG,
              );
            }
            let selectedButton = radioButtons.find(e => e.selected == true);
            navigation.navigate('Homes', {
              oldData: route?.params?.oldInfo,
              userInfo: route?.params?.info || userInfo,
              type: selectedButton.value,
              autoFetched: response.data,
            });
          } else {
            console.log(response.message);
          }
        })
        .catch(err => {
          setLoader(false);
          console.log(err);
        });
    } else {
      ScannerService.ScanBarCode(value.data, route?.params?.info || userInfo)
        .then(response => {
          setLoader(false);
          console.log('scanner response', response);

          if (response.success && response.code == 200) {
            if (response.data == null) {
              ToastAndroid.show(
                'No value related to Barcode',
                ToastAndroid.LONG,
              );
            }
            let selectedButton = radioButtons.find(e => e.selected == true);
            navigation.navigate('Homes', {
              oldData: route?.params?.oldInfo,
              userInfo: route?.params?.info || userInfo,
              type: selectedButton.value,
              autoFetched: response.data,
            });
          } else {
            console.log(response.message);
          }
          // if (response.success && response.code == 200) {
          //   setValue(response.data);
          //   setOrg(response.data.salesOrg);
          //   setProd(response.data.matType);
          //   setQty(JSON.stringify(response.data.pieces));
          //   setInvoice(response.data.invoiceNum);
          //   setBatch(response.data.batchNo);
          //   setDetail(response.data.matDesc);
          //   setRadioButtons([
          //     {id: '1', label: 'Complaint', value: 'Complaint', selected: false},
          //     {id: '2', label: 'Feedback', value: 'Feedback', selected: true},
          //   ]);
          //   setType('Feedback');
          // } else {
          //   setValue('');
          //   alert(response.message);
          // }
        })
        .catch(err => {
          setLoader(false);

          console.log(err);
        });
    }
  };
  const closeFun = () => {
    setQR(!showQR);
  };
  const continueNavigate = () => {
   
    try {
      let selectedButton = radioButtons.find(e => e.selected == true);
      dispatch(
        getApprovedCustomerListRequest({
          businessUnit: authReducer?.businessUnit,
        }),
      );
      dispatch(
        getCCHPProductVariantsRequest({
          businessUnit: authReducer?.businessUnit,
        }),
      );
      dispatch(
        getFeedbackCategoryRequest({
          businessUnit: authReducer?.businessUnit,
          role: branchAccessData?.isCustomer ? 'Customer' : 'supplier'
        }),
      );
      navigation.navigate('Homes', {
        oldData: route?.params?.oldInfo,
        userInfo: route?.params?.info || userInfo,
        type: selectedButton.value,
      });
    }
      catch (error) {
      console.log('Error in continueNavigate:', error);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(54, 54, 54, .78)',
        position: 'relative',
      }}>
      {showQR && (
        <Scanner
          type={showType}
          finalValue={val => {
            responseValue(val);
            closeFun();
          }}
          requestclose={closeFun}></Scanner>
      )}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == 'android' ? 'height' : 'padding'}>
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps={'handled'}>
          {showCreateNew ? (
            <View style={styles.headerWrap}>
              <TouchableOpacity
                disabled={isDisabled}
                onPress={() => navigation.goBack()}>
                <MaterialCommunityIcon
                  name={'arrow-left'}
                  color={'#000'}
                  size={21}
                  onPress={() => {
                    navigation.goBack();
                  }}></MaterialCommunityIcon>
                {/* <CustomeIcon name="Back_button" size={22} color={'#454F63'} /> */}
              </TouchableOpacity>
              <Text style={styles.HeaderTxt}>Create New Ticket</Text>
              {/* {loader && <ActivityIndicator size={'large'} color={'red'} />} */}
            </View>
          ) : null}
          {byPass ? (
            <View>
              <View style={styles.radioView}>
                <Text style={styles.SelectTypeTxt}>Select Type</Text>
                {console.log(radioButtons, "radioButtons")}
                <RadioGroup
                  radioButtons={radioButtons}
                  onPress={onPressRadioButton}
                  layout="row"
                  selectedId={onPress}
                  containerStyle={{ flex: 1 }}
                />
              </View>
              <View style={styles.ButtonWrap}>
                <TouchableOpacity
                  onPress={() => {
                    setQR(!showQR);
                    setScanType('QR');
                  }}
                  style={styles.ScanBtn}>
                  <Image
                    style={styles.ScanImg}
                    source={{
                      uri: 'https://purchase-order-moglix.s3.ap-south-1.amazonaws.com/QrScan.png',
                    }}
                    resizeMode="contain"></Image>
                  <Text style={styles.ScanBtnTxt}>Scan QR Code</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setQR(!showQR);
                    setScanType('BAR');
                  }}
                  style={[styles.ScanBtn, { marginLeft: 12 }]}>
                  <Image
                    style={styles.ScanImg}
                    source={{
                      uri: 'https://purchase-order-moglix.s3.ap-south-1.amazonaws.com/Barscanner.png',
                    }}
                    resizeMode="contain"></Image>
                  <Text style={styles.ScanBtnTxt}>Scan Barcode</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          <View style={styles.bottomWrap}>
            <View style={styles.orWrap}>
              <View style={styles.HrLine}></View>
              <Text style={styles.ortxt}> Or </Text>
              <View style={styles.HrLine}></View>
            </View>
            <Text
              style={{
                color: '#000',
                fontSize: 14,
                fontWeight: '600',
                paddingBottom: 4,
              }}>
              Enter Batch No.
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TextInput
                placeholder="Batch No."
                placeholderTextColor={'#ccc'}
                value={barcode}
                onChangeText={barcode => {
                  setBarcode(barcode);
                  setScanType('QR');
                }}
                style={styles.searchBar}
              />
              <TouchableOpacity
                disabled={!barcode}
                onPress={() => {
                  if (barcode) {
                    responseValue({ data: barcode, fromTextInput: true });
                  }
                }}
                style={{
                  padding: 11,
                  backgroundColor: '#0063A7',
                  borderRadius: 4,
                }}>
                <Icon color={'#fff'} size={24} name={'magnify'} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bottomWrap}>
            <View style={styles.orWrap}>
              <View style={styles.HrLine}></View>
              <Text style={styles.ortxt}> Or </Text>
              <View style={styles.HrLine}></View>
            </View>
            <TouchableOpacity onPress={continueNavigate}>
              <Text style={styles.continueText}> Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SelectionScreen;
