import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Image,
} from 'react-native';
import { TextInput } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Dimension from '../Theme/Dimension';
import colors from '../Theme/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { getSearchPlantRequest } from '../redux/feature/homeSlice';
const Search = props => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const searchTopRef = useRef(0);
  const inputWidth = useRef();

  // console.log(inputValue);
  useEffect(() => {
    if (inputValue == '') {
      dispatch(getSearchPlantRequest({ searchString: '' }));
    }
  }, [inputValue])
  const getSearchPlantData = async obj => {
    dispatch(getSearchPlantRequest({ searchString: inputValue || '' }));
  };
  return (
    <>

      <View
        style={styles.container}
        onLayout={event => {
          const { height, y } = event.nativeEvent.layout;
          searchTopRef.current = height + y;
        }}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={getSearchPlantData}>
            <Image
              source={require('../assets/images/icon_search.png')}
              style={styles.image}
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Select Plant"
            scrollEnabled
            placeholderTextColor={'#AFAFAF'}
            style={styles.searchTextInput}
            returnKeyType={'search'}
            onChangeText={setInputValue}
            value={inputValue}
            onSubmitEditing={getSearchPlantData}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: Dimension.margin25,
    paddingTop: Dimension.padding15,
    // position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: Platform.OS === 'ios' && 8,
    height: Platform.OS === 'ios' && 50,
    backgroundColor: '#fff',
    borderColor: '#E7E7E8',
    borderWidth: 1,
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    lineHeight: Dimension.font14,
    fontFamily: Dimension.CustomMediumFont,
  },

  leadingIcon: {
    paddingHorizontal: Dimension.responsiveValue8,
  },
  trailingIcon: {
    paddingHorizontal: Dimension.responsiveValue8,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Dimension.responsiveValue8,
    borderBottomWidth: 1,
    borderBottomColor: '#00000020',
  },
  chapterContainer: {
    backgroundColor: '#007BFF',
    height: Dimension.responsiveValue29,
    width: Dimension.responsiveValue30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterText: {
    fontSize: Dimension.font20,
    fontWeight: 'bold',
    color: colors.white,
  },
  descriptionText: {
    fontSize: Dimension.font12,
    color: '#333',
    flex: 2,
    marginHorizontal: Dimension.responsiveValue10,
    fontFamily: Dimension.CustomMediumFont,
  },
  suggestionItem: {
    padding: Dimension.responsiveValue8,
  },
  highlightedText: {
    backgroundColor: 'yellow',
    fontWeight: 'bold',
  },

  searchTextInput: {
    flex: 1,
    // paddingRight: 30,
    fontSize: 12,
    paddingVertical: Dimension.padding5,
    marginLeft: Dimension.padding55,
    // paddingRight: Dimension.padding30,
    fontSize: Dimension.font14,
    color: '#7E7E7E',
  },
  searchButton: {
    position: 'absolute',
    left: 10,
    padding: Dimension.padding5,
  },
  image: {
    width: Dimension.width25,
    height: Dimension.height25,
  },
});

export default Search;
