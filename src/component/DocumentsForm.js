import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Dimension from '../Theme/Dimension';
import Colors from '../Theme/Colors';
import CONSTANTS from '../services/constant';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FloatingLabelInputField from '../component/FloatingInput';
import { useDispatch, useSelector } from 'react-redux';
import Divder from '../component/Divider';
import { pick, keepLocalCopy } from '@react-native-documents/picker';
import RNFetchBlob from 'rn-fetch-blob';
import Scanner from './Scanner';
import { ScannerService } from '../services/scannerService';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkLocationAccuracy } from 'react-native-permissions';

const DocumentsForm = props => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth.data);
  // const docData = useSelector(state => state.)
  const isRfc = authData?.document?.rfc || false;
  const [loader, setLoader] = useState(false);
  // const [docLoader, setDocLoader] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [checkboxState, setCheckboxState] = useState(false);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [rfcCase, setRfcCase] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    pan: false,
    gst: false,
    companyRegistrationDoc: false,
    creditProfileOrFinancialStatement: false,
    cancelledCheque: false,
    tan: false,
  });
  const [docLoader, setDocLoader] = useState({});

  const rfcMain = authData?.rfcMain;

  useEffect(() => {
    if (authData?.document) {
      const extractedDocs = Object.entries(authData.document)
        .filter(
          ([key, value]) =>
            value &&
            key !== 'documentId' &&
            key !== 'companyId' &&
            key !== 'branchId' &&
            key !== 'updatedBy' &&
            key !== 'updatedOn' &&
            key !== 'rfc',
        )
        .map(([key, value]) => ({
          companyId: authData.document.companyId,
          branchId: authData.document.branchId ,
          fileName: key,
          url: value,
        }));
      const uploadedFilesData = extractedDocs.reduce((acc, doc) => {
        acc[doc.fileName] = true;
        return acc;
      }, {});

      setUploadedFiles(prevState => ({
        ...prevState,
        ...uploadedFilesData,
      }));
      console.log('extra doc here', extractedDocs);

      setDocuments(extractedDocs.length > 0 ? extractedDocs : []);
    }
  }, [authData]);

  const isCtaDisabled = () => {
    const mandatoryFieldsUploaded =
      uploadedFiles.pan && uploadedFiles.gst && uploadedFiles.cancelledCheque;
    // checkboxState;
    const extrasFields = Object.keys(uploadedFiles).filter(key =>
      key.startsWith('extras'),
    );
    const allExtrasUploaded = extrasFields.every(key => uploadedFiles[key]);
    const isTanRequired =
      authData?.businessUnit === 'Copper' ? uploadedFiles.tan : true;

    return mandatoryFieldsUploaded && allExtrasUploaded && isTanRequired;
  };

  const rfcList = authData?.rfcList || [];

  const flatArray = rfcList.map(item => item.id);

  console.log(flatArray);

  const isIdPresent = id => {
    return flatArray.includes(id);
  };

  const isAddCtaDisabled = () => {
    return (
      uploadedFiles.additionalFile0 &&
      uploadedFiles.additionalFile1 &&
      uploadedFiles.additionalFile2
    );
  };

  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@user_info', jsonValue);
    } catch (e) {
      console.log(e);
      // saving error
    }
  };

  const rfcSubmit = async id => {
    try {
      const data = await ScannerService.rfcSubmit(id);
      console.log('rfcSubmit', data);
    } catch (error) {
      console.log('error', error);
    }
  };

