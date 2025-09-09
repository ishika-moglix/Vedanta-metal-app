import CONSTANTS from '../services/constant';
import { PermissionsAndroid, Alert, Platform } from 'react-native';
// import RNFS, { stat } from 'react-native-fs';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'react-native-blob-util';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const generatePDFUrl = (
  type,
  subType,
  agreementId,
  vendorName,
  vendorNameComm,
  invoiceNo,
  financialYear,
  billingNo,
  vendorId,
  poId,
) => {
  let url = '';

  const checkIsNull = (value, errorMessage) => {
    if (!value) {
      console.warn(errorMessage);
      return true;
    }
    return false;
  };

  switch (type) {
    case 'Invoice': {
      switch (subType) {
        case 'Aluminium': {
          const vendId = vendorId.toString() == 'BALCO' ? 'BALC' : 'VALC';
          if (agreementId && vendId) {
            // url = `https://vedanta-authqa.moglilabs.com${CONSTANTS.PDF_URL.AUTH_URL_ALUMINIUM_INVOICEPDF}${agreementId}_${vendorName}_IN.PDF`;
            url = `${CONSTANTS.PDF_URL.AUTH_URL_ALUMINIUM_INVOICEPDF_PROD}${agreementId}_${vendorName}_IN.PDF`;
            console.log('url', url);
          }
          break;
        }
        //"https://vedanta-authqa.moglilabs.com/vedanta-data/",
        case 'Copper': {
          if (poId) {
            // url = `https://vedanta-sapqa.moglilabs.com${CONSTANTS.PDF_URL.AUTH_URL_COPPER_INVOICEPDF}${agreementId}_${financialYear}_SC_IN.PDF`;
            url = `${CONSTANTS.PDF_URL.AUTH_URL_COPPER_INVOICEPDF_PROD}${agreementId}_${financialYear}_SC_IN.PDF`;
            console.log('url0', url);
          }
          break;
        }
        //"https://vedanta-sapqa.moglilabs.com/vedanta-sftp/",
        case 'Zinc': {
          if (poId) {
            // url = `https://vedanta-sapqa.moglilabs.com${CONSTANTS.PDF_URL.AUTH_URL_HZL_INVOICEPDF}${invoiceNo}_${financialYear}_HZL_IN.PDF`;
            url = `${CONSTANTS.PDF_URL.AUTH_URL_HZL_INVOICEPDF_PROD}${invoiceNo}_${financialYear}_HZL_IN.PDF`;
            console.log('url1', url);
          }
          break;
        }
        //"https://vedanta-sapqa.moglilabs.com/vedanta-sftp/HZL/",
        default:
          console.warn('Invalid Subtype for Invoice');
          break;
      }
      break;
    }

    case 'TC': {
      switch (subType) {
        case 'Aluminium': {
          if (checkIsNull(agreementId, 'Agreement ID is Not Present')) return;
          // if (checkIsNull(vendorName, 'Vendor Name is Not Present')) return;

          const venName = vendorId.includes('VAL') ? 'VALC' : 'BALC';
          // url = `https://vedanta-authqa.moglilabs.com${CONSTANTS.PDF_URL.AUTH_URL_ALUMINIUM_INVOICEPDF}${agreementId}_${venName}_TC.pdf`;
          url = `${CONSTANTS.PDF_URL.AUTH_URL_ALUMINIUM_TCPDF_PROD}${agreementId}_${venName}_TC.pdf`;
          console.log('url2', url);
          break;
        }
        // https://vedanta-authqa.moglilabs.com/vedanta-data/
        case 'Copper': {
          if (checkIsNull(agreementId, 'Agreement ID is Not Present')) return;
          // url = `https://vedanta-sapqa.moglilabs.com/${CONSTANTS.PDF_URL.AUTH_URL_COPPER_TCPDF}${invoiceNo}_${financialYear}_SC_TC.pdf`;
          url = `${CONSTANTS.PDF_URL.AUTH_URL_COPPER_TCPDF_PROD}${invoiceNo}_${financialYear}_SC_TC.PDF`;
          console.log('url3', url);
          break;
        }
        //"https://vedanta-sapqa.moglilabs.com/vedanta-sftp/",
        case 'Zinc': {
          if (checkIsNull(agreementId, 'Agreement ID is Not Present')) return;
          // url = `https://vedanta-sapqa.moglilabs.com${CONSTANTS.PDF_URL.AUTH_URL_HZL_TCPDF}${invoiceNo}_${financialYear}_HZL_TC.pdf`;
          url = `${CONSTANTS.PDF_URL.AUTH_URL_HZL_TCPDF_PROD}${invoiceNo}_${financialYear}_HZL_TC.PDF`;
          console.log('url4', url);
          break;
        }
        //"https://vedanta-sapqa.moglilabs.com/vedanta-sftp/HZL/",
        default:
          console.warn('Invalid Subtype for TC');
          break;
      }
      break;
    }
    case 'LR': {
      if (checkIsNull(financialYear, 'Financial Year is Not Present')) return;
      switch (subType) {
        case 'Aluminium': {
          if (checkIsNull(invoiceNo, 'Invoice Number is Not Present')) return;
          const vendId = vendorId.toString() == 'BALCO' ? 'BALC' : 'VALC';
          // url = `https://vedanta-auth.moglix.com/${CONSTANTS.PDF_URL.AUTH_URL_ALUMINIUM_LRPDF}${invoiceNo}_${vendId}_${financialYear}_LR.PDF`;
          url = `${CONSTANTS.PDF_URL.AUTH_URL_ALUMINIUM_LRPDF_PROD}${invoiceNo}_${vendId}_${financialYear}_LR.PDF`;
          console.log('url5', url);
          break;
        }
        //"https://vedanta-auth.moglix.com/vedanta-data/",
        case 'Copper': {
          if (checkIsNull(invoiceNo, 'Invoice Number is Not Present')) return;
          // url = `https://vedanta-sapqa.moglilabs.com${CONSTANTS.PDF_URL.AUTH_URL_CU_LRPDF}${agreementId}_${financialYear}_LR.PDF`;
          url = `${CONSTANTS.PDF_URL.AUTH_URL_COPPER_LRPDF_PROD}${agreementId}_${financialYear}_LR.PDF`;
          console.log('url6', url);
          break;
        }
        // https://vedanta-sapqa.moglilabs.com/vedanta-sftp/
        case 'Zinc': {
          if (checkIsNull(invoiceNo, 'Invoice Number is Not Present')) return;
          // url = `https://vedanta-sapqa.moglilabs.com${CONSTANTS.PDF_URL.AUTH_URL_HZL_LRPDF}${agreementId}_${financialYear}_LR.PDF`;
          url = `${CONSTANTS.PDF_URL.AUTH_URL_HZL_LRPDF_PROD}${agreementId}_${financialYear}_LR.PDF`;
          console.log('url7', url);
          break;
        }
        //"https://vedanta-sapqa.moglilabs.com/vedanta-sftp/HZL/",
        default:
          console.warn('Invalid Subtype for LR');
          break;
      }
      break;
    }

    case 'PL': {
      switch (subType) {
        case 'Aluminium': {
          if (checkIsNull(agreementId, 'Agreement ID is Not Present')) return;
          if (checkIsNull(vendorId, 'Vendor ID is Not Present')) return;
          let vendId = vendorId.includes('VAL') ? 'VALC' : 'BALC';
          // url = `${CONSTANTS.AUTH_BASE_URL}${CONSTANTS.PDF_URL.AUTH_URL_ALUMINIUM_PLPDF}${agreementId}_${vendId}_PL.pdf`;
          // url = `https://vedanta-auth.moglix.com${CONSTANTS.PDF_URL.AUTH_URL_ALUMINIUM_PLPDF}${agreementId}_${vendId}_PL.pdf`;
          url = `${CONSTANTS.PDF_URL.AUTH_URL_ALUMINIUM_PLPDF_PROD}${agreementId}_${vendId}_PL.pdf`;
          console.log('url8', url);
          break;
        }
        // "https://vedanta-auth.moglix.com/vedanta-data/",
        case 'Copper': {
          if (checkIsNull(agreementId, 'Agreement ID is Not Present')) return;
          // url = `https://vedanta-sapqa.moglilabs.com${CONSTANTS.PDF_URL.AUTH_URL_COPPER_PLPDF}${billingNo}_${vendorNameComm}_${financialYear}_SC_PL_LIST.pdf`;
          url = `${CONSTANTS.PDF_URL.AUTH_URL_COPPER_PLPDF_PROD}${billingNo}_${vendorNameComm}_${financialYear}_SC_PC_LIST.PDF`;
          console.log('url9', url);
          break;
        }
        // https://vedanta-sapqa.moglilabs.com/vedanta-sftp/"
        case 'Zinc': {
          if (checkIsNull(agreementId, 'Agreement ID is Not Present')) return;
          // url = `https://vedanta-sapqa.moglilabs.com${CONSTANTS.PDF_URL.AUTH_URL_HZL_PLPDF}${invoiceNo}_${financialYear}_HZL_RV.pdf`;
          url = `${CONSTANTS.PDF_URL.AUTH_URL_HZL_PLPDF_PROD}${invoiceNo}_${financialYear}_HZL_RV.pdf`;
          console.log('url10', url);
          break;
        }
        //"https://vedanta-sapqa.moglilabs.com/vedanta-sftp/HZL/",
        default:
          console.warn('Invalid Subtype for PL');
          break;
      }
      break;
    }

    default: {
      console.warn('Invalid Type Provided');
      break;
    }
  }
  if (url) {
    return url;
  } else {
    console.warn('No URL generated.');
  }
};

