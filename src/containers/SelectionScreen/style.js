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
  searchBar: {
    fontSize: Dimension.font14,
    height: Dimension.height50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E7E7E8',
    width: '85%',
    fontFamily: Dimension.CustomRegularFont,
    color: '#7E7E7E',
    borderRadius: 8,
    elevation: 16,
    shadowColor: '#455B6324',
    padding: 12,
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    // alignItems: 'center',
    //justifyContent: 'center',
    alignSelf: 'flex-end',
    // borderTopLeftRadius: 16,
    // borderTopRightRadius: 16,
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    width: '100%',
  },
  headerWrap: {
    paddingVertical: Dimension.padding10,
    paddingHorizontal: Dimension.padding15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  HeaderTxt: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomMediumFont,
    color: '#454F63',
    marginLeft: Dimension.margin10,
  },
  radioTxt: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomRegularFont,
    color: Colors.FontColor,
  },
  radioWrap: {
    flex: 1,
  },
  radioView: {
    padding: Dimension.padding15,
  },
  SelectTypeTxt: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: Colors.FontColor,
    marginBottom: Dimension.margin10,
  },
  ButtonWrap: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: Dimension.padding15,
    paddingVertical: Dimension.padding10,
  },
  ScanBtn: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: Dimension.padding10,
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  ScanImg: {
    width: 60,
    height: 60,
    alignContent: 'center',
    justifyContent: 'center',
  },
  ScanBtnTxt: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: Colors.FontColor,
    alignContent: 'center',
    justifyContent: 'center',
    lineHeight: 60,
    marginLeft: Dimension.margin10,
  },
  bottomWrap: {
    padding: Dimension.padding15,
  },
  orWrap: {
    flexDirection: 'row',
    marginBottom: Dimension.margin15,
  },
  HrLine: {
    height: 1,
    backgroundColor: '#0063A7',
    width: '44%',
    marginTop: Dimension.margin6,
  },
  ortxt: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    color: '#0063A7',
    marginHorizontal: Dimension.margin12,
  },
  continueText: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#0063A7',
    textTransform: 'uppercase',
    // width:"100%",
    alignSelf: 'center',
  },
});
