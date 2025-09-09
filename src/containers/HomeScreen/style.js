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
    borderRadius: 4,
    padding: 1,
    marginBottom: Dimension.margin20,
  },
  pickerWrapios: {
    borderWidth: 1,
    borderColor: '#363636',
    width: '100%',
    borderRadius: 4,
    padding: 1,
    marginBottom: Dimension.margin20,
    height: Dimension.height45,
  },
  pickerWrapInner: {
    height: Dimension.height42,
    width: '100%',
    overflow: 'hidden',
    padding: 0,
    margin: 0,
    backgroundColor: '#fff',
  },
  pickerStyleIos: {
    width: '100%',
    height: Dimension.height42,
    color: Colors.FontColor,
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font14,
    backgroundColor: '#fff',
    paddingLeft: 0,
    paddingHorizontal: 0,
    marginLeft: 0,
    marginHorizontal: 0,
  },
  pickerStyle: {
    width: '100%',
    height: 44,
    color: Colors.FontColor,
    fontFamily: Dimension.CustomMediumFont,
    fontSize: Dimension.font12,
    backgroundColor: '#fff',

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
    paddingHorizontal: Dimension.padding10,
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
  BtnTxt: {
    fontSize: Dimension.font20,
    fontFamily: Dimension.CustomMediumFont,
    color: '#fff',
    marginLeft: Dimension.margin5,
  },
  //   Logo:{
  //     //width:"100%",
  //     height:36,
  //     alignSelf:"flex-start",
  //     //backgroundColor:"#ccc",
  //     width:175,
  //   },
  //   container:{
  //     padding:Dimension.padding20,
  //     position:"relative",
  //     flex:1,
  //     paddingTop:Dimension.padding50
  //   },
  //   LoginBg:{
  //     width:"100%",
  //     flex:1,
  //     backgroundColor:"#FFFFFF",
  //   },
  //   titleWrap:{
  //     marginVertical:Dimension.margin20
  //   },
  //   title:{
  //     fontFamily:Dimension.CustomBoldFont,
  //     fontSize:Dimension.font27,
  //     color:Colors.FontColor1,
  //   },
  //   pickerWrap:{
  //     borderWidth:1,
  //     borderColor:"#0064A8",
  //     borderRadius:4,
  //     flexDirection:"row",
  //     justifyContent:"space-between",
  //     paddingHorizontal:Dimension.padding8,
  //     paddingVertical:Dimension.padding12,
  //     width:"60%",
  //     marginVertical:Dimension.margin20,
  //     backgroundColor:"#fff"

  //   },
  //   PickerTxt:{
  //     color:"#0064A8",
  //     fontFamily:Dimension.CustomSemiBoldFont,
  //     fontSize:Dimension.font12,
  //     marginTop:Dimension.margin5
  //   },
  // inputView:{
  //     width:"100%",
  //     marginBottom:Dimension.margin20
  // },
  // forgotPassWrap:{
  //   marginVertical:Dimension.margin10,
  //   flexDirection:'row',
  //   justifyContent:"space-between"
  // },
  // forgotpassTxt:{
  //   fontSize:Dimension.font14,
  //   fontFamily:Dimension.CustomRegularFont,
  //   color:"#278BED"
  // },
  // Checkboxlabel:{
  //   fontSize:Dimension.font12,fontFamily:Dimension.CustomRegularFont,
  //   color:'#1B1B1B',
  //   marginLeft:Dimension.margin10,
  //   marginTop:1
  // },
  // forgotAndSignUpText:{
  //   color:"white",
  //   fontSize:11
  // },
  // BottomTxtWrap:{
  //   position:"absolute",
  //   bottom:20,
  //   justifyContent:"center",
  //   flex:1,
  //   alignSelf:'center',

  // },
  // BottomTxt:{
  //   color:Colors.FontColor1,
  //   fontFamily:Dimension.CustomRegularFont,
  //   fontSize:Dimension.font10
  // },
  //   loginBtn:{
  //     backgroundColor:"#0064A8",
  //     borderRadius:4,
  //     alignItems:"center",
  //     justifyContent:"center",
  //     paddingVertical:Dimension.padding15,
  //     marginVertical:Dimension.margin20
  //   },
  //   loginText:{
  //     color: "#FFFFFF",
  //     fontSize: Dimension.font14,
  //     fontFamily:Dimension.CustomBoldFont
  //   },
});