const pickDocument = async (fieldName) => {
  try {
    const [result] = await pick();

    if (!result) return;

    const realPath = await keepLocalCopy(result.uri);

    const fileSize = result.size; 
    const maxSize = 8 * 1024 * 1024; 

    if (fileSize > maxSize) {
      Toast.show({
        type: 'error',
        text2: 'File size is too large',
        visibilityTime: 4000,
        autoHide: true,
      });
      return;
    }

    await uploadImageWithRNFetchBlob(realPath, result, fieldName);
  } catch (err) {
    console.error(`Error while picking ${fieldName} document:`, err);
    throw err;
  }
};

  
  // const pickDocument = async fieldName => {
  //   try {
  //     const [result] = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //     });
  //     const realPath =
  //       Platform.OS === 'ios'
  //         ? result[0].uri.replace('file://', '')
  //         : result[0].uri;
  //     const fileSize = result[0].size;
  //     const maxSize = 8 * 1024 * 1024;
  //     if (fileSize > maxSize) {
  //       Toast.show({
  //         type: 'error',
  //         text2: 'File size is too large' || 'Error',
  //         visibilityTime: 4000,
  //         autoHide: true,
  //       });
  //       return;
  //     }

  //     await uploadImageWithRNFetchBlob(realPath, result[0], fieldName);
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       // console.log(`${fieldName} document selection cancelled`);
  //     } else {
  //       console.error(`Error while picking ${fieldName} document:`, err);
  //       throw err;
  //     }
  //   }
  // };

  const uploadImageWithRNFetchBlob = async (realPath, image, fieldName) => {
    setDocLoader(prev => ({ ...prev, [fieldName]: true }));
    const url = `${CONSTANTS.PROCUREMENT_BASE_URL}${CONSTANTS.API_URL.PROCUREMENT_UPLOAD}`;
    try {
      const requestArr = [
        {
          name: 'files',
          filename: image.name,
          type: image.type,
          data: RNFetchBlob.wrap(realPath),
        },
        {
          name: 'folder',
          data: 'stg.moglix.com/rfx/123/345/attachments',
        },
      ];

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

          idUser: '278',
          token: '0f35d83c-4535-468f-9baa-30be6677b7b7',
          idBranch: '1',
          idCompany: '1',
          application: '1',
        },
        requestArr,
      );
      const parsedResponse = JSON.parse(response.data);
      console.log('see this', parsedResponse);

      const newDocument = {
        companyId: authData.companyId,
        fileName: fieldName,
        branchId: authData.branchId,
        url: parsedResponse[0].url,
      };
      if (parsedResponse[0].status_code === 1) {
        setUploadedFiles(prevState => ({
          ...prevState,
          [fieldName]: true,
        }));
        setDocuments(prevDocuments =>
          prevDocuments
            .filter(doc => doc.fileName !== fieldName)
            .concat(newDocument),
        );

        setSelectedFile(parsedResponse[0].url);

        const formatFieldName = fieldName => {
          const specialFields = {
            pan: 'PAN',
            gst: 'GST',
            tan: 'TAN',
            extras0: 'Additional File',
            extras1: 'Additional File',
            extras2: 'Additional File',
          };

          return (
            specialFields[fieldName.toLowerCase()] ||
            fieldName
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())
              .trim()
          );
        };
        // Alert.alert(`${formatFieldName(fieldName)} has uploaded successfully`);

        Toast.show({
          type: 'success',
          text2: `${formatFieldName(fieldName)} has uploaded successfully`,
          visibilityTime: 4000,
          autoHide: true,
        });

        // const formatFieldName = fieldName => {
        //   return fieldName
        //     .replace(/([A-Z])/g, ' $1')
        //     .replace(/^./, str => str.toUpperCase())
        //     .trim();
        // };

        // // Alert.alert(`${formatFieldName(fieldName)} has uploaded successfully`);
        // Toast.show({
        //   type: 'success',
        //   text2: `${formatFieldName(fieldName)} has uploaded successfully`,
        //   visibilityTime: 4000,
        //   autoHide: true,
        // });

        setDocLoader(prev => ({ ...prev, [fieldName]: false }));
      } else {
        Toast.show({
          type: 'error',
          text2: 'Invalid or corrupted file. Please upload a valid file.',
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    } catch (error) {
      setDocLoader('');
      Toast.show({
        type: 'error',
        text2:
          parsedResponse[0].error_msg ||
          'Invalid or corrupted file. Please upload a valid file.',
        visibilityTime: 4000,
        autoHide: true,
      });
      console.error('Upload error:', error);
    } finally {
      setDocLoader(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSaveSubmit = async () => {
    try {
      if (!checkboxState) {
        Toast.show({
          type: 'error',
          text2: 'Please Provide Confirmation',
          visibilityTime: 4000,
          autoHide: true,
        });
      } else {
        props?.loader(true);
        // setLoader(true);
        const data = await ScannerService.uploadDocuments(
          documents,
          authData.businessUnit,
        );
        // console.log('doc data', data);
        if (data?.data?.successful) {
          if (rfcMain) {
            console.log('rfc submit call');

            rfcSubmit(authData?.companyId);
          }
          // storeData(data?.data);
          props?.loader(false);
          // setLoader(false);
          setModalVisible(true);
        }
      }
    } catch (e) {
      console.log(e);
      props?.loader(false)
      // setLoader(false);
    }
  };

  const handleAddMoreFiles = () => {
    const newIndex = additionalFiles.length;
    const newField = `extras${newIndex}`;
    setAdditionalFiles(prev => [...prev, newField]);
    setUploadedFiles(prevState => ({
      ...prevState,
      [newField]: false,
    }));
  };

  const handleRemoveFile = index => {
    const fieldName = `extras${index}`;
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
    setUploadedFiles(prevState => {
      const newState = { ...prevState };
      delete newState[fieldName];
      return newState;
    });
  };

  // console.log('addita', additionalFiles, 'uploaded', uploadedFiles);

  const closeModal = () => {
    setModalVisible(false);
    props?.navigation.replace('Login');
  };
  const clearDocument = fieldName => {
    setUploadedFiles(prevState => ({
      ...prevState,
      [fieldName]: false,
    }));

    setDocuments(prevDocuments =>
      prevDocuments.filter(doc => doc.fileName !== fieldName),
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ paddingBottom: 20 }}>
      <View
        style={{
          backgroundColor: '#fff',
          alignContent: 'center',
          borderRadius: 5,
          borderColor: '#EBEBEB',
          borderWidth: 1,
          paddingBottom: 30,
          paddingHorizontal: 15,
        }}>
        <Text
          style={{
            color: '#000000',
            fontSize: 14,
            fontWeight: '600',

            marginTop: Dimension.margin15,
          }}>
          Documents
        </Text>
        <Text
          style={{
            color: 'red',
            fontSize: 10,
            fontWeight: '600',
            marginBottom: Dimension.margin5,
          }}>
          It is mandatory that you upload all the required documents in the
          section.
        </Text>
        <View style={{ flexDirection: 'column' }}>
          <TouchableOpacity
            disabled={loader || !isCtaDisabled()}
            onPress={handleSaveSubmit}
            style={[
              styles.loginBtn,
              { backgroundColor: !isCtaDisabled() ? '#B0B0B0' : '#0063A7' },
            ]}>
            <View style={styles.row}>
              {loader ? (
                <ActivityIndicator color={'#fff'} size={'small'} />
              ) : null}
              <Text
                style={[
                  styles.loginText,
                  { color: !isCtaDisabled() ? '#000' : '#FFF' },
                ]}>
                Save & Submit
              </Text>
            </View>
          </TouchableOpacity>
          <Modal
            // animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcon
                    name={'check-circle'}
                    size={32}
                    color={'green'}
                  //style={{marginBottom:10}}
                  />
                  {isRfc ? (
                    <Text
                      style={[
                        styles.modalText,
                        { fontSize: 14, fontWeight: '600', marginLeft: 2 },
                      ]}>
                      Application resubmitted successfully
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.modalText,
                        { fontSize: 15, fontWeight: '600', marginLeft: 2 },
                      ]}>
                      Your Application is successfully submitted
                    </Text>
                  )}
                </View>
                {!isRfc ? (
                  <Text style={styles.modalText}>
                    Signup completed successfully. We’ll contact you at your
                    registered email,
                    <Text style={{ color: '#000', fontWeight: '700' }}>
                      {' '}
                      {authData?.userDetails?.email || authData?.email}
                    </Text>
                    , if more information is needed.
                    {/* While we process your application, Please Confirm your email
                  id by clicking a link sent to your registered email account */}
                    {/* <Text style={{color: '#000', fontWeight: '700'}}>
                    {' '}
                    {authData?.userDetails?.email}
                  </Text> */}
                  </Text>
                ) : (
                  ''
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  //    style={{
                  //  backgroundColor: '#FF5733',
                  //  padding: 10,
                  //  borderRadius: 5,
                  //  width: '40%',
                  // alignItems: 'center'
                  //    }}
                  onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <TouchableOpacity
            onPress={handleAddMoreFiles}
            disabled={!(additionalFiles.length < 3)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
            }}>
            <MaterialCommunityIcon name={'plus'} size={18} color={'#000'} />
            <Text style={styles.loginText}> Add More Files</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputView}>
          <FloatingLabelInputField
            // placeholder={'Enter Designation'}
            label={' PAN Card* '}
            //  onChangeText={val => setDesignation(val)}
            value={'PAN Card'}
            textStyle={{
              fontSize: Dimension.font14,
              fontFamily: Dimension.CustomRegularFont,
              borderWidth: 1,
              borderRightWidth: 0,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              backgroundColor: isRfc
                ? isIdPresent(11)
                  ? '#fff'
                  : '#EAEAEA'
                : uploadedFiles.pan
                  ? '#EAEAEA'
                  : '#fff',
            }}
            editable={false}
            buttonEnabled
            buttonComponent={
              isRfc ? (
                <TouchableOpacity
                  onPress={() => {
                    uploadedFiles.pan
                      ? clearDocument('pan')
                      : pickDocument('pan');
                    // () => pickPanCardDocument('panCard')
                  }}
                  disabled={!isIdPresent(11)}
                  style={{
                    backgroundColor: isRfc
                      ? isIdPresent(11)
                        ? '#fff'
                        : '#EAEAEA'
                      : uploadedFiles.pan
                        ? '#EAEAEA'
                        : '#fff',
                    padding: 10,
                    // paddingVertical: 8,
                    borderRadius: 5,
                    // backgroundColor: 'pink',
                  }}>
                  {docLoader['pan'] ? (
                    <ActivityIndicator
                      style={styles.loader}
                      color={'#000'}
                      size={15}
                    />
                  ) : (
                    <MaterialCommunityIcon
                      name={
                        isRfc
                          ? isIdPresent(11)
                            ? uploadedFiles.pan
                              ? 'close'
                              : 'file-upload-outline'
                            : !uploadedFiles.pan
                              ? 'file-upload-outline'
                              : 'close'
                          : uploadedFiles.pan
                            ? 'close'
                            : 'file-upload-outline'
                      }
                      size={16}
                      color={
                        isRfc
                          ? isIdPresent(11)
                            ? uploadedFiles.pan
                              ? '#000'
                              : '#0466A9'
                            : !uploadedFiles.pan
                              ? '#0466A9'
                              : '#EAEAEA'
                          : uploadedFiles.pan
                            ? '#000'
                            : '#0466A9'
                      }
                    />
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    uploadedFiles.pan
                      ? clearDocument('pan')
                      : pickDocument('pan');
                    // () => pickPanCardDocument('panCard')
                  }}
                  style={{
                    backgroundColor: uploadedFiles.pan ? '#EAEAEA' : '#fff',
                    padding: 10,
                    borderRadius: 5,
                  }}>
                  {docLoader['pan'] ? (
                    <ActivityIndicator
                      style={styles.loader}
                      color={'#000'}
                      size={15}
                    />
                  ) : (
                    <MaterialCommunityIcon
                      name={uploadedFiles.pan ? 'close' : 'file-upload-outline'}
                      size={16}
                      color={uploadedFiles.pan ? '#000' : '#0466A9'}
                    />
                  )}
                </TouchableOpacity>
              )
            }
          />
        </View>
        <View style={styles.inputView}>
          <FloatingLabelInputField
            label={' GST Certificate* '}
            value={'GST Certificate'}
            textStyle={{
              fontSize: Dimension.font14,
              fontFamily: Dimension.CustomRegularFont,
              borderWidth: 1,
              borderRightWidth: 0,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              backgroundColor: isRfc
                ? isIdPresent(12)
                  ? '#fff'
                  : '#EAEAEA'
                : uploadedFiles.gst
                  ? '#EAEAEA'
                  : '#fff',
            }}
            editable={false}
            buttonEnabled
            buttonComponent={
              isRfc ? (
                <TouchableOpacity
                  onPress={() =>
                    uploadedFiles.gst
                      ? clearDocument('gst')
                      : pickDocument('gst')
                  }
                  disabled={!isIdPresent(12)}
                  style={{
                    backgroundColor: isRfc
                      ? isIdPresent(12)
                        ? '#fff'
                        : '#EAEAEA'
                      : uploadedFiles.gst
                        ? '#EAEAEA'
                        : '#fff',
                    padding: 10,
                    borderRadius: 5,
                  }}>
                  {docLoader['gst'] ? (
                    <ActivityIndicator
                      style={styles.loader}
                      color={'#000'}
                      size={15}
                    />
                  ) : (
                    <MaterialCommunityIcon
                      name={
                        isRfc
                          ? isIdPresent(12)
                            ? uploadedFiles.gst
                              ? 'close'
                              : 'file-upload-outline'
                            : !uploadedFiles.gst
                              ? 'file-upload-outline'
                              : 'close'
                          : uploadedFiles.gst
                            ? 'close'
                            : 'file-upload-outline'
                      }
                      size={16}
                      color={
                        isRfc
                          ? isIdPresent(12)
                            ? !uploadedFiles.gst
                              ? '#0466A9'
                              : '#000'
                            : !uploadedFiles.gst
                              ? '#0466A9'
                              : '#EAEAEA'
                          : !uploadedFiles.gst
                            ? '#0466A9'
                            : '#000'
                      }
                    />
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    uploadedFiles.gst
                      ? clearDocument('gst')
                      : pickDocument('gst')
                  }
                  style={{
                    backgroundColor: uploadedFiles.gst ? '#EAEAEA' : '#fff',
                    padding: 10,

                    borderRadius: 5,
                  }}>
                  {docLoader['gst'] ? (
                    <ActivityIndicator
                      style={styles.loader}
                      color={'#000'}
                      size={15}
                    />
                  ) : (
                    <MaterialCommunityIcon
                      name={uploadedFiles.gst ? 'close' : 'file-upload-outline'}
                      size={16}
                      color={uploadedFiles.gst ? '#000' : '#0466A9'}
                    />
                  )}
                </TouchableOpacity>
              )
            }
          />
        </View>

        <View style={styles.inputView}>
          <FloatingLabelInputField
            // placeholder={'Enter Designation'}
            label={' Company registration Certificate '}
            onChangeText={val => setAddressLine1(val)}
            value={'Company registration Certificate'}
            textStyle={{
              fontSize: Dimension.font14,
              fontFamily: Dimension.CustomRegularFont,
              borderWidth: 1,
              borderRightWidth: 0,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              backgroundColor: isRfc
                ? isIdPresent(13)
                  ? '#fff'
                  : '#EAEAEA'
                : uploadedFiles.companyRegistrationDoc
                  ? '#EAEAEA'
                  : '#fff',
            }}
            editable={false}
            buttonEnabled
            buttonComponent={
              isRfc ? (
                <TouchableOpacity
                  onPress={() =>
                    uploadedFiles.companyRegistrationDoc
                      ? clearDocument('companyRegistrationDoc')
                      : pickDocument('companyRegistrationDoc')
                  }
                  disabled={!isIdPresent(13)}
                  style={{
                    backgroundColor: isRfc
                      ? isIdPresent(13)
                        ? '#fff'
                        : '#EAEAEA'
                      : uploadedFiles.companyRegistrationDoc
                        ? '#EAEAEA'
                        : '#fff',
                    padding: 10,
                    borderRadius: 5,
                  }}>
                  {docLoader['companyRegistrationDoc'] ? (
                    <ActivityIndicator
                      style={styles.loader}
                      color={'#000'}
                      size={15}
                    />
                  ) : (
                    <MaterialCommunityIcon
                      name={
                        isRfc
                          ? isIdPresent(13)
                            ? uploadedFiles.companyRegistrationDoc
                              ? 'close'
                              : 'file-upload-outline'
                            : !uploadedFiles.companyRegistrationDoc
                              ? 'file-upload-outline'
                              : 'close'
                          : uploadedFiles.companyRegistrationDoc
                            ? 'close'
                            : 'file-upload-outline'
                      }
                      size={16}
                      color={
                        isRfc
                          ? isIdPresent(13)
                            ? !uploadedFiles.companyRegistrationDoc
                              ? '#0466A9'
                              : '#000'
                            : !uploadedFiles.companyRegistrationDoc
                              ? '#0466A9'
                              : '#EAEAEA'
                          : !uploadedFiles.companyRegistrationDoc
                            ? '#0466A9'
                            : '#000'
                      }
                    />
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    uploadedFiles.companyRegistrationDoc
                      ? clearDocument('companyRegistrationDoc')
                      : pickDocument('companyRegistrationDoc')
                  }
                  style={{
                    backgroundColor: uploadedFiles.companyRegistrationDoc
                      ? '#EAEAEA'
                      : '#fff',
                    padding: 10,
                    borderRadius: 5,
                  }}>
                  {docLoader['companyRegistrationDoc'] ? (
                    <ActivityIndicator
                      style={styles.loader}
                      color={'#000'}
                      size={15}
                    />
                  ) : (
                    <MaterialCommunityIcon
                      name={
                        uploadedFiles.companyRegistrationDoc
                          ? 'close'
                          : 'file-upload-outline'
                      }
                      size={16}
                      color={
                        uploadedFiles.companyRegistrationDoc
                          ? '#000'
                          : '#0466A9'
                      }
                    />
                  )}
                </TouchableOpacity>
              )
            }
          />
        </View>

        <View style={styles.inputView}>
          <FloatingLabelInputField
            // placeholder={'Enter Designation'}
            label={
              ' Credit Profile(Balance Sheet 3 Years)/ Financial Statement '
            }
            onChangeText={val => setAddressLine2(val)}
            value={'Credit Profile/ Financial Statement'}
            numberOfLines={2}
            textStyle={{
              fontSize: Dimension.font14,
              fontFamily: Dimension.CustomRegularFont,
              borderWidth: 1,
              borderRightWidth: 0,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              backgroundColor: isRfc
                ? isIdPresent(14)
                  ? '#fff'
                  : '#EAEAEA'
                : uploadedFiles.creditProfileOrFinancialStatement
                  ? '#EAEAEA'
                  : '#fff',
            }}
            editable={false}
            buttonEnabled
            buttonComponent={
              isRfc ? (
                <TouchableOpacity
                  onPress={() => {
                    uploadedFiles.creditProfileOrFinancialStatement
                      ? clearDocument('creditProfileOrFinancialStatement')
                      : pickDocument('creditProfileOrFinancialStatement');
                  }}
                  disabled={!isIdPresent(14)}
                  style={{
                    backgroundColor: isRfc
                      ? isIdPresent(14)
                        ? '#fff'
                        : '#EAEAEA'
                      : uploadedFiles.creditProfileOrFinancialStatement
                        ? '#EAEAEA'
                        : '#fff',
                    padding: 10,
                    borderRadius: 5,
                  }}>
                  {docLoader['creditProfileOrFinancialStatement'] ? (
                    <ActivityIndicator
                      style={styles.loader}
                      color={'#000'}
                      size={15}
                    />
                  ) : (
                    <MaterialCommunityIcon
                      name={
                        isRfc
                          ? isIdPresent(14)
                            ? uploadedFiles.creditProfileOrFinancialStatement
                              ? 'close'
                              : 'file-upload-outline'
                            : !uploadedFiles.creditProfileOrFinancialStatement
                              ? 'file-upload-outline'
                              : 'close'
                          : uploadedFiles.creditProfileOrFinancialStatement
                            ? 'close'
                            : 'file-upload-outline'
                      }
                      size={16}
                      // style={{backgroundColor: 'pink'}}
                      color={
                        isRfc
                          ? isIdPresent(14)
                            ? !uploadedFiles.creditProfileOrFinancialStatement
                              ? '#0466A9'
                              : '#000'
                            : !uploadedFiles.creditProfileOrFinancialStatement
                              ? '#0466A9'
                              : '#EAEAEA'
                          : !uploadedFiles.creditProfileOrFinancialStatement
                            ? '#0466A9'
                            : '#000'
                      }
                    // <MaterialCommunityIcon
                    //   name={
                    //     isRfc
                    //       ? !uploadedFiles.creditProfileOrFinancialStatement ||
                    //         isIdPresent(14)
                    //         ? 'file-upload-outline'
                    //         : null
                    //       : uploadedFiles.creditProfileOrFinancialStatement
                    //       ? 'close'
                    //       : 'file-upload-outline'
                    //   }
                    //   size={16}
                    //   color={
                    //     uploadedFiles.creditProfileOrFinancialStatement
                    //       ? '#000'
                    //       : '#0466A9'
                    //   }
                    />
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    uploadedFiles.creditProfileOrFinancialStatement
                      ? clearDocument('creditProfileOrFinancialStatement')
                      : pickDocument('creditProfileOrFinancialStatement');
                  }}
                  style={{
                    backgroundColor:
                      uploadedFiles.creditProfileOrFinancialStatement
                        ? '#EAEAEA'
                        : '#fff',
                    padding: 10,
                    borderRadius: 5,
                  }}>
                  {docLoader['creditProfileOrFinancialStatement'] ? (
                    <ActivityIndicator
                      style={styles.loader}
                      color={'#000'}
                      size={15}
                    />
                  ) : (
                    <MaterialCommunityIcon
                      name={
                        uploadedFiles.creditProfileOrFinancialStatement
                          ? 'close'
                          : 'file-upload-outline'
                      }
                      size={16}
                      color={
                        uploadedFiles.creditProfileOrFinancialStatement
                          ? '#000'
                          : '#0466A9'
                      }
                    />
                  )}
                </TouchableOpacity>
              )
            }
          //maxLength={10}
          //keyboardType=""
          />
        </View>

        <View style={styles.inputView}>
          <FloatingLabelInputField
            // placeholder={'Enter Password'}
            label={' Cancelled Cheque* '}
            value={'Cancelled Cheque'}
            textStyle={{
              fontSize: Dimension.font14,
              fontFamily: Dimension.CustomRegularFont,
              borderWidth: 1,
              borderRightWidth: 0,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              backgroundColor: isRfc
                ? isIdPresent(15)
                  ? '#fff'
                  : '#EAEAEA'
                : uploadedFiles.cancelledCheque
                  ? '#EAEAEA'
                  : '#fff',
            }}
            editable={false}
            buttonEnabled
            buttonComponent={
              isRfc ? (
                <TouchableOpacity
                  onPress={() => {
                    uploadedFiles.cancelledCheque
                      ? clearDocument('cancelledCheque')
                      : pickDocument('cancelledCheque');
                  }}
                  disabled={!isIdPresent(15)}
                  style={{
                    backgroundColor: isRfc
                      ? isIdPresent(15)
                        ? '#fff'
                        : '#EAEAEA'
                      : uploadedFiles.cancelledCheque
                        ? '#EAEAEA'
                        : '#fff',
                    padding: 10,
                    borderRadius: 5,
                  }}>
                  {docLoader['cancelledCheque'] ? (
                    <ActivityIndicator
                      style={styles.loader}
                      color={'#000'}
                      size={15}
                    />
                  ) : (
                    <MaterialCommunityIcon
                      name={
                        isRfc
                          ? isIdPresent(15)
                            ? uploadedFiles.cancelledCheque
                              ? 'close'
                              : 'file-upload-outline'
                            : !uploadedFiles.cancelledCheque
                              ? 'file-upload-outline'
                              : 'close'
                          : uploadedFiles.cancelledCheque
                            ? 'close'
                            : 'file-upload-outline'
                      }
                      size={16}
                      color={
                        isRfc
                          ? isIdPresent(15)
                            ? !uploadedFiles.cancelledCheque
                              ? '#0466A9'
                              : '#000'
                            : !uploadedFiles.cancelledCheque
                              ? '#0466A9'
                              : '#EAEAEA'
                          : !uploadedFiles.cancelledCheque
                            ? '#0466A9'
                            : '#000'
                      }
                    />
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    uploadedFiles.cancelledCheque
                      ? clearDocument('cancelledCheque')
                      : pickDocument('cancelledCheque');
                  }}
                  style={{
                    backgroundColor: uploadedFiles.cancelledCheque
                      ? '#EAEAEA'
                      : '#fff',
                    padding: 10,
                    borderRadius: 5,
                  }}>
                  {docLoader['cancelledCheque'] ? (
                    <ActivityIndicator
                      style={styles.loader}
                      color={'#000'}
                      size={15}
                    />
                  ) : (
                    <MaterialCommunityIcon
                      name={
                        uploadedFiles.cancelledCheque
                          ? 'close'
                          : 'file-upload-outline'
                      }
                      size={16}
                      color={uploadedFiles.cancelledCheque ? '#000' : '#0466A9'}
                    />
                  )}
                </TouchableOpacity>
              )
            }
          />
        </View>
        {authData?.businessUnit === 'Copper' ? (
          <View style={styles.inputView}>
            <FloatingLabelInputField
              // placeholder={'Enter Password'}
              label={' TAN Certificate* '}
              value={'TAN Certificate'}
              textStyle={{
                fontSize: Dimension.font14,
                fontFamily: Dimension.CustomRegularFont,
                borderWidth: 1,
                borderRightWidth: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                backgroundColor: isRfc
                  ? isIdPresent(24)
                    ? '#fff'
                    : '#EAEAEA'
                  : uploadedFiles.tan
                    ? '#EAEAEA'
                    : '#fff',
              }}
              editable={false}
              buttonEnabled
              buttonComponent={
                isRfc ? (
                  <TouchableOpacity
                    onPress={() => {
                      uploadedFiles.tan
                        ? clearDocument('tan')
                        : pickDocument('tan');
                    }}
                    disabled={!isIdPresent(24)}
                    style={{
                      backgroundColor: isRfc
                        ? isIdPresent(24)
                          ? '#fff'
                          : '#EAEAEA'
                        : uploadedFiles.tan
                          ? '#EAEAEA'
                          : '#fff',
                      padding: 10,
                      borderRadius: 5,
                    }}>
                    {docLoader['tan'] ? (
                      <ActivityIndicator
                        style={styles.loader}
                        color={'#000'}
                        size={15}
                      />
                    ) : (
                      <MaterialCommunityIcon
                        name={
                          isRfc
                            ? isIdPresent(24)
                              ? uploadedFiles.tan
                                ? 'close'
                                : 'file-upload-outline'
                              : !uploadedFiles.tan
                                ? 'file-upload-outline'
                                : 'close'
                            : uploadedFiles.tan
                              ? 'close'
                              : 'file-upload-outline'
                        }
                        size={16}
                        color={
                          isRfc
                            ? isIdPresent(24)
                              ? !uploadedFiles.tan
                                ? '#0466A9'
                                : '#000'
                              : !uploadedFiles.tan
                                ? '#0466A9'
                                : '#EAEAEA'
                            : !uploadedFiles.tan
                              ? '#0466A9'
                              : '#000'
                        }
                      />
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      uploadedFiles.tan
                        ? clearDocument('tan')
                        : pickDocument('tan');
                    }}
                    style={{
                      backgroundColor: uploadedFiles.tan ? '#EAEAEA' : '#fff',
                      padding: 10,
                      borderRadius: 5,
                    }}>
                    {docLoader['tan'] ? (
                      <ActivityIndicator
                        style={styles.loader}
                        color={'#000'}
                        size={15}
                      />
                    ) : (
                      <MaterialCommunityIcon
                        name={
                          uploadedFiles.tan ? 'close' : 'file-upload-outline'
                        }
                        size={16}
                        color={uploadedFiles.tan ? '#000' : '#0466A9'}
                      />
                    )}
                  </TouchableOpacity>
                )
              }
            />
          </View>
        ) : null}
        {additionalFiles.map((_, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={[styles.inputView]}>
              <FloatingLabelInputField
                label={'Additional File'}
                onChangeText={val => setPwd(val)}
                value={'Additional File'}
                textStyle={{
                  fontSize: Dimension.font14,
                  fontFamily: Dimension.CustomRegularFont,
                  borderWidth: 1,
                  borderRightWidth: 0,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  backgroundColor: uploadedFiles[`extras${index}`]
                    ? '#EAEAEA'
                    : '#fff',
                }}
                editable={false}
                buttonEnabled
                buttonComponent={
                  <TouchableOpacity
                    onPress={() =>
                      uploadedFiles[`extras${index}`]
                        ? clearDocument(`extras${index}`)
                        : pickDocument(`extras${index}`)
                    }
                    style={{
                      backgroundColor: uploadedFiles[`extras${index}`]
                        ? '#EAEAEA'
                        : '#fff',
                      padding: 10,
                      borderRadius: 5,
                    }}>
                    {docLoader[`extras${index}`] ? (
                      <ActivityIndicator
                        style={styles.loader}
                        color={'#000'}
                        size={15}
                      />
                    ) : (
                      <MaterialCommunityIcon
                        name={
                          uploadedFiles[`extras${index}`]
                            ? 'close'
                            : 'file-upload-outline'
                        }
                        size={16}
                        color={
                          uploadedFiles[`extras${index}`] ? '#000' : '#0466A9'
                        }
                      />
                    )}
                  </TouchableOpacity>
                }
              />
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveFile(index)}
              style={{ marginTop: Dimension.margin15 }}>
              <MaterialCommunityIcon name={'close'} size={16} color={'#000'} />
            </TouchableOpacity>
          </View>
        ))}

        <View
          style={{
            borderRadius: 8,
            backgroundColor: '#ffea99',
            padding: 8,
            marginTop: 10,
          }}>
          <Text>
            <Text style={{ color: '#000', fontWeight: '600', fontSize: 11 }}>
              {' '}
              Note:{' '}
            </Text>{' '}
            <Text style={{ color: '#000', fontSize: 11 }}>
              {' '}
              Each Document file size should not exceed 8 MB{' '}
              <Text style={{ color: '#000', fontWeight: '600' }}>&</Text> the
              acceptable file formats are .doc, .docx, .txt, .xslx, .csv, .jpg,
              .jpeg, .png, .pdf{' '}
            </Text>
          </Text>
        </View>
        <View style={styles.forgotPassWrap}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcon
              onPress={() => setCheckboxState(!checkboxState)}
              name={
                checkboxState ? 'checkbox-marked' : 'checkbox-blank-outline'
              }
              size={18}
              color={'#000'}
            />
            <Text style={styles.Checkboxlabel}>
              I hereby confirm that all the above information provided is true
              and I am the authorised person to submit this information.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: '#0262a8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: Dimension.padding20,
    height: Dimension.height45,
  },
  btnContainer: {
    backgroundColor: '#0262a8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    height: Dimension.height45,
    marginTop: Dimension.margin100,
  },

  container: {
    padding: Dimension.padding20,
    position: 'relative',
    flex: 1,
    paddingTop: Dimension.padding50,
    backgroundColor: '#F7F7F7',
  },
  exploreBtn: {
    //backgroundColor: '#0262a8',
    paddingVertical: Dimension.padding12,

    marginVertical: Dimension.margin10,
    marginBottom: Dimension.margin40,
  },
  pickerContainer: {
    //position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  pickerStyle: {
    color: Colors.FontColor,
    //color : "#0064A8",
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font14,
    marginLeft: 8,
    marginVertical: Dimension.margin11,
  },
  exloreTxt: {
    alignSelf: 'center',
    color: '#0064A8',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  LoginBg: {
    width: '100%',
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleWrap: {
    // margin: Dimension.margin49,
  },
  title: {
    alignSelf: 'center',
    fontFamily: Dimension.CustomBoldFont,
    fontSize: Dimension.font24,
    color: Colors.FontColor1,
  },
  title2: {
    alignSelf: 'center',
    fontFamily: Dimension.CustomBoldFont,
    fontSize: Dimension.font20,
    marginTop: 3,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#0064A8',
    borderRadius: 4,
    padding: 1,
    marginTop: Dimension.margin50,
    marginBottom: Dimension.margin40,
    width: Dimension.width210,
    height: Dimension.height50,
    backgroundColor: '#fff',
  },
  // pickerWrap: {
  //   borderWidth: 1,
  //   borderColor: '#363636',
  //   width: '100%',
  //   // height: 45,
  //   borderRadius: 4,
  // padding: 1,
  // marginBottom: Dimension.margin20,
  // },
  pickerWrapBtn: {
    height: Dimension.height40,
    paddingLeft: Dimension.padding8,
    alignItems: 'flex-start',
    paddingVertical: Dimension.padding13,
    position: 'relative',
  },
  PickerTxt: {
    color: '#0064A8',
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font12,
    marginTop: Dimension.margin5,
  },
  inputView: {
    width: '100%',
    // marginBottom: Dimension.margin20,
    marginBottom: Dimension.margin8,
    marginTop: Dimension.margin20,
    //    paddingVertical: 10
  },
  forgotPassWrap: {
    marginTop: Dimension.margin30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forgotpassTxt: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomRegularFont,
    color: '#278BED',
    marginTop: Dimension.margin15,
    //marginBottom: 50
  },
  Checkboxlabel: {
    fontSize: Dimension.font13,
    fontFamily: Dimension.CustomRegularFont,
    color: '#000000',
    marginLeft: Dimension.margin5,
    alignSelf: 'center',
    // marginTop: 1,
  },
  forgotAndSignUpText: {
    color: 'white',
    fontSize: Dimension.font11,
  },
  BottomTxtWrap: {
    position: 'absolute',
    bottom: 10,
    justifyContent: 'center',
    flex: 1,
    alignSelf: 'center',
  },
  BottomTxt: {
    color: Colors.FontColor1,
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font10,
  },
  loginBtn: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    paddingVertical: Dimension.padding13,
    paddingHorizontal: Dimension.padding20,
    marginVertical: Dimension.margin10,
    alignItems: 'center',
    alignSelf: 'flex-start',
    elevation: 5,
    shadowColor: '#00000029',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderColor: '#cbcbcb',
    borderWidth: 1,
  },

  signupBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0064A8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Dimension.padding15,
    marginBottom: Dimension.margin20,
    elevation: 5,
    shadowColor: '#00000029',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  signupText: {
    color: '#0064A8',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  descriptionText: {
    fontSize: Dimension.font15,
    color: '#000000',
    alignSelf: 'center',
    marginTop: Dimension.margin15,
    // marginBottom: 30
  },
  accountText: {
    fontSize: Dimension.font14,
    color: '#000000',
    marginBottom: Dimension.margin42,
  },
  loginText: {
    color: '#000',
    fontSize: Dimension.font16,
    fontWeight: '500',
    // fontFamily: Dimension.CustomBoldFont,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Dimension.padding20,
    textAlign: 'center',
  },
  option: {
    fontSize: Dimension.font14,
    color: '#363636',
    fontWeight: 'bold',
    marginVertical: 0,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: Dimension.font14,
    color: '#363636',
    fontWeight: 'bold',
    marginTop: Dimension.margin20,
    marginBottom: Dimension.margin10,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#EFEFEF',
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: Dimension.padding20,
    paddingBottom: Dimension.padding20,
    paddingTop: Dimension.padding20,
    // alignItems: 'center',
  },
  modalText: {
    fontSize: Dimension.font14,
    color: '#000',
    marginBottom: Dimension.margin20,
  },
  closeButton: {
    backgroundColor: '#0466A9',
    padding: Dimension.padding10,
    borderRadius: 5,
    width: '40%',
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: Dimension.font13,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
export default DocumentsForm;
