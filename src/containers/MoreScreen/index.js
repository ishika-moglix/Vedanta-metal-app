import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import Dimension from '../../Theme/Dimension';
import CONSTANTS from '../../services/constant';
import styles from './style';
import Header from '../../component/Header';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScannerService } from '../../services/scannerService';
import { setAuth } from '../../redux/feature/authslice';
import { STATE_STATUS } from '../../redux/constants';
import ENV from '../../services/url';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetHomeState } from '../../redux/feature/homeSlice';
import { removeToken } from '../../services/notificationService';
import CustomLoader from '../../component/customLoader';
import config from '../../services';
// import analytics from '@react-native-firebase/analytics';

const MoreScreen = ({ route, navigation }) => {
  const auth = useSelector(state => state.auth);
  const isCustomer = useSelector(state => state.branchAccess?.isCustomer);
  const [userType, setUserType] = useState(false);
  const [user, setUser] = useState({});
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const { status, data } = useSelector(state => state.auth);
  const authData = useSelector(state => state?.auth?.data);
  useEffect(() => {
    checkDetail();
    getData();
  }, []);
  const deleteToken = async () => {
    try {
      const getToken = await AsyncStorage.getItem('fcm_token');
      if (getToken) {
        // const token = JSON.parse(getToken);
        const dataObj = {
          idUser: auth?.data?.userId || auth?.data?.idUser,
          token: getToken,
        }
        const data = await removeToken(dataObj);
        console.log("remove token response : ", data);
      }
    } catch (err) {
      console.log("Logout Error : ", err);
    }
  }

  const LogoutFn = async () => {
    try {
      setLoader(true);
      await deleteToken();
      await AsyncStorage.removeItem('@user_info');
      await AsyncStorage.removeItem('@plantCode');
      await AsyncStorage.removeItem('@plantId');
      await AsyncStorage.removeItem('@get_session')
      const logoutApiData = await ScannerService.logoutApi({
        token: auth?.data?.token,
        iduser: auth?.data?.userId || auth?.data?.idUser,
      });
      dispatch(resetHomeState());
      dispatch(
        setAuth({
          status: STATE_STATUS.UNFETCHED,
          data: {},
        }),
      );
      Toast.show({
        type: 'success',
        text2: 'Logout Successfully',
        visibilityTime: 4000,
        autoHide: true,
      });
      await AsyncStorage.clear();
      await AsyncStorage.setItem('@first_login_after_logout', 'true');
      // if (logoutApiData?.data?.successful) {
      //   setLoader(false);
      //   await AsyncStorage.removeItem('@user_info');
      //   await AsyncStorage.removeItem('@plantCode');
      //   await AsyncStorage.removeItem('@plantId');
      //   await AsyncStorage.removeItem('@get_session')
      //   dispatch(resetHomeState());
      //   dispatch(
      //     setAuth({
      //       status: STATE_STATUS.UNFETCHED,
      //       data: {},
      //     }),
      //   );
      //   //Alert.alert('logout');
      //   Toast.show({
      //     type: 'success',
      //     text2: 'Logout Successfully',
      //     visibilityTime: 4000,
      //     autoHide: true,
      //   });
      //   // navigation.navigate('LoginFirst')

      //   await AsyncStorage.clear();
      //   await AsyncStorage.setItem('@first_login_after_logout', 'true');
      // }
      // else {
      //   setLoader(false);
      //   Toast.show({
      //     type: 'error',
      //     text2: 'Bad Request',
      //     visibilityTime: 4000,
      //     autoHide: true,
      //   });
      // }
      // auuth.setIsLoggedIn(false);
    } catch (err) {
      console.log("Logout Error : ", err);
    }
  };

  const openWebview = url => {
    navigation.navigate('WebView', { URL: url });
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_info');
      if (jsonValue) {
        let info = JSON.parse(jsonValue);
        console.log('info is', info);

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
        setUserType(true);
      } else {
        setUserType(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const isOther = () => {
    return user?.businessUnit == 'Aluminium';
  };

  const deleteAccount = () => {
    Alert.alert(
      'Are you sure you want to delete your account?',
      'Once deleted you would lose access to this account along with the saved details on VMB',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Proceed', onPress: () => deactivateUser() },
      ],
    );
  };

  const deactivateUser = async () => {
    try {
      const { data } = await ScannerService.deactivateAccount(
        {
          idUser: user.userId,
          active: false,
          inActiveThroughMobile: true,
          inActiveThroughSystem: false,
        },
        { ...user, branchId: 1, companyId: 1 },
      );
      if (data?.successful && data?.data) {
        LogoutFn();
      } else {
        console.log(data?.message || data?.errors);

        // alert(data?.message || data?.errors);
      }
    } catch (e) {
      console.log(e?.response?.data);
    }
  };

  const captureAnalytics = async action => {
    // await analytics().logEvent('click', {
    //   button: action,
    //   screen: 'More',
    //   userId: user.userId,
    //   businessUnit: user?.businessUnit,
    //   userName: user.userName,
    //   userEmail: user.userEmail,
    // });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {loader && (
        <CustomLoader fullScreen />
      )}
      <Header
        showLogo
        showNotification
        showPlant
        showScanner
        showFolder
        showCart
        currentScreen={route?.name}
        navigation={navigation}></Header>

      <ScrollView
        style={{
          flex: 1,
          padding: Dimension.padding15,
          backgroundColor: '#F7F7F7',
          paddingTop: Dimension.padding40,
        }}
        contentContainerStyle={{
          paddingBottom: Dimension.padding80,
        }}>
        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate('WebView', {
              URL: `${ENV[config.PROJECT_ENV].URL}/#/pages/manage/account`,
              showBack: true,
            })
          }
          style={styles.btnWrap}> */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.btnWrap}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.userWrap}>
              <Text style={styles.userName}>
                {(user.name && user.name[0]) ||
                  (user.userName && user.userName[0])}
              </Text>
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.userFullName}>
                {authData?.name || user.name || user.userName}
              </Text>
              <Text style={styles.userEmail}>
                {user.userEmail || user.emailId}
              </Text>
            </View>
          </View>
          <MaterialCommunityIcon
            name={'chevron-right'}
            color={'#000'}
            size={24}
            style={{ alignSelf: 'center' }}
          />
        </TouchableOpacity>
        {!isCustomer &&
          (<View>
            <TouchableOpacity
              style={styles.btnWrap}
              onPress={() => {
               navigation?.navigate('Customer&Registration')
              }}>
              <Text style={styles.btnTxt}>Customer and Registration</Text>
              <MaterialCommunityIcon
                name={'chevron-right'}
                color={'#000'}
                size={24}></MaterialCommunityIcon>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                  navigation.navigate('VOC');
              }}
              style={styles.btnWrap}>
              <View style={styles.row}>
                <Text style={styles.btnTxt}>Voice Of Customers</Text>
              </View>

              <View style={styles.row}>
                <MaterialCommunityIcon
                  name={'chevron-right'}
                  color={'#000'}
                  size={24}></MaterialCommunityIcon>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnWrap}
              onPress={() => {
                captureAnalytics('Learning Center');
                openWebview('Learning');
              }}>
              <Text style={styles.btnTxt}>Learning center</Text>
              <MaterialCommunityIcon
                name={'chevron-right'}
                color={'#000'}
                size={24}></MaterialCommunityIcon>
            </TouchableOpacity>
          </View>)
        }
        {isCustomer && (
          <View>
            {/* <TouchableOpacity
              style={styles.btnWrap}
              onPress={() => {
                captureAnalytics('Reports');
                openWebview('Reports');
              }}>
              <Text style={styles.btnTxt}>Report</Text>
              <MaterialCommunityIcon
                name={'chevron-right'}
                color={'#000'}
                size={24}></MaterialCommunityIcon>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.btnWrap}
              onPress={() => {
                captureAnalytics('Learning Center');
                openWebview('Learning');
              }}>
              <Text style={styles.btnTxt}>Learning center</Text>
              <MaterialCommunityIcon
                name={'chevron-right'}
                color={'#000'}
                size={24}></MaterialCommunityIcon>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnWrap}
              onPress={() => {
                captureAnalytics('Rate The Platform');
                openWebview('Rate');
              }}>
              <Text style={styles.btnTxt}>Rate The Platform</Text>
              <MaterialCommunityIcon
                name={'chevron-right'}
                color={'#000'}
                size={24}></MaterialCommunityIcon>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnWrap}
              onPress={() => {
                captureAnalytics('Voice of Customer');
                // if (!isOther()) {
                //   navigation.navigate('WebView', {
                //     URL: `${ENV[config.PROJECT_ENV].URL}/#/pages/feedback/list?token=${user.token}`,
                //     showBack: true,
                //   });
                // } else {
                  navigation.navigate('Feed');
                }}>
              <Text style={styles.btnTxt}>Voice Of Customer</Text>
              <MaterialCommunityIcon
                name={'chevron-right'}
                color={'#000'}
                size={24}></MaterialCommunityIcon>
            </TouchableOpacity>
             { authData?.businessUnit != 'Zinc' ?<TouchableOpacity
              style={styles.btnWrap}
              onPress={() => {

                navigation.navigate('Contract');

              }}>
              {authData?.businessUnit === 'Zinc' ? <Text style={styles.btnTxt}>MOU</Text> :
                <Text style={styles.btnTxt}>Contract</Text>}
              <MaterialCommunityIcon
                name={'chevron-right'}
                color={'#000'}
                size={24}></MaterialCommunityIcon>
            </TouchableOpacity> : null}
          </View>
        )}
        {/* <TouchableOpacity
          style={styles.btnWrap}
          onPress={() => {
            captureAnalytics('Report');
            navigation.navigate('WebView', {
              URL: `${ENV[config.PROJECT_ENV].URL}/#/pages/mnotification?token=${user.token}`,
              showBack: true,
            });
          }}>
          <Text style={styles.btnTxt}>Report</Text>
          <MaterialCommunityIcon
            name={'chevron-right'}
            color={'#000'}
            size={24}></MaterialCommunityIcon>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={styles.btnWrap}
          onPress={() => {
            captureAnalytics('Learning Centre');
            navigation.navigate('WebView', {
              URL: `${ENV[config.PROJECT_ENV].URL}/#/pages/mnotification?token=${user.token}`,
              showBack: true,
            });
          }}>
          <Text style={styles.btnTxt}>Learning Centre</Text> */}
        {/* <MaterialCommunityIcon
            name={'chevron-right'}
            color={'#000'}
            size={24}></MaterialCommunityIcon>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={styles.btnWrap}
          onPress={() => {
            captureAnalytics('Notification');
            navigation.navigate('WebView', {
              URL: `${ENV[config.PROJECT_ENV].URL}/#/pages/mnotification?token=${user.token}`,
              showBack: true,
            });
          }}>
          <Text style={styles.btnTxt}>Notifications</Text>
          <MaterialCommunityIcon
            name={'chevron-right'}
            color={'#000'}
            size={24}></MaterialCommunityIcon>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          style={styles.btnWrap}
          onPress={() => {
            captureAnalytics('Rate The Platform');
            navigation.navigate('WebView', {
              URL: `${ENV[config.PROJECT_ENV].URL}/#/pages/mnotification?token=${user.token}`,
              showBack: true,
            });
          }}>
          <Text style={styles.btnTxt}>Rate The Platform</Text>
          <MaterialCommunityIcon
            name={'chevron-right'}
            color={'#000'}
            size={24}></MaterialCommunityIcon>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          style={styles.btnWrap}
          onPress={() => {
            captureAnalytics('MOU');
            openWebview('MOU');
          }}>
          <Text style={styles.btnTxt}>MOU</Text>
          <MaterialCommunityIcon
            name={'chevron-right'}
            color={'#000'}
            size={24}></MaterialCommunityIcon>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.LogoutbtnWrap} onPress={LogoutFn}>
          <Text style={styles.LogoutbtnTxt}>Log Out</Text>
        </TouchableOpacity>
        {Platform.OS == 'android' ? null : (
          <TouchableOpacity
            onPress={deleteAccount}
            style={[styles.LogoutbtnWrap, { marginTop: Dimension.margin12 }]}>
            <Text style={styles.LogoutbtnTxt}>Delete Account</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default MoreScreen;
