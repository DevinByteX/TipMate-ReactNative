import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { UnistylesRuntime } from 'react-native-unistyles';
import { Library } from 'react-native-legal';
import { StyledIcons } from '../StyledIcons';

interface LicenseDetailsProps {
  licenceDetails?: Library;
  onPress?: (licenceDetails: Library) => void;
}

interface LicenseDetailsProps {
  licenceDetails?: Library;
}

export const StyledLicenseDetailsCard: React.FC<LicenseDetailsProps> = ({
  licenceDetails,
  onPress,
}) => {
  const { styles } = useStyles(stylesheet);

  if (!licenceDetails) return null;

  const { name, version } = licenceDetails;

  const handleCardPress = () => {
    onPress?.(licenceDetails);
  };

  return (
    <Pressable style={styles.licenseMainContainer} onPress={handleCardPress}>
      <View style={styles.libraryDetailsContainer}>
        <Text style={styles.libraryNameText}>{name}</Text>
        <Text style={styles.versionText}>v{version}</Text>
      </View>
      <View style={styles.iconContainer}>
        <StyledIcons type="FontAwesome6" name="chevron-right" size={20} style={styles.styledIcon} />
      </View>
    </Pressable>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  licenseMainContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingVertical: (UnistylesRuntime.screen.height * 1.5) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    marginBottom: (UnistylesRuntime.screen.height * 1.5) / 100,
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
    marginLeft: (UnistylesRuntime.screen.width * 5) / 100,
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
