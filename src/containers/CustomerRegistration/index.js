import React, { useRef, useState, useEffect, useContext } from 'react';
import {
    Button,
    View,
    Text,
    FlatList,
    BackHandler,
    Alert,
    StyleSheet,
    ScrollView,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    Modal,
    Image,
    ActivityIndicator,
    RefreshControl,
    PermissionsAndroid,
    Platform,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
} from 'react-native';
import { ScannerService } from '../../services/scannerService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dimension from '../../Theme/Dimension';
import Colors from '../../Theme/Colors';
import styles from './style';
import Header from '../../component/Header';
import { useFocusEffect } from '@react-navigation/native';
import CONSTANTS from '../../services/constant';
//import { Card} from "react-native-elements";
import CustomeIcon from '../../component/CustomeIcon';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
//import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginContext from '../../context/loginContext';
import { useSelector, useDispatch } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getDispatchDetailsRequest } from '../../redux/feature/dispatchDetailsSlice';
import { STATE_STATUS } from '../../redux/constants';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Filter from '../../component/Filter';
import NextButton from '../../component/Button';
import HeaderFilter from '../../component/HeaderFilter';
// import RNFS, { stat } from 'react-native-fs';
import CardFooter from '../../component/bottomFooter';
import Search from '../../component/Search';
import { AlLiveTrackingLink, LIVE_TRACKING_LINK_COPPER } from '../../constants';
import { getRealUrl, handleDownload } from '../../utils/generatePdfFile';
import DatePickerInput from '../../component/DateTimePicker';
import FilterButton from '../../component/Button';
import { filterTextRegex } from '../../constants';
import { convertedDate, convertDate, convertEpochToDate, convertedDated, convertDateToEndOfDayTimestamp, convertDateToTimestamp } from '../../utils/BiometricAuth';
import Toast from 'react-native-toast-message';
//import { useNavigation } from "@react-navigation/native";
//import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Linking } from 'react-native';
import CustomLoader from '../../component/customLoader';
import {
    getCCHPProductVariantsRequest,
    getComplaintMailRequest,
    getFeedbackCategoryRequest,
    getFeedbackSubCategoryRequest,
    getShipmentRequest,
    getUserByRolePMRequest,
    getUserByRolePMSEZRequest,
    getUserByRoleRMSEZRequest,
    getUserByRoleRMRequest,
    getVocAdminListRequest,
    getVocComplaintRequest
} from '../../redux/feature/vocSlice';
import { getApprovedCustomerListRequest, getNfaCustomerListRequest } from '../../redux/feature/mouslice';
import { companyGetRequest, getAllByCompanyRequest, getByCompanyRequest, getCustomerListingRequest, getDetailsRequest, userGetRequest } from '../../redux/feature/customerRegSlice';
import { approveAction, getPlantRequest, rejectAction } from '../../services/customerRegistration';
import FloatingLabelInputField from '../../component/FloatingInput';
const CustomerRegistrationScreen = props => {
    const dispatch = useDispatch();
    const authData = useSelector(state => state.auth);
    const branchAccessData = useSelector(state => state.branchAccess?.data?.branchModules);
    const customerRegistrationListing = useSelector(
        state => state.customerRegistration?.customerListing,
    );
    const customerList = useSelector(state => state?.mouList?.nfaCustomerList?.data)
    const complaintById = useSelector(state => state.vocList?.complaintById)
    const getAllByCompanyStatus = useSelector(state => state.customerRegistration?.getAllByCompany)
    const getDetailsData = useSelector(state => state.customerRegistration?.getDetails);
    const { data, status, isCustomer } = useSelector(state => state.branchAccess);
    const isSnop = branchAccessData?.roleNames.includes('Sales and Operation Planning') ? true : false;
    const isRM = branchAccessData?.roleNames.includes('Regional Manager') ? true : false;
    const isPM = branchAccessData?.roleNames.includes('Product Manager') ? true : false;
    const isSAG = branchAccessData?.roleNames.includes('Sales and Accounting - Finance') ? true : false;
    const isSBFM = branchAccessData?.roleNames.includes("Sector Buyer Finance Manager") ? true : false;
    //const navigation = useNavigation();
    const [approveModal, setApproveModal] = useState(false);
    const [rejectModal, setRejectModal] = useState(false);
    const [selectedBusinessId, setSelectedBusinessId] = useState(null);
    const [emailId, setEmailId] = useState('');
    const [showCreateNew, setShowCreateNew] = useState(true);
    const [isDisabled, setIsDisabled] = useState(true);
    const [userInfo, setUser] = useState();
    const [approveRemarks, setApproveRemarks] = useState('');
    const [rejectRemarks, setRejectRemarks] = useState('');
    const [selectedData, setSelectedData] = useState([]);
    const [auth, setAuth] = useState({});
    const [listing, setListing] = useState([]);
    const [closelisting, setClosedListing] = useState([]);
    const [searchlisting, setSearchListing] = useState([]);
    const [updatedDate, setUpdatedDate] = useState();
    const [search, setSearch] = useState('');
    const [searchType, setStype] = useState(false);
    const [showRefreshModal, setShowRefreshModal] = useState(false);
    const [showType, setType] = useState('Complaint');
    const [refreshing, setRefreshing] = useState(false);
    // const [showFilter, setShowFilter] = useState(false);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [DoNo, setDoNo] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [userType, setUserType] = useState(false);
    // const [customerList, setCustomerData] = useState([]);
    const [sapModal, setSapModal] = useState(false);
    const [isColor, setIsColor] = useState('Delivered');
    const [loader, setLoader] = useState(false);
    const [canNavigate, setCanNavigate] = useState(false)
    const [complaintId, setComplaintId] = useState('')
    const [resetTrigger, setResetTrigger] = useState(false);
    const [companyId, setCompanyId] = useState('');
    const [branchId, setBranchId] = useState('');
    const [resetFilter, setResetFilter] = useState(false)
    const [filterData, setFilterData] = useState({
        invoiceNo: '',
        fromDate: '',
        toDate: '',
        dONo: '',
        customerId: '',
        plant: '',
        orderNo: '',
        customerName: '',
        CustomerName: '',
        business_id: '',
        business_name: '',
        CustomerId: '',
        OrderNo: '',
        CustomerCode: props?.route?.params?.regId || '',
        Status: '',
        PremiumType: '',
        gstin: '',
        SalesRegion: '',
    });

    const modalOpen = (id, branchId) => {
        setSelectedBusinessId(id);
        setCompanyId(id);
        setBranchId(branchId);
        setApproveModal(!approveModal);
    };

    const rejectModalOpen = (id, branchId, mailId) => {
        setEmailId(mailId);
        setSelectedBusinessId(id);
        setCompanyId(id);
        setBranchId(branchId);
        setRejectModal(!rejectModal);
    };

    const closeRejectModal = () => {
        setRejectModal(false);
        setRejectRemarks('');
    }

    const showApproveModal = () => {
        return (
            <Modal visible={approveModal} animationType="slide" transparent onRequestClose={closeModal}
            onBackdropPress={closeModal}
            onTouchOutside={closeModal}
                onDismiss={closeModal}
            >
                {/* <TouchableWithoutFeedback onPress={closeModal}> */}
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'margin'}
                        >
                            <View style={styles.modalContent}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <Text style={styles.modalTitle}>Approval</Text>
                                    <TouchableOpacity onPress={closeModal}>
                                        <AntDesign name="close" size={18} color="#363636" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.separator} />
                                <ScrollView>
                                    <>
                                        <Text style={styles.heading}>Are you sure you want to approve this application?</Text>
                                        <Text style={[styles.label, { marginBottom: 5, }]}>Approver Remarks*</Text>
                                        <TextInput
                                            placeholder={'Approver Remarks'}
                                            value={approveRemarks}
                                            onChangeText={input => setApproveRemarks(input)}
                                            multiline={true}
                                            numberOfLines={4}
                                            style={[styles.inputField, {
                                                textAlignVertical: 'top',
                                                marginVertical: 0,
                                                marginBottom: Dimension.marginBottom100,
                                                borderColor: '#363636',
                                            }]}
                                        />
                                    </>

                                    <View style={styles.separator} />
                                    <NextButton
                                        button1="Cancel"
                                        button2="Approve"
                                        fromEditProfile
                                        enableButton
                                        firstButton={() => closeModal()}
                                        secondButton={() => handleApproveAction()}
                                        disableButton2={!isApproveRemarksDisabled()}
                                    />
                                </ScrollView>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                {/* </TouchableWithoutFeedback> */}
            </Modal>
        );
    };
    const showRejectModal = () => {
        return (
            <Modal visible={rejectModal}
                animationType="slide"
                transparent
                onRequestClose={closeRejectModal}
                onBackdropPress={closeRejectModal}
                onTouchOutside={closeRejectModal}
                onDismiss={closeRejectModal }
            >
                {/* <TouchableWithoutFeedback onPress={closeRejectModal}> */}
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'margin'}
                        >
                            <View style={styles.modalContent}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <Text style={styles.modalTitle}>Rejection</Text>
                                    <TouchableOpacity onPress={closeRejectModal}>
                                        <AntDesign name="close" size={18} color="#363636" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.separator} />
                                <ScrollView>
                                    <>
                                        <Text style={styles.heading}>Are you sure you want to reject this application?
                                        </Text>
                                        <Text style={[styles.label, { marginBottom: 5, }]}>Rejection Remarks*</Text>
                                        <TextInput
                                            placeholder={'Rejection Remarks'}
                                            value={rejectRemarks}
                                            onChangeText={input => setRejectRemarks(input)}
                                            multiline={true}
                                            numberOfLines={4}
                                            style={[styles.inputField, {
                                                textAlignVertical: 'top',
                                                marginVertical: 0,
                                                marginBottom: Dimension.marginBottom100,
                                                borderColor: '#363636',
                                            }]}
                                        />
                                    </>

                                    <View style={styles.separator} />
                                    <NextButton
                                        button1="Cancel"
                                        button2="Reject"
                                        fromEditProfile
                                        enableButton
                                        firstButton={() => closeRejectModal()}
                                        secondButton={() => handleReject()}
                                        disableButton2={!isRejectRemarksDisabled()}
                                    />
                                </ScrollView>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                {/* </TouchableWithoutFeedback> */}
            </Modal>
        );
    };
    const closeModal = () => {
        setApproveModal(false);
        setApproveRemarks('')
    }

    const handleReject = async () => {
        try {
            const sessionData = await AsyncStorage.getItem('@get_session');
            const getPlantId = await AsyncStorage.getItem('@plantId');
            let jsonSessionData = JSON.parse(sessionData);
            let plantId = JSON.parse(getPlantId);
            console.log("handleReject hit");
            setRejectModal(!rejectModal)
            setRejectRemarks('');
            setLoader(true);
            const dataObj = {
                idUser: authData?.data?.userId || authData?.data?.idUser,
                idCompany: companyId,
                idBranch: plantId?.plantId,
                businessUnit: authData?.data?.businessUnit,
                plantId: branchId,
                message: rejectRemarks,
                emailId: emailId,
                requestType:  "Plant Onboarding",
            }
            const data = await rejectAction(dataObj);
            console.log("data from reject ", data);
            if (data?.data?.successful) {
                setLoader(false);
                setResetTrigger(true);
                await fetchData();
                Toast.show({
                    type: 'success',
                    text2: data?.data?.message || 'Reject Successfully',
                    visibilityTime: 3000,
                    autoHide: true,
                });
            }
            setResetTrigger(false);
            setLoader(false);
        }
        catch (err) {
            setLoader(false);
            console.log("Error", err);
        }
    };

    const handleApproveAction = async () => {
        try {
            console.log("handleApproveAction hit");
            setApproveModal(!approveModal)
            setApproveRemarks('');
            setLoader(true);
            const sessionData = await AsyncStorage.getItem('@get_session');
            const getPlantId = await AsyncStorage.getItem('@plantId');
            let jsonSessionData = JSON.parse(sessionData);
            let plantId = JSON.parse(getPlantId);
            const dataObj = {
                idUser: authData?.data?.userId || authData?.data?.idUser,
                idCompany: companyId,
                idBranch: plantId?.plantId,
                emailId: emailId,
                message: approveRemarks,
                plantId: branchId,
                businessUnit: authData?.data?.businessUnit,
                approvalCheck: false,
                requestType:  "Plant Onboarding",
            }
            const data = await approveAction(dataObj)
            if (data?.data?.successful) {
                setResetTrigger(true);
                // Alert.alert('Approved Successfully',)
                Toast.show({
                    type: 'success',
                    text2: 'Approval details saved successfully',
                    visibilityTime: 3000,
                    autoHide: true,
                });
                await fetchData();
            }
            setResetTrigger(false);
            setLoader(false);
        } catch (err) {
            setLoader(false);
            console.log("Error", err);
        }
    }
    const [sapData, setSapData] = useState({
        toDate: '',
        fromDate: '',
        plant: '',
    });
    const [regionByPlantData, setRegionByPlants] = useState([]);
    const [requestPayload, setRequestedPayload] = useState({});

    let webview = useRef(null);
    const dispatchDetails = useSelector(
        state => state.dispatchDetails?.dispatchDetails,
    );
    const dispatchDetailsData = useSelector(
        state => state.dispatchDetails?.dispatchDetails?.data,
    );
    // console.log("customer list ", customerList);

    const premiumStatuses = ['Premium Approval Pending', 'Non Premium Request Pending'];
    const customerNameOptions = customerList?.length > 0 ? customerList?.map(item => ({
        value: item.business_name,
        label: item.business_name,
        id: item.business_id
    })) : [];

    const salesRegionList = new Map([
        ["EI01", "Zn-East"],
        ["WI01", "Zn-West"],
        ["NI01", "Zn-North"],
        ["SI01", "Zn-South"]
    ]);
    const regionCodes = branchAccessData?.region;
    let mappedRegions = [];

    if (regionCodes === null || regionCodes === undefined) {
        mappedRegions = Array.from(salesRegionList?.values());
    } else {
        mappedRegions = [regionCodes]?.map(code => salesRegionList?.get(code)).filter(Boolean);
    }
    const headerFilter = [
        {
            label: 'CustomerCode',
            placeholder: 'Customer Code',
            type: 'text',
           },
        {
            label: 'CustomerName',
            placeholder: 'Customer Name',
            type: 'options',
            options: [...customerNameOptions].sort((a, b) => {
                const labelA = a?.label || '';
                const labelB = b?.label || '';
                return labelA.localeCompare(labelB);
            }),
        },
        {
            label: 'gstin',
            placeholder: 'GSTIN',
            type: 'text',
        },
        // authData?.data?.businessUnit === 'Aluminium' &&{
        //     label: 'PremiumType',
        //     placeholder: 'Premium Type',
        //     type: 'options',
        //     options: [{ value: 'Premium', label: 'Premium' },
        //         { value:'Non Premium', label:'Non Premium'}]
        // },
        
        (authData?.data?.businessUnit === 'Aluminium' || authData?.data?.businessUnit === 'Copper') && {
            label: 'Status',
            placeholder: 'Status',
            type: 'options',
            options: authData?.data?.businessUnit === 'Zinc'
                ? [
                    { value: 'Pending from RM', label: 'Pending from RM' },
                    { value: 'Pending from SNOP', label: 'Pending from SNOP' },
                    { value: 'Pending from Finance', label: 'Pending from Finance' },
                    { value: 'Pending from SAP', label: 'Pending from SAP' },
                    { value: 'Pending from MFC', label: 'Pending from MFC' },
                    { value: 'Change Request Sent', label: 'Change Request Sent' },
                    { value: 'Approved', label: 'Approved' },
                    { value: 'Rejected', label: 'Rejected' },
                ]
                : authData?.data?.businessUnit === 'Copper'
                    ? [
                        { value: 'Pending from RM', label: 'Pending from RM' },
                        { value: 'Pending from SNOP', label: 'Pending from SNOP' },
                        { value: 'Pending from Finance', label: 'Pending from Finance' },
                        { value: 'Pending from SAP', label: 'Pending from SAP' },
                        { value: 'Change Request Sent', label: 'Change Request Sent' },
                        { value: 'Approved', label: 'Approved' },
                        { value: 'Rejected', label: 'Rejected' },
                    ]
                    : [
                        { value: 'Pending from RM', label: 'Pending from RM' },
                        { value: 'Pending from SNOP', label: 'Pending from SNOP' },
                        { value: 'Pending from SAP', label: 'Pending from SAP' },
                        { value: 'Change Request Sent', label: 'Change Request Sent' },
                        { value: 'Premium Approval Pending', label: 'Premium Approval Pending' },
                        { value: 'Non Premium Request Pending', label: 'Non Premium Request Pending' },
                        { value: 'Approved', label: 'Approved' },
                        { value: 'Rejected', label: 'Rejected' },
                    ]
        },
        authData?.data?.businessUnit === 'Zinc' && {
            label: 'Status',
            placeholder: 'Status',
            type: 'options',
            isMulti: true,
            options: [
                { value: 'Pending from RM', label: 'Pending from RM' },
                { value: 'Pending from SNOP', label: 'Pending from SNOP' },
                { value: 'Pending from Finance', label: 'Pending from Finance' },
                { value: 'Pending from SAP', label: 'Pending from SAP' },
                { value: 'Pending from MFC', label: 'Pending from MFC' },
                { value: 'Change Request Sent', label: 'Change Request Sent' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Rejected', label: 'Rejected' },
              ]
        },
        // authData?.data?.businessUnit === 'Zinc' &&{
        //     label: 'SalesRegion',
        //     placeholder: 'Sales Region',
        //     type: 'options',
        //     options: [
        //         { value: 'Zn-North', label: 'Zn-North' },
        //         { value: 'Zn-West', label: 'Zn-West' },
        //         { value: 'Zn-East', label: 'Zn-East' },
        //         { value: 'Zn-South', label: 'Zn-South' },
        //         { value: 'Lead', label: 'Lead' },
        //         { value: 'Silver', label: 'Silver' },
        //         { value: 'Acid', label: 'Acid' },
        //       ]    
        // },
        {
            label: 'invoiceNo',
            type: 'Invoice',
            placeholder: 'options',
        },
    ];
    useEffect(() => {
        if (canNavigate && getAllByCompanyStatus.status === STATE_STATUS.FETCHED) {
            props.navigation?.push('CustomerRegForm', { id: complaintId });
        }
    }, [getAllByCompanyStatus.status]);

    
    const isCtaDisabled = () => {
        const { fromDate, toDate } = sapData;
        //console.log('from dataa', sapData);
        //console.log('check this', toDate?.trim().length, fromDate?.trim().length);

        const isFromDateSelected = fromDate?.trim().length > 0;
        const isToDateSelected = toDate?.trim().length > 0;

        if (
            (isFromDateSelected && !isToDateSelected) ||
            (!isFromDateSelected && isToDateSelected)
        ) {
            return true;
        }

        return false;
    };

    const isApproveRemarksDisabled = () => {
        return approveRemarks?.length > 0;
    };

    const isRejectRemarksDisabled = () => {
        return rejectRemarks?.length > 0;
    };

    const handleInputChange = (fieldName, value) => {
        setSapData({
            ...sapData,
            [fieldName]: value,
        });
    };

    const handleApply = () => {
        //console.log('Applied Filters:', sapData);
        // Alert.alert('Filters Applied!', JSON.stringify(sapData, null, 2));
        handleSapReport(sapData);

        // onClose();
    };

    useEffect(() => {
        checkDetail();
    }, []);
    useEffect(() => {
        fetchData();
    }, []);
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
            //console.log(e);
        }
    };

    const FeedListing = info => {
        let type;
        if (
            info?.userEmail?.split('@')?.[1] == 'vedanta.co.in' ||
            info?.userEmail?.split('@')?.[1] == 'moglix.com'
        ) {
            type = 'Supplier';
        }
        ////console.log(auth)
        ScannerService.FeedList(info, 'Complaint', type)
            .then(data => {
                setListing(data.data.result);
                ClosedListing(info);
                return;
            })
            .catch(e => {
                //console.log(e);
                return;
            });
    };
    const ClosedListing = info => {
        let type;
        if (
            info?.userEmail?.split('@')?.[1] == 'vedanta.co.in' ||
            info?.userEmail?.split('@')?.[1] == 'moglix.com'
        ) {
            type = 'Supplier';
        }
        ScannerService.FeedList(info, 'Feedback', type)
            .then(data => {
                setClosedListing(data.data.result);
                return;
            })
            .catch(e => {
                //console.log(e);
                return;
            });
    };

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const formatDate = date => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
    };
    const CallSession = message => {
        setUser(message);
        ScannerService.GetSession(message)
            .then(data => {
                if (data.successful) {
                    message['branchId'] = Object.keys(
                        data.data.companyData.branchNames,
                    )[0];
                    message['companyId'] = Object.keys(
                        data.data.companyData.companyNames,
                    )[0];
                    message['companyName'] = Object.values(
                        data.data.companyData.companyNames,
                    )[0];
                    setUser(message);
                    // FeedListing(message);
                    getDataFunc(message);
                    // ClosedListing(message);
                } else {
                    ToastAndroid.show(data.message, ToastAndroid.SHORT);
                    Logout();
                }
            })
            .catch(err => {
                // Logout();
                //console.log(err);
            });
    };
    const getDataFunc = async jsonValue => {
        if (jsonValue) {
            const userData = await ScannerService.GetBranchAcc({
                ...jsonValue,
            });
            if (
                !userData?.data?.branchModules?.roleNames?.includes(
                    'Product Manager',
                ) &&
                !userData?.data?.branchModules?.roleNames?.includes('Customer') &&
                !userData?.data?.branchModules?.roleNames?.includes(
                    'Company Super Admin',
                ) &&
                jsonValue?.businessUnit == 'Aluminium'
            ) {
                setShowCreateNew(false);
            }
            setIsDisabled(false);
        }
    };



    const handleApplyFilters = async data => {
        console.log("data", data);
        
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        const getPlantCode = await AsyncStorage.getItem('@plantCode');
        let plantCode = JSON.parse(getPlantCode);
        console.log(authData?.data?.businessUnit === 'Zinc'
            ? (filterData?.Status ? { statusList: filterData.Status } : {})
            : (filterData?.Status ? { status: filterData.Status } : {}), " authData?.data?.businessUnit === 'Zinc  ");

        const dataObj = {
            ...(authData?.data?.idUser || authData?.data?.userId ? { idUser: authData?.data?.idUser || authData?.data?.userId } : {}),
            ...(plantId?.plantId ? { idBranch: plantId?.plantId } : {}),
            ...(authData?.data?.businessUnit ? { businessUnit: authData?.data?.businessUnit } : {}),
            ...(data?.CustomerCode ? { plantCode: data?.CustomerCode } : {}),
            ...(data?.CustomerName ? { customerName: data?.CustomerName } : {}),
            ...(data?.PremiumType ? { premiumType: data?.PremiumType } : {}),
            ...(data?.gstin ? { gstin: data?.gstin } : {}),
            ...(
                authData?.data?.businessUnit === 'Zinc'
                    ? (data?.Status ? { statusList: data.Status } : {})
                    : (data?.Status ? { status: data.Status } : {})
            ),
            ...(mappedRegions ? { regions: mappedRegions } : {}),
            pageNumber: 1,
            offset: 0,
            limit: 15
        };
        dispatch(
            getCustomerListingRequest({
                page: 1,
                pageSize: 15,
                dataObj,
            }),
        );
        setFilterData(data);
        setShowFilter(false);
    };

    const fetchData = async () => {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        const currentPage = dispatchDetails?.currentPage || 0;

        const dataObj = {
            idUser: authData?.data?.userId || authData?.data?.idUser,
            idBranch: plantId?.plantId,
            businessUnit: authData?.data?.businessUnit,
            regions: mappedRegions,
            ...(props?.route?.params?.regId ? { plantCode: props?.route?.params?.regId } : {}),
            offset: 0,
            limit: 15
        }

        const plantReqObj = {
            idUser: authData?.data?.userId || authData?.data?.idUser,
            businessUnit: authData?.data?.businessUnit,
            regions: mappedRegions,
            offset: 0,
            limit: 15
        }
        dispatch(
            getNfaCustomerListRequest({
                businessUnit: authData?.data?.businessUnit
            })
        )
        dispatch(
            getCustomerListingRequest({
                page: 1,
                pageSize: 15,
                dataObj: dataObj,
            }),
        );

        dispatch(
            getPlantRequest({
                page: 1,
                pageSize: 10,
                dataObj: plantReqObj,
            }),
        );
    };

    const handleRefresh = async () => {
        try {
            setLoader(true);
            const getPlantCode = await AsyncStorage.getItem('@plantCode');
            let plantCode = JSON.parse(getPlantCode);
            const dataObj = {
                fromDate: formatDate(yesterday),
                toDate: formatDate(today),
                businessUnit: authData?.data?.businessUnit,
                customerCode: plantCode?.plantCode,
            };
            const data = await ScannerService.refreshData(dataObj);
            //console.log('refreshData log', data);

            if (data?.data?.success) {
                setLoader(false)
                handleRefreshData();
                onRefresh();
                // setShowRefreshModal(true);
            }
        } catch (err) {
            //console.log('Error occured', err);
        }
    };
    const handleRefreshData = async () => {
        try {
            const getPlantCode = await AsyncStorage.getItem('@plantCode');
            let plantCode = JSON.parse(getPlantCode);
            const dataObj = {
                BU: authData?.data?.businessUnit,
                plantCode: plantCode?.plantCode,
            };
            const data = await ScannerService.getShipmentTimeStamp(dataObj);
            //console.log('time stamp data', data);

            setUpdatedDate(data?.data?.updationDate);
        } catch (err) {
            //console.log('Error occured', err);
        }
    };

    const formattedDate = dob => {
        const [day, month, year] = dob.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const onRefresh = async () => {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        const jsonSessionData = JSON.parse(sessionData);
        const plantId = JSON.parse(getPlantId);
        console.log("plant is here", plantId);
        setResetTrigger(true);
        setRefreshing(true);
        setFilterData({
            invoiceNo: '',
            fromDate: '',
            toDate: '',
            dONo: '',
            customerId: '',
            plant: '',
            orderNo: '',
            customerName: '',
            CustomerName: '',
            business_id: '',
            business_name: '',
            CustomerId: '',
            OrderNo: '',
            CustomerCode: '',
            Status: '',
            PremiumType: '',
            gstin: '',
            SalesRegion: '',

        })


       const dataObj = {
            idUser: authData?.data?.userId || authData?.data?.idUser,
            idBranch: plantId?.plantId,
            businessUnit: authData?.data?.businessUnit,
            regions: mappedRegions,
           offset: 0,
           pageNumber:1,
            limit: 15
        }
        dispatch(
            getCustomerListingRequest({
                page: 1,
                pageSize: 15,
                dataObj: dataObj,
            }),
        );
        setRefreshing(false);
        setResetTrigger(false);
    };
    const formatDates = (date) => {
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 0-indexed
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const getDates = () => {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);

        const todayFormatted = formatDates(today);
        const sixMonthsAgoFormatted = formatDates(sixMonthsAgo);

        return {
            todayDate: todayFormatted,
            sixMonthsAgo: sixMonthsAgoFormatted,
        };
    };

    const onEndReached = async () => {
        if (
            customerRegistrationListing?.status == STATE_STATUS.FETCHED &&
            customerRegistrationListing?.status != STATE_STATUS.FETCHING &&
            customerRegistrationListing?.currentPage < customerRegistrationListing?.totalPages
        ) {
            setResetFilter(false);
            const sessionData = await AsyncStorage.getItem('@get_session');
            const getPlantId = await AsyncStorage.getItem('@plantId');
            let jsonSessionData = JSON.parse(sessionData);
            let plantId = JSON.parse(getPlantId);
            const currentPage = customerRegistrationListing?.currentPage || 0;
            const dataObj = {
                idUser: authData?.data?.userId || authData?.data?.idUser,
                idBranch: plantId?.plantId,
                businessUnit: authData?.data?.businessUnit,
                regions: mappedRegions,
                offset: currentPage,
                pageNumber: customerRegistrationListing?.currentPage + 1,
                limit: 15,
                ...(filterData?.CustomerCode ? { plantCode: filterData?.CustomerCode } : {}),
                ...(filterData?.CustomerName ? { customerName: filterData?.CustomerName } : {}),
                ...(filterData?.PremiumType ? { premiumType: filterData?.PremiumType } : {}),
                ...(filterData?.gstin ? { gstin: filterData?.gstin } : {}),
                ...(
                    authData?.data?.businessUnit === 'Zinc'
                      ? (filterData?.Status ? { statusList: filterData.Status } : {})
                      : (filterData?.Status ? { status: filterData.Status } : {})
                  ),
            }
            dispatch(
                getCustomerListingRequest({
                    page: customerRegistrationListing?.currentPage + 1,
                    pageSize: 15,
                    dataObj,
                }),
            );
        }
    };
    const handleCustomerForm = async (id, idBranch) => {
        try {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        const currentPage = dispatchDetails?.currentPage || 0;
        const dataObj = {
            idCompany: id,
                offset: 1,
                limit: 10,
                userStatus: "ActiveInactive"
        }
          console.log("Hit customer form", id,);
          dispatch(
              getDetailsRequest({
              idBranch: idBranch
              })
          )
            dispatch(
                getAllByCompanyRequest({
                    idCompany: id
                }),
            );
            dispatch(getByCompanyRequest({
                page: 1,
                pageSize: 10,
                dataObj: dataObj,
            }));
            dispatch(
                userGetRequest({
                    idUser: authData?.data?.idUser || authData?.data?.userId
        }),
            );
            dispatch(
                companyGetRequest({
                    idCompany: id,
                    pageType: "po"
                }),
            );
        
            setComplaintId(id);
            setCanNavigate(true);
            // console.log("response see here", response);
        } catch (err) {
            console.log("Error", err);
        }
  }
    
    const renderItem = ({ item, index }) => {
        console.log("c r item", item);

        if (item?.result.length > 0) {
            const sortedCards = [...item.result].sort((a, b) => {
                let targetStatus = "";
            
                if (isRM) targetStatus = "Pending from RM";
                else if (isSnop) targetStatus = "Pending from SNOP";
                else if (isSBFM) targetStatus = "Pending from FINANCE";

                const aMatch = a.verification_status === targetStatus;
                const bMatch = b.verification_status === targetStatus;
            
                if (aMatch && !bMatch) return -1;
                if (!aMatch && bMatch) return 1;
                return 0;
            });
            
            return sortedCards?.map((cardItem, cardIndex) => {
                return (
                    <View style={styles.CardWrapper}>
                        <TouchableOpacity
                            onPress={() => handleCustomerForm(cardItem?.business_id, cardItem?.branchId)
                            }
                            style={styles.statusWrap}>
                            <View style={{ flexDirection: 'row', marginTop: 3 }}>
                                <Text selectable={true} style={[styles.boldTxt]} >Customer ID -</Text>
                                <Text
                                    selectable={true}
                                    selectionColor="#FF5733"
                                    style={[styles.boldTxt, { marginLeft: 3, color: '#0063A7' }]} >
                                    {cardItem?.business_id}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 3 }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        //  alignItems: 'center',
                                        //marginTop: 7,
                                    }}>
                                    {cardItem?.verification_status?.includes('Approved') ? (
                                        <View style={styles.Greendot}></View>
                                    ) : cardItem?.verification_status?.includes('Pending') ? (
                                        <View style={styles.bluedot}></View>
                                    ) : (
                                        <View style={styles.bluedot}></View>
                                    )}
                                    <Text selectable={true} selectionColor="#FF5733" style={[styles.boldTxt, { color: '#0063A7' ,paddingHorizontal: 5}]}>
                                        {cardItem?.verification_status ? `${cardItem?.verification_status}` : '-'}
                                    </Text>
                                </View>

                            </View>
                        </TouchableOpacity>
                        <View style={styles.row}>
                            <View style={[styles.col, {}]}>
                                <Text style={styles.boldTxt}>Customer Name</Text>
                                <Text style={styles.lightTxt}>
                                    <Text selectable={true} style={styles.lightTxt}>
                                        {cardItem?.business_name ? `${cardItem?.business_name}` : '-'}
                                    </Text>
                                </Text>
                            </View>
                            {authData?.data?.businessUnit == 'Aluminium' &&
                                <View style={[styles.col, {}]}>
                                    <Text style={styles.boldTxt}>Sales Org</Text>
                                    <Text selectable={true} selectionColor="#FF5733" style={[styles.boldTxt, { color: '#0063A7' }]}>
                                        {cardItem?.salesOrg ? `${cardItem?.salesOrg}` : '-'}
                                    </Text>
                                </View>}
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.boldTxt}>Group Code</Text>
                                <Text selectable={true} style={styles.lightTxt}>
                                    {authData?.data?.businessUnit === 'Aluminium' ? cardItem?.groupCode ? `${cardItem?.groupCode}` : '-' :
                                        authData?.data?.businessUnit === 'Zinc' ? cardItem?.customer_code ? `${cardItem?.customer_code}` : '-' :
                                            cardItem?.customer_code ? `${cardItem?.customer_code}` : '-'}
                                </Text>
                            </View>
                            <View style={[styles.col, {}]}>
                                <Text style={styles.boldTxt}>Email Id</Text>
                                <Text style={styles.lightTxt}>
                                    {' '}
                                    {cardItem?.email_id ? `${cardItem?.email_id}` : '-'}
                                </Text>
                            </View>
                            {/* {authData?.data?.businessUnit == 'Aluminium' &&
                                <View style={[styles.col, {   }]}>
                                    <Text style={styles.boldTxt}>Premium Type</Text>
                                    <Text selectable={true} selectionColor="#FF5733" style={[styles.boldTxt, { color: '#0063A7' }]}>
                                        {
                                            cardItem?.isPremiumCustomer === 0 ? "Non Premium" : "Premium"
                                        }
                                    </Text>
                                </View>} */}

                        </View>
                        <View style={styles.row}>
                            <View style={[styles.col]}>
                                <Text style={styles.boldTxt}>Phone No.</Text>
                                <Text style={styles.lightTxt}>
                                    {' '}
                                    {cardItem?.phoneNo ? `${cardItem?.phoneNo}` : '-'}
                                </Text>
                            </View>
                            <View style={[styles.col, {}]}>
                                <Text style={styles.boldTxt}>GSTN No.</Text>
                                <Text selectable={true} style={styles.lightTxt}>

                                    {cardItem?.gstn ? cardItem?.gstn : '-'}
                                </Text>
                            </View>


                        </View>
                        <View style={styles.row}>
                            <View style={[styles.col, {}]}>
                                <Text style={styles.boldTxt}>Created On</Text>
                                <Text style={styles.lightTxt}>
                                    {' '}
                                    {cardItem?.created_on ? convertedDated(cardItem?.created_on) : '-'}
                                </Text>
                            </View>

                        </View>
                        {/* <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.boldTxt}>Group Code</Text>
                                <Text selectable={true} style={styles.lightTxt}>
                                    {authData?.data?.businessUnit === 'Aluminium' ? cardItem?.groupCode ? `${cardItem?.groupCode}` : '-' :
                                        authData?.data?.businessUnit === 'Zinc' ? cardItem?.customer_code ? `${cardItem?.customer_code}` : '-' :
                                            cardItem?.customer_code ? `${cardItem?.customer_code}` : '-'}
                                </Text>
                            </View>
                            {authData?.data?.businessUnit == 'Aluminium' &&
                                <View style={[styles.col, {   }]}>
                                    <Text style={styles.boldTxt}>Premium Type</Text>
                                    <Text selectable={true} selectionColor="#FF5733" style={[styles.boldTxt, { color: '#0063A7' }]}>
                                        {
                                            cardItem?.isPremiumCustomer === 0 ? "Non Premium" : "Premium"
                                        }
                                    </Text>
                                </View>}
                            
                        </View>
                        <View style={styles.row}>
                        <View style={[styles.col]}>
                                <Text style={styles.boldTxt}>Email Id</Text>
                                <Text style={styles.lightTxt}>
                                    {' '}
                                    {cardItem?.email_id ? `${cardItem?.email_id}` : '-'}
                                </Text>
                            </View>
                            <View style={[styles.col, {   }]}>
                                <Text style={styles.boldTxt}>Phone No.</Text>
                                <Text selectable={true} style={styles.lightTxt}>
                                    {cardItem?.phoneNo ? `${cardItem?.phoneNo}` : '-'}
                                </Text>
                            </View>

                           
                        </View>
                        <View style={styles.row}>
                        <View style={[styles.col, {   }]}>
                                <Text style={styles.boldTxt}>GSTN No.</Text>
                                <Text style={styles.lightTxt}>
                                    {' '}
                                    {cardItem?.gstn ? cardItem?.gstn : '-'}
                                </Text>
                            </View>
                            <View style={[styles.col, {   }]}>
                                <Text style={styles.boldTxt}>Created On</Text>
                                <Text style={styles.lightTxt}>
                                    {' '}
                                    {cardItem?.created_on ? convertedDated(cardItem?.created_on) : '-'}
                                </Text>
                            </View>
                        </View> */}
                        <View style={styles.separator}></View>
                        {cardItem.approveAccess == true && cardItem?.verification_status != 'Approved' && !premiumStatuses.includes(cardItem?.verification_status) ?
                            <NextButton
                                button1={'Reject'}
                                button2={'Approve'}
                                fromEditProfile
                                firstButton={() => rejectModalOpen(cardItem?.business_id, cardItem?.branchId, cardItem?.email_id)}
                                secondButton={() => modalOpen(cardItem?.business_id, cardItem?.branchId)}
                                // disableButton2={isRemarksDisabled()}
                                button1Style={
                                    {
                                        borderWidth: 1,
                                        borderColor: '#363636',
                                        borderRadius: 4,
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 4,
                                        },
                                        shadowOpacity: 0.09,
                                        shadowRadius: 12,
                                        elevation: 5,
                                    }
                                }
                                button2Style={
                                    {
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 4,
                                        },
                                        shadowOpacity: 0.09,
                                        shadowRadius: 12,
                                        elevation: 5,
                                    }
                                }
                                enableButton
                            /> : null}
                        {premiumStatuses.includes(cardItem?.verification_status) && isSAG
                            //  cardItem.approveAccess == true && cardItem?.verification_status != 'Approved' && !premiumStatuses.includes(cardItem?.verification_status)
                            ?
                            <NextButton
                                button1={'Reject'}
                                button2={'Approve'}
                                fromEditProfile
                                // firstButton={handleReset}
                                // secondButton={handleApply}
                                // disableButton2={isCtaDisabled()}
                                button1Style={
                                    {
                                        borderWidth: 1,
                                        borderColor: '#363636',
                                        borderRadius: 4,
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 4,
                                        },
                                        shadowOpacity: 0.09,
                                        shadowRadius: 12,
                                        elevation: 5,

                                    }
                                }
                                button2Style={
                                    {
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 4,
                                        },
                                        shadowOpacity: 0.09,
                                        shadowRadius: 12,
                                        elevation: 5,

                                    }
                                }
                                enableButton
                            /> : null}
                        {selectedBusinessId === cardItem?.business_id && showApproveModal()}
                        {selectedBusinessId === cardItem?.business_id && showRejectModal()}

                        {/* {approveModal  && showApproveModal()} */}
                    </View>
                );
            });
        } else {
            return (
                <Text
                    style={{
                        textAlign: 'center',
                        padding: Dimension.padding50,
                        fontSize: Dimension.font22,
                        fontFamily: Dimension.CustomBlackFont,
                        color: '#c7c7c7',
                    }}>
                    NO DATA FOUND
                </Text>
            );
        }
    };

    return (
        <View style={styles.containerWrap}>
            {loader && <CustomLoader fullScreen />}
            <Header
                navigation={{
                    ...props?.navigation,
                    goBack: () => props?.navigation.pop(),
                }}
                showBack
                showText={'Registrations'}
                showLogout={
                    props?.route.params && props?.route.params.URL ? false : true
                }
                auth={auth}
                canGOBack={props?.route.name == 'WebView' ? false : true}

            />
            {getDetailsData.status === STATE_STATUS.FETCHING && (
                <CustomLoader fullScreen />)}
            <View style={styles.TopWrap}>
                <View style={[styles.SearchWraps]}>
                    <HeaderFilter
                        data={headerFilter}
                        props={props}
                        initialValues={filterData}
                        onApply={handleApplyFilters}
                        fromSupplier
                        onReset={handleApplyFilters}
                        fromDD={true}
                        resetTrigger={resetTrigger}
                    />
                </View>
                <View style={styles.separator}></View>

                <FlatList
                    data={customerRegistrationListing?.data}
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
                        return customerRegistrationListing?.status === STATE_STATUS.FETCHING ? (
                            <ActivityIndicator size={22} color={'#000'} />
                        ) : null;
                    }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    style={{
                        marginBottom: isCustomer ? 130 : 195,
                    }}
                />
            </View>
        </View>
    );
};
export default CustomerRegistrationScreen;
