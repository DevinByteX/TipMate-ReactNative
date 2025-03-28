import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import {
  StyledConfigInput,
  StyledIcons,
  StyledIconTypesKeys,
  StyledPopUp,
  StyledTextInputCapsule,
  VerticalDevider,
} from '@components';
import { Constants } from '@configs';
import { areOptionArraysSame } from '@hooks';
import { useAppContext } from '@/context/AppContext';
import { TipOptionState } from '@/context/types';
import Toast from 'react-native-toast-message';

const TipPercentageEditCapsule = ({
  textValue = 5,
  place,
}: {
  textValue: number;
  place?: number;
}) => {
  const { state, dispatch } = useAppContext();
  return (
    <StyledTextInputCapsule
      textValue={textValue}
      previousValue={textValue}
      place={place}
      suffix={'%'}
      optionsArray={state?.tips}
      minValidateValue={0}
      maxValidateValue={80}
      onValueChange={({ place, preValue, newValue }) => {
        const updatedTipOption: TipOptionState = { place: place, value: newValue }; // Updated tip option value
        dispatch({ type: 'UPDATE_TIP_OPTIONS', payload: updatedTipOption });
      }}
    />
  );
};

const TipPercentageCustomCapsule = ({
  active = false,
  textValue = 'custom',
  onCustomTipPress,
  iconType = 'FontAwesome',
  iconName = 'sliders',
}: {
  active?: boolean;
  textValue: string;
  onCustomTipPress?: () => void;
  iconType?: StyledIconTypesKeys;
  iconName?: string;
}) => {
  const { styles, theme } = useStyles(stylesheet);
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
      }}>
      <Text
        style={[
          styles.tipPercentageCapsuleCustomText,
          {
            color: active ? theme.colors.card : theme.colors.disable_text,
          },
        ]}>
        {`${textValue} `}
        <StyledIcons
          type={iconType}
          name={iconName}
          size={styles.tipPercentageCapsuleCustomText?.fontSize}
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
  const { state, dispatch } = useAppContext();

  const [customSliderConfigVisible, setCustomSliderConfigVisible] = useState<boolean>(false);
  const [confirmPopUpVisibility, setConfirmPopUpVisibility] = useState<boolean>(false);

  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`${title}`}</Text>
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
                <TipPercentageEditCapsule key={place} textValue={value} place={place} />
              ))}
            </View>
            <View style={styles.secondColumnContainerStyles}>
              <TipPercentageCustomCapsule
                textValue={`Reset`}
                active={
                  !areOptionArraysSame({
                    firstArray: state.tips,
                    secondArray: Constants.defaultTipOptionsArray,
                  })
                }
                iconType={'FontAwesome'}
                iconName={'undo'}
                onCustomTipPress={() => {
                  setConfirmPopUpVisibility(true);
                }}
              />
            </View>
          </View>
          {/* Second Row */}
          <View style={styles.mainRowContainerStyles}>
            <View style={styles.fistColumnContainerStyles}>
              {state.tips.slice(2).map(({ place, value }) => (
                <TipPercentageEditCapsule key={place} textValue={value} place={place} />
              ))}
            </View>
            <View style={styles.secondColumnContainerStyles}>
              {/* <TipPercentageCustomCapsule
                textValue={customSliderConfigVisible ? `Set Value` : `Custom`}
                active
                iconType={'FontAwesome5'}
                iconName={'sliders-h'}
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
              textValue={state.tipSliderConfig.min}
              previousValue={state.tipSliderConfig.min}
              onValueChange={({ preValue, newValue }) => {
                console.log(`Min`, `P ${preValue}`, `N ${newValue}`);
              }}
            />
            <StyledConfigInput
              title={`Max :`}
              textValue={state.tipSliderConfig.max}
              previousValue={state.tipSliderConfig.max}
              onValueChange={({ preValue, newValue }) => {
                console.log(`Max`, `P ${preValue}`, `N ${newValue}`);
              }}
            />
            <StyledConfigInput
              title={`Step :`}
              textValue={state.tipSliderConfig.step}
              previousValue={state.tipSliderConfig.step}
              onValueChange={({ preValue, newValue }) => {
                console.log(`Step`, `P ${preValue}`, `N ${newValue}`);
              }}
            />
          </View>
        </View>
      ) : null}
      <StyledPopUp
        popUpVisibility={confirmPopUpVisibility}
        modalTitle={`${modalTitle}`}
        modalSubtitle={`${modalSubtitle}`}
        lineButtonText={`${lineButtonText}`}
        solidButtonText={`${solidButtonText}`}
        onLineButtonPress={() => {
          setConfirmPopUpVisibility(false);
        }}
        onSolidButtonPress={() => {
          dispatch({
            type: 'RESET_TIP_OPTIONS_TO_DEFAULT',
            payload: Constants.defaultTipOptionsArray,
          });
          Toast.show({
            type: 'success',
            text1: `${resetSuccessToastText}`,
            visibilityTime: 5000,
          });
          setConfirmPopUpVisibility(false);
        }}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
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
    fontSize: 14,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.accent,
  },
  configBoxTextInput: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card_typography,
  },
}));
