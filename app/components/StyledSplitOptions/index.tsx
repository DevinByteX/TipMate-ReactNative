import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
import { StyledHorizontalSlider, StyledIcons, VerticalDevider } from '@components';
import { useAppContext } from '@/context/AppContext';
import { useScaleSpring } from '@hooks';

const SplitCapsule = ({
  active = false,
  textValue = 5,
  onSplitPress,
}: {
  active?: boolean;
  textValue: number;
  onSplitPress?: (value: number) => void;
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const { animatedStyle } = useScaleSpring(active);
  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
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
    </Animated.View>
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
  const { styles, theme } = useStyles(stylesheet);
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
  onCustomSplitPress,
  isCustomSplitActive = false,
  onClearCustomSplit,
  billAmount = 0,
}: {
  titleText?: string;
  description?: string;
  onSelectedSplitValue?: (value: number) => void;
  onCustomSplitPress?: () => void;
  isCustomSplitActive?: boolean;
  onClearCustomSplit?: () => void;
  billAmount?: number;
}) => {
  const { state } = useAppContext();
  const { t } = useTranslation();

  const defaultSplitValue = 1;

  const [splitValue, setSplitValue] = useState<number>(defaultSplitValue);

  const [customSliderVisible, setCustomSliderVisible] = useState<boolean>(false);

  const { styles, theme } = useStyles(stylesheet);

  const isCustomSplitDisabled = billAmount <= 0;

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
                    onClearCustomSplit && onClearCustomSplit();
                    onSelectedSplitValue && onSelectedSplitValue(value);
                  }}
                  active={splitValue === value && !isCustomSplitActive}
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
                    onClearCustomSplit && onClearCustomSplit();
                    onSelectedSplitValue && onSelectedSplitValue(value);
                  }}
                  active={splitValue === value && !isCustomSplitActive}
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
              onClearCustomSplit && onClearCustomSplit();
              onSelectedSplitValue && onSelectedSplitValue(value[0]);
            }}
          />
        </View>
      ) : null}
      {/* Custom Split Button */}
      <Pressable
        disabled={isCustomSplitDisabled}
        style={[
          styles.customSplitButton,
          isCustomSplitActive && styles.customSplitButtonActive,
          isCustomSplitDisabled && styles.customSplitButtonDisabled,
        ]}
        onPress={() => {
          if (!isCustomSplitDisabled) {
            onCustomSplitPress && onCustomSplitPress();
          }
        }}
      >
        <StyledIcons
          type={'MaterialDesignIcons'}
          name={isCustomSplitActive ? 'check-circle' : 'account-multiple'}
          size={16}
          color={
            isCustomSplitActive
              ? theme.colors.card
              : isCustomSplitDisabled
              ? theme.colors.disable_text
              : theme.colors.accent
          }
        />
        <Text
          style={[
            styles.customSplitButtonText,
            isCustomSplitActive && styles.customSplitButtonTextActive,
            isCustomSplitDisabled && styles.customSplitButtonDisabledText,
          ]}
        >
          {isCustomSplitActive
            ? t('screens.customSplit.customSplitActive')
            : t('components.splitOptions.customSplitButton')}
        </Text>
        {isCustomSplitActive && onClearCustomSplit && (
          <Pressable
            onPress={e => {
              e.stopPropagation();
              onClearCustomSplit();
            }}
            hitSlop={8}
            style={styles.clearCustomSplitButton}
          >
            <Text style={styles.clearCustomSplitText}>
              {t('screens.customSplit.clearCustomSplit')}
            </Text>
          </Pressable>
        )}
      </Pressable>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts, utils }) => ({
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
    fontFamily: fonts.Nunito_Black,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  instructionText: {
    fontSize: 10,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginVertical: (UnistylesRuntime.screen.height * 0.5) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
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
  splitCapsule: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  splitCapsuleCustom: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
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
    paddingHorizontal: (UnistylesRuntime.screen.width * 2) / 100,
  },
  sliderContainer: {
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
  },
  customSplitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  customSplitButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  customSplitButtonDisabled: {
    borderColor: colors.disable_button,
    opacity: 0.6,
  },
  customSplitButtonText: {
    fontSize: 13,
    fontFamily: fonts.Nunito_Bold,
    color: colors.accent,
  },
  customSplitButtonTextActive: {
    color: colors.card,
  },
  customSplitButtonDisabledText: {
    color: colors.disable_text,
  },
  clearCustomSplitButton: {
    marginLeft: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: utils.hexToRGBA(colors.card, 0.3),
  },
  clearCustomSplitText: {
    fontSize: 11,
    fontFamily: fonts.Nunito_Bold,
    color: colors.card,
  },
}));