// const mimeMap = {
//   pdf: 'application/pdf',
//   xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   csv: 'text/csv',
//   docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
// };

const mimeMap = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  txt: 'text/plain',
  csv: 'text/csv',
};

// export const handleDownload = async (url, type) => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//     );

//     console.log("granted", granted);


//     if (granted !== PermissionsAndroid.RESULTS.DENIED) {
//       const { config, fs } = RNFetchBlob;
//       const fileExtension = url.split('.').pop();

//       const mime = mimeMap[fileExtension.toLowerCase()] || 'application/octet-stream';

//       const sanitizedDate = new Date().toISOString().replace(/[:.]/g, '-');
//       const fileName = `${type}_${sanitizedDate}.${fileExtension}`
//       // type === 'Export'
//       //   ? `dispatch_${sanitizedDate}.${fileExtension}`
//       //   : type === 'SAP'
//       //     ? `SAP_Report_${sanitizedDate}.${fileExtension}`
//       //     : `File_${sanitizedDate}.${fileExtension}`;
//       const downloadDir = fs.dirs.DownloadDir;
//       const filePath = `${downloadDir}/${fileName}`;
//       config({
//         fileCache: true,
//         addAndroidDownloads: {
//           useDownloadManager: true,
//           notification: true,
//           path: filePath,
//           description: 'Downloading file...',
//           mime,
//         },
//       })
//         .fetch('GET', url)
//         .then(res => {
//           console.log('Download completed:', res.path());
//           Toast.show({
//             type: 'success',
//             text2: `Download Complete, File saved to: ${res.path()}`,
//             visibilityTime: 4000,
//             autoHide: true,
//           });
//         })
//         .catch(error => {
//           console.log('Download error:', error);
//           Toast.show({
//             type: 'error',
//             text2: 'Failed to download file',
//             visibilityTime: 4000,
//             autoHide: true,
//           });
//         });
//     } else {
//       Toast.show({
//         type: 'error',
//         text2: 'Storage permission denied',
//         visibilityTime: 4000,
//         autoHide: true,
//       });
//     }
//   } catch (err) {
//     console.log('Download Error:', err);
//     Toast.show({
//       type: 'error',
//       text2: 'Failed to download file',
//       visibilityTime: 4000,
//       autoHide: true,
//     });
//   }
// };

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message:
          'This app needs access to your location to fetch your pincode.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};



