import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
import {
  IconTypeMap,
  StyledConfigInput,
  StyledIcons,
  StyledIconTypesKey,
  StyledAlert,
  StyledTextInputCapsule,
  VerticalDevider,
} from '@components';
import { Constants } from '@configs';
import { useTipOptionsEditSelector } from '@hooks';
import { areOptionArraysSame } from '@utils';
import { TipOptionState } from '@/context/types';
import Toast from 'react-native-toast-message';

const TipPercentageEditCapsule = ({
  textValue = 5,
  place,
}: {
  textValue: number;
  place?: number;
}) => {
  const { tips, updateTipOption } = useTipOptionsEditSelector();
  return (
    <StyledTextInputCapsule
      textValue={textValue}
      previousValue={textValue}
      place={place}
      suffix={'%'}
      optionsArray={tips}
      minValidateValue={0}
      maxValidateValue={80}
      onValueChange={({ place, preValue, newValue }) => {
        const updatedTipOption: TipOptionState = { place: place, value: newValue }; // Updated tip option value
        updateTipOption(updatedTipOption);
      }}
    />
  );
};

type TipPercentageCustomCapsuleProps = {
  active?: boolean;
  textValue: string;
  onCustomTipPress?: () => void;
  iconType?: StyledIconTypesKey;
  iconName?: React.ComponentProps<IconTypeMap[StyledIconTypesKey]>['name'];
};

const TipPercentageCustomCapsule = ({
  active = false,
  textValue = 'custom',
  onCustomTipPress,
  iconType = 'FontAwesome6',
  iconName = 'sliders',
}: TipPercentageCustomCapsuleProps) => {
  const { styles, theme } = useStyles(stylesheet);
  const TextColor = active ? theme.colors.card : theme.colors.disable_text;
  return (
    <Pressable
      disabled={!active}
      style={[
        styles.tipPercentageCapsuleCustom,
        {
          backgroundColor: active ? theme.colors.accent : theme.colors.disable_button,
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
            color: TextColor,
          },
        ]}
        adjustsFontSizeToFit={true}
        numberOfLines={1}
      >
        {`${textValue} `}
        <StyledIcons
          type={iconType}
          name={iconName}
          size={styles.tipPercentageCapsuleCustomText?.fontSize}
          color={TextColor}
        />
      </Text>
    </Pressable>
  );
};

export const StyledTipOptionsEditMode = ({
  title,
  description,
  modalTitle,
  modalSubtitle,
  lineButtonText,
  solidButtonText,
  resetSuccessToastText,
}: {
  title: string;
  description: string;
  modalTitle: string;
  modalSubtitle: string;
  lineButtonText: string;
  solidButtonText: string;
  resetSuccessToastText: string;
}) => {
  const { tips, tipSliderConfig, updateTipOption, resetTipsToDefault } =
    useTipOptionsEditSelector();
  const { t } = useTranslation();

  const [customSliderConfigVisible, setCustomSliderConfigVisible] = useState<boolean>(false);
  const [confirmPopUpVisibility, setConfirmPopUpVisibility] = useState<boolean>(false);

  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`${title}`}</Text>
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
              {tips.slice(0, 2).map(({ place, value }) => (
                <TipPercentageEditCapsule key={place} textValue={value} place={place} />
              ))}
            </View>
            <View style={styles.secondColumnContainerStyles}>
              <TipPercentageCustomCapsule
                textValue={t('buttons.reset')}
                active={
                  !areOptionArraysSame({
                    firstArray: tips,
                    secondArray: Constants.defaultTipOptionsArray,
                  })
                }
                iconType={'FontAwesome6'}
                iconName={'arrow-rotate-left'}
                onCustomTipPress={() => {
                  setConfirmPopUpVisibility(true);
                }}
              />
            </View>
          </View>
          {/* Second Row */}
          <View style={styles.mainRowContainerStyles}>
            <View style={styles.fistColumnContainerStyles}>
              {tips.slice(2).map(({ place, value }) => (
                <TipPercentageEditCapsule key={place} textValue={value} place={place} />
              ))}
            </View>
            <View style={styles.secondColumnContainerStyles}>
              {/* <TipPercentageCustomCapsule
                textValue={customSliderConfigVisible ? `Set Value` : `Custom`}
                active
                iconType={'FontAwesome6'}
                iconName={'sliders'}
                onCustomTipPress={() => {
                  setCustomSliderConfigVisible(!customSliderConfigVisible);
                }}
              /> */}
            </View>
          </View>
        </View>
      </View>
      {customSliderConfigVisible ? (
        <View style={styles.sliderConfigMainContainer}>
          <Text style={styles.titleText}>{`SET SLIDER CONFIGS `}</Text>
          <View style={styles.sliderConfigMainView}>
            <StyledConfigInput
              autoFocus
              title={`Min :`}
              textValue={tipSliderConfig.min}
              previousValue={tipSliderConfig.min}
              onValueChange={({ preValue, newValue }) => {
                console.log(`Min`, `P ${preValue}`, `N ${newValue}`);
              }}
            />
            <StyledConfigInput
              title={`Max :`}
              textValue={tipSliderConfig.max}
              previousValue={tipSliderConfig.max}
              onValueChange={({ preValue, newValue }) => {
                console.log(`Max`, `P ${preValue}`, `N ${newValue}`);
              }}
            />
            <StyledConfigInput
              title={`Step :`}
              textValue={tipSliderConfig.step}
              previousValue={tipSliderConfig.step}
              onValueChange={({ preValue, newValue }) => {
                console.log(`Step`, `P ${preValue}`, `N ${newValue}`);
              }}
            />
          </View>
        </View>
      ) : null}
      <StyledAlert
        visible={confirmPopUpVisibility}
        title={modalTitle}
        message={modalSubtitle}
        type="confirm"
        showIcon={false}
        buttons={[
          {
            text: lineButtonText,
            style: 'cancel',
            onPress: () => setConfirmPopUpVisibility(false),
          },
          {
            text: solidButtonText,
            style: 'default',
            onPress: () => {
              resetTipsToDefault(Constants.defaultTipOptionsArray);
              Toast.show({
                type: 'success',
                text1: resetSuccessToastText,
                visibilityTime: 5000,
              });
              setConfirmPopUpVisibility(false);
            },
          },
        ]}
        onDismiss={() => setConfirmPopUpVisibility(false)}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts, typography }) => ({
  mainContainer: {
    width: '100%',
    backgroundColor: colors.card,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  titleText: {
    color: colors.accent,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Nunito_Black,
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  instructionText: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
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
    fontSize: typography.fontSize.display,
    lineHeight: typography.lineHeight.display,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
    alignSelf: 'center',
  },
  tipPercentageCapsuleText: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Montserrat_Black,
    color: colors.accent,
  },
  tipPercentageCapsuleCustomText: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
    paddingHorizontal: (UnistylesRuntime.screen.width * 2) / 100,
  },
  sliderConfigMainContainer: {
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
  },
  sliderConfigMainView: {
    flexDirection: 'row',
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
    justifyContent: 'space-between',
    gap: (UnistylesRuntime.screen.width * 5) / 100,
  },
  configInputBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    borderColor: colors.backgroundColor,
    borderWidth: (UnistylesRuntime.screen.width * 0.5) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
  },
  configBoxText: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.accent,
  },
  configBoxTextInput: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card_typography,
  },
}));
