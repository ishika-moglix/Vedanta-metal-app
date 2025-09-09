import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  ActivityIndicator,
  Platform,
  View,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../component/Header';
import { WebView } from 'react-native-webview';
import CONSTANTS from '../services/constant';
import Dimension from '../Theme/Dimension';
import { BackHandler } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import RNFetchBlob from 'react-native-blob-util';
import Toast from 'react-native-toast-message';
import Share from 'react-native-share';
import ENV from '../services/url';
import { setAuth } from '../redux/feature/authslice';
import { ScannerService } from '../services/scannerService';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { STATE_STATUS } from '../redux/constants';
// import { stat } from 'react-native-fs';
import { resetHomeState } from '../redux/feature/homeSlice';
import { useFocusEffect } from '@react-navigation/native';
import config from '../services';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// const WebViewScreen = ({props?.route, props?.navigation, props}) => {
const WebViewScreen = props => {
  const currentUrl = useRef('');
  const authState = useSelector(state => state.auth);
  const authData = useSelector(state => state?.auth?.data);
  const dispatch = useDispatch();
  // const { status, data } = useSelector((state) => state.auth.auth);
  const isBlank = useRef(false);
  const [finalUrl, setUrl] = useState('');
  const [loader, setLoader] = useState(true);
  const [showBack, setShowBack] = useState(false);
  const [auth, setAuthData] = useState({});
  const [canGoBacky, setCanGoBack] = useState(false);
  useEffect(() => {
    if (props?.route.params && props?.route.params.URL) {
      console.log('url terms', props?.route);

      if (
        //props?.route.params.URL.includes('manage/account') ||
        props?.route.params.URL == 'Learning' ||
        props?.route.params.URL == 'Rate' ||
        props?.route.params.URL == 'Dashboard' ||
        props?.route.params.URL == 'MOU' ||
        props?.route.params.URL == 'Reports' ||
        props?.route.params.URL.includes('terms') ||
        props?.route.params.URL.includes('pages/feedback/list') ||
        props?.route.params.URL.includes('pages/mnotification') ||
        props?.route.params.URL.includes('orders/po-list') ||
        props?.route.params.URL.includes('orders/delivery') ||
        props?.route.params.URL.includes('inv/list') ||
        props?.route.params.URL.includes('vmou/list') ||
        props?.route.params.URL.includes('vmou/draftcreateV2') ||
        props?.route.params.URL.includes('vmou/createV2') ||
        props?.route.params.URL.includes('vmou/createNFA')
        // props?.route.params.URL.includes('vmou/list')
      ) {
        otherWeb();
      } else {
        getData();
        // setUrl(props?.route.params.URL);
      }
    } else {
      getData();
    }
  }, []);
  // useEffect(() => {
  //   createAuth();
  //   const backAction = () => {
  // if (isBlank.current) {
  //   isBlank.current = false;
  //   webview?.current?.goForward();
  // } else {
  //       webview?.current?.goBack();
  //     }
  //   };
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );
  //   return () => backHandler.remove();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isBlank.current) {
          isBlank.current = false;
          // webview?.current?.goForward();
          props?.navigation.goBack();
          return true;
        }
        if (canGoBacky && webview.current) {
          webview.current.goBack();
          return true;
        }
        props?.navigation.goBack();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );
      return () => subscription.remove();
    }, [canGoBacky])
  );


  const createAuth = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_info');
      if (jsonValue) {
        setAuthData(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log(e);
    }
  };
  // console.log('see rtyu', props);
  // webview added after discussion
  const otherWeb = async () => {
    console.log("BROWSW HIT.....................1");

    try {
      const jsonValue = await AsyncStorage.getItem('@user_info');
      if (jsonValue) {
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let info = JSON.parse(jsonValue);
        let plantId = JSON.parse(getPlantId);
        var exp_url;
        if (
          props?.route.params.URL.includes('orders/po-list') ||
          props?.route.params.URL.includes('orders/delivery') ||
          props?.route.params.URL.includes('inv/list') ||
          props?.route.params.URL.includes('vmou/list') ||
          props?.route.params.URL.includes('vmou/createNFA') ||
          props?.route.params.URL.includes('vmou/draftcreateV2') ||
          props?.route.params.URL.includes('vmou/createV2') ||
          props?.route.params.URL.includes('pages/mnotification')
        ) {
           exp_url = props?.route?.params?.URL?.includes('plantId')
  ? props.route.params.URL
  : `${props.route.params.URL}&plantId=${plantId?.plantId}`;
          // exp_url = {props?.route.params.URL.includes('plantId')? props?.route.params.URL : props?.route.params.URL + '&plantId=' + plantId?.plantId};
        } else if (props?.route.params.URL.includes('pages/mnotification')) {
          exp_url =
            CONSTANTS.WEBURL.NOTIFICATION +
            '?token=' +
            info.token +
            '&plantId=' +
            plantId?.plantId;
        } else if (props?.route.params.URL.includes('pages/feedback/list')) {
          exp_url = props?.route.params.URL;
        }
        else if (props?.route.params.URL === 'Learning') {
          exp_url =
            CONSTANTS.WEBURL.Learning +
            '?token=' +
            info.token +
            '&plantId=' +
            plantId?.plantId;
        } else if (props?.route.params.URL === 'Rate') {
          exp_url =
            CONSTANTS.WEBURL.Rate +
            '?token=' +
            info.token +
            '&plantId=' +
            plantId?.plantId;
        } else if (props?.route.params.URL === 'Dashboard') {
          //https://vedanta-qa.moglilabs.com/#/pages/vdashboard
          exp_url =
            CONSTANTS.WEBURL.TAB_WEB +
            'vdashboard?token=' +
            info.token +
            '&plantId=' +
            plantId?.plantId;
          setShowBack(!showBack)
        } else if (props?.route.params.URL === 'MOU') {
          //https://vedanta-qa.moglilabs.com/#/pages/vdashboard
          exp_url =
            CONSTANTS.WEBURL.MOU +
            '?token=' +
            info.token +
            '&plantId=' +
            plantId?.plantId;
        } else if (props?.route.params.URL === 'Reports') {
          console.log('if 2');
          exp_url =
            CONSTANTS.WEBURL.TAB_WEB +
            `${info?.userEmail?.split('@')?.[1] != 'vedanta.co.in' &&
              info?.userEmail?.split('@')?.[1] != 'moglix.com'
              ? 'mreports?token='
              : 'mreports?token='
            }` +
            info.token +
            '&plantId=' +
            plantId?.plantId;
          // Alert.alert(`${exp_url.split('token')[1]})`);
        }
        // else if (props?.route.params.URL.includes('manage/account')) {
        //   //https://vedanta-qa.moglilabs.com/#/pages/vdashboard
        //   exp_url = props?.route.params.URL + '?token=' + info.token;
        // }
        setUrl(exp_url);
        await AsyncStorage.setItem('@final_Url', exp_url);
      } else {

        if (props?.route.params.URL.includes('terms')) {
          exp_url = props?.route.params.URL;
        }
        // console.log('exp', exp_url);

        setUrl(exp_url);
        await AsyncStorage.setItem('@final_Url', exp_url);
      }
    } catch (e) {
      console.log(e);
      // error reading value
    }
  };
  //props.props?.route.params.URL
  let webview = useRef(null);
  // console.log('props', props);

  const getData = async () => {
    console.log("BROWSW HIT.....................2");
    try {
      const jsonValue = await AsyncStorage.getItem('@user_info');
      console.log("JSON Value", jsonValue);

      if (jsonValue) {
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let info = JSON.parse(jsonValue);
        let plantId = JSON.parse(getPlantId);
        // console.log('plant id in webView ', plantId);
        var exp_url;
        if (props?.route.name == 'Home') {
          console.log('if 1');
          setShowBack(false);
          // exp_url =
          //   CONSTANTS.WEBURL.TAB_WEB +
          //   'vcatalog/all-products?token=' +
          //   info.token;
          exp_url =
            CONSTANTS.WEBURL.TAB_WEB +
            'vcatalog/all-products?token=' +
            info.token +
            '&plantId=' +
            plantId?.plantId;
          // console.log('home exp url', exp_url, info, plantId);
        } else if (props?.route.name == 'Report') {
          console.log('if 2');
          exp_url =
            CONSTANTS.WEBURL.TAB_WEB +
            `${info?.userEmail?.split('@')?.[1] != 'vedanta.co.in' &&
              info?.userEmail?.split('@')?.[1] != 'moglix.com'
              ? 'mreports?token='
              : 'mreports?token='
            }` +
            info.token +
            '&plantId=' +
            plantId?.plantId;
          // Alert.alert(`${exp_url.split('token')[1]})`);
        } else if (props?.route.name == 'Procurement') {
          console.log('if 3');
          exp_url =
            CONSTANTS.WEBURL.TAB_WEB +
            'procurement?token=' +
            info.token +
            '&plantId=' +
            plantId?.plantId;
        } else if (props?.route.name == 'Cart') {
          console.log('if 4');
          exp_url =
            CONSTANTS.WEBURL.TAB_WEB +
            'vcatalog/plan-order?token=' +
            info.token +
            '&plantId=' +
            plantId?.plantId;
        } else if (
          props?.route.name === 'WebView' &&
          props?.route?.params?.URL
        ) {
          console.log('if 5');
          console.log(
            'hit',
            props?.route.name == 'WebView' && props?.route?.params?.URL,
          );
          if (props?.route?.params?.URL.includes('/pages/vcatalog/all-products')) {
            setShowBack(false);
          }
          exp_url = props?.route?.params?.URL;
          // Alert.alert(`${exp_url.split('token')[1]})`);
          // Alert.alert(exp_url);
          setUrl(exp_url);
          await AsyncStorage.setItem('@final_Url', exp_url);
        } else {
          console.log('if 6');
          exp_url =
            CONSTANTS.WEBURL.TAB_WEB +
            'vcatalog/plan-order?token=' +
            info.token +
            '&plantId=' +
            plantId?.plantId;
        }
        setUrl(exp_url);
        await AsyncStorage.setItem('@final_Url', exp_url);
        // alert(exp_url);
        //"https://vedanta-qa.moglilabs.com/#/login?email=s.swetha@vedanta.co.in&pwd=dontKnow&BU=Aluminium"
      }
      else if (
        props?.route.name === 'WebView' &&
        props?.route?.params?.URL
      ) {
        console.log('if 5');
        console.log(
          'hit',
          props?.route.name == 'WebView' && props?.route?.params?.URL,
        );

        exp_url = props?.route?.params?.URL;
        setUrl(exp_url);
        // await AsyncStorage.setItem('@final_Url', exp_url);
      }
    }
    // } else {
    //   console.log(
    //     'hit',
    //     props?.route.name == 'WebView' && props?.route?.params?.URL,
    //     props?.route.params.URL,
    //   );
    //   setUrl(props?.route.params.URL);
    // }
    catch (e) {
      console.log(e);
      // error reading value
    }
  };
  const closeWebView = () => {
    {
      // if (props?.route?.params?.fromLogin) {
      //   props.navigation.popToTop();
      // } else {
      props.navigation.goBack();
      // }
      return true;
    }
  };

  const goBackFunc = () => {
    if (
      finalUrl.includes('rating') ||
      finalUrl.includes('learningCenter') ||
      //finalUrl.includes('manage/account') ||
      finalUrl.includes('vmou/list') ||
      finalUrl.includes('/vmou/list') ||
      finalUrl.includes(ENV[config.PROJECT_ENV].BROWSER) ||
      finalUrl.includes('/signup') ||
      finalUrl.includes('terms')
    ) {
      props?.navigation.goBack();
    } else {
      webview?.current?.goBack();
    }
  };

  const LogoutFn = async () => {
    const { logoutApiData } = await ScannerService.logoutApi({
      token: authData?.token,
      iduser: authData?.userId || authData?.idUser,
    });

    await AsyncStorage.removeItem('@user_info');
    await AsyncStorage.removeItem('@plantCode');
    await AsyncStorage.removeItem('@plantId')
    await AsyncStorage.removeItem('@get_session')
    dispatch(resetHomeState());
    dispatch(
      setAuth({
        status: STATE_STATUS.UNFETCHED,
        data: {},
      }),
    );
    //Alert.alert('logout');
    Toast.show({
      type: 'success',
      text2: 'Logout Successfully',
      visibilityTime: 4000,
      autoHide: true,
    });
    // navigation.navigate('LoginFirst')

    await AsyncStorage.clear();
    await AsyncStorage.setItem('@first_login_after_logout', 'true');
    // auuth.setIsLoggedIn(false);
  };
  console.log("See this ", props);

  // const LogoutFn = async () => {
  //   await AsyncStorage.clear();
  //   authState.setIsLoggedIn(false);
  // };

 
