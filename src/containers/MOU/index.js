
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
  ActivityIndicatorBase,
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
import Filter from '../../component/Filter';
import NextButton from '../../component/Button';
import HeaderFilter from '../../component/HeaderFilter';
// import RNFS, { stat } from 'react-native-fs';
import CardFooter from '../../component/bottomFooter';
import Search from '../../component/Search';
import { AlLiveTrackingLink } from '../../constants';
import { getRealUrl, handleDownload } from '../../utils/generatePdfFile';
import DatePickerInput from '../../component/DateTimePicker';
import FilterButton from '../../component/Button';
import { filterTextRegex } from '../../constants';
import { convertedDate, convertDate } from '../../utils/BiometricAuth';
import Toast from 'react-native-toast-message';
import { OrderedMap } from 'immutable';
import {
  getApprovedCustomerListRequest,
  getApproverTypeRequest,
  getDraftMouRequest,
  getFetchDraftMouRequest,
  getMouAllStatusRequest,
  getMouApprovedEmailIdRequest,
  getMouCreatorNameRequest,
  getMouListRequest,
  getNfaApproverIdListRequest,
  getNfaCustomerListRequest,
  getNFAListRequest,
  getZincListRequest,
} from '../../redux/feature/mouslice';
//import { useNavigation } from "@react-navigation/native";
//import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Linking } from 'react-native';
import HeaderTab from '../../component/HeaderTabs';
import { current } from '@reduxjs/toolkit';
import ContractList from '../../component/ContractList';
import NFAList from '../../component/NFA';
import { exportContractList, exportDraftMou, exportNFA, exportZincDraft, exportZincMou, nfaApproverUserIdList, nfaList } from '../../services/mouService';
import DraftMouScreen from '../../component/DraftMou';
import { getReadableVersion } from 'react-native-device-info';
import CustomLoader from '../../component/customLoader';
const MouScreen = props => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth);
  const branchAccessData = useSelector(state => state.branchAccess);
  const { data, status, isCustomer } = useSelector(state => state.branchAccess);
  const mouList = useSelector(state => state.mouList?.mouList);
  const nfaList = useSelector(state => state.mouList?.nfaList);
  const draftContractList = useSelector(state => state.mouList?.fetchDraftMou);
  const approverType = useSelector(state => state.mouList?.approverType?.data)
  const approvedCustomerList = useSelector(state => state.mouList?.approvedCustomerList?.data)
  const approverEmailIdList = useSelector(state => state.mouList?.mouApprovedEmailId?.data)
  const nfaApproveruserId = useSelector(state => state.mouList?.nfaApproverId?.data)
  const nfaCustomerList = useSelector(state => state.mouList?.nfaCustomerList?.data)
  const mouListData = useSelector(state => state.mouList?.mouList?.data);
  const mouCreatorName = useSelector(state => state.mouList?.mouCreatorName?.data)
  const mouStatus = useSelector(state => state.mouList?.mouAllStatus?.data)
  const draftMouData = useSelector(state => state.mouList?.draftMou?.data)
  const dispatchDetails = useSelector(
    state => state.dispatchDetails?.dispatchDetails,
  );
  const dispatchDetailsData = useSelector(
    state => state.dispatchDetails?.dispatchDetails?.data,
  );
  
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
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [showType, setType] = useState('Complaint');
  const [refreshing, setRefreshing] = useState(false);
  // const [showFilter, setShowFilter] = useState(false);
  const [daterange, setDate] = useState('');
  const [contractId, setContractId] = useState('');
  const [DoNo, setDoNo] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [userType, setUserType] = useState(false);
  const [customerList, setCustomerData] = useState([]);
  const [sapModal, setSapModal] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [filterCount, setFilterCount] = useState(0);
  const scrollViewRef = useRef(null);
  const [resetFilter, setResetFilter] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsDraft, setSearchResultsDraft] = useState([]);
  const [searchResultsMou, setSearchResultsMou] = useState([]);
  const [searchResultsNfa, setSearchResultsNfa] = useState([]);
  const [loader, setLoader] = useState(false);
  const [filterData, setFilterData] = useState({
    contractId: '',
    customerName: '',
    priceType: '',
    contractType: '',
    status: '',
    userName: '',
    createdBy: '',
    toDate: '',
    fromDate: '',
    nfaNumber: '',
    customerGroup: '',
    creatorName: '',
    approverUserId:''
  });
  const [sapData, setSapData] = useState({
    toDate: '',
    fromDate: '',
    plant: '',
  });
  const [regionByPlantData, setRegionByPlants] = useState([]);
  const [requestPayload, setRequestedPayload] = useState({});

  let webview = useRef(null);

  useEffect(() => {
    if (activeTab === 'contractList') {
      fetchData();
      setSearch('');
      setFilterCount(0)
    }
    if (activeTab === 'nfa') {
      console.log("activeTab === 'nfa'");
      
      //  handleCustomerList();
      handleNFAData();
      setSearch('');
      setFilterCount(0)
    }
    if (activeTab === 'draft') {
      console.log("activeTab === 'nfa'");
     fetchDraftData();
      setSearch('');
      setFilterCount(0);
    }
  }, [activeTab])

  useEffect(() => {
    if (search?.length > 0) {
      handleSearch();
    }
  }, [search])

  const headerData = {
    ...(authData?.data?.businessUnit === 'Zinc' ? 
     { draftContract: {
        name: 'Draft MOU',
        key: 'draft',
      }}
      :
     { draftContract: {
        name: 'Draft Contract',
        key: 'draft',
      }
      }),
      ...(authData?.data?.businessUnit === 'Zinc' ? 
        {  contractList: {
          name: 'MOU List',
          key: 'contractList',
        }}
         :
        {  contractList: {
          name: 'Contract List',
          key: 'contractList',
        }}),
  
    // contractConsumption: {
    //   name: 'Contract Consumption',
    //   key: 'contractConsumption',
    // },
    ...(!isCustomer && authData?.data?.businessUnit === 'Aluminium' && {
      nfa: {
        name: 'NFA',
        key: 'nfa',
      },
    }),
  };

  const contractFilterdata = {
    buttons: [
      { label: 'Contract Id', fieldName: 'contractId' },
      ...[(authData?.data?.businessUnit === 'Aluminium' || authData?.data?.businessUnit === 'Zinc' || authData?.data?.businessUnit === 'Copper') && !isCustomer && { label: 'Customer Name', fieldName: 'customerName' }].filter(Boolean),
       { label: 'Status', fieldName: 'status' },
      ...[authData?.data?.businessUnit === 'Aluminium' &&  { label: 'Price Type', fieldName: 'priceType' }].filter(Boolean),
      ...[authData?.data?.businessUnit === 'Aluminium' && { label: 'Contract Type', fieldName: 'contractType' }].filter(Boolean),
      ...[(authData?.data?.businessUnit === 'Aluminium'|| authData?.data?.businessUnit === 'Copper') && !isCustomer && { label: 'Username', fieldName: 'userName' }].filter(Boolean),
      ...[authData?.data?.businessUnit === 'Aluminium' && !isCustomer &&{ label: 'Created By', fieldName: 'createdBy' }].filter(Boolean),
      ...[authData?.data?.businessUnit === 'Aluminium' && !isCustomer &&{ label: 'Contract Date Range', fieldName: 'date' }].filter(Boolean),
    ],
    fields: [
      {
        fieldName: 'contractId',
        type: 'text',
        placeholder: 'Contract Id',
        value: contractId,
        onChangeText: text => setContractId(text),
      },
      {
        fieldName: 'customerName',
        placeholder: 'Customer Name',
        type: 'options',
        options: [
          ...(approvedCustomerList ? Object.values(approvedCustomerList).map(customer => ({
            value: customer.business_name,
            label: customer.business_name,
          })).sort((a, b) => a.label.localeCompare(b.label)) : []),
        ]
      },
      {
        fieldName: 'userName',
        placeholder: 'Username',
        type: 'options',
        options: [
          ...(approverEmailIdList ? Object.entries(approverEmailIdList).map(([id, name]) => ({
            label: name,
            value: name,
            id: id
          })).sort((a, b) => a.label.localeCompare(b.label)) : []
          ),
        ]
      },
      {
        fieldName: 'createdBy',
        placeholder: 'Created By',
        type: 'options',
        options: [
          ...(mouCreatorName ? Object.entries(mouCreatorName).map(([id, name]) => ({
            label: name,
            value: name,
            id: id
          })).sort((a, b) => a.label.localeCompare(b.label)) : []),
          
        ]
      },
      {
        fieldName: 'status',
        placeholder: 'Status',
        type: 'options',
        options: isCustomer
    ? [
        { label: 'Approved', value: 'Approved' },
        { label: 'NFA Pending', value: 'NFA Pending' },
        { label: 'Pending', value: 'Pending' },
      ]
    : Object.values(mouStatus).map((status) => ({
        label: status,
        value: status,
      })).sort((a, b) => a.label.localeCompare(b.label)),

      
        
      },
      {
        fieldName: 'date',
        type: 'date',
        placeholder: 'DD/MM/YYYY',
        value: daterange,
        onChangeText: text => setDate(text),
      },
      {
        fieldName: 'priceType',
        placeholder: 'Price Type',
        type: 'options',
        options: [

          { label: 'LME Pricing', value: 'LME Pricing' },
          { label: 'LP Pricing', value: 'LP Pricing' }
        ]
      },
      {
        fieldName: 'contractType',
        placeholder: 'Contract Type',
        type: 'options',
        options: [
          { label: 'SPOT', value: 'SPOT' },
          { label: 'MOU', value: 'MOU' }
        ]
      },
    ],
  };
  const nfaFilterdata = {
    buttons: [
      { label: 'NFA Number', fieldName: 'nfaNumber' },
      { label: 'Customer Group', fieldName: 'customerGroup' },
      { label: 'Status', fieldName: 'status' },
      { label: 'Username', fieldName: 'username' },
      { label: 'Creator Name', fieldName: 'creatorName' },
      { label: 'NFA Date Range', fieldName: 'date' },
    ],
    fields: [
      {
        fieldName: 'nfaNumber',
        type: 'text',
        placeholder: 'NFA Number',
        value: contractId,
        onChangeText: text => setContractId(text),
      },
      {
        fieldName: 'customerGroup',
        placeholder: 'Customer Group',
        type: 'options',
        options: [
          ...(nfaCustomerList
            ? Object.entries(nfaCustomerList).map(([id, customer]) => ({
              value: customer.business_name,
              label: customer.business_name,
              id: customer.business_id
            })).sort((a, b) => a.label.localeCompare(b.label)) : []),
          // { label: 'Other', value: 'Other' }
        ]
      },
      {
        fieldName: 'username',
        placeholder: 'Username',
        type: 'options',
        options: [
          ...(nfaApproveruserId
            ? Object.entries(nfaApproveruserId).sort().map(([id, name]) => ({
              label: name,
              value: name,
              id: id
            })).sort((a, b) => a.label.localeCompare(b.label))
            : []),
          // { label: 'Other', value: 'Other' }
        ]
      },
      {
        fieldName: 'creatorName',
        placeholder: 'Creator Name',
        type: 'options',
        options: [
          ...(mouCreatorName ? Object.entries(mouCreatorName).map(([id, name]) => ({
            label: name,
            value: name,
            id: id
          })).sort((a, b) => a.label.localeCompare(b.label)) : []),
          // { label: 'Other', value: 'Other' }
        ]
      },
      {
        fieldName: 'status',
        placeholder: 'Status',
        type: 'options',
        // options: [...Object.values(mouStatus).map((id) => ({
        //   label: id,
        //   value: id
      // })),
      options: [
        { label: 'Approval Pending', value: 'Approval Pending' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Rejected', value: 'Rejected' },
        { label: 'Returned', value: 'Returned' }
      ]
      },
      {
        fieldName: 'date',
        type: 'date',
        placeholder: 'DD/MM/YYYY',
        value: daterange,
        onChangeText: text => setDate(text),
      },
    ],
  };
  const draftMouFilter = {
    buttons: [
      { label: 'Contract Id', fieldName: 'contractId' },
      ...[!branchAccessData?.isCustomer && { label: 'Customer Name', fieldName: 'customerName' }].filter(Boolean),
      ...[authData?.data?.businessUnit === 'Aluminium'  &&{label: 'Price Type', fieldName: 'priceType' }].filter(Boolean),
      ...[authData?.data?.businessUnit === 'Aluminium'  &&{ label: 'Contract Type', fieldName: 'contractType' }].filter(Boolean),
      { label: 'Status', fieldName: 'status' },

    ],
    fields: [
      {
        fieldName: 'contractId',
        type: 'text',
        placeholder: 'Contract Id',
        value: contractId,
        onChangeText: text => setContractId(text),
      },
      {
        fieldName: 'customerName',
        placeholder: 'Customer Name',
        type: 'options',
        options: [
          ...(approvedCustomerList ? Object.values(approvedCustomerList).map(customer => ({
            value: customer.business_name,
            label: customer.business_name,
          })).sort((a, b) => a.label.localeCompare(b.label)) : []),
        
        ]
      },
      {
        fieldName: 'status',
        placeholder: 'Status',
        type: 'options',
        options: [...Object.values(draftMouData).map((id) => ({
          label: id,
          value: id
        })),
        ]
      },
      {
        fieldName: 'priceType',
        placeholder: 'Price Type',
        type: 'options',
        options: [

          { label: 'LME Pricing', value: 'LME Pricing' },
          { label: 'LP Pricing', value: 'LP Pricing' }
        ]
      },
      {
        fieldName: 'contractType',
        placeholder: 'Contract Type',
        type: 'options',
        options: [
          { label: 'SPOT', value: 'SPOT' },
          { label: 'MOU', value: 'MOU' }
        ]
      },
    ],
  };

  

  const customerNameOptions = customerList.map(item => ({
    value: item.business_name,
    label: item.business_name,
  }));

  // console.log(activeTab, 'activeTab');
  
  

  const isCtaDisabled = () => {
    const { fromDate, toDate } = sapData;
    console.log('from dataa', sapData);
    console.log('check this', toDate?.trim().length, fromDate?.trim().length);

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

  const handleFilterCount = (count) => {
    setFilterCount(count);
  };

  useEffect(() => {
    checkDetail();
    // getData();
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
      console.log(e);
    }
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
        console.log(e);
        return;
      });
  };
  console.log('Active Tab', activeTab);

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
        console.log(err);
      });
  };

  const Logout = async () => {
    authData.setIsLoggedIn(false);
    await AsyncStorage.clear();
    await AsyncStorage.setItem('@first_login_after_logout', 'true');
  };

  const getSession = async () => {
    let jsonValue = await AsyncStorage.getItem('@user_info');
    jsonValue = jsonValue != null ? JSON.parse(jsonValue) : null;
    setAuth(jsonValue);
    CallSession(jsonValue);
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
    console.log('filter hit');
    setShowFilter(true);
  };

  const closeFilterComp = () => {
    console.log('filter hit');
    setShowFilter(false);
  };
  function convertDateToTimestamp(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    const timestamp = new Date(year, month - 1, day).getTime();
    return timestamp;
  }
  const handleApplyFilters = async data => {
    setSearch('');
    setSearchResults([])
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    let newValue = data?.priceType;
    const isZinc = authData?.data?.businessUnit === 'Zinc'
    if (data?.priceType) {
      if (data?.priceType === 'LME Pricing') {
        newValue = 'LME';
      }
      else if (data?.priceType === 'LP Pricing') newValue = 'LP';
    }
    const dataObj = {
      approverNameId: data?.userName,
      businessUnit: authData?.data?.businessUnit,
      mouNo: data?.contractId,
      priceType: newValue,
      customerName: data?.customerName,
      status: data?.status,
      contractType: data?.contractType,
      createdById: data?.creator_id,
      region: branchAccessData?.data?.branchModules?.region,
      // region: branchAccessData?.data?.branchModules?.region? branchAccessData?.data?.branchModules?.region: "EI01,WI01,NI01,SI01",
      fromDate: convertDateToTimestamp(data?.fromDate),
      toDate: convertDateToTimestamp(data?.toDate),
      ...(isCustomer ? { companyId: jsonSessionData?.companyId} : {}),
      ...(isZinc ? {}:{exportFlag: true}),
      limit: 10,
      offset: 0,
    };

    const nfaObj = {
      businessUnit: authData?.data?.businessUnit,
      status: data?.status,
      approverUserId: data?.approverUserId,
      nfaNumber: data?.nfaNumber,
      customerGroup: data?.customerGroup,
      fromTimestamp: convertDateToTimestamp(data?.fromDate),
      toTimestamp: convertDateToTimestamp(data?.toDate),
      limit: 10,
      offset: 0,
      region: branchAccessData?.data?.branchModules?.region,
      // region: branchAccessData?.data?.branchModules?.region? branchAccessData?.data?.branchModules?.region: "EI01,WI01,NI01,SI01",
      creatorId: data?.creator_id,
      companyId: isCustomer ? jsonSessionData?.companyId : null,
    }

    const draftObj = {
      mouNo: data?.contractId ,
      priceType: newValue ,
      customerName: data?.customerName ,
      contractType: data?.contractType,
      status: data?.status ,
      businessUnit: authData?.data?.businessUnit,
      ...(isCustomer ? { companyId: jsonSessionData?.companyId } : {}),
      limit: 10,
      offset: 0,
      region: branchAccessData?.data?.branchModules?.region,
      // region: branchAccessData?.data?.branchModules?.region ? branchAccessData?.data?.branchModules?.region : "EI01,WI01,NI01,SI01",
    }
  
    if (activeTab === 'contractList') {
      dispatch(
        getMouListRequest({
          page: 1,
          pageSize: 10,
          dataObj,
        }),
      );
    }
    else if (activeTab === 'nfa') {
      dispatch(
        getNFAListRequest({
          page: 1,
          pageSize: 10,
          dataObj: nfaObj,
        }),
      );
    }
    else if (activeTab === 'draft') {
      dispatch(
        getFetchDraftMouRequest({
          page: 1,
          pageSize: 10,
          dataObj: draftObj,
        }),
      );
    }
    // setRequestedPayload(requestedPayload);
    setFilterData(data);
    setShowFilter(false);
  };

  console.log("reset filter check karo", resetFilter);
  
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
          ]}>
          {activeTab === 'contractList' ?
            <Filter
              props={props}
              data={contractFilterdata}
              fromListing={true}
              onClose={() => setShowFilter(false)}
              initialValues={filterData}
              onReset={fetchData}
              onApply={handleApplyFilters}
              resetFilter={resetFilter}
              onFilterCount={handleFilterCount}
              activeTab={activeTab}
            /> : (activeTab === 'nfa') ?
              <Filter
                props={props}
                data={nfaFilterdata}
                fromListing={true}
                onClose={() => setShowFilter(false)}
                initialValues={filterData}
                onReset={handleResetNFA}
                onApply={handleApplyFilters}
                resetFilter={resetFilter}
                onFilterCount={handleFilterCount}
                activeTab={activeTab}
              /> :
              <Filter
                props={props}
                data={draftMouFilter}
                fromListing={true}
                onClose={() => setShowFilter(false)}
                initialValues={filterData}
                onReset={fetchDraftData}
                onApply={handleApplyFilters}
                resetFilter={resetFilter}
                onFilterCount={handleFilterCount}
                activeTab={activeTab}
              />
          }
        </View>
      </Modal>
    );
  };
  const fetchDraftData = async () => {
    try {
      setResetFilter(false);
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
        contractId: '',
       
        priceType: '',
        contractType: '',
        status: '',
        userName: '',
        createdBy: '',
       
        nfaNumber: '',
        customerGroup: '',
        creatorName: '',
      });
      const sessionData = await AsyncStorage.getItem('@get_session');
      const getPlantId = await AsyncStorage.getItem('@plantId');
      let jsonSessionData = JSON.parse(sessionData);
      let plantId = JSON.parse(getPlantId);
      const dataObj = {
        businessUnit: authData?.data?.businessUnit,
        ...(isCustomer? {companyId: isCustomer? jsonSessionData?.companyId : null} : {}),
        limit: 10,
        offset: 0,
        ...(props?.route?.params?.draftId? {mouNo: props?.route?.params?.draftId} : {}),
        region: branchAccessData?.data?.branchModules?.region,
        // region: branchAccessData?.data?.branchModules?.region ? branchAccessData?.data?.branchModules?.region : "EI01,WI01,NI01,SI01",
      };
      dispatch(
        getApprovedCustomerListRequest({
          businessUnit: authData?.data?.businessUnit,
        }),
      );
      dispatch(
        getDraftMouRequest({businessUnit:authData?.data?.businessUnit})
      );
      dispatch(
        getFetchDraftMouRequest({
          page: 1,
          pageSize: 10,
          dataObj,
        })
      )
    } catch (error) {
      console.log("ERROR:", error);
    }
  }
  const handleResetNFA = async () => {
    try {
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
        contractId: '',
        approverUserId:'',
        priceType: '',
        contractType: '',
        status: '',
        userName: '',
        createdBy: '',
       
        nfaNumber: '',
        customerGroup: '',
        creatorName: '',
      })
      const sessionData = await AsyncStorage.getItem('@get_session');
      const getPlantId = await AsyncStorage.getItem('@plantId');
      let jsonSessionData = JSON.parse(sessionData);
      let plantId = JSON.parse(getPlantId);
      const dataObj = {
        businessUnit: authData?.data?.businessUnit,
        companyId: isCustomer ? jsonSessionData?.companyId : null,
        limit: 10,
        offset: 0,  region: branchAccessData?.data?.branchModules?.region,
        ...(props?.route?.params?.nfaId? {nfaNumber
          : props?.route?.params?.nfaId} : {}),
        // region: branchAccessData?.data?.branchModules?.region ? branchAccessData?.data?.branchModules?.region : "EI01,WI01,NI01,SI01",
      };
      const fetchCreatorNameData = {
        businessUnit: authData?.data?.businessUnit,
        region: branchAccessData?.data?.branchModules?.region,
        // region: branchAccessData?.data?.branchModules?.region ? branchAccessData?.data?.branchModules?.region : "EI01,WI01,NI01,SI01",
      };
      dispatch(
        getNfaCustomerListRequest({
          businessUnit: authData?.data?.businessUnit
        })
      )
      dispatch(
        getNfaApproverIdListRequest({
          businessUnit: authData?.data?.businessUnit,
          roleIdList: Object.keys(approverType)
        })
      )
      dispatch(
        getMouCreatorNameRequest({
          fetchCreatorNameData,
        }),
      );
      dispatch(
        getNFAListRequest({
          page: 1,
          pageSize: 10,
          dataObj,
        }),
      );
    } catch (err) {
      console.log("Error", err);
    }
  }

  useEffect(() => {
   const count = countActiveNFAFilters(filterData)
      setFilterCount(count);
   
  }, [filterData]);

  const countActiveNFAFilters = (formData) => {
    console.log("FormData ", formData);
    const filterKeys = ['status', 'username', 'customerGroup', 'creatorName', 'nfaNumber', 'fromDate']; 
    let count = 0;
  
    filterKeys.forEach(key => {
      const value = formData[key];
      console.log(`Checking ${key}:`, value);
      if (typeof value === 'string' && value.trim() !== '') {
        count++;
      }
    });
  
    return count;
  };

  const handleNFAData = async () => {
    setResetFilter(false);
    try {
     
      const loginUserId = authData?.data?.userId || authData?.data?.idUser;  
      const isAnyFilterApplied = Object.values(filterData || {}).some(val => val && val !== "");
      let approverUserIdMatched = null;
     
      if (!isAnyFilterApplied && nfaApproveruserId && Object.keys(nfaApproveruserId).length > 0) {
        Object.keys(nfaApproveruserId).forEach((key) => {
          if (String(key) === String(loginUserId)) {
            setFilterData((prev) => ({
              ...prev,
              approverUserId: key,
              status: "Approval Pending",
              username: nfaApproveruserId[key]
            }));
            approverUserIdMatched = key; 
          }
        });
      }
      const sessionData = await AsyncStorage.getItem('@get_session');
      const getPlantId = await AsyncStorage.getItem('@plantId');
      let jsonSessionData = JSON.parse(sessionData);
      let plantId = JSON.parse(getPlantId);
      const dataObj = {
        businessUnit: authData?.data?.businessUnit,
        companyId: isCustomer ? jsonSessionData?.companyId : null,
        limit: 10,
        offset: 0,
        ...(!isAnyFilterApplied && approverUserIdMatched
          ? { approverUserId: approverUserIdMatched, status: "Approval Pending" }
          : {}),
        // approverUserId: nfaApproverUserIdList?.approverUserId,
        region: branchAccessData?.data?.branchModules?.region,
        ...(props?.route?.params?.nfaId? {nfaNumber
          : props?.route?.params?.nfaId} : {}),
        // region: branchAccessData?.data?.branchModules?.region ? branchAccessData?.data?.branchModules?.region : "EI01,WI01,NI01,SI01",
      };
      const fetchCreatorNameData = {
        businessUnit: authData?.data?.businessUnit,
        region: branchAccessData?.data?.branchModules?.region,
        // region: branchAccessData?.data?.branchModules?.region ? branchAccessData?.data?.branchModules?.region : "EI01,WI01,NI01,SI01",
      };
      dispatch(
        getNfaCustomerListRequest({
          businessUnit: authData?.data?.businessUnit
        })
      )
      dispatch(
        getNfaApproverIdListRequest({
          businessUnit: authData?.data?.businessUnit,
          roleIdList: Object.keys(approverType)
        })
      )
      dispatch(
        getMouCreatorNameRequest({
          fetchCreatorNameData,
        }),
      );
      dispatch(
        getNFAListRequest({
          page: 1,
          pageSize: 10,
          dataObj,
        }),
      );
    } catch (err) {
      console.log("Error", err);
    }
  }

  // console.log("mou props", props);
  const fetchData = async () => {
    console.log('hit fetch data func');
    setResetFilter(false);
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
      contractId: '',
     
      priceType: '',
      contractType: '',
      status: '',
      userName: '',
      createdBy: '',
     
      nfaNumber: '',
      customerGroup: '',
      creatorName: '',
  })
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
    const dataObj = {
      companyId: isCustomer ? jsonSessionData?.companyId : null,
      exportFlag: false,
      businessUnit: authData?.data?.businessUnit,
      ...(props?.route?.params?.contractiId? {mouNo: props?.route?.params?.contractiId} : {}),
      limit: 10,
      offset: 0,
    };
    const zincObj = {
      ...(isCustomer ? { companyId: isCustomer ? jsonSessionData?.companyId : null } : {}),
      businessUnit: authData?.data?.businessUnit,
      ...(props?.route?.params?.contractiId? {mouNo: props?.route?.params?.contractiId} : {}),
      limit: 10,
      offset: 0,
    };
    const approverEmailId = {
      businessUnit: authData?.data?.businessUnit,
      roleIdList: Object.keys(approverType)
    }
    const customerListData = {
      businessUnit: authData?.data?.businessUnit,
    };
    const fetchCreatorNameData = {
      businessUnit: authData?.data?.businessUnit,
      region: branchAccessData?.data?.branchModules?.region,
      // region: branchAccessData?.data?.branchModules?.region ? branchAccessData?.data?.branchModules?.region : "EI01,WI01,NI01,SI01",
    };
    // dispatch(getMouListRequest(dataObj));
    const currentPage = mouList?.currentPage || 0;
    const requestData =
    authData?.data?.businessUnit === 'Zinc' ? zincObj : dataObj;
  console.log("request dtaa", requestData);
  
    dispatch(getApproverTypeRequest());
    dispatch(
      getApprovedCustomerListRequest({
        businessUnit: authData?.data?.businessUnit,
      }),
    );
    dispatch(
      getMouCreatorNameRequest({
        fetchCreatorNameData,
      }),
    );
    dispatch(getMouAllStatusRequest({businessUnit:authData?.data?.businessUnit}));
    dispatch(
      getMouApprovedEmailIdRequest({
        approverEmailId,
      }),
    );
    
