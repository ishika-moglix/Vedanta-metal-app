import {React, useState, useEffect} from 'react';
import Dimension from '../Theme/Dimension';
import {
  StyleSheet,
  Text,
  Modal,
  View,
  Button,
  TouchableOpacity,
  Platform,
  PermissionsAndroid
} from 'react-native';
import { Camera } from 'react-native-camera-kit';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Scanner = props => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'This app requires access to your camera to scan QR codes',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
        } catch (err) {
          console.warn(err);
        }
      } else {
        // iOS: Camera permission automatically handled via Info.plist
        setHasPermission(true);
      }
    };

    requestCameraPermission();
  }, []);

console.log(hasPermission, "PermissionsAndroid.RESULTS.GRANTED");

  const onSuccess = e => {
    //alert(JSON.stringify(e))
    //setValue(JSON.stringify(e))
    props.finalValue(e);
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          props.requestclose();
        }}
        style={{ position: 'relative' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            backgroundColor: '#000',
            zIndex: 9999,
            padding: 15,
            marginTop: Platform.OS == 'ios' ? 40 : 0,
          }}>
          <Text style={styles.centerText}> Scan {props?.type} Code </Text>
          <TouchableOpacity
            onPress={() => props?.requestclose()}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcon
              name={'delete'}
              color={'#fff'}
              size={14}></MaterialCommunityIcon>
            <Text style={styles.discardTxt}>Discard</Text>
          </TouchableOpacity>
        </View>
        {hasPermission ? (
          <Camera
            style={[styles.camera, {flex:1}]}
            scanBarcode={true}
            showFrame={true}
            laserColor={'#FF0000'}
            frameColor={'#00FF00'}
            onReadCode={event => {
              console.log(
                'Scanned code:',
                event.nativeEvent.codeStringValue,
              );
              if (event?.nativeEvent?.codeStringValue) {
                onSuccess({ data: event.nativeEvent.codeStringValue });
              }
            }}
          />
        ) : (
          <View style={styles.permissionContainer}>
            <Text style={{ color: '#fff' }}>
              Camera permission not granted
            </Text>
          </View>
        )}
        {/* <RNCamera
          style={{
            flex: 1,
            width: '100%',
          }}
          // Text={'focus'}
          autoFocus={'on'}
          showMarker={true}
          onGoogleVisionBarcodesDetected={e => {
            console.log(e);
            if (e?.barcodes?.length > 0) {
              onSuccess({ data: e?.barcodes?.[0]?.data });
            }
          }}
        /> */}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'space-between',
  },
  centerText: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomMediumFont,
    color: '#fff',
  },
  discardTxt: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomRegularFont,
    color: '#fff',
    marginLeft: Dimension.margin5,
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
});

export default Scanner;
