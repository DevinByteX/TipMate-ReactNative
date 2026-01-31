import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
import { StyledHorizontalSlider, StyledIcons, VerticalDevider } from '@components';
import { useAppContext } from '@/context/AppContext';

const SplitCapsule = ({
  active = false,
  textValue = 5,
  onSplitPress,
}: {
  active?: boolean;
  textValue: number;
  onSplitPress?: (value: number) => void;
}) => {
  const { theme } = useUnistyles();
  return (
    <Pressable
      style={[
        styles.splitCapsule,
        {
          backgroundColor: active ? theme.colors.accent : theme.colors.backgroundColor,
        },
      ]}
      onPress={() => {
        onSplitPress && onSplitPress(textValue);
      }}
    >
      <Text
        style={[
          styles.splitCapsuleText,
          {
            color: active ? theme.colors.card : theme.colors.card_typography,
          },
        ]}
      >{`${textValue}`}</Text>
    </Pressable>
  );
};

const SplitCustomCapsule = ({
  active = false,
  textValue = 'custom',
  onCustomSplitPress,
}: {
  active?: boolean;
  textValue: string;
  onCustomSplitPress?: () => void;
}) => {
  const { theme } = useUnistyles();
  const TextColor = active ? theme.colors.card : theme.colors.card_typography;
  return (
    <Pressable
      style={[
        styles.splitCapsuleCustom,
        {
          backgroundColor: active ? theme.colors.accent : theme.colors.backgroundColor,
        },
      ]}
      onPress={() => {
        onCustomSplitPress && onCustomSplitPress();
      }}
    >
      <Text
        style={[
          styles.splitCapsuleCustomText,
          {
            color: TextColor,
          },
        ]}
        adjustsFontSizeToFit={true}
        numberOfLines={1}
      >
        {`${textValue} `}
        <StyledIcons
          type={'FontAwesome6'}
          name={'sliders'}
          size={styles.splitCapsuleCustomText?.fontSize}
          color={TextColor}
        />
      </Text>
    </Pressable>
  );
};

export const StyledSpiltOptions = ({
  titleText = 'SPLIT COUNT',
  description,
  onSelectedSplitValue,
}: {
  titleText?: string;
  description?: string;
  onSelectedSplitValue?: (value: number) => void;
}) => {
  const { state } = useAppContext();
  const { t } = useTranslation();

  const defaultSplitValue = 1;

  const [splitValue, setSplitValue] = useState<number>(defaultSplitValue);

  const [customSliderVisible, setCustomSliderVisible] = useState<boolean>(false);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`${titleText}`}</Text>
      <Text style={styles.instructionText}>
        <StyledIcons
          type={'FontAwesome6'}
          name={'circle-info'}
          size={styles.instructionText?.fontSize}
          color={styles.instructionText?.color}
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
              {state.splits.slice(0, 2).map(({ place, value }) => (
                <SplitCapsule
                  key={place}
                  textValue={value}
                  onSplitPress={value => {
                    setCustomSliderVisible(false);
                    setSplitValue(value);
                    onSelectedSplitValue && onSelectedSplitValue(value);
                  }}
                  active={splitValue === value}
                />
              ))}
            </View>
            <View style={styles.secondColumnContainerStyles}>
              <Text
                style={styles.splitDigitsStyles}
                adjustsFontSizeToFit={true}
                allowFontScaling={false}
                numberOfLines={1}
              >
                {`${splitValue}`}
              </Text>
            </View>
          </View>
          {/* Second Row */}
          <View style={styles.mainRowContainerStyles}>
            <View style={styles.fistColumnContainerStyles}>
              {state.splits.slice(2).map(({ place, value }) => (
                <SplitCapsule
                  key={place}
                  textValue={value}
                  onSplitPress={value => {
                    setCustomSliderVisible(false);
                    setSplitValue(value);
                    onSelectedSplitValue && onSelectedSplitValue(value);
                  }}
                  active={splitValue === value}
                />
              ))}
            </View>
            <View style={styles.secondColumnContainerStyles}>
              <SplitCustomCapsule
                textValue={customSliderVisible ? t('buttons.setValue') : t('buttons.custom')}
                active
                onCustomSplitPress={() => {
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
            sliderValue={splitValue}
            step={state.splitSliderConfig.step}
            minValue={state.splitSliderConfig.min}
            maxValue={state.splitSliderConfig.max}
            onValueChange={value => {
              setSplitValue(value[0]);
              onSelectedSplitValue && onSelectedSplitValue(value[0]);
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create(({ colors, fonts }, rt) => ({
  mainContainer: {
    marginTop: (rt.screen.height * 2) / 100,
    width: '100%',
    backgroundColor: colors.card,
    paddingVertical: (rt.screen.height * 2) / 100,
    borderRadius: (rt.screen.height * 1) / 100,
  },
  titleText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
    marginHorizontal: (rt.screen.width * 5) / 100,
  },
  instructionText: {
    fontSize: 10,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginVertical: (rt.screen.height * 0.5) / 100,
    marginHorizontal: (rt.screen.width * 5) / 100,
  },
  mainInnerContainer: {
    paddingVertical: (rt.screen.height * 1) / 100,
    rowGap: (rt.screen.height * 1) / 100,
  },
  mainRowContainerStyles: {
    flex: 1,
    flexDirection: 'row',
    height: (rt.screen.height * 4) / 100,
  },
  fistColumnContainerStyles: {
    flex: 1,
    paddingHorizontal: (rt.screen.width * 5) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: (rt.screen.width * 2) / 100,
  },
  secondColumnContainerStyles: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: (rt.screen.width * 5) / 100,
  },
  splitCapsule: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: (rt.screen.height * 1) / 100,
  },
  splitCapsuleCustom: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: (rt.screen.height * 1) / 100,
  },
  splitDigitsStyles: {
    fontSize: 24,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
    alignSelf: 'center',
  },
  splitCapsuleText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.accent,
  },
  splitCapsuleCustomText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
    paddingHorizontal: (rt.screen.width * 2) / 100,
  },
  sliderContainer: {
    marginTop: (rt.screen.height * 1) / 100,
  },
}));
