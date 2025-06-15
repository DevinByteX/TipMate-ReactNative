import { Alert, Linking } from 'react-native';

export const useExternalLinkAlert = () => {
    const handleLinkPress = (url: string) => {
        Alert.alert(
            'Open External Link',
            'You are about to open an external website. Do you want to continue?',
            [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Open',
                    style: 'default',
                    onPress: () => Linking.openURL(url),
                },
            ],
            { cancelable: true },
        );
    };

    return handleLinkPress;
};