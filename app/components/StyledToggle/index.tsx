import React from 'react';
import { View, Switch, Platform, SwitchProps, ViewStyle } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

// Define props to omit from ViewStyle that are specific to the Toggle component
type OmitViewProps =
  | 'backgroundColor'
  | 'justifyContent'
  | 'alignItems'
  | 'height'
  | 'width'
  | 'borderRadius';

// Create a new type that omits those props from ViewStyle
type ToggleContainerStyle = Omit<ViewStyle, OmitViewProps>;

type StyledToggleProps = {
  value?: boolean;
  disabled?: boolean;
  onChange?: SwitchProps['onChange'];
  onValueChange?: SwitchProps['onValueChange'];
  toggleContainerStyles?: ToggleContainerStyle;
};

export const StyledToggle = ({
  value,
  disabled,
  onChange,
  onValueChange,
  toggleContainerStyles,
}: StyledToggleProps) => {
  const { styles, theme } = useStyles(stylesheet);

  const backgroundColor = disabled
    ? theme.colors.disable_button
    : value
    ? theme.colors.accent
    : theme.colors.devider;

  const thumbColor = disabled
    ? theme.colors.disable_button
    : value
    ? theme.colors.devider
    : theme.colors.disable_button;

  const trackColor = {
    true: disabled ? theme.colors.disable_button : theme.colors.accent,
    false: disabled ? theme.colors.disable_button : theme.colors.devider,
  };

  const iosBackgroundColor = disabled ? theme.colors.disable_button : theme.colors.card_typography;

  return (
    <View style={[styles.buttonContainer, { backgroundColor }, toggleContainerStyles]}>
      <Switch
        style={styles.switchStyles}
        disabled={disabled}
        thumbColor={thumbColor}
        value={value}
        trackColor={trackColor}
        ios_backgroundColor={iosBackgroundColor}
        onChange={onChange}
        onValueChange={onValueChange}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: (UnistylesRuntime.screen.height * 3.5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 3.5) / 100,
    width: (UnistylesRuntime.screen.width * 12) / 100,
  },
  switchStyles: {
    transform:
      Platform.OS === 'android'
        ? [{ scaleX: 0.9 }, { scaleY: 0.9 }]
        : [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
}));
