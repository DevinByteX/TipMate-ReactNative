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
    width: '100%',
    minHeight: (UnistylesRuntime.screen.height * 10.5) / 100,
  },
  tipPercentageCapsuleContainer: {
    flex: 1,
    justifyContent: 'space-between',
    minheight: (UnistylesRuntime.screen.height * 16) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  capsuleRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipPercentageAmountsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    minheight: (UnistylesRuntime.screen.height * 16) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1.5) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  tipPercentageCapsule: {
    justifyContent: 'center',
    alignItems: 'center',
    width: (UnistylesRuntime.screen.width * 16) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
  },
  tipPercentageCapsuleText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.accent,
  },
  tipDigitsStyles: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.card_typography,
    alignSelf: 'center',
  },
  tipPercentageCapsuleCustom: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
  },
  tipPercentageCapsuleCustomText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.card_typography,
  },
}));
