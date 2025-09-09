import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
// import LottieView from 'lottie-react-native';
// import CONST_URL, {STATE_STATUS} from '../../redux/constants/index';
import Dimension from '../Theme/Dimension'
import colors from '../Theme/Colors';
const CustomLoader = ({
    message,
    fullScreen = false,

}) => {

    const LoaderContent = () => (
        <View
            style={[
                styles.loaderContainer,
            ]}>

            <ActivityIndicator
                color={'#0064A8'}
                size={'large'}
            />
        </View>
    );
    if (fullScreen) {
        return (
            <View
                style={[
                    styles.fullScreenContainer,
                    {

                        backgroundColor:
                            'rgba(64, 64, 64, 0.6)',
                        zIndex: 99999999999,
                    },
                ]}>
                <LoaderContent />
            </View>
        );
    }
    return <LoaderContent />;
};
const styles = StyleSheet.create({
    fullScreenContainer: {
        position: 'absolute',
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    message: {
        fontSize: Dimension.font16,
        color: '#6F6F6F',
        marginBottom: 20,
        fontWeight: '400',
        textAlign: 'center',
        lineHeight: Dimension.padding25,
        maxWidth: '80%',
        fontFamily: Dimension.CustomRegularFont,
    },
    lottie: {
        width: Dimensions.get('window').width * 0.15,
        height: Dimensions.get('window').width * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default CustomLoader;
