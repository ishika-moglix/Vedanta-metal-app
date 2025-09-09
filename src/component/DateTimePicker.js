import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
// import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Dimension from '../Theme/Dimension';

const DatePickerInput = ({
  label,
  placeholder,
  formData,
  index,
  fromDate,
  handleInputChange,
  disabled,
  textStyle,
  labelStyle,
  fromHeadFilter
}) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    console.log("event", event);
    if (Platform.OS === 'ios') {
      setShow(false);
    }
    if (selectedDate) {
      const formattedDate = `${String(selectedDate.getDate()).padStart(2, '0')}/${String(selectedDate.getMonth() + 1).padStart(2, '0')}/${selectedDate.getFullYear()}`;
      handleInputChange(formattedDate);
      setDate(selectedDate);
    }
  };

  const parseDate = (dateString) => {
    if (!dateString || dateString === '') return null;
    const [day, month, year] = dateString.split('/');
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  };

  const showMode = currentMode => {
    DateTimePickerAndroid.open({
      value: parseDate(formData) || new Date(),
      onChange,
      display: 'calendar',
      mode: currentMode,
      is24Hour: false,
      minimumDate: fromDate ? parseDate(fromDate) : undefined,
      themeVariant: 'light'
    })
  };

  const showDatepicker = () => {
    if (Platform.OS === 'android') {
      showMode('date');
    } else {
      setShow(true);
    }
  };
  // const showDatepicker = () => {
  //   setShow(true); 
  // };

  return (
    <>
      <Text
        style={[
          {
            color: '#363636',
            fontSize: Dimension.font10,
            fontFamily: Dimension.CustomMediumFont,
            fontWeight: 'bold',
            paddingHorizontal: Dimension.padding10,
            paddingTop: Dimension.padding20,
            // backgroundColor: 'red'
          },
          labelStyle,
        ]}
      >
        {label}
      </Text>

      <TouchableOpacity
        onPress={showDatepicker}
        style={[{ paddingVertical: Platform.OS === 'ios' ? fromHeadFilter ? 0 : 5 : 5 }, textStyle]}
        disabled={disabled}
      >
        <View style={[styles.inputField, textStyle]}>
          <TextInput
            key={index}
            placeholder={placeholder}
            placeholderTextColor={Platform.OS === 'ios' ? '#333333' : "#000"}
            value={formData}
            editable={false}
            style={styles.textInput}
          />
          <AntDesign name="calendar" size={20} color="#000000" style={styles.icon} />
        </View>
      </TouchableOpacity>
      {show && Platform.OS === 'ios' && (
        <Modal
          transparent={true}
          visible={show}
          onRequestClose={() => setShow(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setShow(false)}
          >
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>

          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={parseDate(formData) || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate);
                  const formattedDate = `${String(selectedDate.getDate()).padStart(2, '0')}/${String(selectedDate.getMonth() + 1).padStart(2, '0')}/${selectedDate.getFullYear()}`;
                  handleInputChange(formattedDate);
                }
              }}
              minimumDate={fromDate ? parseDate(fromDate) : undefined}
              themeVariant="light"
            />
            <TouchableOpacity
              style={{
                marginTop: Dimension.margin10,
                backgroundColor: '#000',
                padding: Dimension.padding10,
                borderRadius: 5,
              }}
              onPress={() => {
                const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                handleInputChange(formattedDate);
                setShow(false);
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>Done</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#363636',
    borderRadius: 5,
    paddingHorizontal: Dimension.padding8,
  },
  textInput: {
    flex: 1,
    color: '#333333',
    fontSize: Dimension.font14,
    paddingVertical: Platform.OS === 'ios' ? Dimension.padding14 : 0
  },
  icon: {
    marginLeft: Dimension.margin10,
  },
  overlay: {
    // flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  datePickerContainer: {
    position: 'absolute',
    top: 200,
    left: 10,
    right: 10,
    zIndex: 1000,
    backgroundColor: 'white',
    padding: Dimension.padding20,
    borderRadius: 10,
  },
});

export default DatePickerInput;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Platform,
//   StyleSheet,
// } from 'react-native';
// import DateTimePicker, {
//   DateTimePickerAndroid,
// } from '@react-native-community/datetimepicker';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Dimension from '../Theme/Dimension';

// const DatePickerInput = ({
//   label,
//   placeholder,
//   formData,
//   index,
//   fromDate,
//   handleInputChange,
//   disabled,
//   textStyle,
//   labelStyle,
// }) => {
//   const [date, setDate] = useState(new Date());
//   const [show, setShow] = useState(false);
//   // console.log('from date', fromDate);

//   const onChange = (event, selectedDate) => {
// if (Platform.OS === 'ios') {
//   setShow(false);
// }
//     if (selectedDate) {
//       setDate(selectedDate);
//       const formattedDate = `${String(selectedDate.getDate()).padStart(
//         2,
//         '0',
//       )}/${String(selectedDate.getMonth() + 1).padStart(
//         2,
//         '0',
//       )}/${selectedDate.getFullYear()}`;

