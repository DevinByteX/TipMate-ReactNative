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
import { TipOptionState } from '@/context/types';

const TipPercentageEditCapsule = ({
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
      suffix={'%'}
      onValueChange={({ place, preValue, newValue }) => {
        // TODO Validations to be added
        const updatedTipOption: TipOptionState = { place: place, value: newValue }; // Updated tip option
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
  titleText = 'SELECT TIP',
  onSelectedTipValue,
}: {
  titleText?: string;
  editMode?: boolean;
  onSelectedTipValue?: (value: number) => void;
}) => {
  const { state, dispatch } = useContext(AppContext);

  const defaultTipValue = 5;

  const [tipPercentageValue, setTipPercentageValue] = useState<number>(defaultTipValue);
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
              {state.tips.slice(0, 2).map(({ place, value }) => (
                <TipPercentageEditCapsule key={place} textValue={value} place={place} />
              ))}
            </View>
            <View style={styles.secondColumnContainerStyles}>
              <TipPercentageCustomCapsule
                textValue={`Reset`}
                active
                iconType={'FontAwesome'}
                iconName={'sliders'}
                onCustomTipPress={() => {
                  // TODO Confirm pop up before dispatch
                  dispatch({
                    type: 'RESET_TIP_OPTIONS_TO_DEFAULT',
                    payload: Constants.defaultTipOptionsArray,
                  });
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
              <TipPercentageCustomCapsule
                textValue={customSliderVisible ? `Set Value` : `Custom`}
                active
                iconType={'FontAwesome'}
                iconName={'undo'}
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
  sliderContainer: {
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
  },
}));
