import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
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
          backgroundColor: active ? theme.colors.accent : theme.colors.backgroundColor,
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
          backgroundColor: active ? theme.colors.accent : theme.colors.backgroundColor,
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

  const [tipPercentageValue, setTipPercentageValue] = useState<number>(defaultTipValue);

  const [customSliderVisible, setCustomSliderVisible] = useState<boolean>(false);

  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`SELECT TIP`}</Text>
      <View>
        <VerticalDevider
          verticalDeviderAdditionalStyles={{
            position: 'absolute',
            alignSelf: 'center',
          }}
        />
        <View style={styles.mainInnerContainer}>
          {/* First Row */}
          <View style={styles.mainRowContainerStyles}>
            <View style={styles.fistColumnContainerStyles}>
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
            </View>
            <View style={styles.secondColumnContainerStyles}>
              <Text
                style={styles.tipDigitsStyles}
                adjustsFontSizeToFit={true}
                allowFontScaling={false}
                numberOfLines={1}>
                {`${tipPercentageValue}%`}
              </Text>
            </View>
          </View>
          {/* Second Row */}
          <View style={styles.mainRowContainerStyles}>
            <View style={styles.fistColumnContainerStyles}>
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
            <View style={styles.secondColumnContainerStyles}>
              <TipPercentageCustomCapsule
                textValue={customSliderVisible ? `Set Value` : `Custom`}
                active
                onCustomTipPress={() => {
                  setCustomSliderVisible(!customSliderVisible);
                }}
              />
            </View>
          </View>
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
    color: colors.accent,
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  mainInnerContainer: {
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
    rowGap: (UnistylesRuntime.screen.height * 1) / 100,
  },
  mainRowContainerStyles: {
    flex: 1,
    flexDirection: 'row',
    height: (UnistylesRuntime.screen.height * 4) / 100,
  },
  fistColumnContainerStyles: {
    flex: 1,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: (UnistylesRuntime.screen.width * 2) / 100,
  },
  secondColumnContainerStyles: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  tipPercentageCapsule: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  tipPercentageCapsuleCustom: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  tipDigitsStyles: {
    fontSize: 40,
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
