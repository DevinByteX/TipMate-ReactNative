import { useState } from 'react';
import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

export type ExternalLinkAlertConfig = {
  title?: string;
  message?: string;
  openText?: string;
  cancelText?: string;
};

export const useExternalLinkAlert = (config?: ExternalLinkAlertConfig) => {
  const { t } = useTranslation();

  const defaultConfig: Required<ExternalLinkAlertConfig> = {
    title: t('externalLink.title'),
    message: t('externalLink.message'),
    openText: t('externalLink.openText'),
    cancelText: t('externalLink.cancelText'),
  };

  const baseConfig = { ...defaultConfig, ...config };
  const [alertState, setAlertState] = useState<{
    visible: boolean;
    url: string;
    config: Required<ExternalLinkAlertConfig>;
  }>({ visible: false, url: '', config: baseConfig });

  const handleLinkPress = (url: string, overrideConfig?: ExternalLinkAlertConfig) => {
    const mergedConfig = { ...baseConfig, ...overrideConfig };
    setAlertState({ visible: true, url, config: mergedConfig });
  };

  const confirmOpenLink = () => {
    Linking.openURL(alertState.url);
    setAlertState(prev => ({ ...prev, visible: false }));
  };

  const cancelOpenLink = () => {
    setAlertState(prev => ({ ...prev, visible: false }));
  };

  return { handleLinkPress, alertState, confirmOpenLink, cancelOpenLink };
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
