import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, ScrollView, Text, TextInput, View } from 'react-native';
import { StyledHeader, StyledLicenseDetailsCard } from '@components';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { Library, ReactNativeLegal } from 'react-native-legal';

const LicensesScreen = () => {
  const { styles } = useStyles(stylesheet);
  const navigation = useNavigation();

  const [libraryList, setLibraryList] = useState<Library[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getLibraries = async () => {
      const result = await ReactNativeLegal.getLibrariesAsync();
      setLibraryList(result.data);
    };
    getLibraries();
  }, []);

  const filteredLibraries = useMemo(() => {
    if (!searchQuery.trim()) {
      return libraryList;
    }
    return libraryList.filter(library =>
      library.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [libraryList, searchQuery]);

  const handleLicensePress = (licenceDetails: Library) => {
    (navigation as any).navigate('LicenseContentModal', { licenceDetails });
  };

  const keyExtractor = (item: Library) => {
    return item.id;
  };

  const libraryItem = ({ item }: { item: Library }) => {
    return (
      <StyledLicenseDetailsCard key={item.id} licenceDetails={item} onPress={handleLicensePress} />
    );
  };

  return (
    <>
      <StyledHeader
        headerTitle={'Licenses'}
        headerSubTitle={'Third-Party Libraries'}
        headerRightIconVisibilty={false}
        enableBackButton={true}
      />
      <View style={styles.searchContainer}>
        <TextInput
          autoFocus={false}
          placeholder="Looking for a library?"
          value={searchQuery}
          maxLength={50}
          style={styles.searchInput}
          selectionColor={styles.searchInput.placeholderTextColor}
          placeholderTextColor={styles.searchInput.placeholderTextColor}
          keyboardType="default"
          returnKeyType="search"
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardAppearance={UnistylesRuntime.themeName === 'dark' ? 'dark' : 'light'}
        />
      </View>
      <FlatList
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        data={filteredLibraries}
        keyExtractor={keyExtractor}
        renderItem={libraryItem}
        ListEmptyComponent={
          searchQuery ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No libraries found matching "{searchQuery}"</Text>
            </View>
          ) : null
        }
      />
    </>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts }) => ({
  searchContainer: {
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1.5) / 100,
    backgroundColor: colors.backgroundColor,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 1.5) / 100,
    fontSize: 16,
    fontFamily: fonts.Montserrat_Medium,
    color: colors.card_typography,
    placeholderTextColor: colors.accent,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
  },
  scrollContentContainer: {
    paddingBottom: UnistylesRuntime.insets.bottom * 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: (UnistylesRuntime.screen.height * 10) / 100,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.Montserrat_Medium,
    color: colors.card_typography,
    textAlign: 'center',
  },
}));

export default LicensesScreen;
