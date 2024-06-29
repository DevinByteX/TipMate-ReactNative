import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { StyledHorizontalSlider, StyledIcons, VerticalDevider } from '@components';

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
      }}>
      <Text
        style={[
          styles.splitCapsuleText,
          {
            color: active ? theme.colors.card : theme.colors.card_typography,
          },
        ]}>{`${textValue}`}</Text>
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
  const { styles, theme } = useStyles(stylesheet);
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
      }}>
      <Text
        style={[
          styles.splitCapsuleCustomText,
          {
            color: active ? theme.colors.card : theme.colors.card_typography,
          },
        ]}>
        {`${textValue} `}
        <StyledIcons
          type={'FontAwesome'}
          name={'sliders'}
          size={styles.splitCapsuleCustomText?.fontSize}
        />
      </Text>
    </Pressable>
  );
};

export const StyledSpiltOptions = ({
  titleText = 'SPLIT COUNT',
  onSelectedSplitValue,
}: {
  titleText?: string;
  onSelectedSplitValue?: (value: number) => void;
}) => {
  const defaultSplitValue = 1;

  const [splitValue, setSplitValue] = useState<number>(defaultSplitValue);

  const [customSliderVisible, setCustomSliderVisible] = useState<boolean>(false);

  const { styles, theme } = useStyles(stylesheet);

  const splitValues = [
    { place: 1, value: 1 },
    { place: 2, value: 3 },
    { place: 3, value: 5 },
    { place: 4, value: 7 },
  ];

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
              {splitValues.slice(0, 2).map(({ place, value }) => (
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
                numberOfLines={1}>
                {`${splitValue}`}
              </Text>
            </View>
          </View>
          {/* Second Row */}
          <View style={styles.mainRowContainerStyles}>
            <View style={styles.fistColumnContainerStyles}>
              {splitValues.slice(2).map(({ place, value }) => (
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
                textValue={customSliderVisible ? `Set Value` : `Custom`}
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
            step={1}
            minValue={1}
            maxValue={15}
            onValuesChange={value => {
              setSplitValue(value[0]);
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
    fontSize: 40,
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
  },
  sliderContainer: {
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
  },
}));
