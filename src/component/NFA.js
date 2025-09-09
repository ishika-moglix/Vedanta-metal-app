
import React, { useRef, useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import Dimension from '../Theme/Dimension';
import Colors from '../Theme/Colors';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { STATE_STATUS } from '../redux/constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertedDated } from '../utils/BiometricAuth';
import {
    getNFAListRequest,
    getNfaRequest,
} from '../redux/feature/mouslice';
import Toast from 'react-native-toast-message';
import { downloadNFAPdf } from '../services/mouService';
import { getRealUrl, handleDownload } from '../utils/generatePdfFile';
import CONSTANTS from '../services/constant';
import CustomLoader from './customLoader';
const NFAList = props => {
    const dispatch = useDispatch();
    const authData = useSelector(state => state.auth);
    const branchAccessData = useSelector(state => state.branchAccess);
    const getNfaStatus = useSelector(state => state.mouList?.getNfa?.status)
    const nfaList = useSelector(state => state.mouList?.nfaList);
    const nfaListData = useSelector(state => state.mouList?.nfaList?.data);
    const { data, status, isCustomer } = useSelector(state => state.branchAccess);
    const [refreshing, setRefreshing] = useState(false);
    const [dataModal, setDataModal] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [filterCount, setFilterCount] = useState(0);  
    const [loader, setLoader] = useState(false);
    useEffect(() => {
        if (nfaList.status === STATE_STATUS.FAILED_FETCH) {
            Toast.show({
                type: 'error',
                text2: 'Data Not Found',
                visibilityTime: 4000,
                autoHide: true,
            });
        }
    }, [nfaList.status]);
console.log("NFA PROPS", props);

    const handleNfaWebview = async (id, is_v2, mouNumber) => {
        console.log("check nfa", id, mouNumber);
        
        const userInfo = await AsyncStorage.getItem('@user_info');
        const finalUrl = await AsyncStorage.getItem('@final_Url');
        if (userInfo) {
            const info = JSON.parse(userInfo);
            const exp_url =`${CONSTANTS.WEBURL.NFASUPPLIER}?nfaId=${id}&token=${info.token}`
            props?.navigation.push('WebView', {
                URL: exp_url,
                fromPage: 'Mou',
                id: mouNumber,
                showBack: true
            });
        }
    };

    const convertDateToTimestamp = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number);
        const timestamp = new Date(year, month - 1, day).getTime();
        return timestamp;
    }

    const onRefresh = async () => {
        props?.searchResults([]);
        // props?.resetFilter(true);
        setRefreshing(true);
        props?.setSearchKey('');
        props?.filterCount(0);
        props?.filteredData({
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
            businessUnit: authData?.data?.businessUnit,
            status: "",
            approverUserId: null,
            nfaNumber: "",
            companyId: isCustomer ? jsonSessionData?.companyId : null,
            fromTimestamp: null,
            toTimestamp: null,
            limit: 10,
            offset: 0,
            region: branchAccessData?.data?.branchModules?.region,
            // region: branchAccessData?.data?.branchModules?.region? branchAccessData?.data?.branchModules?.region: "EI01,WI01,NI01,SI01",
            creatorId: ""
        };
        dispatch(
            getNFAListRequest({
                page: 1,
                pageSize: 10,
                dataObj,
            }),
        );
        setRefreshing(false);
    };
    
    const onEndReached = async () => {
        if (
            nfaList?.status == STATE_STATUS.FETCHED &&
            nfaList?.status != STATE_STATUS.FETCHING &&
            nfaList?.currentPage < nfaList?.totalPages
        ) {
            props?.resetFilter(false);
            const sessionData = await AsyncStorage.getItem('@get_session');
            const getPlantId = await AsyncStorage.getItem('@plantId');
            let jsonSessionData = JSON.parse(sessionData);
            let plantId = JSON.parse(getPlantId);
            const currentPage = nfaList?.currentPage || 0;
            const dataObj = {
                businessUnit: authData?.data?.businessUnit,
                status: props?.filterData?.status,
                approverUserId: props?.filterData?.approverUserId,
                nfaNumber: props?.filterData?.nfaNumber,
                customerGroup: props?.filterData?.customerGroup,
                fromTimestamp: convertDateToTimestamp(props?.filterData?.fromDate),
                toTimestamp: convertDateToTimestamp(props?.filterData?.toDate),
                limit: 10,
                offset: currentPage,
                region: branchAccessData?.data?.branchModules?.region,
                // region: branchAccessData?.data?.branchModules?.region? branchAccessData?.data?.branchModules?.region: "EI01,WI01,NI01,SI01",
                creatorId: props?.filterData?.creator_id,
                companyId: isCustomer ? jsonSessionData?.companyId : null,
            };
            dispatch(
                getNFAListRequest({
                    page: nfaList?.currentPage + 1,
                    pageSize: 10,
                    dataObj,
                }),
            );
        }
    };
    const handleViewNfa = async (id) => {
        console.log("id is", id);

        try {
            dispatch(
                getNfaRequest({
                    nfaId: id
                }))
            if (getNfaStatus == STATE_STATUS.FETCHED) {
                console.log("go");

                props?.navigation.navigate('ContractList', { mouNo: id })
            }
        } catch (err) {
            console.log("Error", err);

        }
    }
    const handleDownloadNfa = async (id) => {
        console.log("id is", id);

        try {
            setLoader(true);
            const data = await downloadNFAPdf(id);
            console.log("data download", data);

            if (data?.data?.success) {
                setLoader(false);
                getRealUrl(data?.data?.data, 'NFA_PDF');
                Toast.show({
                    type: 'success',
                    text2: data?.data?.message || 'Pdf generated successfully',
                    visibilityTime: 4000,
                    autoHide: true,
                });
            }
        } catch (err) {
            setLoader(false);
            console.log("Error", err);
        }
    }
    const toggleDataModal = item => {
        setSelectedData(item);
        setDataModal(!dataModal);
    };

    const formattedData = [
        {
            nfaListingData: props?.searchResultsData
          } 
    ];

    const renderItem = ({ item, index }) => {
        if (item?.nfaListingData?.length > 0) {
            return item?.nfaListingData?.map((cardItem, cardIndex) => {
                return (
                    <View style={styles.CardWrapper}>
                        <TouchableOpacity
                            onPress={() => handleNfaWebview(cardItem?.nfaId, cardItem?.is_v2, cardItem?.nfaNumber)}

                            style={styles.statusWrap}>
                            {/* <View style={styles.statusWrap}> */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 3,
                                }}>
                                {cardItem.status == 'Approved' ? (
                                    <View style={styles.Greendot}></View>
                                ) : cardItem.status == 'Rejected' ? (
                                    <View style={styles.Reddot}></View>
                                ) : (
                                    <View style={styles.bluedot}></View>
                                )}

                                <Text style={[styles.boldTxt]}>{`${cardItem?.status} From ${cardItem?.currentApprovalStatus?.currentApprover?.name}`}</Text>
                            </View>
                            <MaterialCommunityIcon
                                name={'chevron-right'}
                                color={'#000'}
                                size={20}
                                style={{ alignSelf: 'center' }}
                            />
                            {/* </View> */}
                        </TouchableOpacity>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.boldTxt}>NFA Number</Text>
                                <TouchableOpacity onPress={() => handleNfaWebview(cardItem?.nfaId, cardItem?.is_v2, cardItem?.nfaNumber)}>
                                    <Text style={[styles.boldTxt, { color: '#0063A7' }]}>
                                        {cardItem?.nfaNumber}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={styles.boldTxt}>Customer Group</Text>
                                <Text style={styles.lightTxt}>
                                    {cardItem?.customerGroup}
                                    {/* {convertedDate(cardItem?._source?.creationDate)} */}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.boldTxt}>Duration</Text>
                                <Text style={styles.lightTxt}>{`${cardItem?.contractDurationFrom} to ${cardItem?.contractDurationTo}`}</Text>
                            </View>

                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={styles.boldTxt}>NFA Type</Text>
                                <Text style={styles.lightTxt}> {cardItem?.nfaType}</Text>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.boldTxt}>Created Date</Text>
                                <Text style={styles.lightTxt}>
                                    {convertedDated(cardItem?.createdAt)}
                                </Text>
                            </View>

                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={styles.boldTxt}>Created By</Text>
                                <Text style={styles.lightTxt}> {cardItem?.createdBy}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleDownloadNfa(cardItem?.nfaNumber
                            )}
                            style={styles.statusWrap}>
                            <Text style={[styles.boldTxt, { paddingTop: Dimension.padding10, color: '#0065AC' }]}>Download NFA</Text>
                            <AntDesign
                                name={'download'}
                                size={20}
                                color={'#0065AC'}
                                style={{ paddingRight: Dimension.padding8 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => toggleDataModal(cardItem)}
                            style={styles.statusWrap}>
                            <Text style={[styles.boldTxt, { color: '#0065AC' }]}>View Logs</Text>
                            <AntDesign name="eyeo" size={18} color="#0065AC" style={{ paddingRight: Dimension.padding8 }} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleNfaWebview(cardItem?.nfaId, cardItem?.is_v2, cardItem?.nfaNumber)}
                            style={styles.statusWrap}>
                            <Text style={[styles.boldTxt, { color: '#0065AC' }]}>View</Text>
                            <MaterialCommunityIcon
                                name={'chevron-right'}
                                color={'#0065AC'}
                                size={20}
                                style={{ alignSelf: 'center', paddingRight: Dimension.padding8 }}
                            />
                        </TouchableOpacity>
                    </View >
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
        < >
           {loader&& <CustomLoader fullScreen/>}
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
                (<FlatList
                    data={nfaListData}
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
                        return nfaList?.status === STATE_STATUS.FETCHING ? (
                            <ActivityIndicator size={22} color={'#000'} />
                        ) : null;
                    }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    // style={{
                    //     marginBottom: isCustomer ? 185 : 130,
                    // }}
                />)}
            {dataModal && <Modal
                overlayPointerEvents={'auto'}
                visible={dataModal}
                style={styles.modalbg}
                animationType={'slide'}
                transparent={true}
            >
                <View style={styles.modalInner}>
                    <View style={styles.ModalView}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.boldTxt, { fontSize: Dimension.font14 }]}>
                                Status logs{' '}
                            </Text>
                            <TouchableOpacity onPress={() => setDataModal(false)}>
                                <MaterialCommunityIcon name="close-circle" size={22} color={'#3c3c3c'} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.row,]}>
                            <View style={styles.col}>
                                <Text style={styles.ModalboldTxt}>NFA Number</Text>
                            </View>

                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={[styles.ModallightTxt]}>
                                    {selectedData.nfaNumber}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.row,]}>
                            <View style={styles.col}>
                                <Text style={[styles.ModalboldTxt, { paddingBottom: Dimension.padding20 }]}>Customer Group</Text>
                            </View>

                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={[styles.ModallightTxt]}>
                                    {selectedData.customerGroup}
                                </Text>
                            </View>
                        </View>
                        <ScrollView
                            // style={{ maxHeight: 300 }} 
                            contentContainerStyle={{ paddingBottom: 20 }}
                        >
                            <View style={{
                                borderWidth: 1, borderColor: '#c7c7c7', borderTopWidth: 0, borderBottomWidth: 0, borderRightWidth: 0,
                                marginLeft: Dimension.margin16
                            }}>
                                <View style={{ marginBottom: Dimension.margin15, marginLeft: Dimension.margin15 }}>
                                    <View style={styles.row}>
                                        <View style={styles.col}>
                                            <Text style={styles.ModalboldTxt}>Date of Creation</Text>
                                        </View>

                                        <View style={[styles.col,]}>
                                            <Text style={[styles.ModallightTxt]}>
                                                {convertedDated(selectedData.createdAt)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.row}>
                                        <View style={styles.col}>
                                            <Text style={styles.ModalboldTxt}>Created By</Text>
                                        </View>

                                        <View style={[styles.col,]}>
                                            <Text style={[styles.ModallightTxt]}>
                                                {selectedData.createdBy}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.row}>
                                        <View style={styles.col}>
                                            <Text style={styles.ModalboldTxt}>Status</Text>
                                        </View>

                                        <View style={[styles.col,]}>
                                            <Text style={[styles.ModallightTxt]}>
                                                {selectedData.status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                {selectedData.approvalHistories && selectedData.approvalHistories.map((item, index) => (
                                    <View key={index} style={{ marginBottom: Dimension.margin20, marginLeft: Dimension.margin15 }}>
                                        <View style={styles.row}>
                                            <View style={styles.col}>
                                                <Text style={styles.ModalboldTxt}>Date of Action:</Text>
                                            </View>
                                            <View style={[styles.col,]}>
                                                <Text style={styles.ModallightTxt}>{convertedDated(item.createdAt)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={styles.col}>
                                                <Text style={styles.ModalboldTxt}>Action Taken By:</Text>
                                            </View>

                                            <View style={[styles.col,]}>
                                                <Text style={styles.ModallightTxt}>{item.currentApprover?.name}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={styles.col}>
                                                <Text style={styles.ModalboldTxt}>Approver Designation:</Text>
                                            </View>
                                            <View style={[styles.col,]}>
                                                <Text style={styles.ModallightTxt}>{item.currentApprover?.designation}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={styles.col}>
                                                <Text style={styles.ModalboldTxt}>Remarks:</Text>
                                            </View>

                                            <View style={[styles.col,]}>
                                                <Text style={styles.ModallightTxt}>{item.currentApprover?.remarks || 'N/A'}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.row}>
                                            <View style={styles.col}>
                                                <Text style={[styles.ModalboldTxt]}>Status:</Text>
                                            </View>

                                            <View style={[styles.col,]}>
                                                <Text style={[styles.ModallightTxt, { color: 'green' }]}>{item.status} by {item.currentApprover?.designation}</Text>
                                            </View>
                                        </View>
                                    </View>

                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>}
        </>
    );
};
const styles = StyleSheet.create({
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
        // paddingBottom: 50,
    },
    containerWrap: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        position: 'relative',
        // marginBottom: Dimension.margin200,
    },

    TopWrap: {
        // padding: Dimension.padding15,
        backgroundColor: '#F7F7F7',
    },
    ScannerBtn: {
        //width: '100%',
        borderRadius: 4,
        backgroundColor: '#0072C6',
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    username: {
        fontSize: Dimension.font26,
        color: '#0063A7',
        fontFamily: Dimension.CustomBoldFont,
    },
    update: {
        fontSize: Dimension.font10,
        color: '#363636',
        fontFamily: Dimension.CustomBoldFont,
        marginRight: Dimension.margin8,
    },
    refresh: {
        fontSize: Dimension.font12,
        color: '#439525',
        fontFamily: Dimension.CustomBoldFont,
        alignSelf: 'center',
    },
    welcome: {
        color: '#454F63',
        fontSize: Dimension.font16,
        fontFamily: Dimension.CustomRegularFont,
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
        // flex: 1,
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
        fontSize: Dimension.font12,
        color: '#363636',
        fontWeight: 'bold',
        //marginBottom: Dimension.margin6,
    },
    ModallightTxt: {
        fontFamily: Dimension.CustomRegularFont,
        fontSize: Dimension.font12,
        fontWeight: '700',
        color: '#363636',
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
        height: '80%',
        width: '100%',
        left: 0,
        // flex: 1,
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
export default NFAList;