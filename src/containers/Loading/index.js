import React, {useEffect} from 'react';
import {View, ActivityIndicator, Text, Image} from 'react-native';
import Colors from '../../Theme/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {setLogin} from '../../redux/actions/auth';
import {setAuth} from '../../redux/feature/authslice';
import { STATE_STATUS } from '../../redux/constants';
import Dimension from '../../Theme/Dimension';

const LoadingScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_info');
      const firstLoginAfterLogout = await AsyncStorage.getItem(
        '@first_login_after_logout',
      );
      const isSkip = await AsyncStorage.getItem('@isSkip');

      await AsyncStorage.removeItem('rfcCase_BusinessDetails');
      await AsyncStorage.removeItem('rfcCase_PlantDetails');
      await AsyncStorage.removeItem('rfcCase_BankDetails');
      if (isSkip === 'false') {
        await AsyncStorage.setItem('@isSkip', 'false');
      } else {
        await AsyncStorage.setItem('@isSkip', 'true');
      }

      if (jsonValue) {
        const userInfo = JSON.parse(jsonValue);
        await AsyncStorage.setItem('@first_login_after_logout', 'false');
        navigation.replace('Login', {userInfo, firstLoginAfterLogout});

        // dispatch(
        //   setAuth({
        //     status: STATE_STATUS.FETCHED,
        //     data: userInfo,
        //     isLoggedIn: true,
        //   }),
        // );

        // dispatch(setLogin(route.params.setIsLoggedIn));
        // route.params.setIsLoggedIn(true);
        //navigation.navigate("Feed",{userInfo:JSON.parse(jsonValue)})
      } else {
        navigation.replace('LoginFirst');
      }
    } catch (e) {
      console.log(e);
      // error reading value
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {/* <ActivityIndicator
        size={'large'}
        color={Colors.darkBlue}
        style={{alignSelf: 'center'}}
      /> */}
       <Image
        source={require('../../assets/images/logo.png')} 
        style={[{height: Dimension.height100, width: Dimension.width200}]}
        resizeMode="contain"
      />
    </View>
  );
};

export default LoadingScreen;
