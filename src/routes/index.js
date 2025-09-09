import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
];

export const APP_STACK_SCREENS = [
  {
    name: 'NewTab',
    component: BottomTab, //FeedScreen
  },
];

const Routes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
  };

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
                initialParams={{
                  setIsLoggedIn,
                }}
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
                initialParams={{
                  setIsLoggedIn,
                }}
              />
            ))}
          </Stack.Group>
        )}
      </Stack.Navigator>
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
