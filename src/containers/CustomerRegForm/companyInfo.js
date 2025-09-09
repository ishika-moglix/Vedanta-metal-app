import React, { useRef, useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import { ScannerService } from '../../services/scannerService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dimension from '../../Theme/Dimension';
import Colors from '../../Theme/Colors';
import styles from './style';
import { useSelector, useDispatch } from 'react-redux';
import CustomLoader from '../../component/customLoader';
import HeaderTab from '../../component/HeaderTabs';
import { handleDownload } from '../../utils/generatePdfFile';
import Toast from 'react-native-toast-message';
const CompanyInfo = props => {
    const dispatch = useDispatch();
    const authData = useSelector(state => state.auth);
    const branchAccessData = useSelector(state => state.branchAccess?.data?.branchModules);
    const userData = useSelector(state => state?.customerRegistration?.userGet?.data);
    const formData = useSelector(state => state?.customerRegistration?.getDetails?.data);
    const getByCompanyData = useSelector(state => state?.customerRegistration?.getByCompany);
    const companyData = useSelector(state => state?.customerRegistration?.companyGet?.data);
    const isAluminium = authData?.data?.businessUnit === 'Aluminium' ? true : false;
    const isCopper = authData?.data?.businessUnit === 'Copper' ? true : false;
    const isZinc = authData?.data?.businessUnit === 'Zinc' ? true : false;
    const isTransporter = branchAccessData?.roleNames.includes('Transporter') ? true : false;
    const isSnop = branchAccessData?.roleNames.includes('Sales and Operation Planning') ? true : false;
    const isRM = branchAccessData?.roleNames.includes('Regional Manager') ? true : false;
    const isSBFM = branchAccessData?.roleNames.includes("Sector Buyer Finance Manager") ? true : false;
    const isLENDER = branchAccessData?.roleNames.includes('Lender') ? true : false;
    
    const handleDownloadUrl = async (link, type) => {
        // setLoader(true);
        if (!link){
        Toast.show({
              type: 'error',
              text2: 'url not found',
              visibilityTime: 4000,
              autoHide: true,
        });
            return;
        }
        const fixedLink = link.startsWith('http') ? link : `https://${link}`;
        await handleDownload(fixedLink, type);
    };

    const parseOtherDocuments = (documents) => {
        console.log("documents for other docs", documents);
        const otherDocuments = [];
      
        if (documents && documents.length > 0 ) {
          const string = documents;
          let sTemp = "";
          for (let i = 0; i < string.length; ++i) {
            sTemp += string[i];
      
            if (string[i] === "}") {
              if (sTemp.charAt(0) === ",") {
                sTemp = sTemp.substring(1);
              }
              try {
                otherDocuments.push(JSON.parse(sTemp));
              } catch (err) {
                console.warn("Failed to parse otherdoc:", sTemp, err);
              }
              sTemp = "";
            }
          }
        }
        return otherDocuments;
      };
     
    const otherDocuments = parseOtherDocuments(companyData?.company?.documents?.[0]?.otherdocs);
//    console.log(formData, "....", formData?.branch?.branchLang);
   
    return (
        <ScrollView>
            <View style={styles.CardWrapper}>

                <View style={[styles.statusWrap, { flexDirection: 'row', marginTop: 3 }]}>
                    <Text selectable={true} style={[styles.boldTxt]} >Company Info</Text>
                </View>

                <View style={styles.row}>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>GSTIN</Text>
                        <Text selectable={true} style={styles.lightTxt}>
                            {formData?.branch?.branchLang?.gstn ? `${formData?.branch?.branchLang?.gstn}` : '-'}
                        </Text>
                    </View>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>Company Name</Text>
                        <Text selectable={true} selectionColor="#FF5733" style={[styles.lightTxt, ]}>
                            {formData?.branch?.branchLang?.displayName ? `${formData?.branch?.branchLang?.displayName}` : '-'}
                        </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.boldTxt}>Region</Text>
                        <Text selectable={true} style={styles.lightTxt}>
                            {formData?.branch?.branchLang?.region ? `${formData?.branch?.branchLang?.region}` : '-'}
                        </Text>
                    </View>
                    {!isTransporter && (isAluminium || isCopper) &&
                        ((isSnop && formData?.branch?.branchLang?.approvalStatus === 'Approved') || (isRM && (formData?.branch?.branchLang?.approvalStatus === 'Approved' || formData?.branch?.branchLang?.approvalStatus === 'Pending from SNOP')) || (!isSnop && !isRM)) &&
                        // {!isTransporter && isAluminium && ((isSnop && formData?.branch?.branchLang?.approvalStatus === 'Pending from SNOP') || (isRM && formData?.branch?.branchLang?.approvalStatus === 'Pending from RM')) &&
                        <View style={[styles.col,]}>
                            <Text style={styles.boldTxt}>Group Name</Text>
                            <Text style={styles.lightTxt}>
                                {' '}
                                {formData?.groupName ? `${formData?.groupName}` : '-'}
                            </Text>
                        </View>}

                    {/* {!isTransporter && (isZinc || isAluminium) &&
                    <View style={[styles.col, ]}>
                    <Text style={styles.boldTxt}>Trade Name</Text>
                    <Text style={styles.lightTxt}>
                        {' '}
                        {formData?.groupName ? `${formData?.groupName}` : '-'}
                    </Text>
            </View>} */}

                    {/* {!isTransporter && (isAluminium) &&
                    <View style={[styles.col, ]}>
                    <Text style={styles.boldTxt}>Group Code</Text>
                    <Text style={styles.lightTxt}>
                        {' '}
                        {formData?.groupName ? `${formData?.groupName}` : '-'}
                    </Text>
            </View>} */}

                    {/* {isTransporter &&
                    <View style={[styles.col, ]}>
                    <Text style={styles.boldTxt}>Region</Text>
                    <Text style={styles.lightTxt}>
                        {' '}
                        {formData?.groupName ? `${formData?.groupName}` : '-'}
                    </Text>
            </View>} */}

                    {/* {isZinc &&
                    <View style={[styles.col, ]}>
                    <Text style={styles.boldTxt}>Company Type</Text>
                    <Text style={styles.lightTxt}>
                        {' '}
                        {formData?.groupName ? `${formData?.groupName}` : '-'}
                    </Text>
            </View>} */}

                    {/* {isZinc &&
                    <View style={[styles.col, ]}>
                    <Text style={styles.boldTxt}>Nature of Company</Text>
                    <Text style={styles.lightTxt}>
                        {' '}
                        {formData?.groupName ? `${formData?.groupName}` : '-'}
                    </Text>
            </View>} */}
                    {/* {isZinc &&
                    <View style={[styles.col, ]}>
                    <Text style={styles.boldTxt}>Metal Name</Text>
                    <Text style={styles.lightTxt}>
                        {' '}
                        {formData?.groupName ? `${formData?.groupName}` : '-'}
                    </Text>
            </View>} */}

                    {/* <View style={[styles.col, ]}>
                    <Text style={styles.boldTxt}>Company Admin</Text>
                    <Text style={styles.lightTxt}>
                    {user?.userLang?.firstName} {user?.userLang?.lastName} {'\n'}
                    {(user?.emailId)}
                    </Text>
            </View> */}


                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.boldTxt}>PAN Card</Text>
                        <Text selectable={true} style={styles.lightTxt}>
                            {formData?.branch?.branchLang?.panNo ? `${formData?.branch?.branchLang?.panNo}` : '-'}
                        </Text>
                    </View>
                </View>
                <View style={styles.separator}></View>

                {authData?.data?.businessUnit === 'Aluminium' ?
                    <>
                <View style={[styles.statusWrap, { flexDirection: 'row', marginTop: 3 }]}>
                    <Text selectable={true} style={[styles.boldTxt]} >Business Details</Text>
                </View> 
                <View style={styles.row}>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>TIN number</Text>
                        <Text style={styles.lightTxt}>
                            <Text selectable={true} style={styles.lightTxt}>
                                {formData?.companySuperAdmin?.[0]?.userLang?.tinNumber ? `${formData?.companySuperAdmin?.[0]?.userLang?.tinNumber}` : '-'}
                            </Text>
                        </Text>
                    </View>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>Annual Turnover</Text>
                        <Text selectable={true} selectionColor="#FF5733" style={[styles.boldTxt, { color: '#0063A7' }]}>
                            {formData?.companySuperAdmin?.[0]?.userLang?.annualTurnover ? `${formData?.companySuperAdmin?.[0]?.userLang?.annualTurnover}` : '-'}
                        </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.boldTxt}>Product Quantity</Text>
                        <Text selectable={true} style={styles.lightTxt}>
                            {formData?.companySuperAdmin?.[0]?.userLang?.productQuantity? `${formData?.companySuperAdmin?.[0]?.userLang?.productQuantity}` : '-'}
                        </Text>
                    </View>

                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>Customer group</Text>
                        <Text style={styles.lightTxt}>
                            {' '}
                            {formData?.companySuperAdmin?.[0]?.userLang?.customerGroupSAP ? `${formData?.companySuperAdmin?.[0]?.userLang?.customerGroupSAP}` : '-'}
                        </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.boldTxt}>Industry name</Text>
                        <Text selectable={true} style={styles.lightTxt}>
                            {formData?.companySuperAdmin?.[0]?.userLang?.industryIdSAP ? `${formData?.companySuperAdmin?.[0]?.userLang?.industryIdSAP}` : '-'}
                        </Text>
                    </View>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>Remarks</Text>
                        <Text style={styles.lightTxt}>
                            {' '}
                            {formData?.companySuperAdmin?.[0]?.userLang?.remarks ? `${formData?.groupName}` : '-'}
                        </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.boldTxt}>Billing Address</Text>
                        <Text selectable={true} style={styles.lightTxt}>
                        {formData.addresses?.[1]?.addressType === 'Billing Address' || formData.addresses?.[0]?.addressType === 'Billing Address'? `${formData?.addresses?.[0]?.addressLine1 + " " +
                                    formData?.addresses?.[0]?.addressLine2 + " " +
                                    formData?.addresses?.[0]?.city + " " +
                                    formData?.addresses?.[0]?.stateName + " " +
                                    formData?.addresses?.[0]?.country + " " +
                                    formData?.addresses?.[0]?.pincode }` : '-'}
                        </Text>
                    </View>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>Shipping Address</Text>
                        <Text style={styles.lightTxt}>
                            {' '}
                            {formData.addresses?.[0]?.addressType === 'Shipping Address' || formData.addresses?.[1]?.addressType === 'Shipping Address' ? `${formData?.addresses?.[0]?.addressLine1 + " " +
                                    formData?.addresses?.[0]?.addressLine2 + " " +
                                    formData?.addresses?.[0]?.city + " " +
                                    formData?.addresses?.[0]?.stateName + " " +
                                    formData?.addresses?.[0]?.country + " " +
                                    formData?.addresses?.[0]?.pincode }` : '-'}
                        </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.boldTxt}>Sales Organization</Text>
                        <Text selectable={true} style={styles.lightTxt}>
                            {formData?.branch?.branchLang?.salesOrg ? `${formData?.branch?.branchLang?.salesOrg}` : '-'}
                        </Text>
                    </View>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>Sales Office</Text>
                        <Text style={styles.lightTxt}>
                            {' '}
                            {formData?.companySuperAdmin?.[0]?.userLang?.salesOffice ? `${fformData?.companySuperAdmin?.[0]?.userLang?.salesOffice}` : '-'}
                        </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.boldTxt}>GL Account</Text>
                        <Text selectable={true} style={styles.lightTxt}>
                            {formData?.companySuperAdmin?.[0]?.userLang?.glAccount ? `${formData?.companySuperAdmin?.[0]?.userLang?.glAccount}` : '-'}
                        </Text>
                    </View>
                    {/* <View style={[styles.col,  ]}>
                                <Text style={styles.boldTxt}>Sales Office</Text>
                                <Text style={styles.lightTxt}>
                                    {' '}
                                    {formData?.groupName ? `${formData?.groupName}` : '-'}
                                </Text>
                            </View> */}
                        </View>
                        <View style={styles.separator}></View>
                </>: null}
                


                {/* ////////////////////////////////////Added Virtual Account Info for Zinc /////////////////////////////////////////////// */}


                {/* <View style={[styles.statusWrap, { flexDirection: 'row', marginTop: 3 }]}>
                    <Text selectable={true} style={[styles.boldTxt]} >Virtual Account Info</Text>

                </View>
                <View style={styles.row}>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>Title of Account</Text>
                        <Text style={styles.lightTxt}>
                            <Text selectable={true} style={styles.lightTxt}>
                                Hindustan Zinc Ltd
                            </Text>
                        </Text>
                    </View>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>IFSC code</Text>
                        <Text selectable={true} selectionColor="#FF5733" style={[styles.boldTxt, { color: '#0063A7' }]}>
                            HDFC0000240
                        </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.boldTxt}>Account Type</Text>
                        <Text selectable={true} style={styles.lightTxt}>
                            Virtual account
                        </Text>
                    </View>

                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>Account no</Text>
                        <Text style={styles.lightTxt}>
                            {' '}
                            bankVirtualId comes here from api
                        </Text>
                    </View>
                </View>
                <View style={styles.separator}></View> */}

                <View style={[styles.statusWrap, { flexDirection: 'row', marginTop: 3 }]}>
                    <Text selectable={true} style={[styles.boldTxt]} >Documents</Text>
                </View>

                {companyData?.company?.documents?.length == 0 &&
                    <View style={[{alignSelf:'center', marginTop:Dimension.margin15}]}>
                    <Text selectable={true} style={[styles.boldTxt, {color:'#979797'}]} >No Data Found</Text>
                </View>}
                <View style={styles.row}>
                    {companyData?.company?.documents?.length > 0 && companyData?.company?.documents?.[0]?.pan &&
                        <View style={[styles.col]} >
                            <Text style={styles.boldTxt}>PAN Card</Text>
                            <TouchableOpacity
                                onPress={() => handleDownloadUrl(companyData?.company?.documents?.[0]?.pan, 'PAN Card')}>
                                <Text style={[styles.lightTxt, { color: '#0064A8' }]}>
                                    PAN Card
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {/* {companyData?.company?.documents?.length > 0 &&
                        companyData?.company?.documents?.map((doc, index) => {
                            if (doc.pan) {
                                return (
                                    <View style={[styles.col]} key={index}>
                                        <Text style={styles.boldTxt}>PAN Card</Text>
                                        <TouchableOpacity
                                            onPress={() => handleDownloadUrl(doc.pan, 'PAN Card')}>
                                            <Text style={[styles.lightTxt, { color: '#0064A8' }]}>
                                                PAN Card
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }
                            return null;
                        })} */}
                    {companyData?.company?.documents?.length > 0 && companyData?.company?.documents?.[0]?.gst &&
                        <View style={[styles.col,]}>
                            <Text style={styles.boldTxt}>GST Certificate</Text>
                            <TouchableOpacity
                                onPress={() => handleDownloadUrl(companyData?.company.documents[0].gst, 'GST Certificate')}>
                                <Text style={[styles.lightTxt, { color: '#0064A8' }]}>
                                    GST Certificate
                                </Text>
                            </TouchableOpacity>
                        </View>}
                </View>
                <View style={styles.row}>
                    {companyData?.company?.documents?.length > 0 && companyData?.company?.documents?.[0]?.gst &&
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Cancelled Cheque</Text>
                            <TouchableOpacity
                                onPress={() => handleDownloadUrl(companyData?.company.documents[0].cancelledCheque, 'Cancelled Cheque')}>
                                <Text style={[styles.lightTxt, { color: '#0064A8' }]}>
                                    Cancelled Cheque
                                    {/* {companyData?.company.documents[0].pan ? `${companyData?.company.documents[0].pan}` : '-'} */}
                                </Text>
                            </TouchableOpacity>
                        </View>}

                    {companyData?.company?.documents?.length > 0 && companyData?.company?.documents?.[0]?.tan && isCopper &&
                        <View style={[styles.col,]}>
                            <Text style={styles.boldTxt}> TAN Certificate</Text>
                            <TouchableOpacity
                                onPress={() => handleDownloadUrl(companyData?.company.documents[0].tan, 'TAN Certificate')}>
                                <Text style={[styles.lightTxt, { color: '#0064A8' }]}>
                                    TAN Certificate
                                </Text>
                            </TouchableOpacity>
                        </View>}
                </View>
                <View style={styles.row}>
                    {companyData?.company?.documents?.length > 0 && companyData?.company?.documents?.[0]?.companyRegistrationDoc &&
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Company
                                registration certificate</Text>
                            <TouchableOpacity
                                onPress={() => handleDownloadUrl(companyData?.company.documents[0].companyRegistrationDoc, 'Company registration certificate')}>
                                <Text style={[styles.lightTxt, { color: '#0064A8' }]}>
                                    Company registration certificate
                                </Text>
                            </TouchableOpacity>
                        </View>}

                    {companyData?.company?.documents?.length > 0 && companyData?.company?.documents?.[0]?.creditProfileORFinancialStatement &&
                        <View style={[styles.col,]}>
                            <Text style={styles.boldTxt}> Credit profile(Balance Sheet 3Years)</Text>
                            <TouchableOpacity
                                onPress={() => handleDownloadUrl(companyData?.company.documents[0].creditProfileORFinancialStatement, 'Credit profile(Balance Sheet 3Years)')}>
                                <Text style={[styles.lightTxt, { color: '#0064A8' }]}>
                                    Credit profile(Balance Sheet 3Years)
                                </Text>
                            </TouchableOpacity>
                        </View>}
                </View>
                <View style={styles.row}>
                    {otherDocuments.length > 0 && (
                        <View style={styles.col}>
                            <Text style={styles.boldTxt}>Other Documents</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {otherDocuments.map((data, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleDownloadUrl(data.url, `Doc${index + 1}`)}
                                        style={{ marginRight: 10, marginTop: 8 }}>
                                        <Text style={[styles.lightTxt, { color: '#0064A8', textDecorationLine: 'underline' }]}>
                                            Doc{index + 1}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
</View>

                <View style={styles.separator}></View>


                <View style={[styles.statusWrap, { flexDirection: 'row', marginTop: 3 }]}>
                    <Text selectable={true} style={[styles.boldTxt]} >Bank Info</Text>

                </View>
                <View style={styles.row}>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>Account Number</Text>
                        <Text style={styles.lightTxt}>
                            <Text selectable={true} style={styles.lightTxt}>
                                {companyData?.company?.bankDetails?.[0]?.accountNO ? `${companyData?.company?.bankDetails?.[0]?.accountNO}` : '-'}
                            </Text>
                        </Text>
                    </View>
                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>Bank Name</Text>
                        <Text selectable={true} selectionColor="#FF5733" style={[styles.lightTxt]}>
                            {companyData?.company?.bankDetails?.[0]?.bankName ? `${companyData?.company?.bankDetails?.[0]?.bankName}` : '-'}
                        </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.boldTxt}>Branch</Text>
                        <Text selectable={true} style={styles.lightTxt}>
                            {companyData?.company?.bankDetails?.[0]?.branchAddress ? `${companyData?.company?.bankDetails?.[0]?.branchAddress}` : '-'}
                        </Text>
                    </View>

                    <View style={[styles.col,]}>
                        <Text style={styles.boldTxt}>IFSC Cheque</Text>
                        <Text style={styles.lightTxt}>
                            {' '}
                            {companyData?.company?.bankDetails?.[0]?.ifscCode ? `${companyData?.company?.bankDetails?.[0]?.ifscCode}` : '-'}
                        </Text>
                    </View>
                </View>
                <View style={styles.separator}></View>

                {/* {formData.approveAccess == true && formData?.verification_status != 'Approved' && !premiumStatuses.includes(formData?.verification_status) ?
                                <NextButton
                                button1={'Reject'}
                                button2={'Approve'}
                                fromEditProfile
                                // firstButton={handleReset}
                                // secondButton={handleApply}
                                // disableButton2={isCtaDisabled()}
                                button1Style={
                                    {
                                        borderWidth: 1,
                                        borderColor: '#363636',
                                        borderRadius: 4,
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 4,
                                        },
                                        shadowOpacity: 0.09,
                                        shadowRadius: 12,
                                        elevation: 5,
                                        
                                    }
                                }
                                button2Style={
                                    {
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 4,
                                        },
                                        shadowOpacity: 0.09,
                                        shadowRadius: 12,
                                        elevation: 5,
                                        
                                    }
                                }
                                enableButton
                                /> : null}
                            {premiumStatuses.includes(formData?.verification_status) && isSAG 
                            //  formData.approveAccess == true && formData?.verification_status != 'Approved' && !premiumStatuses.includes(formData?.verification_status)
                            ?
                                <NextButton
                                button1={'Reject'}
                                button2={'Approve'}
                                fromEditProfile
                                // firstButton={handleReset}
                                // secondButton={handleApply}
                                // disableButton2={isCtaDisabled()}
                                button1Style={
                                    {
                                        borderWidth: 1,
                                        borderColor: '#363636',
                                        borderRadius: 4,
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 4,
                                        },
                                        shadowOpacity: 0.09,
                                        shadowRadius: 12,
                                        elevation: 5,
                                        
                                    }
                                }
                                button2Style={
                                    {
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 4,
                                        },
                                        shadowOpacity: 0.09,
                                        shadowRadius: 12,
                                        elevation: 5,
                                        
                                    }
                                }
                                enableButton
                            />: null} */}
            </View>
        </ScrollView>
    )
}
export default CompanyInfo;