dispatch(
  getMouListRequest({
    page: 1,
    pageSize: 10,
    dataObj:{ ...requestData}, 
  }),
);
  };
// console.log("search here ", search, props?.route?.params?.contractiId);

  const handleExportData = async () => {
    try {
      console.log("hit export data icon");
      setLoader(true);
      const sessionData = await AsyncStorage.getItem('@get_session');
      const getPlantId = await AsyncStorage.getItem('@plantId');
      let jsonSessionData = JSON.parse(sessionData);
      let plantId = JSON.parse(getPlantId);
      const isZinc = authData?.data?.businessUnit === 'Zinc';
      let newValue = filterData?.priceType;
      if (filterData?.priceType) {
        if (filterData?.priceType === 'LME Pricing') {
          newValue = 'LME';
        }
        else if (filterData?.priceType === 'LP Pricing') newValue = 'LP';
      }
      const contractListObj =
      {
        companyId: isCustomer ? jsonSessionData?.companyId : null,
        ...(isZinc ? {}:{exportFlag: true}),
        businessUnit: authData?.data?.businessUnit,
        ...(filterData?.contractId && { mouNo: filterData.contractId }),
        ...(newValue && { priceType: newValue }),
        ...(filterData?.customerName && { customerName: filterData.customerName }),
        ...(filterData?.contractType && { contractType: filterData.contractType }),
        ...(filterData?.userName && { approverNameId: filterData.userName }),
        ...(filterData?.creator_id && { createdById: filterData.creator_id }),
...(filterData?.status && { status: filterData?.status}),
        region: branchAccessData?.data?.branchModules?.region,
        // region: branchAccessData?.data?.branchModules?.region ? branchAccessData?.data?.branchModules?.region : "EI01,WI01,NI01,SI01",
        ...(filterData?.fromDate && { fromDate: convertDateToTimestamp(filterData.fromDate) }),
        ...(filterData?.toDate && { toDate: convertDateToTimestamp(filterData.toDate) }),
       
      };
    
      const nfaObj = {
        businessUnit: authData?.data?.businessUnit,
        ...(filterData?.status && { status: filterData.status }),
        ...(filterData?.approverUserId && { approverUserId: filterData.approverUserId }),
        ...(filterData?.nfaNumber && { nfaNumber: filterData.nfaNumber }),
        ...(filterData?.customerGroup && { customerGroup: filterData.customerGroup }),
        ...(filterData?.fromDate && { fromTimestamp: convertDateToTimestamp(filterData.fromDate) }),
        ...(filterData?.toDate && { toTimestamp: convertDateToTimestamp(filterData.toDate) }),
        region: branchAccessData?.data?.branchModules?.region,
        // region: branchAccessData?.data?.branchModules?.region ? branchAccessData?.data?.branchModules?.region : "EI01,WI01,NI01,SI01",
        ...(filterData?.creator_id && { creatorId: filterData.creator_id }),
        companyId: isCustomer ? jsonSessionData?.companyId : null,
       
      }
      
      const draftObj = {
        businessUnit: authData?.data?.businessUnit,
        region: branchAccessData?.data?.branchModules?.region,
        // region: branchAccessData?.data?.branchModules?.region ? branchAccessData?.data?.branchModules?.region : "EI01,WI01,NI01,SI01",
        ...(filterData?.contractId && { mouNo: filterData.contractId }),
        ...(newValue && { priceType: newValue }),
        ...(filterData?.customerName && { customerName: filterData.customerName }),
        ...(filterData?.contractType && { contractType: filterData.contractType }),
        ...(filterData?.status && { status: filterData.status }),
          businessUnit: authData?.data?.businessUnit,
        companyId: isCustomer ? jsonSessionData?.companyId : null,
        ...(isZinc ? {}:{exportFlag: true}),
      }
      if (activeTab === 'contractList') {
        const data = isZinc? await exportZincMou(contractListObj) : await exportContractList(contractListObj);
        if (data?.success) {
          console.log("data exportZincMou", data);
          
          console.log('hit');
          const name = isZinc ? 'MOU_List' : 'MOU_List';
          const url = isZinc ? data?.data : data?.data?.url;
          getRealUrl(url, name);
        }
      } else if (activeTab === 'nfa') {
        const data = await exportNFA(nfaObj);
        if (data?.success) {
          console.log('hit');
          getRealUrl(data?.data, 'NFA');
        }
      }
      if (activeTab === 'draft') {
        const data =  isZinc? await exportZincDraft(draftObj) : await exportDraftMou(draftObj);
        if (data?.success) {
          console.log("data exportZincDraft", data);
          
          console.log('hit');
          const name = isZinc ? 'Draft_MOU' : 'Draft_Contract';
          const url = isZinc ? data?.data : data?.data?.url;
          getRealUrl(url, name);
          // getRealUrl(data?.data?.url, name);
        }
      }
      setLoader(false);
    } catch (err) {
      setLoader(false);
      console.log('error', err);
    }
  };
