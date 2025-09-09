import React, { useRef, useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Modal,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Dimensions
} from 'react-native';
import { ScannerService } from '../../services/scannerService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dimension from '../../Theme/Dimension';
import Colors from '../../Theme/Colors';
import styles from './style';
import Header from '../../component/Header';
import CONSTANTS from '../../services/constant';
import CustomeIcon from '../../component/CustomeIcon';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import CustomLoader from '../../component/customLoader';
import HeaderTab from '../../component/HeaderTabs';
import { handleDownload } from '../../utils/generatePdfFile';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { getByCompanyRequest } from '../../redux/feature/customerRegSlice';
import { STATE_STATUS } from '../../redux/constants';
import NextButton from '../../component/Button';
import { showMessage } from '../../utils/BiometricAuth';
import Select from '../../component/Select';
import { updateCustomerUser } from '../../services/customerRegistration';
import Toast from 'react-native-toast-message';
import { setUser } from '../../redux/feature/userSlice';
import { flush } from 'redux-saga/effects';
import AesUtil from '../../generic/index';
import CryptoJS from 'crypto-js';
const usersScreen = props => {
    const dispatch = useDispatch();
    const authData = useSelector(state => state.auth);
     const branchAccessData = useSelector(state => state.branchAccess?.data?.branchModules);
    const getByCompanyData = useSelector(state => state?.customerRegistration?.getByCompany);
    const getAllByCompanyData = useSelector(state => state?.customerRegistration?.getAllByCompany);
    const userGetData = useSelector(state => state?.customerRegistration?.userGet?.data)
    const customerRegistrationListing = useSelector(
            state => state.customerRegistration?.customerListing,
        );
    const { data, status, isCustomer } = useSelector(state => state.branchAccess);
    const [refreshing, setRefreshing] = useState(false);
    const [userModal, setUserModal] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [changepasswordfields, setChangePasswordFields] = useState(false);
    const [email, setEmail] = useState('');
    // const [firstName, setFirstName] = useState(getByCompanyData?.data?.firstName || '');
    // const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [plantIds, setPlantIds] = useState()
    const [plants, setPlants] = useState([]);
    const [selectedPlant, setSelectedPlants] = useState();
    // const [plants, setPlants] = useState(() => { branchData.filter(branch => plantIds.includes(branch.id)): [] });
    const [loader, setLoader] = useState(false)
    const [isCompanyApproved, setGstinExist] = useState(false);
    const [branchData, setBranchData] = useState();
    const isRMUser = branchAccessData?.roleNames.includes('Regional Manager') ? true : false;
    const isPMUser = branchAccessData?.roleNames.includes('Product Manager') ? true : false;
    
    useEffect(() => {
        isGstinExist(); 
        handlePlantsList();
    }, [])

    const modalOpen = (id, mailId, plantIds, firstName, lastName, phone) => {
        const selectedPlants = branchData?.filter(branch => plantIds?.includes(branch.id));
        setSelectedPlants(selectedPlants);
        console.log("selectedPlants", selectedPlants?.map(item => item.value));
        setFirstName(firstName)
        setLastName(lastName)
        setPhone(phone)
        setPlants(selectedPlants?.map(item => item.value));
        setSelectedUser({ id, mailId });
        setEmail(mailId)
        setPlantIds(plantIds);
        setUserModal(!userModal);
    };

   
    
    const isSubmitDisabled = () => {
        const isPlantsInvalid = !plants || plants.length === 0;
        const isFirstNameInvalid = !firstName || firstName.length > 50 || !/^[a-zA-Z ]+$/.test(firstName);
        const isLastNameInvalid = lastName?.length > 50 || (lastName && !/^[a-zA-Z ]*$/.test(lastName));
        const isPhoneInvalid = phone?.length < 10 || phone?.length > 10 || !/^[0-9]{10}$/.test(phone);
        console.log(isFirstNameInvalid || isLastNameInvalid || isPhoneInvalid);
         return  isPlantsInvalid || isFirstNameInvalid || isLastNameInvalid || isPhoneInvalid;
    }

      const isGstinExist = async () => {
        try {
          const data = await ScannerService.isGstinExist(
            getAllByCompanyData?.data?.branchList?.[0]?.branchLang?.gstn,
            //   gstin.toUpperCase(),
            authData?.data?.businessUnit,
          );
          console.log('duyj', data);
          setGstinExist(data?.data?.successful);
        } catch (error) {
          console.log('error', error);
        }
      };
    
    const handlePlantsList = () => {
    console.log("hit plantList");
    const plantList = getAllByCompanyData?.data?.branchList || [];
    const plantIds = getByCompanyData?.data?.users?.[0]?.plantIds || [];
    const branchDatas = plantList.map((plant) => ({
        value: plant.branchLang.displayName,
        label: plant.branchLang.displayName,
        id: plant.idBranch
    }));
    setBranchData(branchDatas);
};

    const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  const Base64 = {
    btoa: input => {
      let str = input;
      let output = '';

      for (
        let block = 0, charCode, i = 0, map = chars;
        str.charAt(i | 0) || ((map = '='), i % 1);
        output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
      ) {
        charCode = str.charCodeAt((i += 3 / 4));

        if (charCode > 0xff) {
          throw new Error(
            "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
          );
        }
        block = (block << 8) | charCode;
      }
      return output;
    },
  };
    
   const generateRandomPassword = async (length) => {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset[randomIndex];
        }
       console.log("password", password);
       
        return password;
   }
    
    const getData2 = (salt, iv, pwd) => {
        let aesUtil = new AesUtil(128, 1000);
        let newciphertext = aesUtil.encrypt(
          salt, //salt
          iv, //iv
          '1234567891234567', //key
          pwd, //text
        );
        let decryptedText = aesUtil.decrypt(
          salt,
          iv,
          '1234567891234567',
          newciphertext,
        );
    
        let txt = iv + '::' + salt + '::' + newciphertext;
        onPressRandomPassword(iv, salt, Base64.btoa(txt));
    };
    
    const onPressRandomPassword = async (iv, salt, aesPassword) => {
        try {
            const dataObj = {
                idUser: selectedUser?.id,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                businessUnit: authData?.data?.businessUnit,
                employeeId: '',
                designation: '',
                subUserIdCompany: getByCompanyData?.subUserIdCompany,
                plantIds: plantIds,
                test_on: iv,
                data_on: salt,
                randomPassword: aesPassword,
            }
            setLoader(true);
            setUserModal(false);
            const data = await updateCustomerUser(dataObj);
            console.log("data is updateCustomer", data);
            if (data?.data?.successful) {
                setLoader(false);
                const dataObj = {
                    idCompany: props?.route?.params?.id,
                        offset: 1,
                        limit: 10,
                        userStatus: "ActiveInactive"
                }
                let user = data?.data?.data?.userResponse
                console.log("user is", user);
                setFirstName(user?.firstName);
                setLastName(user?.lastName);
                setEmail(user?.email);
                setPhone(user?.phone);
                setPlants(user?.plant)
                 dispatch(getByCompanyRequest({
                               page: 1,
                               pageSize: 10,
                               dataObj: dataObj,
                 }));
                 showMessage('success', 'User details updated successfully.');
                setUserModal(false);
                // setTimeout(() => {
                //     showMessage('success', 'User details updated successfully.');
                // }, 1000);
            }
            else {
                setLoader(false);
                setUserModal(false);
                showMessage('error', data?.data?.message);
                  }
        } catch (err) {
            setLoader(false);
            console.log("Error", err);
        }
    }

    const getRandomInt = (min = 1, max = 999) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); 
      };
    
    const randomArray = () => {
        return [getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt()];
    };
    
    const updateCustomerUsers = async () => {
        try {
            if (!isCompanyApproved) {
                showMessage('error', 'Apologies, but this company is not approved. You cannot update the details.');
                setUserModal(false);
                return;
            }
            if (!userGetData.isActive) {
                showMessage('error', 'Please active the user first before proceeding.');
                setUserModal(false);
                return;
            }
            const randomPassword = await generateRandomPassword(10);
            var secureRandom = require('secure-random')
            let iv = CryptoJS.lib.WordArray.create(randomArray()).toString(
                CryptoJS.enc.Hex,
            );
            let salt = CryptoJS.lib.WordArray.create(randomArray()).toString(
                CryptoJS.enc.Hex,
            );
            getData2(salt, iv, randomPassword);
        }
        catch (err) {
            console.log("Error", err);
            
        }
      }
    const updateCustomerDetails = async() => {
        try {
            const dataObj = {
                "idUser": authData?.data?.userId || authData?.data?.idUser,
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "phone": phone,
                "businessUnit": authData?.data?.businessUnit,
                "subUserIdCompany": selectedUser?.id,
                "plantIds": [
                    21233
                ],
                "test_on": "00000043000000eb000000d100000002",
                "data_on": "0000001b000000c1000000c9000000d8",
            }
            const data = await updateCustomerUser(dataObj)
            console.log("data is ", data);
            if (data?.data?.successful) {
                setLoader(true);
                Toast.show({
                    type: 'success',
                    text2: 'Users data update successfully',
                    visibilityTime: 4000,
                    autoHide: true,
                });
            } else {
                setFirstName('');
                setLastName('');
                setPhone('');
                setLoader(false);
                // setUserModal(false);
            }

        } catch (err) {
            setLoader(false);
            // setUserModal(false);
            console.log("Error", err);
            
        }
    }

    const handlePlantChange = (value) => {
        setPlants(value);
        const selectedIds = branchData
            ?.filter(plant => value.includes(plant.value))
            .map(plant => plant.id);
        setPlantIds(selectedIds)
    }
    
    const handleReset = async () => {
        setPhone('');
        setFirstName('');
        setLastName('');
        // setUserModal(false);
    }
    const showUserModal = (plantIds) => {
        return (
            <Modal visible={userModal} animationType="slide" transparent onRequestClose={modalOpen}>
               <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'margin'}
                       >
                        <View style={[styles.modalContent,]}>
                        
                    <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Text style={styles.modalTitle}>Edit User Info</Text>
                            <TouchableOpacity onPress={modalOpen}>
                                <AntDesign name="close" size={18} color="#363636" />
                            </TouchableOpacity>
                        </View>
                            <View style={styles.separator} />                    
                        <ScrollView>
                                <>
                                    <Text style={[styles.label, { marginTop: 5 }]}>Plants*</Text>
                                    <Select
                                        selectedValue={plants}
                                        placeHolder="Select Type"
                                        onChange={(itemValue) => {
                                            handlePlantChange(itemValue);
                                        }}
                                        // onChange={(itemValue) =>
                                        //     setPlants(itemValue)
                                        // }
                                        isMulti={true}
                                        fromDD={false}
                                        options={branchData}
                                        containerStyle={{
                                            borderColor: Colors.FontColor,
                                            marginTop: 0
                                        }}
                                    />
                                    <Text style={[styles.label, {marginTop:5}]}>Email*</Text>
                                    <TextInput
                                        placeholder="Enter Email"
                                        placeholderTextColor="#333"
                                        value={email}
                                    onChangeText={setEmail}
                                    editable={false}
                                    style={[styles.inputField, { backgroundColor: '#EAEAEA' }]}
                                    />

                                    <Text style={styles.label}>First Name*</Text>
                                    <TextInput
                                        placeholder="Enter First Name"
                                        placeholderTextColor="#333"
                                        value={firstName}
                                        onChangeText={val => setFirstName(val)}
                                        style={styles.inputField}
                                    />

                                    <Text style={styles.label}>Last Name</Text>
                                    <TextInput
                                        placeholder="Enter Last Name"
                                        placeholderTextColor="#333"
                                        value={lastName}
                                        onChangeText={val => setLastName(val)}
                                        style={styles.inputField}
                                    />
                                    <Text style={styles.label}>Country Code</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: Dimension.margin10 }}>
                                        <TextInput
                                            placeholder="+91"
                                            placeholderTextColor={'#333'}
                                            style={[styles.inputField, { flex: 0.2, marginRight: Dimension.margin10, backgroundColor: '#cccccc57' }]}
                                            editable={false}
                                        />
                                        <TextInput
                                            placeholder="Enter Phone Number"
                                            placeholderTextColor={'#333'}
                                            keyboardType="numeric"
                                            maxLength={10}
                                            value={phone}
                                            onChangeText={val => setPhone(val)}
                                            style={[styles.inputField, { flex: 1 }]}
                                        />
                                    </View>
                                </>
                         
                            <View style={styles.separator} />
                            <NextButton
                                    button1="Reset"
                                    button2="Submit"
                                    fromEditProfile
                                    disableButton2={isSubmitDisabled()}
                                    firstButton={() => handleReset()}
                                    enableButton
                                    secondButton={() => updateCustomerUsers()}
                                />
                                </ScrollView>                
                            </View>
                        </KeyboardAvoidingView>         
                    </View>
                    </TouchableWithoutFeedback>
            </Modal>
        );
    };


    // const showUserModal = () => {
    //     return (
    //         <Modal
    //             visible={userModal}
    //             animationType="slide"
    //             transparent={true}
    //             onRequestClose={modalOpen}>
    //             <View style={styles.modalOverlay}>
    //                 <View style={[styles.modalContent]}>
    //                     <View style={{
    //                         flexDirection: 'row',
    //                         justifyContent: 'space-between',
    //                         alignItems: 'center',
    //                     }}>
    //                         <Text style={styles.modalTitle}>Edit User Info</Text>
    //                         <TouchableOpacity onPress={modalOpen}>
    //                             <AntDesign name="close" size={18} color="#363636" />
    //                         </TouchableOpacity>
    //                     </View>
    //                     <View style={styles.separator} />
    //                     <Text
    //                         style={{
    //                             color: '#363636',
    //                             fontSize: Dimension.font12,

    //                         }}>
    //                         Email*
    //                     </Text>
    //                     <TextInput
    //                         // key={index}
    //                         placeholder={'Enter Email'}
    //                         placeholderTextColor={'#333333'}
    //                         style={[styles.inputField]}
    //                     //   value={sapData['plant'] || ''}
    //                     //   onChangeText={text =>
    //                     //     handleInputChange('plant', text.replace(filterTextRegex, ''))
    //                     //   }
    //                     />
    //                     <Text
    //                         style={{
    //                             color: '#363636',
    //                             fontSize: Dimension.font12,
    //                         }}>
    //                         First Name*
    //                     </Text>
    //                     <TextInput
    //                         // key={index}
    //                         placeholder={'Enter First Name'}
    //                         placeholderTextColor={'#333333'}
    //                         style={[styles.inputField]}
    //                       value={getByCompanyData?.data?.emailId}
    //                     //   onChangeText={text =>
    //                     //     handleInputChange('plant', text.replace(filterTextRegex, ''))
    //                     //   }
    //                     />
    //                     <Text
    //                         style={{
    //                             color: '#363636',
    //                             fontSize: Dimension.font12,
    //                         }}>
    //                         Last Name
    //                     </Text>
    //                     <TextInput
    //                         // key={index}
    //                         placeholder={'Enter Last Name'}
    //                         placeholderTextColor={'#333333'}
    //                         style={[styles.inputField]}
    //                     //   value={sapData['plant'] || ''}
    //                     //   onChangeText={text =>
    //                     //     handleInputChange('plant', text.replace(filterTextRegex, ''))
    //                     //   }
    //                     />
    //                     <Text
    //                         style={{
    //                             color: '#363636',
    //                             fontSize: Dimension.font12,
    //                         }}>
    //                         Country Code
    //                     </Text>
    //                     <TextInput
    //                         // key={index}
    //                         placeholder={'Enter Country Code'}
    //                         placeholderTextColor={'#333333'}
    //                         style={[styles.inputField]}
    //                     //   value={sapData['plant'] || ''}
    //                     //   onChangeText={text =>
    //                     //     handleInputChange('plant', text.replace(filterTextRegex, ''))
    //                     //   }
    //                     />
    //                     <View style={styles.separator} />
    //                     <NextButton
    //                         button1={'Reset'}
    //                         button2={'Apply'}
    //                         fromEditProfile
    //                         // firstButton={handleReset}
    //                         // secondButton={handleApply}
    //                         // disableButton2={isCtaDisabled()}
    //                         enableButton
    //                     />

    //                 </View>
    //             </View>
    //         </Modal>
    //     );
    // };
   
    const onRefresh = async () => {
        setRefreshing(true);
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);

        const dataObj = {
            idCompany: props?.route?.params?.id,
            offset: currentPage,
            limit: 10,
            userStatus: "ActiveInactive"
        }
        dispatch(
            getByCompanyRequest({
                page: 1,
                pageSize: 10,
                dataObj: dataObj,
            }),
        );
        setRefreshing(false);
    };

    const onEndReached = async () => {
        if (
            getByCompanyData?.status == STATE_STATUS.FETCHED &&
            getByCompanyData?.status != STATE_STATUS.FETCHING &&
            getByCompanyData?.currentPage < getByCompanyData?.totalPages
        ) {
            const sessionData = await AsyncStorage.getItem('@get_session');
            const getPlantId = await AsyncStorage.getItem('@plantId');
            let jsonSessionData = JSON.parse(sessionData);
            let plantId = JSON.parse(getPlantId);
            const currentPage = getByCompanyData?.currentPage || 0;
            const dataObj = {
                idCompany: props?.route?.params?.id,
                offset: currentPage,
                limit: 10,
                userStatus: "ActiveInactive"
            }
            dispatch(
                getByCompanyRequest({
                    page: getByCompanyData?.currentPage + 1,
                    pageSize: 10,
                    dataObj,
                }),
            );

        }
    };
