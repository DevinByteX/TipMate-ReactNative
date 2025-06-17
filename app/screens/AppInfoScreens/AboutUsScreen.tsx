import React from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView, Alert } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { UnistylesRuntime } from 'react-native-unistyles';
import { StyledHeader } from '@components';
import { AppLogo } from '@/components/StyledSVGIcons';
import { useNavigation } from '@react-navigation/native';
import { useExternalLinkAlert } from '@hooks';
import { APP_LINKS, EMAILS, APP_INFO } from '@configs';

export const AboutUsScreen: React.FC = () => {
  const { styles, theme } = useStyles(stylesheet);

  const navigation = useNavigation();

  const openLink = useExternalLinkAlert();

  const handleNavigation = (screenName: string) => {
    // @ts-ignore
    navigation.navigate(screenName);
  };

  return (
    <>
      <StyledHeader
        headerTitle={'TipMate'}
        headerSubTitle={'Our Story & Vision'}
        headerRightIconVisibilty={false}
      />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <AppLogo
            colour={theme.colors.accent}
            backgroundColour={'transparent'}
            showBackground={false}
            height={(UnistylesRuntime.screen.width * 20) / 100}
            width={(UnistylesRuntime.screen.width * 20) / 100}
          />
        </View>
        <Text style={styles.description}>
          TipMate is a Smart Tip Calculator App that helps you calculate tips and split bills
          effortlessly. TipMate ensures convenience, accuracy, and ease of use, making the
          bill-splitting process smooth and hassle-free for everyone involved.
        </Text>
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { textDecorationLine: 'underline' }]}
            onPress={() => openLink(APP_LINKS.playStore)}>
            DevinForge Labs
          </Text>
          <Text style={styles.sectionText}>Contact us for support and feedback</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              openLink(`mailto:${EMAILS.support}`, {
                title: 'Contact Support',
                message:
                  'You are about to open your default email app to contact our support team. Do you want to continue?',
                openText: 'Continue',
                cancelText: 'Cancel',
              })
            }>
            <Text style={styles.linkText}>{EMAILS.support}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.feedbackText}>
          Your feedback is important to us in order to make TipMate better for you. Report us any
          bugs in our app, improvements and your suggestions regarding TipMate so we can serve you
          even better.
        </Text>
      </ScrollView>
      <View style={styles.acknowledgementsSection}>
        <Text style={styles.sectionTitle}>Acknowledgements</Text>
        <View style={styles.socialLinks}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              handleNavigation('LicensesScreen');
            }}
            style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Third-Party Licences</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => openLink(APP_LINKS.privacyPolicy)}
            style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.versionText}>App version: {APP_INFO.version}</Text>
      </View>
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
  socialLinks: {
    flexDirection: 'row',
    gap: (UnistylesRuntime.screen.width * 4) / 100,
  },
  socialButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  socialButtonText: {
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
