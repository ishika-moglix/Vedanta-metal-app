import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  TextInput,
  Dimensions
} from 'react-native';
import { Menu, MenuItem } from 'react-native-material-menu';
import Colors from '../Theme/Colors';
import Dimension from '../Theme/Dimension';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Dimensions } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Select = props => {
  const {
    label,
    selectedValue,
    options = [],
    onChange,
    placeHolder,
    disabled = false,
    fromListing,
    containerStyle = {},
    isMulti = false
  } = props;

  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { width, height } = Dimensions.get('window');
 
  const hideMenu = () => {
    setVisible(false)
    setSearchText('');
  };
  const showMenu = () => setVisible(true);

  const filteredOptions = options.filter(item => {
    const label = item.label?.toLowerCase();
    const businessName = item.business_name?.toLowerCase();
    const search = searchText.toLowerCase();

    return (label && label.includes(search)) || (businessName && businessName.includes(search));
  });
 console.log("Select props are", props);
 
  return (
    <View>
      <Text style={[styles.labelTxt]}>
        {label}
      </Text>

      <TouchableOpacity
        onPress={showMenu}
        disabled={disabled}
        style={[styles.field, containerStyle]}>
        {!selectedValue || (isMulti && selectedValue.length === 0) ? (
          <Text style={[styles.placeholderText]}>{placeHolder}</Text>
        ) : isMulti ? (
          <Text style={[styles.fieldText, containerStyle]}>
            {selectedValue.join(', ')}
          </Text>
        ) : (
          <Text style={[styles.fieldText, containerStyle]}>
            {selectedValue}
          </Text>
        )}
        {/* {!selectedValue ? (
          <Text style={[styles.placeholderText]}>{placeHolder}</Text>
        ) : (
          <Text style={[styles.fieldText, containerStyle]}>
            {selectedValue}
          </Text>
        )} */}
        <Icon size={22} color={Colors.black} name={'menu-down'} />
      </TouchableOpacity>

      <Menu
        visible={visible}
        style={[styles.menuStyle, {
          width: fromListing ? Dimension.width210 : Dimension.width210,
          marginLeft: props?.headerFilter ?  Dimension.margin30 :0,
          // marginTop: Platform.OS === 'android' ? 0 : Dimension.margin55
        }]}
        anchor={<View />}
        onRequestClose={hideMenu}>
        <TextInput
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
        <FlatList
          data={filteredOptions}
          keyExtractor={(item, index) => index.toString()}
          style={{ maxHeight: Dimension.height200 }}
          renderItem={({ item }) => (
            <MenuItem
              onPress={() => {
                if (isMulti) {
                  const newSelection = [...(selectedValue || [])];
                  const index = newSelection.indexOf(item.value || item.business_name);
                  if (index > -1) {
                    newSelection.splice(index, 1);
                  } else {
                    newSelection.push(item.value || item.business_name);
                  }
                  onChange(newSelection);
                } else {
                  onChange(item.value || item.business_name);
                  hideMenu();
                }
              }}
              // onPress={() => {
              //   onChange(item.value || item.business_name);
              //   hideMenu();
              // }}
              style={{ margin: 0 }}>
              <Text style={[
                styles.fieldText,
                {
                  color: isMulti && selectedValue?.includes(item.value || item.business_name)
                    ? Colors.primary
                    : Colors.FontColor
                }
              ]}>
                {item.label || item.business_name}
              </Text>
            </MenuItem>
          )}
        />
      </Menu>
    </View>
  );
};

export default Select;

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    borderColor: '#cbcbcb',
    borderRadius: 5,
    height: Dimension.height40,
    paddingLeft: Dimension.padding8,
    paddingRight: Dimension.padding15,
    backgroundColor: '#fff',
    marginBottom: 7,
    marginTop: Dimension.margin16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelTxt: {
    color: Colors.black,
    position: 'absolute',
    left: 0,
    top: 7,
    fontSize: Dimension.font12,
    color: '#A5A5A5',
    marginLeft: Dimension.margin10,
    backgroundColor: '#FFF',
    zIndex: 2,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  fieldText: {
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font13,
    color: Colors.FontColor,
    paddingLeft: Dimension.padding6,
    // width: Dimension.width170,
  },
  placeholderText: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomMediumFont,
    color: 'black',
  },
  menuStyle: {
    backgroundColor: '#fff',
    padding: 0, 
    marginLeft: Platform.OS === 'ios'? Dimension.margin100 : Dimension.margin30
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    margin: Dimension.margin8,
    padding: Dimension.padding6,
    borderRadius: 5,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomMediumFont,
    color: Colors.FontColor
  },
});
