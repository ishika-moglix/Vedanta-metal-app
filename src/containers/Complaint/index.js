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
import { getApprovedCustomerListRequest, getNfaCustomerListRequest } from '../../redux/feature/mouslice';
import { getVocListRequest, getvocListRequest, getUserByRolePMRequest, getCCHPProductVariantsRequest, getComplaintMailRequest, getFeedbackCategoryRequest, getFeedbackSubCategoryRequest, getShipmentRequest, getUserByRolePMSEZRequest, getUserByRoleRMSEZRequest, getUserByRoleRMRequest, getVocComplaintRequest } from '../../redux/feature/vocSlice';
// import { getNfaCustomerListRequest } from '../../redux/feature/mouslice';
const ComplaintScreen = props => {
    const dispatch = useDispatch();
    const authData = useSelector(state => state.auth);
    const branchAccessData = useSelector(state => state.data);
    const complaintById = useSelector(state => state.vocList?.complaintById)
    const vocListing = useSelector(
        state => state.vocList?.vocList,
    );
    const nfaCustomerList = useSelector(state => state.mouList?.nfaCustomerList?.data)
    const { data, status, isCustomer } = useSelector(state => state.branchAccess);
    //const navigation = useNavigation();
    const [showCreateNew, setShowCreateNew] = useState(true);
    const [isDisabled, setIsDisabled] = useState(true);
    const [userInfo, setUser] = useState();
    const [dataModal, setDataModal] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [auth, setAuth] = useState({});
    const [listing, setListing] = useState([]);
    const [closelisting, setClosedListing] = useState([]);
    const [searchlisting, setSearchListing] = useState([]);
    const [updatedDate, setUpdatedDate] = useState();
    const [search, setSearch] = useState('');
    const [searchType, setStype] = useState(false);
    const [resetTrigger, setResetTrigger] = useState(false);
    const [showRefreshModal, setShowRefreshModal] = useState(false);
    const [showType, setType] = useState('Complaint');
    const [refreshing, setRefreshing] = useState(false);
    // const [showFilter, setShowFilter] = useState(false);
    const [invoiceNo, setInvoiceNo] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [DoNo, setDoNo] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [userType, setUserType] = useState(false);
    const [customerList, setCustomerData] = useState([]);
    const [sapModal, setSapModal] = useState(false);
    const [isColor, setIsColor] = useState('Delivered');
    const [loader, setLoader] = useState(false);
    const [canNavigate, setCanNavigate] = useState(false)
    const [complaintId, setComplaintId] = useState('')
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
        CustomerCode: ''
    });
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
    useEffect(() => {
        if (canNavigate && complaintById.status === STATE_STATUS.FETCHED) {
            console.log("Complaint id is", complaintId);
            props.navigation?.push('VocForm', { id: complaintId });
        }
    }, [complaintById.status]);

    const filterdata = {
        buttons: [
            { label: 'Delivery Order No.', fieldName: 'dONo' },
            { label: 'Invoice Date Range', fieldName: 'invoiceDate' },
            { label: 'Invoice No.', fieldName: 'invoiceNo' },
            // {label: 'Payment No.', fieldName: 'paymentStatus'},
        ],
        fields: [
            {
                fieldName: 'invoiceNo',
                type: 'text',
                placeholder: 'Invoice No',
                value: invoiceNo,
                // keyboardType: 'numeric',

                onChangeText: text => setInvoiceNo(text),
            },
            {
                fieldName: 'dONo',
                type: 'text',
                placeholder: 'DO No',
                value: DoNo,
                onChangeText: text => setDoNo(text),
            },
            {
                fieldName: 'invoiceDate',
                type: 'date',
                placeholder: 'DD/MM/YYYY',
                value: invoiceDate,
                onChangeText: text => setInvoiceDate(text),
            },
            {
                fieldName: 'paymentStatus',
                type: 'radio',
                options: [
                    { label: 'Paid', value: 'paid' },
                    { label: 'Unpaid', value: 'unpaid' },
                ],
            },
        ],
    };
    const customerNameOptions = nfaCustomerList?.length > 0 ? nfaCustomerList?.map(item => ({
        value: item.business_name,
        label: item.business_name,
        id: item.business_id
    })) : [];
    const headerFilter = [
        {
            label: 'ComplaintNo',
            placeholder: 'Complaint No.',
            type: 'text',
            // options: [...customerNameOptions],
        },
        {
            label: 'CustomerCode',
            placeholder: 'Customer Code',
            type: 'text',
        },
        {
            label: 'CustomerName',
            placeholder: 'Customer Name',
            type: 'options',
            options:[...customerNameOptions].sort((a, b) => {
                const labelA = a?.label || '';
                const labelB = b?.label || '';
                return  labelA.localeCompare(labelB);
              }),
        },
        (authData?.data?.businessUnit === 'Aluminium' && {
            label: 'Company',
            placeholder: 'Company',
            type: 'options',
            options: [
                { value: 'BALC', label: 'BALC' },
                { value: 'VALC', label: 'VALC' },
            ],
        }),
        {
            label: 'Type',
            placeholder: 'Type',
            type: 'options',
            options: [
                { value: 'Complaint', label: 'Complaint' },
                { value: 'Feedback', label: 'Feedback' },
                ...(authData?.data?.businessUnit === 'Aluminium'
                    ? [{ value: 'Product Development', label: 'Product Development' }]
                    : []),
            ],
        },
        {
            label: 'Date',
            type: 'date',
            placeholder: 'Date',
        },
    ];

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

    const handleReset = () => {
        setSapData({
            fromDate: '',
            toDate: '',
            plant: '',
        });
        closeSapReport();
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
                setListing(data.data.feedbackList);
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
                setClosedListing(data.data.feedbackList);
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

    const Logout = async () => {
        // authData?.data?.setIsLoggedIn(false);
        await AsyncStorage.clear();
        await AsyncStorage.setItem('@first_login_after_logout', 'true');
        await AsyncStorage.removeItem('@plantCode');
        await AsyncStorage.removeItem('@plantId')
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

    const toggleDataModal = item => {
        setSelectedData(item);
        setDataModal(!dataModal);
    };

    const openFilterComp = () => {
        //console.log('filter hit');
        setShowFilter(true);
    };

    const closeFilterComp = () => {
        //console.log('filter hit');
        setShowFilter(false);
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

    // const { todayDate, sixMonthsAgo } = getDates();
    console.log('Today:', getDates().todayDate);
    console.log('6 Months Ago:', getDates().sixMonthsAgo);

    // console.log(getDateSixMonthsAgo());

    const handleApplyFilters = async data => {
        console.log('filter data', data);
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        const now = new Date();
        const sixMonthsAgo = new Date();
        const dataObj = {
            ...(data?.ComplaintNo? { complaintNo: data?.ComplaintNo }: {}),
            ...(data?.fromDate ? { startTimeMillis: convertDateToTimestamp(data?.fromDate) || sixMonthsAgo.setMonth(now.getMonth() - 1) } : {}),
            ...(data?.toDate ? { endTimeMillis: convertDateToTimestamp(data?.toDate) || now.getTime() } : {}),
            ...(data?.CustomerCode ? { code: data?.CustomerCode } : {}),
            ...(data?.CustomerName ? { customerPlantName: data?.CustomerName } : {}),
            ...(data?.Company ? { salesOrg: data?.Company }:{}),
            ...(data?.Type ? { complaintType: data?.Type } : {}),
            ...(data?.fromDate ? { datePicker: data?.fromDate - data?.toDate } : {}),
            // datePicker: data?.fromDate - data?.toDate || `${getDates().sixMonthsAgo} - ${getDates().todayDate}`,
            pageNumber: 1,
            offset: 0,
            limit: 15,
            businessUnit: authData?.data?.businessUnit,
            user: "Supplier"
        }
        dispatch(
            getVocListRequest({
                page:  1,
                pageSize: 10,
                dataObj,
            }),
        );
        setFilterData(data);
        setShowFilter(false);
    };
    const showFilterModal = () => {
        return (
            <Modal
                visible={showFilter}
                animationType="slide"
                transparent={true}
                onRequestClose={closeFilterComp}>
                <View
                    style={[
                        styles.modalOverlay,
                        {
                            flex: 1,
                            justifyContent: 'flex-end',
                            backgroundColor: '#fff',
                        },
                    ]}>
                    <Filter
                        props={props}
                        data={filterdata}
                        fromListing={true}
                        onClose={() => setShowFilter(false)}
                        initialValues={filterData}
                        onApply={handleApplyFilters}
                    />
                    {/* <NextButton
            button1={'Reset'}
            button2={'Apply'}
            fromEditProfile
            // firstButton={handleBackStep}
            // secondButton={handleNextStep}
            // disableButton2={!onSave}
            enableButton
          /> */}
                </View>
            </Modal>
        );
    };
    const searchComp = () => {
        if (search.length > 0) {
            ScannerService.SearchList(auth, search.toUpperCase())
                .then(data => {
                    if (data.success) {
                        setSearchListing(data.data.feedbackList);
                        setStype(true);
                    }
                })
                .catch(e => {
                    //console.log(e);
                });
        }
    };

    const openCustomer = () => {
        //email=s.swetha@vedanta.co.in&pwd=dontKnow&BU=Aluminium
        let navURL =
            CONSTANTS.WEBURL.CUSTOMER +
            'email=' +
            's.swetha@vedanta.co.in' +
            '&pwd=' +
            '=dontKnow' +
            '&BU=Aluminium';
        props?.navigation.navigate('WebView', { URL: navURL });
    };

    const fetchData = async () => {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        const now = new Date();
        const sixMonthsAgo = new Date();

        const currentPage = dispatchDetails?.currentPage || 0;
        const vocObj = {
            startTimeMillis: sixMonthsAgo.setMonth(now.getMonth() - 6),
            endTimeMillis: now.getTime(),
            offset: 0,
            limit: 15,
            businessUnit: authData?.data?.businessUnit,
            user: 'Supplier'
        }
        dispatch(
            getNfaCustomerListRequest({
                businessUnit: authData?.data?.businessUnit
            })
        )
        dispatch(
            getVocListRequest({
                page: 1,
                pageSize: 10,
                dataObj: vocObj,
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

    const getRegionByPlants = async () => {
        try {
            const data = ScannerService.regionByPlants();
            if (data?.success) {
                setRegionByPlants(data?.data);
            }
            //console.log('Region by plants data is :', data);
        } catch (err) {
            //console.log('ERROR:', err);
        }
    };

    const getCustomerList = async () => {
        try {
            const dataObj = { businessUnit: authData?.data?.businessUnit };
            const data = await ScannerService.customerList(dataObj);
            //  const groupCode = data?.data?.data.find((element) => element.business_name ==  ).business_id;
            setCustomerData(data?.data?.data);
            //console.log('Customer List data is :', data);
        } catch (err) {
            //console.log('ERROR:', err);
        }
    };
    const formattedDate = dob => {
        const [day, month, year] = dob.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const handleVocForm = async (id, selectedProduct, feedbackCategoryId, dispatchCompany, dispatchCompanyId) => {
        try {
            console.log("Hit voc form......", id, selectedProduct, feedbackCategoryId, dispatchCompany, dispatchCompanyId);
            dispatch(
                getApprovedCustomerListRequest({
                    businessUnit: authData?.data?.businessUnit,
                }),
            );
            dispatch(getVocComplaintRequest({ id }));
            dispatch(
                getCCHPProductVariantsRequest({
                    businessUnit: authData?.data?.businessUnit,
                }),
            );
            dispatch(
                getFeedbackCategoryRequest({
                    businessUnit: authData?.data?.businessUnit,
                    role: branchAccessData?.isCustomer ? 'customer' : 'supplier'
                }),
            );
            // dispatch(
            //     getFeedbackSubCategoryRequest({
            //         businessUnit: authData?.data?.businessUnit,
            //         categoryId: feedbackCategoryId
            //     }),
            // );
            dispatch(
                getFeedbackSubCategoryRequest({
                    feedbackCategoryId: feedbackCategoryId,
                    businessUnit: authData?.data?.businessUnit,
                    ...(authData?.data?.businessUnit === "Aluminium" && { productVariant: selectedProduct })
                }),
            );
        
            dispatch(
                getUserByRolePMRequest(),
            );
            dispatch(
                getUserByRoleRMRequest(),
            );
            dispatch(
                getUserByRolePMSEZRequest(),
            );
            dispatch(
                getUserByRoleRMSEZRequest(),
            );
            dispatch(
                getComplaintMailRequest({ dispatchCompanyId }),
            );

            dispatch(
                getShipmentRequest({
                    salesOrg: dispatchCompany === 'BALC' ? 1 : 9093,
                    businessUnit: authData?.data?.businessUnit,
                }),
            );
            setComplaintId(id);
            setCanNavigate(true);
            // console.log("response see here", response);
        } catch (err) {
            console.log("Error", err);
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        setResetTrigger(true);
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
            CustomerCode: ''
        })
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        const now = new Date();
        const sixMonthsAgo = new Date();
        const dataObj = {
            "startTimeMillis": sixMonthsAgo.setMonth(now.getMonth() - 6),
            "endTimeMillis": now.getTime(),
            "limit": 15,
            "businessUnit": authData?.data?.businessUnit,
            "user": "Supplier",
            "offset": 0
        }
        dispatch(
            getVocListRequest({ page: 1, pageSize: 10, dataObj }),
        );
        setResetTrigger(false);
        setRefreshing(false);
    };

    const onEndReached = async () => {
        if (
            vocListing?.status == STATE_STATUS.FETCHED &&
            vocListing?.status != STATE_STATUS.FETCHING &&
            vocListing?.currentPage < vocListing?.totalPages
        ) {
            const sessionData = await AsyncStorage.getItem('@get_session');
            const getPlantId = await AsyncStorage.getItem('@plantId');
            let jsonSessionData = JSON.parse(sessionData);
            let plantId = JSON.parse(getPlantId);
            const currentPage = vocListing?.currentPage || 0;
            const now = new Date();
            const sixMonthsAgo = new Date();
            const dataObj = {
                complaintNo: filterData?.ComplaintNo,
                startTimeMillis: convertDateToTimestamp(filterData?.fromDate) || sixMonthsAgo.setMonth(now.getMonth() - 6),
                endTimeMillis: convertDateToTimestamp(filterData?.toDate) || now.getTime(),
                code: filterData?.CustomerCode,
                customerPlantName: filterData?.CustomerName,
                salesOrg: filterData?.Company,
                complaintType: filterData?.Type,
                datePicker: filterData?.fromDate - filterData?.toDate || `${getDates().sixMonthsAgo} - ${getDates().todayDate}`,
                pageNumber: 1,
                offset: 0,
                limit: 15,
                businessUnit: authData?.data?.businessUnit,
                user: "Supplier"
            }
            dispatch(
                getVocListRequest({
                    page: vocListing?.currentPage + 1,
                    pageSize: 10,
                    dataObj,
                }),
            );
        }
    };

    const handleExportData = async () => {
        try {
            setLoader(true)
            const businessUnit = authData?.data?.businessUnit;
            const data = await ScannerService.exportData(requestPayload, businessUnit);
            if (data?.data?.success) {
                setLoader(false)
                await getRealUrl(data?.data?.data?.url, 'Export_Data');
            }
        } catch (err) {
            setLoader(false)
        }
    };

    const handleSearch = async () => {
        try {
            const sessionData = await AsyncStorage.getItem('@get_session');
            const getPlantId = await AsyncStorage.getItem('@plantId');
            let jsonSessionData = JSON.parse(sessionData);
            let plantId = JSON.parse(getPlantId);
            const searchArray = search.split(',').map(item => item.trim());
            //console.log("search array", searchArray);

            const orderIds = searchArray
                .filter(item => item.startsWith('DEL'))
                .map(item => `${item}`);
            const invoiceNos = searchArray.filter(item => !item.startsWith('DEL')).map(item => `${item}`);;
            // const invoiceNos = searchArray
            //   .filter(item => item.startsWith('F'))
            //   .map(item => `${item}`);
            //console.log(orderIds.length, invoiceNos.length);

            const orderIdsString =
                orderIds.length > 0 ? `${orderIds.join(', ')}` : '';
            const invoiceNosString =
                invoiceNos.length > 0 ? `${invoiceNos.join(', ')}` : '';
            //console.log("search.", orderIdsString, invoiceNosString);

            const requestedPayload = {
                query: {
                    bool: {
                        must: [
                            ...(isCustomer
                                ? [
                                    {
                                        terms: {
                                            buyerId: [plantId?.plantId],
                                        },
                                    },
                                ]
                                : regionByPlantData.length > 0
                                    ? [
                                        {
                                            terms: {
                                                buyerId: [plantId?.plantId],
                                            },
                                        },
                                    ]
                                    : [
                                        // {
                                        //   terms: {
                                        //     buyerId: [1],
                                        //   },
                                        // },
                                    ]),
                            orderIdsString.length > 0
                                ? {
                                    match: {
                                        orderId: orderIdsString,
                                    },
                                }
                                : null,
                            invoiceNosString.length > 0
                                ? {
                                    match: {
                                        invoiceNo: invoiceNosString,
                                    },
                                }
                                : null,
                            {
                                match: {
                                    businessUnit: authData?.data?.businessUnit,
                                },
                            },

                            ...(
                                !isCustomer &&
                                    authData?.data?.businessUnit === 'Aluminium' &&
                                    branchAccessData?.branchModules?.supplierType === 'Rolled'
                                    ? {
                                        match: {
                                            productType: 'Rolled',
                                        },
                                    } : []
                            )
                        ].filter(Boolean),

                        must_not: [
                            {
                                range: {
                                    creationDate: {
                                        lte: 1625134077000,
                                    },
                                },
                            },
                            ...(!isCustomer &&
                                authData?.data?.businessUnit === 'Aluminium' &&
                                branchAccessData?.branchModules?.supplierType === 'Primary'
                                ? [
                                    {
                                        match: {
                                            productType: 'Rolled',
                                        },
                                    },
                                ]
                                : []),
                        ].filter(Boolean),
                    },
                },
                sort: [
                    {
                        documentDate: {
                            order: 'desc',
                        },
                    },
                    {
                        invoiceNo: {
                            order: 'desc',
                        },
                    },
                ],
                aggs: {
                    statuses: {
                        terms: {
                            field: 'status',
                            size: 20,
                        },
                    },
                },
            };

            dispatch(
                getDispatchDetailsRequest({
                    page: 1,
                    pageSize: 10,
                    requestedPayload,
                }),
            );

            setRequestedPayload(requestedPayload);
        } catch (error) {
            //console.log('Error', error);
        }
    };

    const generatePDFUrl = (
        type,
        agreementId,
        vendorName,
        invoiceNo,
        financialYear,
    ) => {
        let url = '';
        const checkIsNull = (value, errorMessage) => {
            if (!value) {
                console.warn(errorMessage);
                return true;
            }
            return false;
        };

        switch (type) {
            case 'Aluminium': {
                if (checkIsNull(agreementId, 'Agreement ID is Not Present')) return;
                if (checkIsNull(vendorName, 'Vendor Name is Not Present')) return;

                if (agreementId && vendorName) {
                    const venName = vendorName.includes('VAL') ? 'VALC' : 'BALC';
                    url = `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.PDF_URL.AUTH_URL_ALUMINIUM_INVOICEPDF}${agreementId}_${venName}_TC.pdf`;
                }
                break;
            }

            case 'Copper': {
                if (checkIsNull(invoiceNo, 'Invoice Number is Not Present')) return;
                url = `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.AUTH_URL_COPPER_TCPDF}${invoiceNo}_${financialYear}_SC_TC.PDF`;
                break;
            }

            case 'Zinc': {
                if (checkIsNull(invoiceNo, 'Invoice Number is Not Present')) return;
                if (checkIsNull(financialYear, 'Financial Year is Not Present')) return;
                url = `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.AUTH_URL_HZL_TCPDF}${invoiceNo}_${financialYear}_HZL_TC.PDF`;
                break;
            }

            default: {
                console.warn('Invalid Type Provided');
                break;
            }
        }

        if (url) {
            //console.log('Generated PDF URL:', url);
            return url;
        } else {
            console.warn('No URL generated.');
        }
    };

    const isValAlTracking = (link, name) => {
        let transporters = ['Orissa Bengal', 'Supreme', 'SUPREME', 'Delhivery'];
        if (!!link && (link == 'Prepaid' || link == 'Pre Paid')) {
            return true;
        } else if (
            !!link &&
            link === 'To Pay' &&
            transporters.some(transporter => name.includes(transporter))
        ) {
            return true;
        } else {
            return false;
        }
    };
    const getColor = status => {
        switch (status) {
            case 'Delivered':
                return 'green';
            case 'In Transit':
                return '#EB9238';
            default:
                return '#666';
        }
    };

    const handleTrackingLink = (businessUnit, vendorId, cardItem) => {
        const invoiceNo = cardItem?._source?.invoiceNo;
        const link = cardItem?._source?.link;
        const trackingType = cardItem?._source?.trackingType;
        const status = cardItem?._source?.status;
        const fromPlantName = cardItem?._source?.fromPlantName;
        const transporterName = cardItem?._source?.transporterName;
        console.log("vendorId", vendorId);

        switch (businessUnit) {
            case 'Aluminium':
                if (vendorId === 'VAL') {
                    openAlLiveTracking(invoiceNo, link, transporterName);
                } else if (vendorId === 'BALCO') {
                    openLiveTrackingLink(status, invoiceNo);
                } else {
                    Toast.show({
                        type: 'error',
                        text2: 'No tracking available for this Invoice',
                        visibilityTime: 4000,
                        autoHide: true,
                    });
                }
                break;

            case 'Zinc':
                openTrackingLink(invoiceNo, link, trackingType);
                break;

            case 'Copper':
                openLiveTrackingLinkCopper(fromPlantName, status, invoiceNo, link);
                break;

            default:
                Toast.show({
                    type: 'error',
                    text2: 'No tracking available for this Invoice',
                    visibilityTime: 4000,
                    autoHide: true,
                });
                break;
        }
    };

    const openAlLiveTracking = async (invoiceNo, link, name) => {
        console.log('see this', invoiceNo, link, name);

        try {
            let jsonValue = await AsyncStorage.getItem('@user_info');
            const info = jsonValue != null ? JSON.parse(jsonValue) : null;
            if (authData?.data?.businessUnit == 'Aluminium') {
                if (invoiceNo == '' || invoiceNo == undefined) {
                    Toast.show({
                        type: 'error',
                        text2: 'Invoice number not found',
                        visibilityTime: 4000,
                        autoHide: true,
                    });

                    return false;
                }
                if (AlLiveTrackingLink == '' || AlLiveTrackingLink == undefined) {
                    Toast.show({
                        type: 'error',
                        text2: 'No tracking has been generated for this Invoice',
                        visibilityTime: 4000,
                        autoHide: true,
                    });

                    return false;
                }
                if (isValAlTracking(link, name) == false) {
                    Toast.show({
                        type: 'error',
                        text2: 'No GPS tracking for this transporter',
                        visibilityTime: 4000,
                        autoHide: true,
                    });
                    return false;
                }
                let url = `${AlLiveTrackingLink}${invoiceNo}&token=${info.token}`;
                //console.log('url is ', url);

                const canOpen = await Linking.canOpenURL(url);
                if (canOpen) {
                    await Linking.openURL(url);
                    //console.log('Link open successfully');
                    return true;
                }
            }
        } catch (error) {
            console.error('Failed to open link', error);
        }
    };

    const openLiveTrackingLink = async (status, invoiceNo) => {
        try {

            const jsonValue = await AsyncStorage.getItem('@user_info');
            if (jsonValue) {
                let info = JSON.parse(jsonValue);
                if (status === 'In Transit' || status === 'Delivered') {
                    const trackingUrl = `https://vedantametalbazaar.moglix.com/#/pages/inv/liveTracking?invoiceNo=${invoiceNo}&token=${info.token}`;
                    //console.log('tracking url', trackingUrl);

                    const canOpen = await Linking.canOpenURL(trackingUrl);
                    if (canOpen) {
                        await Linking.openURL(trackingUrl);
                        //console.log('Link open successfully');
                        return true;
                    } else {
                        Toast.show({
                            type: 'error',
                            text2: 'No tracking has been generated for this Invoice',
                            visibilityTime: 4000,
                            autoHide: true,
                        });
                    }
                }
            }
        } catch (error) {
            //console.log('Error', error);
        }
    };

    const openTrackingLink = async (invoiceNo, link, trackingType) => {
        //console.log('invoice num ', invoiceNo, trackingType);
        //console.log('link ', link);

        if (authData?.data?.businessUnit === 'Zinc') {
            if (link !== undefined && link !== '') {
                const canOpen = await Linking.canOpenURL(link);
                if (canOpen) {
                    await Linking.openURL(link).catch(err =>
                        console.error('Failed to open link', err),
                    );
                } else {
                    Toast.show({
                        type: 'error',
                        text2: 'Unable to open the tracking link',
                        visibilityTime: 4000,
                        autoHide: true,
                    });
                }
                return;
            }
            if (
                (link === undefined || link === '') &&
                (trackingType === '' || trackingType === undefined)
            ) {
                Toast.show({
                    type: 'error',
                    text2: 'Kindly choose one of the tracking modes to show results',
                    visibilityTime: 4000,
                    autoHide: true,
                });
            } else if (
                trackingType === 'gps' &&
                (link === undefined || link === '')
            ) {
                Toast.show({
                    type: 'error',
                    text2:
                        'The submitted request for GPS tracking is being worked upon and details will be available shortly',
                    visibilityTime: 4000,
                    autoHide: true,
                });
            } else if (
                trackingType === 'sim' &&
                (link === undefined || link === '')
            ) {
                Toast.show({
                    type: 'error',
                    text2:
                        'The submitted request for Mobile/SIM tracking has been sent to the driver and we await consent to show results',
                    visibilityTime: 4000,
                    autoHide: true,
                });
            }
        } else {
            if (link !== undefined && link !== '') {
                const canOpen = await Linking.canOpenURL(link);
                if (canOpen) {
                    await Linking.openURL(link).catch(err =>
                        console.error('Failed to open link', err),
                    );
                } else {
                    Toast.show({
                        type: 'error',
                        text2: 'Unable to open the tracking link',
                        visibilityTime: 4000,
                        autoHide: true,
                    });
                }
                return;
            }
            Toast.show({
                type: 'error',
                text2: 'No tracking has been generated for this Invoice',
                visibilityTime: 4000,
                autoHide: true,
            });
        }
    };

    const openLiveTrackingLinkCopper = async (
        fromPlantName,
        status,
        invoiceNo,
        link,
    ) => {
        if (status === 'In Transit' || status === 'Delivered') {
            let finalLink = '';
            if (link !== '' && fromPlantName !== '1200') {
                finalLink = link;
            } else if (fromPlantName === '1200') {
                finalLink = `${LIVE_TRACKING_LINK_COPPER}00${invoiceNo}`;
            }

            if (finalLink !== '') {
                const canOpen = await Linking.canOpenURL(finalLink);
                if (canOpen) {
                    await Linking.openURL(finalLink).catch(err =>
                        console.error('Failed to open link', err),
                    );
                } else {
                    Toast.show({
                        type: 'error',
                        text2: 'Unable to open the tracking link',
                        visibilityTime: 4000,
                        autoHide: true,
                    });
                }
            }
            return;
        }
        Toast.show({
            type: 'error',
            text2: 'No tracking has been generated for this Invoice',
            visibilityTime: 4000,
            autoHide: true,
        });
    };

    const renderItem = ({ item, index }) => {
        if (item?.feedbackList?.length > 0) {
            return item?.feedbackList?.map((cardItem, cardIndex) => {
                return (
                    <View style={styles.CardWrapper}>
                        <TouchableOpacity
                            onPress={() => handleVocForm(cardItem?.id, cardItem?.productName, cardItem?.feedbackCategoryId, cardItem?.dispatchCompany, cardItem?.dispatchCompanyId)}
                            style={styles.statusWrap}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    //  alignItems: 'center',
                                    //marginTop: 7,

                                }}>
                                {cardItem?.supplierStatus?.includes('Closed') ? (
                                    <View style={styles.Greendot}></View>
                                ) : cardItem?.supplierStatus?.includes('Pending') ? (
                                    <View style={styles.Reddot}></View>
                                ) : (
                                    <View style={styles.bluedot}></View>
                                )}

                                <Text style={[styles.boldTxt, { alignSelf: 'center', marginTop: 3 }]}>{'   '}{cardItem?.supplierStatus?.toUpperCase()}</Text>
                            </View>
                            <MaterialCommunityIcon
                                name={'chevron-right'}
                                color={'#000'}
                                size={20}
                                style={{ alignSelf: 'center' }}
                            />
                        </TouchableOpacity>
                        <View style={styles.row}>
                            <TouchableOpacity style={styles.col}
                                onPress={() => handleVocForm(cardItem?.id, cardItem?.productName, cardItem?.feedbackCategoryId, cardItem?.dispatchCompany, cardItem?.dispatchCompanyId)} >
                                <Text style={styles.boldTxt}>Complaint no.</Text>
                                <Text selectable={true} selectionColor="#FF5733" style={[styles.boldTxt, { color: '#0063A7' }]}>
                                    {cardItem?.id}
                                </Text>
                            </TouchableOpacity>

                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={styles.boldTxt}>Customer Name</Text>
                                <Text style={styles.lightTxt}>
                                    <Text selectable={true} style={styles.lightTxt}>
                                        {cardItem?.customerPlantName}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.boldTxt}>Customer Code</Text>
                                <Text selectable={true} style={styles.lightTxt}>
                                    {cardItem?.code}
                                </Text>
                            </View>

                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={styles.boldTxt}>Product</Text>
                                <Text style={styles.lightTxt}>
                                    {' '}
                                    {cardItem?.productName}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.boldTxt}>Complaint Qty.(MT)</Text>
                                <Text selectable={true} style={styles.lightTxt}>
                                    {cardItem?.quantity ? `${cardItem?.quantity} MT` : '-'}
                                </Text>
                            </View>

                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={styles.boldTxt}>Complaint Date</Text>
                                <Text style={styles.lightTxt}>
                                    {' '}
                                    {cardItem?.createdOn ? convertedDated(cardItem?.createdOn) : '-'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.boldTxt}>Type</Text>
                                <Text style={styles.lightTxt}>
                                    {cardItem?.complaintType ? cardItem?.complaintType : '-'}
                                </Text>
                            </View>

                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={styles.boldTxt}>Ageing</Text>
                                <Text style={styles.lightTxt}>
                                    {cardItem?.ageing ? cardItem?.ageing : '-'}
                                </Text>

                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.boldTxt}>Closing Date</Text>
                                <Text style={styles.lightTxt}>
                                    {cardItem?.closingDate ? convertedDated(cardItem?.closingDate) : '-'}
                                </Text>
                            </View>
                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={styles.boldTxt}>Closure Days</Text>
                                <Text style={styles.lightTxt}>
                                    {cardItem?.closingDays ? cardItem?.closingDays : '-'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.boldTxt}>Company</Text>
                                <Text style={styles.lightTxt}>
                                    {cardItem?.dispatchCompany ? cardItem?.dispatchCompany : '-'}
                                </Text>
                            </View>
                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={styles.boldTxt}>Nature</Text>
                                <Text style={styles.lightTxt}>
                                    {cardItem?.feedbackCategory ? cardItem?.feedbackCategory : '-'}

                                </Text>
                            </View>
                        </View>
                        <View style={[styles.row]}>
                            <View style={styles.col}>
                                <Text style={styles.boldTxt}>Subnature</Text>
                                <Text style={styles.lightTxt}>
                                    {cardItem?.feedbackSubcategory ? cardItem?.feedbackSubcategory : '-'}
                                </Text>
                            </View>
                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={styles.boldTxt}>Complaint Mail</Text>
                                <Text style={styles.lightTxt}>
                                    {cardItem?.complaintMail ? cardItem?.complaintMail : '-'}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.row, { paddingBottom: Dimension.padding15 }]}>
                            <View style={styles.col}>
                                <Text style={styles.boldTxt}>FIR Action days</Text>
                                <Text style={styles.lightTxt}>
                                    {cardItem?.firActionDays}
                                </Text>
                            </View>
                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={styles.boldTxt}>FIR Date</Text>
                                <Text style={styles.lightTxt}>
                                    {cardItem?.firDate ? convertedDated(cardItem?.firDate) : '-'}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.row, { paddingBottom: Dimension.padding15 }]}>
                            <View style={styles.col}>
                                <Text style={styles.boldTxt}>QCIR Actiondays</Text>
                                <Text style={styles.lightTxt}>
                                    {' '}
                                    {cardItem?.qcirActionDays }
                                </Text>
                            </View>
                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={styles.boldTxt}>QCIR Date</Text>
                                <Text style={styles.lightTxt}>
                                    {cardItem?.qcirDate ? convertedDated(cardItem?.qcirDate) : '-'}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.row, { paddingBottom: Dimension.padding15 }]}>
                            <View style={styles.col}>
                                <Text style={styles.boldTxt}>FCIR Actiondays</Text>
                                <Text style={styles.lightTxt}>
                                    { cardItem?.fcirActionDays }
                                </Text>
                            </View>
                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={styles.boldTxt}>FCIR Date</Text>
                                <Text style={styles.lightTxt}>
                                    {cardItem?.fcirDate ? convertedDated(cardItem?.fcirDate) : '-'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.statusWrap}></View>

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
            <Header
                navigation={{
                    ...props?.navigation,
                    goBack: () => props?.navigation.pop(),
                }}
                showBack
                showText={'Complaint List'}
                showLogout={
                    props?.route.params && props?.route.params.URL ? false : true
                }
                auth={auth}
                canGOBack={props?.route.name == 'WebView' ? false : true}

            />
            {complaintById.status === STATE_STATUS.FETCHING && (
                <CustomLoader fullScreen />)}
            <View style={styles.TopWrap}>
                {/*  {!isCustomer ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: Dimension.margin15,
              paddingHorizontal: Dimension.padding15,
            }}>
            <>
              <TouchableOpacity
                style={styles.ExportBTn}
                onPress={openSapReport}>
                <AntDesign name={'download'} size={20} color={'#0065AC'} />
                <Text style={styles.exportTxt}>SAP Data</Text>
              </TouchableOpacity>

              {sapModal && showSAPReportModal()}

              <TouchableOpacity
                style={styles.ExportBTn}
                onPress={handleExportData}>
                <AntDesign name={'download'} size={20} color={'#0065AC'} />
                <Text style={styles.exportTxt}>Export Data</Text>
              </TouchableOpacity>
              {/* <Modal
                visible={sapModal}
                animationType="slide"
                transparent={true}
                onRequestClose={showSAPReportModal}>
                <View style={styles.modal Overlay2}>
                  <View style={styles.modalContent}>
                    <View style={[styles.row]}>
                      <Text style={styles.modalTitle}>Credit Balance</Text>
                      <TouchableOpacity onPress={openSapReport}>
                        <AntDesign name="close" size={18} color="#363636" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.separator} />
                  </View>
                </View>
              </Modal> */}
                {/* </>
          </View>
        ) : ( */}
                {/* <View
            style={{
              alignItems: 'flex-end',
              marginTop: Dimension.margin15,
            }}>
            <TouchableOpacity onPress={handleRefresh}>
              <View style={[styles.row, { flex: 0 }]}>
                <MaterialCommunityIcon
                  name={'reload'}
                  color={'#439525'}
                  size={16}
                  style={{ alignSelf: 'center' }}
                />
                <Text style={styles.refresh}>Refresh </Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.update}>
              Last updated:{' '}{updatedDate ? convertDate(updatedDate) : 'Loading...'}
            </Text>
          </View> */}
                {/* )} */}
                {isCustomer ? (
                    <>
                        <View style={styles.SearchWrap}>
                            <TouchableOpacity
                                onPress={handleSearch}
                                style={styles.searchIcon}>
                                <Image
                                    source={require('../../assets/images/icon_search2.png')}
                                    style={styles.image}
                                />
                            </TouchableOpacity>
                            <TextInput
                                placeholder="Search by Order No. or Invoice No"
                                value={search}
                                autoCapitalize={'characters'}
                                onChangeText={search => setSearch(search)}
                                style={styles.searchBar}
                                editable={searchType ? false : true}
                                placeholderTextColor="#c7c7c7"
                            />

                            <TouchableOpacity
                                onPress={openFilterComp}
                                style={styles.searchbtn}>
                                <Image
                                    source={require('../../assets/images/icon_filter.png')}
                                    style={styles.image}
                                />
                            </TouchableOpacity>
                            {showFilter && showFilterModal()}
                        </View>
                    </>
                ) : (
                    <>
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
                    </>
                )}

                <FlatList
                    data={vocListing?.data}
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
                        return vocListing?.status === STATE_STATUS.FETCHING ? (
                            <ActivityIndicator size={22} color={'#000'} />
                        ) : null;
                    }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    style={{
                        marginBottom: isCustomer ? 130 : 195,
                        // paddingTop: Dimension.margin8,
                    }}
                />
                {/* {showRefreshModal && showRefresh()} */}

                {/* )}  */}
            </View>
        </View>
    );
};
export default ComplaintScreen;


