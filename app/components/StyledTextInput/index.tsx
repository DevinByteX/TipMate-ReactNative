import React from 'react';
import {
  KeyboardType,
  ReturnKeyType,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';

type styledTextInputProps = {
  placeholderText?: string;
  keyboardType?: KeyboardType;
  returnKeyType?: ReturnKeyType;
};

export const StyledTextInput = ({
  placeholderText = 'Tap to Enter Your Bill Amount',
  keyboardType,
  returnKeyType,
}: styledTextInputProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.mainContainer}>
      <TextInput
        style={styles.textInputStyles}
        placeholder={placeholderText}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
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
