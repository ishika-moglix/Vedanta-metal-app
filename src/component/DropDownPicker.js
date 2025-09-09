import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const CompanyTypeDropdown = ({
  companyType,
  setCompanyType,
  isDisabled,
  isRfc,
  rfcCase,
  isIdPresent,
  options = ['End User', 'Trader', 'Other'],
}) => {
  const [companyModal, setCompanyTypeModal] = useState(false);
  const searchTopRef = useRef(0);
  const openCompanyTypeModal = () => {
    if (!isDisabled) setCompanyTypeModal(true);
  };

  const handleCompanyTypeSelect = type => {
    setCompanyType(type);
    setCompanyTypeModal(false);
  };
  //   console.log('searchTopRef', searchTopRef.current);

  return (
    <View>
      <TouchableOpacity
        onPress={openCompanyTypeModal}
        activeOpacity={0.7}
        disabled={
          isDisabled || (isRfc && (!rfcCase ? !isIdPresent(25) : true))
        }>
        <View
          style={{
            borderColor: !companyType ? '#cbcbcb' : '#0063a7',
            backgroundColor: isDisabled ? '#EAEAEA' : '#FFF',
            padding: 10,
            borderWidth: 1,
            borderRadius: 5,
          }}>
          <Text style={{color: '#A5A5A5'}}>Company Type*</Text>
          <TextInput
            value={companyType}
            //  style={{color: '#000'}}
            editable={false}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#cbcbcb',
              borderRadius: 5,
              paddingLeft: Dimension.padding8,
              paddingRight: Dimension.padding15,
              backgroundColor: '#fff',
              marginBottom: 7,
              marginTop: Dimension.margin16,
            }}
          />
          <MaterialCommunityIcon
            name={'menu-down'}
            size={22}
            color={'#000'}
            style={{position: 'absolute', right: 10, top: 20}}
          />
        </View>
      </TouchableOpacity>
      {companyModal && (
        <TouchableWithoutFeedback onPress={() => setCompanyTypeModal(false)}>
          <View
            style={{
              position: 'absolute',
              top: searchTopRef.current + 20,
              left: 20,
              borderWidth: 1,
              borderColor: '#AFAFAF',
              backgroundColor: '#fff',
              zIndex: 10,
              elevation: 16,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 12},
              shadowOpacity: 0.58,
              shadowRadius: 16.0,
            }}>
            <Text style={{padding: 10, fontWeight: 'bold'}}>Select</Text>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleCompanyTypeSelect(option)}>
                <Text style={{padding: 10}}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default CompanyTypeDropdown;

// Usage Example:
{
  /* <CompanyTypeDropdown 
  companyType={campanyTypeOption}
  setCompanyType={setCampanyTypeOption}
  isDisabled={isFormDisabled}
  isRfc={isRfc}
  rfcCase={rfcCase}
  isIdPresent={isIdPresent}
/> */
}
