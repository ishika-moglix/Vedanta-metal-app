import React, { useEffect, useMemo, useState, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, BackHandler, ToastAndroid, View, ActivityIndicator, StatusBar } from 'react-native';
import Dimension from '../Theme/Dimension';
import WebViewScreen from './WebViewScreen';
import MoreScreen from '../containers/MoreScreen';
// import {useFocusEffect} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import ServiceScreen from '../containers/Service';
//import Toast from 'react-native-toast-message';
import CustomeIcon from './CustomeIcon';
import FeedScreen from '../containers/FeedScreen';
import SelectionScreen from '../containers/SelectionScreen';
import Homescreen from '../containers/HomeScreen';
import ComplaintDetailScreen from '../containers/ComplaintDetailScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../containers/Profile';
import Dashboard from '../containers/Dashboard';
import { compose } from 'redux';
import LoginFirstScreen from '../containers/LoginFirst';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Scanner from './Scanner';
import ProcurementScreen from '../containers/Procurement';
import DispatchDetailsScreen from '../containers/DispatchDetails';
import ShipmentTracking from '../containers/ShipmentTracking.js';
import { useSelector, useDispatch } from 'react-redux';
import NotificationModal from './NotificationModal';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../services/constant';
import notifee, { EventType } from '@notifee/react-native';
import { AndroidColor } from '@notifee/react-native';
// import { stat } from 'react-native-fs';
import MouScreen from '../containers/MOU';
import ContractListScreen from '../containers/ContractList.js';
import VOCScreen from '../containers/VOC';
import ComplaintScreen from '../containers/Complaint';
import NewComplaintScreen from '../containers/NewComplaint';
import VocFormScreen from '../containers/VocForm';
import NotificationScreen from '../containers/Notification';
import CustomerRegistrationScreen from '../containers/CustomerRegistration';
import CustomerRegForm from '../containers/CustomerRegForm';
import DashboardScreen from '../containers/Dashboard';
const navOptionHandler = () => ({
  headerShown: false,
  tabBarShowLabel: false,
  // ...TransitionPresets.SlideFromRightIOS,
});

const MORE_STACK = [
  {
    name: 'MoreSc',
    component: MoreScreen,
  },
  {
    name: 'WebView',
    component: WebViewScreen,
  },
  {
    name: 'Feed',
    component: FeedScreen,
  },
  {
    name: 'Selection',
    component: SelectionScreen,
  },
  {
    name: 'Homes',
    component: Homescreen,
  },
  {
    name: 'ComplaintDetail',
    component: ComplaintDetailScreen,
  },
  {
    name: 'Profile',
    component: Profile,
  },
  {
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    name: 'LoginFirst',
    component: LoginFirstScreen,
  },
  {
    name: 'Contract',
    component: MouScreen,
  },
  {
    name: 'ContractList',
    component: ContractListScreen
  },
  {
    name: 'VOC',
    component: VOCScreen
  },
  {
    name: 'Complaint',
    component: ComplaintScreen
  },
  {
    name: 'NewComplaint',
    component: NewComplaintScreen
  },
  {
    name: 'VocForm',
    component: VocFormScreen
  },
  {
    name: 'Notification',
    component: NotificationScreen
  },
  {
    name: 'Customer&Registration',
    component: CustomerRegistrationScreen
  },
  {
    name: 'CustomerRegForm',
    component: CustomerRegForm
  },
  {
    name: 'DispatchDetails',
    component: DispatchDetailsScreen,
  },
];

