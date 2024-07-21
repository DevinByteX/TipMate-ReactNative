import React, { useContext, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import {
  StyledConfigInput,
  StyledIcons,
  StyledIconTypesKeys,
  StyledTextInputCapsule,
  VerticalDevider,
} from '@components';
import { Constants } from '@configs';
import { AppContext } from '@/context/AppContext';
import { SplitOptionState } from '@/context/types';

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
      onValueChange={({ place, preValue, newValue }) => {
        // TODO Validations to be added
        const updatedSplitOption: SplitOptionState = { place: place, value: newValue }; // Update split option
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
      style={[
        styles.splitPercentageCapsuleCustom,
        {
          backgroundColor: active ? theme.colors.accent : theme.colors.backgroundColor,
        },
      ]}
      onPress={() => {
        onCustomSplitPress && onCustomSplitPress();
      }}>
      <Text
        style={[
          styles.splitPercentageCapsuleCustomText,
          {
            color: active ? theme.colors.card : theme.colors.card_typography,
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
  titleText = 'CUSTOMISE SPLIT',
}: {
  titleText?: string;
  editMode?: boolean;
}) => {
  const { state, dispatch } = useContext(AppContext);

  const [customSliderConfigVisible, setCustomSliderConfigVisible] = useState<boolean>(false);

  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>
        {`${titleText} `}
        {/* <StyledIcons type={'FontAwesome5'} name={'info-circle'} size={styles.titleText?.fontSize} /> */}
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
                active
                iconType={'FontAwesome'}
                iconName={'undo'}
                onCustomSplitPress={() => {
                  // TODO Confirm pop up before dispatch
                  dispatch({
                    type: 'RESET_SPLIT_OPTIONS_TO_DEFAULT',
                    payload: Constants.defaultSplitOptionsArray,
                  });
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
              <SplitPercentageCustomCapsule
                textValue={customSliderConfigVisible ? `Set Value` : `Config`}
                active
                iconType={'FontAwesome5'}
                iconName={'sliders-h'}
                onCustomSplitPress={() => {
                  setCustomSliderConfigVisible(!customSliderConfigVisible);
                }}
              />
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
              title="Min :"
              textValue={1}
              previousValue={1}
              onValueChange={({ preValue, newValue }) => {
                console.log(`Min`, `P ${preValue}`, `N ${newValue}`);
              }}
            />
            <StyledConfigInput
              title="Max :"
              textValue={15}
              previousValue={15}
              onValueChange={({ preValue, newValue }) => {
                console.log(`Max`, `P ${preValue}`, `N ${newValue}`);
              }}
            />
            <StyledConfigInput
              title="Step :"
              textValue={1}
              previousValue={1}
              onValueChange={({ preValue, newValue }) => {
                console.log(`Step`, `P ${preValue}`, `N ${newValue}`);
              }}
            />
          </View>
        </View>
      ) : null}
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
