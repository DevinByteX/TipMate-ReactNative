import React from 'react';
import { Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useExternalLinkAlert } from '@hooks';
import { Library } from 'react-native-legal';
import { StyledIcons } from '../StyledIcons';

interface LicenseDetailsProps {
  licenceDetails?: Library;
}

export const StyledLicenseDetailsCard: React.FC<LicenseDetailsProps> = ({ licenceDetails }) => {
  const { styles } = useStyles(stylesheet);
  const openLink = useExternalLinkAlert();

  if (!licenceDetails) return null;

  const { name, version, licenses } = licenceDetails;

  return (
    <View style={styles.licenseMainContainer}>
      <View style={styles.libraryDetailsContainer}>
        <Text style={styles.libraryNameText}>{name}</Text>
        <Text style={styles.versionText}>v{version}</Text>
      </View>
      <View style={styles.iconContainer}>
        <StyledIcons
          type="Feather"
          name="chevron-right"
          size={20}
          color={styles.styledIcon.color}
        />
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  licenseMainContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    marginBottom: (UnistylesRuntime.screen.height * 2) / 100,
  },
  libraryDetailsContainer: {
    flex: 8,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  styledIcon: {
    color: colors.accent,
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