console.log("props", props?.route?.params?.id);

    const renderItem = ({ item, index }) => {
        console.log("c r item", item);
        return item?.users?.map((cardItem, cardIndex) => {
            console.log(cardItem, "cardItem");

            return (
                <ScrollView>
                    <View style={styles.CardWrapper}>
                        <View style={[styles.statusWrap, { flexDirection: 'row', marginTop: 3 }]}>
                            <Text selectable={true} style={[styles.boldTxt]} >Name : {cardItem?.firstName}{' '}{cardItem?.lastName}</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.col,]}>
                                <Text style={styles.boldTxt}>Email ID</Text>
                                <Text selectable={true} style={styles.lightTxt}>
                                    {cardItem?.emailId ? `${cardItem?.emailId}` : '-'}
                                </Text>
                            </View>
                            <View style={[styles.col,]}>
                                <Text style={styles.boldTxt}>Phone number</Text>
                                <Text selectable={true} selectionColor="#FF5733" style={[styles.lightTxt,]}>
                                    {cardItem?.phone ? `${cardItem?.phone}` : '-'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.col,]}>
                                <Text style={styles.boldTxt}>Role</Text>
                                <Text selectable={true} style={styles.lightTxt}>
                                    {cardItem?.roles?.[0]?.name ? `${cardItem?.roles?.[0]?.name}` : '-'}
                                </Text>
                            </View>
                            <View style={[styles.col,]}>
                                <TouchableOpacity style={styles.row}
                                    onPress={() => modalOpen(cardItem.idUser, cardItem.emailId, cardItem?.plantIds, cardItem?.firstName, cardItem?.lastName, cardItem?.phone)}>
                                    <AntDesign
                                        name={'edit'}
                                        size={18}
                                        color={'#0063A7'}
                                        onPress={() => modalOpen(cardItem.idUser, cardItem.emailId, cardItem?.plantIds, cardItem?.firstName, cardItem?.lastName, cardItem?.phone)}>
                                            </AntDesign>
                                    <Text style={[styles.boldTxt, { paddingHorizontal: Dimension.padding10, color: '#0063A7',  }]}>
                                        Edit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                        {userModal && selectedUser?.id === cardItem?.idUser && showUserModal(cardItem?.plantIds)}
                    </View>
                </ScrollView>
            );
        });
    };

    return (
        <>
            {loader && <CustomLoader fullScreen />}
            <View style={styles.separator}></View>
            <FlatList
                data={getByCompanyData?.data}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingVertical: Dimension.padding15,
                    paddingTop: 0,
                }}
                keyExtractor={(item, index) => `${index}-item`}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.7}
                alwaysBounceVertical={true}
                bounces={true}
                ListFooterComponent={() => {
                    return getByCompanyData?.status === STATE_STATUS.FETCHING ? (
                        <ActivityIndicator size={22} color={'#000'} />
                    ) : null;
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            // style={{
            //     marginBottom:  130,
            //     }}
            />
        </>

    );
}
export default usersScreen;