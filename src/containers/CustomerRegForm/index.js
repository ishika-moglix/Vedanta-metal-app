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
import Header from '../../component/Header';
import CONSTANTS from '../../services/constant';
import CustomeIcon from '../../component/CustomeIcon';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import CustomLoader from '../../component/customLoader';
import HeaderTab from '../../component/HeaderTabs';
import { handleDownload } from '../../utils/generatePdfFile';
import UsersScreen from './users';
import CompanyInfo from './companyInfo';
import Plants from './plants'
const CustomerRegForm = props => {
    const dispatch = useDispatch();
    const authData = useSelector(state => state.auth);
    const branchAccessData = useSelector(state => state.branchAccess?.data?.branchModules);
    const formData = useSelector(state => state?.customerRegistration?.getAllByCompany?.data)
    const companyData = useSelector(state => state?.customerRegistration?.companyGet?.data)
    const [isLoader, setIsLoader] = useState(false);
    const [activeTabs, setActiveTab] = useState('');
    const headerData = {
        CompanyInfo: {
            key: 'CompanyInfo',
            name: 'Company Info',
        },
        Users: {
            name: 'Users',
            key: 'Users',
        },
        Plants: {
            name: 'Plants',
            key: 'Plants',
        },

    };
    console.log("formData", formData);
    const handleDownloadUrl = (link, type) => {
        if (!link) return;
        const fixedLink = link.startsWith('http') ? link : `https://${link}`;
        
        console.log("Fixed link is", fixedLink);
        handleDownload(fixedLink, type); 
    };
    
    const renderTabContent = () => {
        // let dataToRender = [];
        console.log("active tabs are", activeTabs);
        switch (activeTabs) {
            
            case 'CompanyInfo':
                return (<CompanyInfo {...props} />);
                break;
            case 'Users':
                return (<UsersScreen {...props} id={props?.route?.params?.id}/>);
                break;
            case 'Plants':
                return(<Plants/>);
                break;
                default:
                    return null;
        }
       
    };

    const handleTabChange = selectedKey => {
        setActiveTab(selectedKey);
        console.log('Selected Tab:', selectedKey);
    };

    const renderHeaderTabs = () => {
        return (
            <>
                <View style={[styles.SearchWraps]}>
                    <HeaderTab headerData={headerData} onTabChange={handleTabChange} activeTabKey={0} />
                </View>
                {renderTabContent()}
            </>
        )
    }
    return (
        <View style={styles.containerWrap}>
            {isLoader && (
                <CustomLoader fullScreen />
            )}
            <Header
                navigation={{
                    ...props?.navigation,
                    goBack: () => props?.navigation.pop(),
                }}
                showBack
                showText={`Customer Id: ${props?.route?.params?.id}`}
                showLogout={
                    props?.route.params && props?.route.params.URL ? false : true
                }
                auth={authData}
                canGOBack={props?.route.name == 'WebView' ? false : true}
            />
            {renderHeaderTabs()}
            <View style={styles.separator}></View>
            <>

            </>

            {/* {isFIR ?
                      (isCTS || isCTSAdmin) && complaintByIdData?.stage == 0 &&
                    <NextButton
                        button1={'Reset'}
                        button2={'Submit'}
                        fromEditProfile
                        // firstButton={handleReset}
                         secondButton={() => checkFIRErrors()}
                        // disableButton2={isCtaDisabled()}
                        enableButton
                        containerStyle={
                            {
                                backgroundColor: '#fff',
                                paddingVertical: Dimension.padding10,
                            }
                        }
                    /> : isQCIR ?
                     (isCTS || isCTSAdmin || isCCHP_log_QA) && complaintByIdData?.stage == 1 &&
                    <NextButton
                        button1={'Reset'}
                        button2={'Submit'}
                        fromEditProfile
                        // firstButton={handleReset}
                        secondButton={() => checkQCIRErrors()}
                        // disableButton2={isCtaDisabled()}
                        enableButton
                        containerStyle={
                            {
                                backgroundColor: '#fff',
                                paddingVertical: Dimension.padding10,
                            }
                        }
                    /> :
                        isFCIR ?
                            (isCTS || isCTSAdmin || isCCHP_log_QA) && complaintByIdData?.stage == 2 &&
                        <NextButton
                        button1={'Reset'}
                        button2={'Submit'}
                        fromEditProfile
                        // firstButton={handleReset}
                        secondButton={() => checkFCIRErrors()}
                        // disableButton2={isCtaDisabled()}
                        enableButton
                        containerStyle={
                            {
                                backgroundColor: '#fff',
                                paddingVertical: Dimension.padding10,
                            }
                        }
                            />:
                            closureCheckUser() && complaintByIdData?.stage == 3 &&
                            <NextButton
                        button1={'Reset'}
                        button2={'Submit'}
                        fromEditProfile
                        // firstButton={handleReset}
                        secondButton={() => checkClosureErrors()}
                        // disableButton2={isCtaDisabled()}
                        enableButton
                        containerStyle={
                            {
                                backgroundColor: '#fff',
                                paddingVertical: Dimension.padding10,
                            }
                        }
                            />
                } */}
        </View>
    );

};

export default CustomerRegForm;
