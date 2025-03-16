import { View } from 'react-native';
import React from 'react';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { Slider, SliderProps } from '@miblanchard/react-native-slider';

type StyledHorizontalSliderProps = {
  sliderValue?: number;
  step?: number;
  minValue?: number;
  maxValue?: number;
} & Omit<SliderProps, 'value' | 'minimumValue' | 'maximumValue' | 'step' | 'animationType'>; // Omit these props to avoid conflict

export const StyledHorizontalSlider = ({
  sliderValue = 0,
  step = 0.5,
  minValue = 0,
  maxValue = 80,
  ...restProps
}: StyledHorizontalSliderProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.mainContainer}>
      <Slider
        value={[sliderValue]}
        step={step} // Prioritise props from SliderProps, fall back to defaults
        minimumValue={minValue}
        maximumValue={maxValue}
        containerStyle={styles.sliderContainerStyles}
        minimumTrackStyle={styles.minimumTrackStyle}
        maximumTrackStyle={styles.maximumTrackStyle}
        thumbStyle={styles.markerStyles}
        thumbTouchSize={styles.markerStyles}
        {...restProps} // Spread the remaining props
      />
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  mainContainer: {
    backgroundColor: colors.card,
    justifyContent: 'center',
    paddingTop: (UnistylesRuntime.screen.height * 1) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  sliderContainerStyles: {
    height: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 2) / 100,
  },
  minimumTrackStyle: {
    backgroundColor: colors.accent,
    height: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 2) / 100,
  },
  maximumTrackStyle: {
    backgroundColor: colors.backgroundColor,
    height: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 2) / 100,
  },
  markerStyles: {
    backgroundColor: colors.accent,
    height: (UnistylesRuntime.screen.height * 3.5) / 100,
    width: (UnistylesRuntime.screen.height * 3.5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 3.5) / 100,
  },
}));
