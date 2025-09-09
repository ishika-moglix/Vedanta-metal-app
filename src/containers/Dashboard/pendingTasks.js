

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import Dimension from '../../Theme/Dimension';
import Colors from '../../Theme/Colors';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { STATE_STATUS } from '../../redux/constants';
import CONSTANTS from '../../services/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PendingTaskScreen = props => {
    const dispatch = useDispatch();
    const isCustomer = useSelector(state => state.branchAccess?.isCustomer);
    const pendingTasksData = useSelector(state => state.dashboard?.pendingtasks?.data);
    const pendingTasksStatus = useSelector(state => state.dashboard?.pendingtasks?.status);

    const [formattedData, setFormattedData] = useState([]);
    const [visibleSections, setVisibleSections] = useState({});
    const titleMap = {
        contractNFAPending: 'Contract NFA',
        pendingNFA: 'Others NFA',
        pendingDraftMOU: 'Draft Contract',
        pendingCustomer: 'Customer Registration / Modification',
        pendingPO: 'PO Approval',
        pendingPriceBooking: 'Price Booking Approvals',
        pendingDO: 'DO Approval',
        pendingSpotDO: 'Spot DO Approval',
        openVOC: 'Voice of Customer',
        pendingLcBg: 'LC/BG Tasks',
    };

    useEffect(() => {
        const formattedData =
            pendingTasksStatus === STATE_STATUS?.FETCHED
                ? Object.entries(pendingTasksData?.[0])
                      .filter(([_, value]) => value?.data?.length)
                      .map(([title, value]) => ({
                          title: titleMap[title] || title,
                          data: value.data,
                      }))
                : [];
        setFormattedData(formattedData);
    }, [pendingTasksStatus, pendingTasksData]);

    const toggleSectionVisibility = useCallback(title => {
        setVisibleSections(prev => ({
            ...prev,
            [title]: !prev[title], 
        }));
    }, []);
    const handleAct = useCallback(async (id, type) => {
        try {
            const userInfo = await AsyncStorage.getItem('@user_info');
            const info = JSON.parse(userInfo);
            if (type === 'Contract NFA') {
                props?.navigation?.push('Contract',{contractiId: id, activeTabKey: 1 });
            }
            if (type === 'Others NFA') {
                props?.navigation?.push('Contract', { nfaId: id, activeTabKey: 2 });
            }
            if (type === 'Draft Contract') {
                props?.navigation?.push('Contract', { draftId: id, activeTabKey: 0 });
            }
            if (type === 'Customer Registration / Modification') {
                props?.navigation?.push('Customer&Registration', { regId: id });
            }
            if (type === 'Voice of Customer') {
                props?.navigation?.push('NewComplaint', { vocId: id });
            }
            if (type === 'PO Approval') {
                const exp_url = `${CONSTANTS.URL_BASE_URL}/#/pages/orders/po-list?poId=${id}&token=${info.token}`;
                props?.navigation.push('WebView', { URL: exp_url, showBack: true });
            }
            if (type === 'DO Approval' || type === 'Spot DO Approval') {
                const exp_url = `${CONSTANTS.URL_BASE_URL}/#/pages/orders/delivery?doId=${id}&token=${info.token}`;
                props?.navigation.push('WebView', { URL: exp_url, showBack: true });
            }
        } catch (err) {
            console.log('Error', err);
        }
    }, [props.navigation]);

    const getTitleLabel = useCallback((title, id) => {
        switch (title) {
            case 'Contract NFA':
                return 'Approval Pending NFA';
            case 'Others NFA':
                return 'Approval Pending';
            case 'Draft Contract':
                return 'Approval Pending Draft Contract';
            case 'Customer Registration / Modification':
                return id? `${id}` : '';
            case 'PO Approval':
                return `PO Id : ${id}`;
            case 'DO Approval':
                return `DO Id. : ${id}`;
            case 'LC/BG Tasks':
                return `${id}`;
            case 'Spot DO Approval':
                return `Order ID : ${id}`;
            case 'Voice of Customer':
                    return `${id}`;
            default:
                return title;
        }
    }, []);

    const renderCard = useCallback(
    
        ({ item: cardItem, sectionTitle }) => (
            // {console.log(item, "item see here")}
            <View style={styles.CardWrapper}>
               
                <TouchableOpacity
                    style={styles.statusWrap}
                    onPress={() => handleAct(cardItem?.id, sectionTitle)}
                >
                    <Text style={[styles.boldTxt, { alignSelf: 'center' }]}>
                        {getTitleLabel(sectionTitle, cardItem?.id)}
                    </Text>
                    <Text style={styles.loginBtn}>Act</Text>
                </TouchableOpacity>
                <View style={styles.row}>
                                    <View style={styles.col}>
                                        {sectionTitle === 'Customer Registration / Modification' ?
                                            <Text style={styles.lightTxt}>Registration</Text> :
                                            sectionTitle === 'PO Approval' ?
                                                <Text style={styles.lightTxt}>PO Qty</Text> :
                                                sectionTitle === 'DO Approval' || sectionTitle === 'Spot DO Approval' ?
                                                    <Text style={styles.lightTxt}>DO Qty</Text> :
                                                    sectionTitle === 'Voice of Customer' ?
                                                        <Text style={styles.lightTxt}>Feedback</Text> :
                                                        sectionTitle === 'LC/BG Tasks' ?
                                                            <Text style={styles.lightTxt}>Type</Text> :
                                                            <Text style={styles.lightTxt}>Contract No.</Text>
                                        }
                                        {sectionTitle === 'Spot DO Approval' || sectionTitle === 'DO Approval' || sectionTitle === 'PO Approval' ?
                                            <Text style={[styles.boldTxt,]}>{cardItem?.quantity}</Text> :
                                            sectionTitle === 'LC/BG Tasks' ?
                                                <Text style={[styles.boldTxt,]}>{cardItem?.lcbgType}</Text> :
                                                <Text style={[styles.boldTxt,]}>{cardItem?.id}</Text>
                                        }
                                    </View>
                                    <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                        {sectionTitle === 'Voice of Customer' ?
                                            <Text style={styles.lightTxt}>Customer Name</Text> :
                                            <Text style={styles.lightTxt}>Customer Group</Text>}
                                        {<Text style={styles.boldTxt}>{cardItem?.companyName}</Text>}
                                    </View>
                               </View>
                                <View style={styles.row}>
                                    <View style={[styles.col,]}>
                            {console.log(sectionTitle, "sectionTitle")}
                                        {sectionTitle === 'DO Approval' || sectionTitle === 'PO Approval' || sectionTitle === 'Spot DO Approval' ?
                                            <Text style={styles.lightTxt}>PO Created Date</Text> :
                                            sectionTitle === 'Voice of Customer' ? <Text style={styles.lightTxt}>Product</Text> :
                                                <Text style={styles.lightTxt}>Created Date</Text>
                                        }
                                        {sectionTitle === 'Voice of Customer' ?
                                            <Text style={styles.boldTxt}>{cardItem?.product}</Text> :
                                            <Text style={styles.boldTxt}>{cardItem?.createdAt}</Text>}
                                    </View>
                                    <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                        {sectionTitle === 'Voice of Customer' ? <Text style={styles.lightTxt}>Qty</Text> :
                                            <Text style={styles.lightTxt}>Status</Text>}
                                        {sectionTitle === 'Voice of Customer' ?
                                            <Text style={styles.boldTxt}>{cardItem?.quantity}</Text> :
                                            <Text style={styles.boldTxt}>{cardItem?.status}</Text>}
                                    </View>
                                </View>
                                {sectionTitle === 'Voice of Customer' ?
                                    <View style={styles.row}>
                                        <View style={[styles.col,]}>
                                            <Text style={styles.lightTxt}>Date</Text>
                                            <Text style={styles.boldTxt}>{cardItem?.createdAt}</Text>
                                        </View>
                                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                            <Text style={styles.lightTxt}>Category</Text>
                                            <Text style={styles.boldTxt}>{cardItem?.status}</Text>
                                        </View>
                                    </View> :
                                    null}
              
            </View>
        ),
        [handleAct, getTitleLabel]
    );

    const renderSection = useCallback(
        ({ item }) => {
            const isVisible = visibleSections[item.title] ?? false;
            return (
                <View style={styles.container}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: Dimension.padding8,
                        }}
                    >
                        <Text
                            style={[styles.boldTxt, { fontSize: Dimension.font14, maxWidth: '60%' }]}
                        >
                            {item.title} ({item.data?.length || 0})
                        </Text>

                        <View style={styles.separator} />
                        <TouchableOpacity
                            onPress={() => toggleSectionVisibility(item.title)}
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                            <MaterialCommunityIcon
                                name={!isVisible ? 'plus-box-outline' : 'minus-box-outline'}
                                color={'#0063A7'}
                                size={15}
                            />
                            <Text style={styles.Hide}>{isVisible ? 'Hide' : 'Show'}</Text>
                        </TouchableOpacity>
                    </View>
                    {isVisible && (
                        <FlatList
                            data={item.data}
                            keyExtractor={(cardItem, idx) => `${cardItem.id || idx}`}
                            renderItem={({ item: cardItem }) =>
                                renderCard({ item: cardItem, sectionTitle: item.title })
                            }
                            initialNumToRender={5}
                            maxToRenderPerBatch={10}
                            windowSize={5}
                            removeClippedSubviews
                        />
                    )}
                </View>
            );
        },
        [visibleSections, toggleSectionVisibility, renderCard]
    );
    return (
        <FlatList
            data= {formattedData}
            renderItem={renderSection}
            contentContainerStyle={{
                padding: Dimension.padding15,
                paddingTop: 0,
            }}
            keyExtractor={(item, index) => `${index}-section`}
        />
    );
};
const styles = StyleSheet.create({
    container: {
        paddingTop: Dimension.padding20,
    },
    Hide: {
        color: '#0063A7',
        alignSelf: 'center',
        fontSize: Dimension.font14,
        fontWeight: 'bold',
        fontFamily: Dimension.CustomExtraBoldFont,
    },
    separator: {
        flexGrow: 1,
        height: 1,
        backgroundColor: '#ccc',
        marginHorizontal: 2,
    },
    CardWrapper: {
        marginBottom: Dimension.margin10,
        backgroundColor: '#fff',
        elevation: 12,
        shadowColor: '#00000017',
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        paddingHorizontal: Dimension.padding15,
        paddingVertical: Dimension.padding8,
    },
    col: {
        flex: 1,
    },
    statusWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Dimension.padding15,
        paddingVertical: Dimension.padding10,
        borderBottomColor: '#EBEBEB',
        borderBottomWidth: 1,
        alignContent: 'center',
    },
    boldTxt: {
        fontFamily: Dimension.CustomSemiBoldFont,
        fontSize: Dimension.font12,
        fontWeight: 'bold',
        color: Colors.FontColor,
    },
    lightTxt: {
        fontFamily: Dimension.CustomRegularFont,
        fontSize: Dimension.font12,
        color: Colors.FontColor,
        maxWidth: Dimension.width150,
    },
    loginBtn: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#1F63A7',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Dimension.padding8,
        paddingHorizontal: Dimension.padding18,
        color: '#1F63A7',
        fontSize: Dimension.font12,
        fontWeight: '700',
        fontFamily: Dimension.CustomExtraBoldFont,
        elevation: 5,
        shadowColor: '#00000029',
    },
});

