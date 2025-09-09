import {StyleSheet, Dimensions, Platform} from 'react-native';

//import { FORMERR } from 'dns';
const IS_IOS = Platform.OS === 'ios';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

/********New imports******/
import Dimension from '../../Theme/Dimension';
import Colors from '../../Theme/Colors';

export default StyleSheet.create({
  btnWrap: {
    //width: '100%',
    borderRadius: 4,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E7E7E8',
    padding: Dimension.padding15,
    marginBottom: Dimension.margin10,
  },
  btnTxt: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#0065AC',
    fontWeight: '700',

    marginLeft: Dimension.margin8,
  },
  redTxt: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#D62424',
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  headingtxt: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomMediumFont,
    color: '#303030',
    fontWeight: '500',
    paddingVertical: Dimension.padding20,
  },
});