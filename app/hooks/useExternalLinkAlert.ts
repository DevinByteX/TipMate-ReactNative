import { Alert, Linking } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';

export type ExternalLinkAlertConfig = {
    title?: string;
    message?: string;
    openText?: string;
    cancelText?: string;
};

const defaultConfig: Required<ExternalLinkAlertConfig> = {
    title: 'Open External Link',
    message: 'You are about to open an external website. Do you want to continue?',
    openText: 'Open',
    cancelText: 'Cancel',
};

export const useExternalLinkAlert = (config?: ExternalLinkAlertConfig) => {
    const baseConfig = { ...defaultConfig, ...config };

    const handleLinkPress = (
        url: string,
        overrideConfig?: ExternalLinkAlertConfig
    ) => {
        const mergedConfig = { ...baseConfig, ...overrideConfig };
        Alert.alert(
            mergedConfig.title,
            mergedConfig.message,
            [
                {
                    text: mergedConfig.cancelText,
                },
                {
                    text: mergedConfig.openText,
                    isPreferred: true,
                    onPress: () => Linking.openURL(url),
                },
            ],
            { cancelable: true, userInterfaceStyle: UnistylesRuntime.themeName === 'dark' ? 'dark' : 'light' },
        );
    };

    return handleLinkPress;
};

/*
========================
Usage Examples:

// 1. Import the hook
import { useExternalLinkAlert } from '../hooks/useExternalLinkAlert';

// 2. Use with default config
const openLink = useExternalLinkAlert();
openLink('https://example.com');

// 3. Use with custom default config
const openLink = useExternalLinkAlert({
    title: 'Default Title',
    message: 'Default message for all links.',
    openText: 'Proceed',
    cancelText: 'No',
});
openLink('https://example.com');

// 4. Override config per call
openLink('mailto:test@example.com', {
    title: 'Send Email',
    message: 'You are about to send an email. Continue?',
    openText: 'Send',
    cancelText: 'Cancel',
});

// 5. Use in a button
<Button
    title="Open Website"
    onPress={() => openLink('https://example.com')}
/>

// 6. Use in a custom component
<MyLinkComponent
    url="https://example.com"
    onPress={url => openLink(url, { title: 'Custom Title' })}
*/