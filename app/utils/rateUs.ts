import { Linking, Platform } from 'react-native';

interface RateUsParams {
  onError?: () => void;
}

export const handleRateUs = async ({ onError }: RateUsParams = {}) => {
  const APPLE_STORE_ID = 'idXXXXXXXXXX'; // Replace with actual iOS App Store ID
  const PLAY_STORE_PACKAGE = 'com.devinapps.tips.tipcalculator';

  const url =
    Platform.OS === 'ios'
      ? `itms-apps://itunes.apple.com/app/viewContentsUserReviews?id=${APPLE_STORE_ID}&action=write-review`
      : `market://details?id=${PLAY_STORE_PACKAGE}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      const webUrl =
        Platform.OS === 'ios'
          ? `https://apps.apple.com/app/id${APPLE_STORE_ID}?action=write-review`
          : `https://play.google.com/store/apps/details?id=${PLAY_STORE_PACKAGE}`;
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    if (onError) {
      onError();
    }
  }
};
