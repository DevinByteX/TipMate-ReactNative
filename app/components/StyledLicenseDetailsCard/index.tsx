import React from 'react';
import { Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useExternalLinkAlert } from '@hooks';
import { Library } from 'react-native-legal';

interface LicenseDetailsProps {
  licenceDetails?: Library;
}

export const StyledLicenseDetailsCard: React.FC<LicenseDetailsProps> = ({ licenceDetails }) => {
  const { styles } = useStyles(stylesheet);
  const openLink = useExternalLinkAlert();

  if (!licenceDetails) return null;

  const { name, version } = licenceDetails;

  return (
    <View style={styles.licenseMainContainer}>
      <Text style={styles.libraryNameText}>{name}</Text>
      <Text style={styles.versionText}>v{version}</Text>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
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
    fontSize: 12,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Bold,
    marginBottom: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
}));