export default PendingTaskScreen;

// import React, { useRef, useState, useEffect, useContext } from 'react';
// import {
//     Button,
//     View,
//     Text,
//     FlatList,
//     StyleSheet,
//     TouchableOpacity,
//     ActivityIndicator,
//     RefreshControl,
// } from 'react-native';
// import Dimension from '../../Theme/Dimension';
// import Colors from '../../Theme/Colors';
// import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useSelector, useDispatch } from 'react-redux';
// import { convertedDated } from '../../utils/BiometricAuth';
// import { STATE_STATUS } from '../../redux/constants';
// import { stat } from 'react-native-fs';
// import CONSTANTS from '../../services/constant';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const PendingTaskScreen = props => {
//     const dispatch = useDispatch();
//     const authData = useSelector(state => state.auth);
//     const branchAccessData = useSelector(state => state.branchAccess);
//     const isCustomer = useSelector(state => state.branchAccess?.isCustomer);
//     const pendingTasksData = useSelector(state => state.dashboard?.pendingtasks?.data)
//     const pendingTasksStatus = useSelector(state => state.dashboard?.pendingtasks?.status)
//     const [formattedData, setFormattedData] = useState()
//     const [visibleSections, setVisibleSections] = useState({});
    
//     useEffect(() => {
//         const formattedData =
//         pendingTasksStatus === STATE_STATUS?.FETCHED
//           ? Object.entries(pendingTasksData?.[0])
//               .filter(([_, value]) => value?.data?.length) 
//               .map(([title, value]) => ({
//                 title: titleMap[title] || title,
//                 data: value.data,
//               }))
//                 : [];  
//         setFormattedData(formattedData);
//     }, [pendingTasksStatus, pendingTasksData])
    
