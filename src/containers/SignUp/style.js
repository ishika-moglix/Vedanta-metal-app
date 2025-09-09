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
    fontSize: Dimension.font14,
    textAlign: 'center',
    fontWeight: '800',
    color: '#0064A8',
    width: '80%',
    lineHeight: Dimension.font20,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  Logo: {
    //width:"100%",
    height: Dimension.height36,
    alignSelf: 'center',
    marginTop: Dimension.margin10,
    //backgroundColor:"#ccc",
    width: Dimension.width175,
  },
  image: {
    //width:"100%",
    height: Dimension.height265,
    alignSelf: 'center',
    //backgroundColor:"#ccc",
    width: Dimension.width315,
    marginVertical: 40,
  },
  container: {
    padding: Dimension.padding20,
    position: 'relative',
    flex: 1,
    paddingTop: Dimension.padding50,
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
    marginLeft: Dimension.margin8,
    marginVertical: Dimension.margin11,
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
    marginTop: Dimension.margin50,
    marginBottom: Dimension.margin20,
    width: Dimension.width210,
    // height: Dimension.height50,
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
    height: Dimension.height40,
    paddingLeft: Dimension.padding8,
    alignItems: 'flex-start',
    paddingVertical: Dimension.padding8,
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
    padding: 0,
  },
  forgotPassWrap: {
    marginTop: Dimension.margin50,
    flexDirection: 'row',
    // alignItems: 'center',
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
  },
  forgotpassTxt: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomRegularFont,
    color: '#278BED',
    marginTop: Dimension.margin15,
    //marginBottom: 50
  },
  Checkboxlabel: {
    width: '90%',
    fontSize: Dimension.font13,
    fontFamily: Dimension.CustomRegularFont,
    color: '#000000',
    marginLeft: Dimension.margin3,
    alignSelf: 'center',
    // marginTop: 1,
  },
  forgotAndSignUpText: {
    color: 'white',
    fontSize: Dimension.font11,
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
    backgroundColor: '#0064A8',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Dimension.padding15,
    marginTop: Dimension.margin30,
    marginBottom: Dimension.margin20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#00000029',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  signupBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0064A8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Dimension.padding15,
    marginBottom: Dimension.margin20,
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
    marginTop: Dimension.margin15,
    // marginBottom: 30
  },
  accountText: {
    fontSize: Dimension.font14,
    color: '#000000',
    marginBottom: Dimension.margin42,
  },
  loader: {
    marginRight: Dimension.responsiveValue10,
    marginLeft: Dimension.responsiveValue8,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: Dimension.font14,
    fontWeight: '800',
    fontFamily: Dimension.CustomBoldFont,
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
    paddingTop: Dimension.padding20,
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
    fontSize: Dimension.font14,
    color: '#363636',
    fontWeight: 'bold',
    marginTop: Dimension.margin20,
    marginBottom: Dimension.margin10,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#EFEFEF',
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
  },
  inputViews: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbcbcb',
    paddingVertical: Dimension.padding8,
    borderRadius: 5,
    paddingLeft: Dimension.padding8,
    paddingRight: Dimension.padding15,
    backgroundColor: '#fff',
    // marginBottom: 7,
    // marginTop: Dimension.margin16,
  },
  inputFields: {
    flex: 1,
    fontSize: Dimension.font12,
    fontFamily: 'CustomRegularFont',
    paddingVertical: Dimension.padding5,
    color: '#000',
  },
  iconStyles: {
    marginLeft: Dimension.margin10,
  },
});