const MoreStack = param => {
  return (
    <Stack.Navigator
      {...param}
      screenOptions={{
        headerShown: false,
        header: false,
        animation: 'none',
      }}>
      {MORE_STACK.map((screen, key) => (
        <Stack.Screen
          {...param}
          options={navOptionHandler}
          key={key}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Stack.Navigator>
  );
};

const SERVICE_STACK = [
  {
    name: 'Services',
    component: ServiceScreen,
  },
  {
    name: 'WebView',
    component: WebViewScreen,
  },
  {
    name: 'Feed',
    component: FeedScreen,
  },
  {
    name: 'Selection',
    component: SelectionScreen,
  },
  {
    name: 'Homes',
    component: Homescreen,
  },
  {
    name: 'ComplaintDetail',
    component: ComplaintDetailScreen,
  },
  {
    name: 'Notification',
    component: NotificationScreen
  },
  {
    name: 'VOC',
    component: VOCScreen
  },
  {
    name: 'Complaint',
    component: ComplaintScreen
  },
  {
    name: 'NewComplaint',
    component: NewComplaintScreen
  },
  {
    name: 'DispatchDetails',
    component: DispatchDetailsScreen,
  },
  {
    name: 'Contract',
    component: MouScreen,
  },
  {
    name: 'ContractList',
    component: ContractListScreen
  },
  {
    name: 'VocForm',
    component: VocFormScreen
  },
];

const ServiceStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      header: false,
      animation: 'none',
    }}>
    {SERVICE_STACK.map((screen, key) => (
      <Stack.Screen
        options={navOptionHandler}
        key={key}
        name={screen.name}
        component={screen.component}
      />
    ))}
  </Stack.Navigator>
);

const HOME_STACK = [
  {
    name: 'Home',
    component: WebViewScreen,
  },
  {
    name: 'WebView',
    component: WebViewScreen,
  },
  {
    name: 'Feed',
    component: FeedScreen,
  },
  {
    name: 'MoreSc',
    component: MoreScreen,
  },
  {
    name: 'Selection',
    component: SelectionScreen,
  },

  {
    name: 'ComplaintDetail',
    component: ComplaintDetailScreen,
  },
  {
    name: 'Procurement',
    component: ProcurementScreen,
  },
  {
    name: 'Homes',
    component: Homescreen,
  },
  {
    name: 'Notification',
    component: NotificationScreen
  },
  {
    name: 'VOC',
    component: VOCScreen
  },
  {
    name: 'Complaint',
    component: ComplaintScreen
  },
  {
    name: 'NewComplaint',
    component: NewComplaintScreen
  },
  {
    name: 'DispatchDetails',
    component: DispatchDetailsScreen,
  },
  {
    name: 'Contract',
    component: MouScreen,
  },
  {
    name: 'ContractList',
    component: ContractListScreen
  },
  {
    name: 'VocForm',
    component: VocFormScreen
  },
];

const HomeStack = param => {
  return (
    <>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        header: false,
        animation: 'none',
      }}>
      {HOME_STACK.map((screen, key) => {
        return (
          <Stack.Screen
            key={key}
            name={screen.name}
            component={screen.component}
            options={navOptionHandler}
            showBack={false}
          // initialParams={param}
          />
        );
      })}
      </Stack.Navigator>
      </>
  );
};

const DASHBOARD_STACK = [
  {
    name: 'Dashboard',
    component: DashboardScreen,
  },
  {
    name: 'WebView',
    component: WebViewScreen,
  },
  {
    name: 'Contract',
    component: MouScreen,
  },
  {
    name: 'VOC',
    component: VOCScreen
  },
  {
    name: 'Complaint',
    component: ComplaintScreen
  },
  {
    name: 'NewComplaint',
    component: NewComplaintScreen
  },
  {
    name: 'VocForm',
    component: VocFormScreen
  },
  {
    name: 'Customer&Registration',
    component: CustomerRegistrationScreen
  },
  {
    name: 'CustomerRegForm',
    component: CustomerRegForm
  },
  {
    name: 'DispatchDetails',
    component: DispatchDetailsScreen,
  },

  {
    name: 'ContractList',
    component: ContractListScreen
  },
]

