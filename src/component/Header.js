import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  Alert,
  Platform,
  TouchableOpacity,
  Modal,
  Dimensions,
  BackHandler
} from 'react-native';
import Dimension from '../Theme/Dimension';
import colors from '../Theme/Colors';
import CustomeIcon from './CustomeIcon';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScannerService } from '../services/scannerService';
import { useSelector, useDispatch } from 'react-redux';
// import {getCreditBalanceRequest} from '../redux/feature/homeSlice';
import { STATE_STATUS } from '../redux/constants';
import Search from './Search';
import ListShow from './RenderList';
import {
  getSearchPlantRequest,
  getCreditBalanceRequest,
  getLCBGBalanceRequest,
} from '../redux/feature/homeSlice';
import CONSTANTS from '../services/constant';
import ENV from '../services/url';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Scanner from './Scanner';
import { ListViewBase } from 'react-native';
import { setBranchAccess } from '../redux/feature/branchSlice';
import { formatIndianCurrency } from '../utils/BiometricAuth';
import { setCartCount } from '../redux/feature/homeSlice';
import { setNotiCount } from '../redux/feature/notification';
const Header = props => {
  const {
    navigation,
    showBack,
    showText,
    showLogo,
    iconStyle,
    showMenu,
    showExportData,
    showDiscard,
    showNotification,
    showScanner,
    showFolder,
    showPlant,
    showLogout,
    fromHome,
    auth,
    currentScreen,
    beforeLogin,
    showBackModal,
    exportData,
    showCart
  } = props;
  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth?.data);
  const branchAccessData = useSelector(state => state.branchAccess)
  const countCart = useSelector(state => state.wallet?.cartCount?.count)
  const walletData = useSelector(state => state?.wallet?.wallet?.data) || [];
  const walletLCBGData =
    useSelector(state => state?.wallet?.walletLCBG?.data) || [];
  const plantData =
    useSelector(state => state?.searchPlants?.searchPlants?.data?.plants) || [];
  const isCustomer = useSelector(state => state.branchAccess?.isCustomer);
  const notiCount = useSelector(state=> state?.notification?.notiCount)
  const [user, setUser] = useState({});
  const [checkUrl, setCheckUrl] = useState({});
  const [userType, setUserType] = useState(false);
  const [walletModal, setWalletModal] = useState(false);
  const [plantModal, setPlantModal] = useState(false);
  const [isSupplier, setSupplier] = useState(false);
  // const [notiCount, setNotiCount] = useState(0);
  // const [countCart, setCartCount] = useState(0);
  const [lcbgBalance, setLCBGBalance] = useState({});
  useEffect(() => {
    checkDetail();
    getData();
    getSearchPlantData();
  }, []);
  useEffect(() => {
    notificationCount();
}, [])

  const notificationCount = async () => {
    try {
      const dataObj = {
        userId: authData?.userId || authData?.idUser
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
  const getSearchPlantData = async obj => {
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let plantId = JSON.parse(getPlantId);
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantCode = await AsyncStorage.getItem('@plantCode');
    let plantCode = JSON.parse(getPlantCode);

    let jsonSessionData = JSON.parse(sessionData);
    // await addToCartCount(obj);
    // const branchAccessSuccess = await getBranchAccess(plantId, jsonSessionData);
  };

  const addToCartCount = async (obj) => {
    try {
      const CartCount = await ScannerService.cartCount({ userId: authData?.userId || authData?.idUser })
      console.log("Cart Count is header ", CartCount, CartCount?.result?.itemCount);
      if (CartCount?.data?.status == 200) {
        dispatch(setCartCount(
          {
            status: STATE_STATUS.FETCHED,
            count: CartCount?.data?.result?.itemCount || 0
          }))
        // await AsyncStorage.setItem('@cartCount', JSON.stringify({ cartCount: CartCount?.result?.itemCount }))
      } else {
        dispatch(setCartCount({
          status: STATE_STATUS.FETCHED,
          count: 0
        }))
      }
    } catch (err) {
      console.log("Error", err);
    }
  }

  const getLCBGBalance = async () => {
    try {
      const getPlantCode = await AsyncStorage.getItem('@plantCode');
      let plantCode = JSON.parse(getPlantCode);
      const getPlantId = await AsyncStorage.getItem('@plantId');
      let plantId = JSON.parse(getPlantId);
      const sessionData = await AsyncStorage.getItem('@get_session');
      let jsonSessionData = JSON.parse(sessionData);
      const dataObj = {
        customerCode: plantCode?.plantCode,
        idcompany: jsonSessionData?.companyId,
        businessUnit: authData?.businessUnit,
      };
      const data = await ScannerService.getLCBGreditBalance(dataObj);
      setLCBGBalance(data?.data);
    } catch (err) {
      console.log('error', err);
    }
  };

  // const getBranchAccess = async () => {
  //   try {
  //     const sessionData = await AsyncStorage.getItem('@get_session');
  //     const getPlantId = await AsyncStorage.getItem('@plantId');
  //     let jsonSessionData = JSON.parse(sessionData);
  //     let plantId = JSON.parse(getPlantId);
  //     let isCustomer = false;
  //     const dataObj = {
  //       idBranch: !userType ? plantId?.plantId : '1',
  //       // idBranch: isCustomer ? plantId?.plantId : '1',
  //       idUser: jsonSessionData?.moglixB2BUserId,
  //     };
  //     const data = await ScannerService.branchAccess(dataObj);
  //     if (data?.data?.successful) {
  //       const { plantCode, roleNames } = data?.data?.data?.branchModules;
  //       await AsyncStorage.setItem('@plantCode', JSON.stringify({ plantCode }));
  //       //  await AsyncStorage.setItem(
  //       //     '@plantCode',
  //       //     JSON.stringify({
  //       //       plantCode: data?.data?.data?.branchModules?.plantCode,
  //       //     }),
  //       //   );

  //       // dispatch(getSearchPlantRequest({ searchString: '' }));
  //       // // dispatch(getSearchPlantRequest({ searchString: '' }));
  //       // dispatch(
  //       //   getCreditBalanceRequest({
  //       //     plantId: plantId?.plantId,
  //       //     businessUnit: authData?.businessUnit,
  //       //     companyId: jsonSessionData?.companyId,
  //       //   }),
  //       // );
  //       // dispatch(
  //       //   getLCBGBalanceRequest({
  //       //     customerCode: plantCode,
  //       //     companyId: jsonSessionData?.companyId,
  //       //     businessUnit: authData?.businessUnit,
  //       //   }),
  //       // );
  //     }
  //     if (
  //       // data?.data?.data?.branchModules?.roleNames?.includes(
  //       //   'Product Manager',
  //       // ) &&
  //       data?.data?.data?.branchModules?.roleNames?.includes('Customer') ||
  //       data?.data?.data?.branchModules?.roleNames?.includes(
  //         'Company Super Admin',
  //       )
  //     ) {
  //       // console.log('header branch data', data?.data?.data);

  //       dispatch(
  //         setBranchAccess({
  //           status: STATE_STATUS.FETCHED,
  //           data: data?.data?.data,
  //           isCustomer: true,
  //         }),
  //       );
  //     } else {
  //       dispatch(
  //         setBranchAccess({
  //           status: STATE_STATUS.FETCHED,
  //           data: data?.data?.data,
  //           isCustomer: false,
  //         }),
  //       );
  //     }
  //   } catch (err) {
  //     console.log('error', err);
  //   }
  // };

  const navigateToTop = async () => {
    // const jsonValue = await AsyncStorage.getItem('@user_info');
    // if (jsonValue) {
    //   const getPlantId = await AsyncStorage.getItem('@plantId');
    //   let info = JSON.parse(jsonValue);
    //   let plantId = JSON.parse(getPlantId);
    //   const exp_url =
    //     CONSTANTS.WEBURL.TAB_WEB +
    //     'vcatalog/all-products?token=' +
    //     info.token +
    //     '&plantId=' +
    //     plantId;
    //   props?.navigation.replace('WebView', {
    //     URL: exp_url,
    //     fromExp: 'exploreText',
    //     showBack: true,
    //   });
    // }

    if (props?.canGOBack) navigation.goBack();
  };
  const openNotificationScreen = async () => {
    try {
      props?.navigation?.navigate('Notification');
    } catch (err) {
      console.log("Error", err);
      
    }
  }
  const openNotificationWebview = async () => {
    const jsonValue = await AsyncStorage.getItem('@user_info');
    if (jsonValue) {
      const getPlantId = await AsyncStorage.getItem('@plantId');
      let info = JSON.parse(jsonValue);
      let plantId = JSON.parse(getPlantId);

      let navURL =
        CONSTANTS.WEBURL.NOTIFICATION +
        `?token=` +
        info.token +
        '&plantId=' +
        plantId.plantId;
      // console.log('notification url', navURL);

      props?.navigation.push('WebView', {
        URL: navURL,
        // fromExp: 'exploreText',
        showBack: true,
      });
    }
  };

  const openCartWebview = async () => {
    const jsonValue = await AsyncStorage.getItem('@user_info');
    if (jsonValue) {
      const getPlantId = await AsyncStorage.getItem('@plantId');
      let info = JSON.parse(jsonValue);
      let plantId = JSON.parse(getPlantId);
      let navURL =
        CONSTANTS.WEBURL.TAB_WEB +
        'vcatalog/plan-order?token=' +
        info.token +
        '&plantId=' +
        plantId?.plantId;
      props?.navigation.push('WebView', {
        URL: navURL,
        // fromExp: 'exploreText',
        showBack: true,
      });
    }
  };

  const getInitials = fullName => {
    const nameParts = fullName?.split(' ');
    const firstInitial = nameParts[0]
      ? nameParts[0].charAt(0).toUpperCase()
      : '';
    const lastInitial = nameParts[1]
      ? nameParts[1].charAt(0).toUpperCase()
      : '';
    return `${firstInitial}${lastInitial}`;
  }

  const initials = fromHome && getInitials(authData?.name || authData?.userName);


  const discardConfirmation = () =>
    Alert.alert('Discard confirmation', 'Do you want to discard the ticket?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => navigation.navigate('Feed') },
    ]);
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_info');
      // const checkUrl = AsyncStorage.getItem('@Check_Url');

      if (jsonValue) {
        let info = JSON.parse(jsonValue);
        // console.log('info is', info);

        setUser(info);
      }
    } catch (e) {
      console.log(e);
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
        setSupplier(true);
        setUserType(true);
      } else {
        setSupplier(false);
        setUserType(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // console.log("isSupplier", isSupplier);

  const isOther = () => {
    return user?.businessUnit == 'Aluminium';
  };
  const openWalletModal = () => {
    setWalletModal(!walletModal);
  };
  const openPlantModal = () => {
    setPlantModal(!plantModal);
  };

  const showWalletModal = () => {
    return (
      <Modal
        visible={walletModal}
        animationType="slide"
        transparent={true}
        onRequestClose={openWalletModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.row]}>
              <Text style={styles.modalTitle}>Credit Balance</Text>
              <TouchableOpacity onPress={openWalletModal}>
                <AntDesign name="close" size={18} color="#363636" />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            {authData?.businessUnit != 'Copper' &&
              authData?.businessUnit != 'Zinc' ? (
              <>
                <View style={styles.box}>
                  {['VALC', 'BALC'].map((code) => (
                    <View style={styles.box2} key={code}>
                      <Text style={[styles.option2]}>{code}</Text>
                    </View>
                  ))}
                </View>
                <View
                  style={[
                    styles.box,
                    {
                      paddingTop: Dimension.padding5,
                      paddingBottom: Dimension.padding5,
                    },
                  ]}>
                  {['VALC', 'BALC'].map((code) => {
                    const item =
                      walletData?.find?.((data) => data.vedPlantCode === code) || null;
                    const balance = item?.creditBalance
                      ? parseFloat(item.creditBalance).toFixed(2)
                      : parseFloat(0).toFixed(2);
                    return (
                      <View style={styles.box2} key={code}>
                        <Text style={[styles.option]}>{'₹ '}{formatIndianCurrency(balance)}</Text>
                      </View>
                    );
                  })}
                </View>
              </>
            ) : (
              <View
                style={[
                  styles.box,
                  {
                    paddingTop: Dimension.padding5,
                    paddingBottom: Dimension.padding5,
                  },
                ]}>
                <View style={styles.column}>
                  <Text style={styles.option}>Cash Balance</Text>
                  <Text style={styles.option}>BG Balance</Text>
                  <Text style={styles.option}>LC Balance</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.option}>
                    {'₹ '}
                    {walletData?.[0]?.creditBalance &&
                      walletData?.[0]?.creditBalance != 0
                      ? `${formatIndianCurrency(
                        walletData?.[0]?.creditBalance,
                      )}`
                      : `${formatIndianCurrency(0)}`}
                  </Text>
                  <Text style={styles.option}>
                    {'₹ '}
                    {walletLCBGData?.bgBalance && walletLCBGData?.bgBalance != 0
                      ? `${formatIndianCurrency(walletLCBGData?.bgBalance)}`
                      : `${formatIndianCurrency(0)}`}
                  </Text>
                  <Text style={styles.option}>
                    {'₹ '}
                    {walletLCBGData?.lcBalance && walletLCBGData?.lcBalance != 0
                      ? `${formatIndianCurrency(walletLCBGData?.lcBalance)}`
                      : `${formatIndianCurrency(0)}`}
                  </Text>
                </View>
              </View>

              // <View
              //   style={[
              //     styles.box,
              //     {
              //       paddingTop: Dimension.padding5,
              //       paddingBottom: Dimension.padding5,
              //     },
              //   ]}>
              //   {walletData?.[0]?.creditBalance &&
              //   walletData?.[0]?.creditBalance != 0 ? (
              //     <View style={styles.box2}>
              //       <Text style={[styles.option]}>
              //         {'₹ '}
              //         {parseFloat(walletData?.[0]?.creditBalance).toFixed(2)}
              //       </Text>
              //     </View>
              //   ) : (
              //     <View style={styles.box2}>
              //       <Text style={[styles.option]}>
              //         {'₹ '}
              //         {parseFloat(0).toFixed(2)}
              //       </Text>
              //     </View>
              //   )}
              //   {lcbgBalance?.bgBalance && lcbgBalance?.bgBalance != 0 ? (
              //     <View style={styles.box2}>
              //       <Text style={[styles.option]}>
              //         {'₹ '}
              //         {parseFloat(lcbgBalance?.bgBalance).toFixed(2)}
              //       </Text>
              //     </View>
              //   ) : (
              //     <View style={styles.box2}>
              //       <Text style={[styles.option]}>
              //         {'₹ '}
              //         {parseFloat(0).toFixed(2)}
              //       </Text>
              //     </View>
              //   )}
              //   {lcbgBalance?.bgBalance && lcbgBalance?.lcBalance != 0 ? (
              //     <View style={styles.box2}>
              //       <Text style={[styles.option]}>
              //         {'₹ '}
              //         {parseFloat(lcbgBalance?.lcBalance).toFixed(2)}
              //       </Text>
              //     </View>
              //   ) : (
              //     <View style={styles.box2}>
              //       <Text style={[styles.option]}>
              //         {'₹ '}
              //         {parseFloat(0).toFixed(2)}
              //       </Text>
              //     </View>
              //   )}
              // </View>
            )}
          </View>
        </View>
      </Modal >
    );
  };
  const showPlantModal = () => {
    return (
      <Modal
        visible={plantModal}
        animationType="slide"
        transparent={true}
        onRequestClose={openPlantModal}>
        <View style={styles.modalOverlay2}>
          <View style={[styles.modalContent2]}>
            <View style={[styles.row]}>
              <Text style={styles.modalTitle}>Select Plant</Text>
              <TouchableOpacity onPress={openPlantModal}>
                <AntDesign name="close" size={18} color="#363636" />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <Search
              hasTopMargin
              navigation={props?.navigation}
              currentScreen={currentScreen}
            />

            <ListShow
              data={plantData}
              props={props}
              currentScreen={currentScreen}
              onClose={openPlantModal}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    // <View
    //   style={{
    //     backgroundColor: 'red',
    //     // paddingBottom: Dimension.padding4,
    //     // backgroundColor: 'pink',
    //   }}>
      <View
        style={[
          styles.headerView,
          {
            // marginTop:
            //   props?.fromExp && Platform.OS !== 'ios' ? Dimension.margin40 :
            //     props?.beforeLogin && Platform.OS !== 'ios'
            //       ? Dimension.margin40
            //       : 0,
          },
        ]}>
        <View style={styles.LogoRow}>
          {showMenu && branchAccessData?.isCustomer ? (
            <CustomeIcon
              name="icon_menu"
              size={22}
              onPress={() => {
                navigation.goBack();
              }}
              style={iconStyle}
              color={'#000'}></CustomeIcon>
          ) : null}
          {showBack ? (
            <MaterialCommunityIcon
              name={'arrow-left'}
              color={'#000'}
              size={21}
              onPress={() => {
                navigation.goBack();
              }}></MaterialCommunityIcon>
          ) : null}
          {showBackModal ? (
            <MaterialCommunityIcon
              name={'arrow-left'}
              color={'#000'}
              size={21}
              onPress={showBackModal}
            />
          ) : null}
          {/* <TouchableOpacity onPress={()=>navigation.replace('NewTab')}></TouchableOpacity> */}
          {showLogo ? (
            <TouchableOpacity onPress={navigateToTop}>
              {/* <Image
                resizeMode={'contain'}
                style={styles.logoImage}
                source={{
                  uri: 'https://purchase-order-moglix.s3.ap-south-1.amazonaws.com/Vedanta-Logo.png',
                }}
              /> */}
              <Image
                resizeMode={'contain'}
                style={styles.logoImage}
                source={require('../assets/images/logo.png')}
              // resizeMode="contain"
              ></Image>
            </TouchableOpacity>
          ) : null}

          {showText ? (
            <View>
              <Text
                style={[
                  styles.showTextStyle,
                  // {fontSize: beforeLogin ? Dimension.font16 : Dimension.font16},
                ]}>
                {showText}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row' }}>
          {showPlant ? (
            <TouchableOpacity style={styles.ExportBTn} onPress={openPlantModal}>
              <MaterialCommunityIcon
                name={'factory'}
                color={'#000'}
                size={21}></MaterialCommunityIcon>
              {/* <MaterialCommunityIcon
                name={'map-marker-radius'}
                color={'#000'}
                size={21}></MaterialCommunityIcon> */}
              {/* <Text style={styles.exportTxt}>Export Data</Text> */}
            </TouchableOpacity>
          ) : null}
          {!(authData?.businessUnit === 'Copper' || authData?.businessUnit === 'Zinc') && showScanner && branchAccessData?.isCustomer && (
            <TouchableOpacity
              style={styles.ExportBTn}
              onPress={() => {
                navigation.navigate('Selection');
              }}>
              <MaterialCommunityIcon
                name={'barcode-scan'}
                color={'#000'}
                size={21}
              />
            </TouchableOpacity>
          )}

          {/* {authData?.businessUnit === 'Copper' || authData?.businessUnit === 'Zinc' ?
            {showScanner && !isSupplier ? (
            <TouchableOpacity
              style={styles.ExportBTn}
              onPress={() => {
                //captureAnalytics('Voice of Customer');

                navigation.navigate('Selection');

              }}>
              <MaterialCommunityIcon
                name={'barcode-scan'}
                color={'#000'}
                size={21}></MaterialCommunityIcon>
              {/* <Text style={styles.exportTxt}>Export Data</Text> */}
          {/* </TouchableOpacity> */}
          {/* ) : null}  */}

          {showExportData ? (
            <TouchableOpacity
              style={styles.ExportBTn}
              onPress={() => {
                // console.log('Export button pressed!');
                exportData && exportData();
              }}>
              <AntDesign
                name={'download'}
                size={20}
                color={'#0065AC'}
              // onPress={ console.log('Export button pressed!');
              //   exportData && exportData();}
              />
              <Text style={styles.exportTxt}>Export Data</Text>
            </TouchableOpacity>
          ) : null}
          {showDiscard && branchAccessData?.isCustomer ? (
            <TouchableOpacity
              style={{
                marginHorizontal: Dimension.margin15,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={discardConfirmation}>
              <MaterialCommunityIcon
                name={'delete'}
                color={'#000'}
                size={21}></MaterialCommunityIcon>
              {/* <Text style={styles.discardTxt}>Discard</Text> */}
            </TouchableOpacity>
          ) : null}
          {fromHome ? (

            <TouchableOpacity
              onPress={() => navigation?.navigate('Profile')}
              style={styles.userWrap}>
              <Text style={styles.userName}>{initials}</Text>
              {/* <Text style={styles.userName}>
                {auth?.userName && auth?.userName?.[0] + }
              </Text> */}
            </TouchableOpacity>
          ) : null}
          {showFolder && branchAccessData?.isCustomer ? (
            <TouchableOpacity
              style={styles.ExportBTn}
              onPress={openWalletModal}>
              <AntDesign
                name={'wallet'}
                color={'#000'}
                size={21}></AntDesign>
              {/* <MaterialCommunityIcon
                name={'folder-check-outline'}
                color={'#000'}
                size={21}></MaterialCommunityIcon> */}
            </TouchableOpacity>
          ) : null}

          {showNotification && (
            <TouchableOpacity
              style={styles.ExportBTn}
              // onPress={openNotificationScreen}
              onPress={openNotificationScreen}
            >
               <View style={{ position: 'relative' }}>
               <MaterialCommunityIcon
                name={'bell-outline'}
                color={'#000'}
                size={21}
                onPress={openNotificationScreen}></MaterialCommunityIcon>
                {(
                 <View
                 style={{
                   position: 'absolute',
                   right: -6,
                   top: -6,
                   backgroundColor: 'red',
                   borderRadius: 10,
                   minWidth: Dimension.width18,
                   height: Dimension.height18,
                  //  paddingHorizontal: 4,
                   justifyContent: 'center',
                   alignItems: 'center',
                 }}>
                    <Text style={{ color: 'white', fontSize: Dimension.font10, fontWeight: 'bold' }}>
                      {notiCount ?? 0}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          {/* {showCart && isCustomer && (
            <TouchableOpacity style={styles.ExportBTn} onPress={openCartWebview}>
              <View style={{ position: 'relative' }}>
                <MaterialCommunityIcon
                  name={'cart-outline'}
                  color={'#000'}
                  size={24}
                />

                {(
                  <View
                    style={{
                      position: 'absolute',
                      right: -6,
                      top: -6,
                      backgroundColor: 'green',
                      borderRadius: 10,
                      width: Dimension.width18,
                      height: Dimension.height18,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                      {countCart}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )} */}

          {showCart && isCustomer && (
            <TouchableOpacity
              style={styles.ExportBTn}
              onPress={openCartWebview}>
              <MaterialCommunityIcon
                name={'cart-outline'}
                color={'#000'}
                size={21}
                onPress={openCartWebview}></MaterialCommunityIcon>
            </TouchableOpacity>
          )}
          {walletModal && showWalletModal()}
          {plantModal && showPlantModal()}
        </View>
      </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  userWrap: {
    backgroundColor: '#0063A7',
    width: Dimension.width38,
    height: Dimension.height37,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Dimension.margin15,
  },
  userName: {
    fontSize: Dimension.font18,
    fontFamily: Dimension.CustomRegularFont,
    color: '#fff',
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.WhiteColor,
    borderTopWidth: 1,
    borderTopColor: '#E5E7E8',
    paddingHorizontal: Dimension.padding15,
    justifyContent: 'space-between',
    paddingVertical: Dimension.padding20,
    // marginTop: Platform.OS === 'ios' ? 0 : Dimension.margin40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,
  },
  LogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: Dimension.width133,
    height: Dimension.height28,
    //  marginLeft:Dimension.margin10
  },
  showTextStyle: {
    marginLeft: Dimension.margin8,
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomMediumFont,
    color: colors.FontColor,
    fontWeight: 'bold',
  },
  exportTxt: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    color: '#0063A7',
    marginLeft: Dimension.margin8,
    alignSelf: 'center',
    fontWeight: 'bold',
    // marginTop: Dimension.margin4,
  },
  ExportBTn: {
    flexDirection: 'row',
    marginHorizontal: Dimension.margin8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    // marginHorizontal: Dimension.margin8,
    justifyContent: 'space-between',
    paddingHorizontal: Dimension.padding20,
    alignItems: 'center',
  },
  discardTxt: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomRegularFont,
    color: '#0063A7',
    marginLeft: Dimension.margin5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: Dimension.padding10,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    textAlign: 'center',
    width: '95%',
    paddingBottom: Dimension.padding20,
  },
  separator: {
    height: 1,
    backgroundColor: '#EFEFEF',
    width: '100%',
  },
  option: {
    fontSize: Dimension.font14,
    color: '#363636',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingBottom: Dimension.padding20,
  },
  option2: {
    color: '#363636',
    textAlign: 'left',
    fontSize: Dimension.font12,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: Dimension.font14,
    color: '#363636',
    fontWeight: 'bold',
    marginVertical: Dimension.margin20,

    textAlign: 'center',
  },
  modalOverlay2: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent2: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Dimension.padding20,
    textAlign: 'center',
    maxHeight: '75%'
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Dimension.padding10,
    marginLeft: Dimension.margin10,
    paddingBottom: 0,
  },
  box2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  column: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  fieldLabel: {
    fontSize: Dimension.font14,
    color: '#363636',
    fontWeight: 'bold',
    marginBottom: Dimension.margin5,
  },
  // option: {
  //   fontSize: Dimension.font14,
  //   color: '#0066CC',
  //   marginBottom: Dimension.margin5,
  // },
});

export default React.memo(Header);
