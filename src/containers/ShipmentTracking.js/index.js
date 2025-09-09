import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import { TextInput, Radio } from 'mog-react-native-form-fields';
import Dimension from '../../Theme/Dimension';
import Header from '../../component/Header';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import NextButton from '../../component/Button';
import DatePickerInput from '../../component/DateTimePicker';

const ShipmentTracking = props => {
  const openURL = url => {
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        navigation={{
          ...props?.navigation,
          goBack: () => props?.navigation.pop(),
        }}
        showText={'Shipment Tracking'}
        showBack
        currentScreen={props?.props?.route?.name}
      />
      <View style={style.containerWrap}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={style.username}>Shipment Tracking</Text>
          <View style={style.box}>
            <Text style={[style.update, style.paddingText]}>
              The module has been created to provide tracking of your orders
              from Hindustan Zinc’s plants and depots.
            </Text>
            <View style={style.separator}></View>
            <Text style={[style.welcome]}>
              There are 2 types of tracking types available to choose from:
            </Text>
            <Text
              style={[
                style.welcome,
                {
                  fontWeight: 'bold',
                  marginVertical: Dimension.margin4,
                  paddingVertical: Dimension.padding4,
                },
              ]}>
              1. GPS Tracking
            </Text>
            <Text
              style={[
                style.welcome,
                {
                  fontWeight: 'bold',
                  marginVertical: Dimension.margin5,
                  paddingBottom: Dimension.margin20,
                },
              ]}>
              2. SIM Tracking
            </Text>
          </View>

          <Text style={[style.update]}>GPS Tracking</Text>
          <Text style={[style.welcome, style.paddingText, { lineHeight: 20 }]}>
            To enable this, the GPS device present in the vehicle needs to be
            integrated with our tracking bots. Please share the below links with
            your transporter to get the required integration to enable the GPS
            tracking mechanism:
          </Text>
          <View style={style.row}>
            <Text style={[style.update]}>API Link: </Text>
            <TouchableOpacity
              onPress={() =>
                openURL('https://gts.fareye.co/trucks/fareye/gpsTrackPost')
              }
            >
              <Text
                style={[style.linkUrl, { flexShrink: 1 }]}
                numberOfLines={0}>
                https://gts.fareye.co/trucks/fareye/gpsTrackPost
              </Text>
            </TouchableOpacity>
          </View>
          <View style={style.row}>
            <Text style={[style.update]}>Sample code for integration: </Text>
            <TouchableOpacity
              onPress={() => openURL('https://gts.fareye.co/api-docs/')}
            >
              <Text style={[style.linkUrl, { flexWrap: 'wrap', flexShrink: 1 }]}>https://gts.fareye.co/api-docs/</Text>
            </TouchableOpacity>
          </View>

          <Text style={[style.welcome, style.paddingText, { lineHeight: 20 }]}>
            To select GPS tracking, navigate to the dispatch details page and
            click on the GPS tracking button against the trip. You will get a
            pop-up confirmation message after clicking the button. Once
            confirmed, the GPS tracking will be activated.
          </Text>
          <Text style={[style.update, style.paddingText]}>
            Tracking frequency: 5 minutes
          </Text>
          <Text style={[style.welcome, style.paddingText, { lineHeight: 20 }]}>
            Once GPS tracking is enabled, you cannot opt for SIM tracking for
            that specific trip.
          </Text>
          <View style={style.separator}></View>

          <Text style={[style.update]}>SIM Tracking</Text>
          <Text style={[style.welcome, style.paddingText, { lineHeight: 20 }]}>
            To enable this, the tracking bots need to receive a consent from the
            vehicle driver via SMS/call.
          </Text>
          <Text style={[style.welcome, { lineHeight: 20 }]}>
            To select SIM tracking, navigate to the dispatch details page and
            click on the SIM tracking button against the trip. You will get a
            pop-up confirmation message after clicking the button. You will also
            have the option to edit the driver’s contact number in that message.
            Once confirmed, the SIM tracking will be activated.
          </Text>
          <Text style={[style.update]}>Tracking frequency: 30 minutes</Text>
          <Text style={[style.welcome, { lineHeight: 20 }]}>
            Once SIM tracking is enabled, you cannot opt for GPS tracking for
            that specific trip.
          </Text>
          <Text style={[style.welcome, style.paddingText]}>
            In case of non JIO user, the below consent SMS will be sent to the
            drivers:
          </Text>
          <View
            style={[
              style.row,
              { padding: Dimension.padding10, justifyContent: 'space-between' },
            ]}>
            <Image
              source={require('../../assets/images/ss-1.webp')}
              style={{
                width: Dimension.width150,
                height: Dimension.height100,
              }}
            />
            <Image
              source={require('../../assets/images/ss-2.webp')}
              style={{
                width: Dimension.width180,
                height: Dimension.height100,
              }}
            />
          </View>
          <Text style={[style.welcome, style.paddingText]}>
            In case of JIO user, the following SMS will be sent to the drivers:
          </Text>
          <View
            style={[
              style.row,
              { padding: Dimension.padding10, justifyContent: 'space-between' },
            ]}>
            <Image
              source={require('../../assets/images/jio-user-1.webp')}
              style={{
                width: Dimension.width150,
                height: Dimension.height100,
              }}
            />
            <Image
              source={require('../../assets/images/jio-user2.webp')}
              style={{
                width: Dimension.width180,
                height: Dimension.height100,
              }}
            />
          </View>
          <Text style={[style.welcome, style.paddingText]}>
            The drivers can give consent using link in second message as
            follows:
          </Text>
          <View
            style={[
              style.row,
              { padding: Dimension.padding10, justifyContent: 'space-between' },
            ]}>
            <Image
              source={require('../../assets/images/drivers-1.webp')}
              style={style.image}
            />
            <Image
              source={require('../../assets/images/drivers-2.webp')}
              style={style.image}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  // paddingText: {
  // marginBottom: Dimension.margin8,
  // paddingVertical: Dimension.padding4,
  // paddingHorizontal: 5,
  // },
  linkText: {
    fontWeight: 'bold',
    marginTop: Dimension.margin4,
  },
  linkUrl: {
    color: '#0066CC',
    textDecorationLine: 'underline',
    marginTop: Dimension.margin5,
    // paddingHorizontal: Dimension.margin5,
    // maxWidth: '50%'
  },
  containerWrap: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: Dimension.padding15,
  },
  username: {
    fontSize: Dimension.font20,
    color: '#363636',
    fontWeight: 'bold',
    fontFamily: Dimension.CustomBoldFont,
    marginBottom: Dimension.margin10,
  },
  update: {
    fontSize: Dimension.font16,
    color: '#363636',
    fontWeight: 'bold',
    fontFamily: Dimension.CustomBoldFont,
    marginTop: Dimension.margin15,
    marginLeft: Dimension.margin5,
  },
  text1: {
    fontSize: Dimension.font16,
    color: '#363636',
    fontWeight: 'bold',
    fontFamily: Dimension.CustomBoldFont,
  },
  welcome: {
    color: '#363636',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomRegularFont,
    // marginBottom: Dimension.margin8,
    paddingVertical: Dimension.padding4,
    paddingHorizontal: Dimension.padding10,
  },
  box: {
    backgroundColor: '#fff',
    marginBottom: Dimension.margin10,
    // padding: Dimension.padding15,
  },

  // row: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   // marginVertical: Dimension.margin5,
  // },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  separator: {
    height: 1,
    backgroundColor: '#838383',
    width: '100%',
    marginVertical: Dimension.margin10,
  },
  // row: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   // flex: 1,
  //   padding: Dimension.padding10,
  // },

  image: {
    width: Dimension.width160,
    height: Dimension.height250,
  },
  separator: {
    height: 1,
    backgroundColor: '#838383',
    width: '100%',
    marginVertical: Dimension.margin10,
  },
});

export default ShipmentTracking;
