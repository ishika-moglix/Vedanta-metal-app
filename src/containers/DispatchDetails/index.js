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
import { getDispatchDetailsRequest, getRegionByPlantsRequest } from '../../redux/feature/dispatchDetailsSlice';
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
import { convertedDate, convertDate, convertEpochToDate, convertDateToTimestamp, convertDateToEndOfDayTimestamp, formatIndianCurrency, roundToTwoDecimals } from '../../utils/BiometricAuth';
import Toast from 'react-native-toast-message';
//import { useNavigation } from "@react-navigation/native";
//import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Linking } from 'react-native';
import CustomLoader from '../../component/customLoader';
import ENV from '../../services/url';
import config from '../../services';
const DispatchDetailsScreen = props => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth);
  const branchAccessData = useSelector(state => state.branchAccess?.data);
  const regionByPlants = useSelector(state => state.dispatchDetails?.plantsRegion?.data)
  const regionByPlantsStatus = useSelector(state => state.dispatchDetails?.plantsRegion?.status)
  const nfaCustomerList = useSelector(state => state.mouList?.nfaCustomerList?.data)
  const { data, status, isCustomer } = useSelector(state => state.branchAccess);
  const filteredData = useSelector(state => state.dispatchDetails.dispatchDetails?.data);
  //const navigation = useNavigation();
  const [showCreateNew, setShowCreateNew] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
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
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [DoNo, setDoNo] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [userType, setUserType] = useState(false);
  const [customerList, setCustomerData] = useState([]);
  const [sapModal, setSapModal] = useState(false);
  const [isColor, setIsColor] = useState('Delivered');
  const [loader, setLoader] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [resetFilter, setResetFilter] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filterCount, setFilterCount] = useState(0);
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
    OrderNo: ''
  });
  const [sapData, setSapData] = useState({
    toDate: '',
    fromDate: '',
    plant: '',
  });
  // const [regionByPlants, setRegionByPlants] = useState([]);
  const [requestPayload, setRequestedPayload] = useState({});

  let webview = useRef(null);
  const dispatchDetails = useSelector(
    state => state.dispatchDetails?.dispatchDetails,
  );
  const dispatchDetailsData = useSelector(
    state => state.dispatchDetails?.dispatchDetails?.data,
  );

  useEffect(() => {
      if (search?.length > 0) {
        handleSearch();
      }
  }, [search])
  console.log("ENV[config.PROJECT_ENV]", config.PROJECT_ENV);
  
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

  const customerNameOptions = customerList?.length > 0 ? customerList.map(item => ({
    value: item.business_name,
    label: item.business_name,
    id: item.business_id
  })) : [];
   const headerFilter = [
    {
      label: 'OrderNo',
      type: 'text',
      placeholder: 'DO No.',
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
    {
      label: 'CustomerId',
      type: 'text',
      placeholder: 'Customer Id',
    },
    {
      label: 'Date',
      type: 'date',
      placeholder: 'Date',
    },
    {
      label: 'invoiceNo',
      type: 'text',
      placeholder: 'Invoice No',
    },
    authData?.data?.businessUnit === 'Aluminium' && {
      label: 'plant',
      placeholder: 'Plant',
      options: [
        { value: 'BALCO', label: 'BALCO' },
        { value: 'VAL', label: 'VAL' },
      ],
      type: 'options',
      // placeholder: 'Order No',
    },
  ];
  console.log('resetTrigger', resetTrigger);

  const formattedData = [
    {
      hits: {
        hits: searchResults
      }
    }
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

    // handleApplyFilters(sapData);
    closeSapReport();
  };

  const cardData = ['Invoice', 'TC', 'LR', 'PL'];
  useEffect(() => {
    checkDetail();
    // getData();
  }, []);
  useEffect(() => {
    dispatch(
      getRegionByPlantsRequest()
    )
    isValAlTracking();
    // handleRefreshData();
    getCustomerList();
  }, []);
  console.log("Region by plants", regionByPlants);

  useEffect(() => {
    if (regionByPlantsStatus === STATE_STATUS.FETCHED) {
      fetchData();
    }
  }, [regionByPlants])
  // const handleListing = async () => {
  //   try {
  //     await fetchData();
  //   } catch (err) {
  //     console.log("Error", err);

  //   }
  // }
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


  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert('Hold on!', 'Are you sure you want to go back?', [
  //       {
  //         text: 'Cancel',
  //         onPress: () => null,
  //         style: 'cancel',
  //       },
  //       {text: 'YES', onPress: () => BackHandler.exitApp()},
  //     ]);
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.removeEventListener("hardwareBackPress",//console.log("ok"));
  // }, []);

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

  // const LogoutFn = async () => {
  //   await AsyncStorage.removeItem('@user_info');
  //   dispatch(
  //     setAuth({
  //       status: STATE_STATUS.UNFETCHED,
  //       data: {},
  //     })
  //   );
  //   navigation.navigate('LoginFirst')
  // };

  const Logout = async () => {
    // authData?.data?.setIsLoggedIn(false);
    await AsyncStorage.clear();
    await AsyncStorage.setItem('@first_login_after_logout', 'true');
    await AsyncStorage.removeItem('@plantCode');
    await AsyncStorage.removeItem('@plantId')
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

  //   }, []),
  // );

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


  const handleApplyFilters = async data => {
    setSearch('');
    setSearchResults([])
    //console.log('filter data', data);
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
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
              : regionByPlants.length > 0
                ? [
                  {
                    terms: {
                      buyerId: regionByPlants,
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
            data?.invoiceNo?.trim().length > 0
              ? {
                match: {
                  invoiceNo: data?.invoiceNo,
                },
              }
              : null,
            data?.fromDate?.trim().length > 0 && data?.toDate?.trim().length > 0
              ? {
                range: {
                  documentDate: {
                    gte:
                      convertDateToTimestamp(data?.fromDate),
                    lt: convertDateToEndOfDayTimestamp(data?.toDate),
                  },
                },
              }
              : null,
            data?.dONo?.trim().length > 0 || data?.OrderNo?.trim().length > 0
              ? {
                match: {
                  orderId:
                    data?.dONo?.trim().length > 0
                      ? data?.dONo
                      : data?.OrderNo,
                },
              }
              : null,
            data?.customerId?.trim().length > 0 ||
              data?.CustomerId?.trim().length > 0
              ? {
                match: {
                  customerId:
                    data?.customerId?.trim().length > 0
                      ? data?.customerId
                      : data?.CustomerId,
                },
              }
              : null,
            data?.plant?.trim().length > 0
              ? {
                match: {
                  vendorId: data?.plant === 'BALCO' ? 1 : 9093,
                },
              }
              : null,
            data?.CustomerName?.trim().length > 0 ||
              data?.customerName?.trim().length > 0 ||
              data?.business_name
              ? {
                match: {
                  toPlantName:
                    data?.CustomerName?.trim().length > 0
                      ? data?.CustomerName
                      : data?.business_name
                        ? data?.business_name
                        : data?.customerName,
                },
              }
              : null,
              (
                data?.CustomerName?.trim()?.length > 0 ||
                data?.customerName?.trim()?.length > 0 ||
                data?.business_name
              ) ? (
                config.PROJECT_ENV === 'PROD'
                ? {
                    terms: {
                      buyerId: data?.business_id?.split(',').map(id => id.trim())
                    }
                  }
                : {
                    match: {
                      purchaseGroup: data?.business_id
                    }
                  }
              
              ) : null,
              
            // data?.OrderNo?.trim().length > 0
            //   ? {
            //       match: {
            //         orderNo: data?.OrderNo,
            //       },
            //     }
            //   : null,

            {
              match: {
                businessUnit: authData?.data?.businessUnit,
              },
            },
            !isCustomer &&
              authData?.data?.businessUnit === 'Aluminium' &&
              branchAccessData?.branchModules?.supplierType?.[0] === 'Rolled'
              ? {
                match: {
                  productType: 'Rolled',
                },
              }
              : null,
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
              branchAccessData?.branchModules?.supplierType?.[0] === 'Primary'
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
    setFilterData(data);
    setShowFilter(false);
  };
  const handleFilterCount = (count) => {
    setFilterCount(count);
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
          ]}>
          <Filter
            props={props}
            data={filterdata}
            fromListing={true}
            onClose={() => setShowFilter(false)}
            initialValues={filterData}
            onApply={handleApplyFilters}
            onReset={fetchData}
            resetFilter={resetFilter}
            onFilterCount={handleFilterCount}
          />
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
    try {
      console.log("this function hits");
      const sessionData = await AsyncStorage.getItem('@get_session');
      const getPlantId = await AsyncStorage.getItem('@plantId');
      let jsonSessionData = JSON.parse(sessionData);
      let plantId = JSON.parse(getPlantId);
      console.log("see this region", regionByPlants, " length", regionByPlants.length);

      const currentPage = dispatchDetails?.currentPage || 0;
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
        OrderNo: ''
      });
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
                : regionByPlants.length > 0
                  ? [
                    {
                      terms: {
                        buyerId: regionByPlants,
                      },
                    },
                  ]
                  : []),
              {
                match: {
                  businessUnit: authData?.data?.businessUnit,
                },
              },
              ...(
                !isCustomer &&
                  authData?.data?.businessUnit === 'Aluminium' &&
                  branchAccessData?.branchModules?.supplierType?.[0] === 'Rolled'
                  ? [
                    {
                      match: {
                        productType: 'Rolled',
                      },
                    },
                  ]
                  : []
              ),
            ],
            must_not: [
              {
                range: {
                  creationDate: {
                    lte: 1625134077000,
                  },
                },
              },
              ...(
                !isCustomer &&
                  authData?.data?.businessUnit === 'Aluminium' &&
                  branchAccessData?.branchModules?.supplierType?.[0] === 'Primary'
                  ? [
                    {
                      match: {
                        productType: 'Rolled',
                      },
                    },
                  ]
                  : []
              ),
            ],
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
    
      // const requestedPayload = {
      //   query: {
      //     bool: {
      //       must: [
      //         ...(isCustomer
      //           ? [
      //             {
      //               terms: {
      //                 buyerId: [plantId?.plantId],
      //               },
      //             },
      //           ]
      //           : regionByPlants.length > 0
      //             ? [
      //               {
      //                 terms: {
      //                   buyerId: regionByPlants,
      //                 },
      //               },
      //             ]
      //             : [
      //               // {
      //               //   terms: {
      //               //     buyerId: [1],
      //               //   },
      //               // },
      //             ]),
      //         {
      //           match: {
      //             businessUnit: authData?.data?.businessUnit,
      //           },
      //         },
      //         !isCustomer &&
      //           authData?.data?.businessUnit === 'Aluminium' &&
      //           branchAccessData?.branchModules?.supplierType?.[0] === 'Rolled'
      //           ? {
      //             match: {
      //               productType: 'Rolled',
      //             },
      //           }
      //           : null,
      //       ].filter(Boolean),
      //       must_not: [
      //         {
      //           range: {
      //             creationDate: {
      //               lte: 1625134077000,
      //             },
      //           },
      //         },
      //         ...(!isCustomer &&
      //           authData?.data?.businessUnit === 'Aluminium' &&
      //           branchAccessData?.branchModules?.supplierType?.[0] === 'Primary'
      //           ? {
      //             match: {
      //               productType: 'Rolled',
      //             },
      //           }
      //           : []),
      //       ].filter(Boolean),
      //     },
      //   },
      //   sort: [
      //     {
      //       documentDate: {
      //         order: 'desc',
      //       },
      //     },
      //     {
      //       invoiceNo: {
      //         order: 'desc',
      //       },
      //     },
      //   ],
      //   aggs: {
      //     statuses: {
      //       terms: {
      //         field: 'status',
      //         size: 20,
      //       },
      //     },
      //   },
      // };
      setRequestedPayload(requestedPayload);
      dispatch(
        getDispatchDetailsRequest({
          page: 1,
          pageSize: 10,
          requestedPayload,
        }),
      );
    }catch (err) {
      console.log("Error", err);
    }
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
      const data = await ScannerService.regionByPlants();
      console.log("Region by plants data", data);

      if (data?.data?.success) {
        setRegionByPlants(data?.data?.data);
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

  const onRefresh = async () => {
    //console.log('hit onrefresh data func');
    setSearchResults([]);
    setResetTrigger(true);
    setResetFilter(true);
    setRefreshing(true);
    setSearch('');
    setFilterCount(0);
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
      OrderNo: ''
    })
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let jsonSessionData = JSON.parse(sessionData);
    let plantId = JSON.parse(getPlantId);
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
              : regionByPlants.length > 0
              ? [
                  {
                    terms: {
                      buyerId: regionByPlants,
                    },
                  },
                ]
              : []),
            {
              match: {
                businessUnit: authData?.data?.businessUnit,
              },
            },
            ...(
              !isCustomer &&
              authData?.data?.businessUnit === 'Aluminium' &&
              branchAccessData?.branchModules?.supplierType?.[0] === 'Rolled'
                ? [
                    {
                      match: {
                        productType: 'Rolled',
                      },
                    },
                  ]
                : []
            ),
          ],
          must_not: [
            {
              range: {
                creationDate: {
                  lte: 1625134077000,
                },
              },
            },
            ...(
              !isCustomer &&
              authData?.data?.businessUnit === 'Aluminium' &&
              branchAccessData?.branchModules?.supplierType?.[0] === 'Primary'
                ? [
                    {
                      match: {
                        productType: 'Rolled',
                      },
                    },
                  ]
                : []
            ),
          ],
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

    // const requestedPayload = {
    //   query: {
    //     bool: {
    //       must: [
    //         ...(isCustomer
    //           ? [
    //             {
    //               terms: {
    //                 buyerId: [plantId?.plantId],
    //               },
    //             },
    //           ]
    //           : regionByPlants.length > 0
    //             ? [
    //               {
    //                 terms: {
    //                   buyerId: regionByPlants,
    //                 },
    //               },
    //             ]
    //             : [
    //               // {
    //               //   terms: {
    //               //     buyerId: [1],
    //               //   },
    //               // },
    //             ]),
    //         {
    //           match: {
    //             businessUnit: authData?.data?.businessUnit,
    //           },
    //         },
    //         ...(
    //         !isCustomer &&
    //           authData?.data?.businessUnit === 'Aluminium' &&
    //           branchAccessData?.branchModules?.supplierType?.[0] === 'Rolled'
    //           ? {
    //             match: {
    //               productType: 'Rolled',
    //             },
    //           }
    //             : []
    //         ),
    //       ],
    //       must_not: [
    //         {
    //           range: {
    //             creationDate: {
    //               lte: 1625134077000,
    //             },
    //           },
    //         },
    //         ...(!isCustomer &&
    //           authData?.data?.businessUnit === 'Aluminium' &&
    //           branchAccessData?.branchModules?.supplierType?.[0] === 'Primary'
    //           ? {
    //             match: {
    //               productType: 'Rolled',
    //             },
    //           }
    //           : []),
    //       ],
    //     },
    //   },
    //   sort: [
    //     {
    //       documentDate: {
    //         order: 'desc',
    //       },
    //     },
    //     {
    //       invoiceNo: {
    //         order: 'desc',
    //       },
    //     },
    //   ],
    //   aggs: {
    //     statuses: {
    //       terms: {
    //         field: 'status',
    //         size: 20,
    //       },
    //     },
    //   },
    // };
    dispatch(
      getDispatchDetailsRequest({ page: 1, pageSize: 10, requestedPayload }),
    );
    setRequestedPayload(requestedPayload);
    // fetchData();
    setRefreshing(false);
    setResetTrigger(false);
    // setShowRefreshModal(false);
  };

  const onEndReached = async () => {
    if (
      dispatchDetails?.status == STATE_STATUS.FETCHED &&
      dispatchDetails?.status != STATE_STATUS.FETCHING &&
      dispatchDetails?.currentPage < dispatchDetails?.totalPages
    ) {
      setResetFilter(false);
      const sessionData = await AsyncStorage.getItem('@get_session');
      const getPlantId = await AsyncStorage.getItem('@plantId');
      let jsonSessionData = JSON.parse(sessionData);
      let plantId = JSON.parse(getPlantId);
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
                : regionByPlants.length > 0
                ? [
                    {
                      terms: {
                        buyerId: regionByPlants,
                      },
                    },
                  ]
                : []),
      
              filterData?.invoiceNo?.trim().length > 0
                ? {
                    match: {
                      invoiceNo: filterData?.invoiceNo,
                    },
                  }
                : null,
      
              filterData?.fromDate?.trim().length > 0 && filterData?.toDate?.trim().length > 0
                ? {
                    range: {
                      documentDate: {
                        gte: convertDateToTimestamp(filterData?.fromDate) || 1726770600000,
                        lt: convertDateToEndOfDayTimestamp(filterData?.toDate) || 1727720999000,
                      },
                    },
                  }
                : null,
      
              filterData?.dONo?.trim().length > 0 || filterData?.OrderNo?.trim().length > 0
                ? {
                    match: {
                      orderId:
                        filterData?.dONo?.trim().length > 0
                          ? filterData?.dONo
                          : filterData?.OrderNo,
                    },
                  }
                : null,
      
              filterData?.customerId?.trim().length > 0 || filterData?.CustomerId?.trim().length > 0
                ? {
                    match: {
                      customerId:
                        filterData?.customerId?.trim().length > 0
                          ? filterData?.customerId
                          : filterData?.CustomerId,
                    },
                  }
                : null,
      
              authData?.data?.businessUnit === 'Aluminium' && filterData?.plant?.trim().length > 0
                ? {
                    match: {
                      vendorId: filterData?.plant === 'BALCO' ? 1 : 9093,
                    },
                  }
                : null,
      
              filterData?.CustomerName?.trim().length > 0 ||
              filterData?.customerName?.trim().length > 0 ||
              filterData?.business_name
                ? {
                    match: {
                      toPlantName:
                        filterData?.CustomerName?.trim().length > 0
                          ? filterData?.CustomerName
                          : filterData?.business_name
                          ? filterData?.business_name
                          : filterData?.customerName,
                    },
                  }
                : null,
      
             ( filterData?.CustomerName?.trim().length > 0 ||
              filterData?.customerName?.trim().length > 0 ||
               filterData?.business_name
             )?(
              config.PROJECT_ENV === 'PROD'
              ? {
                  terms: {
                    buyerId: filterData?.business_id?.split(',').map(id => id.trim())
                  }
                }
              : {
                  match: {
                    purchaseGroup: filterData?.business_id
                  }
                }
            
              ) : null,
              {
                match: {
                  businessUnit: authData?.data?.businessUnit,
                },
              },
      
              ...(
                !isCustomer &&
                authData?.data?.businessUnit === 'Aluminium' &&
                branchAccessData?.branchModules?.supplierType?.[0] === 'Rolled'
                  ? [
                      {
                        match: {
                          productType: 'Rolled',
                        },
                      },
                    ]
                  : []
              ),
            ].filter(Boolean),
      
            must_not: [
              {
                range: {
                  creationDate: {
                    lte: 1625134077000,
                  },
                },
              },
              ...(
                !isCustomer &&
                authData?.data?.businessUnit === 'Aluminium' &&
                branchAccessData?.branchModules?.supplierType?.[0] === 'Primary'
                  ? [
                      {
                        match: {
                          productType: 'Rolled',
                        },
                      },
                    ]
                  : []
              ),
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
      
      // const requestedPayload = {
      //   query: {
      //     bool: {
      //       must: [
      //         ...(isCustomer
      //           ? [
      //             {
      //               terms: {
      //                 buyerId: [plantId?.plantId],
      //               },
      //             },
      //           ]
      //           : regionByPlants.length > 0
      //             ? [
      //               {
      //                 terms: {
      //                   buyerId: regionByPlants,
      //                 },
      //               },
      //             ]
      //             : [
      //             ]),
      //         filterData?.invoiceNo?.trim().length > 0
      //           ? {
      //             match: {
      //               invoiceNo: filterData?.invoiceNo,
      //             },
      //           }
      //           : null,
      //         filterData?.fromDate?.trim().length > 0 && filterData?.toDate?.trim().length > 0
      //           ? {
      //             range: {
      //               documentDate: {
      //                 gte:
      //                   convertDateToTimestamp(filterData?.fromDate) || 1726770600000,
      //                 lt: convertDateToEndOfDayTimestamp(filterData?.toDate) || 1727720999000,
      //               },
      //             },
      //           }
      //           : null,
      //         filterData?.dONo?.trim().length > 0 || filterData?.OrderNo?.trim().length > 0
      //           ? {
      //             match: {
      //               orderId:
      //                 filterData?.dONo?.trim().length > 0
      //                   ? filterData?.dONo
      //                   : filterData?.OrderNo,
      //             },
      //           }
      //           : null,
      //         filterData?.customerId?.trim().length > 0 ||
      //           filterData?.CustomerId?.trim().length > 0
      //           ? {
      //             match: {
      //               customerId:
      //                 filterData?.customerId?.trim().length > 0
      //                   ? filterData?.customerId
      //                   : filterData?.CustomerId,
      //             },
      //           }
      //           : null,
      //         authData?.data?.businessUnit === 'Aluminium' && filterData?.plant?.trim().length > 0
      //           ? {
      //             match: {
      //               vendorId: filterData?.plant === 'BALCO' ? 1 : 9093,
      //             },
      //           }
      //           : null,
      //         filterData?.CustomerName?.trim().length > 0 ||
      //           filterData?.customerName?.trim().length > 0 ||
      //           filterData?.business_name
      //           ? {
      //             match: {
      //               toPlantName:
      //                 filterData?.CustomerName?.trim().length > 0
      //                   ? filterData?.CustomerName
      //                   : filterData?.business_name
      //                     ? filterData?.business_name
      //                     : filterData?.customerName,
      //             },
      //           }
      //           : null,
      //         filterData?.CustomerName?.trim().length > 0 ||
      //           filterData?.customerName?.trim().length > 0 ||
      //           filterData?.business_name
      //           ? {
      //             match: {
      //               purchaseGroup: filterData?.business_id,
      //               // groupCode: filterData?.business_id,
      //             },
      //           }
      //           : null,
      //         // data?.OrderNo?.trim().length > 0
      //         //   ? {
      //         //       match: {
      //         //         orderNo: data?.OrderNo,
      //         //       },
      //         //     }
      //         //   : null,    
      //         {
      //           match: {
      //             businessUnit: authData?.data?.businessUnit,
      //           },
      //         },
      //         !isCustomer &&
      //           authData?.data?.businessUnit === 'Aluminium' &&
      //           branchAccessData?.branchModules?.supplierType?.[0] === 'Rolled'
      //           ? {
      //             match: {
      //               productType: 'Rolled',
      //             },
      //           }
      //           : null,
      //       ].filter(Boolean),
      //       must_not: [
      //         {
      //           range: {
      //             creationDate: {
      //               lte: 1625134077000,
      //             },
      //           },
      //         },
      //         ...(!isCustomer &&
      //           authData?.data?.businessUnit === 'Aluminium' &&
      //           branchAccessData?.branchModules?.supplierType?.[0] === 'Primary'
      //           ? {
      //             match: {
      //               productType: 'Rolled',
      //             },
      //           }
      //           : []),
      //       ].filter(Boolean),
      //     },
      //   },
      //   sort: [
      //     {
      //       documentDate: {
      //         order: 'desc',
      //       },
      //     },
      //     {
      //       invoiceNo: {
      //         order: 'desc',
      //       },
      //     },
      //   ],
      //   aggs: {
      //     statuses: {
      //       terms: {
      //         field: 'status',
      //         size: 20,
      //       },
      //     },
      //   },
      // };


      // const requestedPayload = {
      //   query: {
      //     bool: {
      //       must: [
      //         {
      //           terms: {
      //             buyerId: [plantId?.plantId],
      //           },
      //         },
      //         {
      //           match: {
      //             businessUnit: authData?.data?.businessUnit,
      //           },
      //         },
      //       ],
      //     },
      //   },
      //   sort: [
      //     {
      //       documentDate: {
      //         order: 'desc',
      //       },
      //     },
      //     {
      //       invoiceNo: {
      //         order: 'desc',
      //       },
      //     },
      //   ],
      //   aggs: {
      //     statuses: {
      //       terms: {
      //         field: 'status',
      //         size: 20,
      //       },
      //     },
      //   },
      // };
      setRequestedPayload(requestedPayload);
      dispatch(
        getDispatchDetailsRequest({
          page: dispatchDetails?.currentPage + 1,
          pageSize: 10,
          requestedPayload,
        }),
      );
    }
  };

  const openSapReport = () => {
    setSapModal(true);
  };

  const closeSapReport = () => {
    setSapModal(false);
  };
  const showSAPReportModal = () => {
    return (
      <Modal
        visible={sapModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeSapReport}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.row]}>
              <Text style={styles.modalTitle}>SAP Data Report</Text>
              <TouchableOpacity
                onPress={closeSapReport}
                style={{
                  position: 'absolute',
                  right: 0,
                  zIndex: 1,
                }}>
                <AntDesign name="close" size={20} color="#363636" />
              </TouchableOpacity>
            </View>
            {/* <View style={styles.separator} /> */}

            <DatePickerInput
              placeholder={'DD/MM/YYYY'}
              formData={sapData['fromDate']}
              // index={index}
              label={'From Date'}
              handleInputChange={date => handleInputChange('fromDate', date)}
              textStyle={{
                backgroundColor: '#fff',
                height: Dimension.height40,
                borderColor: '#979797',
              }}
            />
            <DatePickerInput
              placeholder={'DD/MM/YYYY'}
              formData={sapData['toDate']}
              // index={index}
              label={'To Date'}
              handleInputChange={date => handleInputChange('toDate', date)}
              fromDate={sapData['fromDate']}
              disabled={!sapData['fromDate']}
              textStyle={{
                backgroundColor: '#fff',
                height: Dimension.height40,
                // paddingVertical: 0,
                borderColor: '#979797',
              }}
            />
            <TextInput
              // key={index}
              placeholder={'Plant'}
              placeholderTextColor={'#333333'}
              style={[styles.inputField]}
              value={sapData['plant'] || ''}
              onChangeText={text =>
                handleInputChange('plant', text.replace(filterTextRegex, ''))
              }
            />
            {/* </View> */}
            <FilterButton
              button1={'Reset'}
              button2={'Apply'}
              fromEditProfile
              firstButton={handleReset}
              secondButton={handleApply}
              disableButton2={isCtaDisabled()}
              enableButton
              textStyle={{
                paddingVertical: Dimension.padding6,
                paddingHorizontal: Dimension.padding10,
                width: '30%',
                height: Dimension.height35,
                marginTop: 0,
              }}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const handleSapReport = async sapObj => {
    try {
      setLoader(true)
      closeSapReport();

      //console.log(formattedDate(sapObj?.fromDate));

      const dataObj = {
        fromDate: formattedDate(sapObj?.fromDate),
        toDate: formattedDate(sapObj?.toDate),
        businessUnit: authData?.data?.businessUnit,
      };
      const data = await ScannerService.reportSAP(dataObj);
      //console.log('data sap', data);

      if (data?.data?.result?.successful && data?.status === 200) {
        setLoader(false);
        handleDownload(data?.data?.result?.url, 'SAP');
        Toast.show({
          type: 'success',
          text2: 'Exported Successfully',
          visibilityTime: 4000,
          autoHide: true,
        });

        // Alert.alert('yes');
        //console.log('Sap data', data);
      } else {
        setLoader(false)
        Toast.show({
          type: 'error',
          text2: 'Something Went Wrong',
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    } catch (err) {
      setLoader(false)
      //console.log('Error', err);
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
      const allHits = filteredData.flatMap(item => item.hits.hits);
      const searchTerms = search.split(",").map(term => term.trim());
      const matchingHits = allHits.filter(hit => {
        const orderId = hit._source.orderId?.toString();
        const invoiceNo = hit._source.invoiceNo?.toString();
        return searchTerms.includes(orderId) || searchTerms.includes(invoiceNo);
      });
      setSearchResults(matchingHits);
      console.log("all hists data", allHits);
      
    } catch (error) {
      console.error("Error during search:", error);
    }
  };



  // const handleSearch = async () => {
  //   try {
  //     const allHits = filteredData.flatMap(item => item.hits.hits);
  //     const matchingHits = allHits.filter(hit => {
  //       const orderId = hit._source.orderId?.toString();
  //       const invoiceNo = hit._source.invoiceNo?.toString();
  //       return orderId === search || invoiceNo === search;
  //     });
  //     console.log("matchingHits", search, ",", matchingHits);

  //     // setSearchResults(matchingHits);
  //   } catch (error) {
  //     console.error("Error during search:", error);
  //   }
  // };
  // const handleSearch = async () => {
  //   try {
  //     const sessionData = await AsyncStorage.getItem('@get_session');
  //     const getPlantId = await AsyncStorage.getItem('@plantId');
  //     let jsonSessionData = JSON.parse(sessionData);
  //     let plantId = JSON.parse(getPlantId);
  //     const orderId = search.startsWith('DEL');
  //     const invoiceNo = search.startsWith('F');
  //     //console.log('Order id search', orderId, invoiceNo);

  //     const requestedPayload = {
  //       query: {
  //         bool: {
  //           must: [
  //             ...(isCustomer
  //               ? [
  //                   {
  //                     terms: {
  //                       buyerId: [plantId?.plantId],
  //                     },
  //                   },
  //                 ]
  //               : regionByPlants.length > 0
  //               ? [
  //                   {
  //                     terms: {
  //   buyerId: regionByPlants,
  // },
  //                   },
  //                 ]
  //               : [
  //                   {
  //                     terms: {
  //                       buyerId: [1],
  //                     },
  //                   },
  //                 ]),
  //             search.startsWith('F')
  //               ? {
  //                   match: {
  //                     invoiceNo: search,
  //                   },
  //                 }
  //               : null,
  //             // data?.fromDate?.trim().length > 0 && data?.toDate?.trim().length > 0
  //             //   ? {
  //             //       range: {
  //             //         documentDate: {
  //             //           gte:
  //             //             convertDateToTimestamp(data?.fromDate) || 1726770600000,
  //             //           lt: convertDateToEndOfDayTimestamp(data?.toDate) || 1727720999000,
  //             //         },
  //             //       },
  //             //     }
  //             //   : null,
  //             search.startsWith('DEL')
  //               ? {
  //                   match: {
  //                     orderId: search,
  //                   },
  //                 }
  //               : null,
  //             {
  //               match: {
  //                 businessUnit: authData?.data?.businessUnit,
  //               },
  //             },
  //           ].filter(Boolean),
  //           must_not: [
  //             {
  //               range: {
  //                 creationDate: {
  //                   lte: 1625134077000,
  //                 },
  //               },
  //             },
  //           ],
  //         },
  //       },
  //       sort: [
  //         {
  //           documentDate: {
  //             order: 'desc',
  //           },
  //         },
  //         {
  //           invoiceNo: {
  //             order: 'desc',
  //           },
  //         },
  //       ],
  //       aggs: {
  //         statuses: {
  //           terms: {
  //             field: 'status',
  //             size: 20,
  //           },
  //         },
  //       },
  //     };
  //     dispatch(
  //       getDispatchDetailsRequest({
  //         page: 1,
  //         pageSize: 10,
  //         requestedPayload,
  //       }),
  //     );
  //     setRequestedPayload(requestedPayload);
  //   } catch (error) {
  //     //console.log('Error', error);
  //   }
  // };

  // const handleDownload = async url => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       //console.log('Downloading from URL:', url);
  //       const fileExtension = url.split('.').pop();

  //       const fileName = `downloaded_file.${fileExtension}`;
  //       const downloadDest =
  //         Platform.OS === 'android'
  //           ? `${RNFS.DownloadDirectoryPath}/${fileName}`
  //           : `${RNFS.DocumentDirectoryPath}/${fileName}`;

  //       const options = {
  //         fromUrl: url,
  //         toFile: downloadDest,
  //       };

  //       const response = await RNFS.downloadFile(options).promise;

  //       if (response.statusCode === 200) {
  //         //console.log('File downloaded successfully:', downloadDest);
  //         Toast.show({
  //           type: 'success',
  //           text2: `Download Complete, File saved to: ${downloadDest}`,
  //           visibilityTime: 4000,
  //           autoHide: true,
  //         });
  //         // Alert.alert('Download Complete', `File saved to: ${downloadDest}`);
  //       } else {
  //         //console.log('Download failed:', response);
  //         Toast.show({
  //           type: 'error',
  //           text2: `Failed to download file`,
  //           visibilityTime: 4000,
  //           autoHide: true,
  //         });
  //         // Alert.alert('Error', 'Failed to download file.');
  //       }
  //     } else {
  //       //console.log('Storage permission denied');
  //     }
  //   } catch (err) {
  //     //console.log('Download Error:', err);
  //     // Alert.alert('Error', 'Unable to download file.');
  //   }
  // };

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

  // const openRefreshModal = () => {
  //   setShowRefreshModal(!showRefreshModal);
  // };

  // const showRefresh = () => {
  //   return (
  //     <Modal
  //       visible={showRefreshModal}
  //       animationType="slide"
  //       transparent={true}
  //       onRequestClose={openRefreshModal}>
  //       <View
  //         style={[
  //           styles.modalOverlay,
  //           {
  //             flex: 1,
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //             backgroundColor: 'rgba(0, 0, 0, 0.5)',
  //             padding: Dimension.padding10,
  //           },
  //         ]}>
  //         <View style={[styles.row]}>
  //           <Text style={styles.modalTitle}>Credit Balance</Text>
  //           <TouchableOpacity onPress={openRefreshModal}>
  //             <AntDesign name="close" size={18} color="#363636" />
  //           </TouchableOpacity>
  //         </View>
  //         <View style={styles.separator} />
  //       </View>
  //     </Modal>
  //   );
  // };
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
    const billingNo = cardItem?._source?.billingNo;
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
        openLiveTrackingLinkCopper(fromPlantName, status, invoiceNo, billingNo, link);
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
    //console.log('see this', invoiceNo, link, name);

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
          const trackingUrl = `${CONSTANTS.URL_BASE_URL}/#/pages/inv/liveTracking?invoiceNo=${invoiceNo}&token=${info.token}`;
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
  console.log("Props.onReset", props.onReset, props);

  const openLiveTrackingLinkCopper = async (
    fromPlantName,
    status,
    invoiceNo,
    billingNo,
    link,
  ) => {
    if (status === 'In Transit' || status === 'Delivered') {
      let finalLink = '';
      if (link !== '' && fromPlantName !== '1200') {
        finalLink = link;
      } else if (fromPlantName === '1200') {
        finalLink = `${LIVE_TRACKING_LINK_COPPER}00${billingNo}`;
        console.log("billingNo check", billingNo, "finalLink", finalLink);

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
    if (item?.hits.hits.length > 0) {
      return item?.hits.hits.map((cardItem, cardIndex) => {
        const isVal = cardItem?._source?.vendorId === '1' ? 'BALCO' : 'VAL';
        let isValue = false;
        let truckColor = '#666';
        let isDisabled = true;

        if (isVal === 'VAL' && authData?.data?.businessUnit === 'Aluminium') {
          //console.log('yes hit VAL');
          isValue = isValAlTracking(
            cardItem?._source?.link,
            cardItem?._source?.transporterName,
          );
          truckColor = isValue ? '#EB9238' : '#666';
          isDisabled = !isValue;
        } else {
          const isColorSet = getColor(cardItem?._source?.status);
          truckColor = isColorSet;
          isDisabled = isColorSet === '#666';
        }
        return (
          <View style={styles.CardWrapper}>
            <View style={styles.statusWrap}>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <Text selectable={true} style={[styles.boldTxt]} >Delivery Order No:</Text>
                <Text
                  selectable={true}
                  selectionColor="#FF5733"
                  style={[styles.boldTxt, { marginLeft: 3, color: '#0063A7' }]} >
                  {cardItem?._source?.orderId}
                </Text>
              </View>
              <TouchableOpacity
                disabled={isDisabled}
                style={{ flexDirection: 'row' }}
                onPress={() => {
                  handleTrackingLink(
                    authData?.data?.businessUnit,
                    isVal,
                    cardItem,
                  );
                }}>
                <FontAwesome
                  name={'truck'}
                  size={18}
                  color={truckColor}
                  onPress={() => toggleDataModal(item)}></FontAwesome>

                <Text
                  style={[
                    styles.statustxt,
                    {
                      color: truckColor,
                    },
                  ]}>
                  Track here
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.boldTxt}>Invoice No.</Text>
                <Text selectable={true} selectionColor="#FF5733" style={styles.lightTxt}>
                  {cardItem?._source?.invoiceNo}
                </Text>
              </View>
              <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                <Text style={styles.boldTxt}>Invoice Qty</Text>
                <Text style={styles.lightTxt}>
                {roundToTwoDecimals(cardItem?._source?.ewayBillNumber)}
                 
                </Text>
              </View>
              
            </View>
            <View style={styles.row}>
            <View style={[styles.col, ]}>
                <Text style={styles.boldTxt}>Customer Id</Text>
                <Text style={styles.lightTxt}>
                {cardItem?._source?.customerId}
                 
                </Text>
              </View>
            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                <Text style={styles.boldTxt}>Customer Name</Text>
                <Text style={styles.lightTxt}>
                {cardItem?._source?.toPlantName}
                 
                </Text>
              </View>
              
              </View>
            <View style={styles.row}>
            <View style={[styles.col, ]}>
                <Text style={styles.boldTxt}>Invoice Date</Text>
                <Text style={styles.lightTxt}>
                  {convertedDate(cardItem?._source?.creationDate)}
                </Text>
              </View> 
            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                <Text style={styles.boldTxt}>Invoice Value</Text>
                <Text style={styles.lightTxt}>
                ₹ {formatIndianCurrency(cardItem?._source?.invoiceValue)} 
                </Text>
                </View>
                
          
            </View>
            <View style={styles.row}>
            <View style={[styles.col,]}>
                <Text style={styles.boldTxt}>From(Vedanta Plant)</Text>
                <Text style={styles.lightTxt}>
                  {' '}
                  {cardItem?._source?.fromPlantName}
                </Text>
              </View>
              <View style={[styles.col,  { marginLeft: Dimension.margin10 }]}>
                <Text style={styles.boldTxt}>To(Customer Plant)</Text>
                <Text style={styles.lightTxt}>
                  {' '}
                  {cardItem?._source?.customerId}
                  {'\n'}
                  {cardItem?._source?.toPlantName}
                </Text>
              </View>

             
            </View>
            <View style={styles.row}>
            <View style={[styles.col, ]}>
                <Text style={styles.boldTxt}>Parent DO/SO No</Text>
                <Text style={styles.lightTxt}>
                  {cardItem?._source?.parentDoId && cardItem?._source?.parentDoId !== 'null'
                    ? cardItem?._source?.parentDoId
                    : ''}
                  {'\n'}
                  {cardItem?._source?.parentSapOrderNumber && cardItem?._source?.parentSapOrderNumber !== 'null'
                    ? cardItem?._source?.parentSapOrderNumber
                    : ''}
                </Text>

              </View>
              <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                <Text style={styles.boldTxt}>Transporter Name</Text>
                <Text style={styles.lightTxt}>
                  {cardItem?._source?.transporterName}
                </Text>
              </View>
              
            </View>
            <View style={[styles.row]}>
            <View style={[styles.col,]}>
                <Text style={styles.boldTxt}>Truck Number</Text>
                <Text style={styles.lightTxt}>
                  {cardItem?._source?.vehicleNumber}
                  {/* {item.dispatchCompany == '1' || item.dispatchCompany == 'BALC'
                ? 'BALC'
                : 'VALC'} */}
                </Text>
              </View>
              <View style={[styles.col,{ marginLeft: Dimension.margin10 }]}>
                <Text style={styles.boldTxt}>Driver Name</Text>
                <Text style={styles.lightTxt}>
                  {cardItem?._source?.driverName}
                </Text>
              </View>
              
            </View>
            <View style={[styles.row, { paddingBottom: Dimension.padding15 }]}>
            <View style={[styles.col, ]}>
                <Text style={styles.boldTxt}>Driver Contact Number</Text>
                <Text style={styles.lightTxt}>
                  {cardItem?._source?.driverNo}
                </Text>
              </View>
              <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                <Text style={styles.boldTxt}>LR Number</Text>
                <Text style={styles.lightTxt}>
                  {' '}
                  {cardItem?._source?.lrNumber}
                </Text>
              </View>
             </View>
            <View style={[styles.row, { paddingBottom: Dimension.padding15 }]}>
         
              <View style={[styles.col,]}>
                <Text style={styles.boldTxt}>Shipment Date</Text>
                <Text style={styles.lightTxt}>
                  {' '}
                  {convertedDate(cardItem?._source?.creationDate)}
                </Text>
              </View>
            </View>
            <View style={styles.statusWrap}></View>
            <CardFooter
              data={cardData}
              cardItem={cardItem}
              cardItemData={cardItem?._source}
              index={cardIndex}
            />
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
        showText={'Dispatch Details'}
        showLogout={
          props?.route.params && props?.route.params.URL ? false : true
        }
        auth={auth}
        canGOBack={props?.route.name == 'WebView' ? false : true}
        showExportData={true}
        exportData={handleExportData}
      />
      {loader && (
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
                placeholderTextColor={"#c7c7c7"}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity
                onPress={openFilterComp}
                style={styles.searchbtn}>
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
        {search.length? (
          <FlatList
            data={formattedData}
            renderItem={renderItem}
            contentContainerStyle={{
              padding: Dimension.padding15,
              paddingTop: 0,
            }}
            keyExtractor={(item, index) => `${index}-item`}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={{
              marginBottom: isCustomer ? 130 : 195,
            }}
          />
        ) :
          (<FlatList
            data={dispatchDetailsData}
            renderItem={renderItem}
            contentContainerStyle={{
              padding: Dimension.padding15,
              paddingTop: 0,
            }}
            keyExtractor={(item, index) => `${index}-item`}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.7}
            alwaysBounceVertical={true}
            bounces={true}
            ListFooterComponent={() => {
              return dispatchDetails?.status === STATE_STATUS.FETCHING ? (
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
          />)}
        {/* {showRefreshModal && showRefresh()} */}

        {/* )}  */}
      </View>
    </View>
  );
};
export default DispatchDetailsScreen;
// export default React.memo(DispatchDetailsScreen);
