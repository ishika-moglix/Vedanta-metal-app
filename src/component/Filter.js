import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import { TextInput, Radio } from 'mog-react-native-form-fields';
import Dimension from '../Theme/Dimension';
import Header from '../component/Header';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import NextButton from '../component/Button';
import DatePickerInput from './DateTimePicker';
import { filterTextRegex } from '../constants';
import Select from './Select';
const Filter = ({
  props,
  data,
  fromListing,
  onClose,
  initialValues,
  onReset,
  onApply,
  resetFilter,
  onFilterCount,
  activeTab
}) => {
  const [selectedField, setSelectedField] = useState(
    data.buttons[0]?.fieldName || null,
  );

  console.log("resetFilter ki value", resetFilter, onFilterCount);
  
  const [filterCounts, setFilterCount] = useState(0);
  const [fromDateState, setFromDateState] = useState('');
  const [formData, setFormData] = useState(
    initialValues || {
      invoiceNo: '',
      fromDate: '',
      toDate: '',
      dONo: '',
      paymentStatus: '',
      contractId: '',
      customerName: '',
      priceType: '',
      contractType: '',
      status: '',
      userName: '',
      createdBy: '',
      toDate: '',
      fromDate: '',
      nfaNumber: '',
      customerGroup: '',
      creatorName: '',
      creator_id: '',
      companyId: '',
    },
  );
  console.log("hit 123", formData);
  //console.log('data cust', data, fromDD);
  useEffect(() => {
    if (resetFilter) {
      setFormData({
        invoiceNo: '',
        fromDate: '',
        toDate: '',
        dONo: '',
        paymentStatus: '',
        contractId: '',
        customerName: '',
        priceType: '',
        contractType: '',
        status: '',
        userName: '',
        createdBy: '',
        toDate: '',
        fromDate: '',
        creator_id: '',
        companyId: '',
      });
      setSelectedField(data.buttons[0]?.fieldName || null);
    }
  }, [resetFilter]);
  console.log(activeTab, "activeTab.........");
  
  useEffect(() => {
    let activeCount = activeTab === 'nfa'? countActiveNFAFilters(formData) : activeTab==='contractList' ? countActiveContractFilters(formData) : countActiveFilters(formData);
    if (formData?.fromDate.length > 0 && formData?.toDate.length > 0) {
      activeCount = activeCount - 1;
    }
    setFilterCount(activeCount);
    onFilterCount(activeCount);

  }, [formData]);

  useEffect(() => {
    if (data.buttons && data.buttons.length > 0) {
      setSelectedField(prevField => prevField || data.buttons[0]?.fieldName);
    }
  }, [data.buttons]);

  const countActiveNFAFilters = (formData) => {
    console.log("FormData ", formData);
    const filterKeys = ['status', 'username', 'customerGroup', 'creatorName', 'nfaNumber', 'fromDate', 'toDate']; 
    let count = 0;
  
    filterKeys.forEach(key => {
      const value = formData[key];
      console.log(`Checking ${key}:`, value);
      if (typeof value === 'string' && value.trim() !== '') {
        count++;
      }
    });
  
    return count;
  };
  

  const countActiveContractFilters = (formData) => {
    console.log("FormData ", formData);
    const filterKeys = ['status', 'userName','priceType', 'contractType','createdBy', 'customerName', 'contractId', 'fromDate', 'toDate']; 
    let count = 0;
  
    filterKeys.forEach(key => {
      const value = formData[key];
      console.log(`Checking ${key}:`, value);
      if (typeof value === 'string' && value.trim() !== '') {
        count++;
      }
    });
  
    return count;
  };

  const countActiveFilters = (formData) => {
    console.log("FormData ", formData);
    
    let count = 0;
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim() !== '') {
        count++;
      }
    });
    return count;
  };

  const isCtaDisabled = () => {
    const { fromDate, toDate } = formData;
    const isFromDateSelected = fromDate?.trim().length > 0;
    const isToDateSelected = toDate?.trim().length > 0;

    if (
      (isFromDateSelected && !isToDateSelected) ||
      (!isFromDateSelected && isToDateSelected)
    ) {
      return true;
    }
    return false;
  };

  const handleInputChange = (fieldName, value, index) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
    // const selectedOption = data[index]?.options?.find(
    //   item => item.label === val,
    // );
    // if (selectedOption) {
    //   setFormData(prevFormData => ({
    //     ...prevFormData,
    //     business_id: selectedOption?.id || '',
    //     business_name: selectedOption?.value || '',
    //   }));
    // }
    if (fieldName === 'fromDate') {
      const parsedFromDate = parseDate(value);
      // console.log('parsed from date ', value);

      setFromDateState(value);
    }

    if (fieldName === 'toDate') {
      const parsedToDate = parseDate(value);
      if (fromDateState && parsedToDate < fromDateState) {
        // Alert.alert(
        //   'Invalid Date',
        //   'Please select a date after the From Date.',
        // );
        setFormData({
          ...formData,
          toDate: '',
        });
      }
    }
  };

  const handleChange = (val, index, fieldName) => {
    console.log('123', data?.fields?.[index]);
    if (fieldName) {
      handleInputChange(fieldName, val);
      const selectedOption = data?.fields?.[index]?.options?.find(
        item => item.value === val,
      );
      console.log("Selected Options", selectedOption);

      if (selectedOption && fieldName === 'creatorName') {
        setFormData(prevFormData => ({
          ...prevFormData,
          creator_id: selectedOption?.id || '',
        }));
      } else if (selectedOption && fieldName === 'username') {
        setFormData(prevFormData => ({
          ...prevFormData,
          approverUserId: selectedOption?.id || '',
        }));
      }
      else if (selectedOption && fieldName === 'customerGroup') {
        setFormData(prevFormData => ({
          ...prevFormData,
          companyId: selectedOption?.id || '',
        }));
      }
      else if (selectedOption && fieldName === 'createdBy') {
        setFormData(prevFormData => ({
          ...prevFormData,
          creator_id: selectedOption?.id || '',
        }));
      }
    }
  };

  const parseDate = dateString => {
    if (!dateString || dateString === '') {
      return null;
    }
    const [day, month, year] = dateString.split('/');
    return new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
    );
  };

  const handleApply = () => {
    console.log('Applied Filters:', formData);
    // Alert.alert('Filters Applied!', JSON.stringify(formData, null, 2));
    onApply(formData);
    onClose();
  };

  const handleReset = () => {
    setFormData({
      // initialValues,
      invoiceNo: '',
      fromDate: '',
      toDate: '',
      dONo: '',
      paymentStatus: '',
      contractId: '',
      customerName: '',
      priceType: '',
      contractType: '',
      status: '',
      userName: '',
      createdBy: '',
      toDate: '',
      fromDate: '',
      creator_id: '',
      companyId: '',

    });
   
    setSelectedField(data.buttons[0]?.fieldName || null);
    onReset(formData)
  };

  return (
    <View style= {{ flex: 1}}>
    <View style={{
        paddingTop: Platform.OS === 'ios' ? Dimension.padding55 : 0,
        zIndex: 1,
        elevation: 2,
    }}>
     <Header
        showText={'Filter'}
        showBackModal={onClose}
        currentScreen={props?.props?.route?.name}
        navigation={props?.props?.navigation}
        />
      <View style={[styles.row, ]}>
        <View style={[styles.column, { flex: 4 }]}>
          {data.buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.btnWrap,
                selectedField === button.fieldName && styles.activeBtn,
              ]}
              onPress={() => setSelectedField(button.fieldName)}>
              <Text
                style={[
                  styles.btnTxt,
                  selectedField === button.fieldName && styles.activeBtnTxt,
                ]}>
                {button.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.column, { flex: 6, padding: Dimension.padding15,  }]}>
          {data.fields.map((field, index) => {
            if (selectedField === field.fieldName) {
              if (field.type === 'text') {
                return (
                  <TextInput
                    key={index}
                    placeholder={field.placeholder}
                    placeholderTextColor={'#000'}
                    withLabel={false}
                    containerStyles={styles.inputField}
                    textStyles={styles.textInput}
                    keyboardType={field.keyboardType || 'default'}
                    value={formData[field.fieldName]}
                    onChangeText={text =>
                      handleInputChange(
                        field.fieldName,
                        text.replace(filterTextRegex, ''),
                      )
                    }
                  />
                );
              }
              if (field.type === 'date') {
                return (
                  <>
                    <DatePickerInput
                      placeholder={'DD/MM/YYYY'}
                      formData={formData['fromDate']}
                      index={index}
                      label={'From Date*'}
                      handleInputChange={date =>
                        handleInputChange('fromDate', date)
                      }
                    />

                    <DatePickerInput
                      placeholder={'DD/MM/YYYY'}
                      formData={formData['toDate']}
                      index={index}
                      label={'To Date*'}
                      handleInputChange={date =>
                        handleInputChange('toDate', date)
                      }
                      fromDate={formData['fromDate']}
                      disabled={!formData['fromDate']}

                    />
                  </>
                );
              }
              if (field.type === 'options') {
                return (
                  <Select
                    key={index}
                    fromListing={fromListing}
                    selectedValue={formData[field.fieldName]}
                    placeHolder={field.placeholder || field.label}
                    onChange={val => handleChange(val, index, field.fieldName)}
                    // onChange={val => handleInputChange(field.fieldName, val)}
                    options={field.options || []}
                    containerStyle={[
                      styles.selectField,
                      {
                        borderColor: formData[field.fieldName] ? '#0063a7' : '#979797',
                      },
                    ]}
                  />
                );
              }
              if (field.type === 'radio') {
                return (
                  <View key={index} style={styles.radioGroup}>
                    {field.options.map((option, optionIndex) => (
                      <TouchableOpacity
                        key={optionIndex}
                        style={styles.radioOption}
                        onPress={() =>
                          handleInputChange(field.fieldName, option.value)
                        }>
                        <Radio
                          isChecked={formData[field.fieldName] === option.value}
                          label={option.label}
                          labelPosition={'right'}
                          checkedColor={'#0064A8'}
                          uncheckedColor={'#ccc'}
                          radioButtonShape={'circle'}
                          radioButtonType={'icon'}
                          uncheckedIcon={
                            <MaterialCommunityIcon
                              color={'#0064A8'}
                              size={24}
                              name={'radiobox-blank'}
                            />
                          }
                          checkedIcon={
                            <MaterialCommunityIcon
                              color={'#0064A8'}
                              size={24}
                              name={'radiobox-marked'}
                            />
                          }
                        />
                        <Text style={styles.radioText}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                );
              }
            }
            return null;
          })}
        </View>
      </View>
      <NextButton
        button1={'Reset'}
        button2={'Apply'}
        fromEditProfile
        firstButton={handleReset}
        secondButton={handleApply}
        disableButton2={isCtaDisabled()}
        enableButton
      />
      </View>
      
      </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '82%',
  },
  column: {
    borderWidth: 1,
    // borderBottomWidth: 0,
    borderColor: '#F2F2F2',
    paddingVertical: Dimension.padding25,
  },
  btnWrap: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Dimension.padding25,
    // marginBottom: 10,
  },
  btnTxt: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#363636',
    // marginTop: 7,
    fontWeight: 'bold',
    paddingLeft: Dimension.padding20,
  },
  inputField: {
    borderColor: '#363636',
    borderWidth: 1,
    borderRadius: 4,
  },
  textInput: {
    color: '#000',
    fontSize: Dimension.font14,
    fontFamily: 'CustomRegularFont',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  activeBtn: {
    backgroundColor: '#F0F7FF',
  },
  activeBtnTxt: {
    color: '#0063A7',
    fontWeight: 'bold',
  },
});

export default Filter;
