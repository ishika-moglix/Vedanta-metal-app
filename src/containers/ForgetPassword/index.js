import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import styles from './style';
import { Text, View, TouchableOpacity } from 'react-native';
import Dimension from '../../Theme/Dimension';
import FloatingLabelInputField from '../../component/FloatingInput';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../component/Header';
import { ScannerService } from '../../services/scannerService';
import { useSelector, useDispatch } from 'react-redux';
import { emailRegex } from '../../constants';
import Toast from 'react-native-toast-message';
import Colors from '../../Theme/Colors';
import CustomLoader from '../../component/customLoader';

const ForgetPasswordScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { status, data } = useSelector(state => state.auth);
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    if (email && email.match(emailRegex)) {
      setEmailError(false);
    } else {
      if (email == '' && email.length == 0) {
        setEmailError(false);
        setEmailErrorMessage('');
      } else {
        setEmailError(true);
        setEmailErrorMessage('Please enter a valid email address.');
      }
    }
  }, [email]);

  const isCtaDisabled = () => {
    return !email.match(emailRegex);
  };

  const handleForgetPassword = async () => {
    setLoader(true);
    try {
      const response = await ScannerService.forgotPassword(email);

      if (response?.successful) {
        const data = response.data;
        console.log('forget data', data);
        Toast.show({
          type: 'success',
          text2: response?.message || 'OTP sent successfully ',
          visibilityTime: 4000,
          autoHide: true,
        });
        navigation.navigate('Verification', { data, email });
        setLoader(false);
      } else {
        Toast.show({
          type: 'error',
          text2: response?.message || 'Something Went Wrong ',
          visibilityTime: 4000,
          autoHide: true,
        });
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      Toast.show({
        type: 'error',
        text2: response?.data?.message || 'Success',
        visibilityTime: 4000,
        autoHide: true,
      });
      console.error(error);
    }
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {loader && (
          <CustomLoader fullScreen />
        )}
        {/* <StatusBar
          translucent
          backgroundColor="#F0F7FF"
          barStyle={'dark-content'}
        /> */}
        <LinearGradient
          colors={['#E8F5FF', '#FFFFFF']}
          style={{
            width: '100%',
            flex: 1,
          }}>
          <Header
            showBack
            showText={'Forget/Reset Password'}
            beforeLogin
            //  auth={auth}
            navigation={navigation}
          />
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.titleWrap}>
                <Text style={styles.title}>Forget Password </Text>
                <Text style={styles.title2}>
                  Please enter your Email address to receive the reset password
                  OTP
                </Text>
              </View>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 12,
                  marginBottom: Dimension.margin8,
                  marginTop: Dimension.margin20,
                }}>
                Email Address*
              </Text>
              <View style={styles.inputView}>
                <FloatingLabelInputField
                  placeholder={'Enter Email Address'}
                  disabledLabel
                  onChangeText={val => setEmail(val)}
                  value={email}
                //maxLength={10}
                // keyboardType=''
                />
              </View>
              {emailError && (
                <Text style={styles.errorText}>{emailErrorMessage}</Text>
              )}
              <TouchableOpacity
                onPress={handleForgetPassword}
                disabled={loader || isCtaDisabled()}
                style={[
                  styles.loginBtn,
                  { backgroundColor: isCtaDisabled() ? '#CCCCCC' : '#0064A8' },
                ]}>
                {/* {loader && (
                  <ActivityIndicator
                    color={'#fff'}
                    size={'small'}
                    style={{marginRight: Dimension.margin12}}
                  />
                )} */}
                <Text
                  style={[
                    styles.loginText,
                    { color: isCtaDisabled() ? '#888888' : Colors.WhiteColor },
                  ]}>
                  Submit{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.replace('Login')}
                style={styles.signupBtn}>
                <Text style={styles.signupText}>Back to Login </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </>
  );
};

export default ForgetPasswordScreen;
