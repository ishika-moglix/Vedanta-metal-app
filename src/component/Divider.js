import React from "react";
import { View } from "react-native";
import Dimension from "../Theme/Dimension";
const Divider = () => {
  return (
    <View
      style={{
        marginTop: Dimension.responsiveValue10,
        borderWidth: 0.5,
        borderColor: "#cbcbcb",
        width: "100%",
        alignSelf: "center",
      }}
    ></View>
  );
};

export default Divider;