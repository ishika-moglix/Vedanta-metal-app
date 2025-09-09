
import React, { useRef, useState, useEffect, useContext } from 'react';
import {
    Button,
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import Dimension from '../Theme/Dimension';
import Colors from '../Theme/Colors';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { STATE_STATUS } from '../redux/constants';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertedDated } from '../utils/BiometricAuth';
import {
    getMouListRequest,
} from '../redux/feature/mouslice';
import CONSTANTS from '../services/constant';
import RenderCard from './renderCards';
const ContractList = props => {
    const dispatch = useDispatch();
    const authData = useSelector(state => state.auth);
    const mouList = useSelector(state => state.mouList?.mouList);
    const mouListData = useSelector(state => state.mouList?.mouList?.data);
    const branchAccessData = useSelector(state => state.branchAccess);
    const { data, status, isCustomer } = useSelector(state => state.branchAccess);
    const [refreshing, setRefreshing] = useState(false);
    console.log("Props contract", props);

    const handleDraftWebview = async (id, is_v2, mouNumber) => {
        const userInfo = await AsyncStorage.getItem('@user_info');
        if (!userInfo) return;
      
        const info = JSON.parse(userInfo);
        const businessUnit = authData?.data?.businessUnit;
        let baseUrl = '';
      
        if (is_v2) {
          switch (businessUnit) {
            case 'Aluminium':
              baseUrl = CONSTANTS.WEBURL.DRAFTMOU;
              break;
            case 'Zinc':
              baseUrl = CONSTANTS.WEBURL.DRAFTMOUZINC;
              break;
            case 'Copper':
              baseUrl = CONSTANTS.WEBURL.DRAFTMOUCOPPERV2;
              break;
          }
        } else {
          switch (businessUnit) {
            case 'Aluminium':
              baseUrl = CONSTANTS.WEBURL.DRAFTMOUV1;
              break;
            case 'Zinc':
              baseUrl = CONSTANTS.WEBURL.DRAFTMOUZINC;
              break;
            case 'Copper':
              baseUrl = CONSTANTS.WEBURL.DRAFTMOUCOPPER;
              break;
          }
        }
      
        if (baseUrl) {
          const exp_url = `${baseUrl}?mouDraftId=${id}&token=${info.token}`;
            props?.navigation.push('WebView', {
                URL: exp_url,
                fromPage: 'Mou',
                id: mouNumber,
                showBack: true
            });
        }
    };
    
    const handleContractWebview = async (id, is_v2, mouNumber) => {
        try {
            console.log("MOU ID is", id);
            
            const userInfo = await AsyncStorage.getItem('@user_info');
            if (userInfo) {
                const info = JSON.parse(userInfo);
                const businessUnit = authData?.data?.businessUnit;
                let baseUrl = '';
                if (is_v2) {
                    switch (businessUnit) {
                        case 'Aluminium':
                            baseUrl = CONSTANTS.WEBURL.CONTRACTLISTMOU;
                            break;
                        case 'Zinc':
                            baseUrl = CONSTANTS.WEBURL.CONTRACTLISTMOUZINC;
                            break;
                        case 'Copper':
                            baseUrl = CONSTANTS.WEBURL.CONTRACTLISTMOUCOPPERV2;
                            break;
                    }
                } else {
                    switch (businessUnit) {
                      case 'Aluminium':
                        baseUrl = CONSTANTS.WEBURL.CONTRACTLISTMOUV1;
                        break;
                      case 'Zinc':
                        baseUrl = CONSTANTS.WEBURL.CONTRACTLISTMOUZINC;
                        break;
                      case 'Copper':
                        baseUrl = CONSTANTS.WEBURL.CONTRACTLISTMOUCOPPER;
                        break;
                    }
                  }

                  if (baseUrl) {
                    const exp_url = `${baseUrl}?id=${id}&token=${info.token}`;
                    props?.navigation.push('WebView', {
                        URL: exp_url,
                        fromPage: 'Mou',
                        id: mouNumber,
                        showBack: true
                        });
                  }
                }
            }catch (err) {
            console.log("ERROR", err);
        }
    };

    const convertDateToTimestamp = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number);
        const timestamp = new Date(year, month - 1, day).getTime();
        return timestamp;
    } 
    const onRefresh = async () => {
        console.log('hit onrefresh data func');
        props?.searchResults([]);
        // props?.resetFilter(true);
        setRefreshing(true);
        props?.setSearchKey('');
        props?.filterCount(0);
        props.filteredData({
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
        const isZinc = authData?.data?.businessUnit === 'Zinc';
        const dataObj = {
            ...(isCustomer ? { companyId: isCustomer ? jsonSessionData?.companyId : null } : {}),
            ...(isZinc ? {}:{exportFlag: false}),
            businessUnit: authData?.data?.businessUnit,
            limit: 10,
            offset: 0,
        }
        dispatch(
            getMouListRequest({
                page: 1,
                pageSize: 10,
                dataObj,
            }),
        );
        setRefreshing(false);
        
    };
    const onEndReached = async () => {
        if (
            mouList?.status == STATE_STATUS.FETCHED &&
            mouList?.status != STATE_STATUS.FETCHING &&
            mouList?.currentPage < mouList?.totalPages
        ) {
            props?.resetFilter(false);
            const sessionData = await AsyncStorage.getItem('@get_session');
            const getPlantId = await AsyncStorage.getItem('@plantId');
            let jsonSessionData = JSON.parse(sessionData);
            let plantId = JSON.parse(getPlantId);
            let newValue = data?.priceType;
            if (props?.filterData?.priceType) {
                if (props?.filterData?.priceType === 'LME Pricing') {
                    newValue = 'LME';
                }
                else if (props?.filterData?.priceType === 'LP Pricing') newValue = 'LP';
            }
            const currentPage = mouList?.currentPage || 0;
            const dataObj = {
                exportFlag: false,
                // companyId: 11139,
                ...(isCustomer ? { companyId: isCustomer ? jsonSessionData?.companyId : null } : {}),
                businessUnit: authData?.data?.businessUnit,
                mouNo: props?.route?.params?.draftId || props?.filterData?.contractId,
                priceType: newValue,
                customerName: props?.filterData?.customerName,
                status: props?.filterData?.status,
                contractType: props?.filterData?.contractType,
                approverNameId: props?.filterData?.userName,
                createdById: props?.filterData?.createdBy,
                region: branchAccessData?.data?.branchModules?.region,
                // region: branchAccessData?.data?.branchModules?.region? branchAccessData?.data?.branchModules?.region: "EI01,WI01,NI01,SI01",
                fromDate: convertDateToTimestamp(props?.filterData?.fromDate),
                toDate: convertDateToTimestamp(props?.filterData?.toDate),
                limit: 10,
                offset: currentPage,
            };
            dispatch(
                getMouListRequest({
                    page: mouList?.currentPage + 1,
                    pageSize: 10,
                    dataObj,
                }),
            );
        }
    };
    const formattedData = [
        {
          data: props?.searchResultsData
          }
        
    ];

    const renderItem = ({ item, index }) => {
        console.log('Contract list item', item);
    
        const isZinc = authData?.data?.businessUnit === 'Zinc';
        const dataList = isZinc ? item?.data?.result : item?.data;
    
        if (dataList?.length > 0) {
            return dataList.map((cardItem, cardIndex) => (
                <View style={styles.CardWrapper} key={cardIndex}>
                    <TouchableOpacity
                        onPress={() =>
                            handleContractWebview(cardItem?.id, cardItem?.is_v2, cardItem?.mouNo)
                        }
                        style={styles.statusWrap}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 3,
                            }}>
                            {cardItem.status === 'Approved' ? (
                                <View style={styles.Greendot}></View>
                            ) : cardItem.status === 'Rejected' ? (
                                <View style={styles.Reddot}></View>
                            ) : (
                                <View style={styles.bluedot}></View>
                            )}
                            <Text style={styles.boldTxt}>{cardItem?.status}</Text>
                        </View>
                        <MaterialCommunityIcon
                            name={'chevron-right'}
                            color={'#000'}
                            size={20}
                            style={{ alignSelf: 'center' }}
                        />
                    </TouchableOpacity>
    
                    <View style={styles.row}>
                        <View style={styles.col}>
                            {authData?.data?.businessUnit === 'Zinc' ? <Text style={styles.boldTxt}>MOU No.</Text>
                                : <Text style={styles.boldTxt}>Contract Id</Text>}
                            <TouchableOpacity
                                onPress={() =>
                                    isZinc? handleContractWebview(cardItem?.id, cardItem?.is_v2, cardItem?.draftMouNo) : handleContractWebview(cardItem?.id, cardItem?.is_v2, cardItem?.mouNo)
                                }>
                                <Text style={[styles.boldTxt, { color: '#0063A7' }]}>
                                    {isZinc? cardItem?.id : cardItem?.mouNo}
                                </Text>
                            </TouchableOpacity>
                        </View>
    
                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                            <Text style={styles.boldTxt}>Customer Name</Text>
                            <Text style={styles.lightTxt}>{isZinc? cardItem?.companyName : cardItem?.customerName}</Text>
                        </View>
                    </View>
    
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Duration</Text>
                            <Text style={styles.lightTxt}>{
                                isZinc
                                    ? `${cardItem?.contractDurationFromDate} to ${cardItem?.contractDurationToDate}`
                                    : cardItem?.duration
                            }
                            </Text>
                        </View>
    
                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                            <Text style={styles.boldTxt}>Price Type</Text>
                            <Text style={styles.lightTxt}>{cardItem?.priceType? cardItem?.priceType : '-'}</Text>
                        </View>
                    </View>
    
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Annual Quantity</Text>
                            <Text style={styles.lightTxt}>
                                {isZinc
                                    ? String(cardItem?.annualQty)?.includes('MT')
                                        ? cardItem?.annualQty
                                        : `${cardItem?.annualQty} MT`
                                    : String(cardItem?.quantity)?.includes('MT')
                                        ? cardItem?.quantity
                                        : `${cardItem?.quantity} MT`}
                            </Text>
                        </View>
    
                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                            <Text style={styles.boldTxt}>Created By</Text>
                            <Text style={styles.lightTxt}>{isZinc? cardItem?.actionList?.[0]?.userName : cardItem?.createdBy}</Text>
                        </View>
                    </View>
    
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Created Date</Text>
                            <Text style={styles.lightTxt}>{isZinc? convertedDated(cardItem?.creationDate) :convertedDated(cardItem?.createdOn)}</Text>
                        </View>
                    </View>
    
                    <View style={styles.statusWrap}></View>
                </View>
            ));
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

    
//     const renderItem = ({ item, index }) => {
//         console.log('Contract list item', item);
//         {
//             authData?.data?.businessUnit === 'Zinc' ? 
//             if (item?.data?.result?.length > 0) {
//                 return item?.data?.result?.map((cardItem, cardIndex) => {
//                     return (
//                         <View style={styles.CardWrapper}>
//                             <TouchableOpacity
//                                 onPress={() => handleContractWebview(cardItem?.id, cardItem?.is_v2, cardItem?.mouNo)}
//                                 style={styles.statusWrap}>
//                                 {/* <View style={styles.statusWrap}> */}
//                                 <View
//                                     style={{
//                                         flexDirection: 'row',
//                                         justifyContent: 'space-between',
//                                         marginTop: 3,
//                                     }}>
//                                     {cardItem.status == 'Approved' ? (
//                                         <View style={styles.Greendot}></View>
//                                     ) : cardItem.status == 'Rejected' ? (
//                                         <View style={styles.Reddot}></View>
//                                     ) : (
//                                         <View style={styles.bluedot}></View>
//                                     )}
    
//                                     <Text style={[styles.boldTxt]}>{cardItem?.status}</Text>
//                                 </View>
//                                 <MaterialCommunityIcon
//                                     name={'chevron-right'}
//                                     color={'#000'}
//                                     size={20}
//                                     style={{ alignSelf: 'center' }}
//                                 />
//                                 {/* </View> */}
//                             </TouchableOpacity>
//                             <View style={styles.row}>
//                                 <View style={styles.col}>
//                                     <Text style={styles.boldTxt}>MOU No.</Text>
//                                     <TouchableOpacity onPress={() => handleContractWebview(cardItem?.id, cardItem?.is_v2, cardItem?.mouNo)}>
//                                         <Text style={[styles.boldTxt, { color: '#0063A7' }]}>
//                                             {cardItem?.mouNo}
//                                         </Text>
//                                     </TouchableOpacity>
//                                 </View>
    
//                                 <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
//                                     <Text style={styles.boldTxt}>Customer Name</Text>
//                                     <Text style={styles.lightTxt}>
//                                         {cardItem?.customerName}
//                                         {/* {convertedDate(cardItem?._source?.creationDate)} */}
//                                     </Text>
//                                 </View>
//                             </View>
//                             <View style={styles.row}>
//                                 <View style={styles.col}>
//                                     <Text style={styles.boldTxt}>Duration</Text>
//                                     <Text style={styles.lightTxt}>{cardItem?.duration}</Text>
//                                 </View>
    
//                                 <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
//                                     <Text style={styles.boldTxt}>Price Type</Text>
//                                     <Text style={styles.lightTxt}> {cardItem?.priceType}</Text>
//                                 </View>
//                             </View>
//                             <View style={styles.row}>
//                                 <View style={styles.col}>
//                                     <Text style={styles.boldTxt}>Annual Quantity</Text>
//                                     <Text style={styles.lightTxt}>
//                                         {' '}
//                                         {cardItem?.quantity}
//                                         {/* {'\n'}
//                       {cardItem?._source?.toPlantName} */}
//                                     </Text>
//                                 </View>
//                                 <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
//                                     <Text style={styles.boldTxt}>Created By</Text>
//                                     <Text style={styles.lightTxt}> {cardItem?.createdBy}</Text>
//                                 </View>
//                             </View>
//                             <View style={styles.row}>
//                                 <View style={styles.col}>
//                                     <Text style={styles.boldTxt}>Created Date</Text>
//                                     <Text style={styles.lightTxt}>
//                                         {convertedDated(cardItem?.createdOn)}
//                                     </Text>
//                                 </View>
//                             </View>
//                             <View style={styles.statusWrap}></View>
//                         </View>
//                     );
//                 });
//             } else {
//                 return (
//                     <Text
//                         style={{
//                             textAlign: 'center',
//                             padding: Dimension.padding50,
//                             fontSize: Dimension.font22,
//                             fontFamily: Dimension.CustomBlackFont,
//                             color: '#c7c7c7',
//                         }}>
//                         NO DATA FOUND
//                     </Text>
//                 );
//             }
//         :
//         if (item?.data?.length > 0) {
//             return item?.data?.map((cardItem, cardIndex) => {
//                 return (
//                     <View style={styles.CardWrapper}>
//                         <TouchableOpacity
//                             onPress={() => handleContractWebview(cardItem?.id, cardItem?.is_v2, cardItem?.mouNo)}
//                             style={styles.statusWrap}>
//                             {/* <View style={styles.statusWrap}> */}
//                             <View
//                                 style={{
//                                     flexDirection: 'row',
//                                     justifyContent: 'space-between',
//                                     marginTop: 3,
//                                 }}>
//                                 {cardItem.status == 'Approved' ? (
//                                     <View style={styles.Greendot}></View>
//                                 ) : cardItem.status == 'Rejected' ? (
//                                     <View style={styles.Reddot}></View>
//                                 ) : (
//                                     <View style={styles.bluedot}></View>
//                                 )}

//                                 <Text style={[styles.boldTxt]}>{cardItem?.status}</Text>
//                             </View>
//                             <MaterialCommunityIcon
//                                 name={'chevron-right'}
//                                 color={'#000'}
//                                 size={20}
//                                 style={{ alignSelf: 'center' }}
//                             />
//                             {/* </View> */}
//                         </TouchableOpacity>
//                         <View style={styles.row}>
//                             <View style={styles.col}>
//                                 <Text style={styles.boldTxt}>MOU No.</Text>
//                                 <TouchableOpacity onPress={() => handleContractWebview(cardItem?.id, cardItem?.is_v2, cardItem?.mouNo)}>
//                                     <Text style={[styles.boldTxt, { color: '#0063A7' }]}>
//                                         {cardItem?.mouNo}
//                                     </Text>
//                                 </TouchableOpacity>
//                             </View>

//                             <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
//                                 <Text style={styles.boldTxt}>Customer Name</Text>
//                                 <Text style={styles.lightTxt}>
//                                     {cardItem?.customerName}
//                                     {/* {convertedDate(cardItem?._source?.creationDate)} */}
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={styles.row}>
//                             <View style={styles.col}>
//                                 <Text style={styles.boldTxt}>Duration</Text>
//                                 <Text style={styles.lightTxt}>{cardItem?.duration}</Text>
//                             </View>

//                             <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
//                                 <Text style={styles.boldTxt}>Price Type</Text>
//                                 <Text style={styles.lightTxt}> {cardItem?.priceType}</Text>
//                             </View>
//                         </View>
//                         <View style={styles.row}>
//                             <View style={styles.col}>
//                                 <Text style={styles.boldTxt}>Annual Quantity</Text>
//                                 <Text style={styles.lightTxt}>
//                                     {' '}
//                                     {cardItem?.quantity}
//                                     {/* {'\n'}
//                   {cardItem?._source?.toPlantName} */}
//                                 </Text>
//                             </View>
//                             <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
//                                 <Text style={styles.boldTxt}>Created By</Text>
//                                 <Text style={styles.lightTxt}> {cardItem?.createdBy}</Text>
//                             </View>
//                         </View>
//                         <View style={styles.row}>
//                             <View style={styles.col}>
//                                 <Text style={styles.boldTxt}>Created Date</Text>
//                                 <Text style={styles.lightTxt}>
//                                     {convertedDated(cardItem?.createdOn)}
//                                 </Text>
//                             </View>
//                         </View>
//                         <View style={styles.statusWrap}></View>
//                     </View>
//                 );
//             });
//         } else {
//             return (
//                 <Text
//                     style={{
//                         textAlign: 'center',
//                         padding: Dimension.padding50,
//                         fontSize: Dimension.font22,
//                         fontFamily: Dimension.CustomBlackFont,
//                         color: '#c7c7c7',
//                     }}>
//                     NO DATA FOUND
//                 </Text>
//             );
// }}
//     };
   return (
        <>
            {props?.searchKey.length? (
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
                    // style={{
                    //     marginBottom: isCustomer ? 130 : 195,
                    // }}
                />
            ) :
                (
                    <FlatList
                        data={mouListData}
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
                            return mouList?.status === STATE_STATUS.FETCHING ? (
                                <ActivityIndicator size={22} color={'#000'} />
                            ) : null;
                        }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                        }
                        // style={{
                        //     marginBottom: isCustomer ? 185 : 325,
                        // }}
                    />)}
        </>
    );
};
const styles = StyleSheet.create({


    TopWrap: {
        // padding: Dimension.padding15,
        backgroundColor: '#F7F7F7',
    },
    refresh: {
        fontSize: Dimension.font12,
        color: '#439525',
        fontFamily: Dimension.CustomBoldFont,
        alignSelf: 'center',
    },

    SearchWrap: {
        flexDirection: 'row',
        //flex:1,
        justifyContent: 'space-between',
        height: Dimension.height50,
        margin: Dimension.margin14,
        position: 'relative',
    },
    SearchWraps: {
        marginVertical: Dimension.margin10,
        marginHorizontal: Dimension.margin15,
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        top: 12,
        left: 10,
        width: 24,
        zIndex: 999,
        // alignSelf: 'center',
    },
    searchBar: {
        fontSize: Dimension.font14,
        flex: 7,
        height: Dimension.height50,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E7E7E8',
        fontFamily: Dimension.CustomRegularFont,
        color: '#7E7E7E',
        borderRadius: 8,
        elevation: 16,
        shadowColor: '#455B6324',
        paddingHorizontal: Dimension.padding15,
        paddingLeft: 40,
        marginRight: Dimension.margin10,
    },
    searchbtn: {
        flex: 1,
        borderRadius: 8,
        borderColor: '#E7E7E8',
        borderWidth: 1,
        elevation: 16,
        shadowColor: '#455B6324',
        backgroundColor: '#fff',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ClearBtn: {
        flex: 3,
        borderRadius: 8,
        borderColor: '#E7E7E8',
        borderWidth: 1,
        elevation: 16,
        shadowColor: '#455B6324',
        backgroundColor: '#E4E4E4',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ClearBtnTxt: {
        color: Colors.FontColor,
        fontSize: Dimension.font14,
        fontFamily: Dimension.CustomSemiBoldFont,
    },
    searchedTxt: {
        color: Colors.FontColor,
        fontSize: Dimension.font18,
        fontFamily: Dimension.CustomSemiBoldFont,
        alignSelf: 'center',
    },
    searchTxt: {
        color: '#fff',
        fontSize: Dimension.font16,
        fontFamily: Dimension.CustomSemiBoldFont,
    },
    BtnTxt: {
        fontSize: 14,
        fontFamily: Dimension.CustomMediumFont,
        color: '#fff',
        marginLeft: 8,
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
    CardWrapper: {
        marginBottom: Dimension.margin10,
        // padding: Dimension.padding15,
        backgroundColor: '#fff',
        elevation: 12,
        shadowColor: '#00000017',
    },
    midWrap: {
        paddingBottom: Dimension.padding20,
        paddingHorizontal: Dimension.padding15,
    },
    CSTxt: {
        fontFamily: Dimension.CustomRegularFont,
        fontSize: Dimension.font11,
        color: '#707070',
        marginBottom: Dimension.margin10,
    },
    OpenBtn: {
        borderColor: '#E8F5FF',
        borderWidth: 2,
        borderRadius: 8,
        padding: Dimension.padding10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginRight: Dimension.margin10,
        backgroundColor: '#fff',
    },
    ActiveOpenBtn: {
        borderColor: '#E8F5FF',
        borderWidth: 2,
        borderRadius: 8,
        padding: Dimension.padding10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginRight: Dimension.margin10,
        backgroundColor: '#E8F5FF',
    },
    CloseBtn: {
        borderColor: '#E8F5FF',
        borderWidth: 2,
        borderRadius: 8,
        padding: Dimension.padding10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginLeft: Dimension.margin10,
        backgroundColor: '#fff',
    },
    Orangetxt: {
        color: '#D57608',
        fontSize: Dimension.font16,
        fontFamily: Dimension.CustomSemiBoldFont,
    },
    Greentxt: {
        color: '#05C338',
        fontSize: Dimension.font16,
        fontFamily: Dimension.CustomSemiBoldFont,
    },
    Greendot: {
        width: 11,
        height: 11,
        backgroundColor: '#00A100',
        borderRadius: 11,
        marginTop: 2,
        marginRight: 5,
    },
    Reddot: {
        width: 11,
        height: 11,
        backgroundColor: '#E52E16',
        borderRadius: 11,
        marginTop: 2,
        marginRight: 5,
    },
    bluedot: {
        width: 11,
        height: 11,
        backgroundColor: '#1692E5',
        borderRadius: 11,
        marginTop: 2,
        marginRight: 5,
    },
    statustxt: {
        color: '#363636',
        fontSize: Dimension.font12,
        fontFamily: Dimension.CustomSemiBoldFont,
        marginLeft: Dimension.margin10,
        fontWeight: 'bold',
        alignSelf: 'center',
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
        marginBottom: Dimension.margin6,
    },
    lightTxt: {
        fontFamily: Dimension.CustomRegularFont,
        fontSize: Dimension.font12,
        color: Colors.FontColor,
        maxWidth: Dimension.width150,
    },
    ModalboldTxt: {
        fontFamily: Dimension.CustomSemiBoldFont,
        fontSize: Dimension.font14,
        color: Colors.FontColor,
        marginBottom: Dimension.margin6,
    },
    ModallightTxt: {
        fontFamily: Dimension.CustomRegularFont,
        fontSize: Dimension.font14,
        color: Colors.FontColor,
    },
    footerbtn: {
        position: 'absolute',
        backgroundColor: '#fff',
        paddingHorizontal: Dimension.padding15,
        paddingVertical: Dimension.padding10,
        bottom: 0,
        width: '100%',
        left: 0,
    },
    createBtn: {
        borderRadius: 8,
        borderColor: '#E7E7E8',
        borderWidth: 1,
        elevation: 16,
        shadowColor: '#455B6324',
        backgroundColor: '#0063A7',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createBtnTxt: {
        color: '#fff',
        fontSize: Dimension.font20,
        fontFamily: Dimension.CustomMediumFont,
        paddingVertical: Dimension.padding12,
    },
    modalbg: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        margin: 0,
        flex: 1,
    },
    modalInner: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        alignContent: 'flex-end',
    },
    ModalView: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingVertical: Dimension.padding5,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        left: 0,
        flex: 1,
    },
    modalHeader: {
        padding: Dimension.padding15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headText: {
        fontSize: Dimension.font16,
        color: '#3c3c3c',
        fontFamily: Dimension.CustomSemiBoldFont,
    },
    image: {
        width: Dimension.width25,
        height: Dimension.height25,
        alignSelf: 'center',
    },
    ExportBTn: {
        flexDirection: 'row',
    },
    exportTxt: {
        fontSize: Dimension.font12,
        fontFamily: Dimension.CustomRegularFont,
        color: '#0063A7',
        marginLeft: Dimension.margin8,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: Dimension.padding20,
        padding: Dimension.padding20,
        textAlign: 'center',
    },
    modalTitle: {
        fontSize: Dimension.font14,
        color: '#363636',
        fontWeight: 'bold',
        marginVertical: Dimension.margin20,

        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    inputField: {
        borderColor: '#979797',
        borderWidth: 1,
        borderRadius: 4,
        fontFamily: Dimension.CustomRegularFont,
        fontSize: Dimension.font14,
        textAlignVertical: 'center',
        color: '#333333',
        backgroundColor: '#fff',
        paddingLeft: Dimension.padding10,
        paddingVertical: Dimension.padding6,
        marginVertical: Dimension.margin25,
    },
    separator: {
        height: 1,
        backgroundColor: '#EFEFEF',
        width: '100%',
    },


});
export default ContractList;