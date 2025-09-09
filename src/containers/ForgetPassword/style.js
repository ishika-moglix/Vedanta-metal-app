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
  container: {
    padding: Dimension.padding20,
    position: 'relative',
    flex: 1,
    paddingTop: Dimension.padding0,
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
    marginTop: 97,
  },
  title: {
    fontFamily: Dimension.CustomBoldFont,
    fontWeight: '700',
    fontSize: Dimension.font22,
    color: Colors.FontColor1,
    marginBottom: 15,
  },
  title2: {
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font18,
    color: Colors.FontColor1,
  },

  inputView: {
    width: '100%',
    // marginBottom: Dimension.margin20,
    padding: 0,
  },
  loginBtn: {
    backgroundColor: '#0064A8',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Dimension.padding15,
    marginTop: Dimension.margin160,
    marginBottom: Dimension.margin30,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Dimension.padding15,
    marginBottom: 89,
  },
  signupText: {
    color: '#0064A8',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    alignItems: 'center',
    fontWeight: '800',
    justifyContent: 'center',
  },
  loginText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
  },
  errorText: {
    color: 'red',
    fontSize: Dimension.font13,
    fontFamily: Dimension.CustomRegularFont,
    top: -Dimension.margin3,
  },
});