const DashboardStack = param => {
  return (
    <Stack.Navigator
      {...param}
      screenOptions={{
        headerShown: false,
        header: false,
        animation:'none',
      }}>
      {
        DASHBOARD_STACK.map((screen, key) => {
          return (
            <Stack.Screen
              {...param}
              options={navOptionHandler}
              key={key}
              name={screen.name}
              component={screen.component}
            />
        )
      })}
    </Stack.Navigator>
)
}
const PROCUREMENT_STACK = [
  {
    name: 'Procurement',
    component: ProcurementScreen,
  },
  {
    name: 'DispatchDetails',
    component: DispatchDetailsScreen,
  },
  {
    name: 'ShipmentTracking',
    component: ShipmentTracking,
  },
  {
    name: 'WebView',
    component: WebViewScreen,
  },
  {
    name: 'Feed',
    component: FeedScreen,
  },
  {
    name: 'Selection',
    component: SelectionScreen,
  },
  {
    name: 'ComplaintDetail',
    component: ComplaintDetailScreen,
  },
  {
    name: 'Homes',
    component: Homescreen,
  },
  {
    name: 'Notification',
    component: NotificationScreen
  },
  {
    name: 'VOC',
    component: VOCScreen
  },
  {
    name: 'Complaint',
    component: ComplaintScreen
  },
  {
    name: 'NewComplaint',
    component: NewComplaintScreen
  },
  {
    name: 'Contract',
    component: MouScreen,
  },
  {
    name: 'ContractList',
    component: ContractListScreen
  },


  {
    name: 'VocForm',
    component: VocFormScreen
  },
];

const ProcurementStack = param => {
  return (
    <Stack.Navigator
      {...param}
      screenOptions={{
        headerShown: false,
        header: false,
        animation: 'none',
      }}>
      {PROCUREMENT_STACK.map((screen, key) => {
        //console.log(screen, key, param);
        return (
          <Stack.Screen
            {...param}
            options={navOptionHandler}
            key={key}
            name={screen.name}
            component={screen.component}
          />
        );
      })}
    </Stack.Navigator>
  );
};

const CONTRACT_STACK = [
  {
    name: 'Contract',
    component: MouScreen,
  },
  {
    name: 'ContractList',
    component: ContractListScreen
  },
  {
    name: 'WebView',
    component: WebViewScreen,
  },
  {
    name: 'Feed',
    component: FeedScreen,
  },
  {
    name: 'Selection',
    component: SelectionScreen,
  },

  {
    name: 'ComplaintDetail',
    component: ComplaintDetailScreen,
  },
  {
    name: 'Homes',
    component: Homescreen,
  },
  {
    name: 'Notification',
    component: NotificationScreen
  },
  {
    name: 'VOC',
    component: VOCScreen
  },
  {
    name: 'Complaint',
    component: ComplaintScreen
  },
  {
    name: 'NewComplaint',
    component: NewComplaintScreen
  },
  {
    name: 'VocForm',
    component: VocFormScreen
  },
];

const ContractStack = param => {
  return (
    <Stack.Navigator
      {...param}
      screenOptions={{
        headerShown: false,
        header: false,
        animation: 'none',
      }}>
      {CONTRACT_STACK.map((screen, key) => {
        //console.log(screen, key, param);
        return (
          <Stack.Screen
            {...param}
            options={navOptionHandler}
            key={key}
            name={screen.name}
            component={screen.component}
          />
        );
      })}
    </Stack.Navigator>
  );
};

const REPORTS_STACKS = [
  {
    name: 'Report',
    component: WebViewScreen,
  },
  {
    name: 'WebView',
    component: WebViewScreen,
  },
  {
    name: 'Feed',
    component: FeedScreen,
  },
  {
    name: 'Selection',
    component: SelectionScreen,
  },
  {
    name: 'ComplaintDetail',
    component: ComplaintDetailScreen,
  },
  {
    name: 'Homes',
    component: Homescreen,
  },
  {
    name: 'Notification',
    component: NotificationScreen
  },
  {
    name: 'VOC',
    component: VOCScreen
  },
  {
    name: 'Complaint',
    component: ComplaintScreen
  },
  {
    name: 'NewComplaint',
    component: NewComplaintScreen
  },
  {
    name: 'Contract',
    component: MouScreen,
  },
  {
    name: 'ContractList',
    component: ContractListScreen
  },
  {
    name: 'VocForm',
    component: VocFormScreen
  },
];

