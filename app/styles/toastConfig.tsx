// App.jsx
import { Text, View } from 'react-native';
import {
  BaseToast,
  BaseToastProps,
  ErrorToast,
  ToastConfigParams,
} from 'react-native-toast-message';

/*
  1. Create the config
*/
export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink', backgroundColor: 'red' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.
  
    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({ text1, props }: ToastConfigParams<any>) => (
    <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
      <Text>{text1}</Text>
      {props?.uuid && <Text>{props.uuid}</Text>}
    </View>
  ),
  /*
    tomatoToast usage :
    Toast.show({
        type: 'tomatoToast',
        text1: `example text`,
        props:{
          uuid :'example uuid'
        }
      });
  */
};
