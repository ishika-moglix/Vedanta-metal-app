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
import { AlLiveTrackingLink } from '../../constants';
import { handleDownload } from '../../utils/generatePdfFile';
import DatePickerInput from '../../component/DateTimePicker';
import FilterButton from '../../component/Button';
import { filterTextRegex } from '../../constants';
import { convertedDate, convertDate } from '../../utils/BiometricAuth';
import Toast from 'react-native-toast-message';
import { OrderedMap } from 'immutable';

//import { useNavigation } from "@react-navigation/native";
//import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Linking } from 'react-native';
import HeaderTab from '../../component/HeaderTabs';
import { current } from '@reduxjs/toolkit';
const ContractListScreen = props => {
    const dispatch = useDispatch();
    const authData = useSelector(state => state.auth);
    const branchAccessData = useSelector(state => state.data);
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
    const [activeTab, setActiveTab] = useState('');

    const [filterData, setFilterData] = useState({
        invoiceNo: '',
        fromDate: '',
        toDate: '',
        dONo: '',
        customerId: '',
        plant: '',
        orderNo: '',
        customerName: '',
    });
    const [sapData, setSapData] = useState({
        toDate: '',
        fromDate: '',
        plant: '',
    });


    const mouList = useSelector(state => state.mouList?.mouList);
    const mouListData = useSelector(state => state.mouList?.mouList?.data);
    const dispatchDetails = useSelector(
        state => state.dispatchDetails?.dispatchDetails,
    );
    const dispatchDetailsData = useSelector(
        state => state.dispatchDetails?.dispatchDetails?.data,
    );

    return (
        <View style={styles.containerWrap}>
            <Header
                navigation={{
                    ...props?.navigation,
                    goBack: () => props?.navigation.pop(),
                }}
                showBack
                showText={props?.route?.params?.mouNo}
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
            // exportData={handleExportData}
            />
            <ScrollView>
                <View style={styles.CardWrapper}>
                    <Text style={[styles.boldTxt, {
                        paddingHorizontal: Dimension.padding15,
                        paddingVertical: Dimension.padding10,
                        fontWeight: 'bold'
                    }]}>MOU</Text>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Pricing Type*</Text>
                            <Text style={[styles.boldTxt, { color: '#0063A7' }]}>
                                {"cardItem?.mouNo"}
                            </Text>
                        </View>
                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                            <Text style={styles.boldTxt}>MOU Start Date</Text>
                            <Text style={styles.lightTxt}>
                                {"cardItem?.customerName"}
                                {/* {convertedDate(cardItem?._source?.creationDate)} */}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>MOU End Date</Text>
                            <Text style={styles.lightTxt}>{"cardItem?.duration"}</Text>
                        </View>

                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                            <Text style={styles.boldTxt}>Customer Group</Text>
                            <Text style={styles.lightTxt}> {"cardItem?.priceType"}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>InvoTerms</Text>
                            <Text style={styles.lightTxt}>
                                {' '}
                                {"cardItem?.quantity"}
                                {/* {'\n'}
                  {cardItem?._source?.toPlantName} */}
                            </Text>
                        </View>

                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                            <Text style={styles.boldTxt}>Total Quantity(MT)</Text>
                            <Text style={styles.lightTxt}> {"cardItem?.createdBy"}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Created Date</Text>
                            <Text style={styles.lightTxt}>
                                {"convertedDate(cardItem?.createdOn)"}
                            </Text>
                        </View>


                    </View>
                    {/* <View style={styles.separator} /> */}
                    <View style={styles.statusWrap}></View>
                </View>
                <View style={styles.CardWrapper}>
                    <Text style={[styles.boldTxt, {
                        paddingHorizontal: Dimension.padding15,
                        paddingVertical: Dimension.padding10,
                        fontWeight: 'bold'
                    }]}>Premium</Text>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Delivery Options*</Text>
                            <Text style={[styles.boldTxt, { color: '#0063A7' }]}>
                                {"cardItem?.mouNo"}
                            </Text>
                        </View>
                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                            <Text style={styles.boldTxt}>Premoium Model*</Text>
                            <Text style={styles.lightTxt}>
                                {"cardItem?.customerName"}
                                {/* {convertedDate(cardItem?._source?.creationDate)} */}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>QMJP*</Text>
                            <Text style={styles.lightTxt}>{"cardItem?.duration"}</Text>
                        </View>

                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                            <Text style={styles.boldTxt}>A*</Text>
                            <Text style={styles.lightTxt}> {"cardItem?.priceType"}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Premium($/MT)*</Text>
                            <Text style={styles.lightTxt}>
                                {' '}
                                {"cardItem?.quantity"}
                                {/* {'\n'}
                  {cardItem?._source?.toPlantName} */}
                            </Text>
                        </View>

                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                            <Text style={styles.boldTxt}>LME</Text>
                            <Text style={styles.lightTxt}> {"cardItem?.createdBy"}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Discount*</Text>
                            <Text style={styles.lightTxt}>
                                {"convertedDate(cardItem?.createdOn)"}
                            </Text>
                        </View>



                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                            <Text style={styles.boldTxt}>Depot Cost*</Text>
                            <Text style={styles.lightTxt}> {"cardItem?.createdBy"}</Text>
                        </View>
                    </View>
                    {/* <View style={styles.separator} /> */}
                    <View style={styles.statusWrap}></View>
                </View>
                <View style={styles.CardWrapper}>
                    <Text style={[styles.boldTxt, {
                        paddingHorizontal: Dimension.padding15,
                        paddingVertical: Dimension.padding10,
                        fontWeight: 'bold'
                    }]}>Products</Text>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Product Name*</Text>
                            <Text style={[styles.boldTxt, { color: '#0063A7' }]}>
                                {"cardItem?.mouNo"}
                            </Text>
                        </View>
                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                            <Text style={styles.boldTxt}>Thickness(0.5 to 1.63)mm*</Text>
                            <Text style={styles.lightTxt}>
                                {"cardItem?.customerName"}
                                {/* {convertedDate(cardItem?._source?.creationDate)} */}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Alloy</Text>
                            <Text style={styles.lightTxt}>{"cardItem?.duration"}</Text>
                        </View>

                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                            <Text style={styles.boldTxt}>Temper</Text>
                            <Text style={styles.lightTxt}> {"cardItem?.priceType"}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Width(795 to 1100)mm</Text>
                            <Text style={styles.lightTxt}>
                                {' '}
                                {"cardItem?.quantity"}
                                {/* {'\n'}
                  {cardItem?._source?.toPlantName} */}
                            </Text>
                        </View>

                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                            <Text style={styles.boldTxt}>Packing</Text>
                            <Text style={styles.lightTxt}> {"cardItem?.createdBy"}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Pattern</Text>
                            <Text style={styles.lightTxt}>
                                {"convertedDate(cardItem?.createdOn)"}
                            </Text>
                        </View>



                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                            <Text style={styles.boldTxt}>Length(300 to 10000)mm</Text>
                            <Text style={styles.lightTxt}> {"cardItem?.createdBy"}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Indicative Quantity(MT)*</Text>
                            <Text style={styles.lightTxt}>
                                {"convertedDate(cardItem?.createdOn)"}
                            </Text>
                        </View>



                        <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                            <Text style={styles.boldTxt}>Variant Upcharge(Rs/MT)*</Text>
                            <Text style={styles.lightTxt}> {"cardItem?.createdBy"}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Variant Surcharge(Rs/MT)*</Text>
                            <Text style={styles.lightTxt}>
                                {"convertedDate(cardItem?.createdOn)"}
                            </Text>
                        </View>



                        {/* <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                        <Text style={styles.boldTxt}>Length(300 to 10000)mm</Text>
                        <Text style={styles.lightTxt}> {"cardItem?.createdBy"}</Text>
                    </View> */}
                    </View>
                    {/* <View style={styles.separator} /> */}
                    <View style={styles.statusWrap}></View>
                </View>
            </ScrollView>
        </View>
    );
};
export default ContractListScreen;
