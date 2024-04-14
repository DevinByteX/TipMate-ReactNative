import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';

const TipPercentageCapsule = ({
  active = false,
  textValue = '10%',
}: {
  active?: boolean;
  textValue: string;
}) => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <Pressable
      style={[
        styles.tipPercentageCapsule,
        {
          backgroundColor: active
            ? theme.colors.accent
            : theme.colors.card,
        },
      ]}>
      <Text style={[styles.tipPercentageCapsuleText,        {
          color: active
            ? theme.colors.card
            : theme.colors.card_typography,
        }]}>{`${textValue}`}</Text>
    </Pressable>
  );
};

export const StyledTipOptions = () => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={styles.mainContainer}>
      <View style={styles.tipPercentageCapsuleContainer}>
        <TipPercentageCapsule textValue="5%" />
        <TipPercentageCapsule textValue="10%" active/>
        <TipPercentageCapsule textValue="15%" />
        <TipPercentageCapsule textValue="20%" />
      </View>
      <Pressable style={styles.tipPercentageCapsuleCustom}>
        <Text
          style={styles.tipPercentageCapsuleCustomText}>{`${'Custom'}`}</Text>
      </Pressable>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  mainContainer: {
    width: '100%',
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  tipPercentageCapsuleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipPercentageCapsule: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1.5) / 100,
  },
  tipPercentageCapsuleCustom: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginTop: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1.5) / 100,
  },
  tipPercentageCapsuleText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.accent,
  },
  tipPercentageCapsuleCustomText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.card_typography,
  },
}));
