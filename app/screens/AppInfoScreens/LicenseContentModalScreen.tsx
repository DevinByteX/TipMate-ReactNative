import React from 'react';
import { ScrollView, Text, View, Pressable, StatusBar, Platform } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Library } from 'react-native-legal';
import { StyledIcons } from '@components';
import { useExternalLinkAlert } from '@hooks';

const LicenseContentModalScreen: React.FC = () => {
  const { styles } = useStyles(stylesheet);
  const navigation = useNavigation();
  const openLink = useExternalLinkAlert();
  const route = useRoute();
  const { licenceDetails } = route.params as { licenceDetails: Library };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={handleClose}>
          <StyledIcons
            type="FontAwesome6"
            name="chevron-left"
            size={20}
            color={styles.backButtonIcon.color}
          />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{licenceDetails.name}</Text>
          <Text style={styles.subtitleText}>v{licenceDetails.version}</Text>
        </View>
      </View>
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {licenceDetails?.website ? (
          <Text
            style={styles.licenseWebsiteUrl}
            onPress={() => openLink(licenceDetails.website ?? '')}
          >
            {licenceDetails?.website}
          </Text>
        ) : null}
        <Text style={styles.licenseContentText}>{licenceDetails?.licenses[0]?.licenseContent}</Text>
      </ScrollView>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }, runtime) => ({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    backgroundColor: colors.headerBGColor,
    borderBottomWidth: runtime.hairlineWidth * 5,
    borderBottomColor: colors.accent,
    marginTop: Platform.OS === 'android' ? UnistylesRuntime.insets.top : 0,
  },
  backButton: {
    paddingEnd: (UnistylesRuntime.screen.width * 5) / 100,
  },
  backButtonIcon: {
    color: colors.accent,
  },
  titleContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontFamily: fonts.Nunito_Black,
    color: colors.accent,
    marginBottom: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  subtitleText: {
    fontSize: 12,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card_typography,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  scrollContentContainer: {
    paddingBottom: UnistylesRuntime.insets.bottom * 2,
  },
  licenseWebsiteUrl: {
    color: colors.accent,
    fontFamily: fonts.Montserrat_Bold,
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
    paddingVertical: (UnistylesRuntime.screen.height * 1) / 100,
  },
  licenseContentText: {
    paddingTop: (UnistylesRuntime.screen.height * 2) / 100,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 12,
    lineHeight: 14,
  },
}));

export default LicenseContentModalScreen;