//     const titleMap = {
//         contractNFAPending: 'Contract NFA',
//         pendingNFA: 'Others NFA',
//         pendingDraftMOU: 'Draft Contract',
//         pendingCustomer: 'Customer Registration / Modification',
//         pendingPO: 'PO Approval',
//         pendingPriceBooking: 'Price Booking Approvals',
//         pendingDO: 'DO Approval',
//         pendingSpotDO: 'Spot DO Approval',
//         openVOC: 'Voice of Customer',
//         pendingLcBg: 'LC/BG Tasks',
        
//       };

//         const toggleSectionVisibility = (title) => {
//             setVisibleSections(prev => ({
//               ...prev,
//               [title]: !prev[title], 
//             }));
//         };
    
//     const handleAct = async (id, type) => {
//         try {
//             const userInfo = await AsyncStorage.getItem('@user_info');
//             const info = JSON.parse(userInfo);
//             if (type === 'Contract NFA') {
//                 props?.navigation?.push('Contract',{contractiId: id, activeTabKey: 1})
//             }
//             if (type === 'Others NFA') {
//                 props?.navigation?.push('Contract', {nfaId: id, activeTabKey: 2})
//             }
//             if (type === 'Draft Contract') {
//                 props?.navigation?.push('Contract', {draftId: id, activeTabKey: 0})
//             }
//             if (type === 'Customer Registration / Modification') {
//                 props?.navigation?.push('Customer&Registration', {regId: id,})
//             }
//             if (type === 'Voice of Customer') {
//                 console.log("hit voice");
                
