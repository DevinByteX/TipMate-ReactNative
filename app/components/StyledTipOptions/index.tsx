import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';
import { VerticalDevider } from '@components';

const TipPercentageCapsule = ({
  active = false,
  textValue = 5,
  onTipPress,
}: {
  active?: boolean;
  textValue: number;
  onTipPress?: (value: number) => void;
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
      ]}
      onPress={() => {
        onTipPress && onTipPress(textValue);
      }}>
      <Text
        style={[
          styles.tipPercentageCapsuleText,
          {
            color: active ? theme.colors.card : theme.colors.card_typography,
          },
        ]}>{`${textValue}%`}</Text>
    </Pressable>
  );
};

const TipPercentageCustomCapsule = ({
  active = false,
  textValue = 'custom',
  onCustomTipPress,
}: {
  active?: boolean;
  textValue: string;
  onCustomTipPress?: () => void;
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
      ]}
      onPress={() => {
        onCustomTipPress && onCustomTipPress();
      }}>
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

export const StyledTipOptions = ({
  onSelectedTipValue,
}: {
  onSelectedTipValue?: (value: number) => void;
}) => {
  const defaultTipValue = 5;

  const [tipPercentageValue, setTipPercentageValue] =
    useState<number>(defaultTipValue);

  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`SELECT TIP`}</Text>
      <View style={styles.mainInnerContainer}>
        <View style={styles.tipPercentageCapsuleContainer}>
          <View style={styles.capsuleRowContainer}>
            <TipPercentageCapsule
              textValue={5}
              onTipPress={value => {
                setTipPercentageValue(value);
                onSelectedTipValue && onSelectedTipValue(value);
              }}
              active={tipPercentageValue == 5}
            />
            <TipPercentageCapsule
              textValue={10}
              onTipPress={value => {
                setTipPercentageValue(value);
                onSelectedTipValue && onSelectedTipValue(value);
              }}
              active={tipPercentageValue == 10}
            />
          </View>
          <View style={styles.capsuleRowContainer}>
            <TipPercentageCapsule
              textValue={15}
              onTipPress={value => {
                setTipPercentageValue(value);
                onSelectedTipValue && onSelectedTipValue(value);
              }}
              active={tipPercentageValue == 15}
            />
            <TipPercentageCapsule
              textValue={20}
              onTipPress={value => {
                setTipPercentageValue(value);
                onSelectedTipValue && onSelectedTipValue(value);
              }}
              active={tipPercentageValue == 20}
            />
          </View>
        </View>
        <VerticalDevider />
        <View style={styles.tipPercentageAmountsContainer}>
          <Text
            style={styles.tipDigitsStyles}
            adjustsFontSizeToFit={true}
            allowFontScaling={false}
            numberOfLines={1}>
            {`${tipPercentageValue}%`}
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
