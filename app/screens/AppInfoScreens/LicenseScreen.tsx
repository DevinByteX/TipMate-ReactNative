import React from 'react';
import { ScrollView } from 'react-native';
import { StyledHeader, StyledLicenseDetailsCard } from '@components';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { UnistylesRuntime } from 'react-native-unistyles';
import licenses from '../../assets/oss-licenses.json';
import { parsePackageName } from '@/hooks/parsePackageName';

const LicensesScreen = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <StyledHeader
        headerTitle={'Licenses'}
        headerSubTitle={'Third-Party Libraries'}
        headerRightIconVisibilty={false}
        enableBackButton={true}
      />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {Object.entries(licenses).map(([packageName, details], index) => {
          const { name, version } = parsePackageName(packageName);
          return (
            <StyledLicenseDetailsCard
              key={index}
              name={name}
              version={version}
              license={details.licenses}
              repository={details.repository}
              licenseUrl={details.licenseUrl}
            />
          );
        })}
      </ScrollView>
    </>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  scrollContentContainer: {
    paddingBottom: UnistylesRuntime.insets.bottom * 2,
  },
}));

export default LicensesScreen;
