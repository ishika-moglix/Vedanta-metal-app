import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginFirstScreen from './containers/LoginFirst';
import LoginScreen from './containers/Login';
import LoadingScreen from './containers/Loading';
import WebViewScreen from './component/WebViewScreen';
//import AboutScreen from './components/AboutScreen';
import BottomTab from './component/BottomTab';
import Toast from 'react-native-toast-message';
// import LoginContext from './context/loginContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginWithOtpScreen from './containers/LoginWithOtp';
import ForgetPasswordScreen from './containers/ForgetPassword';
import VerificationScreen from './component/VerificationScreen';
import ChoosePasswordScreen from './component/ChoosePassword';
import SignUpScreen from './containers/SignUp';
import BusinessDetailsScreen from './containers/BusinessDetails';
import {toastConfig} from '../src/constants/toastConfig';
import {setAuth} from './redux/feature/authslice';
import {STATE_STATUS} from './redux/constants';
import {useSelector, useDispatch} from 'react-redux';
import BiometricScreen from './containers/Biometric.js';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import NotificationModal from './component/NotificationModal';
const navigationRef = React.createRef();
const Stack = createNativeStackNavigator();

// const showToast = remoteMessage => {
//   Toast.show({
//     type: 'success',
//     position: 'top',
//     text1: remoteMessage.notification.title,
//     text2: remoteMessage.notification.body,
//     visibilityTime: 3000,
//     autoHide: true,
//     topOffset: 30,
//   });
// };
const showToast = (remoteMessage, navigation) => {
  Toast.show({
    type: 'success',
    position: 'top',
    text1: 'Notification',
    text2: remoteMessage.notification.body,
    visibilityTime: 300000,
    autoHide: true,
    topOffset: 30,
    onPress: () => {
      console.log('Toast tapped!');
      navigation.navigate('Verification', {
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
      });
    },
  });
};

export const AUTH_STACK = [
  {
    name: 'Loading',
    component: LoadingScreen,
  },
  {
    name: 'LoginFirst',
    component: LoginFirstScreen,
  },
  {
    name: 'SignUp',
    component: SignUpScreen,
  },
  {
    name: 'Login',
    component: LoginScreen,
  },
  {
    name: 'LoginWithOtp',
    component: LoginWithOtpScreen,
  },
  {
    name: 'ForgetPassword',
    component: ForgetPasswordScreen,
  },
  {
    name: 'Verification',
    component: VerificationScreen,
  },
  {
    name: 'ChoosePassword',
    component: ChoosePasswordScreen,
  },
  {
    name: 'WebView',
    component: WebViewScreen,
  },
  {
    name: 'BusinessDetails',
    component: BusinessDetailsScreen,
  },
  {
    name: 'Biometric',
    component: BiometricScreen,
  },
];

export const APP_STACK_SCREENS = [
  {
    name: 'NewTab',
    component: BottomTab, //FeedScreen
  },
];

const Routes = ({navigation}) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  // const [modalVisible, setModalVisible] = useState(false);
  // const [notificationData, setNotificationData] = useState({
  //   title: '',
  //   message: '',
  //   screen: '',
  //   params: {},
  // });
  // const navigation = useNavigation();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const logout = async () => {
    console.log('logout from routes');
    // setIsLoggedIn(false);
    dispatch(
      setAuth({
        status: STATE_STATUS.UNFETCHED,
        data: {},
        isLoggedIn: false,
      }),
    );
    await AsyncStorage.clear();
  };
  // const handleNavigate = () => {
  //   setModalVisible(false);
  //   navigationRef.current?.navigate(
  //     notificationData.screen,
  //     notificationData.params,
  //   );
  // };
  // console.log('Notification Data', notificationData);

  // const requestUserPermission = async () => {
  //   const authStatus = await firebase.messaging().requestPermission();
  //   const enabled =
  //     authStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === firebase.messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Notification permission granted.');
  //     getFCMToken();
  //   } else {
  //     console.log('Notification permission denied.');
  //   }
  // };

  // const getFCMToken = async () => {
  //   try {
  //     const token = await firebase.messaging().getToken();
  //     AsyncStorage.setItem('fcm_token', token);
  //     console.log('FCM Token:', token);
  //   } catch (error) {
  //     console.log('Error', error);
  //   }
  // };

  // const onTokenRefreshListener = async () => {
  //   try {
  //     const token = await firebase.messaging().onTokenRefresh();
  //     console.log('onTokenRefreshListener', token);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const handleNotificationListener = async navigation => {
  //   firebase.messaging().onMessage(async remoteMessage => {
  //     showNotificationModal(remoteMessage);
  //     Alert.alert(
  //       remoteMessage.notification.title,
  //       remoteMessage.notification.body,
  //     );
  //   });

  //   messaging().setBackgroundMessageHandler(async remoteMessage => {
  //     console.log('Background Notification:', remoteMessage);
  //     // showNotificationModal(remoteMessage);
  //     // showToast(remoteMessage, navigation);
  //   });

  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     console.log('Notification opened:', remoteMessage);
  //     showNotificationModal(remoteMessage);
  //     // navigation.navigate('NotificationTab', {
  //     //   title: remoteMessage.notification.title,
  //     //   body: remoteMessage.notification.body,
  //     // });
  //   });

  //   const initialNotification = await messaging().getInitialNotification();
  //   if (initialNotification) {
  //     console.log('App opened from notification:', initialNotification);
  //     showNotificationModal(remoteMessage);
  //     // navigation.navigate('NotificationTab', {
  //     //   title: initialNotification.notification.title,
  //     //   body: initialNotification.notification.body,
  //     // });
  //   }
  // };

  // const showNotificationModal = remoteMessage => {
  //   setNotificationData({
  //     title: remoteMessage.notification.title || 'Notification',
  //     message: remoteMessage.notification.body || 'You have a new message!',
  //     screen: 'WebView' || 'NewTab',
  //     params: remoteMessage?.data || {},
  //   });
  //   setModalVisible(true);
  // };
  // useEffect(() => {
  //   requestUserPermission();
  //   handleNotificationListener(navigation);
  //   return () => {
  //     onTokenRefreshListener();
  //     Adjust.componentWillUnmount();
  //   };
  // }, []);

  const horizontalAnimation = {
    gestureDirection: 'horizontal',
    cardStyleInterpolator: ({current, layouts}) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    },
  };

  const linking = {
    prefixes: ['com.moglix.vedanta://'],
  };

  const navOptionHandler = () => ({
    headerShown: false,
    tabBarShowLabel: false,
    ...horizontalAnimation,
    // ...TransitionPresets.SlideFromRightIOS,
  });

  return (
    <NavigationContainer linking={linking}>
      <Toast position="top" topOffset={40} />
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerShown: false,
          header: false,
          animation: 'none',
        }}>
        {!isLoggedIn ? (
          <Stack.Group>
            {AUTH_STACK.map((screen, key) => (
              <Stack.Screen
                options={navOptionHandler}
                key={key}
                name={screen.name}
                // initialParams={{
                //   setIsLoggedIn,
                // }}
                component={screen.component}
              />
            ))}
          </Stack.Group>
        ) : (
          <Stack.Group>
            {APP_STACK_SCREENS.map((screen, key) => (
              <Stack.Screen
                key={key}
                options={navOptionHandler}
                name={screen.name}
                component={screen.component}
                // initialParams={{
                //   setIsLoggedIn,
                // }}
              />
            ))}
          </Stack.Group>
        )}
      </Stack.Navigator>
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(Routes);
