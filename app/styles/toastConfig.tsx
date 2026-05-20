// App.jsx
import { Text, View } from 'react-native';
import {
  BaseToast,
  BaseToastProps,
  ErrorToast,
  ToastConfigParams,
} from 'react-native-toast-message';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';

const SuccessToast = (props: BaseToastProps) => {
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
};

const AppErrorToast = (props: BaseToastProps) => {
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
};

const TomatoToast = ({ text1, props }: ToastConfigParams<any>) => {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.tomatoToastStyle}>
      <Text>{text1}</Text>
      {props?.uuid && <Text>{props.uuid}</Text>}
    </View>
  );
};

export const toastConfig = {
  success: SuccessToast,
  error: AppErrorToast,
  tomatoToast: TomatoToast,
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  successToastStyle: {
    borderStartColor: colors.accent, // for Android to change left border color
    borderLeftColor: colors.accent, // for iOS to change left border color
    backgroundColor: colors.backgroundColor,
    borderColor: colors.card,
    borderWidth: UnistylesRuntime.hairlineWidth,
  },
  successToastContainerStyle: {
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  successText1: { color: colors.accent, fontFamily: fonts.Nunito_Black, fontSize: 14 },
  errorToastStyle: {
    borderLeftColor: colors.error_toast,
    backgroundColor: colors.backgroundColor,
    borderColor: colors.card,
    borderWidth: UnistylesRuntime.hairlineWidth,
  },
  errorToastContainerStyle: {
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  errorText1: { color: colors.error_toast, fontFamily: fonts.Nunito_Black, fontSize: 14 },
  tomatoToastStyle: {
    height: (UnistylesRuntime.screen.height * 8) / 100,
    width: '100%',
    backgroundColor: colors.error_toast,
  },
}));
