import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Toast from 'react-native-toast-message';
// import { Picker } from '@react-native-picker/picker';
import { ScannerService } from '../../services/scannerService';
import Dimension from '../../Theme/Dimension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { filterTextRegex, TOKEN_RESP } from '../../constants';
import CONSTANTS from '../../services/constant';
import styles from './style';
import Header from '../../component/Header';
import { pick, keepLocalCopy } from '@react-native-documents/picker'
import Colors from '../../Theme/Colors';
import Select from '../../component/Select';
import { useDispatch, useSelector } from 'react-redux';
import CustomLoader from '../../component/customLoader';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFeedbackSubCategoryRequest } from '../../redux/feature/vocSlice';
import { STATE_STATUS } from '../../redux/constants';
// import {Toast} from 'react-native-toast-message';
const Homescreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth?.data);
  const plantName = useSelector(state => state.searchPlants?.searchPlants?.data?.plants)
  const feedbackCat = useSelector(state => state.vocList?.feedbackCategory?.data);
  const feedbackSubCat = useSelector(state => state.vocList?.feedbackSubCategory?.data);
  const cchpProductVariants = useSelector(state => state.vocList.CCHPProductVariants?.data?.result)
  const subCatList = useSelector(state => state.vocList?.feedbackSubCategory?.data)
  const subCatListStatus = useSelector(state => state.vocList?.feedbackSubCategory?.status)
  const [autoFetchData, setAutoFetchData] = useState(
    route?.params?.autoFetched || '',
  );
  const [auth, setAuth] = useState(route?.params?.userInfo);
  const [catCode, SelectCategory] = useState('');
  const [catCodeIndex, SelectCategoryIndex] = useState('');
  const [type, setType] = useState(route?.params?.type || '');
  const [subcatCode, SelectSub] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState('');
  const [selectedOrd, setOrg] = useState('');
  const [selectedOrgId, setOrgId] = useState('');
  const [selectedProd, setProd] = useState('');
  const [qty, setQty] = useState('0');
  const [plantcode, setCode] = useState('');
  const [invoice, setInvoice] = useState('');
  const [batchNo, setBatch] = useState('');
  const [detail, setDetail] = useState('');
  const [docs, setDocs] = useState([]);
  const [loader, setLoader] = useState(false);
  //const [radioButtons, setRadioButtons] = useState(radioButtonsData);

  let categoryOptions = [
    { value: 'Finance', label: 'Finance' },
    { value: 'Logistics', label: 'Logistics' },
    { value: 'Quality', label: 'Quality' },
    { value: 'Public Limited', label: 'Public Limited' },
    { value: 'Product Manager', label: 'Product Manager' },
    { value: 'Central Marketing', label: 'Central Marketing' },
    { value: 'IT Error', label: 'IT Error' },
  ];
  let ProductList = [
    { _id: 'Flip Coil', _label: 'Flip Coil' },
    { _id: 'Ingot', _label: 'Ingot' },
    { _id: 'Wire Rod', _label: 'Wire Rod' },
    { _id: 'Rolled Sheet', _label: 'Rolled Sheet' },
    { _id: 'Rolled Coil', _label: 'Rolled Coil' },
    { _id: 'Rolled Plate', _label: 'Rolled Plate' },
    { _id: 'PFA', _label: 'PFA' },
    { _id: 'Billet', _label: 'Billet' },
    { _id: 'Hot Metal', _label: 'Hot Metal' },
    { _id: 'Slab', _label: 'Slab' },
  ];
  let saleOrgOptions = [
    { label: "VALC", value: "VALC" },
    { label: 'BALC', value: 'BALC' },
  ]
  let typeOptions = [
    // { label: "Select Sales Org", value: "" },
    { label: "Complaint", value: "Complaint" },
    { label: "Feedback", value: "Feedback" },
    { label: "Product Development", value: "Product Development" }
  ]
  let CAT_CODES = [
    { _id: 1, _label: 'Finance' },
    { _id: 2, _label: 'Logistics' },
    { _id: 3, _label: 'Quality' },
    { _id: 6, _label: 'Product Manager' },
    { _id: 7, _label: 'Central Marketing' },
    { _id: 8, _label: 'IT Error' },
  ];


  useEffect(() => {
    if (route?.params?.autoFetched) {
      if (autoFetchData?.salesOrg == 'VALC') {
        setOrg('VALC');
        setOrgId('9093');
      } else {
        setOrg('BALC');
        setOrgId('1');
      }
      setProd(autoFetchData?.matType);
      setQty(autoFetchData?.netWt);
      setInvoice(autoFetchData?.invoiceNum);
      setBatch(autoFetchData?.batchNo);
      setDetail(autoFetchData?.matDesc);
    }
    callBranchAccess();
  }, []);
  
  useEffect(() => {
   
    if (subCatListStatus === STATE_STATUS?.FETCHING) {
      setLoader(true);
    }
    if (subCatListStatus === STATE_STATUS?.FETCHED || subCatListStatus === STATE_STATUS?.FAILED) {
      setLoader(false); 
    }
  }, [subCatListStatus]);
  
  const callBranchAccess = async () => {
    ScannerService.GetBranchAcc(auth)
      .then(data => {
        if (data.successful && data.status == 200) {
          //console.log("user",userInfo)
          setCode(data.data.branchModules.plantCode);
          // setAuth(auth["PlantCode"]=data.data.branchModules.plantCode);
        }
      })
      .catch(e => console.log(e));
  };
 
  const ProductChange = async (value) => {
    setProd(value);
    SelectCategory('');
  }
  const CategoryChange = async (value) => {
    const index = feedbackCat?.find(name => name.category === value)?.id;
    SelectCategoryIndex(index);
    setSelectedValue('');
    dispatch(
      getFeedbackSubCategoryRequest({
        feedbackCategoryId: index,
        businessUnit: auth?.businessUnit,
        ...(auth?.businessUnit === "Aluminium" && { productVariant:selectedProd })               
                    }),
                );
    // ScannerService.OpenSubCategory(auth, `${index}/` + auth.businessUnit)
    //   .then(response => {
    //     if (response.success && response.code == 200) {
    //       setLoader(false);
    //       SelectSub(response.data);
    //     } else {
    //       Toast.show({
    //         type: 'error',
    //         text2: response.message || 'Something went wrong!',
    //         visibilityTime: 4000,
    //         autoHide: true,
    //       });
    //       setLoader(false)
    //       // alert(response.message);
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     setLoader(false)
    //     Toast.show({
    //       type: 'error',
    //       text2: 'Something went wrong!',
    //       visibilityTime: 4000,
    //       autoHide: true,
    //     });
    //   });
    // setLoader(false);
    SelectCategory(value);
    
  };

  const SubCaetgoryChange = (itemInfo, index) => {
    console.log("itembox", itemInfo, index);

    setSelectedValue(itemInfo);
    setSelectedIndex(itemInfo)
  };
  console.log("subCatList is here", subCatList);
  
  const subCategoryOptions = subCatList?.length>0? subCatList?.map(item => ({
    value: item.subcategory,
    label: item.subcategory,
  })): [];

  // let subCategoriesItems = subcatCode.map(itemValue => {
  //   return (

  //     <Picker.Item
  //       key={itemValue.categoryId}
  //       value={itemValue._id}
  //       label={itemValue.subcategory}
  //       fontFamily={Dimension.CustomMediumFont}
  //       style={styles.pickerStyle}
  //       fontSize={Dimension.font14}
  //     />
  //   );
  // });

  let productLists = ProductList.map(itemValue => ({
    value: itemValue._label,
    label: itemValue._label,
  
  }));

  // console.log("catCode",feedbackCat,"feedbackCat",catCodeIndex,"catCodeIndex", feedbackCat?.find(_ => _.id == catCodeIndex)?.category);

  const onSubmit2 = () => {
    console.log("hit on submit 2");
    
    let data = {
      dispatchCompany: selectedOrd,
      dispatchCompanyId: selectedOrgId,
      complaintType: type,
      productName : cchpProductVariants?.find(prod => prod.productName === selectedProd)?._id,
      productId: cchpProductVariants?.find(prod => prod.productName === selectedProd)?._id,
      // productName: ProductList.find(_ => _._id == selectedProd)._label,
      // productId: selectedProd,
      quantity: qty,
      feedbackCategory: feedbackCat?.find(_ => _.id == catCodeIndex)?.category,
      feedbackCategoryId: catCodeIndex,
      feedbackSubcategory: selectedValue,
      feedbackSubcategoryId: subcatCode.find(
        _ => _.subcategory === selectedIndex
      )?._id,
      invoiceNo: invoice,
      batchNo: batchNo,
      details: detail,
      customerCode: auth.companyId,
      customerName: auth.userName,
      code: plantcode, //missing from getBranchAccess
      customerPlantName: auth.companyName,
      businessUnit: auth.businessUnit,
      docs,
    };
    if (
      route.params.oldData &&
      route.params.oldData.productId != selectedProd
    ) {
      Toast.show({
        type: 'error',
        text2: "Product Id is different.Can't Add multiple Product!",
        visibilityTime: 4000,
        autoHide: true,
      });
      // alert("Product Id is different.Can't Add multiple Product");
    } else {
      navigation.navigate('ComplaintDetail', {
        userData: data,
        authData: authData,
        capturedData: route.params.oldData,
      });
    }
  };
    const handleQtyChange = (input) => {
      const validInput = input.replace(/[^0-9.]/g, '');
      const parts = validInput.split('.');
      if (parts.length > 2) return;
      if (parts[1]?.length > 3) return;
      //  const numericVal = input.replace(/[^0-9]/g, ''); 
        
      setQty(validInput);
    };
  
    const isDisabled = () => {
      const isAluminium = authData?.businessUnit === 'Aluminium';
    
      const commonFieldsFilled = catCode &&
        type &&
        selectedValue &&
        selectedProd &&
        qty &&
        invoice &&
        batchNo &&
        detail;
    
      if (isAluminium) {
        return !(commonFieldsFilled && selectedOrd);
      } else {
        return !commonFieldsFilled;
      }
    };

  
  // const isDisabled = () => {
  //   let alVal;
  //   if (authData?.businessUnit === 'Aluminium') {
  //     alVal = selectedOrd;
  //   }
  //   if (
  //     catCode &&
  //     type &&
  //     selectedValue &&
  //     // selectedOrd &&
  //     selectedProd &&
  //     qty &&
  //     invoice &&
  //     batchNo &&
  //     detail
  //   ) {
  //     return false;
  //   }
  //   return true;
  // };
  console.log("isDisabled():", isDisabled());

