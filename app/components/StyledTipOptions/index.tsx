import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';
import { StyledHorizontalSlider, VerticalDevider } from '@components';

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
      <View>
        <Text
          style={[
            styles.tipPercentageCapsuleText,
            {
              color: active ? theme.colors.card : theme.colors.card_typography,
            },
          ]}>{`${textValue}%`}</Text>
      </View>
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
      <View>
        <Text
          style={[
            styles.tipPercentageCapsuleCustomText,
            {
              color: active ? theme.colors.card : theme.colors.card_typography,
            },
          ]}>{`${textValue}`}</Text>
      </View>
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

  const [customSliderVisible, setCustomSliderVisible] =
    useState<boolean>(false);

  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`SELECT TIP`}</Text>
      <View style={styles.mainInnerContainer}>
        <View style={styles.tipPercentageCapsuleContainer}>
          <TipPercentageCapsule
            textValue={5}
            onTipPress={value => {
              setCustomSliderVisible(false);
              setTipPercentageValue(value);
              onSelectedTipValue && onSelectedTipValue(value);
            }}
            active={tipPercentageValue == 5}
          />
          <TipPercentageCapsule
            textValue={10}
            onTipPress={value => {
              setCustomSliderVisible(false);
              setTipPercentageValue(value);
              onSelectedTipValue && onSelectedTipValue(value);
            }}
            active={tipPercentageValue == 10}
          />
          <TipPercentageCapsule
            textValue={15}
            onTipPress={value => {
              setCustomSliderVisible(false);
              setTipPercentageValue(value);
              onSelectedTipValue && onSelectedTipValue(value);
            }}
            active={tipPercentageValue == 15}
          />
          <TipPercentageCapsule
            textValue={20}
            onTipPress={value => {
              setCustomSliderVisible(false);
              setTipPercentageValue(value);
              onSelectedTipValue && onSelectedTipValue(value);
            }}
            active={tipPercentageValue == 20}
          />
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
          <TipPercentageCustomCapsule
            textValue={customSliderVisible ? `Set Value` : `Custom`}
            active
            onCustomTipPress={() => {
              setCustomSliderVisible(!customSliderVisible);
            }}
          />
        </View>
      </View>
      {customSliderVisible ? (
        <View style={styles.sliderContainer}>
          <StyledHorizontalSlider
            sliderValue={tipPercentageValue}
            onValuesChange={value => {
              setTipPercentageValue(value[0]);
              onSelectedTipValue && onSelectedTipValue(value[0]);
            }}
          />
        </View>
      ) : null}
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
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  tipPercentageCapsuleContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: (UnistylesRuntime.screen.height * 10) / 100,
    alignItems: 'center',
    alignContent: 'space-around',
    columnGap: (UnistylesRuntime.screen.width * 2) / 100,
  },
  tipPercentageAmountsContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'space-around',
  },
  capsuleRowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipPercentageCapsule: {
    justifyContent: 'center',
    alignItems: 'center',
    width: (UnistylesRuntime.screen.width * 18) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
  },
  tipPercentageCapsuleCustom: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 2) / 100,
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
  sliderContainer: {
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
  },
}));
