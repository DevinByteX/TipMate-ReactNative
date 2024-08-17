// App.jsx
import { Text, View } from 'react-native';
import {
  BaseToast,
  BaseToastProps,
  ErrorToast,
  ToastConfigParams,
} from 'react-native-toast-message';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';

/*
  1. Create the config
*/
export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: BaseToastProps) => {
    const { styles } = useStyles(stylesheet);
    return (
      <BaseToast
        {...props}
        style={styles.successToastStyle}
        contentContainerStyle={styles.successToastContainerStyle}
        text1Style={styles.successText1}
        text1NumberOfLines={2}
      />
    );
  },

  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: BaseToastProps) => {
    const { styles } = useStyles(stylesheet);
    return (
      <ErrorToast
        {...props}
        style={styles.errorToastStyle}
        contentContainerStyle={styles.errorToastContainerStyle}
        text1Style={styles.errorText1}
        text1NumberOfLines={2}
      />
    );
  },

  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.
    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
    *** USAGE : Toast.show({ type: 'tomatoToast', text1: `example text`, props:{ uuid :'example uuid'}, });
  */
  tomatoToast: ({ text1, props }: ToastConfigParams<any>) => {
    const { styles } = useStyles(stylesheet);
    return (
      <View style={styles.tomatoToastStyle}>
        <Text>{text1}</Text>
        {props?.uuid && <Text>{props.uuid}</Text>}
      </View>
    );
  },
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  successToastStyle: {
    borderLeftColor: colors.accent,
    backgroundColor: colors.backgroundColor,
    borderColor: colors.card,
    borderWidth: UnistylesRuntime.hairlineWidth,
  },
  successToastContainerStyle: {
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  successText1: { color: colors.accent, fontFamily: fonts.Nunito_Black, fontSize: 16 },
  errorToastStyle: {
    borderLeftColor: colors.error_toast,
    backgroundColor: colors.backgroundColor,
    borderColor: colors.card,
    borderWidth: UnistylesRuntime.hairlineWidth,
  },
  errorToastContainerStyle: {
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  errorText1: { color: colors.error_toast, fontFamily: fonts.Nunito_Black, fontSize: 16 },
  tomatoToastStyle: {
    height: (UnistylesRuntime.screen.height * 8) / 100,
    width: '100%',
    backgroundColor: colors.error_toast,
  },
}));
