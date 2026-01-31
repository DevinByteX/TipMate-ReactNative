import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
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

const styles = StyleSheet.create(({ colors, fonts }, rt) => ({
  licenseMainContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingVertical: (rt.screen.height * 1.5) / 100,
    paddingHorizontal: (rt.screen.width * 5) / 100,
    borderRadius: (rt.screen.height * 1) / 100,
    marginBottom: (rt.screen.height * 1.5) / 100,
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
    marginLeft: (rt.screen.width * 5) / 100,
  },
  libraryNameText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: fonts.Nunito_Black,
    marginBottom: (rt.screen.height * 0.5) / 100,
  },
  versionText: {
    fontSize: 12,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Bold,
    marginBottom: (rt.screen.height * 0.5) / 100,
  },
}));
