import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Dimension from '../Theme/Dimension';
import { generatePDFUrl } from '../utils/generatePdfFile';
import { useSelector, useDispatch } from 'react-redux';
import { downloadTcFile } from '../services/downloadFile';
import Toast from 'react-native-toast-message';
import { handleDownload } from '../utils/generatePdfFile';
const cardFooter = ({ data, cardItem, cardItemData, index }) => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state?.auth?.data);

  const getFinancialYear = timestamp => {
    const date = new Date(parseInt(timestamp));
    return getFinancialYearFromDateObj(date);
  };

  const getFinancialYearFromDateObj = date => {
    const month = date.getMonth() + 1;
    if (month < 4) {
      return (date.getFullYear() - 1).toString();
    } else {
      return date.getFullYear().toString();
    }
  };

  const handleItemPress = async item => {
    const agreementId = cardItemData?.agreementId || '';
    const invoiceNo = cardItemData?.invoiceNo || '';
    const financialYear = getFinancialYear(
      cardItemData?.documentDate
        ? cardItemData.documentDate
        : cardItemData.creationDate,
    );
    const subType = authData?.businessUnit;
    const vendorName = cardItemData?.customerPoNo.includes('VAL')
      ? 'VALC'
      : 'BALC';
    const vendorNameComm = cardItemData?.fromPlantName;
    const vendorInfo = cardItemData?.customerPoNo;
    const myArray = vendorInfo.split(' ');
    const vendorNameNew = myArray[1];

    const vendorId =
      authData?.businessUnit === 'Aluminium'
        ? cardItemData?.vendorId === '1'
          ? 'BALCO'
          : 'VAL'
        : vendorNameNew;
    const billingNo = cardItemData?.billingNo?.toString().padStart(10, '0');
    const poId = cardItemData?.poId;
    const pdfUrl = generatePDFUrl(
      item,
      subType,
      agreementId,
      vendorName,
      vendorNameComm,
      invoiceNo,
      financialYear,
      billingNo,
      vendorId,
      poId,
    );

    if (pdfUrl) {
      try {
        const data = await downloadTcFile(pdfUrl);
        // console.log('data ', data);

        if (data?.successful) {
          handleDownload(pdfUrl, `${item}_File`);
          // console.log('pdf url data', data);
        } else {
          // Alert.alert(
          //   'Vedanta MetalBazaar has not generated PDF for this Invoice',
          // );
          Toast.show({
            type: 'error',
            text2: 'File does not exist.',
            visibilityTime: 4000,
            autoHide: true,
          });
        }
      } catch (err) {
        console.log('Error', err);
      }
    }
  };

  return (
    <View style={styles.rowContainer}>
      {data.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => handleItemPress(item)}>
          <View style={[styles.row]}>
            <AntDesign
              name={'download'}
              size={20}
              color={'#0065AC'}
              style={{ paddingRight: Dimension.padding8 }}
            />
            <Text style={styles.itemText}>{item}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Dimension.padding10,
    paddingHorizontal: Dimension.padding5,
  },

  itemText: {
    fontSize: 14,
    color: '#0064A8',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: Dimension.padding15,
    paddingVertical: Dimension.padding8,
  },
});

export default cardFooter;
