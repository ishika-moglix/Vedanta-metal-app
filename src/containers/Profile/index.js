import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  Image,
  Button,
  PermissionsAndroid,
  KeyboardAvoidingView,
} from 'react-native';
import Dimension from '../../Theme/Dimension';
import CONSTANTS from '../../services/constant';
import styles from './style';
import Header from '../../component/Header';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScannerService } from '../../services/scannerService';
import ENV from '../../services/url';
import { useSelector, useDispatch } from 'react-redux';
import FloatingLabelInputField from '../../component/FloatingInput';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { setAuth } from '../../redux/feature/authslice';
import { STATE_STATUS } from '../../redux/constants';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import SaveButton from '../../component/Button';
import RNFetchBlob from 'rn-fetch-blob';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePickerInput from '../../component/DateTimePicker';
import { convertDate, convertedDate, convertEpochToDate } from '../../utils/BiometricAuth';
import Toast from 'react-native-toast-message';
import CustomLoader from '../../component/customLoader';
import { request, check, RESULTS, PERMISSIONS } from 'react-native-permissions';
const Profile = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth.data);
  // const selectedImages = useSelector((state)=> state.auth.auth.selectedImage)
  const auth = useSelector(state => state.auth);
  const [userType, setUserType] = useState(false);
  const [user, setUser] = useState({});
  // const [authdata, setAuthdata] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [email, setEmail] = useState(
    authData?.userEmail || authData?.emailId || '',
  );
  const [phoneNumber, setPhoneNUmber] = useState(
    authData?.phoneNo || authData?.phoneNumber || authData?.phone || '',
  );
  const [additionalPhoneNo, setAdditionalPhoneNumber] = useState(
    authData?.additionalPhone || '',
  );
  const [loader, setLoader] = useState(false);
  const [dob, setDob] = useState(convertedDate(authData?.dob) || '');
  const [name, setName] = useState(authData?.userName || authData?.name || '');
  const [functionalArea, setFunctionalArea] = useState(
    authData?.functionalArea || '',
  );
  const [state, setState] = useState(authData?.state || '');
  const [city, setCity] = useState(authData?.city || '');
  const [profileImage, setProfileImage] = useState('');
  useEffect(() => {
    getData();
  }, [])
  useEffect(() => {
    checkDetail();
  }, []);
  useEffect(() => {
    getSession();
  }, []);

  const LogoutFn = async () => {
    const { logoutApiData } = await ScannerService.logoutApi({
      token: authData?.token,
      iduser: authData?.userId || authData?.idUser,
    });
    await AsyncStorage.setItem('@first_login_after_logout', 'true');
    await AsyncStorage.removeItem('@user_info');
    await AsyncStorage.removeItem('@plantCode');
    await AsyncStorage.removeItem('@plantId');
    await AsyncStorage.removeItem('@get_session')
    dispatch(
      setAuth({
        status: STATE_STATUS.UNFETCHED,
        data: {},
      }),
    );
    navigation.navigate('LoginFirst');
  };
  const isCtaDisable = () => {
    return name.trim().length === 0;
  };
  const formatDate = dob => {
    const [day, month, year] = dob.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };
  const openWebview = url => {
    navigation.navigate('WebView', { URL: url });
  };
  const handleCloseModal = () => {
    setIsVisible(false);
  };
  const getSession = async () => {
    let jsonValue = await AsyncStorage.getItem('@user_info');
    jsonValue = jsonValue != null ? JSON.parse(jsonValue) : null;
    setAuth(jsonValue);
    // CallSession(jsonValue);
  };

  const getUserData = () => {
    let dataObj = {
      email: email,
      businessUnit: selectedProd,
    };
    const { data } = ScannerService.getSaltInfo(dataObj);
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_info');
      const profileUrl = await AsyncStorage.getItem('profileImage');
      if (jsonValue) {
        let info = JSON.parse(jsonValue);
        setProfileImage(info?.profileUrl);
        let url = JSON.parse(profileUrl);
        setUser(info);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const checkDetail = async () => {
    try {
      const info = JSON.parse(await AsyncStorage.getItem('@user_info'));
      if (
        info?.userEmail?.split('@')?.[1] == 'vedanta.co.in' ||
        info?.userEmail?.split('@')?.[1] == 'moglix.com'
      ) {
        setUserType(true);
      } else {
        setUserType(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const isOther = () => {
    return user?.businessUnit == 'Aluminium';
  };

  const openImagePicker = async () => {
    handleCloseModal();

    if (Platform.OS === 'ios') {
      const cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
      const photoStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

      if (
        cameraStatus !== RESULTS.GRANTED ||
        photoStatus !== RESULTS.GRANTED
      ) {
        console.log('iOS permissions not granted');
        return;
      }
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (granted === PermissionsAndroid.RESULTS.DENIED) {
        console.log('Storage permission denied');
        return;
      }
    }

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    try {
      const response = await launchImageLibrary(options);

      if (response.didCancel) {
        console.log('User cancelled gallery');
      } else if (response.errorCode) {
        console.log('Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const image = response.assets[0];
        await AsyncStorage.setItem('profileImage', JSON.stringify(image?.uri));
        setLoader(true);
        setProfileImage(image?.uri);

        const formData = new FormData();
        const realPath =
          Platform.OS === 'ios'
            ? image.uri.replace('file://', '')
            : image.uri;

        formData.append('files', {
          name: image.fileName,
          type: image.type,
          uri: realPath,
        });

        formData.append('folder', 'stg.moglix.com/rfx/123/345/attachments');

        await uploadImageWithRNFetchBlob(formData, realPath, image);
      }
    } catch (error) {
      console.error('Error in launchImageLibrary: ', error);
    }
  };

  const uploadImageWithRNFetchBlob = async (formData, realPath, image) => {
    const url = `${CONSTANTS.PROCUREMENT_BASE_URL}${CONSTANTS.API_URL.PROCUREMENT_UPLOAD}`;

    try {
      const requestArr = [
        {
          name: 'files',
          filename: image.fileName,
          type: image.type,
          data: RNFetchBlob.wrap(realPath),
        },
        {
          name: 'folder',
          data: 'stg.moglix.com/rfx/123/345/attachments',
        },
      ];
      console.log(requestArr, 'see array');
      const sessionData = await AsyncStorage.getItem('@get_session');
      const getPlantId = await AsyncStorage.getItem('@plantId');
      let jsonSessionData = JSON.parse(sessionData);
      let plantId = JSON.parse(getPlantId);
      console.log(
        'iduser:',
        jsonSessionData?.moglixB2BUserId,
        ' token: ',
        jsonSessionData?.moglixB2BToken,
        ' idbranch:',
        1,
        ' idcompany:',
        jsonSessionData?.companyId,
        ' application:',
        '1',
      );

      const response = await RNFetchBlob.fetch(
        'POST',
        url,
        {
          Accept: 'application/json, text/plain, */*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
          'Content-Type': 'multipart/form-data',
          'x-access-token': '0f35d83c-4535-468f-9baa-30be6677b7b7',
          'x-request-id': '1',

          iduser: jsonSessionData?.moglixB2BUserId,
          token: jsonSessionData?.moglixB2BToken,
          idbranch: plantId?.plantId,
          idcompany: jsonSessionData?.companyId,
          application: '1',
        },
        requestArr,
      );

      console.log('Response:', response.data);
      const parsedResponse = JSON.parse(response.data);
      console.log('Parsed response', parsedResponse);
      setProfileImage(parsedResponse[0].url);
      setSelectedImage(parsedResponse[0].url);
      handleUpdateUserDetails(parsedResponse[0].url);
      console.log('Image uploaded successfully:', parsedResponse[0].url);
      if (parsedResponse[0].status_code === 1) {
        console.log('Image uploaded successfully:', parsedResponse);
        // setProfileImage(parsedResponse[0].url);
      } else {
        console.log('Image upload failed:', parsedResponse);
      }
    } catch (error) {
      console.error('Upload error:', error);
      Toast.show({
        type: 'error',
        text2: 'Something went wrong!',
        visibilityTime: 4000,
        autoHide: true,
      });
    } finally {
      //   setIsUploading(false);
    }
  };

  const [firstName, lastName] = name.split(' ');
  console.log("profile image is", profileImage);

  const handleUpdateUserDetails = async image => {
    console.log("Hit update");

    try {
      setLoader(true);
      let formattedDob = '';
      if (dob && dob.toString().includes('/')) {
        formattedDob = formatDate(dob);
      } else if (dob) {
        formattedDob = convertEpochToDate(dob)
      }

      const sessionData = await AsyncStorage.getItem('@get_session');
      const getPlantId = await AsyncStorage.getItem('@plantId');
      let jsonSessionData = JSON.parse(sessionData);
      let plantId = JSON.parse(getPlantId);
      const imageUrl = profileImage ? profileImage.startsWith('https://')
        ? profileImage
        : `https://${profileImage}` : '';

      const updateRes = await ScannerService.updateDetails(
        {
          idUser: authData?.userId || authData?.idUser,
          firstName: firstName || '',
          lastName: lastName || '',
          profileUrl: imageUrl ? imageUrl : image ? image : ' ',
          dob: formattedDob,
          // functionalArea: functionalArea || '',
        },
        jsonSessionData,
      );
      console.log('updateres', updateRes);
      if (updateRes?.data?.successful) {
        let uObj = {
          id: updateRes?.data?.data?.user?.idUser,
          phoneNo: updateRes?.data?.data?.user?.phoneNo,
          name: `${updateRes?.data?.data?.user?.firstName} ${updateRes?.data?.data?.user?.lastName}`,
          email: updateRes?.data?.data?.user?.email,
          functionalArea: updateRes?.data?.data?.user?.functionalArea,
          city: updateRes?.data?.data?.user?.city,
          state: updateRes?.data?.data?.user?.state,
          dob: updateRes?.data?.data?.user?.dob,
          ...updateRes?.data?.data?.user,
        };

        console.log('uobjesct ', uObj);
        // setProfileImage(uObj?.profileUrl);

        await AsyncStorage.setItem(
          '@user_info',
          JSON.stringify({
            ...uObj,
            token: jsonSessionData?.moglixB2BToken,
          }),
        );
        dispatch(
          setAuth({
            status: STATE_STATUS.FETCHED,
            data: { ...uObj, token: jsonSessionData?.moglixB2BToken },
            isLoggedIn: true,
          }),
        );
        await AsyncStorage.setItem('profileImage', JSON.stringify(image));

        setLoader(false);
      }
    } catch (e) {
      setLoader(false);
    }
  };

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs camera access to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        return granted != 'denied';
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  const handleCameraLaunch = async () => {
    handleCloseModal();
    const profileUrl = await AsyncStorage.getItem('profileImage');

    if (profileUrl) {
      let url = JSON.parse(profileUrl);
      setProfileImage(url);
    }
    const isPermissionGranted = await requestCameraPermission();
    if (!isPermissionGranted) {
      console.log('Camera permission denied');
      return;
    }
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    try {
      const response = await launchCamera(options);
      console.log('camera response', response);

      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const image = response.assets[0];
        await AsyncStorage.setItem('profileImage', JSON.stringify(image?.uri));
        setLoader(true);
        setProfileImage(image?.uri);

        setSelectedImage(response.assets[0]);

        const formData = new FormData();
        const realPath =
          Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri;

        formData.append('files', {
          name: image.fileName,
          type: image.type,
          uri: realPath,
        });
        formData.append('folder', 'stg.moglix.com/rfx/123/345/attachments');
        await uploadImageWithRNFetchBlob(formData, realPath, image);
      }
    } catch (error) {
      console.log('Error in launchCamera: ', error);
    }
  };

  const getInitials = fullName => {
    const nameParts = fullName?.split(' ');
    const firstInitial = nameParts[0]
      ? nameParts[0].charAt(0).toUpperCase()
      : '';
    const lastInitial = nameParts[1]
      ? nameParts[1].charAt(0).toUpperCase()
      : '';
    return `${firstInitial}${lastInitial}`;
  };

  const initials = getInitials(authData?.name || authData?.userName);
  console.log(" authData?.profileUrl?.length", authData?.profileUrl?.length);

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
      {loader && <CustomLoader fullScreen />}
      <Header showBack showText={'My Profile'} navigation={navigation}></Header>
   <ScrollView
        style={{
          flex: 1,
          backgroundColor: '#F7F7F7',
        }}
        contentContainerStyle={
          {
            //  paddingBottom: Dimension.padding20,
          }
        }>

        <View
          style={{ alignSelf: 'center', paddingVertical: Dimension.padding20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.halfCircleContainer}>
              <View style={[styles.halfCircle, styles.blueHalf]}>
                {authData?.profileUrl && authData?.profileUrl?.length > 9 ? (
                  <Image
                    // source={{uri: `${profileImage}`}}
                    source={{
                      uri: profileImage?.startsWith('file:')
                        ? profileImage
                        : profileImage?.startsWith('https://')
                          ? profileImage
                          : `https://${profileImage}`,
                    }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.userName}>{initials}</Text>
                )}
              </View>
              <View style={[styles.halfCircle, styles.blackHalf]}>
                <TouchableOpacity
                  onPress={() => setIsVisible(true)}
                  style={styles.editContainer}>
                  <MaterialCommunityIcon
                    name={'pencil'}
                    color={'#fff'}
                    size={15}
                    style={{ alignSelf: 'center' }}
                  />
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <Modal
                  visible={isVisible}
                  animationType="slide"
                  transparent={true}
                  onRequestClose={() => setIsVisible(false)}>
                  <View style={styles.modalOverlay}>
                    <TouchableOpacity
                      onPress={handleCloseModal}
                      style={{
                        //bottom:-5,
                        // position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: [{ translateX: -20 }],
                        zIndex: 1,
                      }}>
                      <AntDesign
                        name="close"
                        size={35}
                        color="#fff"
                        style={{ position: 'absolute', top: -10, left: 0 }}
                      />
                      <AntDesign
                        name="closecircle"
                        size={35}
                        color="#000"
                        style={{ top: -10, left: 0 }}
                      />
                    </TouchableOpacity>
                    <View style={styles.modalContent}>

                      {/* <Text style={[styles.option, { fontSize: Dimension.font14, }]}> Change Photo</Text> */}

                      {/* <View style={styles.separator} /> */}
                      <TouchableOpacity onPress={handleCameraLaunch}>
                        <Text style={styles.option}>Camera</Text>
                      </TouchableOpacity>
                      <View style={styles.separator} />
                      <TouchableOpacity onPress={openImagePicker}>
                        <Text style={[styles.option,]}>Choose From Gallery</Text>
                      </TouchableOpacity>
                      <View style={styles.separator} />
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            padding: Dimension.padding15,
            height: '100%',
          }}>
          <View style={styles.inputView}>
            <FloatingLabelInputField
              placeholder={'Enter Name'}
              onChangeText={text => setName(text)}
              //value={name}
              value={name}
              textStyle={{
                fontSize: Dimension.font16,
                fontFamily: Dimension.CustomSemiBoldFont,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: '#363636',
              }}
            />
          </View>
          <Text
            style={{
              color: '#000000',
              fontSize: 12,
              marginBottom: Dimension.margin8,
              marginTop: Dimension.margin20,
            }}>
            Email
          </Text>
          <View style={styles.inputView}>
            <FloatingLabelInputField
              placeholder={'Enter Email Address'}
              value={email}
              editable={false}
              // value={email}
              onChangeText={text => setEmail(text)}
              textStyle={{
                fontSize: Dimension.font14,
                fontFamily: Dimension.CustomRegularFont,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: '#363636',
                backgroundColor: '#E5E5E5',
              }}
            />
          </View>

          <DatePickerInput
            placeholder={'DD/MM/YYYY'}
            formData={dob}
            // index={index}
            label={'DOB'}
            handleInputChange={date => setDob(date)}
            textStyle={{
              backgroundColor: '#fff',
              height: Dimension.height40,
              // paddingHorizontal: Dimension.padding10,
              borderColor: '#000',
            }}
            labelStyle={{
              color: '#000',
              fontSize: Dimension.font14,
              fontWeight: 'regular',
              fontFamily: Dimension.CustomMediumFont,
              paddingHorizontal: Dimension.padding0,
            }}
          />
          {/* <View style={styles.inputView}>
            <FloatingLabelInputField
              placeholder={'Enter DOB'}
              onChangeText={text => setDob(text)}
              // editable={false}
              // value={dob}
              value={dob}
              textStyle={{
                fontSize: Dimension.font14,
                fontFamily: Dimension.CustomRegularFont,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: '#363636',
                backgroundColor: '#E5E5E5',
              }}
            />
          </View> */}
          <Text
            style={{
              color: '#000000',
              fontSize: 12,
              marginBottom: Dimension.margin8,
              marginTop: Dimension.margin20,
            }}>
            Functional Area
          </Text>
          <View style={styles.inputView}>
            <FloatingLabelInputField
              placeholder={'Enter Functional Area'}
              onChangeText={text => setFunctionalArea(text)}
              editable={false}
              // value={functionalArea}
              value={functionalArea}
              textStyle={{
                fontSize: Dimension.font14,
                fontFamily: Dimension.CustomRegularFont,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: '#363636',
                backgroundColor: '#E5E5E5',
              }}
            />
          </View>
          <Text
            style={{
              color: '#000000',
              fontSize: 12,
              marginBottom: Dimension.margin8,
              marginTop: Dimension.margin20,
            }}>
            City
          </Text>
          <View style={styles.inputView}>
            <FloatingLabelInputField
              placeholder={'Enter City'}
              onChangeText={text => setCity(text)}
              // value={city}
              editable={false}
              value={city}
              textStyle={{
                fontSize: Dimension.font14,
                fontFamily: Dimension.CustomRegularFont,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: '#363636',
                backgroundColor: '#E5E5E5',
              }}
            />
          </View>
          <Text
            style={{
              color: '#000000',
              fontSize: 12,
              marginBottom: Dimension.margin8,
              marginTop: Dimension.margin20,
            }}>
            State
          </Text>
          <View style={styles.inputView}>
            <FloatingLabelInputField
              placeholder={'Enter State'}
              onChangeText={text => setState(text)}
              // value={state}
              editable={false}
              value={state}
              textStyle={{
                fontSize: Dimension.font14,
                fontFamily: Dimension.CustomRegularFont,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: '#363636',
                backgroundColor: '#E5E5E5',
              }}
            />
          </View>
          <Text
            style={{
              color: '#000000',
              fontSize: 12,
              marginBottom: Dimension.margin8,
              marginTop: Dimension.margin20,
            }}>
            Phone
          </Text>
          <View style={[styles.inputView, { marginBottom: 10 }]}>
            <FloatingLabelInputField
              placeholder={'Enter Phone Number'}
              onChangeText={text => setPhoneNUmber(text)}
              // value={phoneNumber}
              editable={false}
              value={phoneNumber}
              textStyle={{
                fontSize: Dimension.font14,
                fontFamily: Dimension.CustomRegularFont,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: '#363636',
                backgroundColor: '#E5E5E5',
              }}
            />
          </View>
          {/* <Text
            style={{
              color: '#000000',
              fontSize: 12,
              marginBottom: Dimension.margin8,
              marginTop: Dimension.margin20,
            }}>
            Additional Phone
          </Text> */}
          {/* <View style={styles.inputView}>
            <FloatingLabelInputField
              placeholder={'Enter Additional Phone Number'}
              onChangeText={text => setAdditionalPhoneNumber(text)}
              // value={phoneNumber}
              editable={false}
              value={additionalPhoneNo}
              textStyle={{
                fontSize: Dimension.font14,
                fontFamily: Dimension.CustomRegularFont,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: '#363636',
                backgroundColor: '#E5E5E5',
              }}
            />
          </View> */}
          <SaveButton
            title={'Save'}
            onSubmit={handleUpdateUserDetails}
            // loading={loader}
            disabled={isCtaDisable()}
            // fromEditProfile
            textStyle={{
              backgroundColor: isCtaDisable() ? '#C7C7C7' : '#0064A8',
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
