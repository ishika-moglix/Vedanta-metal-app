import { StyleSheet, Dimensions, Platform } from 'react-native';

//import { FORMERR } from 'dns';
const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

/********New imports******/
import Dimension from '../../Theme/Dimension';
import Colors from '../../Theme/Colors';

export default StyleSheet.create({
  SearchWraps: {
    marginVertical: Dimension.margin10,
    marginHorizontal: Dimension.margin15,
    position: 'relative',
  },
  cardContainer: {
    backgroundColor: '#fff',
    padding: Dimension.padding15,
    marginBottom: Dimension.margin5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 5,
  },
  textHeading: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomExtraBoldFont,
    fontWeight: '800',
    color: '#363636'
  },
  text: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    fontWeight: '600',
    color: '#363636'
  },
  date: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    fontWeight: '600',
    color: '#909090',
    paddingTop: Dimension.padding10
  },
  container: {
    paddingHorizontal: Dimension.padding15,
    paddingBottom: Dimension.padding12,
    // paddingTop: Dimension.padding10

  },
  title: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomExtraBoldFont,
    marginBottom: 4,
  },
  removeText: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomExtraBoldFont,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  removeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CB1010',
    position: 'absolute',
    right: 0,
    width: Dimension.width80,
    height: Dimension.height83,
  },
  removeText: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomExtraBoldFont,
    color: 'white',
    fontWeight: '800',
  },
});