const downLoadFileIos = async (url, fileName, extension) => {
  try {
    const { DocumentDir, DownloadDir } = RNFetchBlob.fs.dirs;

    const fPath =
      (Platform.OS === 'android' ? DownloadDir : DocumentDir) +
      '/' +
      fileName +
      '.' +
      extension;

    const configOptions = Platform.select({
      ios: {
        fileCache: true,
        path: fPath,
        appendExt: extension,
        mime: `application/${extension}`,
      },
      android: {
        fileCache: true,
        path: fPath,
        appendExt: extension,
        mime: `application/${extension}`,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: fPath,
          description: 'Downloading File...',
          mime: `application/${extension}`,
        },
      },
    });

    const res = await RNFetchBlob.config(configOptions).fetch('GET', url);

    if (Platform.OS === 'ios') {
      const options = {
        type: `application/${extension}`,
        url: res.path(),
        saveToFiles: true,
      };
      await Share.open(options).catch(err => console.log(err));
    }

    // Toast.show({ type: 'success', text2: 'File downloaded successfully!' });
  } catch (e) {
    Toast.show({
      type: 'error',
      text2: e?.message || 'Something went wrong!',
      visibilityTime: 4000,
      autoHide: true,
    });
  }
};

  
  // const downLoadFileIos = async (url, fileName, extension) => {
  //   const {
  //     dirs: { DocumentDir, DownloadDir },
  //   } = RNFetchBlob.fs;
  //   const { config } = RNFetchBlob;
  //   const fPath =
  //     (Platform.OS == 'android' ? DownloadDir : DocumentDir) +
  //     '/' +
  //     fileName +
  //     '.' +
  //     extension;
  //   const configOptions = Platform.select({
  //     ios: {
  //       fileCache: true,
  //       path: fPath,
  //       mime: 'application/' + extension,
  //       appendExt: extension,
  //       // path: fPath,
  //       notification: true,
  //     },
  //     android: {
  //       fileCache: true,
  //       path: fPath,
  //       mime: 'application/' + extension,
  //       useDownloadManager: true,
  //       appendExt: extension,
  //       addAndroidDownloads: {
  //         mime: 'application/' + extension,
  //         appendExt: extension,
  //         useDownloadManager: true,
  //         notification: true,
  //         path: fPath,
  //         description: 'Downloading File...',
  //       },
  //     },
  //   });
  //   config(configOptions)
  //     .fetch('GET', url)
  //     .then(res => {
  //       if (Platform.OS == 'ios') {
  //         let options = {
  //           type: 'application/' + extension,
  //           url: res.path(),
  //           saveToFiles: true,
  //         };
  //         Share.open(options)
  //           .then(resp => console.log(resp))
  //           .catch(err => console.log(err));
  //       }
  //       // Toast.show('File downloaded successfully!');
  //     })
  //     .catch(e => {
  //       Toast.show({
  //         type: 'error',
  //         text2: e || 'Something went wrong!',
  //         visibilityTime: 4000,
  //         autoHide: true,
  //       });
  //     });
  // };



  // Alert.alert(`final url, ${finalUrl}`);
  console.log(finalUrl, 'finalUrl');
  console.log('webview props', props, "showback", showBack);

  const INJECTEDJAVASCRIPT =
    "const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); ";
  return (
    <>
      {/* <SafeAreaView style={{
  flex: 1,
  backgroundColor: '#E8F5FF',
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
}}>
  <StatusBar backgroundColor="#E8F5FF" barStyle="dark-content" />
         */}
        
   
   <View
     style={{
       backgroundColor: '#E8F5FF',
     }}>
     {props?.route?.params?.URL === 'Reports' || props?.route?.name === 'Report'? (
       <Header
         navigation={{
           ...props?.navigation,
           goBack: () =>
             showBack ? goBackFunc() : props?.navigation.goBack(),
         }}
         showText={'Report'}
         auth={auth}
         showBack
         canGOBack={props?.route.name == 'Home' ? false : true}
         currentScreen={props?.route?.name}
       />
     ) :
        props?.route?.params?.fromPage === 'Mou' ?
        ( <Header
         navigation={{
           ...props?.navigation,
           goBack: () =>
             showBack ? goBackFunc() : props?.navigation.goBack(),
         }}
         showText={props?.route?.params?.id}
         auth={auth}
         showBack
         canGOBack={props?.route.name == 'Home' ? false : true}
         currentScreen={props?.route?.name}
         />
         ) : (
       <Header
         navigation={{
           ...props?.navigation,
           goBack: () =>
             showBack ? goBackFunc() : props?.navigation.goBack(),
         }}
         showLogo
         showLogout={
           props?.route?.params && props?.route?.params.URL ? false : true
         }
         fromExp={props?.route?.params?.fromExp}
         // beforeLogin={props.beforeLogin}
         // fromHome={auth?.userName}
         auth={auth}
         showPlant={!props?.route?.params?.fromExp}
         showNotification={!props?.route?.params?.fromExp}
         showScanner={!props?.route?.params?.fromExp}
         showBack={props?.route?.params?.URL === 'Dashboard' ? false : (props?.route?.params?.showBack || showBack)}
         canGOBack={props?.route?.name == 'Home' ? false : true}
         showFolder={!props?.route?.params?.fromExp}
         currentScreen={props?.route?.name}
         showCart

       //beforeLogin
       //showMenu
       //showExportData
       />
     )}
   </View>
   {loader && (
     <ActivityIndicator
       style={{
         alignItems: 'center',
         margin: Dimension.padding12,
       }}
       size="small"
     />
   )}
   {finalUrl ? (
     <WebView
       originWhitelist={['*']}
       cacheEnabled={false}
       source={{ uri: finalUrl }}
       domStorageEnabled={true}
       onLoadEnd={() => setLoader(false)}
       allowsFullscreenVideo={true}
       onLoadStart={() => setLoader(true)}
       onLoad={() => setLoader(false)}
       onNavigationStateChange={navState => {
         console.log("NvState url is ", navState);

         setCanGoBack(navState.canGoBack);
         if (Platform.OS == 'ios') {
           let splitUrl = navState?.url?.split('.');
           let extension =
             splitUrl?.length > 1 ? splitUrl?.[splitUrl?.length - 1] : '';
           let isFile = [
             'csv',
             'xlsx',
             'txt',
             'doc',
             'docx',
             'jpg',
             'png',
             'jpeg',
             'pdf',
             'CSV',
             'XLSX',
             'TXT',
             'DOC',
             'DOCX',
             'JPG',
             'PNG',
             'JPEG',
             'PDF',
           ].includes(extension);
           if (isFile) {
             if (currentUrl.current != navState?.url) {
               currentUrl.current = navState?.url;
               downLoadFileIos(navState?.url, String(Date.now()), extension);
             }
           } else {
             currentUrl.current = '';
           }
           // alert(navState?.url);
         }
         if (navState?.url?.includes('pages/vmou/draflist')) {
           console.log("hit pages/vmou/draflist");
           props?.navigation?.replace('Contract', { activeTabKey: '0' });
         }
         if (navState?.url?.includes('pages/vmou/list')) {
           console.log("hit pages/vmou/list");
           props?.navigation?.replace('Contract', { activeTabKey: '1' });
         }
         if (navState?.url?.includes('vmou/nfa/NFAListing')) {
           console.log("hit vmou/nfa/NFAListing");
           props?.navigation?.replace('Contract', { activeTabKey: '2' });
         }
         if (navState?.url?.includes('login')) {
           LogoutFn();
         }
         if (navState.url === 'about:blank') {
           isBlank.current = true;
         } else {
           isBlank.current = false;
         }
         if (navState?.url.includes('pages/vcatalog/all-products')) {
           setShowBack(false)
         }
         if (
           navState?.url != finalUrl && !navState?.url.includes('pages/vcatalog/all-products') ||
           navState?.url.includes('rating') ||
           navState?.url.includes('learningCenter') ||
           //  navState?.url.includes('manage/account') ||
           navState?.url.includes('/vmou/list') ||
           navState?.url.includes(ENV[config.PROJECT_ENV].BROWSER) ||
           navState?.url.includes('/terms') ||
           navState?.url.includes('/signup')
         ) {
           setShowBack(true);
         } else {
           setShowBack(false);
         }
       }}
       allowsBackForwardnavigationGestures={true}
       // allowFileAccess={true}
       // javaScriptEnabled={true}
       // allowUniversalAccessFromFileURLs={true}
       // allowingReadAccessToURL={true}
       // mixedContentMode={'always'}
       //   onFileDownload={({ nativeEvent: { downloadUrl } }) =>
       //     alert(downloadUrl)
       //   }
       injectedJavaScript={INJECTEDJAVASCRIPT}
       scalesPageToFit={false}
       javaScriptEnabled={true}
       ref={webview}
       // scalesPageToFit={true}
       style={{ flex: 1, marginTop: 10 }}
     />
   ) : null}
 {/* </SafeAreaView> */}
    </>
   
    
   
  );
};

export default WebViewScreen;
