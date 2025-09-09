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
  btntxt:
    Platform.OS === 'ios'
      ? {
          color: Colors.WhiteColor,
          fontSize: Dimension.font14,
          fontFamily: Dimension.CustomBoldFont,
          fontWeight: '700',
        }
      : {
          color: Colors.WhiteColor,
          fontSize: Dimension.font14,
          fontFamily: Dimension.CustomBoldFont,
          alignSelf: 'center',
        },
  btnStyle: {
    backgroundColor: '#0262a8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: Dimension.padding20,
    height: Dimension.height45,
  },
  btnContainer: {
    backgroundColor: '#0262a8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    height: Dimension.height45,
    marginTop: Dimension.margin100,
  },
  result: {
    fontSize: 12,
    textAlign: 'center',
    color: '#0064A8',
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  Logo: {
    //width:"100%",
    height: 36,
    //alignSelf: 'center',
    marginVertical: 15,
    //backgroundColor:"#ccc",
    width: 175,
  },
  image: {
    //width:"100%",
    height: 265,
    alignSelf: 'center',
    //backgroundColor:"#ccc",
    width: 315,
    marginVertical: 40,
  },
  container: {
    padding: Dimension.padding20,
    position: 'relative',
    flex: 1,
    paddingTop: Dimension.padding50,
    backgroundColor: '#F7F7F7',
  },
  exploreBtn: {
    //backgroundColor: '#0262a8',
    paddingVertical: Dimension.padding12,

    marginVertical: Dimension.margin10,
    marginBottom: Dimension.margin40,
  },
  pickerContainer: {
    //position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  pickerStyle: {
    color: Colors.FontColor,
    //color : "#0064A8",
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font14,
    marginLeft: 8,
    marginVertical: 11,
  },
  exloreTxt: {
    alignSelf: 'center',
    color: '#0064A8',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  LoginBg: {
    width: '100%',
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleWrap: {
    // margin: Dimension.margin49,
  },
  title: {
    alignSelf: 'center',
    fontFamily: Dimension.CustomBoldFont,
    fontSize: Dimension.font24,
    color: Colors.FontColor1,
  },
  title2: {
    alignSelf: 'center',
    fontFamily: Dimension.CustomBoldFont,
    fontSize: Dimension.font20,
    marginTop: 3,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#0064A8',
    borderRadius: 4,
    padding: 1,
    marginTop: 50,
    marginBottom: Dimension.margin40,
    width: Dimension.width210,
    height: Dimension.height50,
    backgroundColor: '#fff',
  },
  // pickerWrap: {
  //   borderWidth: 1,
  //   borderColor: '#363636',
  //   width: '100%',
  //   // height: 45,
  //   borderRadius: 4,
  // padding: 1,
  // marginBottom: Dimension.margin20,
  // },
  pickerWrapBtn: {
    height: 40,
    paddingLeft: Dimension.padding8,
    alignItems: 'flex-start',
    paddingVertical: 13,
    position: 'relative',
  },
  PickerTxt: {
    color: '#0064A8',
    fontFamily: Dimension.CustomSemiBoldFont,
    fontSize: Dimension.font12,
    marginTop: Dimension.margin5,
  },
  inputView: {
    width: '100%',
    // marginBottom: Dimension.margin20,
    marginBottom: Dimension.margin8,
    marginTop: Dimension.margin20,
    //    paddingVertical: 10
  },
  forgotPassWrap: {
    marginTop: Dimension.margin50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forgotpassTxt: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomRegularFont,
    color: '#278BED',
    marginTop: Dimension.margin15,
    //marginBottom: 50
  },
  Checkboxlabel: {
    fontSize: Dimension.font13,
    fontFamily: Dimension.CustomRegularFont,
    color: '#000000',
    marginLeft: Dimension.margin3,
    alignSelf: 'center',
    // marginTop: 1,
  },
  forgotAndSignUpText: {
    color: 'white',
    fontSize: 11,
  },
  BottomTxtWrap: {
    position: 'absolute',
    bottom: 10,
    justifyContent: 'center',
    flex: 1,
    alignSelf: 'center',
  },
  BottomTxt: {
    color: Colors.FontColor1,
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font10,
  },
  loginBtn: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: Dimension.padding13,
    paddingHorizontal: Dimension.padding20,
    marginVertical: Dimension.margin10,
    alignItems: 'center',
    alignSelf: 'flex-start',
    elevation: 5,
    shadowColor: '#00000029',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderColor: '#cbcbcb',
    borderWidth: 1,
  },

  signupBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0064A8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Dimension.padding15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#00000029',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  signupText: {
    color: '#0064A8',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  descriptionText: {
    fontSize: Dimension.font15,
    color: '#000000',
    alignSelf: 'center',
    marginTop: 15,
    // marginBottom: 30
  },
  accountText: {
    fontSize: Dimension.font14,
    color: '#000000',
    marginBottom: 42,
  },
  loginText: {
    color: '#000',
    fontSize: Dimension.font16,
    fontWeight: '700',
    fontFamily: Dimension.CustomExtraBoldFont,
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
    paddingTop: 20,
    textAlign: 'center',
  },
  option: {
    fontSize: 14,
    color: '#363636',
    fontWeight: 'bold',
    marginVertical: 0,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 14,
    color: '#363636',
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
  outerView: {
    // width: "100%",
    paddingTop: 10,
  },
  progBarView: {
    borderWidth: 1,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 40,
    width: '40%',
    marginTop: 7,
    marginBottom: 30,
  },
  insideProgView: {
    borderColor: 'green',
    borderRadius: 40,
    backgroundColor: 'green',
    paddingVertical: 3,

    // width: "65%",
  },
  percentText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonView: {
    borderWidth: 2,
    paddingVertical: 12,
    borderRadius: 40,
    borderColor: 'blue',
    marginTop: 10,
    alignSelf: 'center',
    width: '54%',
    height: 50,
    backgroundColor: 'blue',
    elevation: 10,
  },
  btnText: {
    color: 'yellow',
    fontSize: 15,
    lineHeight: 24,
    alignSelf: 'center',
    fontFamily: Dimension.CustomSemiBoldFont,
    fontWeight: '700',
  },
  headingTxt: {
    color: '#000',
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomExtraBoldFont,
    fontWeight: '700',
  },
  // container: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   padding: 10,
  // },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 10,
  },
});
