import { View, Text } from 'react-native';
import React from 'react';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';
import MultiSlider, {
  MultiSliderProps,
} from '@ptomasroos/react-native-multi-slider';

type StyledHorizontalSliderProps = {
  sliderValue?: number;
} & MultiSliderProps;

const SliderLength = (UnistylesRuntime.screen.width * 80) / 100;

export const StyledHorizontalSlider = ({
  sliderValue = 0,
  ...restProps
}: StyledHorizontalSliderProps) => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={styles.mainContainer}>
      <MultiSlider
        values={[sliderValue]}
        step={0.5}
        min={0}
        max={100}
        snapped={true}
        sliderLength={SliderLength}
        containerStyle={styles.sliderContainerStyles}
        selectedStyle={styles.selectedStyle}
        unselectedStyle={styles.unSelectedStyle}
        markerStyle={styles.markerStyles}
        pressedMarkerStyle={styles.markerStyles}
        {...restProps}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  mainContainer: {
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainerStyles: {
    borderRadius: (UnistylesRuntime.screen.height * 2) / 100,
  },
  selectedStyle: {
    backgroundColor: colors.accent,
    height: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 2) / 100,
  },
  unSelectedStyle: {
    backgroundColor: colors.backgroundColor,
    height: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 2) / 100,
  },
  markerStyles: {
    backgroundColor: colors.accent,
    height: (UnistylesRuntime.screen.height * 3.5) / 100,
    width: (UnistylesRuntime.screen.height * 3.5) / 100,
    marginTop: (UnistylesRuntime.screen.height * 2) / 100,
  },
}));
