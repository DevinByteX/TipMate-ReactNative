import React from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Library } from 'react-native-legal';
import { StyledIcons } from '@components';

const LicenseContentModalScreen: React.FC = () => {
  const { styles } = useStyles(stylesheet);
  const navigation = useNavigation();
  const route = useRoute();
  const { licenceDetails } = route.params as { licenceDetails: Library };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleClose}>
          <StyledIcons
            type="FontAwesome6"
            name="chevron-left"
            size={20}
            color={styles.backButtonIcon.color}
          />
        </TouchableOpacity>
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
        <Text style={styles.licenseContentText}>{licenceDetails?.licenses[0]?.licenseContent}</Text>
      </ScrollView>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
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
    borderBottomWidth: 1,
    borderBottomColor: colors.devider,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
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
    marginBottom: 4,
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
  licenseContentText: {
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    fontSize: 14,
    lineHeight: 16,
  },
}));

export default LicenseContentModalScreen;
