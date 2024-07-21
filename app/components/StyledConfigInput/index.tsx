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
  onValueChange?: ({ preValue, newValue }: { preValue: number; newValue: number }) => void;
} & TextInputProps;

export const StyledConfigInput = ({
  title = 'Max :',
  textValue = 10,
  previousValue = 0,
  onValueChange,
  ...TextInputProps
}: StyledConfigInputProps) => {
  const { styles, theme } = useStyles(stylesheet);
  const [inputFocused, setInputFocused] = useState(false);
  const [text, setText] = useState(`${textValue}`);

  // Synchronise text state with textValue prop
  useEffect(() => {
    setText(`${textValue}`);
  }, [textValue]);

  const handleChangeText = (inputText: string) => {
    // Remove non-numeric characters and ensure the suffix is appended
    let cleanedText = inputText.replace(/[^0-9]/g, '');
    setText(`${cleanedText}`);
  };

  const handleFocus = () => setInputFocused(true);
  const handleBlur = () => setInputFocused(false);

  const handleEndEditing = ({
    nativeEvent: { text },
  }: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const newValue = text === '' ? previousValue : parseInt(text, 10);
    // Restore previousValue if input is empty
    if (text === '') {
      setText(`${previousValue}`);
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
        selection={{ start: text.length, end: text.length }}
        selectionColor={theme.colors.accent}
        style={styles.configBoxTextInput}
        maxLength={2}
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
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
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
    paddingHorizontal: (UnistylesRuntime.screen.width * 1) / 100,
  },
}));
