import React from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import Dimension from "../constants/dimensions";
import colors from "../constants/colors";

const IconChips = (props) => {
  const { isMultiple, data, image, onClick, title, cols } = props;

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={isMultiple ? item.onClick : onClick}
        style={{
          alignItems: "center",
          //   justifyContent: "center",
          width: cols == 4 ? "25%" : "33%",
          marginBottom: Dimension.responsiveValue16,
        }}
      >
        <Image
          source={item.image}
          resizeMode={"contain"}
          style={{
            width: "48%",
            height:
              cols == 4
                ? Dimension.responsiveValue36
                : Dimension.responsiveValue50,
          }}
        />
        <Text
          style={{
            fontSize:
              cols == 4
                ? Dimension.responsiveValue11
                : Dimension.responsiveValue14,
            fontFamily: Dimension.CustomMediumFont,
            marginTop: Dimension.responsiveValue4,
            width: "80%",
            color: colors.black,
            textAlign: "center",
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isMultiple) {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: cols == 4 ? "flex-start" : "space-between",
        }}
      >
        {data.map((_, index) =>
          renderItem({
            item: {
              image: _.image,
              onClick: _.onClick,
              title: _.title,
            },
            index,
          })
        )}
      </View>
    );
  } else {
    return renderItem({
      item: {
        image,
        onClick,
        title,
      },
    });
  }
};

export default IconChips;
