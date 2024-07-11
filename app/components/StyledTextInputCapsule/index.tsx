import { View, TextInput } from 'react-native';
import React, { useState } from 'react';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';

export const StyledTextInputCapsule = ({
  textValue = 0,
  suffix = '',
}: {
  textValue?: number;
  suffix?: string;
}) => {
  const { styles, theme } = useStyles(stylesheet);
  const [inputFocused, setInputFocused] = useState(false);
  const [text, setText] = useState(`${textValue}${suffix}`);

  const handleChangeText = (inputText: string) => {
    // Remove non-numeric characters
    let cleanedText = inputText.replace(/[^0-9]/g, '');
    // Ensure the suffix is appended
    if (!cleanedText.endsWith(suffix)) {
      cleanedText = cleanedText.replace(suffix, '');
      setText(cleanedText + suffix);
    } else {
      setText(cleanedText);
    }
  };

  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
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
        contextMenuHidden={true}
        keyboardType="numeric"
        maxLength={suffix.length + 2} // Adjust maxLength to include suffix length
        selectionColor={theme.colors.card}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={text} // Use controlled component pattern
        onChangeText={handleChangeText}
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
