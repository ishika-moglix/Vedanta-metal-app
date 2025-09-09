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
  containerWrap:{ 
    flex: 1,
    backgroundColor: '#F7F7F7',
    position:"relative",
   
},
TopWrap:{
  padding:Dimension.padding15,
  backgroundColor:"#F7F7F7"
},
  ScannerBtn: {
    //width: '100%',
    borderRadius: 4,
    backgroundColor: '#0072C6',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin:10,
  },
  username:{
    fontSize:Dimension.font26,
    color: "#0063A7",
    fontFamily:Dimension.CustomBoldFont,
  },
  welcome:{
    color: "#454F63",
    fontSize:Dimension.font16,
    fontFamily:Dimension.CustomRegularFont
  },
  SearchWrap:{
    flexDirection:"row",
    //flex:1,
    justifyContent:"space-between",
    height: Dimension.height50,
    marginVertical: Dimension.margin20,
    position:"relative"
  },
  searchIcon:{
    position:"absolute",
    top:15,
    left:10,
    width:24,
    zIndex:999,
  },
  searchBar: {
    fontSize: Dimension.font14,
    flex:7,
    height: Dimension.height50,
    backgroundColor: 'white',
    borderWidth:1,
    borderColor:"#E7E7E8",
    fontFamily:Dimension.CustomRegularFont,
    color:"#7E7E7E",
    borderRadius:8,
    elevation: 16,
    shadowColor: '#455B6324',
    paddingHorizontal:Dimension.padding15,
    paddingLeft:40,
    marginRight:Dimension.margin10
  },
  searchbtn:{
    flex:2,
    borderRadius:8,
    borderColor:"#E7E7E8",
    borderWidth:1,
    elevation: 16,
    shadowColor: '#455B6324',
    backgroundColor:"#0063A7",
    alignContent:"center",
    justifyContent:"center",
   alignItems:"center"
  },
  ClearBtn:{
    flex:3,
    borderRadius:8,
    borderColor:"#E7E7E8",
    borderWidth:1,
    elevation: 16,
    shadowColor: '#455B6324',
    backgroundColor:"#E4E4E4",
    alignContent:"center",
    justifyContent:"center",
   alignItems:"center"
  },
  ClearBtnTxt:{
    color:Colors.FontColor,
    fontSize:Dimension.font14,
    fontFamily:Dimension.CustomSemiBoldFont
  },
  searchedTxt:{
    color:Colors.FontColor,
    fontSize:Dimension.font18,
    fontFamily:Dimension.CustomSemiBoldFont,
    alignSelf:"center"
  },
  searchTxt:{
    color:'#fff',
    fontSize:Dimension.font16,
    fontFamily:Dimension.CustomSemiBoldFont
  },
  BtnTxt: {
    fontSize: Dimension.font20,
    fontFamily: Dimension.CustomMediumFont,
    color: '#fff',
    marginLeft: Dimension.margin8,
  },
  row:{
    flexDirection:"row",
    flex:1,
    paddingHorizontal:Dimension.padding15,
    paddingVertical:Dimension.padding8
   
  },
  col:{
    flex:1,
  },
  CardWrapper:{
   marginBottom:Dimension.margin10,
 // padding:Dimension.padding15,
  backgroundColor:"#fff",
  elevation:12,
  shadowColor:"#00000017"
},
midWrap:{
  paddingBottom:Dimension.padding20,
  paddingHorizontal:Dimension.padding15
},
CSTxt:{
  fontFamily:Dimension.CustomRegularFont,
    fontSize:Dimension.font11,
    color:'#707070',
    marginBottom:Dimension.margin10
},
OpenBtn:{
  borderColor:"#E8F5FF",
  borderWidth:2,
  borderRadius:8,
  padding:Dimension.padding10,
  flexDirection:"row",
  justifyContent:"space-between",
  flex:1,
  marginRight:Dimension.margin10,
  backgroundColor:"#fff"
},
ActiveOpenBtn:{
  borderColor:"#E8F5FF",
  borderWidth:2,
  borderRadius:8,
  padding:Dimension.padding10,
  flexDirection:"row",
  justifyContent:"space-between",
  flex:1,
  marginRight:Dimension.margin10,
  backgroundColor:"#E8F5FF"
},
CloseBtn:{
  borderColor:"#E8F5FF",
  borderWidth:2,
  borderRadius:8,
  padding:Dimension.padding10,
  flexDirection:"row",
  justifyContent:"space-between",
  flex:1,
  marginLeft:Dimension.margin10,
  backgroundColor:"#fff"
},
Orangetxt:{
  color:"#D57608",
  fontSize:Dimension.font16,
  fontFamily:Dimension.CustomSemiBoldFont
},
Greentxt:{
  color:"#05C338",
  fontSize:Dimension.font16,
  fontFamily:Dimension.CustomSemiBoldFont
},
  dot:{
    width:11,
    height:11,
    backgroundColor:"#D57608",
    borderRadius:11
  },
  statustxt:{
    color:Colors.FontColor,
  fontSize:Dimension.font12,
  fontFamily:Dimension.CustomSemiBoldFont,
  marginLeft:Dimension.margin10
  },
  statusWrap:{
    flexDirection:"row",
    justifyContent:"space-between",
    paddingHorizontal:Dimension.padding15,
    paddingVertical:Dimension.padding10,
    borderBottomColor:"#F7F7F7",
    borderBottomWidth:1,
    alignContent:"center"
  },
  boldTxt:{
    fontFamily:Dimension.CustomSemiBoldFont,
    fontSize:Dimension.font12,
    color:Colors.FontColor,
    marginBottom:Dimension.margin6
    
  },
  lightTxt:{
    fontFamily:Dimension.CustomRegularFont,
    fontSize:Dimension.font12,
    color:Colors.FontColor,
    
  },
  EditTxt:{
    fontFamily:Dimension.CustomSemiBoldFont,
    fontSize:Dimension.font14,
    color:'#0064A8',
    
  },
  editBtn:{
    position: Platform.OS === 'ios'? "relative" : "absolute",
    bottom:0,
      right:Dimension.padding15
  },
  addBoxBTn:{
     borderRadius:8,
    borderColor:"#0064A8",
    borderWidth:1,
    elevation: 16,
    shadowColor: '#455B6324',
    backgroundColor:"#fff",
    alignContent:"center",
    justifyContent:"center",
   alignItems:"center",
   marginTop:Dimension.margin12,
   marginHorizontal:Dimension.margin15
  },
  addBoxBtnTxt:{
    color:'#0064A8',
    fontSize:Dimension.font20,
    fontFamily:Dimension.CustomMediumFont,
    paddingVertical:Dimension.padding12
  },
});