const ReportStack = param => {
  return (
    <Stack.Navigator
      // {...param}
      screenOptions={{
        headerShown: false,
        header: false,
        animation: 'none',
      }}>
      {REPORTS_STACKS.map((screen, key) => {
        //console.log(screen, key);
        return (
          <Stack.Screen
            // {...param}
            options={navOptionHandler}
            key={key}
            name={screen.name}
            component={screen.component}
          />
        );
      })}
    </Stack.Navigator>
  );
};

// const ProcurementStack = param => {
//   return (
//     <Stack.Navigator
//       {...param}
//       screenOptions={{
//         headerShown: false,
//         header: false,
//         animation: 'none',
//       }}>
//       {PROCUREMENT_STACK.map((screen, key) => (
//          //console.log(screen, key );

//         <Stack.Screen
//           {...param}
//           options={navOptionHandler}
//           key={key}
//           name={screen.name}
//           component={screen.component}
//         />

//       ))}

//     </Stack.Navigator>
//   );
// };

// const HomeStack = param => (
//   <Stack.Navigator
//     {...param}
//     screenOptions={{
//       headerShown: false,
//       header: false,
//       animation: 'none',
//     }}>
//     {HOME_STACK.map((screen, key) => (
//       //console.log(screen, key );

//       <Stack.Screen
//         {...param}
//         options={navOptionHandler}
//         key={key}
//         name={screen.name}
//         component={screen.component}
//       />
//     ))}
//   </Stack.Navigator>
// );

