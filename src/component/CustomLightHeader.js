import colors from "../constants/colors";
import Dimension from "../constants/dimensions";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ToastAndroid,
} from "react-native";

const CustomLightHeader = (props) => {
  const { image, cardBackgroundColor, title1, title2, onClick } = props;

  const openWhatsappUrl = async () => {
    // const url = `https://wa.me/917838156656?text=I%E2%80%99m%20interested%20in%20exploring%20Credlix%E2%80%99s%20innovative%20financing%20solutions`;
    // const tenderLink = getTenderLink();
    // const fullMessage = `${tenderLink}`;
    const encodedMessage =
      "I%E2%80%99m%20interested%20in%20exploring%20Credlix%E2%80%99s%20innovative%20financing%20solutions&phone=917838156656";

    const whatsappUrls = [
      `whatsapp://send?text=${encodedMessage}`,
      `intent://send?text=${encodedMessage}#Intent;package=com.whatsapp;scheme=whatsapp;end`,
      `https://api.whatsapp.com/send?text=${encodedMessage}`,
    ];

    for (const url of whatsappUrls) {
      try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
          console.log("WhatsApp opened successfully");
          return;
        }
      } catch (error) {
        console.error(`Error trying to open WhatsApp with URL ${url}:`, error);
      }
    }
    try {
      await Linking.openURL(
        "https://play.google.com/store/apps/details?id=com.whatsapp"
      );
      ToastAndroid.show("Please install WhatsApp to share", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Failed to open Play Store:", error);
      ToastAndroid.show(
        "Unable to open WhatsApp or Play Store",
        ToastAndroid.LONG
      );
    }
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Dimension.responsiveValue15,
        backgroundColor: cardBackgroundColor,
        height: Dimension.responsiveValue60,
      }}
    >
      <TouchableOpacity onPress={onClick}>
        <Image
          source={require("../assets/img/arrow-left-line.png")}
          style={{
            width: Dimension.responsiveValue24,
            height: Dimension.responsiveValue24,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Image
        style={{
          width: Dimension.responsiveValue55,
          height: Dimension.responsiveValue40,
        }}
        resizeMode="contain"
        source={image}
      />
      <Text
        style={{
          fontWeight: "bold",
          fontSize: Dimension.font16,
          fontFamily: Dimension.CustomSemiBoldFont,
          color: colors.black,
        }}
      >
        {title1}
        {"\n"}
        {title2}
      </Text>
      <TouchableOpacity
        onPress={openWhatsappUrl}
        style={{
          marginLeft: "auto",
          paddingVertical: Dimension.responsiveValue6,
        }}
      >
        <Image
          source={require("../assets/img/Whatsapp.jpg")}
          style={{
            height: Dimension.responsiveValue40,
            width: Dimension.responsiveValue40,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CustomLightHeader;
