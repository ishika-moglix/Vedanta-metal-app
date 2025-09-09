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
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 3 },
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

  btnTxt: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#363636',
    marginTop: 7,
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
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Dimension.margin15,
    marginBottom: Dimension.margin15,
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
  inputView: {
    width: '100%',
    // marginBottom: Dimension.margin20,
    padding: 0
  },
  userWrap: {
    marginRight: Dimension.margin15,
    marginBottom: Dimension.margin15,
  },
  gradientCircle: {
    backgroundColor: '#0063A7',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halfCircleContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#0063A7',
    // position: 'relative',
  },
  halfCircle: {
    // position: 'absolute',
    width: 100,
    height: 50,
  },
  blueHalf: {
    backgroundColor: '#0063A7',
    top: 0,
  },
  blackHalf: {
    backgroundColor: '#000',
    top: 10,
    bottom: 0,
  },
  centerContent: {
    position: 'absolute',
    // backgroundColor:'pink',
    marginBottom: 0
    // borderRadius: 50,
    // alignItems: ,
    // justifyContent: 'center',
  },
  btnWrap: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  halfCircleContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    //backgroundColor: '#0063A7',
    overflow: 'hidden',
    position: 'relative',
  },
  halfCircle: {
    width: 100,
    height: 70,
  },
  blueHalf: {
    backgroundColor: '#0063A7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blackHalf: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  userName: {
    fontSize: Dimension.font37,
    fontFamily: Dimension.CustomRegularFont,
    color: '#fff',

  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:'yellow'
  },
  editText: {
    fontSize: 12,
    color: '#fff',
    paddingLeft: 5,
  },
  userFullName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '20%'
    // paddingTop: 20,
    // textAlign: 'center'
  },
  option: {
    fontSize: Dimension.font14,
    color: "#363636",
    fontWeight: 'bold',
    marginVertical: 20,
    marginLeft: 15
    // textAlign: 'center'
  },
  modalTitle: {
    fontSize: 14,
    color: "#363636",
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',

  },
  separator: {
    height: 1,
    backgroundColor: '#EFEFEF',
    width: '100%',

  },
});
