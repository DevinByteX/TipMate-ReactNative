import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
} from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';

type StyledConfigInputProps = {
  title: string;
  textValue: number;
  previousValue: number;
  suffix?: string;
  onValueChange?: ({ preValue, newValue }: { preValue: number; newValue: number }) => void;
} & TextInputProps;

export const StyledConfigInput = ({
  title = 'Max :',
  textValue = 10,
  previousValue = 0,
  suffix = '',
  onValueChange,
  ...TextInputProps
}: StyledConfigInputProps) => {
  const { styles, theme } = useStyles(stylesheet);
  const [inputFocused, setInputFocused] = useState(false);
  const [text, setText] = useState(`${textValue}${suffix}`);

  // Synchronise text state with textValue prop
  useEffect(() => {
    setText(`${textValue}${suffix}`);
  }, [textValue, suffix]);

  const handleChangeText = (inputText: string) => {
    // Remove non-numeric characters and ensure the suffix is appended
    let cleanedText = inputText.replace(/[^0-9]/g, '');
    setText(`${cleanedText}${suffix}`);
  };

  const handleFocus = () => setInputFocused(true);
  const handleBlur = () => setInputFocused(false);

  const handleEndEditing = ({
    nativeEvent: { text },
  }: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const cleanedText = text.replace(suffix, '');
    const newValue = cleanedText === '' ? previousValue : parseInt(cleanedText, 10);

    // Restore previousValue if input is empty
    if (cleanedText === '') {
      setText(`${previousValue}${suffix}`);
    }

    // Call onValueChange if provided
    if (onValueChange) {
      onValueChange({
        preValue: previousValue,
        newValue,
      });
    }
  };

  return (
    <View
      style={[
        styles.configInputBox,
        {
          borderColor: inputFocused ? theme.colors.accent : theme.colors.backgroundColor,
        },
      ]}>
      <Text style={styles.configBoxText}>{`${title}`}</Text>
      <TextInput
        selection={{ start: text.length - suffix.length, end: text.length - suffix.length }}
        selectionColor={theme.colors.accent}
        style={styles.configBoxTextInput}
        maxLength={suffix.length + 2} // Adjust maxLength to include suffix length
        contextMenuHidden
        keyboardType="numeric"
        returnKeyType="done"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onEndEditing={handleEndEditing}
        value={text}
        onChangeText={handleChangeText}
        {...TextInputProps}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  configInputBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    borderColor: colors.backgroundColor,
    borderWidth: (UnistylesRuntime.screen.width * 0.5) / 100,
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
    paddingVertical: (UnistylesRuntime.screen.height * 0.75) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 1) / 100,
  },
}));
