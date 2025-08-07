import { View } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native-unistyles';
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

const styles = StyleSheet.create(({ colors }, runtime) => ({
  mainContainer: {
    backgroundColor: colors.card,
    justifyContent: 'center',
    paddingTop: (runtime.screen.height * 1) / 100,
    paddingHorizontal: (runtime.screen.width * 5) / 100,
  },
  sliderContainerStyles: {
    height: (runtime.screen.height * 2) / 100,
    borderRadius: (runtime.screen.height * 2) / 100,
  },
  minimumTrackStyle: {
    backgroundColor: colors.accent,
    height: (runtime.screen.height * 2) / 100,
    borderRadius: (runtime.screen.height * 2) / 100,
  },
  maximumTrackStyle: {
    backgroundColor: colors.backgroundColor,
    height: (runtime.screen.height * 2) / 100,
    borderRadius: (runtime.screen.height * 2) / 100,
  },
  markerStyles: {
    backgroundColor: colors.accent,
    height: (runtime.screen.height * 3.5) / 100,
    width: (runtime.screen.height * 3.5) / 100,
    borderRadius: (runtime.screen.height * 3.5) / 100,
  },
}));
