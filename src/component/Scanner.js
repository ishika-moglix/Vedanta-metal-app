import React from 'react';
import Dimension from '../Theme/Dimension';
import {
  StyleSheet,
  Text,
  Modal,
  View,
  Button,
  TouchableOpacity,
  Platform,
} from 'react-native';
// import { RNCamera } from 'react-native-camera';
import { CameraKitCamera, CameraKitCameraScreen } from 'react-native-camera-kit';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Scanner = props => {
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
        <CameraKitCameraScreen
          scanBarcode={true} 
          onReadCode={(event) => {
            console.log(event.nativeEvent.codeStringValue);
            props.onSuccess({ data: event.nativeEvent.codeStringValue });
          }}
          showFrame={true}
          laserColor="red"
          frameColor="white"
          hideControls={true}
          style={{
            flex: 1,
            width: '100%',
            marginTop: Platform.OS === 'ios' ? 80 : 40, 
          }}
        />
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
