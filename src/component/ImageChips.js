import { View, Image, StyleSheet, Text } from "react-native";
import colors from "../constants/colors";
import Dimension from "../constants/dimensions";

const ImageChips = (props) => {
  const { data } = props;
  return (
    <>
      <View
        style={{
          flexWrap: "wrap",
          flexDirection: "row",
          marginTop: Dimension.responsiveValue15,
          marginLeft: Dimension.responsiveValue15,
        }}
      >
         {data.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                width: "50%",
                marginBottom: Dimension.responsiveValue25,
              }}
            >
              {item.image && (
                <Image
                  source={item.image}
                  resizeMode={"contain"}
                  style={{ width: "30%", height: Dimension.responsiveValue60 }}
                />
              )}

              <Text style={styles.text}>
                {item.regular && !item.bold && (
                  <Text style={styles.regular}>{item.regular} </Text>
                )}
                {item.bold && !item.regular && (
                  <Text style={styles.bold}>{item.bold} </Text>
                )}
                {item.regular && item.bold && (
                  <>
                    {Object.keys(item)[2] === "regular" ? (
                      <>
                        <Text style={styles.regular}>{item.regular} </Text>
                        <Text style={styles.bold}>{item.bold} </Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.bold}>{item.bold} </Text>
                        <Text style={styles.regular}>{item.regular} </Text>
                      </>
                    )}
                  </>
                )}
              </Text>
              {item.description && (
                <Text style={styles.description}>{item.description}</Text>
              )}
            </View>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: Dimension.responsiveValue14,
    color: colors.textPrimary,
  },
  regular: {
    fontSize: Dimension.font15,
    color: "#000",
    fontWeight: "400",
  },
  bold: {
    fontSize: Dimension.font15,
    color: "#000",
    fontWeight: "700",
  },
  description: {
    fontSize: Dimension.responsiveValue12,
    color: "#777",
    marginTop: Dimension.responsiveValue5,
  },
});

export default ImageChips;




