import React from 'react';
import { View, Text } from 'react-native';
// custom component
import { StyledHeader, StyledTextInput } from '@/components';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';

const HomeTipScreen = () => {
  const { styles } = useStyles(stylesheet);
  return (
    <>
      <StyledHeader />
      <View style={styles.mainContainer}>
        {/* Total Amount container */}
        <View style={styles.totalAmountContainer}>
          <Text style={styles.titleText}>TOTAL AMOUNT</Text>
          <StyledTextInput
            placeholderText={'Tap to Enter Your Bill Amount'}
            returnKeyType={'done'}
            keyboardType={'numeric'}
          />
        </View>
      </View>
    </>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  totalAmountContainer: {
    width: '100%',
    backgroundColor: '#444444',
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 3) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  titleText: {
    color: colors.primary_accent,
    fontSize: 14,
    fontWeight: '800',
  },
}));

export default HomeTipScreen;
