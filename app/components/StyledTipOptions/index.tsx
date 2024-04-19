import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';
import { VerticalDevider } from '@components';

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
            : theme.colors.backgroundColor,
        },
      ]}>
      <Text
        style={[
          styles.tipPercentageCapsuleText,
          {
            color: active ? theme.colors.card : theme.colors.card_typography,
          },
        ]}>{`${textValue}`}</Text>
    </Pressable>
  );
};

const TipPercentageCustomCapsule = ({
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
        styles.tipPercentageCapsuleCustom,
        {
          backgroundColor: active
            ? theme.colors.accent
            : theme.colors.backgroundColor,
        },
      ]}>
      <Text
        style={[
          styles.tipPercentageCapsuleCustomText,
          {
            color: active ? theme.colors.card : theme.colors.card_typography,
          },
        ]}>{`${textValue}`}</Text>
    </Pressable>
  );
};

export const StyledTipOptions = () => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`SELECT TIP `}</Text>
      <View style={styles.mainInnerContainer}>
        <View style={styles.tipPercentageCapsuleContainer}>
          <View style={styles.capsuleRowContainer}>
            <TipPercentageCapsule textValue="5%" />
            <TipPercentageCapsule textValue="10%" />
          </View>
          <View style={styles.capsuleRowContainer}>
            <TipPercentageCapsule textValue="15%" />
            <TipPercentageCapsule textValue="20%" />
          </View>
        </View>
        <VerticalDevider />
        <View style={styles.tipPercentageAmountsContainer}>
          <Text
            style={styles.tipDigitsStyles}
            adjustsFontSizeToFit={true}
            allowFontScaling={false}
            numberOfLines={1}>
            {`18%`}
          </Text>
          <TipPercentageCustomCapsule textValue={`Custom`} active />
        </View>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  mainContainer: {
    marginTop: (UnistylesRuntime.screen.height * 2) / 100,
    width: '100%',
    backgroundColor: colors.card,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  titleText: {
    color: colors.primary_accent,
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  mainInnerContainer: {
    flexDirection: 'row',
    minHeight: (UnistylesRuntime.screen.height * 12) / 100,
  },
  tipPercentageCapsuleContainer: {
    flex: 1,
    minHeight: (UnistylesRuntime.screen.height * 8) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingTop: (UnistylesRuntime.screen.height * 1) / 100,
    paddingBottom: (UnistylesRuntime.screen.height * 1.25) / 100,
    justifyContent: 'space-between',
  },
  tipPercentageAmountsContainer: {
    flex: 1,
    minHeight: (UnistylesRuntime.screen.height * 8) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingTop: (UnistylesRuntime.screen.height * 1) / 100,
    paddingBottom: (UnistylesRuntime.screen.height * 1.25) / 100,
    justifyContent: 'space-between',
  },
  capsuleRowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
  },
  tipPercentageCapsule: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    marginTop: (UnistylesRuntime.screen.height * 0.75) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 1) / 100,
  },
  tipPercentageCapsuleCustom: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
  },
  tipDigitsStyles: {
    fontSize: 40,
    lineHeight: 40,
    fontWeight: '800',
    color: colors.card_typography,
    alignSelf: 'center',
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
