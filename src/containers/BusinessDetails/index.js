import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Divider from '../../component/Divider';
import BusinessDetailsForm from '../../component/BusinessDetails';
import BankDetailsForm from '../../component/BankDetailsForm';
import DocumentsForm from '../../component/DocumentsForm';
import PlantsForm from '../../component/Plants';
import NextButton from '../../component/Button';

import styles from '../BusinessDetails/style';
import CustomLoader from '../../component/customLoader';
const BusinessDetailsScreen = props => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onSave, setOnSave] = useState(false);
  const [onEnable, setOnEnable] = useState('');
  const [maxStep, setMaxStep] = useState(1);
  const [loader, setLoader] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef?.current) {
      const scrollX = (currentStep - 1) * 100;
      scrollViewRef?.current?.scrollTo({ x: scrollX, animated: true });
    }
  }, [currentStep]);

  useEffect(() => {
    setMaxStep(prevStep => Math.max(prevStep, onEnable));
  }, [onEnable]);

  const handleNextStep = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };
  const handleBackStep = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };

  const handleProfileProgress = () => {
    let percentage = '';

    if (currentStep === 1) {
      percentage = '0';
    } else if (currentStep === 2) {
      percentage = '25';
    } else if (currentStep === 3) {
      percentage = '50';
    } else {
      percentage = '75';
    }

    return (
      <View style={styles.outerView}>
        <View>
          <View style={styles.row}>
            <Text style={[styles.headingTxt]}>Profile Completion</Text>
            <View style={styles.progBarView}>
              <View
                style={[
                  styles.insideProgView,
                  {
                    width: `${percentage}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.percentText}>{percentage}%</Text>
          </View>
        </View>
      </View>
    );
  };
  const steps = [
    { id: 1, label: 'Business Details', icon: 'briefcase' },
    { id: 2, label: 'Plants', icon: 'map-marker-radius' },
    { id: 3, label: 'Bank Details', icon: 'bank' },
    { id: 4, label: 'Documents', icon: 'file-document' },
  ];

  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessDetailsForm
            {...props}
            onSave={setOnSave}
            onEnable={setOnEnable}
            loader={setLoader}
          />
        );
      case 2:
        return (
          <PlantsForm {...props} onSave={setOnSave} onEnable={setOnEnable} loader={setLoader} />
        );
      case 3:
        return (
          <BankDetailsForm
            {...props}
            onSave={setOnSave}
            onEnable={setOnEnable}
            loader={setLoader}
          />
        );
      case 4:
        return <DocumentsForm {...props} loader={setLoader} />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {loader && (
        <CustomLoader fullScreen />
      )}
      {/* <StatusBar
        translucent
        backgroundColor="#F0F7FF"
        barStyle={'dark-content'}
      /> */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == 'android' ? 'margin' : 'position'}>
        <Image
          style={styles.Logo}
          source={require('../../assets/images/logo.png')}
          resizeMode="contain"></Image>

        <View
          style={{
            backgroundColor: '#fff',
            alignContent: 'center',
            borderRadius: 5,
            borderColor: '#EBEBEB',
            borderWidth: 1,
            // paddingBottom: 100,
            paddingTop: 10,
            paddingHorizontal: 15,
            height: '90%',
          }}>
          <View>
            {handleProfileProgress()}
            <Divider />
          </View>
          <View>
            <ScrollView
              horizontal={true}
              ref={scrollViewRef}
              // showsHorizontalScrollIndicator={true}
              contentContainerStyle={{
                flexDirection: 'row',
                paddingVertical: 10,
              }}>
              {steps.map(step => (
                <TouchableOpacity
                  key={step.id}
                  activeOpacity={maxStep >= step.id ? 0.5 : 1}
                  onPress={
                    maxStep >= step.id
                      ? () => {
                        setCurrentStep(step.id);
                      }
                      : null
                  }
                  style={[
                    styles.loginBtn,
                    {
                      borderColor:
                        currentStep === step.id ? '#0063A7' : '#cbcbcb',
                      backgroundColor:
                        currentStep === step.id ? '#CFE1EE' : '#fff',
                      opacity: maxStep >= step.id ? 1 : 1,
                    },
                  ]}>
                  <View
                    style={{
                      backgroundColor:
                        currentStep === step.id ? '#0063A7' : '#fff',
                      borderRadius: 4,
                      padding: 3,
                      marginRight: 5,
                    }}>
                    {step.id === 2 || step.id === 3 || step.id === 4 ? (
                      <MaterialCommunityIcon
                        name={step.icon}
                        color={currentStep === step.id ? '#fff' : '#000'}
                        size={18}
                      />
                    ) : (
                      <Feather
                        name={step.icon}
                        color={currentStep === step.id ? '#fff' : '#000'}
                        size={18}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      color: currentStep === step.id ? '#0063A7' : '#000',
                    }}>
                    {step.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {renderForm()}
        </View>
      </KeyboardAvoidingView>

      {currentStep === 1 ? (
        <NextButton
          title={'Next'}
          onSubmit={handleNextStep}
          disabled={!onSave}
        />
      ) : currentStep === 4 ? (
        <NextButton
          title={'Back'}
          onSubmit={handleBackStep}
          disabled={!onSave}
        />
      ) : (
        <NextButton
          button1={'Back'}
          button2={'Next'}
          fromEditProfile
          firstButton={handleBackStep}
          secondButton={handleNextStep}
          disableButton2={!onSave}
        />
      )}
    </View>
  );
};

// const styles = StyleSheet.create({
// container: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   padding: 10,
// },
// loginBtn: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   padding: 10,
//   borderWidth: 1,
//   borderRadius: 8,
// },
// });

export default BusinessDetailsScreen;