//                 props?.navigation?.push('NewComplaint', {vocId: id,})
//             }
//             if (type === 'PO Approval') {
//                 const exp_url = `${CONSTANTS.URL_BASE_URL}/#/pages/orders/po-list?poId=${id}&token=${info.token}`
//                     console.log(exp_url, "exp url");
//                         props?.navigation.push('WebView', {
//                             URL: exp_url,
//                             showBack: true
//                             // fromExp: 'exploreText',
//                         });
//             }
//             if (type === 'DO Approval' || type === 'Spot DO Approval') {
//                 const exp_url = `${CONSTANTS.URL_BASE_URL}/#/pages/orders/delivery?doId=${id}&token=${info.token}`
//                 console.log(exp_url, "exp url");
//                     props?.navigation.push('WebView', {
//                         URL: exp_url,
//                         showBack: true
//                         // fromExp: 'exploreText',
//                     });
//             }
//         } catch (err) {
//             console.log("Error", err);
//         }
//     }
    
//     const getTitleLabel = (title, id) => { 
//         switch (title) {
//             case 'Contract NFA':
//                 return 'Approval Pending NFA';
//             case 'Others NFA':
//                 return 'Approval Pending';
//             case 'Draft Contract':
//                 return 'Approval Pending Draft Contract';
//             case 'Customer Registration / Modification':
//                 return id? `${id}` : '';
//             case 'PO Approval':
//                 return `PO Id : ${id}`;
//             case 'DO Approval':
//                 return `DO Id. : ${id}`;
//             case 'LC/BG Tasks':
//                 return `${id}`;
//             case 'Spot DO Approval':
//                 return `Order ID : ${id}`;
//             case 'Voice of Customer':
//                     return `${id}`;
//             default:
//                 return title;
//         }
//     };
    
//     const renderItem = ({ item, index }) => {
//         console.log("item see",item.title);
//         const isVisible = visibleSections[item.title] ?? false;
//         return (
//             <View style={styles.container}>
//                 <View style={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     paddingVertical:Dimension.padding8
//                      }}>
//                     <Text style={[styles.boldTxt, { fontSize: Dimension.font14, maxWidth: '60%' }]}>
//                         {item.title} ({item.data?.length || 0})
//                     </Text>

