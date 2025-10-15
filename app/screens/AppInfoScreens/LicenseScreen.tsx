import React, { useEffect } from 'react';
import { FlatList, ScrollView, Text } from 'react-native';
import { StyledHeader, StyledLicenseDetailsCard } from '@components';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { UnistylesRuntime } from 'react-native-unistyles';
import { Library, ReactNativeLegal } from 'react-native-legal';

const LicensesScreen = () => {
  const { styles } = useStyles(stylesheet);

  const [libraryList, setLibraryList] = React.useState<Library[]>([]);

  useEffect(() => {
    const getLibraries = async () => {
      const result = await ReactNativeLegal.getLibrariesAsync();
      setLibraryList(result.data);
    };
    getLibraries();
  }, []);

  const keyExtractor = (item: Library) => {
    return item.id;
  };

  const libraryItem = ({ item }: { item: Library }) => {
    return <StyledLicenseDetailsCard key={item.id} licenceDetails={item} />;
  };

  return (
    <>
      <StyledHeader
        headerTitle={'Licenses'}
        headerSubTitle={'Third-Party Libraries'}
        headerRightIconVisibilty={false}
        enableBackButton={true}
      />
      <FlatList
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        data={libraryList}
        keyExtractor={keyExtractor}
        renderItem={libraryItem}
      />
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
