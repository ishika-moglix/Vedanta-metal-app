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
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  ScannerBtn: {
    width: '100%',
    borderRadius: 4,
    backgroundColor: '#0064A8',
    paddingVertical: Dimension.padding13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  QRBtn: {
    //width: '100%',
    borderRadius: 4,
    backgroundColor: '#658354',
    paddingTop: 10,
    //paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  DisabledScannerBtn: {
    width: '100%',
    borderRadius: 4,
    backgroundColor: '#C4C4C4',
    paddingVertical: Dimension.padding13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeTxtWrap: {
    borderWidth: 1,
    borderColor: '#363636',
    width: '100%',
    padding: Dimension.padding20,
    borderRadius: 4,
    color: Colors.FontColor,
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font12,
    marginBottom: Dimension.margin20,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#363636',
    width: '100%',
    // height: 45,
    borderRadius: 4,
    padding: 1,
    marginBottom: Dimension.margin20,
  },
  pickerStyle: {
    width: '100%',
    //height: 30,
    color: Colors.FontColor,
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font12,
    backgroundColor: '#fff',
    //  paddingTop:3,
    //  paddingVertical:0,
    //  paddingBottom:3,
    //  marginTop:0,
    paddingLeft: 0,
    paddingHorizontal: 0,
    marginLeft: 0,
    marginHorizontal: 0,
  },
  txtInputCss: {
    borderWidth: 1,
    borderColor: '#363636',
    width: '100%',
    height: 45,
    borderRadius: 4,
    color: Colors.FontColor,
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font12,
    paddingHorizontal: Dimension.padding20,
    marginBottom: Dimension.padding15,
  },
  TxtInputDetail: {
    borderWidth: 1,
    borderColor: '#363636',
    width: '100%',
    height: 100,
    color: Colors.FontColor,
    borderRadius: 4,
    paddingHorizontal: Dimension.padding15,
    marginBottom: Dimension.padding15,
    fontFamily: Dimension.CustomMediumFont,
  },
  labelStyle: {
    fontSize: Dimension.font12,
    color: Colors.FontColor,
    marginBottom: Dimension.margin10,
    fontFamily: Dimension.CustomMediumFont,
  },

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
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#0065AC',
    marginTop: 7,
    fontWeight: 'bold',
  },
  LogoutbtnWrap: {
    borderRadius: 4,
    backgroundColor: '#fff',
    flexDirection: 'row',

    borderWidth: 1,
    borderColor: '#E7E7E8',
    paddingHorizontal: Dimension.padding15,
    marginTop: Dimension.margin60,
    paddingVertical: Dimension.padding20,
    justifyContent: 'center',
  },
  LogoutbtnTxt: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#0063A7',
  },
  userWrap: {
    backgroundColor: '#0063A7',
    width: 44,
    height: 44,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Dimension.margin15,
  },
  userName: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomRegularFont,
    color: '#000',
    fontWeight: 'bold',
    paddingVertical: Dimension.padding20,
  },
  userFullName: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#363636',
  },
  userEmail: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    color: '#363636',
  },
});
