import React, { useContext, useState } from 'react';
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
import { AppContext } from '@/context/AppContext';
import { SplitOptionState } from '@/context/types';
import Toast from 'react-native-toast-message';

const SplitPercentageEditCapsule = ({
  textValue = 5,
  place,
}: {
  textValue: number;
  place?: number;
}) => {
  const { state, dispatch } = useContext(AppContext);
  return (
    <StyledTextInputCapsule
      textValue={textValue}
      previousValue={textValue}
      place={place}
      optionsArray={state?.splits}
      minValidateValue={1}
      maxValidateValue={15}
      onValueChange={({ place, preValue, newValue }) => {
        const updatedSplitOption: SplitOptionState = { place: place, value: newValue }; // Update split option value
        dispatch({ type: 'UPDATE_SPLIT_OPTIONS', payload: updatedSplitOption });
      }}
    />
  );
};

const SplitPercentageCustomCapsule = ({
  active = false,
  textValue = 'custom',
  onCustomSplitPress,
  iconType = 'FontAwesome',
  iconName = 'sliders',
}: {
  active?: boolean;
  textValue: string;
  onCustomSplitPress?: () => void;
  iconType?: StyledIconTypesKeys;
  iconName?: string;
}) => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <Pressable
      disabled={!active}
      style={[
        styles.splitPercentageCapsuleCustom,
        {
          backgroundColor: active ? theme.colors.accent : theme.colors.disable_button,
        },
      ]}
      onPress={() => {
        onCustomSplitPress && onCustomSplitPress();
      }}>
      <Text
        style={[
          styles.splitPercentageCapsuleCustomText,
          {
            color: active ? theme.colors.card : theme.colors.disable_text,
          },
        ]}>
        {`${textValue} `}
        <StyledIcons
          type={iconType}
          name={iconName}
          size={styles.splitPercentageCapsuleCustomText?.fontSize}
        />
      </Text>
    </Pressable>
  );
};

export const StyledSplitOptionsEditMode = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const { state, dispatch } = useContext(AppContext);

  const [customSliderConfigVisible, setCustomSliderConfigVisible] = useState<boolean>(false);
  const [confirmPopUpVisibility, setConfirmPopUpVisibility] = useState<boolean>(false);

  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`${title} `}</Text>
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
              {state.splits.slice(0, 2).map(({ place, value }) => (
                <SplitPercentageEditCapsule key={place} textValue={value} place={place} />
              ))}
            </View>
            <View style={styles.secondColumnContainerStyles}>
              <SplitPercentageCustomCapsule
                textValue={`Reset`}
                active={
                  !areOptionArraysSame({
                    firstArray: state.splits,
                    secondArray: Constants.defaultSplitOptionsArray,
                  })
                }
                iconType={'FontAwesome'}
                iconName={'undo'}
                onCustomSplitPress={() => {
                  setConfirmPopUpVisibility(true);
                }}
              />
            </View>
          </View>
          {/* Second Row */}
          <View style={styles.mainRowContainerStyles}>
            <View style={styles.fistColumnContainerStyles}>
              {state.splits.slice(2).map(({ place, value }) => (
                <SplitPercentageEditCapsule key={place} textValue={value} place={place} />
              ))}
            </View>
            <View style={styles.secondColumnContainerStyles}>
              {/* <SplitPercentageCustomCapsule
                textValue={customSliderConfigVisible ? `Set Configs` : `Configs`}
                active
                iconType={'FontAwesome5'}
                iconName={'sliders-h'}
                onCustomSplitPress={() => {
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
              textValue={state.splitSliderConfig.min}
              previousValue={state.splitSliderConfig.min}
              onValueChange={({ preValue, newValue }) => {
                console.log(`Min`, `P ${preValue}`, `N ${newValue}`);
              }}
            />
            <StyledConfigInput
              title={`Max :`}
              textValue={state.splitSliderConfig.max}
              previousValue={state.splitSliderConfig.max}
              onValueChange={({ preValue, newValue }) => {
                console.log(`Max`, `P ${preValue}`, `N ${newValue}`);
              }}
            />
            <StyledConfigInput
              title={`Step :`}
              textValue={state.splitSliderConfig.step}
              previousValue={state.splitSliderConfig.step}
              onValueChange={({ preValue, newValue }) => {
                console.log(`Step`, `P ${preValue}`, `N ${newValue}`);
              }}
            />
          </View>
        </View>
      ) : null}
      <StyledPopUp
        popUpVisibility={confirmPopUpVisibility}
        modalTitle={`${'Confirm Reset'}`}
        modalSubtitle={`${`Are you sure you want to reset all your split options? This change can't be undone!`}`}
        lineButtonText={`${'Cancel'}`}
        solidButtonText={`${'Reset'}`}
        onLineButtonPress={() => {
          setConfirmPopUpVisibility(false);
        }}
        onSolidButtonPress={() => {
          dispatch({
            type: 'RESET_SPLIT_OPTIONS_TO_DEFAULT',
            payload: Constants.defaultSplitOptionsArray,
          });
          Toast.show({
            type: 'success',
            text1: `Split options refreshed! You're all set with the default values`,
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
  splitPercentageCapsule: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  splitPercentageCapsuleCustom: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  splitDigitsStyles: {
    fontSize: 40,
    fontFamily: fonts.Montserrat_Black,
    color: colors.card_typography,
    alignSelf: 'center',
  },
  splitPercentageCapsuleText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.accent,
  },
  splitPercentageCapsuleCustomText: {
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
