import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';

type styledTextInputProps = {
  titleText?: string;
  placeholderText?: string;
} & TextInputProps;

export const StyledTextInput = ({
  titleText = 'TOTAL AMOUNT',
  placeholderText = 'Tap to Enter Your Bill Amount',
  ...restProps
}: styledTextInputProps) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{`${titleText}`}</Text>
      <TextInput
        style={styles.textInputStyles}
        selectionColor={theme.colors.primary_accent}
        cursorColor={theme.colors.primary_accent}
        placeholder={`${placeholderText}`}
        allowFontScaling={false}
        {...restProps}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  mainContainer: {
    width: '100%',
    backgroundColor: colors.card,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
  },
  titleText: {
    color: colors.primary_accent,
    fontSize: 14,
    fontWeight: '800',
  },
  textInputStyles: {
    paddingTop: (UnistylesRuntime.screen.height * 1) / 100,
    color: colors.card_typography,
    fontSize: 20,
    fontWeight: '800',
  },
}));
