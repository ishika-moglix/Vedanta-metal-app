import { Dimension } from 'mog-react-native-form-fields';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

const HeaderTab = ({ headerData, onTabChange, activeTabKey }) => {
  const headerKeys = Object.keys(headerData);
  const [selectedTab, setSelectedTab] = useState(headerKeys[activeTabKey]);

  useEffect(() => {
    onTabChange(headerData[selectedTab]?.key);
  }, [selectedTab, headerData, onTabChange]);

  const handleTabPress = key => {
    setSelectedTab(key);
    onTabChange(headerData[key]?.key);
  };
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}>
      {headerKeys.map((key, index) => (
        <TouchableOpacity
          key={key}
          style={[styles.tabItem, selectedTab === key ? styles.activeTab : {}]}
          onPress={() => handleTabPress(key)}>
          <Text
            style={[
              styles.tabText,
              selectedTab === key ? styles.activeText : {},
            ]}>
            {headerData[key].name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    paddingVertical: Dimension.padding10,
  },
  tabItem: {
    paddingVertical: Dimension.padding10,
    paddingHorizontal: Dimension.padding20,
    marginHorizontal: Dimension.margin5,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#979797',
  },

  activeTab: {
    backgroundColor: '#0063A7',
    borderWidth: 1,
    borderColor: '#0063A7',
  },
  tabText: {
    fontSize: Dimension.font12,
    fontWeight: '600',
    fontFamily: Dimension.CustomBoldFont,
    color: '#333333',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HeaderTab;
