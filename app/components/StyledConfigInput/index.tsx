import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
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
  const TextInputRef = useRef<TextInput>(null);
  const { styles, theme } = useStyles(stylesheet);
  const [inputFocused, setInputFocused] = useState(false);
  const [text, setText] = useState(`${textValue}${suffix}`);

  const focusScale = useSharedValue(1);

  useEffect(() => {
    focusScale.value = withSpring(inputFocused ? 1.03 : 1, {
      damping: 15,
      stiffness: 200,
      mass: 0.6,
    });
  }, [inputFocused]);

  const focusAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: focusScale.value }],
  }));

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
    <Pressable
      onPress={() => TextInputRef.current?.focus()}
      style={[
        styles.configInputBox,
        {
          borderColor: inputFocused ? theme.colors.accent : theme.colors.backgroundColor,
        },
      ]}
    >
      <Animated.View style={[styles.configInputInner, focusAnimatedStyle]}>
        <Text style={styles.configBoxText}>{`${title}`}</Text>
        <TextInput
        ref={TextInputRef}
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
      </Animated.View>
    </Pressable>
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
  configInputInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