//       handleInputChange(formattedDate);
//     }
//   };

//   const parseDate = dateString => {
//     if (!dateString || dateString === '') {
//       return null;
//     }
//     const [day, month, year] = dateString.split('/');
//     return new Date(
//       parseInt(year, 10),
//       parseInt(month, 10) - 1,
//       parseInt(day, 10),
//     );
//   };

//   const showModeIos = currentMode => {
//     setShow(true);
//     console.log("IOS hit");
//     return <DateTimePicker
//       value={parseDate(formData) || new Date()}
//       onChange={onChange}
//       display="spinner"
//       mode={'date'}
//       is24Hour={false}
//       minimumDate={fromDate ? parseDate(fromDate) : undefined}
//     />
//   }

// const showMode = currentMode => {
//   console.log("IOS hit");
//   Platform.OS === 'ios' ? (
//     // setShow(true);
//     <DateTimePicker
//       value={parseDate(formData) || new Date()}
//       onChange={onChange}
//       display="spinner"
//       mode={'date'}
//       is24Hour={false}
//       minimumDate={fromDate ? parseDate(fromDate) : undefined}
//     // value={date}
//     // mode="date"
//     // display="spinner"
//     // onChange={onChange}
//     // minimumDate={fromDate ? parseDate(fromDate) : undefined}
//     />

//   ) : (
//     DateTimePickerAndroid.open({
//       value: parseDate(formData) || new Date(),
//       onChange,
//       display: 'calendar',
//       mode: currentMode,
//       is24Hour: false,
//       minimumDate: fromDate ? parseDate(fromDate) : undefined,
//     })
//   )
// };

// const showDatepicker = () => {
//   if (Platform.OS === 'android') {
//     showMode('date');
//   } else {
//     showModeIos('date');
//   }
// };
//   return Platform.OS === 'Android' ? show && (
//     <DateTimePicker
//       value={date}
//       mode="date"
//       display="spinner"
//       onChange={onChange}
//       minimumDate={fromDate ? parseDate(fromDate) : undefined}
//     />

//   ) : (
//     <>
//       <Text
//         style={[
//           {
//             color: '#363636',
//             fontSize: Dimension.font10,
//             fontFamily: Dimension.CustomMediumFont,
//             fontWeight: 'bold',
//             paddingHorizontal: Dimension.padding10,
//             paddingTop: Dimension.padding20,
//           },
//           labelStyle,
//         ]}>
//         {label}
//       </Text>
//       <TouchableOpacity
//         onPress={showDatepicker}
//         style={{ paddingVertical: 5 }}
//         disabled={disabled}>
//         <View style={[styles.inputField, textStyle]}>
//           <TextInput
//             key={index}
//             placeholder={placeholder}
//             placeholderTextColor="#000"
//             value={formData}
//             editable={false}
//             style={styles.textInput}
//           />
//           <AntDesign
//             name="calendar"
//             size={20}
//             color="#000000"
//             style={styles.icon}
//           />
//         </View>
//       </TouchableOpacity>
//     </>
//   );

//   // return (
//   //   <>
//   //     <Text
//   //       style={[
//   //         {
//   //           color: '#363636',
//   //           fontSize: Dimension.font10,
//   //           fontFamily: Dimension.CustomMediumFont,
//   //           fontWeight: 'bold',
//   //           paddingHorizontal: Dimension.padding10,
//   //           paddingTop: Dimension.padding20,
//   //         },
//   //         labelStyle,
//   //       ]}>
//   //       {label}
//   //     </Text>
//   //     <TouchableOpacity
//   //       onPress={showDatepicker}
//   //       style={[{ paddingVertical: 5 }, textStyle]}
//   //       disabled={disabled}>
//   //       <View style={[styles.inputField, textStyle]}>
//   //         <TextInput
//   //           key={index}
//   //           placeholder={placeholder}
//   //           placeholderTextColor={'#000'}
//   //           value={formData}
//   //           editable={false}
//   //           style={styles.textInput}
//   //         />
//   //         <AntDesign
//   //           name="calendar"
//   //           size={20}
//   //           color={'#000000'}
//   //           style={styles.icon}
//   //         />
//   //       </View>
//   //     </TouchableOpacity>

//   //     {Platform.OS === 'ios' && (
//   //       <DateTimePicker
//   //         value={date}
//   //         mode="date"
//   //         display="default"
//   //         onChange={onChange}
//   //       />
//   //     )}
//   //   </>
//   // );
// };

// const styles = StyleSheet.create({
//   inputField: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#363636',
//     borderRadius: 5,
//     paddingHorizontal: Dimension.padding8,
//   },
//   textInput: {
//     flex: 1,
//     color: '#333333',
//     fontSize: Dimension.font14,
//   },
//   icon: {
//     marginLeft: Dimension.margin10,
//   },
// });

// export default DatePickerInput;