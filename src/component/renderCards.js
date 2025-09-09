
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { convertedDated } from '../utils/BiometricAuth';
import Dimension from '../Theme/Dimension';
import Colors from '../Theme/Colors';

const RenderCard = ({ cardItem, onPress }) => {
    console.log("Card item from mou", cardItem, onPress);

    return (
        <View style={styles.CardWrapper}>
            <TouchableOpacity onPress={() => onPress(cardItem?.mouNo)} style={styles.statusWrap}>
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

                    <Text style={[styles.boldTxt]}>{cardItem?.status}</Text>
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
                    <Text style={styles.boldTxt}>Contract ID.</Text>
                    <Text style={[styles.boldTxt, { color: '#0063A7' }]}>{cardItem?.mouNo}</Text>
                </View>

                <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                    <Text style={styles.boldTxt}>Customer Name</Text>
                    <Text style={styles.lightTxt}>{cardItem?.customerName}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.boldTxt}>Duration</Text>
                    <Text style={styles.lightTxt}>{cardItem?.duration}</Text>
                </View>

                <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                    <Text style={styles.boldTxt}>Price Type</Text>
                    <Text style={styles.lightTxt}>{cardItem?.priceType}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.boldTxt}>Annual Quantity</Text>
                    <Text style={styles.lightTxt}>{cardItem?.quantity}</Text>
                </View>

                <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                    <Text style={styles.boldTxt}>Created By</Text>
                    <Text style={styles.lightTxt}>{cardItem?.createdBy}</Text>
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.boldTxt}>Created Date</Text>
                    <Text style={styles.lightTxt}>{convertedDated(cardItem?.createdOn)}</Text>
                </View>
            </View>
        </View>
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
export default RenderCard;
