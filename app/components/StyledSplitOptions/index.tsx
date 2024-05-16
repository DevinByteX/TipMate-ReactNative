import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';
import { StyledHorizontalSlider, VerticalDevider } from '@components';

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
          backgroundColor: active
            ? theme.colors.accent
            : theme.colors.backgroundColor,
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
          backgroundColor: active
            ? theme.colors.accent
            : theme.colors.backgroundColor,
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
        ]}>{`${textValue}`}</Text>
    </Pressable>
  );
};

export const StyledSpiltOptions = ({
  onSelectedSplitValue,
}: {
  onSelectedSplitValue?: (value: number) => void;
}) => {
  const defaultSplitValue = 5;

  const [splitValue, setSplitValue] = useState<number>(defaultSplitValue);

  const [customSliderVisible, setCustomSliderVisible] =
    useState<boolean>(false);

  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`SPLIT COUNT`}</Text>
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
              <SplitCapsule
                textValue={1}
                onSplitPress={value => {
                  setCustomSliderVisible(false);
                  setSplitValue(value);
                  onSelectedSplitValue && onSelectedSplitValue(value);
                }}
                active={splitValue == 1}
              />
              <SplitCapsule
                textValue={3}
                onSplitPress={value => {
                  setCustomSliderVisible(false);
                  setSplitValue(value);
                  onSelectedSplitValue && onSelectedSplitValue(value);
                }}
                active={splitValue == 3}
              />
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
              <SplitCapsule
                textValue={5}
                onSplitPress={value => {
                  setCustomSliderVisible(false);
                  setSplitValue(value);
                  onSelectedSplitValue && onSelectedSplitValue(value);
                }}
                active={splitValue == 5}
              />
              <SplitCapsule
                textValue={7}
                onSplitPress={value => {
                  setCustomSliderVisible(false);
                  setSplitValue(value);
                  onSelectedSplitValue && onSelectedSplitValue(value);
                }}
                active={splitValue == 7}
              />
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

const stylesheet = createStyleSheet(({ colors }) => ({
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
    fontWeight: '800',
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
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
  },
  secondColumnContainerStyles: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  splitCapsule: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: (UnistylesRuntime.screen.width * 16) / 100,
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
    fontWeight: '800',
    color: colors.card_typography,
    alignSelf: 'center',
  },
  splitCapsuleText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.accent,
  },
  splitCapsuleCustomText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.card_typography,
  },
  sliderContainer: {
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
  },
}));
