import React, { useContext, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import {
  StyledHorizontalSlider,
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
  titleText = 'SELECT SPLIT',
  onSelectedSplitValue,
}: {
  titleText?: string;
  editMode?: boolean;
  onSelectedSplitValue?: (value: number) => void;
}) => {
  const { state, dispatch } = useContext(AppContext);

  const defaultSplitValue = 5;

  const [splitPercentageValue, setSplitPercentageValue] = useState<number>(defaultSplitValue);
  const [customSliderVisible, setCustomSliderVisible] = useState<boolean>(false);

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
                textValue={customSliderVisible ? `Set Value` : `Custom`}
                active
                iconType={'FontAwesome5'}
                iconName={'sliders-h'}
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
            sliderValue={splitPercentageValue}
            onValuesChange={value => {
              setSplitPercentageValue(value[0]);
              onSelectedSplitValue && onSelectedSplitValue(value[0]);
            }}
          />
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
  sliderContainer: {
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
  },
}));
