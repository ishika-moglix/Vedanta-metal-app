import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Dimension from '../../Theme/Dimension';
import styles from './style';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Header from '../../component/Header';
import ENV from '../../services/url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../services';

const ServiceScreen = ({ route, navigation }) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    createAuth();
  }, []);

  const createAuth = async () => {
    const jsonValue = await AsyncStorage.getItem('@user_info');
    if (jsonValue) {
      setAuth(JSON.parse(jsonValue));
    }
  };

  const isOther = () => {
    return auth?.businessUnit == 'Aluminium';
  };

  return (
    <>
      <Header
        navigation={navigation}
        showLogo
        fromHome
        auth={auth}
        // showNotification
        canGOBack={route.name == 'Home' ? false : true}></Header>
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: Dimension.padding15,
          backgroundColor: '#F7F7F7',
        }}
        contentContainerStyle={{
          paddingBottom: Dimension.padding80,
        }}>
        <Text style={styles.headingtxt}>Approvals</Text>
        <TouchableOpacity
          style={styles.btnWrap}
          onPress={() =>
            navigation.navigate('WebView', {
              URL: `${ENV[config.PROJECT_ENV].URL}/#/pages/vmou/list?token=${auth.token}`,
              showBack: true,
            })
          }>
          <View style={styles.row}>
            <MaterialCommunityIcon
              name={'file-outline'}
              color={'#0065AC'}
              size={30}></MaterialCommunityIcon>
            <Text style={styles.btnTxt}>MOU</Text>
          </View>

          <View style={styles.row}>
            {/* <Text style={styles.redTxt}>05</Text> */}
            <MaterialCommunityIcon
              name={'chevron-right'}
              color={'#0065AC'}
              size={24}></MaterialCommunityIcon>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.btnWrap}>
          <View style={styles.row}>
            <AntDesignIcon
              name={'adduser'}
              color={'#0065AC'}
              size={30}></AntDesignIcon>
            <Text style={styles.btnTxt}>Customer & Registrations</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.redTxt}>05</Text>
            <MaterialCommunityIcon
              name={'chevron-right'}
              color={'#0065AC'}
              size={24}></MaterialCommunityIcon>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('WebView', {
              URL: `${ENV[config.PROJECT_ENV].URL}/#/pages/orders/po-list?token=${auth.token}`,
              showBack: true,
            })
          }
          style={styles.btnWrap}>
          <View style={styles.row}>
            <AntDesignIcon
              name={'filetext1'}
              color={'#0065AC'}
              size={30}></AntDesignIcon>
            <Text style={styles.btnTxt}>Planned Orders</Text>
          </View>

          <View style={styles.row}>
            {/* <Text style={styles.redTxt}>05</Text> */}
            <MaterialCommunityIcon
              name={'chevron-right'}
              color={'#0065AC'}
              size={24}></MaterialCommunityIcon>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('WebView', {
              URL: `${ENV[config.PROJECT_ENV].URL}/#/pages/orders/delivery?token=${auth.token}`,
              showBack: true,
            })
          }
          style={styles.btnWrap}>
          <View style={styles.row}>
            <AntDesignIcon
              name={'filetext1'}
              color={'#0065AC'}
              size={30}></AntDesignIcon>
            <Text style={styles.btnTxt}>Delivery Orders</Text>
          </View>

          <View style={styles.row}>
            {/* <Text style={styles.redTxt}>05</Text> */}
            <MaterialCommunityIcon
              name={'chevron-right'}
              color={'#0065AC'}
              size={24}></MaterialCommunityIcon>
          </View>
        </TouchableOpacity>
        {/* <Text style={styles.headingtxt}>Shipments</Text> */}
        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate('WebView', {
              URL: `${ENV[config.PROJECT_ENV].URL}/#/pages/inv/list?token=${auth.token}`,
              showBack: true,
            })
          }
          style={styles.btnWrap}>
          <View style={styles.row}>
            <MaterialCommunityIcon
              name={'truck-outline'}
              color={'#0065AC'}
              size={30}
              style={{transform: [{rotate: '360deg'}]}}></MaterialCommunityIcon>
            <Text style={styles.btnTxt}>{'Dispatch Details'}</Text>
          </View>

          <View style={styles.row}>
            {/* <Text style={styles.redTxt}>05</Text> 
        <MaterialCommunityIcon
          name={'chevron-right'}
          color={'#0065AC'}
          size={24}></MaterialCommunityIcon>
      </View>
    </TouchableOpacity > */
        }
        <Text style={styles.headingtxt}>Voice Of Customers</Text>
        <TouchableOpacity
          onPress={() => {
            if (!isOther()) {
              navigation.navigate('WebView', {
                URL: `${ENV[config.PROJECT_ENV].URL}/#/pages/feedback/list?token=${auth.token}`,
                showBack: true,
              });
            } else {
              navigation.navigate('Feed');
            }
          }}
          style={styles.btnWrap}>
          <View style={styles.row}>
            <MaterialCommunityIcon
              name={'account-voice'}
              color={'#0065AC'}
              size={30}
              style={{ transform: [{ rotate: '360deg' }] }}></MaterialCommunityIcon>
            <Text style={styles.btnTxt}>Voice Of Customers</Text>
          </View>

          <View style={styles.row}>
            {/* <Text style={styles.redTxt}>05</Text> */}
            <MaterialCommunityIcon
              name={'chevron-right'}
              color={'#0065AC'}
              size={24}></MaterialCommunityIcon>
          </View>
        </TouchableOpacity>
      </ScrollView >
    </>
  );
};

export default ServiceScreen;
