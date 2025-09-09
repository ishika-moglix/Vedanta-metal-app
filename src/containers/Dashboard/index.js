import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import Header from '../../component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import ChartView from 'react-native-highcharts';
import HeaderTab from '../../component/HeaderTabs';
import styles from './style';
import { useSelector, useDispatch } from 'react-redux';
import Dashboard from './dashboard';
import PendingTaskScreen from './pendingTasks';
import { getPendingTasksRequest } from '../../redux/feature/dashboardSlice';
import { STATE_STATUS } from '../../redux/constants';
import CustomLoader from '../../component/customLoader';
const DashboardScreen = (props) => {
  const dispatch = useDispatch();
  const [userType, setUserType] = useState(false);
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState('');
  const authData = useSelector(state => state.auth);
  const branchAccessData = useSelector(state => state.branchAccess)
  const pendingTasksData = useSelector(state => state.dashboard?.pendingtasks?.data)
  const pendingTasksStatus = useSelector(state => state.dashboard?.pendingtasks?.status)
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    getSession();
    checkDetail();
    getData();
    getPendingTasks();
  }, []);

  const totalCount = pendingTasksStatus === STATE_STATUS?.FETCHED
      ? (
          (pendingTasksData?.[0]?.contractNFAPending?.data?.length || 0) +
          (pendingTasksData?.[0]?.openVOC?.data?.length || 0) +
          (pendingTasksData?.[0]?.pendingCustomer?.data?.length || 0) +
          (pendingTasksData?.[0]?.pendingDO?.data?.length || 0) +
          (pendingTasksData?.[0]?.pendingDraftMOU?.data?.length || 0) +
          (pendingTasksData?.[0]?.pendingLcBg?.data?.length || 0) +
          (pendingTasksData?.[0]?.pendingNFA?.data?.length || 0) +
          (pendingTasksData?.[0]?.pendingPO?.data?.length || 0) +
          (pendingTasksData?.[0]?.pendingPriceBooking?.data?.length || 0) +
          (pendingTasksData?.[0]?.pendingSpotDO?.data?.length || 0)
        )
    : 0;
  
  const getPendingTasks = async () => {
    console.log("hit getPendingTasks");
    // setLoader(true);
    const dataObj ={
      businessUnit: authData?.data?.businessUnit,
      userId: authData?.data?.userId || authData?.data?.idUser,
      status: null,
      regionFilter: [],
      roles: branchAccessData?.data?.branchModules?.roleNames
  }
    dispatch(
      getPendingTasksRequest({dataObj})
    )
    // setLoader(false);
  }
  const getSession = async () => {
    let jsonValue = await AsyncStorage.getItem('@user_info');
    jsonValue = jsonValue != null ? JSON.parse(jsonValue) : null;
    // setAuth(jsonValue);
    // CallSession(jsonValue);
  };

  const headerTabsData = {
    dashboard: {
      name: 'Dashboard',
      key: 'Dashboard'
    },
    pendingTasks: {
      name: `Pending Outstanding Task (${totalCount})`,
      key: 'Pendingtask'
    },
  }
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_info');
      if (jsonValue) {
        let info = JSON.parse(jsonValue);

        setUser(info);
      }
    } catch (e) {
      console.log(e);
      // error reading value
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
  var Highcharts = 'Highcharts';
  var conf = {
    chart: {
      type: 'spline',
      animation: Highcharts.svg,
      marginRight: 10,
      events: {
        load: function () {
          var series = this.series[0];
          setInterval(function () {
            var x = new Date().getTime(),
              y = Math.random();
            series.addPoint([x, y], true, true);
          }, 1000);
        },
      },
    },
    title: {
      text: '',
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150,
    },
    yAxis: {
      title: {
        text: 'Value',
      },
      plotLines: [
        {
          value: 0,
          width: 1,
          color: '#808080',
        },
      ],
    },
    tooltip: {
      formatter: function () {
        return (
          '<b>' +
          this.series.name +
          '</b><br/>' +
          Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +
          '<br/>' +
          Highcharts.numberFormat(this.y, 2)
        );
      },
    },
    legend: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    series: [
      {
        name: 'Random data',
        data: (function () {
          var data = [],
            time = new Date().getTime(),
            i;

          for (i = -19; i <= 0; i += 1) {
            data.push({
              x: time + i * 1000,
              y: Math.random(),
            });
          }
          return data;
        })(),
      },
    ],
  };

  const options = {
    global: {
      useUTC: false,
    },
    lang: {
      decimalPoint: ',',
      thousandsSep: '.',
    },
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <Dashboard
            {...props}
            // filterData={filterData}
            // resetFilter={setResetFilter}
            // filteredData={setFilterData}
            // searchResults={setSearchResultsMou}
            // searchResultsData={searchResultsMou}
            // searchKey={search}
            // setSearchKey={setSearch}
            // filterCount={setFilterCount}
           
          />
        );
      case 'Pendingtask':
        return (
          <PendingTaskScreen {...props}
            // filterData={filterData}
            // resetFilter={setResetFilter}
            // filteredData={setFilterData}
            // searchResults={setSearchResultsDraft}
            // searchResultsData={searchResultsNfa}
            // filterCount={setFilterCount}
            // searchKey={search}
            // setSearchKey={setSearch}
          />
        );
  default:
        return null;
    }
  };

  const handleTabChange = selectedKey => {
    setActiveTab(selectedKey);
    // setSearch('');
    console.log('Selected Tab:', selectedKey);
  };
  return (
    <>
   
    <View style={styles.containerWrap}>
     {pendingTasksStatus === STATE_STATUS?.FETCHING && (<CustomLoader fullScreen />)}
      <Header
        showLogo
        showPlant={!props?.route?.params?.fromExp}
        showNotification={!props?.route?.params?.fromExp}
        showScanner={!props?.route?.params?.fromExp}
        auth={authData}
        showFolder={!props?.route?.params?.fromExp}
        showCart
        canGOBack={props?.route.name == 'WebView' ? false : true}
        navigation={{
          ...props?.navigation,
          goBack: () => props?.navigation.pop(),
        }} />
      <View style={styles.TopWrap}>
        <>
          <View style={[styles.SearchWraps]}>
            <HeaderTab headerData={headerTabsData} onTabChange={handleTabChange} activeTabKey={props?.route?.params?.activeTabKey || 1} />
          </View>
        </>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: '#F4F4F4',
          }}
          contentContainerStyle={
            {
              //  paddingBottom: Dimension.padding20,
            }
          }>
          {/* <ChartView
          style={{height: 300}}
          config={conf}
          options={options}></ChartView> */}
        </ScrollView>
      </View>
      {renderForm()}
          
      </View>
      </>
  );
};

export default DashboardScreen;
