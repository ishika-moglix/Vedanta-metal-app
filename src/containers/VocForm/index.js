import React, { useRef, useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView
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
import FloatingLabelInputField from '../../component/FloatingInput';
import { pick, keepLocalCopy } from '@react-native-documents/picker'
import Select from '../../component/Select';
// import { stat } from 'react-native-fs';
import { setBankDetails } from '../../redux/feature/BankDetailsSlice';
import { convertDate, convertDateToTimestamp, convertedDate, convertedDated, showMessage } from '../../utils/BiometricAuth';
import NextButton from '../../component/Button'
// import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import { all } from 'redux-saga/effects';
import axios from 'axios';
import CustomLoader from '../../component/customLoader';
import { alphaNumericRegex } from '../../constants';
import Toast from 'react-native-toast-message';
import style from './style';
import DatePickerInput from '../../component/DateTimePicker';
import { getFeedbackSubCategoryRequest } from '../../redux/feature/vocSlice';
import { STATE_STATUS } from '../../redux/constants';
const VocFormScreen = props => {
    const dispatch = useDispatch();
    const authData = useSelector(state => state.auth);
    const branchAccessData = useSelector(state => state.branchAccess?.data?.branchModules);
    const isSupplier = useSelector(state => state.branchAccess?.isCustomer);
    const isAluminium = authData?.data?.businessUnit === 'Aluminium' ? true : false;
    const complaintById = useSelector(state => state.vocList?.complaintById);
    const complaintByIdData = useSelector(state => state.vocList?.complaintById?.data)
    const getShipFrom = useSelector(state => state.vocList?.getShipment?.data);
    const approvedCustomerList = useSelector(state => state.mouList?.approvedCustomerList?.data)
    const cchpProductVariants = useSelector(state => state.vocList.CCHPProductVariants?.data?.result)
    const feedbackCat = useSelector(state => state.vocList?.feedbackCategory?.data);
    const feedbackSubCatStatus = useSelector(state => state.vocList?.feedbackSubCategory);
    const feedbackSubCat = useSelector(state => state.vocList?.feedbackSubCategory?.data);
    const RMdata = useSelector(state => state.vocList?.getUserByRoleRM?.data)
    const RMSezdata = useSelector(state => state.vocList?.getUserByRoleRMSEZ?.data)
    const PMdata = useSelector(state => state.vocList?.getUserByRolePM?.data)
    const PMSEZdata = useSelector(state => state.vocList?.getUserByRolePMSEZ?.data);
    const complaintMailData = useSelector(state => state.vocList?.getComplaintMail?.data)
    const { data, status, isCustomer } = useSelector(state => state.branchAccess);
    const [auth, setAuth] = useState({});
    const [isLoader, setIsLoader] = useState(false)
    const [remarks, setRemarks] = useState('');
    const [complaintMail, setComplaintMail] = useState('');
    const [productManager, setProductManager] = useState('');
    const [regionalManager, setRegionalManager] = useState('');
    const [invoiceNo, setInvoiceNo] = useState(complaintByIdData?.invoiceNo || '');
    const [details, setDetails] = useState(complaintByIdData?.details || '');
    const [batchNo, setBatchNo] = useState(complaintByIdData?.batchNo || '');
    const [salesOrg, setSalesOrg] = useState(complaintByIdData?.dispatchCompany || '');
    const [shipFrom, setShipFrom] = useState(complaintByIdData?.shipFrom || '');
    const [code, setCode] = useState(complaintByIdData?.code || '');
    const [prod, setProducts] = useState(complaintByIdData?.productName || '');
    const [complaintMedium, setComplaintMedium] = useState(complaintByIdData?.complaintMedium || '');
    const [qty, setQty] = useState(complaintByIdData?.quantity || '');
    const [type, setType] = useState(complaintByIdData?.complaintType || '');
    const [customerGroup, setCustomerGroup] = useState(complaintByIdData?.customerGroup || '');
    const [customerName, setCustomerName] = useState(complaintByIdData?.customerPlantName || '');
    const [category, setCategory] = useState(complaintByIdData?.feedbackCategory || '');
    const [subCat, setSubCategory] = useState(complaintByIdData?.feedbackSubcategory || '');
    const [uploadedFiles, setUploadedFiles] = useState(complaintByIdData?.filesPath || []);
    //filesPath
    const [ctsDocuments, setCtsDocuments] = useState(() => {
        const fir = complaintByIdData?.supplierDocuments?.FIR;
        const firstKey = fir ? Object.keys(fir)[0] : null;
        return firstKey ? fir[firstKey] : [];
    });
    const [investigated, setInvestigated] = useState(complaintByIdData?.investigatedBy || '');
    const [plantVisit, setPlantVisit] = useState(complaintByIdData?.plantVisit || '');
    const [castNo, setCastNo] = useState(complaintByIdData?.castNo || '');
    const [remarksByCust, setRemarksbyCust] = useState(complaintByIdData?.qcirRemark || '');
    const [premiliaryFindings, setPreliminaryFindings] = useState(complaintByIdData?.preliminaryFindings || '');
    const [copq, setCopq] = useState(complaintByIdData?.copq || '');
    const [plantOn, setPlantVisitDate] = useState(convertedDate(complaintByIdData?.plantVisitedOn) || '');
    const [materialRej, setMaterialRej] = useState(complaintByIdData?.materialRejected || '');
    const [fcirRemarks, setFcirRemarks] = useState(complaintByIdData?.fcirRemark || '');
    const [correctiveAction, setCorrectiveAction] = useState(complaintByIdData?.preventiveAction || '');
    const [attendedBy, setAttendedBy] = useState(complaintByIdData?.attendedBy || '');
    const [qtyCompl, setQtyCompl] = useState(complaintByIdData?.complaintQty || '');
    const [investigationReport, setInvestigationReport] = useState(complaintByIdData?.investigationReport || '');
    const [complaintSettle, setComplaintSettle] = useState(complaintByIdData?.complaintProposalSettelment || '');
    const [qcirDocuments, setQcirDocuments] = useState(() => {
        const qcir = complaintByIdData?.supplierDocuments?.QCIR;
        const firstKey = qcir ? Object.keys(qcir)[0] : null;
        return firstKey ? qcir[firstKey] : [];
    });
    const [closureDocuments, setClosureDocuments] = useState(() => {
        const closure = complaintByIdData?.supplierDocuments?.CLOSURE;
        const firstKey = closure ? Object.keys(closure)[0] : null;
        return firstKey ? closure[firstKey] : [];
    });
    const [fcirDocuments, setFcirDocuments] = useState(() => {
        const qcir = complaintByIdData?.supplierDocuments?.FCIR;
        const firstKey = qcir ? Object.keys(qcir)[0] : null;
        return firstKey ? qcir[firstKey] : [];
    });
    const [uploadedFilesCustomer, setUploadedFilesCustomer] = useState(() => {
        const fcir = complaintByIdData?.supplierDocuments?.["FCIR CUSTOMER"];
        const firstKey = fcir ? Object.keys(fcir)[0] : null;
        return firstKey ? fcir[firstKey] : [];
    });
    // const [uploadedFilesCustomer, setUploadedFilesCustomer] = useState(Object.keys(complaintByIdData?.supplierDocuments?.FCIR?.[0])|| []);
    const [marketingRemarks, setMarketingRemarks] = useState(complaintByIdData?.marketingRemarks || '');
    const [finalRemark, setCapaRemark] = useState(complaintByIdData?.finalRemark || '');
    const [qcirRejectComment, setQcirRejectComment] = useState('');
    const [fcirRejectComment, setFcirRejectComment] = useState('');
    const [firFilesChanged, setFirFilesChanged] = useState(false);
    const [qcirFilesChanged, setQcirFilesChanged] = useState(false);
    const [fcirFilesChanged, setFcirFilesChanged] = useState(false);
    const [fcirFilesCustomerChanged, setFcirFilesCustomerChanged] = useState(false);
    const [fcirDelFileCustomerDet, setFcirDelFileCustomerDet] = useState(false);
    const isCTS = branchAccessData?.roleNames.includes('Customer Technical Service') ? true : false;
    const isCTSAdmin = branchAccessData?.roleNames.includes('Customer Technical Service - Head') ? true : false;
    // const isCCHP_log_QA = branchAccessData?.roleNames().includes('CCHP LOG') || branchAccessData?.roleNames.includes('CCHP QA') || branchAccessData?.roleNames.includes('Admin') || branchAccessData?.roleNames.includes('Complaints') || branchAccessData?.roleNames.includes('Logistics') ? true : false;
    console.log("approvedcustomer list", uploadedFilesCustomer);

    const isCCHP_log_QA = branchAccessData?.roleNames.includes('CCHP LOG') ||
        branchAccessData?.roleNames.includes('CCHP QA') ||
        branchAccessData?.roleNames.includes('Admin') ||
        branchAccessData?.roleNames.includes('Complaints') ||
        branchAccessData?.roleNames.includes('Logistics')
    const isRMUser = branchAccessData?.roleNames.includes('Regional Manager') ? true : false;
    const isPMUser = branchAccessData?.roleNames.includes('Product Manager') ? true : false;
    const isQCIR = complaintByIdData?.supplierStatus?.includes('QCIR') ? true : false;
    const isFIR = complaintByIdData?.supplierStatus?.includes('FIR') ? true : false;
    const isFirPending = complaintByIdData?.supplierStatus?.includes('FIR Pending') ? true : false;
    const isFCIR = complaintByIdData?.supplierStatus?.includes('FCIR') ? true : false;
    const isClosed = complaintByIdData?.supplierStatus?.includes('Closed') ? true : false;
    const isClosure = complaintByIdData?.supplierStatus?.includes('Closure') ? true : false;
    useEffect(() => {
        if (complaintByIdData?.supplierComment) {
            const valuesArray = Object.values(complaintByIdData.supplierComment);
            const joinedRemarks = valuesArray.join('\n');
            setRemarks(joinedRemarks);
            console.log("Values array", valuesArray, joinedRemarks);

        }
    }, [complaintByIdData.supplierComment]);

    console.log("Category", category);

    // const regionalManagerOptions = authData?.data?.businessUnit === 'Aluminium'
    //     ? [...RMdata, ...RMSezdata]
    //     : RMdata;

    // const productManagerOptions = authData?.data?.businessUnit === 'Aluminium'
    //     ? [...PMdata, ...PMSEZdata]
    //     : PMdata;
    // console.log("regionalManagerOptions", RMSezdata);
    // console.log("Check Complaint by id data", complaintByIdData?.regionalManagerId);
    useEffect(() => {
        if (!complaintByIdData || (!RMdata && !RMSezdata)) return;
        const regionalManagerId = complaintByIdData?.regionalManagerId;
        const productManagerId = complaintByIdData?.productManagerId;
        const complaintMailId = complaintByIdData?.mailToId;
        const allRegionalManagers = [{ ...RMdata, ...RMSezdata }];
        const allProductManager = [{ ...PMdata, ...PMSEZdata }];
        const productManagerName = allProductManager[0][productManagerId];
        const managerName = allRegionalManagers[0][regionalManagerId];
        const complaintMailName = Object.values(complaintMailData).find(item => item.plantMailId === complaintMailId)?.name;
        console.log("complaintMaildata", complaintMailData, complaintMailId, "managerName", managerName);

        if (managerName) {
            setRegionalManager(managerName);

            // setProductManager(productManagerName);
            // setComplaintMail(complaintMailName);
        }
        if (productManagerName) {
            setProductManager(productManagerName);
        }
        if (complaintMailName) {
            setComplaintMail(complaintMailName);
        }

        console.log("mangaer name", complaintMailName);

    }, [complaintByIdData, PMdata, PMSEZdata, RMdata, RMSezdata]);

    const shipFromOptions = getShipFrom.length > 0 ? getShipFrom.map(item => ({
        value: item.depotName,
        label: item.depotName,
        id: item.depotId
    })) : [];


    // const openPicker = async (type) => {
    //     const response = await DocumentPicker.pick({
    //         presentationStyle: 'fullScreen',
    //     });
    //     const newFilesTotalSize = response.reduce((sum, file) => sum + file.size, 0);
    //     const existingFilesTotalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
    //     const combinedSize = newFilesTotalSize + existingFilesTotalSize;
    //     const MAX_TOTAL_SIZE = 8 * 1024 * 1024;
    //     if (combinedSize > MAX_TOTAL_SIZE) {
    //         // Alert.alert('Total file size should not exceed 8MB');
    //         Toast.show({
    //             type: 'error',
    //             text2: 'Total file size should not exceed 8MB',
    //             visibilityTime: 4000,
    //             autoHide: true,
    //         });
    //         return;
    //     }
    //     setDocs([
    //         ...uploadedFiles,
    //         ...response.map(_ => ({
    //             ..._,
    //             id: Date.now(),
    //         })),
    //     ]);
    // };

    const firCheckUser = () => {
        if (isCTS || isCTSAdmin || isRMUser || isPMUser || isCCHP_log_QA) {
            return true;
        }
        return false;
    }

    const qcirCheckUser = () => {
        if (isCTS || isCTSAdmin || isCCHP_log_QA || isRMUser || isPMUser) {
            return true;
        }
        return false;
    }

    const fcirCheckUser = () => {
        if (isCTS || isCTSAdmin || isCCHP_log_QA || isRMUser || isPMUser) {
            return true;
        }
        return false;
    }

    const closureCheckUser = () => {
        if (isCTS || isCTSAdmin) {
            return true;
        }
        if (complaintByIdData.length < 1) {
            return false;
        }
        if (isRMUser || isPMUser) {
            return true;
        }
        return false;
    }

    const disableFirFields = () => {
        if (isCTSAdmin || isRMUser || isPMUser) {
            return false;
        }
        if (complaintByIdData && complaintByIdData.stage >= 1) {
            return true;
        }
        return false;
    };

    const disableQcirFields = () => {
        if (isCTSAdmin || isRMUser || isPMUser) {
            return false;
        }
        if (isCCHP_log_QA && complaintByIdData && complaintByIdData.stage === 1) {
            return false;
        }
        if (complaintByIdData && complaintByIdData.stage >= 2) {
            return true;
        }
        return false;
    };

    const disableFcirFields = () => {
        if (isCTSAdmin) {
            return false;
        }
        if (isCCHP_log_QA && complaintByIdData && complaintByIdData.stage === 2) {
            return false;
        }
        if (complaintByIdData && complaintByIdData.stage >= 3) {
            return true;
        }
        return false;
    };

    const disableClosureFields = () => {
        if (isCTSAdmin) {
            return false;
        }
        if (complaintByIdData && complaintByIdData.stage >= 4) {
            return true;
        }
        return !closureCheckUser() || (complaintByIdData && complaintByIdData.stage === 4);
    };
    const enableUpload = () => {
        if ((isFirPending && isSupplier) || isCTSAdmin)
            return false;
        return true;
    }
    console.log(enableUpload());


    const disableFirFileUpload = () => {
        if (isCTSAdmin) {
            return false;
        }
        return (!firCheckUser() || (complaintByIdData && complaintByIdData.stage != 0));
    }

    const disableQcirFileUpload = () => {
        if (isCTSAdmin) {
            return false;
        }
        return !qcirCheckUser() || (complaintByIdData && complaintByIdData.stage != 1);
    }

    const disableFcirFileUpload = () => {
        if (isCTSAdmin) {
            return false;
        }
        return !fcirCheckUser() || (complaintByIdData && complaintByIdData.stage != 2);
    }

    const disableClosureFileUpload = () => {
        if (isCTSAdmin) {
            return false;
        }
        return !closureCheckUser() || (complaintByIdData && complaintByIdData.stage != 3);
    }

    const allowedExtensions = /\.(doc|docx|odt|pdf|tex|txt|xlsx|jpg|png|jpeg|csv)$/i;

const openPicker = async (type) => {
  try {
    const response = await pick({ allowMultiSelection: true });
    if (!response || response.length === 0) return;

    console.log("response of voc file", response);

    let currentDocs =
      type === 'sectionOne' ? uploadedFiles :
        type === 'sectionTwo' ? ctsDocuments :
          type === 'photographs' ? qcirDocuments :
            type === 'collected/photographs' ? fcirDocuments :
              type === 'uploadedFilesCustomer' ? uploadedFilesCustomer :
                type === 'closureDocuments' ? closureDocuments :
                  [];

    const filesWithLocalPath = await Promise.all(
      response.map(async (file) => ({
        ...file,
        localPath: await keepLocalCopy(file.uri),
      }))
    );
    for (let file of filesWithLocalPath) {
      const isDuplicate = currentDocs.some(doc => doc.name === file.name);
      if (isDuplicate) {
        showMessage('error', `File ${file.name} already exists.`);
        return;
      }
      if (file.name.includes('+')) {
        showMessage('error', `Remove '+' symbol from file name: ${file.name}`);
        return;
      }
      if (!allowedExtensions.exec(file.name)) {
        showMessage('error', `Invalid file type: ${file.name}`);
        return;
      }
      const fileSizeMB = (file.size || 0) / 1024 / 1024;
      console.log("fileSizeMB", fileSizeMB);
      if (fileSizeMB > 10) {
        showMessage('error', `File "${file.name}" exceeds 10MB limit.`);
        return;
      }
    }

    const newFilesTotalSize = filesWithLocalPath.reduce(
      (sum, file) => sum + (file.size || 0),
      0
    );
    const existingFilesTotalSize = currentDocs.reduce(
      (sum, file) => sum + (file.size || 0),
      0
    );
    const combinedSize = newFilesTotalSize + existingFilesTotalSize;

    const MAX_TOTAL_SIZE = 10 * 1024 * 1024; 
    if (combinedSize > MAX_TOTAL_SIZE) {
      showMessage('error', 'Total file size should not exceed 10MB');
      return;
    }

    const updatedDocs = [
      ...currentDocs,
      ...filesWithLocalPath.map((file) => ({
        ...file,
        id: Date.now() + Math.random(),
      })),
    ];

    if (type === 'sectionOne') {
      setUploadedFiles(updatedDocs);
    } else if (type === 'sectionTwo') {
      setCtsDocuments(updatedDocs);
    } else if (type === 'photographs') {
      setQcirDocuments(updatedDocs);
    } else if (type === 'collected/photographs') {
      setFcirDocuments(updatedDocs);
    } else if (type === 'uploadedFilesCustomer') {
      setUploadedFilesCustomer(updatedDocs);
    } else if (type === 'closureDocuments') {
      setClosureDocuments(updatedDocs);
    }
  } catch (err) {
    showMessage('error', 'File selection failed');
    console.error('Error while picking documents:', err);
  }
};

    // const openPicker = async (type) => {
    //     try {
    //         const isfirFilesChanged = true;
    //         const response = await DocumentPicker.pick({
    //             presentationStyle: 'fullScreen',
    //         });
    //         console.log("response of voc file", response);


    //         let currentDocs =
    //             type === 'sectionOne' ? uploadedFiles :
    //                 type === 'sectionTwo' ? ctsDocuments :
    //                     type === 'photographs' ? qcirDocuments :
    //                         type === 'collected/photographs' ? fcirDocuments :
    //                             type === 'uploadedFilesCustomer' ? uploadedFilesCustomer :
    //                                 type === 'closureDocuments' ? closureDocuments :
    //                                     [];
    //         for (let file of response) {
    //             const isDuplicate = currentDocs.some(doc => doc.name === file.name);
    //             if (isDuplicate) {
    //                 showMessage('error', `File ${file.name} already exists.`);
    //                 return;
    //             }
    //             if (file.name.includes('+')) {
    //                 showMessage('error', `Remove '+' symbol from file name: ${file.name}`);
    //                 return;
    //             }
    //             if (!allowedExtensions.exec(file.name)) {
    //                 showMessage('error', `Invalid file type: ${file.name}`);
    //                 return;
    //             }
    //             const fileSizeMB = file.size / 1024 / 1024;
    //             console.log("fileSizeMB", fileSizeMB);
    //             if (fileSizeMB > 10) {
    //                 showMessage('error', `File "${file.name}" exceeds 5MB limit.`);
    //                 return;
    //             }
    //         }
    //         const newFilesTotalSize = response.reduce((sum, file) => sum + file.size, 0);
    //         const existingFilesTotalSize = currentDocs.reduce((sum, file) => sum + file.size, 0);
    //         const combinedSize = newFilesTotalSize + existingFilesTotalSize;
    //         const MAX_TOTAL_SIZE = 10 * 1024 * 1024;
    //         if (combinedSize > MAX_TOTAL_SIZE) {
    //             showMessage('error', 'Total file size should not exceed 10MB');
    //             return;
    //         }
    //         const updatedDocs = [
    //             ...currentDocs,
    //             ...response.map(_ => ({
    //                 ..._,
    //                 id: Date.now() + Math.random(),
    //             })),
    //         ];
    //         if (type === 'sectionOne') {
    //             setUploadedFiles(updatedDocs);
    //         } else if (type === 'sectionTwo') {
    //             setCtsDocuments(updatedDocs);
    //         } else if (type === 'photographs') {
    //             setQcirDocuments(updatedDocs);
    //         } else if (type === 'collected/photographs') {
    //             setFcirDocuments(updatedDocs);
    //         } else if (type === 'uploadedFilesCustomer') {
    //             setUploadedFilesCustomer(updatedDocs);
    //         } else if (type === 'closureDocuments') {
    //             setClosureDocuments(updatedDocs);
    //         }

    //     } catch (err) {
    //         if (!DocumentPicker.isCancel(err)) {
    //             showMessage('error', 'File selection failed');
    //         }
    //     }
    // }
    const ProductChange = async (value) => {
        setProducts(value);
        setCategory('');
    }
    
    const onRemove = (type, id) => {
        switch (type) {
            case 'sectionOne':
                setUploadedFiles(prev => prev.filter(doc => doc.id !== id));
                break;
            case 'sectionTwo':
                setCtsDocuments(prev => prev.filter(doc => doc.id !== id));
                break;
            case 'photographs':
                setQcirDocuments(prev => prev.filter(doc => doc.id !== id));
                break;
            case 'collected/photographs':
                setFcirDocuments(prev => prev.filter(doc => doc.id !== id));
                break;
            case 'uploadedFilesCustomer':
                setUploadedFilesCustomer(prev => prev.filter(doc => doc.id !== id));
                break;
            case 'closureDocuments':
                setClosureDocuments(prev => prev.filter(doc => doc.id !== id));
                break;
            default:
                console.warn(`Unknown document type: ${type}`);
                break;
        }
    };
    // const onRemove = (type, id) => {
    //     if (type === 'sectionOne') {
    //         let tempDocs = [...uploadedFiles];
    //         tempDocs = tempDocs.filter(_ => _.id != id);
    //         setUploadedFiles([...tempDocs]);
    //     } else if (type === 'sectionTwo') {
    //         let tempaddDocs = [...ctsDocuments];
    //         tempaddDocs = tempaddDocs.filter(_ => _.id != id);
    //         setCtsDocuments([...tempaddDocs]);
    //     } else if (type === 'photographs') {
    //         let tempPhotoDocs = [...qcirDocuments];
    //         tempPhotoDocs = tempPhotoDocs.filter(_ => _.id != id);
    //         setQcirDoc([...tempPhotoDocs]);
    //     } else if (type === 'collected/photographs') {
    //         let tempPhotoDocs = [...qcirDocuments];
    //         tempPhotoDocs = tempPhotoDocs.filter(_ => _.id != id);
    //         setFcirDocuments([...tempPhotoDocs]);
    //     } else if (type === 'uploadedFilesCustomer') {
    //         let tempPhotoDocs = [...qcirDocuments];
    //         tempPhotoDocs = tempPhotoDocs.filter(_ => _.id != id);
    //         setUploadedFilesCustomer([...tempPhotoDocs]);
    //     }
    // };

    const checkCustomerDetailsErrors = (isAluminium) => {
        if (authData?.data?.businessUnit === 'Aluminium' && salesOrg === '') {
            showMessage('error', 'Please select Sales Org');
            return true;
        }
        if (prod === '') {
            showMessage('error', 'Please select Product');
            return true;
        }
        if (
            qty == null ||
            qty.toString().trim() === '' ||
            qty == 0
        ) {
            showMessage('error', 'Please enter valid Quantity');
            return true;
        }
        if (category === '') {
            showMessage('error', 'Please select category');
            return true;
        }
        if (subCat === '') {
            showMessage('error', 'Please select Sub-category');
            return true;
        }
        if (invoiceNo.trim() === '') {
            showMessage('error', 'Please enter Invoice');
            return true;
        }
        if (batchNo.trim() === '') {
            showMessage('error', 'Please enter Batch No.');
            return true;
        }
        if (details.trim() === '') {
            showMessage('error', 'Please enter Details');
            return true;
        }
        return false;
    };

    const isQcirErrors = () => {
        if (premiliaryFindings.trim() === '') {
            showMessage('error', 'Enter Preliminary findings');
            return true;
        }
        if (remarksByCust.trim() === '') {
            showMessage('error', 'Enter QCIR remarks');
            return true;
        }
        if (investigated.trim() === '') {
            showMessage('error', 'Enter Investigated by');
            return true;
        }
        if (plantVisit.trim() === '') {
            showMessage('error', 'Please Select Plant Visit');
            return true;
        }
        return false;
    };

    const enteredQcirValues = () => {
        return (
            castNo.trim() !== '' ||
            premiliaryFindings.trim() !== '' ||
            remarksByCust.trim() !== '' ||
            investigationReport.trim() !== '' ||
            plantVisit.trim() !== '' ||
            fcirDocuments.length > 0
        );
    };

    const handleCancel = () => {
        try {
            console.log("hit cancel");
            props?.navigation?.goBack()
        }
        catch (err) {
            console.log("error", err);
        }
    }
    const handleReset = () => {
        try {
            setRegionalManager('')
            setProductManager('')
            setComplaintMail('')
            setRemarks('')
            setInvoiceNo(complaintByIdData?.invoiceNo || '')
            setDetails(complaintByIdData?.details || '')
            setBatchNo(complaintByIdData?.batchNo || '')
            setSalesOrg(complaintByIdData?.dispatchCompany || '')
            setShipFrom(complaintByIdData?.shipFrom || '')
            setCode(complaintByIdData?.code || '')
            setProducts(complaintByIdData?.productName || '')
            setComplaintMedium(complaintByIdData?.complaintMedium || '')
            setQty(complaintByIdData?.quantity || '')
            setType(complaintByIdData?.complaintType || '')
            setCustomerGroup(complaintByIdData?.customerGroup || '')
            setCustomerName(complaintByIdData?.customerPlantName || '')
            setCategory(complaintByIdData?.feedbackCategory || '')
            setSubCategory(complaintByIdData?.feedbackSubcategory || '')
            setUploadedFiles([])
            setCtsDocuments([])
            setInvestigated(complaintByIdData?.investigatedBy || '')
            setPlantVisit(complaintByIdData?.plantVisit || '')
            setCastNo(complaintByIdData?.castNo || '')
            setRemarksbyCust(complaintByIdData?.remarksByCust || '')
            setPreliminaryFindings(complaintByIdData?.preliminaryFindings || '')
            setCopq(complaintByIdData?.copq || '');
            setPlantVisitDate(convertedDate(complaintByIdData?.plantVisitedOn) || '');
            setMaterialRej(complaintByIdData?.materialRejected || '');
            setFcirRemarks(complaintByIdData?.fcirRemark || '');
            setCorrectiveAction(complaintByIdData?.preventiveAction || '');
            setAttendedBy(complaintByIdData?.attendedBy || '');
            setQtyCompl(complaintByIdData?.complaintQty || '');
            setInvestigationReport(complaintByIdData?.investigationReport || '')
            setComplaintSettle(complaintByIdData?.complaintProposalSettelment || '');
            setQcirDocuments(() => {
                const qcir = complaintByIdData?.supplierDocuments?.QCIR;
                const firstKey = qcir ? Object.keys(qcir)[0] : null;
                return firstKey ? qcir[firstKey] : [];
            });
            setClosureDocuments([]);
            setFcirDocuments(() => {
                const qcir = complaintByIdData?.supplierDocuments?.FCIR;
                const firstKey = qcir ? Object.keys(qcir)[0] : null;
                return firstKey ? qcir[firstKey] : [];
            });
            setUploadedFilesCustomer(() => {
                const fcir = complaintByIdData?.supplierDocuments?.["FCIR CUSTOMER"];
                const firstKey = fcir ? Object.keys(fcir)[0] : null;
                return firstKey ? fcir[firstKey] : [];
            });
            setMarketingRemarks('');
            setCapaRemark('');
            setQcirRejectComment('');
            setFcirRejectComment('')
        } catch (err) {
            console.log("Error", err);

        }
    }
    const checkFIRErrors = () => {
        if (isCTSAdmin) {
            if (checkCustomerDetailsErrors(isAluminium)) return true;

            if (enteredFirValues()) {
                if (isFirErrors()) {
                    return true;
                }
            }
            updateFeedback();
            return;
        }
        if (isFirErrors()) {
            return true;
        }
        updateFeedback();
    }

    const enteredFirValues = () => {
        const shipFromId = shipFrom && shipFrom != null ? shipFrom : '';
        const selectedRegionalManager = (complaintByIdData?.regionalManagerId && complaintByIdData?.regionalManagerId != null) ? complaintByIdData?.regionalManagerId : ''
        const selectedProductlManager = (complaintByIdData?.productManagerId && complaintByIdData?.productManagerId != null) ? complaintByIdData?.productManagerId : ''
        const selectedComplaintMail = (complaintByIdData?.mailToId && complaintByIdData?.mailToId != null) ? complaintByIdData?.mailToId : ''
        const supplierComment = (remarks && remarks != null) ? remarks : ''
        console.log("selectedRegionalManager", selectedRegionalManager);

        if (shipFromId != '' || selectedRegionalManager != '' || selectedProductlManager != '' ||
            selectedComplaintMail != '' || supplierComment != '' || ctsDocuments.length > 0) {
            return true;
        }
        return false;
    }

    // const enteredFirValues = ()  => {
    //     if ( shipFrom!=''  ||  complaintByIdData?.regionalManagerId != '' ||  complaintByIdData?.productManagerId != '' ||
    //        complaintByIdData?.mailToId != '' ||  remarks.trim() != '' ||  ctsDocuments.length > 0) {
    //       return true;
    //     }
    //     return false;
    // }

    const isFirErrors = () => {
        if (!shipFrom) {
            showMessage('error', 'Please select Ship From');
            return true;
        }
        if (!isCustomer && (authData?.data?.businessUnit === 'Aluminium' && (isRMUser || isCTS || isCTSAdmin)) && !customerGroup) {
            showMessage('error', 'Please select Customer Group');
            return true;
        }
        if (isAluminium && !complaintMedium && !isCustomer && (isRMUser || isCTS || isCTSAdmin)) {
            showMessage('error', 'Please select Complaint Medium');
            return true;
        }
        if (!regionalManager) {
            showMessage('error', 'Please select Regional Manager');
            return true;
        }
        if (!productManager) {
            showMessage('error', 'Please select Product Manager');
            return true;
        }
        if (isAluminium && !complaintMail) {
            showMessage('error', 'Please select Complaint Mail');
            return true;
        }
        return false;
    }

    const checkQCIRErrors = () => {
        console.log("hit checkQCIRErrors");

        if (isCTSAdmin) {
            if (checkCustomerDetailsErrors(isAluminium)) return true;

            if (premiliaryFindings.trim() === '') {
                showMessage('error', 'Enter Preliminary findings');
                return true;
            }
            if (remarksByCust.trim() === '') {
                showMessage('error', 'Enter QCIR remarks');
                return true;
            }
            if (investigated.trim() === '') {
                showMessage('error', 'Enter Investigated by');
                return true;
            }
            if (plantVisit.trim() === '') {
                showMessage('error', 'Please Select Plant Visit');
                return true;
            }

            if (isFirErrors(isAluminium)) return true;

            if (enteredQcirValues()) {
                if (isQcirErrors()) return true;
            }

            updateFeedback();
            return false;
        }
        //CC2506160008
        if (isQcirErrors()) return true;

        updateFeedback();
        return false;
    };

    const checkFCIRErrors = () => {
        if (isCTSAdmin) {
            if (checkCustomerDetailsErrors(isAluminium)) {
                return true;
            }
            if (isFirErrors()) {
                return true;
            }
            if (isQcirErrors()) {
                return true;
            }
            if (isFcirErrors()) {
                return true;
            }
            updateFeedback();
            return;
        }

        if (isFcirErrors()) {
            return true;
        }
        updateFeedback();
    }

    const isFcirErrors = () => {
        if (investigationReport.trim().length === 0) {
            showMessage('error', 'Please Enter Valid Investigation Report.');
            return true;
        }
        if (complaintSettle.trim().length === 0) {
            showMessage('error', 'Please Enter Valid Proposal for Complaint Settlement.');
            return true;
        }
        if ((qtyCompl.toString()).trim().length === 0 || (parseInt(qtyCompl, 10) === 0)
            || (parseInt(qtyCompl, 10) < 1)) {
            showMessage('error', 'Please Enter Valid Qty Under Complaint (MT).');
            return true;
        }
        if (attendedBy.trim().length === 0) {
            showMessage('error', 'Please Enter Valid Attended By.');
            return true;
        }
        if (correctiveAction.trim().length === 0) {
            showMessage('error', 'Please Enter Valid Corrective & Preventive Action.');
            return true;
        }
        if (fcirRemarks.trim().length === 0) {
            showMessage('error', 'Please Enter Valid FCIR Remarks.');
            return true;
        }
        if (materialRej == '' || materialRej == null) {
            showMessage('error', 'Please Enter Valid Material Rejected.');
            return true;
        }

        if (copq.trim().length != 0 && !alphaNumericRegex.test(copq)) {
            showMessage('error', 'Please Enter Alpha-Numeric COPQ.');
            return true;
        }
        // if ( plantVisitedOn.trim().length === 0) {
        //     showMessage('error', 'Please Select Valid Plant Visited On.');
        //   return true;
        // }
        return false;
    }

    const checkClosureErrors = () => {
        if (isCTSAdmin) {
            if (checkCustomerDetailsErrors(isAluminium)) {
                return true;
            }
            if (isFirErrors()) {
                return true;
            }
            if (isQcirErrors()) {
                return true;
            }
            if (isFcirErrors()) {
                return true;
            }
            if (isClosureErrors()) {
                return true;
            }
            updateFeedback();
            return;
        }
        if (isClosureErrors()) {
            return true;
        }
        updateFeedback();
    }

    const isClosureErrors = () => {
        if (marketingRemarks.trim().length === 0) {
            showMessage('error', 'Please Enter Valid Marketing Remarks.');
            return true;
        }
        if (finalRemark.trim().length === 0) {
            showMessage('error', 'Please Enter Valid Capa Remarks.');
            return true;
        }
        return false;
    }

    // console.log("cchpProductVariants",matchingPM, complaintMail);

    const handleCategoryChange = async (value) => {
        try {
            setCategory(value);
            setSubCategory('')
            const index = feedbackCat?.find(name => name.category === value)?.id;
            console.log("index for category", index);
            // dispatch(
            //     getFeedbackSubCategoryRequest({
            //         businessUnit: authData?.data?.businessUnit,
            //         categoryId: index
            //     }),
            // );
            dispatch(
                getFeedbackSubCategoryRequest({
                    feedbackCategoryId: index,
                    businessUnit: authData?.data?.businessUnit,
                    ...(authData?.data?.businessUnit === "Aluminium" && { productVariant: prod })
                }),
            );
            if (feedbackSubCatStatus.status === STATE_STATUS.FETCHING) {
                setIsLoader(true);
            }
            setIsLoader(false);
        } catch (err) {
            setIsLoader(false);
            console.log("Error", err);
        }
    }
    const updateFeedback = async () => {
        const sessionData = await AsyncStorage.getItem('@get_session');
        const getPlantId = await AsyncStorage.getItem('@plantId');
        let jsonSessionData = JSON.parse(sessionData);
        let plantId = JSON.parse(getPlantId);
        setIsLoader(true);
        // if (isNewFilesGreaterThan1MB()) {
        //   Alert.alert('Error', 'Total Size of newly uploaded Files should be less than 10 MB');
        //   setIsLoading(false);
        //   return;
        // }
        const qcirRejectStatus = false;
        const fcirRejectStatus = false;
        const customer1 = approvedCustomerList;
        const combinedRM = [{ ...RMdata, ...RMSezdata }];
        const combinedPM = [{ ...PMdata, ...PMSEZdata }];
        const combinedRMObj = combinedRM[0];
        const combinedPMObj = combinedPM[0];
        const matchingRM = Object.keys(combinedRMObj).find(
            key => combinedRMObj[key] == regionalManager
        );
        const matchingPM = Object.keys(combinedPMObj).find(
            key => combinedPMObj[key] == productManager
        );

        const feedbackDto = {
            dispatchCompany: isAluminium ? salesOrg : null,

            dispatchCompanyId: isAluminium ? salesOrg === 'VALC' ? '9093' : '1' : authData?.data?.businessUnit,
            complaintType: type,
            shipFromId: shipFrom.trim() === '' ? null : getShipFrom?.find(id => id.depotId)?.depotId,
            productName: cchpProductVariants?.find(prods => prods.productName === prod)?._id,
            productId: cchpProductVariants?.find(prods => prods.productName === prod)?._id,
            quantity: qty,
            feedbackCategory: category,
            feedbackCategoryId: feedbackCat?.find(cat => cat?.category === category)?.id,
            feedbackSubcategory: subCat,
            feedbackSubcategoryId: feedbackSubCat?.find(cat => cat?.subcategory === subCat)?._id,
            invoiceNo: invoiceNo,
            batchNo: batchNo,
            details: details,
            customerCode: jsonSessionData?.companyId,
            customerName: authData?.data?.userName,
            customerGroup: customer1?.find(name => name.business_name === customerGroup)?.business_name,
            complaintMedium: complaintMedium
        };

        if (isSupplier || isCTSAdmin || isCTS || isPMUser) {
            feedbackDto['customerCode'] = approvedCustomerList?.find(id => id.business_name == customerGroup)?.business_id;
            feedbackDto['code'] = approvedCustomerList?.find(id => id.business_name == customerGroup)?.plantCode;
            feedbackDto['customerPlantName'] = approvedCustomerList?.find(id => id.business_name == customerGroup)?.business_name;
            if (isCTSAdmin) {
                feedbackDto['role'] = 'Customer Technical Service - Head';
            }
            if (isCTS) {
                feedbackDto['role'] = 'Customer Technical Service';
            }
            if (isPMUser) {
                feedbackDto['role'] = 'Product Manager';
            }
        }

        feedbackDto['regionalManagerId'] = regionalManager.length > 0 ? matchingRM || complaintByIdData?.regionalManagerId : null;
        feedbackDto['productManagerId'] = (productManager.toString().trim() == '') ? null : matchingPM || complaintByIdData?.productManagerId;
        feedbackDto['supplierComment'] = (remarks.toString().trim() == '') ? null : remarks;
        feedbackDto['mailToId'] = (complaintMail.toString().trim() == '') ? null : (complaintMailData).find(item => item.name == complaintMail)?.plantMailId || complaintByIdData?.mailToId;

        feedbackDto['role'] = '';
        if (isCTSAdmin) {
            feedbackDto['role'] = 'CTS ADMIN';
        }
        if (isCCHP_log_QA) {
            feedbackDto['role'] = 'CCHP_LOG_QA';
        }
        if (isCTS) {
            feedbackDto['role'] = 'Customer Technical Service';
        }

        feedbackDto['id'] = complaintByIdData?.id;

        if (complaintByIdData?.stage >= 1) {
            feedbackDto['castNo'] = (castNo.trim() == '') ? null : castNo.trim();
            feedbackDto['preliminaryFindings'] = (premiliaryFindings.trim() == '') ? null : premiliaryFindings.trim();
            feedbackDto['qcirRemark'] = (remarksByCust.trim() == '') ? null : remarksByCust.trim();
            feedbackDto['investigatedBy'] = (investigated.trim() == '') ? null : investigated.trim();
            feedbackDto['plantVisit'] = (plantVisit.trim() == '') ? null : plantVisit.trim();
        }

        if (complaintByIdData.stage >= 2) {
            feedbackDto['investigationReport'] = (investigationReport.trim() == '') ? null : investigationReport.trim();
            feedbackDto['preventiveAction'] = (correctiveAction.trim() == '') ? null : correctiveAction.trim();
            feedbackDto['complaintProposalSettelment'] = (complaintSettle.trim() == '')
                ? null : complaintSettle.trim();
            feedbackDto['fcirRemark'] = (fcirRemarks.trim() == '') ? null : fcirRemarks.trim();
            feedbackDto['complaintQty'] = (qtyCompl.toString().trim() == '') ? null : qtyCompl;
            feedbackDto['materialRejected'] = (materialRej.trim() == '') ? null : materialRej.trim();
            feedbackDto['attendedBy'] = (attendedBy.trim() == '') ? null : attendedBy.trim();
            feedbackDto['plantVisitedOn'] = (plantOn.toString().trim() == '') ? null : (new Date(plantOn)).getTime();
            feedbackDto['copq'] = (copq.trim() == '') ? null : copq.trim();
        }
        if (complaintByIdData.stage >= 3) {
            feedbackDto['marketingRemarks'] = (marketingRemarks.trim() == '') ? null : marketingRemarks.trim();
            feedbackDto['finalRemark'] = (finalRemark.trim() == '') ? null : finalRemark.trim();
        }
        //...............................qcirRejectStatus used for Reject QCIR
        if (complaintByIdData.stage === 1 && qcirRejectStatus === true) {
            qcirRejectStatus = false;
            feedbackDto['qcirReject'] = 'rejected';
            if (qcirRejectComment.trim().length === 0) {
                showMessage('error', 'Enter Rejection reason for QCIR');
                setLoader(false);
                return;
            }
            feedbackDto['qcirRejectComment'] = qcirRejectComment;
        }

        if (complaintByIdData.stage === 2 && fcirRejectStatus === true) {
            fcirRejectStatus = false;
            feedbackDto['reject'] = 'rejected';

            if (fcirRejectComment.trim().length === 0) {
                showMessage('error', 'Enter Rejection reason for FCIR');
                return;
            }
            //   if ( fcirStage.trim().length === 0) {
            //      showMessage('error', 'Select Rejection Stage');
            //     return;
            //   }

            feedbackDto['rejectComment'] = fcirRejectComment.trim();
            //   feedbackDto['rejectedStage'] =  fcirStage.trim();
        }

        //  if (  complaintByIdData.stage === 3 &&  closureRejectStatus === true) {
        //    closureRejectStatus = false;
        //   feedbackDto['reject'] = 'rejected';

        //   if ( closureRejectComment.trim().length === 0) {
        //      showMessage('error', 'Enter Rejection reason for FCIR');
        //     return;
        //   }
        //   if ( closureStage.trim().length === 0) {
        //      showMessage('error', 'Select Rejection Stage');
        //     return;
        //   }

        //   feedbackDto['rejectComment'] =  closureRejectComment.trim();
        //   feedbackDto['rejectedStage'] =  closureStage.trim();
        // }
        //........................................DELETE FILE BY SUPPLIER.....................................
        // if ( isCTSAdmin) {
        //   if ( firFilesChanged) {
        //      ctsDocuments.forEach((element) => {
        //       if (element.downloadLink) {
        //          firDelFileDet.push(element.downloadLink);
        //       }
        //     });

        //     if ( firDelFileDet.length > 0) { feedbackDto['firDelFileDet'] = _.uniq( firDelFileDet); }
        //     // if ( firDelFileDet.length === 0) { feedbackDto['firRemovedFile'] = true; }
        //     if ( deleted_fir &&  ctsDocuments.length == 0) { feedbackDto['firRemovedFile'] = true; }
        //   }

        //   if ( qcirFilesChanged) {
        //      qcirDocuments.forEach((element) => {
        //       if (element.downloadLink) {
        //          qcirDelFileDet.push(element.downloadLink);
        //       }
        //     });

        //     if ( qcirDelFileDet.length > 0) { feedbackDto['qcirDelFileDet'] = _.uniq( qcirDelFileDet); }
        //     // if ( qcirDelFileDet.length === 0) { feedbackDto['qcirRemovedFile'] = true; }
        //     if ( deleted_qcir &&  qcirDocuments.length == 0) { feedbackDto['qcirRemovedFile'] = true; }
        //   }

        //   if ( fcirFilesChanged) {
        //      fcirDocuments.forEach((element) => {
        //       if (element.downloadLink) {
        //          fcirDelFileDet.push(element.downloadLink);
        //       }
        //     });

        //     if ( fcirDelFileDet.length > 0) { feedbackDto['fcirDelFileDet'] = _.uniq( fcirDelFileDet); }
        //     // if ( fcirDelFileDet.length === 0) { feedbackDto['fcirRemovedFile'] = true; }
        //     if ( deleted_fcir &&  fcirDocuments.length == 0) { feedbackDto['fcirRemovedFile'] = true; }
        //   }

        //   if ( fcirFilesCustomerChanged) {
        //      uploadedFilesCustomer.forEach((element) => {
        //       if (element.downloadLink) {
        //          fcirDelFileCustomerDet.push(element.downloadLink);
        //       }
        //     });

        //     if ( fcirDelFileCustomerDet.length > 0) { feedbackDto['fcirCustomerDelFileDet'] = _.uniq( fcirDelFileCustomerDet); }
        //     // if ( fcirDelFileDet.length === 0) { feedbackDto['fcirRemovedFile'] = true; }
        //     if ( deleted_fcir_customer &&  uploadedFilesCustomer.length == 0) { feedbackDto['fcirCustomerRemovedFile'] = true; }
        //   }
        // }

        feedbackDto['businessUnit'] = authData?.data?.businessUnit;
        console.log("feedbackDto formdata", feedbackDto, new Blob([JSON.stringify(feedbackDto)]))
        await uploadFeedback(feedbackDto);
    };
    const uploadFeedback = async (feedbackDto) => {
        try {
            const sessionData = await AsyncStorage.getItem('@get_session');
            const getPlantId = await AsyncStorage.getItem('@plantId');
            const jsonSessionData = JSON.parse(sessionData);
            const plantId = JSON.parse(getPlantId);

            const filesArray = [];

            if (isCTSAdmin) {
                if (firFilesChanged && complaintByIdData.stage >= 1) {
                    if (ctsDocuments.length > 0) {
                        ctsDocuments.forEach(file => {
                            const path = Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;
                            filesArray.push({
                                name: 'firFiles',
                                filename: file.name,
                                type: file.type,
                                data: RNFetchBlob.wrap(path),
                            });
                        });
                    }
                }

                if (qcirFilesChanged && complaintByIdData.stage >= 2) {
                    if (qcirDocuments.length > 0) {
                        qcirDocuments.forEach(file => {
                            const path = Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;
                            filesArray.push({
                                name: 'qcirFile',
                                filename: file.name,
                                type: file.type,
                                data: RNFetchBlob.wrap(path),
                            });
                        });
                    }
                }

                if (fcirFilesChanged && complaintByIdData.stage >= 3) {
                    if (fcirDocuments.length > 0) {
                        fcirDocuments.forEach(file => {
                            const path = Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;
                            filesArray.push({
                                name: 'fcirFiles',
                                filename: file.name,
                                type: file.type,
                                data: RNFetchBlob.wrap(path),
                            });
                        });
                    }
                }

                if (fcirFilesCustomerChanged && complaintByIdData.stage >= 3) {
                    if (uploadedFilesCustomer.length > 0) {
                        uploadedFilesCustomer.forEach(file => {
                            const path = Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;
                            filesArray.push({
                                name: 'fcirFilesCustomer',
                                filename: file.name,
                                type: file.type,
                                data: RNFetchBlob.wrap(path),
                            });
                        });
                    }
                }
            }

            if (complaintByIdData.stage === 0) {
                ctsDocuments.forEach(file => {
                    const path = Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;
                    filesArray.push({
                        name: 'files',
                        filename: file.name,
                        type: file.type,
                        data: RNFetchBlob.wrap(path),
                    });
                });
            }

            if (complaintByIdData.stage === 1) {
                qcirDocuments.forEach(file => {
                    const path = Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;
                    filesArray.push({
                        name: 'files',
                        filename: file.name,
                        type: file.type,
                        data: RNFetchBlob.wrap(path),
                    });
                });
            }

            if (complaintByIdData.stage === 2) {
                fcirDocuments.forEach(file => {
                    const path = Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;
                    filesArray.push({
                        name: 'fcirFiles',
                        filename: file.name,
                        type: file.type,
                        data: RNFetchBlob.wrap(path),
                    });
                });
                uploadedFilesCustomer.forEach(file => {
                    const path = Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;
                    filesArray.push({
                        name: 'fcirFilesCustomer',
                        filename: file.name,
                        type: file.type,
                        data: RNFetchBlob.wrap(path),
                    });
                });
            }

            if (complaintByIdData.stage === 3) {
                closureDocuments.forEach(file => {
                    const path = Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri;
                    filesArray.push({
                        name: 'files',
                        filename: file.name,
                        type: file.type,
                        data: RNFetchBlob.wrap(path),
                    });
                });
            }

            filesArray.unshift({
                name: 'feedbackDto',
                data: JSON.stringify(feedbackDto),
                type: 'application/json',
            });
            console.log("filesArray payload", filesArray);

            const resp = await RNFetchBlob.fetch(
                'POST',
                // 'https://vedanta-intuat.moglilabs.com/feedback/updatefeedback',
                `${CONSTANTS.API_BASE_URL}${CONSTANTS.API_URL.UPDATE_FEEDBACK}`,
                {
                    'Content-Type': 'multipart/form-data',
                    idbranch: plantId?.plantId,
                    idcompany: jsonSessionData?.companyId,
                    iduser: jsonSessionData?.moglixB2BUserId,
                    token: jsonSessionData?.moglixB2BToken,
                    application: '1',
                },
                filesArray
            );
            setIsLoader(true);
            console.log("response of api", resp);
            let res;
            res = await resp.json();
            console.log("res is", res);

            if (res.success && res.code == 200) {
                setIsLoader(false);
                Toast.show({
                    type: 'success',
                    text2: res?.message || "Data saved successfully",
                    visibilityTime: 1000,
                    onHide: () => {
                        props?.navigation.replace('Complaint');
                    },
                });
            } else {
                console.log("hit voc errors");
                let errorString = '';
                
                for (let index in res.errors) {
                    errorString = errorString.concat(res.errors[index]).concat(". ");
                }
                if (!errorString) {
                    errorString = res?.['message'].concat(" " + res?.['data']);
                }
                showMessage('error', errorString);
                errorString = '';
            }
        } catch (error) {
            setIsLoader(false);
            console.log('Upload Feedback Error:', error);
            showMessage('error', 'Something went wrong while uploading feedback.');
        } finally {
            setIsLoader(false);
        }
    };
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
                showText={props?.route?.params?.id}
                showLogout={
                    props?.route.params && props?.route.params.URL ? false : true
                }
                auth={auth}
                canGOBack={props?.route.name == 'WebView' ? false : true}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'margin'}
                style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <ScrollView>
                    <View style={styles.CardWrapper}>
                        <Text style={[styles.boldTxt, {
                            fontWeight: 'bold'
                        }]}>Complaint Details</Text>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text style={styles.boldTxt}>Created On :</Text>
                                <Text style={[styles.boldTxt, { color: '#0063A7' }]}>
                                    {convertedDated(complaintById?.data.createdOn)}
                                </Text>
                            </View>
                            <View style={[styles.col, { marginLeft: Dimension.margin10 }]}>
                                <Text style={styles.boldTxt}>Status :</Text>
                                <Text style={[styles.lightTxt, { color: complaintById?.data?.supplierStatus === 'Closed' ? 'green' : '#E47000' }]}>
                                    {complaintById?.data?.status}{' - '}{complaintById?.data?.supplierStatus}
                                    {/* {convertedDate(complaintById?.data?._source?.creationDate)} */}
                                </Text>
                            </View>
                        </View>
                        <Text
                            style={styles.text}>
                            Customer Name
                        </Text>
                        <View style={styles.inputView}>
                            <FloatingLabelInputField
                                placeholder={'Enter Customer Name'}
                                onChangeText={val => setCustomerName(val)}
                                value={customerName}
                                editable={false}
                                textStyle={{
                                    color: '#727272',
                                    backgroundColor: '#F0F0F0',
                                    borderColor: '#363636'
                                }}
                            />
                        </View>
                        <Text
                            style={styles.text}>
                            Customer Code
                        </Text>
                        <View style={styles.inputView}>
                            <FloatingLabelInputField
                                placeholder={'Enter Customer Code'}
                                // disabledLabel
                                onChangeText={val => setCode(val)}
                                value={code}
                                editable={false}
                                textStyle={{
                                    color: '#727272',
                                    backgroundColor: '#F0F0F0',
                                    borderColor: '#363636'
                                }}
                            />
                        </View>
                        <Text
                            style={[styles.text,]}>
                            Type
                        </Text>
                        <Select
                            selectedValue={type}
                            placeHolder="Select Type"
                            onChange={val => setType(val)}
                            fromDD={false}
                            options={[
                                { value: 'Complaint', label: 'Complaint' },
                                { value: 'Feedback', label: 'Feedback' },
                                {
                                    ...(authData?.data?.businessUnit === 'Aluminium' ?
                                        [{ value: 'Product Development', label: 'Product Development' }] :
                                        [])
                                }
                            ]}
                            containerStyle={{
                                borderColor: '#363636',
                                backgroundColor: (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0',
                                marginTop: 0, marginBottom: 0,
                                color: '#727272'
                            }}
                            disabled={
                                (isCTS || isCTSAdmin) ? false : true
                            }
                        />
                        {isAluminium &&
                            <>
                                <Text
                                    style={styles.text}>
                                    Sales Org*
                                </Text>
                                <Select
                                    selectedValue={salesOrg}
                                    placeHolder="Select Sales Org"
                                    onChange={val => setSalesOrg(val)}
                                    fromDD={false}
                                    options={[
                                        { value: 'BALC', label: 'BALC' },
                                        { value: 'VALC', label: 'VALC' }
                                    ]}

                                    containerStyle={{
                                        borderColor: '#363636',
                                        backgroundColor: (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0',
                                        marginTop: 0, marginBottom: 0,
                                        color: '#727272'
                                    }}
                                    disabled={
                                        (isCTS || isCTSAdmin) ? false : true
                                    }
                                />
                            </>
                        }
                        <Text
                            style={styles.text}>
                            Ship From
                        </Text>
                        <Select
                            selectedValue={shipFrom}
                            placeHolder="Select Ship From"
                            onChange={val => setShipFrom(val)}
                            fromDD={false}
                            options={[...shipFromOptions]}

                            containerStyle={{
                                borderColor: '#363636',
                                backgroundColor: (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0',
                                marginTop: 0, marginBottom: 0,
                                color: '#727272'
                            }}
                            disabled={
                                (isCTS || isCTSAdmin) ? false : true
                            }
                        />
                        {!isCustomer && (authData?.data?.businessUnit === 'Aluminium' && (isRMUser || isCTS || isCTSAdmin)) &&
                            <>
                                <Text
                                    style={styles.text}>
                                    Customer Group*
                                </Text>
                                <Select
                                    selectedValue={customerGroup}
                                    placeHolder="Select Customer Group"
                                    onChange={val => setCustomerGroup(val)}
                                    fromDD={false}
                                    options={[
                                        ...(approvedCustomerList ? Object.values(approvedCustomerList).map(customer => ({
                                            value: customer.business_name,
                                            label: customer.business_name,
                                        })) : [])
                                    ]}

                                    containerStyle={{
                                        borderColor: '#363636',
                                        backgroundColor: (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0',
                                        marginTop: 0, marginBottom: 0,
                                        color: '#727272'
                                    }}
                                    disabled={
                                        (isCTS || isCTSAdmin) ? false : true
                                    }
                                />
                            </>
                        }
                        <Text
                            style={styles.text}>
                            Product*
                        </Text>
                        <Select
                            selectedValue={prod}
                            placeHolder="Select Product"
                            onChange={(itemValue) => {
                                // const index = feedbackCat?.findIndex(opt => opt.value === itemValue) + 1;
                                ProductChange(itemValue);
                              }
                           }
                            // onChange={val => setProducts(val)}
                            fromDD={false}
                            options={[
                                ...(cchpProductVariants ? Object.values(cchpProductVariants).map(customer => ({
                                    value: customer.productName,
                                    label: customer.productName,
                                })).sort((a, b) =>
                                    a.label.toLocaleLowerCase().localeCompare(b.label.toLocaleLowerCase())
                                ) : []),
                            ]}

                            containerStyle={{
                                borderColor: '#363636',
                                backgroundColor: (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0',
                                marginTop: 0, marginBottom: 0,
                                color: '#727272'
                            }}
                            disabled={
                                (isCTS || isCTSAdmin) ? false : true
                            }
                        />
                        {!isCustomer && (authData?.data?.businessUnit === 'Aluminium' && (isRMUser || isCTS || isCTSAdmin)) &&
                            <>
                                <Text
                                    style={styles.text}>
                                    Complaint Medium *
                                </Text>
                                <Select
                                    selectedValue={complaintMedium}
                                    placeHolder="Select Complaint Medium"
                                    onChange={val => setComplaintMedium(val)}
                                    fromDD={false}
                                    options={[
                                        { value: 'WhatsApp', label: 'WhatsApp' },
                                        { value: 'Email', label: 'Email' },
                                        { value: 'Phone Call', label: 'Phone Call' },
                                        { value: 'Meeting', label: 'Meeting' }
                                    ]}
                                    containerStyle={{
                                        borderColor: '#363636',
                                        backgroundColor: (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0',
                                        marginTop: 0, marginBottom: 0,
                                        color: '#727272'
                                    }}
                                    disabled={
                                        (isCTS || isCTSAdmin) ? false : true
                                    }
                                />
                            </>
                        }
                        <Text
                            style={styles.text}>
                            Quantity (MT)*
                        </Text>
                        <View style={styles.inputView}>
                            <FloatingLabelInputField
                                placeholder={'Enter Quantity (MT)'}
                                // disabledLabel
                                keyboardType="number-pad"
                                onChangeText={val => {
                                    const numericVal = val.replace(/[^0-9]/g, '');
                                    setQty(numericVal);
                                }}
                                value={qty?.toString()}
                                editable={(isCTS || isCTSAdmin) ? true : false}
                                textStyle={{
                                    color: '#727272',
                                    backgroundColor: (isCTS || isCTSAdmin) ? '#FFF' : '#F0F0F0',
                                    borderColor: '#363636'
                                }}
                            />
                        </View>
                        <Text
                            style={styles.text}>
                            Category *
                        </Text>
                        <Select
                            selectedValue={category}
                            placeHolder="Select Category"
                            onChange={(itemValue) => {
                                handleCategoryChange(itemValue);
                            }}
                            fromDD={false}
                             
                            options={[
                                ...(feedbackCat ? Object.values(feedbackCat).map(category => ({
                                    value: category.category,
                                    label: category.category,
                                })) : []),
                            ]}

                            containerStyle={{
                                borderColor: '#363636',
                                backgroundColor: (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0',
                                marginTop: 0, marginBottom: 0,
                                color: '#727272'
                            }}
                            disabled={
                              (isCTS || isCTSAdmin)  ? false : true
                            }
                        />
                        {category != '' &&
                            <>
                                <Text
                                    style={styles.text}>
                                    Sub-Category *
                                </Text>
                                <Select
                                    selectedValue={subCat}
                                    placeHolder="Select Sub-Category"
                                    onChange={val => setSubCategory(val)}
                                    fromDD={false}
                                    options={[
                                        ...(feedbackSubCat ? Object.values(feedbackSubCat).map(category => ({
                                            value: category.subcategory,
                                            label: category.subcategory,
                                        })) : []),
                                    ]}
                                    // containerStyle={{
                                    //     borderColor: '#363636',
                                    // }}
                                    containerStyle={{
                                        borderColor: '#363636',
                                        backgroundColor: (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0',
                                        marginTop: 0, marginBottom: 0,
                                        color: '#727272'
                                    }}
                                    disabled={
                                        (isCTS || isCTSAdmin) ? false : true
                                    }
                                />
                            </>}
                        <Text style={styles.text}>Documents Uploaded</Text>
                        <TouchableOpacity
                            onPress={() => openPicker('sectionOne')}
                            disabled={enableUpload()}
                            style={[styles.txtInputCss, { justifyContent: 'center', backgroundColor: enableUpload() ? '#F0F0F0' : '#FFF' }]}>
                            <Text style={{
                                color: '#727272',
                                fontFamily: Dimension.CustomMediumFont,
                                fontSize: Dimension.font12, color: '#000'
                            }}>{uploadedFiles.length} Documents Uploaded</Text>
                        </TouchableOpacity>
                        {uploadedFiles.map((doc, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    // width: Dimension.width130,
                                    borderColor: Colors.darkBlue,
                                    borderWidth: 1,
                                    padding: Dimension.padding5,
                                    borderRadius: 4,
                                    marginTop: 2,
                                    marginBottom: Dimension.margin10,
                                }}>
                                <Text
                                    numberOfLines={1}
                                    style={{ fontSize: Dimension.font13, fontFamily: Dimension.CustomBoldFont, color: Colors.darkBlue, width: '80%' }}>
                                    {doc.name || doc.split(".com/")[1]}
                                </Text>
                                {!enableUpload() ? <Icon
                                    onPress={() => onRemove('sectionOne', doc.id)}
                                    name="close"
                                    color={Colors.darkBlue}
                                    size={15}
                                /> : null}
                            </View>
                        ))}
                        <Text
                            style={styles.text}>
                            Invoice No*
                        </Text>
                        <View style={styles.inputView}>
                            <FloatingLabelInputField
                                placeholder={'Enter Invoice No.'}
                                onChangeText={val => setInvoiceNo(val)}
                                value={invoiceNo}
                                textStyle={{
                                    borderColor: '#363636',
                                    backgroundColor: (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0'
                                }}
                                editable={
                                    (isCTS || isCTSAdmin) ? true : false
                                }
                            />
                        </View>
                        <Text
                            style={styles.text}>
                            Batch No.*
                        </Text>
                        <View style={styles.inputView}>
                            <FloatingLabelInputField
                                placeholder={'Enter Batch No.'}
                                disabledLabel
                                onChangeText={val => setBatchNo(val)}
                                value={batchNo}
                                textStyle={{
                                    borderColor: '#363636',
                                    backgroundColor: (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0'
                                }}
                                editable={
                                    (isCTS || isCTSAdmin) ? true : false
                                }
                            />
                        </View>
                        <Text
                            style={styles.text}>
                            Details*
                        </Text>
                        <TextInput
                            // editable={autoFetchData ? false : true}
                            placeholder={'Enter Details'}
                            value={details}
                            onChangeText={input => setDetails(input)}
                            multiline={true}
                            minLength={1}
                            maxLength={1000}
                            numberOfLines={4}
                            style={[styles.TxtInputDetail, {
                                textAlignVertical: 'top',
                                borderColor: '#363636',
                                backgroundColor: (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0'
                            }]}

                            editable={
                                (isCTS || isCTSAdmin) ? true : false
                            }
                        />
                        <View style={styles.separator}></View>
                        <Text style={[styles.boldTxt, {
                            fontSize: Dimension.font14,
                            fontWeight: '800',
                            marginTop: Dimension.margin15
                        }]}>FIR Details</Text>
                        <Text
                            style={styles.text}>
                            Regional Manager*
                        </Text>
                        <Select
                            selectedValue={regionalManager}
                            // label={' Regional Manager '}
                            placeHolder="Select Regional Manager"
                            onChange={val => setRegionalManager(val)}
                            // fromDD={false}
                            options={[
                                ...(RMdata
                                    ? [
                                        ...Object.values(RMdata).map(category => ({
                                            value: category,
                                            label: category,
                                        })),
                                        authData?.data?.businessUnit != 'Aluminium' && {
                                            ...Object.values(RMSezdata).map(category => ({
                                                value: category,
                                                label: category,
                                            }))
                                        }
                                    ]
                                    : [])
                            ]}
                            containerStyle={{
                                borderColor: '#363636',
                                backgroundColor: disableFirFields() ? '#F0F0F0' : '#FFF',
                                marginTop: 0, marginBottom: 0,
                                color: '#727272'
                            }}
                            disabled={
                                disableFirFields() ? true : false
                            }
                        />
                        <Text
                            style={styles.text}>
                            Product Manager*
                        </Text>
                        <Select
                            selectedValue={productManager}
                            // label={' Regional Manager '}
                            placeHolder="Select Product Manager"
                            onChange={val => setProductManager(val)}
                            // fromDD={false}
                            options={[
                                ...(PMdata ? [
                                    ...Object.entries(PMdata).map(([id, category]) => ({
                                        value: category,
                                        label: category,
                                        id: id
                                    })),
                                    authData?.data?.businessUnit != 'Aluminium' && {
                                        ...Object.entries(PMSEZdata).map(([id, category]) => ({
                                            value: category,
                                            label: category,
                                            id: id
                                        }))
                                    }]
                                    : []),
                            ]}
                            containerStyle={{
                                borderColor: '#363636',
                                backgroundColor: disableFirFields() ? '#F0F0F0' : '#FFF',
                                marginTop: 0, marginBottom: 0,
                                color: '#727272'
                            }}
                            disabled={
                                disableFirFields() ? true : false
                            }
                        />
                        {isAluminium &&
                            <>
                                <Text
                                    style={styles.text}>
                                    Complaint Mail (Plant Wise)
                                </Text>
                                <Select
                                    selectedValue={complaintMail}
                                    // label={' Regional Manager '}
                                    placeHolder="Select Complaint Mail"
                                    onChange={val => setComplaintMail(val)}
                                    // fromDD={false}
                                    options={[
                                        ...(complaintMailData ? Object.values(complaintMailData).map(complain => ({
                                            value: complain.name,
                                            label: complain.name,
                                        })) : []),
                                    ]}
                                    containerStyle={{
                                        borderColor: '#363636',
                                        backgroundColor: disableFirFields() ? '#F0F0F0' : '#FFF',
                                        marginTop: 0, marginBottom: 0,
                                        color: '#727272'
                                    }}
                                    disabled={disableFirFields() ? true : false

                                    }
                                />
                            </>}
                        <Text style={styles.text}>Add Documents</Text>
                        <TouchableOpacity
                            onPress={() => openPicker('sectionTwo')}
                            disabled={disableFirFileUpload()}
                            style={[styles.txtInputCss,
                            {
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexDirection: 'row',
                                backgroundColor: disableFirFileUpload() ? '#F0F0F0' : '#fff'
                            }]}>
                            <Text style={{
                                color: '#727272',
                                fontFamily: Dimension.CustomMediumFont,
                                fontSize: Dimension.font12, color: '#000'
                            }}>{ctsDocuments.length} Documents Uploaded</Text>
                            <MaterialCommunityIcon
                                name="file-upload-outline"
                                size={20}
                                color="#0063A7"
                            />
                        </TouchableOpacity>
                        {ctsDocuments.map((doc, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    // width: Dimension.width130,
                                    borderColor: Colors.darkBlue,
                                    borderWidth: 1,
                                    padding: Dimension.padding5,
                                    borderRadius: 4,
                                    marginTop: 2,
                                    marginBottom: Dimension.margin10,
                                }}>
                                <Text
                                    numberOfLines={1}
                                    style={{ fontSize: Dimension.font13, fontFamily: Dimension.CustomBoldFont, color: Colors.darkBlue, width: '80%' }}>
                                    {doc.name || doc.split(".com/")[1]}
                                </Text>
                                {!disableFirFileUpload() ? <Icon
                                    onPress={() => onRemove('sectionTwo', doc.id)}
                                    name="close"
                                    color={Colors.darkBlue}
                                    size={16}
                                /> : null}
                            </View>
                        ))}
                        <Text
                            style={styles.text}>
                            Other Remark
                        </Text>
                        <TextInput
                            // editable={autoFetchData ? false : true}
                            placeholder={'Enter Remarks...'}
                            value={remarks}
                            onChangeText={input => setRemarks(input)}
                            multilinse={true}
                            numberOfLines={4}
                            minLength={1}
                            maxLength={100}
                            style={[styles.TxtInputDetail, {
                                textAlignVertical: 'top',
                                borderColor: '#363636',
                                backgroundColor: disableFirFields() ? '#F0F0F0' : '#FFF'
                            }]}

                            editable={!disableFirFields() ? true : false
                            }
                        />

                        {isQCIR || isFCIR || isClosed || isClosure ?
                            <>
                                {<View style={styles.separator}></View>}
                                <Text style={[styles.boldTxt, {
                                    fontSize: Dimension.font14,
                                    fontWeight: '800',
                                    marginTop: Dimension.margin15
                                }]}>QCIR Details</Text>
                                <Text
                                    style={styles.text}>
                                    Cast Number
                                </Text>
                                <FloatingLabelInputField
                                    placeholder={'Enter Cast Number'}
                                    disabledLabel
                                    onChangeText={val => setCastNo(val)}
                                    value={castNo}
                                    textStyle={{
                                        borderColor: '#363636',
                                        backgroundColor: disableQcirFields() ? '#F0F0F0' : '#fff'
                                    }}
                                    editable={
                                        disableQcirFields() ? false : true
                                    }
                                />
                                <Text
                                    style={styles.text}>
                                    Preliminary Findings*
                                </Text>
                                <TextInput
                                    // editable={autoFetchData ? false : true}
                                    placeholder={'Enter Preliminary Findings'}
                                    value={premiliaryFindings}
                                    onChangeText={input => setPreliminaryFindings(input)}
                                    multiline={true}
                                    numberOfLines={4}
                                    style={[styles.TxtInputDetail, {
                                        textAlignVertical: 'top',
                                        borderColor: '#363636',
                                        backgroundColor: disableQcirFields() ? '#F0F0F0' : '#fff'
                                    }]}

                                    editable={
                                        disableQcirFields() ? false : true
                                    }
                                />
                                <Text
                                    style={styles.text}>
                                    Remarks Viewed by Customer*
                                </Text>
                                <TextInput
                                    // editable={autoFetchData ? false : true}
                                    placeholder={'Enter Remarks Viewed by Customer'}
                                    value={remarksByCust}
                                    onChangeText={input => setRemarksbyCust(input)}
                                    multiline={true}
                                    numberOfLines={4}
                                    style={[styles.TxtInputDetail, {
                                        textAlignVertical: 'top',
                                        borderColor: '#363636',
                                        backgroundColor: disableQcirFields() ? '#F0F0F0' : '#fff'
                                    }]}

                                    editable={
                                        disableQcirFields() ? false : true
                                    }
                                />
                                <Text
                                    style={styles.text}>
                                    Investigated By*
                                </Text>
                                <FloatingLabelInputField
                                    placeholder={'Enter Investigated By'}
                                    disabledLabel
                                    onChangeText={val => setInvestigated(val)}
                                    value={investigated}
                                    textStyle={{
                                        borderColor: '#363636',
                                        backgroundColor: disableQcirFields() ? '#F0F0F0' : '#fff'
                                    }}
                                    editable={
                                        disableQcirFields() ? false : true
                                    }
                                />
                                <Text
                                    style={styles.text}>
                                    Plant Visit*
                                </Text>
                                <Select
                                    selectedValue={plantVisit}
                                    placeHolder="Select Plant Visit"
                                    onChange={val => setPlantVisit(val)}
                                    // fromDD={false}
                                    options={[
                                        { label: 'Yes', value: 'Yes' },
                                        { label: 'No', value: 'No' }
                                    ]}
                                    containerStyle={{
                                        borderColor: '#363636',
                                        backgroundColor: disableQcirFields() ? '#F0F0F0' : '#fff',
                                        marginTop: 0, marginBottom: 0,
                                        color: '#727272'
                                    }}
                                    disabled={
                                        disableQcirFields() ? true : false
                                    }
                                />
                                <Text style={styles.text}>Sample collected photograph</Text>
                                <TouchableOpacity
                                    onPress={() => openPicker('photographs')}
                                    disabled={disableQcirFileUpload()}
                                    style={[styles.txtInputCss, { justifyContent: 'center', backgroundColor: disableQcirFileUpload() ? '#F0F0F0' : '#FFF' }]}>
                                    <Text style={{
                                        color: '#727272',
                                        fontFamily: Dimension.CustomMediumFont,
                                        fontSize: Dimension.font12, color: '#000'
                                    }}>{qcirDocuments.length} Files Uploaded</Text>
                                </TouchableOpacity>
                                {qcirDocuments.map((doc, index) => (
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            // width: Dimension.width130,
                                            borderColor: Colors.darkBlue,
                                            borderWidth: 1,
                                            padding: Dimension.padding5,
                                            borderRadius: 4,
                                            marginTop: 2,
                                            marginBottom: Dimension.margin10,
                                        }}>
                                        <Text
                                            numberOfLines={1}
                                            style={{ fontSize: Dimension.font13, fontFamily: Dimension.CustomBoldFont, color: Colors.darkBlue, width: '80%' }}>
                                            {doc.name || doc.split(".com/")[1]}
                                        </Text>
                                        {!disableQcirFileUpload() ? <Icon
                                            onPress={() => onRemove('photographs', doc.id)}
                                            name="close"
                                            color={Colors.darkBlue}
                                            size={15}
                                        /> : null}
                                    </View>
                                ))}
                            </> :
                            null
                        }
                        {isFCIR || isClosed || isClosure ?
                            <>
                                {isFCIR || isClosed || isClosure ? <View style={styles.separator}></View> : null}
                                <Text style={[styles.boldTxt, {
                                    fontSize: Dimension.font14,
                                    fontWeight: '800',
                                    marginTop: Dimension.margin15
                                }]}>FCIR Details</Text>
                                <Text
                                    style={styles.text}>
                                    Investigation Report*
                                </Text>
                                <TextInput
                                    // editable={autoFetchData ? false : true}
                                    placeholder={'Enter Investigation Report'}
                                    value={investigationReport}
                                    onChangeText={input => setInvestigationReport(input)}
                                    multiline={true}
                                    numberOfLines={4}
                                    style={[styles.TxtInputDetail, {
                                        textAlignVertical: 'top',
                                        borderColor: '#363636',
                                        backgroundColor: disableFcirFields() ? '#F0F0F0' : '#fff'
                                        // (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0'
                                    }]}

                                    editable={
                                        disableFcirFields() ? false : true
                                        // (isCTS || isCTSAdmin) ? true : false
                                    }
                                />
                                <Text
                                    style={styles.text}>
                                    Proposal for Complaint Settlement*
                                </Text>
                                <TextInput
                                    // editable={autoFetchData ? false : true}
                                    placeholder={'Enter Proposal for Complaint Settlement'}
                                    value={complaintSettle}
                                    onChangeText={input => setComplaintSettle(input)}
                                    multiline={true}
                                    numberOfLines={4}
                                    style={[styles.TxtInputDetail, {
                                        textAlignVertical: 'top',
                                        borderColor: '#363636',
                                        backgroundColor: disableFcirFields() ? '#F0F0F0' : '#fff'
                                        // (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0'
                                    }]}

                                    editable={
                                        disableFcirFields() ? false : true
                                        // (isCTS || isCTSAdmin) ? true : false
                                    }
                                />
                                <Text
                                    style={styles.text}>
                                    Qty Under Complaint (MT)*

                                </Text>
                                <FloatingLabelInputField
                                    placeholder={'Enter Qty Under Complaint (MT)'}
                                    disabledLabel
                                    onChangeText={val => {
                                        const numericVal = val.replace(/[^0-9]/g, '');
                                        setQtyCompl(numericVal);
                                    }}
                                    value={qtyCompl.toString()}
                                    keyboardType="number-pad"
                                    textStyle={{
                                        borderColor: '#363636',
                                        backgroundColor: disableFcirFields() ? '#F0F0F0' : '#fff'
                                        // (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0'
                                    }}
                                    editable={
                                        disableFcirFields() ? false : true
                                        // (isCTS || isCTSAdmin) ? true : false
                                    }
                                />

                                <Text
                                    style={styles.text}>
                                    Attended By*
                                </Text>
                                <FloatingLabelInputField
                                    placeholder={'Enter Attended By'}
                                    disabledLabel
                                    onChangeText={val => setAttendedBy(val)}
                                    value={attendedBy}
                                    textStyle={{
                                        borderColor: '#363636',
                                        backgroundColor: disableFcirFields() ? '#F0F0F0' : '#fff'
                                        // (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0'
                                    }}
                                    editable={
                                        disableFcirFields() ? false : true
                                        // (isCTS || isCTSAdmin) ? true : false
                                    }
                                />
                                <Text
                                    style={styles.text}>

                                    Corrective & Preventive Action*
                                </Text>
                                <TextInput
                                    // editable={autoFetchData ? false : true}
                                    placeholder={'Enter Corrective & Preventive Action'}
                                    value={correctiveAction}
                                    onChangeText={input => setCorrectiveAction(input)}
                                    multiline={true}
                                    numberOfLines={4}
                                    style={[styles.TxtInputDetail, {
                                        textAlignVertical: 'top',
                                        borderColor: '#363636',
                                        backgroundColor: disableFcirFields() ? '#F0F0F0' : '#fff'
                                        // (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0'
                                    }]}

                                    editable={
                                        disableFcirFields() ? false : true
                                        // (isCTS || isCTSAdmin) ? true : false
                                    }
                                />
                                <Text
                                    style={styles.text}>

                                    Remarks(s) [Viewed by Customer]*
                                </Text>
                                <TextInput
                                    // editable={autoFetchData ? false : true}
                                    placeholder={'Enter Remarks(s) [Viewed by Customer]'}
                                    value={fcirRemarks}
                                    onChangeText={input => setFcirRemarks(input)}
                                    multiline={true}
                                    numberOfLines={4}
                                    style={[styles.TxtInputDetail, {
                                        textAlignVertical: 'top',
                                        borderColor: '#363636',
                                        backgroundColor: disableFcirFields() ? '#F0F0F0' : '#fff'
                                        // (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0'
                                    }]}

                                    editable={
                                        disableFcirFields() ? false : true
                                        // (isCTS || isCTSAdmin) ? true : false
                                    }
                                />
                                {/* <Select
                                selectedValue={plantVisit}
                                placeHolder="Select 
Corrective & Preventive Action*"
                                onChange={val => setPlantVisit(val)}
                                // fromDD={false}
                                options={[
                                    ...(complaintMailData ? Object.values(complaintMailData).map(complain => ({
                                        value: complain.name,
                                        label: complain.name,
                                    })) : []),
                                ]}
                                containerStyle={{
                                    borderColor: '#363636',
                                    backgroundColor: (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0',
                                     marginTop: 0, marginBottom:0,
                                     color:'#727272'
                                }}
                                disabled={
                                    (isCTS || isCTSAdmin) ? false : true
                                }
                            /> ..............already commented */}
                                <Text
                                    style={styles.text}>
                                    Material Rejected*
                                </Text>
                                <Select
                                    selectedValue={materialRej}
                                    placeHolder="Select Corrective & Preventive Action*"
                                    onChange={val => setMaterialRej(val)}
                                    fromDD={false}
                                    options={[
                                        { label: 'Yes', value: 'Yes' },
                                        { label: 'No', value: 'No' }
                                    ]}
                                    containerStyle={{
                                        borderColor: '#363636',
                                        backgroundColor: disableFcirFields() ? '#F0F0F0' : '#fff',
                                        marginTop: 0, marginBottom: 0,
                                        color: '#727272'
                                        // (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0'
                                    }}
                                    disabled={
                                        disableFcirFields() ? true : false
                                        // (isCTS || isCTSAdmin) ? false : true
                                    }
                                />
                                <Text
                                    style={[styles.text, { marginBottom: 0 }]}>
                                    Plant Visited On
                                </Text>
                                <DatePickerInput
                                    placeholder={'DD/MM/YYYY'}
                                    formData={plantOn}
                                    handleInputChange={date => setPlantVisitDate(date)}
                                    disabled={disableFcirFields()}
                                    textStyle={{
                                        backgroundColor: disableFcirFields() ? '#F0F0F0' : '#fff',
                                        height: Dimension.height40,
                                        borderColor: '#000',
                                        paddingVertical: 0
                                    }}
                                    labelStyle={{
                                        paddingHorizontal: 0,
                                        paddingTop: Dimension.padding0
                                    }}
                                />
                                <Text style={styles.text}>Sample Collected/Photograph</Text>
                                <TouchableOpacity
                                    onPress={() => openPicker('collected/photographs')}
                                    disabled={disableFcirFileUpload()}
                                    style={[styles.txtInputCss, { justifyContent: 'center', backgroundColor: disableFcirFileUpload() ? '#F0F0F0' : '#fff' }]}>
                                    <Text style={{
                                        color: '#727272',
                                        fontFamily: Dimension.CustomMediumFont,
                                        fontSize: Dimension.font12, color: '#000'
                                    }}>{fcirDocuments.length} Files Uploaded</Text>
                                </TouchableOpacity>
                                {fcirDocuments.map((doc, index) => (
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            // width: Dimension.width130,
                                            borderColor: Colors.darkBlue,
                                            borderWidth: 1,
                                            padding: Dimension.padding5,
                                            borderRadius: 4,
                                            marginTop: 2,
                                            marginBottom: Dimension.margin10,
                                        }}>
                                        <Text
                                            numberOfLines={1}
                                            style={{ fontSize: Dimension.font13, fontFamily: Dimension.CustomBoldFont, color: Colors.darkBlue, width: '80%' }}>

                                            {doc.name || doc.split(".com/")[1]}
                                        </Text>
                                        {!disableQcirFileUpload() ? <Icon
                                            onPress={() => onRemove('collected/photographs', doc.id)}
                                            name="close"
                                            color={Colors.darkBlue}
                                            size={16}
                                        /> : null}
                                    </View>
                                ))}
                                <Text style={styles.text}>Documents Uploaded [Viewed by Customer]</Text>
                                <TouchableOpacity
                                    onPress={() => openPicker('uploadedFilesCustomer')}
                                    disabled={disableFcirFileUpload()}
                                    style={[styles.txtInputCss, { justifyContent: 'center', backgroundColor: disableFcirFileUpload() ? '#F0F0F0' : '#fff' }]}>
                                    <Text style={{
                                        color: '#727272',
                                        fontFamily: Dimension.CustomMediumFont,
                                        fontSize: Dimension.font12, color: '#000'
                                    }}>{uploadedFilesCustomer.length} Files Uploaded</Text>
                                </TouchableOpacity>
                                {uploadedFilesCustomer.map((doc, index) => (
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            // width: Dimension.width130,
                                            borderColor: Colors.darkBlue,
                                            borderWidth: 1,
                                            padding: Dimension.padding5,
                                            borderRadius: 4,
                                            marginTop: 2,
                                            marginBottom: Dimension.margin10,
                                        }}>
                                        <Text
                                            numberOfLines={1}
                                            style={{ fontSize: Dimension.font13, fontFamily: Dimension.CustomBoldFont, color: Colors.darkBlue, width: '80%' }}>
                                            {doc.name || doc.split(".com/")[1]}
                                        </Text>
                                        {!disableFcirFileUpload() ?
                                            <Icon
                                                onPress={() => onRemove('uploadedFilesCustomer', doc.id)}
                                                name="close"
                                                color={Colors.darkBlue}
                                                size={16}
                                            /> : null}
                                    </View>
                                ))}
                                <Text
                                    style={[styles.text]}>
                                    COPQ
                                </Text>
                                <FloatingLabelInputField
                                    placeholder={'Enter COPQ'}
                                    disabledLabel
                                    onChangeText={val => setCopq(val)}
                                    value={copq}
                                    textStyle={{
                                        borderColor: '#363636',
                                        backgroundColor: disableFcirFields() ? '#F0F0F0' : '#fff',

                                        // (isCTS || isCTSAdmin) ? '#fff' : '#F0F0F0'
                                    }}
                                    editable={
                                        disableFcirFields() ? false : true
                                        // (isCTS || isCTSAdmin) ? true : false
                                    }
                                />
                            </> :
                            null
                        }
                        {closureCheckUser() && complaintByIdData.stage && complaintByIdData.stage >= 3 ?
                            <>
                                {closureCheckUser() && complaintByIdData.stage && complaintByIdData.stage >= 3 ? <View style={styles.separator}></View> : null}
                                <Text style={[styles.boldTxt, {
                                    fontSize: Dimension.font14,
                                    fontWeight: '800',
                                    marginTop: Dimension.margin15
                                }]}>Closure Details</Text>

                                <Text style={styles.text}>Marketing Remarks*</Text>
                                <FloatingLabelInputField
                                    placeholder={'Enter Investigation Report'}
                                    disabledLabel
                                    onChangeText={val => setMarketingRemarks(val)}
                                    value={marketingRemarks}
                                    textStyle={{
                                        borderColor: '#363636',
                                        backgroundColor: disableClosureFields() ? '#F0F0F0' : '#fff'
                                    }}
                                    editable={
                                        disableClosureFields() ? false : true
                                    }
                                />
                                <Text style={styles.text}>Capa Remarks [Viewed By Customer]*</Text>
                                <FloatingLabelInputField
                                    placeholder={'Enter Proposal for Complaint Settlement'}
                                    disabledLabel
                                    onChangeText={val => setCapaRemark(val)}
                                    value={finalRemark}
                                    textStyle={{
                                        borderColor: '#363636',
                                        backgroundColor: disableClosureFields() ? '#F0F0F0' : '#fff'
                                    }}
                                    editable={
                                        disableClosureFields() ? false : true
                                    }
                                />
                                <Text style={styles.text}>Sample collected/photograph</Text>
                                <TouchableOpacity
                                    onPress={() => openPicker('closureDocuments')}
                                    disabled={disableClosureFileUpload()}
                                    style={[styles.txtInputCss, { justifyContent: 'center', backgroundColor: disableClosureFields() ? '#F0F0F0' : '#FFF' }]}>
                                    <Text style={{
                                        color: '#727272',
                                        fontFamily: Dimension.CustomMediumFont,
                                        fontSize: Dimension.font12, color: '#000'
                                    }}>{closureDocuments.length} Files Uploaded</Text>
                                </TouchableOpacity>
                                {closureDocuments.map((doc, index) => (
                                    <View
                                        key={index}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            // width: Dimension.width130,
                                            borderColor: Colors.darkBlue,
                                            borderWidth: 1,
                                            padding: Dimension.padding5,
                                            borderRadius: 4,
                                            marginTop: 2,
                                            marginBottom: Dimension.margin10,
                                        }}>
                                        <Text
                                            numberOfLines={1}
                                            style={{ fontSize: Dimension.font13, fontFamily: Dimension.CustomBoldFont, color: Colors.darkBlue, width: '80%' }}>
                                            {doc.name || doc.split(".com/")[1]}
                                        </Text>

                                        <Icon
                                            onPress={() => onRemove('closureDocuments', doc.id)}
                                            name="close"
                                            color={Colors.darkBlue}
                                            size={16}
                                        />
                                    </View>
                                ))}
                            </> :
                            null
                        }
                    </View>

                    <View style={[styles.separator, { marginTop: 0, }]}></View>
                    <>
                        {isFIR && (isCTS || isCTSAdmin) && complaintByIdData?.stage == 0 && (

                            <NextButton
                                button1={'Cancel'}
                                button2={'Submit'}
                                fromEditProfile
                                firstButton={() => handleCancel()}
                                secondButton={() => checkFIRErrors()}
                                enableButton
                                containerStyle={{
                                    backgroundColor: '#fff',
                                    paddingVertical: Dimension.padding10,
                                }}
                            />
                        )}

                        {isQCIR && (isCTS || isCTSAdmin || isCCHP_log_QA) && complaintByIdData?.stage == 1 && (
                            <NextButton
                                button1={'Cancel'}
                                button2={'Submit'}
                                fromEditProfile
                                firstButton={() => handleCancel()}
                                secondButton={() => checkQCIRErrors()}
                                enableButton
                                containerStyle={{
                                    backgroundColor: '#fff',
                                    paddingVertical: Dimension.padding10,
                                }}
                            />
                        )}

                        {isFCIR && (isCTS || isCTSAdmin || isCCHP_log_QA) && complaintByIdData?.stage == 2 && (
                            <NextButton
                                button1={'Cancel'}
                                button2={'Submit'}
                                fromEditProfile
                                firstButton={() => handleCancel()}
                                secondButton={() => checkFCIRErrors()}
                                enableButton
                                containerStyle={{
                                    backgroundColor: '#fff',
                                    paddingVertical: Dimension.padding10,
                                }}
                            />
                        )}

                        {closureCheckUser() && complaintByIdData?.stage == 3 && (
                            <NextButton
                                button1={'Cancel'}
                                button2={'Submit'}
                                fromEditProfile
                                firstButton={() => handleCancel()}
                                secondButton={() => checkClosureErrors()}
                                enableButton
                                containerStyle={{
                                    backgroundColor: '#fff',
                                    paddingVertical: Dimension.padding10,
                                }}
                            />
                        )}
                    </>
                </ScrollView>
            </KeyboardAvoidingView>
            {/* {isFIR ?
                  (isCTS || isCTSAdmin) && complaintByIdData?.stage == 0 &&
                <NextButton
                    button1={'Cancel'}
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
                    button1={'Cancel'}
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
                    button1={'Cancel'}
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
                    button1={'Cancel'}
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
export default VocFormScreen;
