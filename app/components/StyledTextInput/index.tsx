import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';

type styledTextInputProps = {
  placeholderText?: string;
} & TextInputProps;

export const StyledTextInput = ({
  placeholderText = 'Tap to Enter Your Bill Amount',
  ...restProps
}: styledTextInputProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.mainContainer}>
      <TextInput
        style={styles.textInputStyles}
        placeholder={placeholderText}
        {...restProps}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  mainContainer: {
    width: '100%',
  },
  textInputStyles: {
    paddingTop: (UnistylesRuntime.screen.height * 1) / 100,
  },
}));