console.log(search, 'setSearch');
 
  const handleSearch = async () => {
    try{
      const allHitsMou = mouList?.data?.flatMap(item => item.data)
      const allHitsNfa = nfaList?.data?.flatMap(item => item.nfaListingData)
      const allHitsDraft = draftContractList?.data?.flatMap(item => item.data)
      console.log("hit handle search", allHitsMou,allHitsDraft, allHitsNfa );
      const searchTerms = search.split(",").map(term => term.trim());
      const matchingHitsMou = allHitsMou.filter(hit => {
        const contractId = hit.mouNo?.toString();
        return searchTerms.some(term => contractId?.toLowerCase().includes(term.toLowerCase()));
      });
      const matchingHitsNfa = allHitsNfa.filter(hit => {
        const contractId = hit.nfaNumber?.toString();
        return searchTerms.some(term => contractId?.toLowerCase().includes(term.toLowerCase()));
      });
      const matchingHitsDraft = allHitsDraft.filter(hit => {
        const contractId = hit.mouNo?.toString();
        return searchTerms.some(term => contractId?.toLowerCase().includes(term.toLowerCase()));
      });
      setSearchResultsMou(matchingHitsMou);
      setSearchResultsNfa(matchingHitsNfa);
      setSearchResultsDraft(matchingHitsDraft);
    // try {
    //   const sessionData = await AsyncStorage.getItem('@get_session');
    //   const getPlantId = await AsyncStorage.getItem('@plantId');
    //   let jsonSessionData = JSON.parse(sessionData);
    //   let plantId = JSON.parse(getPlantId);
    //   const contractObj = {
    //     exportFlag: false,
    //     businessUnit: authData?.data?.businessUnit,
    //     mouNo: props?.filterData?.contractId,
    //     region: null,
    //     limit: 10,
    //     offset: currentPage,
    //   }
    //   const nfaObj = {
    //     businessUnit: authData?.data?.businessUnit,
    //     nfaNumber: props?.filterData?.nfaNumber,
    //     limit: 10,
    //     offset: 0,
    //     region: null,

    //   }
    //   const draftObj = {
    //     mouNo: data?.contractId,
    //     businessUnit: authData?.data?.businessUnit,
    //     limit: 10,
    //     offset: currentPage,
    //     region: branchAccessData?.data?.branchModules?.region
    //   }

    //   dispatch(
    //     getMouListRequest({
    //       page: 1,
    //       pageSize: 10,
    //       dataObj: contractObj,
    //     }),
    //   );
    //   dispatch(
    //     getNFAListRequest({
    //       page: 1,
    //       pageSize: 10,
    //       dataObj: nfaObj,
    //     }),
    //   );
    //   dispatch(
    //     getFetchDraftMouRequest({
    //       page: 1,
    //       pageSize: 10,
    //       dataObj: draftObj,
    //     }),
    //   );

    } catch (error) {
      console.log('Error', error);
    }
  };

  useEffect(() => {
    if (scrollViewRef?.current) {
      const scrollX = (activeTab - 1) * 100;
      scrollViewRef?.current?.scrollTo({ x: scrollX, animated: true });
    }
  }, [activeTab]);
  const handleTabChange = selectedKey => {
    setActiveTab(selectedKey);
    // setSearch('');
    console.log('Selected Tab:', selectedKey);
  };
  const renderForm = () => {
    switch (activeTab) {
      case 'contractList':
        return (
          <ContractList
            {...props}
            filterData={filterData}
            resetFilter={setResetFilter}
            filteredData={setFilterData}
            searchResults={setSearchResultsMou}
            searchResultsData={searchResultsMou}
            searchKey={search}
            setSearchKey={setSearch}
            filterCount={setFilterCount}
            // filterCount={setFilterCount}
          />
        );
      case 'nfa':
        return (
          <NFAList {...props} filterData={filterData}
            resetFilter={setResetFilter}
            filteredData={setFilterData}
            searchResults={setSearchResultsDraft}
            searchResultsData={searchResultsNfa}
            filterCount={setFilterCount}
            searchKey={search}
            setSearchKey={setSearch}
          />
        );
      case 'draft':
        return (
          <DraftMouScreen
            {...props}
            filterData={filterData}
            resetFilter={setResetFilter}
            filteredData={setFilterData}
            searchResults={setSearchResultsDraft}
            searchResultsData={searchResultsDraft}
            searchKey={search}
            setSearchKey={setSearch}
            filterCount={setFilterCount}
          />
        );
      // case 'contractConsumption':
      //   return <NFAList {...props} />;
  default:
        return null;
    }
  };

  return (
    <View style={styles.containerWrap}>
      {loader && <CustomLoader fullScreen/>}
      <Header
        navigation={{
          ...props?.navigation,
          goBack: () => props?.navigation.pop(),
        }}
        // showBack
        showText={authData?.data?.businessUnit === 'Zinc' ? 'MOU' : activeTab === 'nfa'? 'NFA': 'Contract'}
        // showLogo
        showLogout={
          props?.route.params && props?.route.params.URL ? false : true
        }
        auth={auth}
        // showPlant
        // showNotification
        // showScanner
        canGOBack={props?.route.name == 'WebView' ? false : true}
        // showFolder
        showExportData={true}
        exportData={handleExportData}
      />
      <View style={styles.TopWrap}>
        <>
          <View style={[styles.SearchWraps]}>
            <HeaderTab headerData={headerData} onTabChange={handleTabChange} activeTabKey={props?.route?.params?.activeTabKey ?? 0} />
          </View>
        </>
        <View style={styles.SearchWrap}>
          <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
            <Image
              source={require('../../assets/images/icon_search2.png')}
              style={styles.image}
            />
          </TouchableOpacity>
          <TextInput
            placeholder = {activeTab === 'nfa'? "Search by NFA Number" : authData?.data?.businessUnit === 'Zinc'?  "Search by MOU Number" : "Search by Contract ID"}
            value={search}
            placeholderTextColor="#888" 
            autoCapitalize={'characters'}
            onChangeText={search => setSearch(search.replace(filterTextRegex, ''))}
            style={styles.searchBar}
            // editable={searchType ? false : true}
            onSubmitEditing={handleSearch}
          />

          <TouchableOpacity onPress={openFilterComp} style={styles.searchbtn}>
            <Image
              source={require('../../assets/images/icon_filter.png')}
              style={styles.image}
            />
             {filterCount > 0 && (
                              <View style={styles.badgeContainer}>
                                <Text style={styles.badgeText}>{filterCount}</Text>
                              </View>
                            )}
          </TouchableOpacity>
          {showFilter && showFilterModal()}
         
        </View>
       
        {/* <View style={{marginBottom:  130}}>
          {renderForm()}
        </View> */}
      </View>
      {renderForm()}
    </View>
  );
};
export default MouScreen;