/*
 const titleMap = {
        contractNFAPending: 'Contract NFA',
        pendingNFA: 'Others NFA',
        pendingDraftMOU: 'Draft Contract',
        pendingCustomer: 'Customer Registration / Modification',
        pendingPriceBooking: 'PO Approval',
        pendingDO: 'DO Approval',
        pendingSpotDO: 'Spot DO Approval',
        openVOC: 'Voice of Customer',
      };

    
      const formattedData = pendingTasksStatus === STATE_STATUS?.FETCHED
      ? Object.entries(pendingTasksData?.[0]).map(([title, value]) => ({
          title: titleMap[title] || title,
          data: value?.data || [],
        }))
      : [];
   const renderItem = ({ item }) => {
        return (
            <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <Text style={[styles.boldTxt, { fontSize: 16 }]}>
                        {item.title} ({item.data?.length || 0})
                    </Text>
                </View>
    
                {item.data?.length > 0 ? (
                    item.data.map((cardItem, index) => (
                        <View key={`${cardItem.id || index}`} style={styles.CardWrapper}>
                            // {/* Card Header */
        //                     <View style={styles.cardHeader}>
        //                         <Text style={[styles.boldTxt, { fontSize: 14 }]}>
        //                             {cardItem?.cardTitle || 'Approval Pending NFA'}
        //                         </Text>
        //                         <TouchableOpacity style={styles.actButton}>
        //                             <Text style={styles.actButtonText}>Act</Text>
        //                         </TouchableOpacity>
        //                     </View>
    
        //                     {/* Contract No. & Customer Group */}
        //                     <View style={styles.row}>
        //                         {cardItem?.id && (
        //                             <View style={styles.col}>
        //                                 <Text style={styles.label}>Contract No.</Text>
        //                                 <Text style={styles.value}>{cardItem?.id}</Text>
        //                             </View>
        //                         )}
    
        //                         {cardItem?.companyName && (
        //                             <View style={styles.col}>
        //                                 <Text style={styles.label}>Customer Group</Text>
        //                                 <Text style={styles.value}>{cardItem?.companyName}</Text>
        //                             </View>
        //                         )}
        //                     </View>
    
        //                     {/* Created Date & Status */}
        //                     <View style={styles.row}>
        //                         <View style={styles.col}>
        //                             <Text style={styles.label}>Created Date</Text>
        //                             <Text style={styles.value}>{cardItem?.createdAt}</Text>
        //                         </View>
        //                         <View style={styles.col}>
        //                             <Text style={styles.label}>Status</Text>
        //                             <Text style={[styles.value, { color: '#0063A7' }]}>{cardItem?.status}</Text>
        //                         </View>
        //                     </View>
        //                 </View>
        //             ))
        //         ) : (
        //             <Text style={styles.noData}>NO DATA FOUND</Text>
        //         )}
        //     </View>
        // );
    // };