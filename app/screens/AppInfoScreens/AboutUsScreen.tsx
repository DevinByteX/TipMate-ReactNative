import React from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { UnistylesRuntime } from 'react-native-unistyles';
import { StyledHeader, StyledAlert } from '@components';
import { AppLogo } from '@/components/StyledSVGIcons';
import { useNavigation } from '@react-navigation/native';
import { useExternalLinkAlert } from '@hooks';
import { APP_LINKS, EMAILS, APP_INFO } from '@configs';
import { useTranslation } from 'react-i18next';

export const AboutUsScreen: React.FC = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { t } = useTranslation();

  const navigation = useNavigation();

  const { handleLinkPress, alertState, confirmOpenLink, cancelOpenLink } = useExternalLinkAlert();

  const handleNavigation = (screenName: string) => {
    // @ts-ignore
    navigation.navigate(screenName);
  };

  return (
    <>
      <StyledHeader
        headerTitle={t('screens.home.title')}
        headerSubTitle={t('screens.appInfo.ourStory')}
        headerRightIconVisibilty={false}
      />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <AppLogo
            colour={theme.colors.accent}
            backgroundColour={'transparent'}
            showBackground={false}
            height={(UnistylesRuntime.screen.width * 20) / 100}
            width={(UnistylesRuntime.screen.width * 20) / 100}
          />
        </View>
        <Text style={styles.description}>{t('screens.appInfo.story')}</Text>
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { textDecorationLine: 'underline' }]}
            onPress={() =>
              handleLinkPress(Platform.OS === 'ios' ? APP_LINKS.appStore : APP_LINKS.playStore)
            }
          >
            {t('screens.appInfo.developer')}
          </Text>
          <Text style={styles.sectionText}>{t('screens.appInfo.contactDescription')}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('screens.appInfo.support')}</Text>
          <Pressable
            onPress={() =>
              handleLinkPress(`mailto:${EMAILS.support}`, {
                title: t('screens.appInfo.contactConfirmTitle'),
                message: t('screens.appInfo.contactConfirmMessage'),
                openText: t('screens.appInfo.contactConfirmButtonContinue'),
                cancelText: t('common.cancel'),
              })
            }
          >
            <Text style={styles.linkText}>{EMAILS.support}</Text>
          </Pressable>
        </View>
        <Text style={styles.feedbackText}>{t('screens.appInfo.feedbackDescription')}</Text>
      </ScrollView>
      <View style={styles.acknowledgementsSection}>
        <Text style={styles.sectionTitle}>{t('screens.appInfo.acknowledgements')}</Text>
        <View style={styles.acknowledgementLinks}>
          <Pressable
            onPress={() => {
              handleNavigation('LicensesScreen');
            }}
            style={styles.acknowledgementButton}
          >
            <Text style={styles.acknowledgementButtonText}>
              {t('screens.appInfo.thirdPartyLibraries')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleLinkPress(APP_LINKS.privacyPolicy)}
            style={styles.acknowledgementButton}
          >
            <Text style={styles.acknowledgementButtonText}>
              {t('screens.appInfo.privacyPolicy')}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.versionText}>
          {t('screens.appInfo.appVersion')} {APP_INFO.version}
        </Text>
      </View>

      {/* External Link Alert */}
      <StyledAlert
        visible={alertState.visible}
        title={alertState.config.title}
        message={alertState.config.message}
        type="info"
        buttons={[
          {
            text: alertState.config.cancelText,
            style: 'cancel',
            onPress: cancelOpenLink,
          },
          {
            text: alertState.config.openText,
            style: 'default',
            onPress: confirmOpenLink,
          },
        ]}
        onDismiss={cancelOpenLink}
      />
    </>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  scrollContentContainer: {},
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: (UnistylesRuntime.screen.width * 40) / 100,
    height: (UnistylesRuntime.screen.width * 40) / 100,
  },
  description: {
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
    marginBottom: (UnistylesRuntime.screen.height * 1.5) / 100,
  },
  section: {
    backgroundColor: colors.backgroundColor,
    marginBottom: (UnistylesRuntime.screen.height * 1.5) / 100,
  },
  sectionTitle: {
    color: colors.accent,
    fontFamily: fonts.Nunito_Bold,
    fontSize: 18,
    marginBottom: (UnistylesRuntime.screen.height * 1.5) / 100,
  },
  sectionText: {
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 16,
  },
  acknowledgementsSection: {
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingBottom: UnistylesRuntime.insets.bottom / 2 + UnistylesRuntime.navigationBar.height,
  },
  linkText: {
    color: colors.accent,
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  feedbackText: {
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 14,
    lineHeight: 20,
    marginVertical: (UnistylesRuntime.screen.height * 1.5) / 100,
  },
  acknowledgementLinks: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: (UnistylesRuntime.screen.width * 4) / 100,
  },
  acknowledgementButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acknowledgementButtonText: {
    color: colors.backgroundColor,
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 14,
  },
  versionText: {
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 14,
    textAlign: 'center',
    marginTop: (UnistylesRuntime.screen.height * 1.5) / 100,
  },
}));

export default AboutUsScreen;
