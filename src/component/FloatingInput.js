import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import colors from '../Theme/Colors';
import Dimension from '../Theme/Dimension';

const FloatingLabelInputField = props => {
  const [isFocused, setIsFocused] = useState(false);

  let inputRef = useRef();
  const handleFocus = () => {
    setIsFocused(true);
    if (props.handleFocus) {
      props.handleFocus();
    }
  };

  useEffect(() => {
    handleBlur();
    if (props.autoFocus) {
      handleFocus();
    }
  }, []);

  useEffect(() => {
    if (props.value) {
      handleBlur();
    }
  }, [props.value]);

  const handleBlur = runOnBlur => {
    //for hiding the text if it is empty
    if (props.hideLabel) {
      setIsFocused(true);
    } else {
      if (!props.value) {
        setIsFocused(false);
      } else {
        setIsFocused(true);
      }
    }
    if (props.onBlur && runOnBlur) {
      props.onBlur();
    }
  };

  const {
    label,
    placeholderTextColor = colors.graySahde1,
    disabledBorder,
    errorBorder,
    disabledLabel,
    multiline,
    heightStyle,
    inputHeight,
    autoFocus,
    placeholder,
    buttonEnabled,
    buttonComponent,
    anyProducts,
    textStyle,
    keyboardType = 'default',
    autoCapitalize = 'none',
    onChangeText,
  } = props;
  const labelStyle = {
    position: 'absolute',
    left: 0,
    top: !isFocused ? -5 : -5,
    fontSize: !isFocused ? Dimension.font12 : Dimension.font12,
    color: !isFocused ? '#A5A5A5' : '#A5A5A5',
    marginLeft: Dimension.margin10,
    // marginBottom: !isFocused ? Dimension.margin20 : 0,
    zIndex: !isFocused ? 0 : 9,
    // paddingLeft: !isFocused ? 0 : Dimension.padding5,
    // paddingRight: !isFocused ? 0 : Dimension.padding5,
    backgroundColor: !isFocused ? '#FFF' : '#FFF',
    zIndex: 2,
    fontFamily: Dimension.CustomSemiBoldFont,
  };
  const inputContainer = {
    //marginTop: Dimension.margin20,
    //   marginLeft: 10,
    marginRight: Dimension.margin10,
    // borderWidth: 1,
    // borderRadius: 8,
    fontWeight: Dimension.CustomSemiBoldFont,
    height: Dimension.height40,
    width: '100%',
    backgroundColor: colors.white,
    // borderColor: !isFocused ? "#A5A5A5" : "#A5A5A5",
    // borderTopWidth: !isFocused ? 1 : 1,
    zIndex: 1,
    overflow: 'visible',
    position: 'relative',
  };
  const parent = {
    // height: Dimension.height80,
    zIndex: 2,
  };
  // console.log(".........", props.value);
  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (inputRef && inputRef.focus) {
            inputRef.focus();
          }
        }}
        style={parent}>
        <Text numberOfLines={1} style={[labelStyle, disabledLabel]}>
          {label}
        </Text>
        <View
          style={[inputContainer, disabledBorder, errorBorder, heightStyle]}>
          {props?.disabled ? (
            <Text style={styles.DisabledtextInput}>{props.value}</Text>
          ) : (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                {...props}
                placeholderTextColor={placeholderTextColor}
                ref={ref => {
                  inputRef = ref;
                  if (props.getRef) {
                    props.getRef(ref);
                  }
                }}
                autoCapitalize={autoCapitalize}
                autoFocus={autoFocus}
                style={[
                  styles.textInput,
                  {
                    borderColor: !isFocused ? '#cbcbcb' : '#0063a7',
                  },
                  {
                    flex: 1,
                    marginTop: props?.inputHeight ? Dimension.margin30 : 0,
                    height: props?.inputHeight
                      ? Dimension.height70
                      : Dimension.height40,
                  },
                  textStyle,
                ]}
                onFocus={handleFocus}
                onBlur={() => handleBlur(true)}
                selectionColor={'#3c3c3c'}
                underlineColorAndroid={'transparent'}
                returnKeyType={'done'}
                keyboardType={keyboardType}
                accessibilityLabel={
                  props?.accessibilityData ? props?.accessibilityData : null
                }
              />
              {buttonComponent && (
                <View
                  style={[
                    styles.textInput,
                    {
                      height: Dimension.height40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderLeftWidth: buttonEnabled ? 0 : 1,
                      borderTopLeftRadius: buttonEnabled ? 0 : 1,
                      borderBottomLeftRadius: buttonEnabled ? 0 : 1,
                      borderColor: !isFocused ? '#cbcbcb' : '#0063a7',
                      // backgroundColor: 'red',

                      paddingLeft: 0,
                    },
                  ]}>
                  {buttonComponent}
                </View>
              )}

              {/* {props.buttonEnabled && (
                <TouchableOpacity
                  onPress={props.onSendOtp}
                  style={[
                    styles.textInput,
                    {
                      height: Dimension.height40,
                      borderLeftWidth: buttonEnabled ? 0 : 1,
                      borderTopLeftRadius: buttonEnabled ? 0 : 1,
                      borderBottomLeftRadius: buttonEnabled ? 0 : 1,
                    },
                  ]}>
                  <Text
                    style={{
                      fontSize: Dimension.font12,
                      color: '#0064A8',
                      alignSelf: 'center',
                      marginVertical: 10,
                      fontFamily: Dimension.CustomBoldFont,
                    }}>
                    {buttonEnabled}
                  </Text>
                </TouchableOpacity>
              )} */}
            </View>
          )}
          {props.extraView ? props.extraView() : null}
          {props.checkView ? props.checkView() : null}
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: Dimension.height40,

    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font12,
    color: colors.FontColor,
    borderWidth: 1,
    borderRadius: 4,
    // borderTopWidth: 1,
    // borderColor: "#A7B8C3",
    // borderWidth:1,
    textAlignVertical: 'center',
    backgroundColor: '#ffff',
    zIndex: 3,
    paddingLeft: Dimension.padding12,
  },
  DisabledtextInput: {
    height: Dimension.height40,
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font12,
    color: colors.PrimaryTextColor,
    // borderWidth:1,
    textAlignVertical: 'center',
    // backgroundColor:'#ffff',
    zIndex: 3,
    paddingLeft: Dimension.padding12,
    paddingRight: Dimension.padding15,
    marginTop: Platform.OS == 'android' ? 0 : Dimension.margin15,
  },
});

export default FloatingLabelInputField;