//                     <View style={styles.separator} />
//                     <TouchableOpacity
//                         onPress={() => toggleSectionVisibility(item.title)}
//                         style={{ flexDirection: 'row', alignItems: 'center' }}>
//                         <MaterialCommunityIcon
//                             name={!isVisible ? 'plus-box-outline' : 'minus-box-outline'}
//                             color={'#0063A7'}
//                             size={15}
//                         />
//                         <Text style={styles.Hide}>
//                             {isVisible ? 'Hide' : 'Show'}
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//                 {isVisible && (
//                     item?.data?.map((cardItem, index) => {
//                         return (
//                             // <View key={`${cardItem.id || index}`} style={styles.CardWrapper}>
//                             <View style={styles.CardWrapper}>
//                                 <TouchableOpacity style={styles.statusWrap} onPress={() => handleAct(cardItem?.id, item?.title)}>
//                                     <Text style={[styles.boldTxt, { alignSelf: 'center' }]}>{getTitleLabel(item?.title, cardItem?.id)}</Text>
//                                     <Text style={styles.loginBtn}>Act</Text>
//                                 </TouchableOpacity>
//                                 <View style={styles.row}>
//                                     <View style={styles.col}>
//                                         {item?.title === 'Customer Registration / Modification' ?
//                                             <Text style={styles.lightTxt}>Registration</Text> :
//                                             item?.title === 'PO Approval' ?
//                                                 <Text style={styles.lightTxt}>PO Qty</Text> :
//                                                 item?.title === 'DO Approval' || item?.title === 'Spot DO Approval' ?
//                                                     <Text style={styles.lightTxt}>DO Qty</Text> :
//                                                     item?.title === 'Voice of Customer' ?
//                                                         <Text style={styles.lightTxt}>Feedback</Text> :
//                                                         item?.title === 'LC/BG Tasks' ?
//                                                             <Text style={styles.lightTxt}>Type</Text> :
//                                                             <Text style={styles.lightTxt}>Contract No.</Text>
//                                         }
//                                         {item?.title === 'Spot DO Approval' || item?.title === 'DO Approval' || item?.title === 'PO Approval' ?
//                                             <Text style={[styles.boldTxt,]}>{cardItem?.quantity}</Text> :
//                                             item?.title === 'LC/BG Tasks' ?
//                                                 <Text style={[styles.boldTxt,]}>{cardItem?.lcbgType}</Text> :
//                                                 <Text style={[styles.boldTxt,]}>{cardItem?.id}</Text>
//                                         }
//                                     </View>
//                                     <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
//                                         {item?.title === 'Voice of Customer' ?
//                                             <Text style={styles.lightTxt}>Customer Name</Text> :
//                                             <Text style={styles.lightTxt}>Customer Group</Text>}
//                                         {<Text style={styles.boldTxt}>{cardItem?.companyName}</Text>}
//                                     </View>
// //                                 </View>
//                                 <View style={styles.row}>
//                                     <View style={[styles.col,]}>

//                                         {item?.title === 'DO Approval' || item?.title === 'PO Approval' || item?.title === 'Spot DO Approval' ?
//                                             <Text style={styles.lightTxt}>PO Created Date</Text> :
//                                             item?.title === 'Voice of Customer' ? <Text style={styles.lightTxt}>Product</Text> :
//                                                 <Text style={styles.lightTxt}>Created Date</Text>
//                                         }
//                                         {item?.title === 'Voice of Customer' ?
//                                             <Text style={styles.boldTxt}>{cardItem?.product}</Text> :
//                                             <Text style={styles.boldTxt}>{cardItem?.createdAt}</Text>}
//                                     </View>
//                                     <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
//                                         {item?.title === 'Voice of Customer' ? <Text style={styles.lightTxt}>Qty</Text> :
//                                             <Text style={styles.lightTxt}>Status</Text>}
//                                         {item?.title === 'Voice of Customer' ?
//                                             <Text style={styles.boldTxt}>{cardItem?.quantity}</Text> :
//                                             <Text style={styles.boldTxt}>{cardItem?.status}</Text>}
//                                     </View>
//                                 </View>
                                // {item?.title === 'Voice of Customer' ?
                                //     <View style={styles.row}>
                                //         <View style={[styles.col,]}>
                                //             <Text style={styles.lightTxt}>Date</Text>
                                //             <Text style={styles.boldTxt}>{cardItem?.createdAt}</Text>
                                //         </View>
                                //         <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                //             <Text style={styles.lightTxt}>Category</Text>
                                //             <Text style={styles.boldTxt}>{cardItem?.status}</Text>
                                //         </View>
                                //     </View> :
                                //     null}
                            // </View>
