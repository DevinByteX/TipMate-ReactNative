import { View, TextInput, NativeSyntheticEvent, TextInputEndEditingEventData } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { SplitOptionState, TipOptionState } from '@/context/types';
import { validateOptionValues } from '@hooks';

type StyledTextInputCapsuleProps = {
  textValue: number;
  previousValue: number;
  place?: number;
  suffix?: string;
  onValueChange?: ({
    place,
    preValue,
    newValue,
  }: {
    place: number;
    preValue: number;
    newValue: number;
  }) => void;
  optionsArray: SplitOptionState[] | TipOptionState[];
  minValidateValue: number;
  maxValidateValue: number;
};

export const StyledTextInputCapsule = ({
  textValue = 0,
  previousValue = 0,
  place = 0,
  suffix = '',
  onValueChange,
  optionsArray,
  minValidateValue,
  maxValidateValue,
}: StyledTextInputCapsuleProps) => {
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

    const validateMessages = validateOptionValues({
      place,
      newValue,
      optionsArray,
      minValue: minValidateValue,
      maxValue: maxValidateValue,
    });

    // If there are validation errors, dispatch an error message
    if (validateMessages?.length > 0) {
      setText(`${previousValue}${suffix}`);
      console.log(validateMessages?.join(' '));
      return;
    }

    // Call onValueChange if provided and if validation passed
    if (onValueChange) {
      onValueChange({
        place,
        preValue: previousValue,
        newValue,
      });
    }
  };

  return (
    <View
      style={[
        styles.tipEditViewCapsule,
        {
          backgroundColor: inputFocused ? theme.colors.accent : theme.colors.backgroundColor,
        },
      ]}>
      <TextInput
        selection={{ start: text.length - suffix.length, end: text.length - suffix.length }}
        style={[
          styles.tipEditViewCapsuleText,
          {
            color: inputFocused ? theme.colors.card : theme.colors.card_typography,
          },
        ]}
        contextMenuHidden
        keyboardType="numeric"
        maxLength={suffix.length + 2} // Adjust maxLength to include suffix length
        selectionColor={theme.colors.card}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onEndEditing={handleEndEditing}
        value={text}
        onChangeText={handleChangeText}
        returnKeyType="done"
      />
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  tipEditViewCapsule: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  tipEditViewCapsuleText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Black,
    color: colors.accent,
    width: '100%',
    height: '100%',
    padding: 0,
    textAlign: 'center',
  },
}));