export const handleDownloads = async (url, type) => {
  try {
    const { fs, config } = RNFetchBlob;
    const fileExtension = url.split('.').pop();
    const mime = mimeMap[fileExtension.toLowerCase()] || 'application/octet-stream';
    const sanitizedDate = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${type}_${sanitizedDate}.${fileExtension}`;

    const filePath =
      Platform.OS === 'android'
        ? `${fs.dirs.DownloadDir}/${fileName}`
        : `${fs.dirs.DocumentDir}/${fileName}`;

    const res = await config({
      fileCache: true,
      path: filePath,
      addAndroidDownloads:
        Platform.OS === 'android'
          ? {
              useDownloadManager: true,
              notification: true,
              path: filePath,
              description: 'Downloading file...',
              mime,
            }
          : undefined,
    }).fetch('GET', url, { 'Cache-Control': 'no-store' });

    console.log('Download completed:', res.path());

    if (Platform.OS === 'ios') {
      RNFetchBlob.ios.previewDocument(res.path());
      Toast.show({
        type: 'success',
        text2: 'File downloaded. Please save it from Files app.',
        visibilityTime: 3000,
        autoHide: true,
      });
    } else {
      Toast.show({
        type: 'success',
        text2: `Download Complete, File saved to: ${res.path()}`,
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  } catch (error) {
    console.log('Download error:', error);
    Toast.show({
      type: 'error',
      text2: 'Failed to download file',
      visibilityTime: 4000,
      autoHide: true,
    });
  }
};

export const handleDownload = async (pdfUrl, type) => {
  if (Platform.OS === 'android') {
    try {
      if (parseInt(Platform.constants.Release, 10) >= 13) {
        // Android 13+ me runtime storage permission ki zarurat nahi
        handleDownloads(pdfUrl, type);
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          handleDownloads(pdfUrl, type);
        } else {
          Toast.show({
            type: 'error',
            text2: 'Storage permission denied',
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      }
    } catch (err) {
      console.warn(err);
    }
  } else {
    handleDownloads(pdfUrl, type);
  }
};


// export const handleDownloads = async (url, type) => {
//   try {
//     const { config, fs } = RNFetchBlob;
//     const fileExtension = url.split('.').pop();
//     const mime = mimeMap[fileExtension.toLowerCase()] || 'application/octet-stream';
//     const sanitizedDate = new Date().toISOString().replace(/[:.]/g, '-');
//     const fileName = `${type}_${sanitizedDate}.${fileExtension}`;

//     let filePath = '';
//     // let permissionGranted = true;

//     if (Platform.OS === 'android') {
//       // const granted = await PermissionsAndroid.request(
//       //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//       // );
//       // console.log("granted", granted, PermissionsAndroid.RESULTS);
      
//       // permissionGranted = granted === PermissionsAndroid.RESULTS.GRANTED || granted ===  PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ;
//       filePath = `${fs.dirs.DownloadDir}/${fileName}`;
//     } else {
//       filePath = `${fs.dirs.DocumentDir}/${fileName}`;
//     }
// // console.log("permissionGranted", permissionGranted, );

//     // if (!permissionGranted) {
//     //   Toast.show({
//     //     type: 'error',
//     //     text2: 'Storage permission denied',
//     //     visibilityTime: 4000,
//     //     autoHide: true,
//     //   });
//     //   return;
//     // }

//     config({
//       fileCache: true,
//       path: filePath,
//       addAndroidDownloads: Platform.OS === 'android' ? {
//         useDownloadManager: true,
//         notification: true,
//         path: filePath,
//         description: 'Downloading file...',
//         mime,
//       } : undefined,

//     })
//       .fetch('GET', url, { 'Cache-Control': 'no-store' })
//       .then(res => {
//         console.log('Download completed:', res.path());
//         if (Platform.OS == 'ios') {
//           RNFetchBlob.fs
//             .createFile(filePath, res.data, 'utf8')
//             .then(_ => { })
//             .catch(e => { });
//         }
//         if (Platform.OS == 'ios') {
//           setTimeout(() => {
//             RNFetchBlob.fs.writeFile(fs.dirs.DocumentDir, res.data, 'base64');
//             RNFetchBlob.ios.previewDocument(res.data);
//           });

//           Toast.show({
//             type: 'success',
//             text2: 'Please Save File in your device',
//             visibilityTime: 2000,
//             autoHide: true,
//           });
//         }
//         Toast.show({
//           type: 'success',
//           text2: `Download Complete, File saved to: ${res.path()}`,
//           visibilityTime: 4000,
//           autoHide: true,
//         });
//       })
//       .catch(error => {
//         console.log('Download error:', error);
//         Toast.show({
//           type: 'error',
//           text2: 'Failed to download file',
//           visibilityTime: 4000,
//           autoHide: true,
//         });
//       });
//   } catch (err) {
//     console.log('Download Error:', err);
//     Toast.show({
//       type: 'error',
//       text2: 'Failed to download file',
//       visibilityTime: 4000,
//       autoHide: true,
//     });
//   }
// };
// export const handleDownload = async (pdfUrl, type) => {
//   if (Platform.OS == 'android') {
//     try {
//       if (Platform.constants['Release'] >= 13) {
//         console.log("hite here", Platform.constants['Release']);
//        handleDownloads(pdfUrl, type);
//       } else {
//         PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         ).then(granted => {
//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             console.log("hite here inside granted", granted);
//              handleDownloads(pdfUrl, type);
//           } else {
//           }
//         });
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   } else {
//     console.log("hite here inside else");
//     handleDownloads(pdfUrl, type);
//   }
// };


const getExtention = filename => {
  return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
};

export const getRealUrl = async (url, type) => {
  console.log("getReat url hit", url, type);
  
  if (!url) {
    Toast.show({
      type: 'error',
      text2: 'Data not available',
      visibilityTime: 4000,
      autoHide: true,
    });
    return;
  }
  let newUrl = url;
  newUrl = newUrl.replace('SD_DOC_32_41/', 'https://stg.moglix.com/');
  newUrl = newUrl.replace('SD_DOC_32_41', 'https://stg.moglix.com/');
  newUrl = newUrl.replace(
    'AP_AST_33_33/',
    'https://s3.ap-southeast-1.amazonaws.com/doc.moglix.com/',
  );
  newUrl = newUrl.replace(
    'AP_AST_33_33',
    'https://s3.ap-southeast-1.amazonaws.com/doc.moglix.com/',
  );
  newUrl = newUrl.replace(
    'POM_ZON_33_33',
    'https://purchase-order-moglix.s3.ap-south-1.amazonaws.com',
  );
  newUrl = newUrl.replace('PST_FLE_42_89', 'com/vedanta-sftp');
  newUrl = newUrl.replace(
    'RE_ZON_31_23',
    'https://purchaseorder.s3.amazonaws.com',
  );

  newUrl = newUrl.replace('https://https//', 'https://');
  newUrl = newUrl.replace('https://https://', 'https://');
  console.log('newUrl here', newUrl);
  handleDownload(newUrl, type);
  return newUrl;
};