//                         );
//                     })
//                )}
//             </View>
//         );
//     };
    
//     return (
//         <>
//             <FlatList
//                 data= {formattedData}
//                 renderItem={renderItem}
//                 contentContainerStyle={{
//                     padding: Dimension.padding15,
//                     paddingTop: 0,
//                 }}
//                 keyExtractor={(item, index) => `${index}-item`}
//                 scrollEnabled={true} 
//                 initialNumToRender={5} 
//                 maxToRenderPerBatch={10} 
//                 windowSize={5}
//                 removeClippedSubviews={true}
//                  bounces={true}
//             // style={{
//             //     marginBottom: isCustomer ? 185 : 325,
//             // }}
//             />
//         </>
//     );
// };
// const styles = StyleSheet.create({
//     container: {
//     paddingTop: Dimension.padding20
// },
//     TopWrap: {
//         // padding: Dimension.padding15,
//         backgroundColor: '#F7F7F7',
//     },
//     Hide: {
//         color: '#0063A7',
//         alignSelf: 'center',
//         fontSize: Dimension.font14,
//         fontWeight: 'bold',
//         fontFamily: Dimension.CustomExtraBoldFont
//     },

//     SearchWrap: {
//         flexDirection: 'row',
//         //flex:1,
//         justifyContent: 'space-between',
//         height: Dimension.height50,
//         margin: Dimension.margin14,
//         position: 'relative',
//     },
//     SearchWraps: {
//         marginVertical: Dimension.margin10,
//         marginHorizontal: Dimension.margin15,
//         position: 'relative',
//     },
//     searchIcon: {
//         position: 'absolute',
//         top: 12,
//         left: 10,
//         width: 24,
//         zIndex: 999,
//         // alignSelf: 'center',
//     },
//     searchBar: {
//         fontSize: Dimension.font14,
//         flex: 7,
//         height: Dimension.height50,
//         backgroundColor: 'white',
//         borderWidth: 1,
//         borderColor: '#E7E7E8',
//         fontFamily: Dimension.CustomRegularFont,
//         color: '#7E7E7E',
//         borderRadius: 8,
//         elevation: 16,
//         shadowColor: '#455B6324',
//         paddingHorizontal: Dimension.padding15,
//         paddingLeft: 40,
//         marginRight: Dimension.margin10,
//     },
//     searchbtn: {
//         flex: 1,
//         borderRadius: 8,
//         borderColor: '#E7E7E8',
//         borderWidth: 1,
//         elevation: 16,
//         shadowColor: '#455B6324',
//         backgroundColor: '#fff',
//         alignContent: 'center',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     ClearBtn: {
//         flex: 3,
//         borderRadius: 8,
//         borderColor: '#E7E7E8',
//         borderWidth: 1,
//         elevation: 16,
//         shadowColor: '#455B6324',
//         backgroundColor: '#E4E4E4',
//         alignContent: 'center',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     ClearBtnTxt: {
//         color: Colors.FontColor,
//         fontSize: Dimension.font14,
//         fontFamily: Dimension.CustomSemiBoldFont,
//     },
//     searchedTxt: {
//         color: Colors.FontColor,
//         fontSize: Dimension.font18,
//         fontFamily: Dimension.CustomSemiBoldFont,
//         alignSelf: 'center',
//     },
//     searchTxt: {
//         color: '#fff',
//         fontSize: Dimension.font16,
//         fontFamily: Dimension.CustomSemiBoldFont,
//     },
//     BtnTxt: {
//         fontSize: 14,
//         fontFamily: Dimension.CustomMediumFont,
//         color: '#fff',
//         marginLeft: 8,
//     },
//     row: {
//         flexDirection: 'row',
//         flex: 1,
//         paddingHorizontal: Dimension.padding15,
//         paddingVertical: Dimension.padding8,
//     },
//     col: {
//         flex: 1,
//     },
//     CardWrapper: {
//         marginBottom: Dimension.margin10,
//         // padding: Dimension.padding15,
//         backgroundColor: '#fff',
//         elevation: 12,
//         shadowColor: '#00000017',
//     },
//     midWrap: {
//         paddingBottom: Dimension.padding20,
//         paddingHorizontal: Dimension.padding15,
//     },
//     CSTxt: {
//         fontFamily: Dimension.CustomRegularFont,
//         fontSize: Dimension.font11,
//         color: '#707070',
//         marginBottom: Dimension.margin10,
//     },
//     OpenBtn: {
//         borderColor: '#E8F5FF',
//         borderWidth: 2,
//         borderRadius: 8,
//         padding: Dimension.padding10,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         flex: 1,
//         marginRight: Dimension.margin10,
//         backgroundColor: '#fff',
//     },
//     ActiveOpenBtn: {
//         borderColor: '#E8F5FF',
//         borderWidth: 2,
//         borderRadius: 8,
//         padding: Dimension.padding10,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         flex: 1,
//         marginRight: Dimension.margin10,
//         backgroundColor: '#E8F5FF',
//     },
//     CloseBtn: {
//         borderColor: '#E8F5FF',
//         borderWidth: 2,
//         borderRadius: 8,
//         padding: Dimension.padding10,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         flex: 1,
//         marginLeft: Dimension.margin10,
//         backgroundColor: '#fff',
//     },
//     Orangetxt: {
//         color: '#D57608',
//         fontSize: Dimension.font16,
//         fontFamily: Dimension.CustomSemiBoldFont,
//     },
//     Greentxt: {
//         color: '#05C338',
//         fontSize: Dimension.font16,
//         fontFamily: Dimension.CustomSemiBoldFont,
//     },
//     Greendot: {
//         width: 11,
//         height: 11,
//         backgroundColor: '#00A100',
//         borderRadius: 11,
//         marginTop: 2,
//         marginRight: 5,
//     },
//     Reddot: {
//         width: 11,
//         height: 11,
//         backgroundColor: '#E52E16',
//         borderRadius: 11,
//         marginTop: 2,
//         marginRight: 5,
//     },
//     bluedot: {
//         width: 11,
//         height: 11,
//         backgroundColor: '#1692E5',
//         borderRadius: 11,
//         marginTop: 2,
//         marginRight: 5,
//     },
//     statustxt: {
//         color: '#363636',
//         fontSize: Dimension.font12,
//         fontFamily: Dimension.CustomSemiBoldFont,
//         marginLeft: Dimension.margin10,
//         fontWeight: 'bold',
//         alignSelf: 'center',
//     },
//     statusWrap: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingHorizontal: Dimension.padding15,
//         paddingVertical: Dimension.padding10,
//         borderBottomColor: '#EBEBEB',
//         borderBottomWidth: 1,
//         alignContent: 'center',
//     },
//     boldTxt: {
//         fontFamily: Dimension.CustomSemiBoldFont,
//         fontSize: Dimension.font12,
//         fontWeight: 'bold',
//         color: Colors.FontColor,
//     },
//     lightTxt: {
//         fontFamily: Dimension.CustomRegularFont,
//         fontSize: Dimension.font12,
//         color: Colors.FontColor,
//         maxWidth: Dimension.width150,
//     },
//     ModalboldTxt: {
//         fontFamily: Dimension.CustomSemiBoldFont,
//         fontSize: Dimension.font14,
//         color: Colors.FontColor,
//         marginBottom: Dimension.margin6,
//     },
//     ModallightTxt: {
//         fontFamily: Dimension.CustomRegularFont,
//         fontSize: Dimension.font14,
//         color: Colors.FontColor,
//     },
//     footerbtn: {
//         position: 'absolute',
//         backgroundColor: '#fff',
//         paddingHorizontal: Dimension.padding15,
//         paddingVertical: Dimension.padding10,
//         bottom: 0,
//         width: '100%',
//         left: 0,
//     },
//     createBtn: {
//         borderRadius: 8,
//         borderColor: '#E7E7E8',
//         borderWidth: 1,
//         elevation: 16,
//         shadowColor: '#455B6324',
//         backgroundColor: '#0063A7',
//         alignContent: 'center',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     createBtnTxt: {
//         color: '#fff',
//         fontSize: Dimension.font20,
//         fontFamily: Dimension.CustomMediumFont,
//         paddingVertical: Dimension.padding12,
//     },
//     modalbg: {
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         margin: 0,
//         flex: 1,
//     },
//     modalInner: {
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         flex: 1,
//         alignContent: 'flex-end',
//     },
//     ModalView: {
//         backgroundColor: '#fff',
//         borderTopLeftRadius: 12,
//         borderTopRightRadius: 12,
//         paddingVertical: Dimension.padding5,
//         position: 'absolute',
//         bottom: 0,
//         width: '100%',
//         left: 0,
//         flex: 1,
//     },
//     modalHeader: {
//         padding: Dimension.padding15,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     },
//     headText: {
//         fontSize: Dimension.font16,
//         color: '#3c3c3c',
//         fontFamily: Dimension.CustomSemiBoldFont,
//     },
//     image: {
//         width: Dimension.width25,
//         height: Dimension.height25,
//         alignSelf: 'center',
//     },
//     ExportBTn: {
//         flexDirection: 'row',
//     },
//     exportTxt: {
//         fontSize: Dimension.font12,
//         fontFamily: Dimension.CustomRegularFont,
//         color: '#0063A7',
//         marginLeft: Dimension.margin8,
//         alignSelf: 'center',
//         fontWeight: 'bold',
//     },
//     modalContent: {
//         backgroundColor: '#fff',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         paddingTop: Dimension.padding20,
//         padding: Dimension.padding20,
//         textAlign: 'center',
//     },
//     modalTitle: {
//         fontSize: Dimension.font14,
//         color: '#363636',
//         fontWeight: 'bold',
//         marginVertical: Dimension.margin20,

