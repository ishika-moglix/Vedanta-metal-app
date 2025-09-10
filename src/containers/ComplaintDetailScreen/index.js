import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Dimension from '../../Theme/Dimension';
import CONSTANTS from '../../services/constant';
//import Colors from '../../Theme/Colors'
import styles from './style';
import Header from '../../component/Header';
import CustomLoader from '../../component/customLoader';
import Toast from 'react-native-toast-message';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { stat } from 'react-native-fs';
import { showMessage } from '../../utils/BiometricAuth';
//import { Card} from "react-native-elements";
//import CustomeIcon from '../../component/CustomeIcon';
//import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const ComplaintDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth?.data);
  const branchAccessData = useSelector(state => state.branchAccess?.data?.branchModules);
    const isCustomer = useSelector(state => state.branchAccess?.isCustomer);
  const isAluminium = authData?.businessUnit === 'Aluminium' ? true : false;
  const approvedCustomerList = useSelector(state => state.mouList?.approvedCustomerList?.data);
  const plantName = useSelector(state => state.searchPlants?.searchPlants?.data?.plants)
  //const navigation = useNavigation();
  // console.log("see this", route.params.userData)
  const [alreadCaptured, setAlready] = useState(route.params.capturedData);
  const [auth, setAuth] = useState(route.params.authData);
  const [showInfo, setInfo] = useState(route.params.userData);
  const [loader, setLoader] = useState(false);
  const [qty, setQty] = useState(showInfo.quantity);
  const [invoice, setInvoiceNo] = useState(showInfo.invoiceNo);
  const [batch, setBatchNo] = useState(showInfo.batchNo);
  const isCTS = branchAccessData?.roleNames.includes('Customer Technical Service') ? true : false;
  const isCTSAdmin = branchAccessData?.roleNames.includes('Customer Technical Service - Head') ? true : false;
  const isRMUser = branchAccessData?.roleNames.includes('Regional Manager') ? true : false;
  const isPMUser = branchAccessData?.roleNames.includes('Product Manager') ? true : false;
    
  useEffect(() => {
    if (alreadCaptured) {
      setQty(Number(alreadCaptured.quantity) + Number(showInfo.quantity));
      setInvoiceNo(alreadCaptured.invoiceNo + ',' + showInfo.invoiceNo);
      setBatchNo(alreadCaptured.batchNo + ',' + showInfo.batchNo);
    }
  }, []);

 const checkCustomerDetailsErrors = (isAluminium) => {
        if (isAluminium && showInfo.dispatchCompany === '') {
            showMessage('error', 'Please select Sales Org');
            return true;
        }
        if (showInfo?.selectedProd === '') {
            showMessage('error', 'Please select Product');
            return true;
        }
        if (
            qty == null ||
            qty.toString().trim() === '' ||
            qty == 0
        ) {
            showMessage('error', 'Please enter valid Quantity');
            return true;
        }
        if (showInfo?.catCode === '') {
            showMessage('error', 'Please select category');
            return true;
        }
        if (showInfo?.subcatCode === '') {
            showMessage('error', 'Please select Sub-category');
            return true;
        }
        if (invoice?.trim() === '') {
            showMessage('error', 'Please enter Invoice');
            return true;
        }
        if (batch?.trim() === '') {
            showMessage('error', 'Please enter Batch No.');
            return true;
        }
        if (showInfo?.details.trim() === '') {
            showMessage('error', 'Please enter Details');
            return true;
        }
        return false;
    };
  console.log("showInfo.docs", showInfo.docs);
  
  const createFeedback = async () => {
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    const getPlantCode = await AsyncStorage.getItem('@plantCode');
    let plantCode = JSON.parse(getPlantCode);
    let plantId = JSON.parse(getPlantId);
    // checking if plantcode is null
    if (!(!isCustomer || isCTSAdmin || isCTS || isPMUser)) {
      if (!plantCode) {
        showMessage('error', 'Error: Plant Code is null');
        return;
      }
    }

    if (checkCustomerDetailsErrors(isAluminium)) {
      return;

    }
    setLoader(true);
    const customer1 = approvedCustomerList;
    const feedbackDto = {
      dispatchCompany: isAluminium ? showInfo.dispatchCompany : null,
      dispatchCompanyId: isAluminium ? showInfo.salesOrg === 'VALC' ? '9093' : '1' : authData?.businessUnit,
      complaintType: showInfo.complaintType,
      // shipFromId:  feedbackForm.get('shipFrom').value,
      productName: showInfo.productName,
      productId: showInfo.productId,
      quantity: qty,
      feedbackCategory: showInfo.feedbackCategory,
      feedbackCategoryId: showInfo.feedbackCategoryId,
      feedbackSubcategory: showInfo.feedbackSubcategory,
      feedbackSubcategoryId: showInfo.feedbackSubcategoryId,
      invoiceNo:invoice,
      batchNo: batch,
      details: showInfo.details,
      customerCode: jsonSessionData?.companyId,
      customerName: authData?.userName,
      code: plantCode?.plantCode,
      customerPlantName: plantName?.find(code => code.plantCode === plantCode?.plantCode)?.plantName,
      // customerGroup: customer1?.find(name => name.business_name === customerGroup)?.business_name,
      // complaintMedium:  isRMUser|| isCTS|| isCTSAdmin ?  feedbackForm?.get('complaintMedium')?.value : null,
    };

    feedbackDto['businessUnit'] = authData?.businessUnit;

    // if ( !isCustomer ||  isCTSAdmin ||  isCTS ||  isPMUser) {
    //   feedbackDto['customerCode'] =  feedbackForm?.get('customer').value.business_id;
    //   feedbackDto['code'] = customer1['plantCode'];
    //   feedbackDto['customerPlantName'] = customer1['business_name'];
    //   if ( isCTSAdmin) {
    //     feedbackDto['role'] = 'Customer Technical Service - Head';
    //   }
    //   if ( isCTS) {
    //     feedbackDto['role'] = 'Customer Technical Service';
    //   }
    //   if ( isPMUser) {
    //     feedbackDto['role'] = 'Product Manager';
    //   }
    // }
    await uploadFeedback(feedbackDto);
  };
  
  
  
  const uploadFeedback = async (feedbackDto) => {
    try {
      const sessionData = await AsyncStorage.getItem('@get_session');
      const getPlantId = await AsyncStorage.getItem('@plantId');
      const jsonSessionData = JSON.parse(sessionData);
      const plantId = JSON.parse(getPlantId);
  
      const filesArray = [];

      showInfo.docs.forEach(file => {
        const path = Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;
        filesArray.push({
          name: 'files',
          filename: file.name,
          type: file.type,
          data: RNFetchBlob.wrap(path),
        });
      });

  
      filesArray.unshift({
        name: 'feedbackDto',
        data: JSON.stringify(feedbackDto),
        type: 'application/json',
      });
  console.log("filesArray payload", filesArray);
  
      const resp = await RNFetchBlob.config({
        timeout: 5 * 60 * 1000,
      }).fetch(
        'POST',
        `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.SUBMIT_FEEDBACK}`,
         {
          'Content-Type': 'multipart/form-data',
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          application: '1',
        },
        filesArray
      );
        setLoader(true);
        let res;
        res = await resp.json();
        console.log("res is", res);
        
        if (res.success && res.code == 200) {
          setLoader(false);
          // Alert.alert( "Ticket Submitted Successfully")
             Toast.show({
                type: 'success',
                text2:  "Ticket Submitted Successfully",
                visibilityTime: 2000,
                onHide: () => {
                  navigation.replace('Feed');
                },
              });
        } else {
            let errorString = '';
                for (let index in res.errors) {
                   errorString =  errorString.concat(res.errors[index]).concat(". ");
                }
                if (! errorString) {
                   errorString = res?.['message'].concat(" " + res?.['data']);
                }
                showMessage('error',  errorString);
                 errorString = '';
              }
    } catch (error) {
        setLoader(false);
      console.log('Upload Feedback Error:', error);
      showMessage('error', 'Something went wrong while uploading feedback.');
    } finally {
      setLoader(false);
    }
  };

    


  // const onSubmit = async () => {
  //   try {
  //     const sessionData = await AsyncStorage.getItem('@get_session');
  //     const getPlantId = await AsyncStorage.getItem('@plantId');
  //     let jsonSessionData = JSON.parse(sessionData);
  //     let plantId = JSON.parse(getPlantId);
  //     setLoader(true);
  //     // let data = {
  //     //   dispatchCompany: selectedOrd,
  //     //   dispatchCompanyId: auth.companyId,
  //     //   complaintType: type,
  //     //   productName: ProductList.find(_ => _._id == selectedProd)._label,
  //     //   productId: selectedProd,
  //     //   quantity: qty,
  //     //   feedbackCategory: CAT_CODES.find(_ => _._id == catCode)._label,
  //     //   feedbackCategoryId: catCode,
  //     //   feedbackSubcategory: subcatCode.find(_ => _._id == selectedValue)
  //     //     .subcategory,
  //     //   feedbackSubcategoryId: selectedValue,
  //     //   invoiceNo: invoice,
  //     //   batchNo: batchNo,
  //     //   details: detail,
  //     //   customerCode: auth.companyId, //missing may fix now
  //     //   customerName: auth.userName,
  //     //   code: '0000500130', //missing from getBranchAccess
  //     //   customerPlantName: auth.companyName, //missing
  //     //   businessUnit: auth.businessUnit,
  //     // };
  //     //console.log(showInfo)
  //     let showInfo2 = {
  //       batchNo: batch,
  //       businessUnit: showInfo.businessUnit,
  //       code: showInfo.code,
  //       complaintType: showInfo.complaintType,
  //       customerCode: showInfo.customerCode,
  //       customerName: showInfo.customerName,
  //       customerPlantName: showInfo.customerPlantName,
  //       details: showInfo.details,
  //       dispatchCompany: showInfo.dispatchCompany,
  //       dispatchCompanyId: showInfo.dispatchCompanyId,
  //       feedbackCategory: showInfo.feedbackCategory,
  //       feedbackCategoryId: showInfo.feedbackCategoryId,
  //       feedbackSubcategory: showInfo.feedbackSubcategory,
  //       feedbackSubcategoryId: showInfo.feedbackSubcategoryId,
  //       invoiceNo: invoice,
  //       productId: showInfo.productId,
  //       productName: showInfo.productName,
  //       quantity: qty,
  //     };
  //     const response = await RNFetchBlob.fetch(
  //       'POST',
  //       `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.SUBMIT_FEEDBACK}`,
  //       {
  //         'Content-Type': 'multipart/form-data',
  //         idbranch: plantId?.plantId,
  //         idcompany: jsonSessionData?.companyId,
  //         iduser: jsonSessionData?.moglixB2BUserId,
  //         token: jsonSessionData?.moglixB2BToken,
  //         application: '1',
  //       },
  //       [
  //         {
  //           name: 'feedbackDto',
  //           data: JSON.stringify(showInfo2),
  //           type: 'application/json',
  //         },
  //         // (showInfo.docs || []).map(_ => {
  //         //   console.log("Uploading file:", _.uri, _.name, _.type);
  //         //   return {
  //         //     name: 'files',
  //         //     filename: _.name,
  //         //     type: _.type,
  //         //     data: RNFetchBlob.wrap(_.uri),
  //         //   }
  //         // })
  //         ...(showInfo.docs || []).map(doc => {
  //           const path = Platform.OS === 'ios' ? doc.uri.replace('file://', '') : doc.uri;
  //           console.log("RNFetchBlob.wrap(path)", RNFetchBlob.wrap(path));

  //           return {
  //             name: 'files',
  //             filename: doc.name,
  //             type: doc.type,
  //             data: RNFetchBlob.wrap(path),
  //           };
  //         })
  //       ],
  //     );
  //     let res;
  //     const contentType = response.respInfo.headers['Content-Type'] || '';
  //     if (contentType.includes('application/json')) {
  //       res = await response.json();
  //       console.log("hit 1", res);

  //     } else {
  //       const raw = await response.text();
  //       console.log("hit 2", raw);
  //       console.warn('Unexpected response format:', raw);

  //       Toast.show({
  //         type: 'error',
  //         text2: 'Feedback not saved',
  //         visibilityTime: 4000,
  //       });
  //       return;
  //     }
  //     setLoader(false);
  //     if (res.success && res.code == 200) {
  //       Toast.show({
  //         type: 'success',
  //         text2: "Data saved successfully",
  //         visibilityTime: 2000,
  //         // autoHide: true,
  //         onHide: () => {
  //           navigation.navigate('Feed');
  //         },
  //       });
  //     }
  //   } catch (e) {
  //     setLoader(false);
  //     console.log("Error in voc", e);
  //     Toast.show({
  //       type: 'error',
  //       text2: 'Feedback not saved',
  //       visibilityTime: 4000,
  //       autoHide: true,
  //     });
  //   }
  // };

  const prepareData = () => {
    showInfo['quantity'] = qty;
    showInfo['invoiceNo'] = invoice;
    showInfo['batchNo'] = batch;
    navigation.navigate('Selection', { info: authData, oldInfo: showInfo });
  };

  // const renderItem = () => {
  //   return (
  //     <View style={styles.CardWrapper}>
  //      <View style={styles.row}>
  //         <View style={styles.col}>
  //           <Text style={styles.boldTxt}>Type</Text>
  //           <Text style={styles.lightTxt}>
  //             {showInfo.complaintType}
  //          </Text>
  //         </View>
  //       </View>
  //       <View style={styles.row}>
  //         <View style={styles.col}>
  //           <Text style={styles.boldTxt}>Invoice no.</Text>
  //           <Text style={styles.lightTxt}>
  //           {showInfo.invoiceNo}
  //          </Text>
  //         </View>

  //         <View style={styles.col}>
  //         <Text style={styles.boldTxt}>Batch no.</Text>
  //         <Text style={styles.lightTxt}>
  //         {showInfo.batchNo}
  //         </Text>
  //         </View>
  //       </View>

  //       <View style={styles.row}>
  //         <View style={styles.col}>
  //           <Text style={styles.boldTxt}>Product</Text>
  //           <Text style={styles.lightTxt}>
  //           {showInfo.productName}
  //           </Text>
  //         </View>

  //       <View style={styles.col}>
  //        <Text style={styles.boldTxt}>Complaint Qty.</Text>
  //         <Text style={styles.lightTxt}>
  //          {showInfo.quantity} MT
  //           </Text>
  //         </View>
  //       </View>
  //       <View style={styles.row}>
  //         <View style={styles.col}>
  //           <Text style={styles.boldTxt}>Created Date</Text>
  //           <Text style={styles.lightTxt}>
  //           12/12/2022 | 06:16 PM
  //           </Text>
  //         </View>
  //         <View style={styles.col}>
  //           <Text style={styles.boldTxt}>Sales Org</Text>
  //           <Text style={styles.lightTxt}>
  //           {showInfo.dispatchCompany==1?'BALC':'VALC'}
  //           </Text>
  //         </View>
  //       </View>
  //       <View style={[styles.row,{paddingBottom:15}]}>
  //         <View style={styles.col}>
  //           <Text style={styles.boldTxt}>Category</Text>
  //           <Text style={styles.lightTxt}>
  //           Quality
  //           </Text>
  //         </View>
  //         <View style={styles.col}>
  //           <Text style={styles.boldTxt}>Sub-Category</Text>
  //           <Text style={styles.lightTxt}>
  //           Blow Holes
  //           </Text>
  //         </View>
  //       </View>

  //     </View>
  //     )}

  return (
    <View style={styles.containerWrap}>
      {loader && (
        <CustomLoader fullScreen />
      )}
      <Header
        showBack
        showText={'Complaint'}
        showDiscard
        fromHome
        auth={auth}
      navigation={navigation}
      >
     </Header>
      <ScrollView
        style={{ flex: 1, borderTopColor: '#00000017', borderTopWidth: 1 }}>
        <View style={styles.CardWrapper}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.boldTxt}>Type</Text>
              <Text style={styles.lightTxt}>
                {showInfo.complaintType == 'Complaint'
                  ? 'Complaint'
                  : 'Suggestion'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={styles.EditTxt}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.boldTxt}>Invoice no.</Text>
              <Text style={styles.lightTxt}>{invoice}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.boldTxt}>Batch no.</Text>
              <Text style={styles.lightTxt}>{batch}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.boldTxt}>Product</Text>
              <Text style={styles.lightTxt}>{showInfo.productName}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.boldTxt}>Complaint Qty.</Text>
              <Text style={styles.lightTxt}>{qty} MT</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.boldTxt}>Created Date</Text>
              <Text style={styles.lightTxt}>
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Text>
            </View>
           <View style={styles.col}>
              <Text style={styles.boldTxt}>Sales Org</Text>
              <Text style={styles.lightTxt}>
                {showInfo.dispatchCompany == 1 ? 'BALC' : 'VALC'}
              </Text>
            </View>
          </View>
          <View style={[styles.row, { paddingBottom: 15 }]}>
            <View style={styles.col}>
              <Text style={styles.boldTxt}>Category</Text>
              <Text style={styles.lightTxt}>{showInfo.feedbackCategory}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.boldTxt}>Sub-Category</Text>
              <Text style={styles.lightTxt}>
                {showInfo.feedbackSubcategory}
              </Text>
            </View>
          </View>
        </View>
        {/* <View>
          <TouchableOpacity
            style={styles.addBoxBTn}
            onPress={() => prepareData()}>
            <Text style={styles.addBoxBtnTxt}>Add another box</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
      <TouchableOpacity disabled={loader} onPress={createFeedback}>
        <View
          style={{
            padding: Dimension.padding12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            //borderTopWidth: 1,
            backgroundColor: '#0064A8',
            marginTop: Dimension.margin10,
            flexDirection: 'row',
          }}>
          {/* {loader && <ActivityIndicator size={'small'} color={'#fff'} />} */}
          <Text style={styles.BtnTxt}>Submit Ticket</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ComplaintDetailScreen;
