import React from 'react';
import { ScrollView, Text, View, Linking, Alert } from 'react-native';
import { StyledHeader } from '@components';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import licenses from '../../assets/oss-licenses.json';

const LicensesScreen = () => {
  const { styles } = useStyles(stylesheet);

  const handleLinkPress = (url: string) => {
    Alert.alert(
      'Open External Link',
      'You are about to open an external website. Do you want to continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Open',
          onPress: () => Linking.openURL(url)
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <StyledHeader
        headerTitle={'Licenses'}
        headerSubTitle={'Third-Party Libraries'}
        headerRightIconVisibilty={false}
      />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {Object.entries(licenses).map(([packageName, details], index) => {
          const lastAtIndex = packageName.lastIndexOf('@');
          const name = packageName.slice(0, lastAtIndex);
          const version = packageName.slice(lastAtIndex + 1);

          return (
            <View key={index} style={styles.licenseMainContainer}>
              <Text style={styles.libraryNameText}>{name}</Text>
              <Text style={styles.versionText}>Version: {version}</Text>
              <Text style={styles.licenseText}>License: {details.licenses}</Text>
              <Text
                style={styles.repositoryText}
                onPress={() => handleLinkPress(details.repository)}
              >
                Repository: {details.repository}
              </Text>
              <Text
                style={styles.licenseUrlText}
                onPress={() => handleLinkPress(details.licenseUrl)}
              >
                License URL: {details.licenseUrl}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  scrollContentContainer: {
    paddingBottom: UnistylesRuntime.insets.bottom * 2,
  },
  licenseMainContainer: {
    width: '100%',
    backgroundColor: colors.card,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    marginBottom: (UnistylesRuntime.screen.height * 2) / 100,
  },
  libraryNameText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
    marginBottom: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  versionText: {
    fontSize: 10,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginBottom: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  licenseText: {
    fontSize: 10,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    marginBottom: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  repositoryText: {
    fontSize: 10,
    color: colors.accent,
    fontFamily: fonts.Montserrat_Medium,
    textDecorationLine: 'underline',
    marginBottom: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  licenseUrlText: {
    fontSize: 10,
    color: colors.accent,
    fontFamily: fonts.Montserrat_Medium,
    textDecorationLine: 'underline',
  },
}));

export default LicensesScreen;