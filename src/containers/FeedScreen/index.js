import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  Button,
  View,
  Text,
  FlatList,
  BackHandler,
  Alert,
  StyleSheet,
  ScrollView,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Modal,
  Image,
  Platform
} from 'react-native';
import { ScannerService } from '../../services/scannerService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dimension from '../../Theme/Dimension';
import Colors from '../../Theme/Colors';
import styles from './style';
import Header from '../../component/Header';
import { useFocusEffect } from '@react-navigation/native';
import CONSTANTS from '../../services/constant';
//import { Card} from "react-native-elements";
import CustomeIcon from '../../component/CustomeIcon';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
//import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginContext from '../../context/loginContext';
import { useSelector, useDispatch } from 'react-redux';
import { getApprovedCustomerListRequest, getNfaCustomerListRequest } from '../../redux/feature/mouslice';
import { getCCHPProductVariantsRequest, getFeedbackCategoryRequest } from '../../redux/feature/vocSlice';
import CustomLoader from '../../component/customLoader';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//import { useNavigation } from "@react-navigation/native";
//import { createStackNavigator, createAppContainer } from 'react-navigation';

const FeedScreen = props => {
  const authReducer = useSelector(state => state.auth?.data);
   const branchAccessData = useSelector(state => state.branchAccess);
  //const navigation = useNavigation();
  const [showCreateNew, setShowCreateNew] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [userInfo, setUser] = useState();
  const [dataModal, setDataModal] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [auth, setAuth] = useState({});
  const [listing, setListing] = useState([]);
  const [closelisting, setClosedListing] = useState([]);
  const [searchlisting, setSearchListing] = useState([]);
  const [search, setSearch] = useState('');
  const [searchType, setStype] = useState(false);
  const [showType, setType] = useState('Complaint');
  const [isLoader, setIsLoader] = useState(false);
  let webview = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    getSession();
  }, []);
  const FeedListing = info => {
    let type;
    if (
      info?.userEmail?.split('@')?.[1] == 'vedanta.co.in' ||
      info?.userEmail?.split('@')?.[1] == 'moglix.com'
    ) {
      type = 'Supplier';
    } setIsLoader(true);
    //console.log(auth)
    ScannerService.FeedList(info, 'Complaint', type)
      .then(data => {
       
        console.log("data of feedListing", data);
        if (data?.success) {
          setListing(data.data.feedbackList);
          ClosedListing(info);
          setIsLoader(false);
          return;
        }
        setIsLoader(false);
      })
      .catch(e => {
        setIsLoader(false);
        console.log(e);
        return;
      });
  };

  // handle backbutton
  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert('Hold on!', 'Are you sure you want to go back?', [
  //       {
  //         text: 'Cancel',
  //         onPress: () => null,
  //         style: 'cancel',
  //       },
  //       {text: 'YES', onPress: () => BackHandler.exitApp()},
  //     ]);
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.removeEventListener("hardwareBackPress",console.log("ok"));
  // }, []);

  const ClosedListing = info => {
    let type;
    if (
      info?.userEmail?.split('@')?.[1] == 'vedanta.co.in' ||
      info?.userEmail?.split('@')?.[1] == 'moglix.com'
    ) {
      type = 'Supplier';
    }
    ScannerService.FeedList(info, 'Feedback', type)
      .then(data => {
        setClosedListing(data.data.feedbackList);
        return;
      })
      .catch(e => {
        console.log(e);
        return;
      });
  };

  const convertedDate = time => {
    try {
      return new Date(time).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    } catch (error) {
      return new Date();
    }
  };

  const CallSession = async (message) => {
    setUser(message);
    ScannerService.GetSession(message)
      .then(data => {
        if (data.successful) {
          message['branchId'] = Object.keys(
            data.data.companyData.branchNames,
          )[0];
          message['companyId'] = Object.keys(
            data.data.companyData.companyNames,
          )[0];
          message['companyName'] = Object.values(
            data.data.companyData.companyNames,
          )[0];
          setUser(message);
          dispatch(
            getNfaCustomerListRequest({
                businessUnit: authReducer?.businessUnit
            })
        )
          FeedListing(message);
          getDataFunc(message);
          // ClosedListing(message);
        } else {
          ToastAndroid.show(data.message, ToastAndroid.SHORT);
          Logout();
        }
      })
      .catch(err => {
        // Logout();
        console.log(err);
      });
  };

  // const LogoutFn = async () => {
  //   await AsyncStorage.removeItem('@user_info');
  //   dispatch(
  //     setAuth({
  //       status: STATE_STATUS.UNFETCHED,
  //       data: {},
  //     })
  //   );
  //   navigation.navigate('LoginFirst')
  // };

  const Logout = async () => {
    // authReducer.isLoggedIn(false);
    await AsyncStorage.clear();
    await AsyncStorage.setItem('@first_login_after_logout', 'true');
  };

  // useFocusEffect(
  //   React.useCallback(() => {

  

  const getSession = async () => {
    let jsonValue = await AsyncStorage.getItem('@user_info');
    jsonValue = jsonValue != null ? JSON.parse(jsonValue) : null;
    setAuth(jsonValue);
    CallSession(jsonValue);
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

  //   }, []),
  // );

  const toggleDataModal = item => {
    setSelectedData(item);
    setDataModal(!dataModal);
  };

  const searchComp = () => {
    if (search.length > 0) {
      setIsLoader(true);
      ScannerService.SearchList(auth, search.toUpperCase())
        .then(data => {
          if (data.success) {
            setSearchListing(data.data.feedbackList);
            setStype(true);
            setIsLoader(false)
          }
        })
        .catch(e => {
          setIsLoader(false)
          console.log(e);
        });
    }
  };

  const handleNewTicket = () => {
    try {
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
     
      {
        authReducer?.businessUnit === 'Aluminium' ?
          props.navigation.navigate('Selection', { info: userInfo }) :
            props?.navigation.navigate('Homes', {
              oldData: props?.route?.params?.oldInfo,
              userInfo: userInfo,
              //  type: 'complaint'
            })
      }
    } catch (err) {
      console.log("Error", err);
      
    }
  }

  const handleSearch = () => {
    
  }
  const openCustomer = () => {
    //email=s.swetha@vedanta.co.in&pwd=dontKnow&BU=Aluminium
    let navURL =
      CONSTANTS.WEBURL.CUSTOMER +
      'email=' +
      's.swetha@vedanta.co.in' +
      '&pwd=' +
      '=dontKnow' +
      '&BU=Aluminium';
    props.navigation.navigate('WebView', { URL: navURL });
  };

  const renderItem = ({ item, index }) => {
    // console.log(item);
    return (
      <View style={styles.CardWrapper}>
        <View style={styles.statusWrap}>
          <View style={{ flexDirection: 'row', marginTop: 3 }}>
            {item.status == 'Open' ? (
              <View style={styles.Greendot}></View>
            ) : (
              <View style={styles.Reddot}></View>
            )}
            <Text
              style={[
                styles.statustxt,
                { color: item.status == 'Open' ? '#90EE90' : '#D9232D' },
              ]}>
              {item.status}
            </Text>
          </View>
          <MaterialCommunityIcon
            name={'chevron-right'}
            size={20}
            color={'#363636'}
            onPress={() => toggleDataModal(item)}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.boldTxt}>
              {showType == 'Complaint' ? 'Complaint' : 'Suggestion'} no.
            </Text>
            <Text style={styles.lightTxt}>{item.id}</Text>
          </View>

          <View style={styles.col}>
            <Text style={styles.boldTxt}>Type</Text>
            <Text style={styles.lightTxt}>
              {item.complaintType == 'Complaint' ? 'Complaint' : 'Suggestion'}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.boldTxt}>Invoice no.</Text>
            <Text style={styles.lightTxt}>{item.invoiceNo}</Text>
          </View>

          <View style={styles.col}>
            <Text style={styles.boldTxt}>Batch no.</Text>
            <Text style={styles.lightTxt}>{item.batchNo}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.boldTxt}>Product</Text>
            <Text style={styles.lightTxt}>{item.productName}</Text>
          </View>

          <View style={styles.col}>
            <Text style={styles.boldTxt}>Complaint Qty.</Text>
            <Text style={styles.lightTxt}>{item.quantity}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.boldTxt}>Created Date</Text>
            <Text style={styles.lightTxt}>{convertedDate(item.createdOn)}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.boldTxt}>Sales Org</Text>
            <Text style={styles.lightTxt}>
              {item.dispatchCompany == '1' || item.dispatchCompany == 'BALC'
                ? 'BALC'
                : 'VALC'}
            </Text>
          </View>
        </View>
        <View style={[styles.row, { paddingBottom: 15 }]}>
          <View style={styles.col}>
            <Text style={styles.boldTxt}>Category</Text>
            <Text style={styles.lightTxt}>{item.feedbackCategory}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.boldTxt}>Sub-Category</Text>
            <Text style={styles.lightTxt}>{item.feedbackSubcategory}</Text>
          </View>
        </View>
        {/* <View style={styles.row}>
          <View style={styles.col}>
           <Text style={styles.boldTxt}>Sub-Category</Text> 
          <Text style={styles.lightTxt}>
          {item.feedbackSubcategory}
          </Text>
          </View>
        </View> */}
      </View>
    );
  };
  return (
  <>
     {isLoader && <CustomLoader fullScreen />}
    <View style={styles.containerWrap}>
      <Header
        navigation={props.navigation}
        showBack
        showLogo
        showLogout
        // logoutAction={Logout}
        fromHome
        auth={auth}
      //showMenu
      //showExportData
      />
      <View style={styles.TopWrap}>
        <Text style={styles.username}>Hii {auth?.userName}</Text>
        <Text style={styles.welcome}>Welcome back to Vedanta Metalbazaar</Text>
        <View style={styles.SearchWrap}>
          <TouchableOpacity onPress={searchComp} style={styles.searchIcon}>
            <Image
              source={require('../../assets/images/icon_search2.png')}
              style={styles.image}
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Search by Complaint No"
            value={search}
            autoCapitalize={'characters'}
            onChangeText={search => setSearch(search)}
            onSubmitEditing={searchComp}
            style={styles.searchBar}
            editable={true}
          />
          {searchType ? (
            <TouchableOpacity
              onPress={() => {
                setSearch(''), setStype(false);
              }}
              style={styles.ClearBtn}>
              <Text style={styles.ClearBtnTxt}>Clear Now</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={searchComp} style={styles.searchbtn}>
              <Text style={styles.searchTxt}>Search</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View>
        {searchType ? (
          <View>
            <Text style={[styles.searchedTxt, {fontSize: Dimension.font16, fontWeight:'600',fontFamily:Dimension.CustomBoldFont, paddingBottom:5}]}>
              {searchlisting ? searchlisting.length : 0} searched item
            </Text>
            <FlatList
              data={searchlisting}
              renderItem={renderItem}
              contentContainerStyle={{  paddingHorizontal: Dimension.padding15,
                // paddingTop: Dimension.margin8,
                paddingBottom:300, }}
            />
          </View>
        ) : (
          <View>
            <View style={styles.midWrap}>
              <Text style={styles.CSTxt}>Complaint details by Status</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => setType('Complaint')}
                  style={
                    showType == 'Complaint'
                      ? styles.ActiveOpenBtn
                      : styles.OpenBtn
                  }>
                  <Text style={styles.Orangetxt}>Complaints</Text>
                  <Text style={styles.Orangetxt}>
                    {' '}
                    {listing ? listing.length : 0}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setType('Feedback')}
                  style={
                    showType == 'Feedback'
                      ? styles.ActiveOpenBtn
                      : styles.CloseBtn
                  }>
                  <Text style={styles.Greentxt}>Suggestions</Text>
                  <Text style={styles.Greentxt}>
                    {' '}
                    {closelisting ? closelisting.length : 0}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={showType == 'Complaint' ? listing : closelisting}
              renderItem={renderItem}
              contentContainerStyle={{
                paddingHorizontal: Dimension.padding15,
                // paddingTop: Dimension.margin8,
                paddingBottom: Platform.OS === 'ios'? 500: 400
              }}
            // style={{paddingHorizontal:Dimension.padding8,paddingTop:Dimension.margin8,}}
            />
          </View>
        )}
      </View>
      {showCreateNew ? (
        <View style={styles.footerbtn}>
          <TouchableOpacity
            disabled={isDisabled}
            onPress={() => handleNewTicket()}
            
            style={styles.createBtn}>
            <Text style={styles.createBtnTxt}>Create New Ticket</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {dataModal && (
        <Modal
          overlayPointerEvents={'auto'}
          visible={dataModal}
          //  onTouchOutside={toggleDataModal}
          //  onDismiss={toggleDataModal}
          // coverScreen={true}
          style={styles.modalbg}
          animationType={'slide'}
          transparent={true}
        // deviceWidth={deviceWidth}
        // onBackButtonPress={toggleDataModal}
        //  onBackdropPress={toggleDataModal}
        >
          <View style={styles.modalInner}>
            <View style={styles.ModalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.headText}>
                  {selectedData.complaintType == 'Complaint'
                    ? 'Complaint'
                    : 'Suggestion'}{' '}
                  Detail{' '}
                </Text>
                <TouchableOpacity onPress={() => setDataModal(false)}>
                  <Icon name="close-circle" size={22} color={'#3c3c3c'} />
                </TouchableOpacity>
              </View>
              <ScrollView>
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Text style={styles.ModalboldTxt}>
                      {selectedData.complaintType == 'Complaint'
                        ? 'Complaint'
                        : 'Suggestion'}{' '}
                      no.
                    </Text>
                    <Text style={styles.ModallightTxt}>{selectedData.id}</Text>
                  </View>

                  <View style={styles.col}>
                    <Text style={styles.ModalboldTxt}>Type</Text>
                    <Text style={styles.ModallightTxt}>
                      {selectedData.complaintType == 'Complaint'
                        ? 'Complaint'
                        : 'Suggestion'}
                    </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Text style={styles.ModalboldTxt}>Invoice no.</Text>
                    <Text style={styles.ModallightTxt}>
                      {selectedData.invoiceNo}
                    </Text>
                  </View>

                  <View style={styles.col}>
                    <Text style={styles.ModalboldTxt}>Batch no.</Text>
                    <Text style={styles.lModalightTxt}>
                      {selectedData.batchNo}
                    </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Text style={styles.ModalboldTxt}>Product</Text>
                    <Text style={styles.ModallightTxt}>
                      {selectedData.productName}
                    </Text>
                  </View>

                  <View style={styles.col}>
                    <Text style={styles.ModalboldTxt}>Complaint Qty.</Text>
                    <Text style={styles.ModallightTxt}>
                      {selectedData.quantity}
                    </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Text style={styles.ModalboldTxt}>Created Date</Text>
                    <Text style={styles.ModallightTxt}>
                      {convertedDate(selectedData.createdOn)}
                    </Text>
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.ModalboldTxt}>Sales Org</Text>
                    <Text style={styles.ModallightTxt}>
                      {selectedData.dispatchCompany}
                    </Text>
                  </View>
                </View>
                <View style={[styles.row, { paddingBottom: 15 }]}>
                  <View style={styles.col}>
                    <Text style={styles.ModalboldTxt}>Category</Text>
                    <Text style={styles.ModallightTxt}>
                      {selectedData.feedbackCategory}
                    </Text>
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.ModalboldTxt}>Sub-Category</Text>
                    <Text style={styles.ModallightTxt}>
                      {selectedData.feedbackSubcategory}
                    </Text>
                  </View>
                </View>
                <View style={[styles.row]}>
                  <View style={styles.col}>
                    <Text style={styles.ModalboldTxt}>Business Unit</Text>
                    <Text style={styles.ModallightTxt}>
                      {selectedData.businessUnit}
                    </Text>
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.ModalboldTxt}>Customer Name</Text>
                    <Text style={styles.ModallightTxt}>
                      {selectedData.customerName}
                    </Text>
                  </View>
                </View>
                <View style={[styles.row]}>
                  <View style={styles.col}>
                    <Text style={styles.ModalboldTxt}>Customer PlantName</Text>
                    <Text style={styles.ModallightTxt}>
                      {selectedData.customerPlantName}
                    </Text>
                  </View>
                  <View style={styles.col}>
                    <Text style={styles.ModalboldTxt}>Supplier Status</Text>
                    <Text style={styles.ModallightTxt}>
                      {selectedData.supplierStatus}
                    </Text>
                  </View>
                </View>
                <View style={[styles.row]}>
                  <View style={styles.col}>
                    <Text style={styles.ModalboldTxt}>Description</Text>
                    <Text style={styles.ModallightTxt}>
                      {selectedData.details}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
      </View>
      </>
  );
};

export default React.memo(FeedScreen);
