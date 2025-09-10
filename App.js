/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import { NativeModules } from 'react-native';
import { StatusBar, Text, View } from 'react-native';
import { NewAppScreen } from '@react-native/new-app-screen';
import Routes from './src/routes';

import {
  SafeAreaProvider,SafeAreaView,
} from 'react-native-safe-area-context';
import {firebase} from '@react-native-firebase/analytics';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import {
  removeThreatListeners,
} from 'freerasp-react-native';

// const App = () => {
//   console.log('defwwefewfwfewfew');
  
//   return <View style={{flex: 1, backgroundColor: 'red',height:200, width: 200}}>
//     </View>
// }

// export default App;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    // this.isEmulator();
    // actions = {
    //   // Android & iOS
    //   privilegedAccess: () => {
    //     console.log('privilegedAccess');
    //   },
    //   // Android & iOS
    //   debug: () => {
    //     console.log('debug');
    //   },
    //   // Android & iOS
    //   simulator: () => {
    //     console.log('simulator');
    //   },
    //   // Android & iOS
    //   appIntegrity: () => {
    //     console.log('appIntegrity');
    //   },
    //   // Android & iOS
    //   unofficialStore: () => {
    //     console.log('unofficialStore');
    //     this.setState({
    //       show: false,
    //     });
    //   },
    //   // Android & iOS
    //   hooks: () => {
    //     console.log('hooks');
    //   },
    //   // Android & iOS
    //   deviceBinding: () => {
    //     console.log('deviceBinding');
    //   },
    //   // Android & iOS
    //   secureHardwareNotAvailable: () => {
    //     console.log('secureHardwareNotAvailable');
    //   },
    //   // Android & iOS
    //   passcode: () => {
    //     console.log('passcode');
    //   },
    //   // iOS only
    //   deviceID: () => {
    //     console.log('deviceID');
    //   },
    //   // Android only
    //   obfuscationIssues: () => {
    //     console.log('obfuscationIssues');
    //   },
    // };
    // useFreeRasp(config, actions);
    // setThreatListeners(actions);
    // talsecStart(config);
  }

  state = {
    show: true,
    loading: false,
  };

  collectAnalytics = async () => {
    await firebase.analytics().setAnalyticsCollectionEnabled(true);
  };

  componentDidMount() {
    this.collectAnalytics();
  }

  // componentWillUnmount() {
  //   if (typeof removeThreatListeners === 'function') {
  //     removeThreatListeners();
  //   }
  // }
  render() {
    const { show, loading } = this.state;
    
    if (!show) {
      return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <Text
            style={{
              alignSelf: 'center',
              margin: 12,
              color: '#000',
              fontWeight: '600',
            }}>
            {loading
              ? ''
              : 'Unable to run app on rooted devices or Emulator or If the app is not downloaded from a trusted source!'}
          </Text>
        </View>
      );
    } else {
      // return (
      //   <GestureHandlerRootView style={{ flex: 1 }}>
      //     <Provider store={store}>
      //       <SafeAreaView style={{ flex: 1 }}>
      //         <Routes />
      //       </SafeAreaView>
      //     </Provider>
      //   </GestureHandlerRootView>
      // ); 
      return (
        <SafeAreaProvider> 
 {/* <View style={{
  flex: 1,
  backgroundColor: 'red',
  padding: Platform.OS === 'android' ? StatusBar.currentHeight : 0
}}> */}
        <StatusBar backgroundColor="#E8F5FF" barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
        <Provider store={store}>
            <Routes />
        </Provider>
      </SafeAreaView>
        </SafeAreaProvider>
      );
    }
  }
}



// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import { NewAppScreen } from '@react-native/new-app-screen';
// import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <AppContent />
//     </SafeAreaProvider>
//   );
// }

// function AppContent() {
//   const safeAreaInsets = useSafeAreaInsets();

//   return (
//     <View style={styles.container}>
//       <NewAppScreen
//         templateFileName="App.tsx"
//         safeAreaInsets={safeAreaInsets}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default App;
