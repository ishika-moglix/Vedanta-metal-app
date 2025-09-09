import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import Dimension from '../../Theme/Dimension';
import CONSTANTS from '../../services/constant';
import styles from './style';
import Header from '../../component/Header';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScannerService } from '../../services/scannerService';
import { setAuth } from '../../redux/feature/authslice';
import { STATE_STATUS } from '../../redux/constants';
import ENV from '../../services/url';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../services';
// import analytics from '@react-native-firebase/analytics';

const VOCScreen = props => {
    const auth = useSelector(state => state.auth);
    const [userType, setUserType] = useState(false);
    const [user, setUser] = useState({});
    const dispatch = useDispatch();
    const authData = useSelector(state => state.auth.data);
    const { status, data } = useSelector(state => state.auth);
    useEffect(() => {
        checkDetail();
        getData();
    }, []);


    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user_info');
            if (jsonValue) {
                let info = JSON.parse(jsonValue);
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


    const openOrders = async () => {
        const jsonValue = await AsyncStorage.getItem('@user_info');
        if (jsonValue) {
            const getPlantId = await AsyncStorage.getItem('@plantId');
            let info = JSON.parse(jsonValue);
            let plantId = JSON.parse(getPlantId);

            let navURL = `${ENV[config.PROJECT_ENV].URL}/#/pages/orders/po-list?token=${info.token}&plantId=${plantId?.plantId}`;

            console.log('orders url', navURL);
            props?.navigation.push('WebView', {
                URL: navURL,
                // fromExp: 'exploreText',
                showBack: true,
            });
        }
    };
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header
                navigation={{
                    ...props?.navigation,
                    goBack: () => props?.navigation.pop(),
                }}
                showBack
                showText={'Voice Of Customers'}
                showLogout={
                    props?.route.params && props?.route.params.URL ? false : true
                }
                auth={auth}
                canGOBack={props?.route.name == 'WebView' ? false : true}
            />
            <ScrollView
                style={{
                    flex: 1,
                    padding: Dimension.padding15,
                    backgroundColor: '#F7F7F7',
                    paddingTop: Dimension.padding20,

                }}
                contentContainerStyle={{
                    paddingBottom: Dimension.padding80,
                }}>
                <TouchableOpacity
                    style={styles.btnWrap}
                    onPress={() => {
                        props?.navigation.push('NewComplaint');
                    }}>
                    <Text style={styles.btnTxt}>New Complaint</Text>
                    <MaterialCommunityIcon
                        name={'chevron-right'}
                        color={'#363636'}
                        size={24}></MaterialCommunityIcon>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnWrap}
                    onPress={() => {
                        props?.navigation.push('Complaint');
                    }}>
                    <Text style={styles.btnTxt}>Complaint List</Text>
                    <MaterialCommunityIcon
                        name={'chevron-right'}
                        color={'#363636'}
                        size={24}></MaterialCommunityIcon>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default VOCScreen;
