import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import colors from '../Theme/Colors';
import Dimension from '../Theme/Dimension';

const ApplyNow = props => {
  const {
    title,
    hasIcon,
    button1,
    button2,
    disableButton1,
    disableButton2,
    disabled,
    textStyle,
    button2Style,
    button1Style,
    containerStyle
  } = props;

  const twoButtonView = () => {
    return (
      <View
        style={[{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: Dimension.padding15,
          // backgroundColor: '#fff'
          // paddingBottom: 0,
          //   backgroundColor: '',
        }, containerStyle]}>
        <TouchableOpacity
          onPress={() => props?.firstButton()}
          disabled={disableButton1}
          activeOpacity={0.85}
          style={[
            {
              backgroundColor: props?.enableButton ? '#fff' : 'green',
              borderRadius: 4,
              width: '40%',
              padding: Dimension.padding15,
              bottom: Dimension.padding2,
              zIndex: 99,
              opacity: disableButton1 ? 0.5 : 1,
            },
            textStyle,
            button1Style
          ]}>
          <Text
            style={{
              fontSize: Dimension.font16,
              fontFamily: Dimension.CustomSemiBoldFont,
              color: props?.enableButton ? '#000' : '#fff',
              alignSelf: 'center',
              fontWeight: '700',
            }}>
            {button1}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props?.secondButton()}
          disabled={props?.disableButton2}
          activeOpacity={0.85}
          style={[
            {
              backgroundColor: props?.enableButton
                ? '#0064A8'
                : !props?.disableButton2
                  ? 'green'
                  : '#CCCCCC',
              borderRadius: 4,
              width: '40%',
              paddingVertical: Dimension.padding16,
              paddingHorizontal: Dimension.padding14,
              bottom: 2,
              zIndex: 99,
              opacity: props.disableButton2 ? 0.5 : 1,
            },
            textStyle,
            button2Style
          ]}>
          <Text
            style={{
              fontSize: Dimension.font16,
              fontFamily: Dimension.CustomSemiBoldFont,
              color: props?.enableButton
                ? '#FFF'
                : !props?.disableButton2
                  ? '#FFF'
                  : '#000',
              alignSelf: 'center',
              fontWeight: '700',
            }}>
            {button2}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  console.log('button', props);

  const OneButtonView = () => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: Dimension.padding15,
          // paddingTop:5
        }}>
        <TouchableOpacity
          onPress={() => props?.onSubmit()}
          disabled={props?.disabled}
          activeOpacity={0.85}
          style={[
            {
              backgroundColor: !props?.disabled ? 'green' : '#F0F0F0',
              borderRadius: 8,
              paddingVertical: Dimension.padding10,
              // paddingHorizontal: Dimension.padding10,
              marginVertical: Dimension.margin10,
              alignItems: 'center',
              elevation: 5,
              shadowColor: '#00000029',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              borderColor: '#cbcbcb',
              borderWidth: 1,
              zIndex: 99,
            },
            textStyle,
          ]}>
          {props?.loading ? (
            <ActivityIndicator color={'#fff'} size={'small'} />
          ) : (
            <Text
              style={{
                fontSize: 15,
                color: !props?.disabled ? '#fff' : '#000',
                alignSelf: 'center',
              }}>
              {title}
            </Text>
          )}
          {/* {hasIcon ? (
          <Image
            source={require("../assets/img/arrow-right-double-line.png")}
            style={{
              marginTop: Dimension.responsiveValue5,
              width: Dimension.responsiveValue24,
              height: Dimension.responsiveValue24,
            }}
          />
        ) : null} */}
        </TouchableOpacity>
      </View>
    );
  };

  if (props.fromEditProfile) {
    return twoButtonView();
  } else {
    return OneButtonView();
  }
};

export default ApplyNow;
