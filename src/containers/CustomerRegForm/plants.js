import React, { useRef, useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    FlatList
} from 'react-native';
import { ScannerService } from '../../services/scannerService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dimension from '../../Theme/Dimension';
import Colors from '../../Theme/Colors';
import styles from './style';
import Header from '../../component/Header';
import CONSTANTS from '../../services/constant';
import CustomeIcon from '../../component/CustomeIcon';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector, useDispatch } from 'react-redux';
import CustomLoader from '../../component/customLoader';
import HeaderTab from '../../component/HeaderTabs';
import { handleDownload } from '../../utils/generatePdfFile';
const plantsScreen = props => {
    const dispatch = useDispatch();
    const authData = useSelector(state => state.auth);
    const item = useSelector(state => state?.customerRegistration?.userGet?.data);
    const formData = useSelector(state => state?.customerRegistration?.getAllByCompany?.data);
    const renderItem = ({ item, index }) => {
        console.log("c r item", item);
        return (
            <ScrollView>
            <View style={styles.CardWrapper}>
             <View
                    // onPress={() => handleCustomerForm(cardItem?.business_id)
                    // }
                    style={styles.statusWrap}>
                    <View style={{ flexDirection: 'row', marginTop: 3 }}>
                            <Text selectable={true} style={[styles.boldTxt]} >{`Plant ID : ${item?.branchLang?.plantCode ? item?.branchLang?.plantCode : ''}`}</Text>
                    </View>
                    {/* <View style={{ flexDirection: 'row', }}>
                        {/* <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}> 
                             <TouchableOpacity style={styles.row}>
                            <AntDesign
                                name={'edit'}
                                size={18}
                                color={'#0063A7'}></AntDesign>
                            <Text style={[styles.boldTxt, { paddingHorizontal: Dimension.padding10, color: '#0063A7' }]}>
                                Edit
                            </Text>
                        </TouchableOpacity>
                        </View> 

                    </View> */}
                </View>

                <View style={styles.row}>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>Plant Name</Text>
                        <Text selectable={true} style={styles.lightTxt}>
                            {item?.branchLang.displayName ? `${item?.branchLang.displayName}` : '-'}
                        </Text>
                    </View>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>Phone number</Text>
                        <Text selectable={true} selectionColor="#FF5733" style={[styles.lightTxt, ]}>
                            {item?.phone ? `${item?.phone}` : '-'}
                        </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>City</Text>
                        <Text selectable={true} style={styles.lightTxt}>
                            {item?.branchLang.city ? `${item?.branchLang.city}` : '-'}
                        </Text>
                    </View>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>State</Text>
                        <Text selectable={true} selectionColor="#FF5733" style={[styles.lightTxt, ]}>
                            {item?.branchLang.state ? `${item?.branchLang.state}` : '-'}
                        </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>Creation Date</Text>
                        <Text selectable={true} style={styles.lightTxt}>
                            {item?.created_on ? `${item?.created_on}` : '-'}
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
        );
    };

    return (
        <>
        <View style={styles.separator}></View>
        
                         <FlatList
                            data={formData?.branchList}
                            renderItem={renderItem}
                            contentContainerStyle={{
                                paddingVertical: Dimension.padding15,
                                paddingTop: 0,
                            }}
                            keyExtractor={(item, index) => `${index}-item`}
                            // onEndReached={onEndReached}
                            // onEndReachedThreshold={0.7}
                            // alwaysBounceVertical={true}
                            // bounces={true}
                          
                           
                            // style={{
                            //     marginBottom:  130,
                            //     }}
                        /> 
       </>                 
    )
}
export default plantsScreen;