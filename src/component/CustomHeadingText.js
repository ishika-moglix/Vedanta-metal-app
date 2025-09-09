import { View, Text, StyleSheet } from "react-native";
import Dimension from "../Theme/Dimension";
import colors from "../Theme/Colors";

const CustomHeadingText = (props) => {
  const {
    title,
    isCenterAligned,
    customViewStyle,
    hasHorizontalMargin,
    customTextStyle,
    bold = false,
    semiBold = false,
    medium = false,
    fontSize = "regular",
    textColor = colors.black,
  } = props;
  const fontSizes = {
    h1: Dimension.font22,
    h2: Dimension.font20,
    h3: Dimension.font18,
    h4: Dimension.font16,
    regular: Dimension.font14,
    small: Dimension.font12,
  };
  return (
    <View
      style={[
        {
          // flex: 1,
          marginHorizontal: hasHorizontalMargin ? Dimension.responsiveValue15 : 0,
        },
        customViewStyle,
      ]}
    >
      <Text
        style={[
          {
            fontSize: fontSizes?.[fontSize],
            fontFamily: bold
              ? Dimension.CustomBoldFont
              : semiBold
              ? Dimension.CustomSemiBoldFont
              : medium
              ? Dimension.CustomMediumFont
              : Dimension.CustomRegularFont,
            textAlign: isCenterAligned ? "center" : "left",
            color: textColor,
          },
          customTextStyle,
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

export default CustomHeadingText;
