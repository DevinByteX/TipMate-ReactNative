import React from 'react';
import { View, Switch, Platform, SwitchProps } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

type styledToggleProps = {
  value?: boolean;
  disabled?: boolean;
  onChange?: SwitchProps['onChange'];
  onValueChange?: SwitchProps['onValueChange'];
};

export const StyledToggle = ({ value, disabled, onChange, onValueChange }: styledToggleProps) => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <View
      style={[
        styles.buttonContainer,
        {
          backgroundColor: disabled
            ? theme.colors.disable_button
            : value
            ? theme.colors.accent
            : theme.colors.devider,
        },
      ]}>
      <Switch
        style={styles.switchStyles}
        disabled={disabled}
        thumbColor={
          disabled
            ? theme.colors.disable_button
            : value
            ? theme.colors.accent
            : theme.colors.disable_button
        }
        value={value}
        trackColor={{
          true: disabled ? theme.colors.disable_button : theme.colors.accent,
          false: disabled ? theme.colors.disable_button : theme.colors.devider,
        }}
        ios_backgroundColor={disabled ? theme.colors.disable_button : theme.colors.card_typography}
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
