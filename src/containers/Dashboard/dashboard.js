import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import Header from '../../component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import ChartView from 'react-native-highcharts';
import HeaderTab from '../../component/HeaderTabs';
import styles from './style';
import { useSelector, useDispatch } from 'react-redux';
import { Dimension } from 'mog-react-native-form-fields';

const Dashboard = (props) => {
  const [userType, setUserType] = useState(false);
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState('');
  const authData = useSelector(state => state.auth?.data)
  useEffect(() => {
    checkDetail();
    getData();
  }, []);

  useEffect(() => {
    getSession();
  }, []);

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
      name: 'Pending Outstanding Task (12)',
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

  return (
    <View style={styles.containerWrap}>
      <Text style={{
        fontFamily: Dimension.CustomExtraBoldFont,
        fontSize: Dimension.font20,
        padding: Dimension.padding15,
        color: '#363636',
        fontWeight: '600'
      }}>
        Dashboard is not available on mobile. Please use a desktop to continue.
      </Text>
      <View style={styles.TopWrap}>

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
    </View>
  );
};

export default Dashboard;
