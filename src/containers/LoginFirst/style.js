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

  Logo: {
    height: Dimension.height36,
    alignSelf: 'center',
    width: Dimension.width175,
  },
  image: {
    height: Dimension.height265,
    alignSelf: 'center',
    width: Dimension.width315,
    marginVertical: Dimension.margin35,
  },
  container: {
    padding: Dimension.padding20,
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? Dimension.padding25 : Dimension.padding50,
  },
  exloreTxt: {
    alignSelf: 'center',
    color: '#0064A8',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    fontWeight: '700',
  },
  titleWrap: {},
  title: {
    alignSelf: 'center',
    fontFamily: Dimension.CustomBoldFont,
    fontSize: Dimension.font24,
    fontWeight: '700',
    color: Colors.FontColor1,
  },
  title2: {
    alignSelf: 'center',
    fontFamily: Dimension.CustomBoldFont,
    fontWeight: '700',
    fontSize: Dimension.font20,
    marginTop: 3,
  },
  descriptionText: {
    fontSize: Dimension.font15,
    fontFamily: Dimension.CustomMediumFont,
    color: Colors.black,
    alignSelf: 'center',
    marginTop: Dimension.margin15,
  },
  BottomTxtWrap: {
    position: 'absolute',
    // marginTop: Dimension.margin30,
    bottom: Platform.OS === 'ios'? 25 :0,
    justifyContent: 'center',
    alignSelf: 'center',
    // marginTop: 34,
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
    elevation: 5,
    shadowColor: '#00000029',
    shadowOffset: { width: 0, height: -2 },
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
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  signupText: {
    color: '#0064A8',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    fontWeight: '700',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomBoldFont,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
