import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Dimension from '../Theme/Dimension';
import colors from '../Theme/Colors';

export const toastConfig = {
  success: ({text1, text2, onPress, ...rest}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.successView}>
      <Text style={styles.successText}>{text2}</Text>
    </TouchableOpacity>
  ),
  error: ({text1, text2, onPress, ...rest}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress} 
      style={styles.errorView}>
      <Text style={styles.errorText}>{text2}</Text>
    </TouchableOpacity>
  ),
};

const styles = StyleSheet.create({
  successText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: Dimension.CustomBoldFont,
  },
  errorText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: Dimension.CustomMediumFont,
  },
  successView: {
    width: '95%',
    backgroundColor: 'green',
    borderRadius: 5,
    padding: Dimension.padding10,
    // marginTop: Dimension.margin10,
  },
  errorView: {
    width: '95%',
    backgroundColor: '#dc3545',
    borderRadius: 5,
    padding: Dimension.padding10,
    // marginTop: Dimension.margin10,
  },
});

// import { StyleSheet, Text, View } from "react-native";
// import Dimension from "../Theme/Dimension";
// import colors from "../Theme/Colors";

// export const toastConfig = {
//   success: ({ text1, text2, onPress, ...rest }) => (
//     <View style={styles.successView}>
//       <Text style={styles.successText}>{text2}</Text>
//     </View>
//   ),
//   error: ({ text1, text2, onPress, ...rest }) => (
//     <View style={styles.errorView}>
//       <Text style={styles.errorText}>{text2}</Text>
//     </View>
//   ),
// };

// const styles = StyleSheet.create({
//   successText: {
//     color: "#fff",
//     fontSize: 13,
//     fontFamily: Dimension.CustomBoldFont,
//   },
//   errorText: {
//     color: "#fff",
//     fontSize: 13,
//     fontFamily: Dimension.CustomMediumFont,
//   },
//   successView: {
//     width: "95%",
//     backgroundColor: 'green',
//     borderRadius: 5,
//     padding: Dimension.padding10,
//   },
//   errorView: {
//     //  height: 53,
//     width: "95%",
//     backgroundColor: '#dc3545',
//     borderRadius: 5,
//     padding: Dimension.padding10,
//   },
// });