const openPicker = async () => {
  try {
    const response = await pick({ allowMultiSelection: true });
console.log(response, "response");

    if (!response || response.length === 0) return;

    const filesWithLocalPath = await Promise.all(
      response.map(async (file) => ({
        ...file,
        // localPath: await keepLocalCopy({ uri: file.uri }),

      }))
    );

    const newFilesTotalSize = filesWithLocalPath.reduce(
      (sum, file) => sum + (file.size || 0),
      0
    );
    const existingFilesTotalSize = docs.reduce(
      (sum, file) => sum + (file.size || 0),
      0
    );
    const combinedSize = newFilesTotalSize + existingFilesTotalSize;

    const MAX_TOTAL_SIZE = 10 * 1024 * 1024; 

    if (combinedSize > MAX_TOTAL_SIZE) {
      Toast.show({
        type: 'error',
        text2: 'Total file size should not exceed 10MB',
        visibilityTime: 4000,
        autoHide: true,
      });
      return;
    }

    setDocs([
      ...docs,
      ...filesWithLocalPath.map((file) => ({
        ...file,
        id: Date.now() + Math.random(), 
      })),
    ]);
  } catch (err) {
    console.error('Error while picking documents:', err);
  }
};

  
  // const openPicker = async () => {
  //   const response = await DocumentPicker.pick({
  //     presentationStyle: 'fullScreen',
  //   });
  //   const newFilesTotalSize = response.reduce((sum, file) => sum + file.size, 0);
  //   const existingFilesTotalSize = docs.reduce((sum, file) => sum + file.size, 0);
  //   const combinedSize = newFilesTotalSize + existingFilesTotalSize;
  //   const MAX_TOTAL_SIZE = 10 * 1024 * 1024;
  //   if (combinedSize > MAX_TOTAL_SIZE) {
  //     // Alert.alert('Total file size should not exceed 8MB');
  //     Toast.show({
  //       type: 'error',
  //       text2: 'Total file size should not exceed 8MB',
  //       visibilityTime: 4000,
  //       autoHide: true,
  //     });
  //     return;
  //   }
  //   setDocs([
  //     ...docs,
  //     ...response.map(_ => ({
  //       ..._,
  //       id: Date.now(),
  //     })),
  //   ]);
  // };

  const onRemove = id => {
    let tempDocs = [...docs];
    tempDocs = tempDocs.filter(_ => _.id != id);
    setDocs([...tempDocs]);
  };

  console.log(navigation, "navigation");
  
  return (
    
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>

      {/* <StatusBar
        translucent
        backgroundColor="#F0F7FF"
        barStyle={'dark-content'}
      /> */}
      {loader && (
        <CustomLoader fullScreen />
      )}
      <Header
        navigation={navigation}
        showBack
        showNotification
        fromHome
        auth={auth}
      />

      <ScrollView
        style={{
          flex: 1,
          padding: Dimension.padding15,
          backgroundColor: '#fff',
          elevation: 8,
          shadowColor: '#455B631A',
          borderTopColor: '#455B631A',
          borderTopWidth: 1,
        }}
        contentContainerStyle={{ paddingBottom: Dimension.padding80 }}>
        <View>
          <Text style={styles.labelStyle}>Type*</Text>
          <Select
            selectedValue={type}
            placeHolder="Select Type"
            onChange={(itemValue) =>
              setType(itemValue)
            }
            fromDD={false}
            options={typeOptions}
            containerStyle={{
              borderColor: Colors.FontColor,
              marginTop: 0
            }}
          />
          {authData?.businessUnit === 'Aluminium' ? 
            <>
          <Text style={styles.labelStyle}>Sales Org*</Text>
          <Select
            selectedValue={selectedOrd}
            placeHolder="Select Sales Org"
            onChange={(itemValue) => {
              setOrg(itemValue);
              setOrgId(itemValue === 'VALC' ? '9093' : '1');
            }}
            fromDD={false}
            options={saleOrgOptions}
            containerStyle={{
              borderColor: Colors.FontColor,
              marginTop: 0
            }}
              /> 
            </>
            : null}
        
          <Text style={styles.labelStyle}>Product*</Text>
          <Select
            selectedValue={selectedProd}
            placeHolder="Select Product"
            onChange={(itemValue) => {
                // const index = feedbackCat?.findIndex(opt => opt.value === itemValue) + 1;
                ProductChange(itemValue);
              }
           }
            fromDD={false}
            
            options={[
              ...(cchpProductVariants ? Object.values(cchpProductVariants).map(customer => ({
                  value: customer.productName,
                  label: customer.productName,
              })):[]
              //   .sort((a, b) =>
              //     a.label.toLocaleLowerCase().localeCompare(b.label.toLocaleLowerCase())
              // ) : []
              // ),
  )]}
            // options={productLists}
            containerStyle={{
              borderColor: Colors.FontColor,
              marginTop: 0
            }}
          />
      
          <Text style={styles.labelStyle}>Quantity (MT)*</Text>
          <TextInput
            editable={true}
            value={qty}
            onChangeText={handleQtyChange}
            style={styles.txtInputCss}
            keyboardType={'number-pad'}
          />
          <Text style={styles.labelStyle}>Category*</Text>
          {/* <View style={styles.pickerWrap}> */}
          <Select
            selectedValue={catCode}
            placeHolder="Select Category"
            onChange={(itemValue) => {
              // const index = feedbackCat?.findIndex(opt => opt.value === itemValue) + 1;
              CategoryChange(itemValue);
            }}
            disabled={ !selectedProd}  
            fromDD={false}
            options={[
              ...(feedbackCat ? Object.values(feedbackCat).map(category => ({
                  value: category.category,
                  label: category.category,
              })) : []),
          ]}
            // options={categoryOptions}
            containerStyle={{
              borderColor: Colors.FontColor,
              marginTop: 0
            }}
          />
          <>
            
            {catCode !== '' && (
              <>
                <Text style={styles.labelStyle}>Sub-Category*</Text>
                <Select
                  selectedValue={selectedValue}
                  placeHolder="Select Sub Category"
                  onChange={(itemValue) => {
                    const index = subCategoryOptions.findIndex(opt => opt.value === itemValue) + 1;
                    SubCaetgoryChange(itemValue, index);
                  }}
                  // onChange={(itemValue) => SubCaetgoryChange(itemValue)}
                  disabled={loader}
                  options={subCategoryOptions}
                  containerStyle={{
                    borderColor: Colors.FontColor,
                    marginTop: 0,
                  }}
                />
              </>
            )}
          </>

          <Text style={styles.labelStyle}>Invoice No.*</Text>
          <TextInput
            editable={autoFetchData?.invoiceNum ? false : true}
            placeholder='Enter Invoice No.'
            value={invoice || null}
            onChangeText={input => {
              // const alphanumericInput = input.replace(filterTextRegex, '');
              setInvoice(input.replace(/[^a-zA-Z0-9]/g, ''));
            }}
            style={styles.txtInputCss}
          />
          <Text style={styles.labelStyle}>Batch No*</Text>
          <TextInput
            editable={autoFetchData ? false : true}
            placeholder='Enter Batch No'
            value={batchNo}
            onChangeText={input => setBatch(input)}
            style={styles.txtInputCss}
          />
          <Text style={styles.labelStyle}>Details*</Text>
          <TextInput
            // editable={autoFetchData ? false : true}
            value={detail}
            placeholder='Enter Details'
            onChangeText={input => setDetail(input)}
            multiline={true}
            numberOfLines={4}
            style={[styles.TxtInputDetail,{textAlignVertical: 'top',}]}
          />
          <Text style={styles.labelStyle}>Documents Uploaded</Text>
          <TouchableOpacity
            onPress={openPicker}
            style={[styles.txtInputCss, {
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: '#fff'
            }]}>
            <Text style={{ color: '#000' }}>{docs.length} Files Uploaded</Text>
            <Icon
              name="file-upload-outline"
              size={20}
              color="#0063A7"
            />
          </TouchableOpacity>
          {docs.map((doc, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: Dimension.width130,
                borderColor: Colors.darkBlue,
                borderWidth: 1,
                padding: Dimension.padding4,
                borderRadius: 4,
                marginBottom: Dimension.margin12,
              }}>
              <Text
                numberOfLines={1}
                style={{ color: Colors.darkBlue, width: '80%' }}>
                {doc.name}
              </Text>
              <Icon
                onPress={() => onRemove(doc.id)}
                name="close"
                color={Colors.darkBlue}
                size={16}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={{
          padding: Dimension.padding10,
          borderTopColor: '#F2F2F2',
          bobackgroundColor: '#fff',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderTopWidth: 1,
          backgroundColor: '#fff',
          marginTop: Dimension.margin10,
        }}>
        <TouchableOpacity
          disabled={loader || isDisabled()}
          onPress={onSubmit2}
          style={
            loader || isDisabled()
              ? styles.DisabledScannerBtn
              : styles.ScannerBtn
          }>
          {/* {loader && <ActivityIndicator size={'small'} color={'#fff'} />} */}
          <Text style={styles.BtnTxt}>Save Info</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Homescreen;
