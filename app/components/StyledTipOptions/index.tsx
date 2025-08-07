import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { StyledHorizontalSlider, StyledIcons, VerticalDevider } from '@components';
import { useAppContext } from '@/context/AppContext';

const TipPercentageCapsule = ({
  active = false,
  textValue = 5,
  onTipPress,
}: {
  active?: boolean;
  textValue: number;
  onTipPress?: (value: number) => void;
}) => {
  const { theme } = useUnistyles();

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
      }}
    >
      <Text
        style={[
          styles.tipPercentageCapsuleText,
          {
            color: active ? theme.colors.card : theme.colors.card_typography,
          },
        ]}
      >{`${textValue}%`}</Text>
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
  const { theme } = useUnistyles();
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
      }}
    >
      <Text
        style={[
          styles.tipPercentageCapsuleCustomText,
          {
            color: active ? theme.colors.card : theme.colors.card_typography,
          },
        ]}
      >
        {`${textValue} `}
        <StyledIcons
          type={'FontAwesome5'}
          name={'sliders-h'}
          size={styles.tipPercentageCapsuleCustomText?.fontSize}
        />
      </Text>
    </Pressable>
  );
};

export const StyledTipOptions = ({
  titleText = 'SELECT TIP',
  description,
  onSelectedTipValue,
}: {
  titleText?: string;
  description?: string;
  onSelectedTipValue?: (value: number) => void;
}) => {
  const { state } = useAppContext();

  const defaultTipValue = 5;

  const [tipPercentageValue, setTipPercentageValue] = useState<number>(defaultTipValue);
  const [customSliderVisible, setCustomSliderVisible] = useState<boolean>(false);

  const { theme } = useUnistyles();

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`${titleText}`}</Text>
      <Text style={styles.instructionText}>
        <StyledIcons
          type={'FontAwesome5'}
          name={'info-circle'}
          size={styles.instructionText?.fontSize}
        />
        {` ${description}`}
      </Text>
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
              {state.tips.slice(0, 2).map(({ place, value }) => (
                <TipPercentageCapsule
                  key={place}
                  textValue={value}
                  onTipPress={value => {
                    setCustomSliderVisible(false);
                    setTipPercentageValue(value);
                    onSelectedTipValue && onSelectedTipValue(value);
                  }}
                  active={tipPercentageValue === value}
                />
              ))}
            </View>
            <View style={styles.secondColumnContainerStyles}>
              <Text
                style={[
                  styles.tipDigitsStyles,
                  {
                    color:
                      tipPercentageValue == 0
                        ? theme.utils.hexToRGBA(styles.tipDigitsStyles.color, 0.5)
                        : styles.tipDigitsStyles.color,
                  },
                ]}
                adjustsFontSizeToFit={true}
                allowFontScaling={false}
                numberOfLines={1}
              >
                {`${tipPercentageValue}%`}
              </Text>
            </View>
          </View>
          {/* Second Row */}
          <View style={styles.mainRowContainerStyles}>
            <View style={styles.fistColumnContainerStyles}>
              {state.tips.slice(2).map(({ place, value }) => (
                <TipPercentageCapsule
                  key={place}
                  textValue={value}
                  onTipPress={value => {
                    setCustomSliderVisible(false);
                    setTipPercentageValue(value);
                    onSelectedTipValue && onSelectedTipValue(value);
                  }}
                  active={tipPercentageValue === value}
                />
              ))}
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
            step={state.tipSliderConfig.step}
            minValue={state.tipSliderConfig.min}
            maxValue={state.tipSliderConfig.max}
            onValueChange={value => {
              setTipPercentageValue(value[0]);
              onSelectedTipValue && onSelectedTipValue(value[0]);
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create(({ colors, fonts }, runtime) => ({
  mainContainer: {
    marginTop: (runtime.screen.height * 2) / 100,
    width: '100%',
    backgroundColor: colors.card,
    paddingVertical: (runtime.screen.height * 2) / 100,
    borderRadius: (runtime.screen.height * 1) / 100,
  },
  titleText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
    marginHorizontal: (runtime.screen.width * 5) / 100,
  },
  instructionText: {
    fontSize: 10,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginVertical: (runtime.screen.height * 0.5) / 100,
    marginHorizontal: (runtime.screen.width * 5) / 100,
  },
  mainInnerContainer: {
    paddingVertical: (runtime.screen.height * 1) / 100,
    rowGap: (runtime.screen.height * 1) / 100,
  },
  mainRowContainerStyles: {
    flex: 1,
    flexDirection: 'row',
    height: (runtime.screen.height * 4) / 100,
  },
  fistColumnContainerStyles: {
    flex: 1,
    paddingHorizontal: (runtime.screen.width * 5) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: (runtime.screen.width * 2) / 100,
  },
  secondColumnContainerStyles: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: (runtime.screen.width * 5) / 100,
  },
  tipPercentageCapsule: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: (runtime.screen.height * 1) / 100,
  },
  tipPercentageCapsuleCustom: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: (runtime.screen.height * 1) / 100,
  },
  tipDigitsStyles: {
    fontSize: 24,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
    alignSelf: 'center',
  },
  tipPercentageCapsuleText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.accent,
  },
  tipPercentageCapsuleCustomText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
  },
  sliderContainer: {
    marginTop: (runtime.screen.height * 1) / 100,
  },
}));
