// import React, {useState, useEffect, useRef} from 'react';
// import {StatusBar, ScrollView} from 'react-native';
// import styles from '../BusinessDetails/style';
// import {Text, View, TouchableOpacity, Image} from 'react-native';
// import Dimension from '../../Theme/Dimension';
// import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Feather from 'react-native-vector-icons/Feather';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useDispatch, useSelector} from 'react-redux';
// import Divider from '../../component/Divider';
// import BusinessDetailsForm from '../../component/BusinessDetails';
// import BankDetailsForm from '../../component/BankDetailsForm';
// import DocumentsForm from '../../component/DocumentsForm';
// import PlantsForm from '../../component/Plants';
// import NextButton from '../../component/Button';

// const BusinessDetailsScreen = props => {
//   console.log('prop busin', props);

// const dispatch = useDispatch();
// const [loader, setLoader] = useState(false);
// const [onSave, setOnSave] = useState(false);
// const [onEnable, setOnEnable] = useState('');
// const [productVariants, setProductVariants] = useState([]);
// const [products, setProducts] = useState([]);
// const [checkedItem, setCheckedItem] = useState([]);
// const [currentStep, setCurrentStep] = useState(1);
// const [savePressed, setSavePressed] = useState(false);

//   const authData = useSelector(state => state.auth.data);
//   const businessUnit = useSelector(state => state.auth.data.businessUnit);
//   console.log('props', props);
//   const scrollViewRef = useRef(null);
//   useEffect(() => {
//     console.log('Parent onSave updated:', onSave);
//   }, [onSave]);

//   useEffect(() => {
//     if (scrollViewRef?.current) {
//       const scrollX = (currentStep - 1) * 100;
//       scrollViewRef?.current?.scrollTo({x: scrollX, animated: true});
//     }
//   }, [currentStep]);

//   const storeData = async value => {
//     try {
//       const jsonValue = JSON.stringify(value);
//       await AsyncStorage.setItem('@user_info', jsonValue);
//     } catch (e) {
//       console.log(e);
//       // saving error
//     }
//   };

//   const showForm = () => {};
//   const handleCheckedItem = product => {
//     let prod = [];
//     setCheckedItem(prevChecked => {
//       let updatedChecked;
//       if (prevChecked.includes(product)) {
//         updatedChecked = prevChecked.filter(item => item !== product);
//       } else {
//         updatedChecked = [...prevChecked, product];
//       }
//       const selectedProducts = updatedChecked.map(selectedProduct => {
//         const variant = productVariants.find(
//           variant => variant.description === selectedProduct,
//         );
//         prod.push({
//           productId: variant?.product?.id,
//           productName: variant?.description,
//         });
//         setProducts(prod);
//       });
//       return updatedChecked;
//     });
//   };

// const handleNextStep = () => {
//   setCurrentStep(prevStep => prevStep + 1);
// };
// const handleBackStep = () => {
//   setCurrentStep(prevStep => prevStep - 1);
// };
//   //   const onCreateAccount = newPwd => {
//   //     try {
//   //     }catch{

//   //     }
//   //   };

//   const handleEnable = () =>{

//   }
// const handleProfileProgress = () => {
//   let percentage = '';

//   if (currentStep === 1) {
//     percentage = '0';
//   } else if (currentStep === 2) {
//     percentage = '25';
//   } else if (currentStep === 3) {
//     percentage = '50';
//   } else {
//     percentage = '75';
//   }

//   return (
//     <View style={styles.outerView}>
//       <View>
//         <View style={styles.row}>
//           <Text style={[styles.headingTxt]}>Profile Completion</Text>
//           <View style={styles.progBarView}>
//             <View
//               style={[
//                 styles.insideProgView,
//                 {
//                   width: `${percentage}%`,
//                 },
//               ]}
//             />
//           </View>
//           <Text style={styles.percentText}>{percentage}%</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

//   console.log('onEnable', onEnable, 'onSave', onSave);

//   return (
//     <>
//       <View style={{flex: 1, backgroundColor: '#fff'}}>
//         <StatusBar
//           translucent
//           backgroundColor="#F0F7FF"
//           barStyle={'dark-content'}
//         />