//         textAlign: 'center',
//     },
//     modalOverlay: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     inputField: {
//         borderColor: '#979797',
//         borderWidth: 1,
//         borderRadius: 4,
//         fontFamily: Dimension.CustomRegularFont,
//         fontSize: Dimension.font14,
//         textAlignVertical: 'center',
//         color: '#333333',
//         backgroundColor: '#fff',
//         paddingLeft: Dimension.padding10,
//         paddingVertical: Dimension.padding6,
//         marginVertical: Dimension.margin25,
//     },
//     separator: {
//         height: 1,
//         backgroundColor: '#EFEFEF',
//         width: '100%',
//     },
//     BtnTxt: {
//         fontSize: 14,
//         fontFamily: Dimension.CustomMediumFont,
//         color: '#fff',
//         marginLeft: 8,
//     },
//     row: {
//         flexDirection: 'row',
//         flex: 1,
//         paddingHorizontal: Dimension.padding15,
//         paddingVertical: Dimension.padding8,
//     },
//     col: {
//         flex: 1,
//     },
//     CardWrapper: {
//         marginBottom: Dimension.margin10,
//         // padding: Dimension.padding15,
//         backgroundColor: '#fff',
//         elevation: 12,
//         shadowColor: '#00000017',
//     },
//     midWrap: {
//         paddingBottom: Dimension.padding20,
//         paddingHorizontal: Dimension.padding15,
//     },
//     loginBtn: {
//         backgroundColor: '#fff',
//         borderWidth:1,
//         borderColor:'#1F63A7',
//         borderRadius: 4,
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: Dimension.padding8,
//         paddingHorizontal: Dimension.padding18,
//         color: '#1F63A7',
//         fontSize: Dimension.font12,
//         fontWeight:'700',
//         fontFamily: Dimension.CustomExtraBoldFont,
//         elevation: 5,
//         shadowColor: '#00000029',
//         shadowOffset: { width: 0, height: -2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 5,
//     },
    
//     separator: {
//             flexGrow: 1,
//             height: 1,
//             backgroundColor: '#ccc',
//         marginHorizontal: 2,
            
//           },
// });
// export default PendingTaskScreen;