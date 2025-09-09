import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import Select from './Select';
import Dimension from '../Theme/Dimension';
import { filterTextRegex } from '../constants';
import FilterButton from './Button';
import DatePickerInput from './DateTimePicker';
const HeaderFilter = ({
  data,
  fromSupplier,
  initialValues,
  onApply,
  onReset,
  fromDD,
  resetTrigger,
}) => {
  const [selectedValues, setSelectedValues] = useState(
    Array(data.length).fill(null),
  );

  // console.log("initialValues", initialValues);
  
  console.log("hit 123", formData);
  //console.log('data cust', data, fromDD);
  useEffect(() => {
    console.log("hit", resetTrigger);

    if (resetTrigger) {
      const clearedData = {
        Invoice: '',
        invoiceNo: '',
        fromDate: '',
        toDate: '',
        customerId: '',
        plant: '',
        orderNo: '',
        CustomerName: '',
        business_id: '',
        business_name: '',
      };
      setFormData(clearedData);
      setSelectedValues(Array(data.length).fill(null));
      // onReset && onReset(clearedData); 
    }
  }, [resetTrigger]);

  const [formData, setFormData] = useState(
    initialValues || {
      Invoice: '',
      invoiceNo: '',
      fromDate: '',
      toDate: '',
      customerId: '',
      plant: '',
      orderNo: '',
      CustomerName: '',
      business_id: '',
      business_name: '',
    },
  );

  const isCtaDisabled = () => {
    const { fromDate, toDate } = formData;
    //console.log('from dataa', formData);
    //console.log('check this', toDate?.trim().length, fromDate?.trim().length);

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
  const handleApply = () => {
    onApply(formData);
    // Alert.alert('Filters Reset!', JSON.stringify(formData, null, 2));
    // onClose();
  };

  const handleReset = () => {
    const clearedData = {
      Invoice: '',
      invoiceNo: '',
      fromDate: '',
      toDate: '',
      customerId: '',
      plant: '',
      orderNo: '',
      CustomerName: '',
      business_id: '',
      business_name: '',
    };
    setFormData(clearedData);
    setSelectedValues(Array(data.length).fill(null));

    onReset(clearedData);
    // Alert.alert('Filters Reset!', JSON.stringify(clearedData, null, 2));
  };
  // console.log("Data filter", data);


  const handleInputChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleChange = (val, index, fieldName) => {
    console.log('123', val, index, fieldName);
    const newValues = [...selectedValues];
    newValues[index] = val;
    setSelectedValues(newValues);
    if (fieldName) {
      handleInputChange(fieldName, val);
      const selectedOption = data[index]?.options?.find(
        item => item.label === val,
      );
      if (selectedOption && selectedOption?.id) {
        console.log("SelectedOption", selectedOption);

        setFormData(prevFormData => ({
          ...prevFormData,
          business_id: selectedOption?.id || '',
          // business_name: selectedOption?.value || '',
        }));
      }
    }
  };
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {data?.map((item, index) => {
          if (item.type === 'text') {
            return (
              <TextInput
                key={index}
                placeholder={item.placeholder}
                placeholderTextColor={'#333333'}
                autoCapitalize={'characters'}
                style={[
                  styles.inputField,
                  { marginLeft: index === 0 ? 0 : Dimension.margin15 },
                ]}
                value={formData[item.label] || ''}
                onChangeText={text =>
                  handleInputChange(
                    item.label,
                    text.replace(filterTextRegex, ''),
                  )
                }
              />
            );
          }
          if (item.type === 'options') {
            return (
              <Select
                key={index}
                selectedValue={selectedValues[index]}
                placeHolder={`${item.placeholder}`}
                onChange={val => handleChange(val, index, item.label)}
                options={item.options}
                fromDD={fromDD}
                isMulti={item.isMulti}
                fromHeadFilter = {true}
                containerStyle={[
                  styles.selectField,
                  {
                    borderColor: !selectedValues[index] ? '#979797' : '#0063a7',
                  },
                ]}
              />
            );
          }
          if (item.type === 'date') {
            return (
              <>
                <DatePickerInput
                  placeholder={fromSupplier ? 'From Date' : 'DD/MM/YYYY'}
                  formData={formData['fromDate']}
                  index={index}
                  label={''}
                  handleInputChange={date =>
                    handleInputChange('fromDate', date)
                  }
                  fromHeadFilter={true}
                  textStyle={{
                    backgroundColor: '#fff',
                    height: Dimension.height40,
                    paddingVertical: 0,
                    borderColor: '#979797',
                  }}
                />

                <DatePickerInput
                  placeholder={fromSupplier ? 'To Date' : 'DD/MM/YYYY'}
                  formData={formData['toDate']}
                  index={index}
                  label={''}
                  handleInputChange={date => handleInputChange('toDate', date)}
                  fromDate={formData['fromDate']}
                  disabled={!formData['fromDate']}
                  fromHeadFilter={true}
                  textStyle={{
                    backgroundColor: '#fff',
                    height: Dimension.height40,
                    paddingVertical: 0,
                    fontSize: Dimension.font10,
                    borderColor: '#979797',
                  }}
                />
              </>
            );
          }
        })}
      </ScrollView>

      <FilterButton
        button1={'Reset'}
        button2={'Apply'}
        fromEditProfile
        firstButton={handleReset}
        secondButton={handleApply}
        disableButton2={isCtaDisabled()}
        enableButton
        textStyle={{
          paddingVertical: Dimension.padding6,
          paddingHorizontal: Dimension.padding10,
          width: '30%',
          height: Dimension.height35,
          marginTop: 0,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: Dimension.padding10,
    paddingHorizontal: Dimension.padding0,
  },
  inputField: {
    borderColor: '#979797',
    borderWidth: 1,
    borderRadius: 4,
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font14,
    textAlignVertical: 'center',
    paddingLeft: Dimension.padding8,
    color: '#333333',
    width: Dimension.width120,
    height: Dimension.height40,
    backgroundColor: '#fff',
  },
  selectField: {
    marginTop: 0,
    marginLeft: Dimension.margin15,
  },
});

export default HeaderFilter;