//         {/* <View style={styles.LoginBg}> */}
//         {/* <KeyboardAvoidingView
//             behavior={Platform.OS == 'android' ? 'padding' : 'position'}> */}
//         {/* <ScrollView> */}
//         <View style={styles.container}>
//           <Image
//             style={styles.Logo}
//             source={require('../../assets/images/logo.png')}
//             resizeMode="contain"></Image>
//           <View
//             style={{
//               backgroundColor: '#fff',
//               alignContent: 'center',
//               borderRadius: 5,
//               borderColor: '#EBEBEB',
//               borderWidth: 1,
//               // paddingBottom: 100,
//               paddingTop: 10,
//               paddingHorizontal: 15,
//               height: '90%',
//             }}>
//             <View>
//               {handleProfileProgress()}
//               <Divider />
//             </View>
//             <View>
//               <ScrollView
//                 horizontal={true}
//                 ref={scrollViewRef}
//                 // showsHorizontalScrollIndicator={true}
//                 contentContainerStyle={{
//                   flexDirection: 'row',
//                   paddingVertical: 10,
//                 }}>
//                 <TouchableOpacity
//                   activeOpacity={!onSave ? 1 : 0}
//                   onPress={onSave ? () => setCurrentStep(1) : null}
//                   style={[
//                     styles.loginBtn,
//                     {flexDirection: 'row', marginRight: 10},
//                     {
//                       borderColor: currentStep == 1 ? '#0063A7' : '#cbcbcb',
//                       backgroundColor: currentStep == 1 ? '#CFE1EE' : '#fff',
//                     },
//                   ]}>
//                   <View
//                     style={{
//                       backgroundColor: currentStep == 1 ? '#0063A7' : '#fff',
//                       borderRadius: 4,
//                       padding: 3,
//                       marginRight: 5,
//                     }}>
//                     <Feather
//                       name={'briefcase'}
//                       color={currentStep === 1 ? '#fff' : '#000'}
//                       size={18}
//                     />
//                   </View>
//                   <Text
//                     style={[
//                       styles.loginText,
//                       {color: currentStep == 1 ? '#0063A7' : '#000'},
//                     ]}>
//                     Business Details
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   activeOpacity={!onSave ? 1 : 0}
//                   onPress={onSave ? () => setCurrentStep(2) : null}
//                   style={[
//                     styles.loginBtn,
//                     {flexDirection: 'row', marginRight: 10},
//                     {
//                       borderColor: currentStep == 2 ? '#0063A7' : '#cbcbcb',
//                       backgroundColor: currentStep == 2 ? '#CFE1EE' : '#fff',
//                     },
//                   ]}>
//                   <View
//                     style={{
//                       backgroundColor: currentStep == 2 ? '#0063A7' : '#fff',
//                       borderRadius: 4,
//                       padding: 3,
//                       marginRight: 5,
//                     }}>
//                     <MaterialCommunityIcon
//                       name={'map-marker-radius'}
//                       color={currentStep === 2 ? '#fff' : '#000'}
//                       size={18}
//                     />
//                   </View>
//                   <Text
//                     style={[
//                       styles.loginText,
//                       {color: currentStep == 2 ? '#0063A7' : '#000'},
//                     ]}>
//                     Plants
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   activeOpacity={!onSave ? 1 : 0}
//                   onPress={onSave ? () => setCurrentStep(3) : null}
//                   style={[
//                     styles.loginBtn,
//                     {flexDirection: 'row', marginRight: 10},
//                     {
//                       borderColor: currentStep == 3 ? '#0063A7' : '#cbcbcb',
//                       backgroundColor: currentStep == 3 ? '#CFE1EE' : '#fff',
//                     },
//                   ]}>
//                   <View
//                     style={{
//                       backgroundColor: currentStep == 3 ? '#0063A7' : '#fff',
//                       borderRadius: 4,
//                       padding: 3,
//                       marginRight: 5,
//                     }}>
//                     <MaterialCommunityIcon
//                       name={'bank'}
//                       color={currentStep === 3 ? '#fff' : '#000'}
//                       size={18}
//                     />
//                   </View>
//                   <Text
//                     style={[
//                       styles.loginText,
//                       {color: currentStep == 3 ? '#0063A7' : '#000'},
//                     ]}>
//                     Bank Details
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   activeOpacity={!onSave ? 1 : 0}
//                   onPress={onSave ? () => setCurrentStep(4) : null}
//                   style={[
//                     styles.loginBtn,
//                     {flexDirection: 'row', marginRight: 10},
//                     {
//                       borderColor: currentStep == 4 ? '#0063A7' : '#cbcbcb',
//                       backgroundColor: currentStep == 4 ? '#CFE1EE' : '#fff',
//                     },
//                   ]}>
//                   <View
//                     style={{
//                       backgroundColor: currentStep == 4 ? '#0063A7' : '#fff',
//                       borderRadius: 4,
//                       padding: 3,
//                       marginRight: 5,
//                     }}>
//                     <MaterialCommunityIcon
//                       name={'file-document'}
//                       color={currentStep === 4 ? '#fff' : '#000'}
//                       size={18}
//                     />
//                   </View>
//                   <Text
//                     style={[
//                       styles.loginText,
//                       {color: currentStep == 4 ? '#0063A7' : '#000'},
//                     ]}>
//                     Documents
//                   </Text>
//                 </TouchableOpacity>
//               </ScrollView>
//             </View>
//     {currentStep === 1 && (
//       <BusinessDetailsForm
//         {...props}
//         onSave={setOnSave}
//         onEnable={setOnEnable}
//       />
//     )}
//     {currentStep === 2 && (
//       <PlantsForm
//         {...props}
//         onSave={setOnSave}
//         onEnable={setOnEnable}
//       />
//     )}
//     {currentStep === 3 && (
//       <BankDetailsForm
//         {...props}
//         onSave={setOnSave}
//         onEnable={setOnEnable}
//       />
//     )}
//     {currentStep === 4 && <DocumentsForm {...props} />}
//   </View>
// </View>

// {currentStep === 1 ? (
//   <NextButton
//     title={'Next'}
//     onSubmit={handleNextStep}
//     disabled={!onSave}
//   />
// ) : currentStep === 4 ? (
//   <NextButton
//     title={'Back'}
//     onSubmit={handleBackStep}
//     disabled={!onSave}
//   />
// ) : (
//   <NextButton
//     button1={'Back'}
//     button2={'Next'}
//     fromEditProfile
//     firstButton={handleBackStep}
//     secondButton={handleNextStep}
//     disableButton2={!onSave}
//   />
// )}
//       </View>
//     </>
//   );
// };

// export default BusinessDetailsScreen;
