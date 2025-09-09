import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Button,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Dimension from '../Theme/Dimension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from '../services/constant';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import {
  getSearchPlantRequest,
  getCreditBalanceRequest,
  getLCBGBalanceRequest,
  setCartCount,
} from '../redux/feature/homeSlice';
import { STATE_STATUS } from '../redux/constants';
import { setBranchAccess } from '../redux/feature/branchSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { logAddPaymentInfo } from '@react-native-firebase/analytics';
const ListShow = props => {
  const dispatch = useDispatch();
  const authData = useSelector(state => state.auth?.data);
  const walletData = useSelector(state => state?.wallet?.wallet?.data) || [];
  const plantData =
    useSelector(state => state?.searchPlants?.searchPlants) || [];

  const itemsWithPlantCode = props?.data?.filter(item => item?.plantCode) || [];
  const lastItemWithPlantCode =
    itemsWithPlantCode[itemsWithPlantCode?.length - 1];
  //console.log('..', itemsWithPlantCode, props);

  const [selectedId, setSelectedId] = useState();
  const [prvsId, setPrvsId] = useState();
  const [plantCode, setPlantCode] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [lcbgBalance, setLCBGBalance] = useState({});
  useEffect(() => {
    loading();
  }, []);

  const addToCartCount = async (obj) => {
    try {
      const CartCount = await ScannerService.cartCount({ userId: authData?.userId || authData?.idUser })
      console.log("Cart Count is ", CartCount, CartCount?.result?.itemCount);
      if (CartCount?.data?.message) {
        dispatch(setCartCount({
          status: STATE_STATUS.FETCHED,
          count: CartCount?.data.result?.itemCount
        }))
        // await AsyncStorage.setItem('@cartCount', JSON.stringify({ cartCount: CartCount?.result?.itemCount }))
      }
    } catch (err) {
      console.log("Error", err);
    }
  }

  const getSearchPlantData = async obj => {
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let plantId = JSON.parse(getPlantId);
    const sessionData = await AsyncStorage.getItem('@get_session');
    const getPlantCode = await AsyncStorage.getItem('@plantCode');
    let plantCode = JSON.parse(getPlantCode);
    let jsonSessionData = JSON.parse(sessionData);


    dispatch(getSearchPlantRequest({ searchString: '' }));
    dispatch(
      getCreditBalanceRequest({
        plantId: plantId?.plantId,
        businessUnit: authData?.businessUnit,
        companyId: jsonSessionData?.companyId,
      }),
    );
    (authData?.businessUnit === 'Copper' ||
      authData?.businessUnit === 'Zinc') &&
      dispatch(
        getLCBGBalanceRequest({
          customerCode: plantCode?.plantCode,
          companyId: jsonSessionData?.companyId,
          businessUnit: authData?.businessUnit,
        }),
      );
    // getLCBGBalance();
  };

  useEffect(() => {
    if (selectedId && prvsId !== selectedId) {
      if (
        props?.currentScreen != 'MoreSc' &&
        props?.currentScreen != 'Procurement' &&
        props?.currentScreen != 'Cart'
      ) {
        // addToCartCount();
        getSearchPlantData();
        sendToWebView(selectedId);
      } else {
        // addToCartCount();
        getSearchPlantData();
        props?.onClose();
      }
      setPrvsId(selectedId);
    }
  }, [selectedId]);

  const loading = async () => {
    const userInfo = await AsyncStorage.getItem('@user_info');
    const getPlantId = await AsyncStorage.getItem('@plantId');
    let plantId = JSON.parse(getPlantId);
    if (plantId) {
      setPrvsId(plantId?.plantId);
      setSelectedId(plantId?.plantId);
    }
  };

  const sendToWebView = async selectedId => {
    const userInfo = await AsyncStorage.getItem('@user_info');
    const finalUrl = await AsyncStorage.getItem('@final_Url');
    console.log("final url is here", finalUrl);

    if (userInfo && selectedId) {
      const info = JSON.parse(userInfo);
      // const final_url = JSON.parse(finalUrl);
      // const exp_url =
      //   CONSTANTS.WEBURL.TAB_WEB +
      //   'vcatalog/all-products?token=' +
      //   info.token +
      //   '&plantId=' +
      //   selectedId;
      const updatedUrl = finalUrl.replace(/(plantId=)(\d+)/, `$1${selectedId}`);
      console.log(updatedUrl, "url ooo");

      props?.props?.navigation.replace('WebView', {
        URL: updatedUrl,
        // fromExp: 'exploreText',
        showBack: updatedUrl.includes('/pages/vcatalog/all-products') ? false : true,
      });
    }
  };
  const getLCBGBalance = async () => {
    try {
      const getPlantCode = await AsyncStorage.getItem('@plantCode');
      let plantCode = JSON.parse(getPlantCode);
      const getPlantId = await AsyncStorage.getItem('@plantId');
      let plantId = JSON.parse(getPlantId);
      const sessionData = await AsyncStorage.getItem('@get_session');
      let jsonSessionData = JSON.parse(sessionData);
      const dataObj = {
        customerCode: plantCode?.plantCode,
        idcompany: jsonSessionData?.companyId,
        businessUnit: authData?.businessUnit,
      };
      const data = await ScannerService.getLCBGreditBalance(dataObj);
      setLCBGBalance(data?.data);
    } catch (err) {
      //console.log('error', err);
    }
  };

  const handleSelectPlant = (newPlantId, plantCode) => {
    setSelectedId(newPlantId);
    // setPlantCode(plantCode);
    AsyncStorage.setItem('@plantId', JSON.stringify({ plantId: newPlantId }));
    AsyncStorage.setItem('@plantCode', JSON.stringify({ plantCode: plantCode }));
    // props?.onClose();
  };
  console.log("Plant data", props?.data);
  const renderItem = ({ item, index }) => {
    return (
      <>
        {item?.plantCode && (
          <View style={styles.item}>
            <TouchableOpacity
              onPress={() => handleSelectPlant(item.plantId, item.plantCode)}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor:
                        selectedId === item.plantId ? '#0063A7' : '#363636',
                    },
                  ]}>
                  {selectedId === item.plantId && (
                    <View style={styles.selectedCircle} />
                  )}
                </View>
                <View
                  style={{
                    paddingHorizontal: Dimension.padding25,
                    width: '95%',
                  }}>
                  <Text style={styles.text}>
                    {item?.plantCode?.length > 6
                      ? `${item.plantCode.slice(4)} - ${item.plantName}, ${item.city}`
                      : `${item?.plantCode} - ${item.plantName}, ${item.city}`}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            {item !== lastItemWithPlantCode && (
              <View style={styles.separator} />
            )}
          </View>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={plantData?.data?.plants || []}
        renderItem={renderItem}
        keyExtractor={item => item.plantId.toString()}
        contentContainerStyle={ {paddingBottom: Dimension.padding100 }}
        ListFooterComponent={() => {
          return plantData?.status === STATE_STATUS?.FETCHING ? (
            <ActivityIndicator size={22} color={'#000'} />
          ) : null;
        }}
        ListEmptyComponent={() =>
          plantData?.status === STATE_STATUS?.FETCHED ? (
            <Text
              style={{
                textAlign: 'center',
                padding: Dimension.padding50,
                fontSize: Dimension.font22,
                fontFamily: Dimension.CustomBlackFont,
                color: '#c7c7c7',
              }}>
              NO PLANT AVAILABLE
            </Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingVertical: Dimension.padding20,
    paddingBottom: Platform.OS === 'ios' ? Dimension.padding50 : 0
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Dimension.margin15,
    paddingLeft: Dimension.padding20,
  },
  radioButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  radioCircle: {
    width: Dimension.width18,
    height: Dimension.height18,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: '#0063A7',
  },
  text: {
    fontSize: Dimension.font14,
    color: '#363636',
    fontFamily: Dimension.CustomRegularFont,
    // paddingLeft: Dimension.padding25,
    // width: '95%'
  },
  separator: {
    height: 1,
    backgroundColor: '#EFEFEF',
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: Dimension.padding10,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    textAlign: 'center',
    width: '95%',
    maxHeight: '100%', 
    // paddingBottom: Dimension.padding20,
  },

  separator: {
    height: 1,
    backgroundColor: '#EFEFEF',
    width: '100%',
  },
  option: {
    fontSize: Dimension.font14,
    color: '#363636',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingBottom: Dimension.padding20,
  },
  option2: {
    color: '#363636',
    textAlign: 'left',
    fontSize: Dimension.font12,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: Dimension.font14,
    color: '#363636',
    fontWeight: 'bold',
    marginVertical: Dimension.margin20,

    textAlign: 'center',
  },
  modalOverlay2: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent2: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Dimension.padding20,
    textAlign: 'center',
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Dimension.padding10,
    marginLeft: Dimension.margin10,
    paddingBottom: 0,
  },
  box2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default ListShow;