const Stack = createNativeStackNavigator();
const BottomTab = props => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth?.data)
  const isSupplier = useSelector(state => state.branchAccess?.isCustomer);
   const branchAccessData = useSelector(state => state.branchAccess);
  const Tab = createBottomTabNavigator();
  const remoteMessageRef = useRef(null);
  const [currentTab, setCurrentTab] = useState(
    props?.route?.params?.currentTab || 'Home',
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    screen: '',
    params: {},
  });
  // const [isSupplier, setsupplier] = useState(false);
  const tabBarOptions = {
    //activeTintColor: COLORS.active,
    //inactiveTintColor: COLORS.inActive,
    showLabel: true,
    lazy: true,
    style: styles.tabBar,
    safeAreaInsets: { bottom: 0 },
  };

  const isReady = useMemo(() => {
   return typeof isSupplier !== 'undefined' && authData !== null;
  }, [authData, isSupplier]);

  const initialTab = isSupplier ? 'Home' : 'Procurement';

  const openNotificationWebview = async (remoteMessage) => {
    try {
      console.log("RemoteMessage get from backend ", remoteMessage);

      const jsonValue = await EncryptedStorage.getItem('@user_info');
      if (jsonValue) {
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let info = JSON.parse(jsonValue);
        let plantId = JSON.parse(getPlantId);
        let notificationType = remoteMessage?.data?.type?.toLowerCase(); 
        if (notificationType === 'po' || notificationType === 'do' || notificationType === 'complaints' || notificationType === 'reports') {
          const exp_url = remoteMessage?.data?.url + '?token=' + info.token;
              props?.navigation.push('WebView', {
                  URL: exp_url,
                  showBack: true
                  // fromExp: 'exploreText',
              });
      } else {
          if(notificationType === 'voc')
              !branchAccessData?.isCustomer? props?.navigation?.navigate('Complaint') :  props?.navigation?.navigate('Feed');
          if (notificationType === 'mou')
              props?.navigation?.navigate('Contract',{activeTabKey: '1'});
          if (notificationType === 'dispatch')
              props?.navigation?.navigate('DispatchDetails');
          if (notificationType === 'nfa')
              props?.navigation?.navigate('Contract', {activeTabKey: '2'});
      }
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const ondisplayNotification = async (remoteMessage) => {
    try {
      const channelId = await notifee.createChannel({
        id: 'Push Notification',
        name: 'Default Channel',
        sound: 'default',
        // importance: 'high',
      });
      await notifee.requestPermission();
      const notificationId = await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId,
          smallIcon: 'ic_launcher',
          pressAction: {
            id: 'Push Notification',
          },
        },
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  }
  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      console.log("ForegroundDeatils Noti", detail);
      switch (type) {
        case EventType.DISMISSED:
          //console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          if (remoteMessageRef.current) {
            openNotificationWebview(remoteMessageRef.current);
          } else {
            console.warn("No remoteMessage available in ref.");
          }
          break;
      }
    });
  }, []);

  const handleNavigate = () => {
    setModalVisible(false);
    openNotificationWebview();
  };
  const requestUserPermission = async () => {
    const authStatus = await firebase.messaging().requestPermission();
    const enabled =
      authStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === firebase.messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted.');
      getFCMToken();
    } else {
      console.log('Notification permission denied.');
    }
  };

  const getFCMToken = async () => {
    try {
      if (Platform.OS === 'ios') {
        await messaging().registerDeviceForRemoteMessages();
      }
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      AsyncStorage.setItem('fcm_token', token);
    } catch (error) {
      console.error('token Error', error);
    }
  };

  const onTokenRefreshListener = async () => {
    try {
      const token = await firebase.messaging().onTokenRefresh();
      //console.log('onTokenRefreshListener', token);
    } catch (error) {
      //console.log(error);
    }
  };
  const handleNotificationListener = async navigation => {
    firebase.messaging().onMessage(async remoteMessage => {
      console.log('Notification received in foreground:', remoteMessage);
      remoteMessageRef.current = remoteMessage;
      ondisplayNotification(remoteMessage);

    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      openNotificationWebview(remoteMessage);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      openNotificationWebview(remoteMessage);
    });

    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      openNotificationWebview(initialNotification);
    }
  };



  const showNotificationModal = remoteMessage => {
    setNotificationData({
      title: remoteMessage.notification.title || 'Notification',
      message: remoteMessage.notification.body || 'You have a new message!',
      screen: 'WebView' || 'NewTab',
      params: remoteMessage?.data || {},
    });
    setModalVisible(true);
  };

  useEffect(() => {
    requestUserPermission();
    handleNotificationListener();
    return () => {
      onTokenRefreshListener();
      // Adjust.componentWillUnmount();
    };
  }, []);

  const getActiveRouteName = (state) => {
    if (!state || !state.routes || state.index == null) return null;
    const route = state.routes[state.index];
    if (route.state) {
      return getActiveRouteName(route.state);
    }
    return route.name;
  };


 
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0063A7" />
      </View>
    );
  }

  return (
    <>
      <Tab.Navigator
       initialRouteName={initialTab}
        screenOptions={props => {
          const state = props?.navigation.getState();
          const currentRouteName = getActiveRouteName(state);
          let tabBarVisible = true;
          if (currentRouteName === 'VOC') {
            tabBarVisible = false;
          } else if (currentRouteName === 'Complaint') {
            tabBarVisible = false;
          } else if (currentRouteName === 'VocForm') {
            tabBarVisible = false;
          }
          return {
            showLabel: true,
            style: styles.tabBar,
            headerShown: false,
            lazy: true,
            safeAreaInsets: { bottom: 0 },
            tabBarStyle: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              backgroundColor: '#fff',
              borderColor: '#F5F5F5',
              borderWidth: 0.5,
              shadowColor: '#000',
              shadowOffset: { width: -5, height: 0 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 20,
              maxHeight: Dimension.height100,
              display: tabBarVisible ? 'flex' : 'none',
            },
          };
        }}
        // screenOptions={tabBarOptions}
        sceneContainerStyle={{
          backgroundColor: '#fff',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}>
        {!isSupplier ? (
          <>
            
            <Tab.Screen
              key={'1'}
              name="Dashboard"
              title="Dashboard"
              options={{
                headerShown: false,
                tabBarLabel: 'Dashboard',
                tabBarLabelStyle: styles.tabText,
                tabBarIcon: ({ focused, color }) => (
                  <MaterialCommunityIcon
                    name={'view-dashboard-outline'}
                    color={focused ? '#0063A7' : '#3C3C3C'}
                    size={Dimension.font20}></MaterialCommunityIcon>
                ),
              }}
              component={DashboardStack}
              initialParams={{
                URL: 'Dashboard',
              }}></Tab.Screen>
             <Tab.Screen
              key={'2'}
              title="Setting"
              name="Procurement"
              options={{
                headerShown: false,
                tabBarLabel: 'Procurement',
                tabBarLabelStyle: styles.tabText,
                tabBarIcon: ({ focused, color }) => (
                  <MaterialCommunityIcon
                    name={'format-list-text'}
                    color={focused ? '#0063A7' : '#3C3C3C'}
                    size={Dimension.font20}
                  // onPress={() => {
                  //   setCurrentTab('Procurement');
                  //   //console.log('Current Tab Params:', props?.route?.params);
                  //   props?.navigation.navigate('Procurement', {
                  //     currentTab,
                  //   });
                  // }}
                  ></MaterialCommunityIcon>
                ),
              }}
              component={ProcurementStack}
              initialParams={{
                supplier: !isSupplier,
              }}></Tab.Screen>
                {authData.businessUnit != 'Zinc' ? <Tab.Screen
              key={'3'}
              title="Setting"
              name="Contract"
              options={{
                headerShown: false,
                tabBarLabel: authData.businessUnit === 'Zinc' ? 'MOU' : 'Contract',
                tabBarLabelStyle: styles.tabText,
                tabBarIcon: ({ focused, color }) => (
                  <MaterialCommunityIcon
                    name={'card-text-outline'}
                    color={focused ? '#0063A7' : '#3C3C3C'}
                    size={Dimension.font20}
                  // onPress={() => {
                  //   setCurrentTab('Procurement');
                  //   //console.log('Current Tab Params:', props?.route?.params);
                  //   props?.navigation.navigate('Procurement', {
                  //     currentTab,
                  //   });
                  // }}
                  ></MaterialCommunityIcon>
                ),
              }}
              component={ContractStack}
              initialParams={{
                supplier: !isSupplier,
              }}></Tab.Screen> :
              null
       }
            <Tab.Screen
              key={'4'}
              name="Report"
              title="Setting"
              options={{
                headerShown: false,
                tabBarLabel: 'Reports',
                tabBarLabelStyle: styles.tabText,
                tabBarIcon: ({ focused, color }) => (
                  <MaterialCommunityIcon
                    name={'file-document-outline'}
                    color={focused ? '#0063A7' : '#3C3C3C'}
                    size={Dimension.font20}></MaterialCommunityIcon>

                  // <CustomeIcon
                  //   name="Report"
                  //   color={focused ? '#0063A7' : '#3C3C3C'}
                  //   size={Dimension.font20}
                  // />
                ),
              }}
              component={ReportStack}></Tab.Screen>
            <Tab.Screen
              key={'5'}
              title="More"
              name="MoreScreen"
              options={{
                headerShown: false,
                tabBarLabel: 'More',
                tabBarLabelStyle: styles.tabText,
                tabBarIcon: ({ focused, color }) => (
                  <MaterialCommunityIcon
                    name={'dots-vertical'}
                    color={focused ? '#0063A7' : '#3C3C3C'}
                    size={Dimension.font20}></MaterialCommunityIcon>
                  // <CustomeIcon
                  //   name="More"
                  //   color={focused ? '#0063A7' : '#3C3C3C'}
                  //   size={Dimension.font20}
                  // />
                ),
              }}
              component={MoreStack}
              initialParams={{
                supplier: !isSupplier,
              }}></Tab.Screen>
          </>
        ) : (
          <>
            <Tab.Screen
              key={'1'}
              name="Home"
              title="Setting"
              options={{
                headerShown: false,
                tabBarLabel: 'Home',
                tabBarLabelStyle: styles.tabText,
                tabBarIcon: ({ focused, color }) => (
                  <MaterialCommunityIcon
                    name={'home-outline'}
                    onPress={() => {
                      setCurrentTab('Home');
                      //console.log('Current Tab Params:', props?.route?.params);

                      if (currentTab === 'Home') {
                        props?.navigation.replace('NewTab', {
                          ...(props?.route?.params || {}),
                          currentTab,
                        });
                      } else {
                        props?.navigation.navigate('Homes', {
                          currentTab,
                        });
                      }
                    }}
                    color={focused ? '#0063A7' : '#3C3C3C'}
                    size={Dimension.font20}
                  />
                ),
              }}
              component={HomeStack}

            />

            {/* <Tab.Screen
            key={'1'}
            name="Home"
            title="Setting"
            options={{
              headerShown: false,
              tabBarLabel: 'Home',
              tabBarLabelStyle: styles.tabText,
              tabBarIcon: ({focused, color}) => (
                <MaterialCommunityIcon
                  name={'home-outline'}
                  onPress={() => {
                    setCurrentTab('Home');
                    if (currentTab == 'Home') {
                      props?.navigation.replace('NewTab', {
                        ...(props?.route?.params || {}),
                        currentTab,
                      });
                    } else {
                      props?.navigation.navigate('Homes', {
                        currentTab,
                      });
                    }
                  }}
                  color={focused ? '#0063A7' : '#3C3C3C'}
                  size={Dimension.font20}></MaterialCommunityIcon>
                // <CustomeIcon
                //   name="Home_icon"
                // onPress={() => {
                //   setCurrentTab('Home');
                //   if (currentTab == 'Home') {
                //     props?.navigation.replace('NewTab', {
                //       ...(props?.route?.params || {}),
                //       currentTab,
                //     });
                //   } else {
                //     props?.navigation.navigate('Homes', {
                //       currentTab,
                //     });
                //   }
                // }}
                // color={focused ? '#0063A7' : '#3C3C3C'}
                // size={Dimension.font20}
                // />
              ),
            }}
            component={HomeStack}
            initialParams={{
              supplier: !isSupplier,
            }}></Tab.Screen> */}
            {/* <Tab.Screen
            key={'2'}
            name="Report"
            title="Setting"
            options={{
              headerShown: false,
              tabBarLabel: 'Report',
              tabBarLabelStyle: styles.tabText,
              tabBarIcon: ({focused, color}) => (
                <MaterialCommunityIcon
                  name={'file-document-outline'}
                  color={focused ? '#0063A7' : '#3C3C3C'}
                  size={Dimension.font20}></MaterialCommunityIcon>

                // <CustomeIcon
                //   name="Report"
                //   color={focused ? '#0063A7' : '#3C3C3C'}
                //   size={Dimension.font20}
                // />
              ),
            }}
            component={ReportStack}></Tab.Screen> */}
            <Tab.Screen
              key={'2'}
              title="Setting"
              name="Procurement"
              options={{
                headerShown: false,
                tabBarLabel: 'Procurement',
                tabBarLabelStyle: styles.tabText,
                tabBarIcon: ({ focused, color }) => (
                  <MaterialCommunityIcon
                    name={'format-list-text'}
                    color={focused ? '#0063A7' : '#3C3C3C'}
                    size={Dimension.font20}
                  // onPress={() => {
                  //   setCurrentTab('Procurement');
                  //   //console.log('Current Tab Params:', props?.route?.params);
                  //   props?.navigation.navigate('Procurement', {
                  //     currentTab,
                  //   });
                  // }}
                  ></MaterialCommunityIcon>
                ),
              }}
              component={ProcurementStack}></Tab.Screen>
            <Tab.Screen
              key={'3'}
              name="Dashboard"
              title="Dashboard"
              options={{
                headerShown: false,
                tabBarLabel: 'Dashboard',
                tabBarLabelStyle: styles.tabText,
                tabBarIcon: ({ focused, color }) => (
                  <MaterialCommunityIcon
                    name={'view-dashboard-outline'}
                    // onPress={() => {
                    //   setCurrentTab('Home');
                    //   if (currentTab == 'Home') {
                    //     props?.navigation.replace('Dashboard', {
                    //       ...(props?.route?.params || {}),
                    //       currentTab,
                    //     });
                    //   } else {
                    //     props?.navigation.navigate('Dashboard', {
                    //       currentTab,
                    //     });
                    //   }
                    // }}
                    color={focused ? '#0063A7' : '#3C3C3C'}
                    size={Dimension.font20}></MaterialCommunityIcon>
                ),
              }}
              component={WebViewScreen}
              initialParams={{
                URL: 'Dashboard',
              }}></Tab.Screen>
            {/* <Tab.Screen
              key={'3'}
              name="Cart"
              title="Cart"
              options={{
                headerShown: false,
                tabBarLabel: 'Cart',
                tabBarLabelStyle: styles.tabText,
                tabBarIcon: ({ focused, color }) => (
                  <MaterialCommunityIcon
                    name={'cart-outline'}
                    color={focused ? '#0063A7' : '#3C3C3C'}
                    size={Dimension.font20}></MaterialCommunityIcon>
                  // <CustomeIcon
                  //   name="Cart"
                  //   color={focused ? '#0063A7' : '#3C3C3C'}
                  //   size={Dimension.font20}
                  // />
                ),
              }}
              component={WebViewScreen}></Tab.Screen> */}
            <Tab.Screen
              key={'4'}
              name="Report"
              title="Setting"
              options={{
                headerShown: false,
                tabBarLabel: 'Reports',
                tabBarLabelStyle: styles.tabText,
                tabBarIcon: ({ focused, color }) => (
                  <MaterialCommunityIcon
                    name={'file-document-outline'}
                    color={focused ? '#0063A7' : '#3C3C3C'}
                    size={Dimension.font20}></MaterialCommunityIcon>

                  // <CustomeIcon
                  //   name="Report"
                  //   color={focused ? '#0063A7' : '#3C3C3C'}
                  //   size={Dimension.font20}
                  // />
                ),
              }}
              component={ReportStack}></Tab.Screen>
            <Tab.Screen
              key={'5'}
              title="Setting2"
              name="MoreScreen"
              options={{
                headerShown: false,
                tabBarLabel: 'More',
                tabBarLabelStyle: styles.tabText,
                tabBarIcon: ({ focused, color }) => (
                  <MaterialCommunityIcon
                    name={'dots-vertical'}
                    color={focused ? '#0063A7' : '#3C3C3C'}
                    size={Dimension.font20}></MaterialCommunityIcon>

                  // <CustomeIcon
                  //   name="More"
                  //   color={focused ? '#0063A7' : '#3C3C3C'}
                  //   size={Dimension.font20}
                  // />
                ),
              }}
              component={MoreStack}
              initialParams={{
                supplier: !isSupplier,
              }}></Tab.Screen>
          </>
        )}
      </Tab.Navigator>
      <NotificationModal
        visible={modalVisible}
        title={notificationData.title}
        message={notificationData.message}
        onClose={() => setModalVisible(false)}
        onNavigate={handleNavigate}
      />
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: Dimension.height50,
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomMediumFont,
    marginTop: -Dimension.margin8,
    marginBottom: Dimension.margin10,
  },
  iconAlignment: { alignItems: 'center', alignSelf: 'center' },
});

export default React.memo(BottomTab);
