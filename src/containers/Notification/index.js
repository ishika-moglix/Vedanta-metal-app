import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import { FlatList, StyleSheet } from 'react-native';
// import Swipeable  from 'react-native-gesture-handler';
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
import HeaderTab from '../../component/HeaderTabs';
import Toast from 'react-native-toast-message';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import style from './style';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import axios from 'axios';
import { formatTimeStatus } from '../../utils/BiometricAuth';
import { setNotiCount } from '../../redux/feature/notification';
import CustomLoader from '../../component/customLoader';
// import analytics from '@react-native-firebase/analytics';

const NotificationScreen = props => {
    const auth = useSelector(state => state.auth);
    const notiCount = useSelector(state => state?.notification?.notiCount)
    const branchAccessData = useSelector(state => state.branchAccess);

    const [userType, setUserType] = useState(false);
    const [user, setUser] = useState({});
    const dispatch = useDispatch();
    const authData = useSelector(state => state.auth.data);
    const { status, data } = useSelector(state => state.auth);
    const [activeTabs, setActiveTab] = useState('');
    // const [notiCount, setNotiCount] = useState(0);
    const [viewAllList, setViewAllList] = useState([
    ]);
    const [viewMouList, setViewMouList] = useState([]);
    const [viewDOLists, setViewDOList] = useState([]);
    const [viewComplaintLists, setViewComplaintList] = useState([]);
    const [viewPoList, setViewPoList] = useState([]);
    const [viewDispatchLists, setViewDispatchLists] = useState([]);
    const [viewReportsList, setViewReportsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRead, setRead] = useState(false);
    const headerData = {
        All: {
            name: 'All',
            key: 'all',
        },
        MOUApprovals: {
            name: 'MOU Approvals',
            key: 'MOUApprovals',
        },
        DOs: {
            name: 'DOs',
            key: 'DOs',
        },
        Complaint: {
            name: 'Complaint',
            key: 'Complaint',
        },
        Dispatch: {
            name: 'Dispatch',
            key: 'Dispatch',
        },
        POs: {
            name: 'POs',
            key: 'POs',
        },
        Reports: {
            name: 'Reports',
            key: 'Reports',
        },
    };

    useEffect(() => {
        checkDetail();
        getData();
    }, []);

    useEffect(() => {
        getNotification();
        // notificationCount();
    }, [])

    const notificationCount = async () => {
        try {
            const dataObj = {
                userId: authData?.userId || authData?.idUser
            }
            const data = await ScannerService.getUnreadCount(dataObj)
            console.log("data noti count", data?.data.data.unreadCount);

            dispatch(
                setNotiCount({
                    status: STATE_STATUS.FETCHED,
                    data: data?.data.data,
                    notiCount: data?.data.data.unreadCount
                }),
            );
            //  setNotiCount(data?.data.data.unreadCount)
        } catch (err) {
            console.log("Error",);

        }
    }

    const getNotification = async () => {
        try {
            setIsLoading(true);
            const sessionData = await AsyncStorage.getItem('@get_session');
            const getPlantId = await AsyncStorage.getItem('@plantId');
            let jsonSessionData = JSON.parse(sessionData);
            let plantId = JSON.parse(getPlantId);
            const dataObj = {
                userId: authData?.userId || authData?.idUser
            };
            const response = await ScannerService.getNotifications(dataObj);
            const notifications = response?.data || [];
            console.log("noti data", notifications);
            
            setViewAllList(notifications);
            setViewMouList(notifications.filter(n => n.type?.toLowerCase() === 'mou'));
            setViewDOList(notifications.filter(n => n.type?.toLowerCase() === 'do'));
            setViewPoList(notifications.filter(n => n.type?.toLowerCase() === 'po'));
            setViewDispatchLists(notifications.filter(n => n.type?.toLowerCase() === 'dispatch'));
            setViewReportsList(notifications.filter(n => n.type?.toLowerCase() === 'reports'));
            setViewComplaintList(
                notifications.filter(n => {
                    const type = n.type?.toLowerCase();
                    return type === 'voc';
                })
            );
            
        } catch (err) {
            setIsLoading(false);
            console.log("Error", err);
        } finally {
            setIsLoading(false);
        }
    };

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

    const groupNotificationsByDate = (notifications) => {
        const grouped = {};

        (Array.isArray(notifications) ? notifications : []).forEach((noti) => {
            const dateObj = new Date(noti.sentAt);
            const dateKey = dateObj.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short'
            });

            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }

            grouped[dateKey].push({
                ...noti,
                dateFormatted: formatTimeStatus(noti.sentAt),
            });
        });

        return Object.entries(grouped)
            .map(([date, items]) => ({
                date,
                items: items.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt)),
            }))
            .sort((a, b) => new Date(b.items[0].sentAt) - new Date(a.items[0].sentAt));
    };

    const handleRemove = async (id, typeId, type) => {
        try {
           const dataObj = {
                typeId: id
            }
            const data = await ScannerService.deleteNoti(dataObj);
            if (data?.data?.successful) {
                await notificationCount();
                console.log("hit delete");
                if (type === 'all' || type === 'All') {
                    setViewAllList(prev => prev.filter(item => item.id !== id));
                } else if (type === 'MOUApprovals') {
                    setViewMouList(prev => prev.filter(item => item.id !== id));
                } else if (type === 'POs' || type === 'Pos') {
                    setViewPoList(prev => prev.filter(item => item.id !== id));
                } else if (type === 'Dispatch') {
                    setViewDispatchLists(prev => prev.filter(item => item.id !== id));
                } else if (type === 'Reports') {
                    setViewReportsList(prev => prev.filter(item => item.id !== id));
                } else if (type === 'dos' || type === 'DOs') {
                    setViewDOList(prev => prev.filter(item => item.id !== id));
                } else if (type === 'voc' || type ==='Complaint' ) {
                    setViewComplaintList(prev => prev.filter(item => item.id !== id));
                }
            }
        } catch (err) {
            console.log("Error", err);
        }
    };
    const readNotification = async (id, typeId, type, activeTab, redirectUrl) => {
        try {
            const jsonValue = await AsyncStorage.getItem('@user_info');
            const getPlantId = await AsyncStorage.getItem('@plantId');
            let info = JSON.parse(jsonValue);
            let plantId = JSON.parse(getPlantId);
            
            const dataObj = {
                typeId: id
            }
            const data = await ScannerService.markAsRead(dataObj);
          
            // if (type === 'po' || type === 'do' || type === 'complaints' || type === 'reports') {
            //     const exp_url = redirectUrl + '?token=' + info.token
            //     console.log(exp_url, "exp url");
            //         props?.navigation.push('WebView', {
            //             URL: exp_url,
            //             showBack: true
            //             // fromExp: 'exploreText',
            //         });
            //    } else {
            //     console.log(type, "type redirection");
                
            //     if(type === 'voc')
            //      !branchAccessData?.isCustomer? props?.navigation?.navigate('Complaint') :  props?.navigation?.navigate('Feed');
            //     if (type === 'mou')
            //         props?.navigation?.navigate('Contract',{activeTabKey: '1'});
            //     if (type === 'dispatch')
            //         props?.navigation?.navigate('DispatchDetails');
            //     if (type === 'nfa')
            //         props?.navigation?.navigate('Contract', {activeTabKey: '2'});
            // }
            if (data?.data?.successful) {
                // setRead(true);
                getNotification();
                dispatch(
                    setNotiCount({
                        status: STATE_STATUS.FETCHED,
                        data: data?.data?.data,
                        notiCount: data?.data?.data?.unreadCount
                    }),
                );
                if (type === 'po' || type === 'do' || type === 'complaints' || type === 'reports' || type === 'POs' || type ==='DOs' || type === 'Complaints' || type === 'Reports') {
                    const exp_url = redirectUrl + '?token=' + info.token
                    console.log(exp_url, "exp url");
                        props?.navigation.push('WebView', {
                            URL: exp_url,
                            showBack: true
                            // fromExp: 'exploreText',
                        });
                } else {
                    if(type === 'voc')
                        !branchAccessData?.isCustomer? props?.navigation?.navigate('Complaint') :  props?.navigation?.navigate('Feed');
                    if (type === 'mou')
                        props?.navigation?.navigate('Contract',{activeTabKey: '1'});
                    if (type === 'dispatch')
                        props?.navigation?.navigate('DispatchDetails');
                    if (type === 'nfa')
                        props?.navigation?.navigate('Contract', {activeTabKey: '2'});
                }
            }
        } catch (err) {
            console.log("Error", err);
        }
    };

    const renderTabContent = () => {
        let dataToRender = [];

        switch (activeTabs) {
            case 'MOUApprovals':
                dataToRender = viewMouList;
                break;
            case 'DOs':
                dataToRender = viewDOLists;
                break;
            case 'Complaint':
                dataToRender = viewComplaintLists;
                break;
                case 'POs':
                    dataToRender = viewPoList;
                break;
                case 'Reports':
                    dataToRender = viewReportsList;
                break;
                case 'Dispatch':
                    dataToRender = viewDispatchLists;
                    break;
            case 'all':
            default:
                dataToRender = viewAllList;
                break;
        }
        const groupedData = groupNotificationsByDate(dataToRender);
        return (
            <ScrollView>
                {groupedData.map(({ date, items }) => (
                    <View key={date}>
                        <View style={styles.container}>
                            <Text style={[styles.date, { color: '#3C3C3C', fontWeight: 'bold' }]}>
                                {date}
                            </Text>
                        </View>
                        {items.map((item, index) => (
                            <SwipeRow key={`${item.id}_${index}`} rightOpenValue={Platform.OS === 'ios' ? -85 : -75} disableRightSwipe>
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => handleRemove(item?.id,item.typeId, activeTabs)}
                                >
                                    <MaterialCommunityIcon name="close-circle-outline" size={18} color="white" />
                                    <Text style={styles.removeText}>Remove</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={1}
                                    onPress={() => readNotification(item?.id, item.typeId, item.type,  activeTabs, item.redirectUrl)}
                                    style={[styles.cardContainer, { backgroundColor: item.read  ? '#fff' : '#F0F7FF' }]}>
                                    <Text style={styles.textHeading}>
                                        {item?.type?.toUpperCase()} {item?.title}
                                    </Text>
                                    <Text style={styles.text}>{item.body}</Text>
                                    <Text style={styles.date}>{item.dateFormatted}</Text>
                                </TouchableOpacity>
                            </SwipeRow>
                        ))}
                    </View>
                ))}
            </ScrollView>
        );
    };

    const handleTabSelect = (id) => {
        setTabs(prev =>
            prev.map(tab => ({ ...tab, selected: tab.id === id }))
        );
    };

    const handleTabChange = selectedKey => {
        setActiveTab(selectedKey);
        console.log('Selected Tab:', selectedKey);
    };

    const renderNotificationContent = () => {
        return (
            <>
                {isLoading && <CustomLoader fullScreen/>}
                <View style={[styles.SearchWraps]}>
                    <HeaderTab headerData={headerData} onTabChange={handleTabChange} activeTabKey={0} />
                </View>
                {renderTabContent()}
            </>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F7F7F7', }}>
            <Header
                navigation={{
                    ...props?.navigation,
                    goBack: () => props?.navigation.pop(),
                }}
                showBack
                showText={`Notifications (${notiCount ?? 0})`}
                showLogout={
                    props?.route.params && props?.route.params.URL ? false : true
                }
                auth={auth}
                canGOBack={props?.route.name == 'WebView' ? false : true}
            />
            {renderNotificationContent()}
        </View>
    )
};

export default NotificationScreen;
