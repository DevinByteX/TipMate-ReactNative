import { useEffect, useState, useMemo, useRef } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { StyledHeader, StyledLicenseDetailsCard, StyledIcons } from '@components';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useVisibilityAnimation } from '@hooks';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { Library, ReactNativeLegal } from 'react-native-legal';
import { useTranslation } from 'react-i18next';

/**
 * LicensesScreen component displays a list of third-party libraries used in the app
 * with their license information. It provides search functionality and a scroll-to-top button.
 */
const LicensesScreen = () => {
  const { styles } = useStyles(stylesheet);
  const { t } = useTranslation();
  const navigation = useNavigation();

  // State for managing library data and UI interactions
  const [libraryList, setLibraryList] = useState<Library[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Refs for FlatList and animation
  const flatListRef = useRef<FlatList>(null);
  const { animatedStyle: scrollButtonStyle } = useVisibilityAnimation(showScrollToTop);

  // Fetch libraries on component mount
  useEffect(() => {
    const getLibraries = async () => {
      const result = await ReactNativeLegal.getLibrariesAsync();
      setLibraryList(result.data);
    };
    getLibraries();
  }, []);

  /**
   * Filters the library list based on the search query.
   * Searches in library names and license content.
   */
  const getFilteredLibraries = useMemo(() => {
    if (!searchQuery.trim()) {
      return libraryList;
    }
    const query = searchQuery.toLowerCase();
    return libraryList.filter(library => {
      const nameMatch = library.name.toLowerCase().includes(query);
      const licenseContentMatch =
        library.licenses?.[0]?.licenseContent?.toLowerCase().includes(query) ?? false;
      return nameMatch || licenseContentMatch;
    });
  }, [libraryList, searchQuery]);

  /**
   * Handles navigation to the license content modal when a library is pressed.
   */
  const handleLicensePress = (licenceDetails: Library) => {
    (navigation as any).navigate('LicenseContentModal', { licenceDetails });
  };

  /**
   * Handles scroll events to show/hide the scroll-to-top button.
   */
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    const scrollThreshold = 200; // Show button after scrolling 200px
    setShowScrollToTop(scrollPosition > scrollThreshold);
  };

  /**
   * Scrolls the FlatList to the top.
   */
  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  /**
   * Key extractor for FlatList items.
   */
  const keyExtractor = (item: Library) => {
    return item.id;
  };

  /**
   * Render function for individual library items in the FlatList.
   */
  const renderLibraryItem = ({ item }: { item: Library }) => {
    return (
      <StyledLicenseDetailsCard key={item.id} licenceDetails={item} onPress={handleLicensePress} />
    );
  };

  /**
   * Renders the empty state when no libraries match the search query.
   */
  const renderEmptyComponent = () => {
    if (!searchQuery) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {t('savedTipsList.noResultsMatch', { query: searchQuery })}
        </Text>
      </View>
    );
  };

  return (
    <>
      <StyledHeader
        headerTitle={t('screens.licenses.title')}
        headerSubTitle={t('screens.licenses.subtitle')}
        headerRightIconVisibilty={false}
        enableBackButton={true}
      />
      <View style={styles.searchContainer}>
        <TextInput
          autoFocus={false}
          placeholder={t('screens.licenses.searchPlaceholder')}
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
        ref={flatListRef}
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContentContainer}
        data={getFilteredLibraries}
        keyExtractor={keyExtractor}
        renderItem={renderLibraryItem}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={renderEmptyComponent()}
      />
      <Animated.View
        style={[
          styles.scrollToTopButton,
          scrollButtonStyle,
        ]}
      >
        <Pressable onPress={scrollToTop} style={styles.scrollToTopIcon}>
          <StyledIcons
            type="Feather"
            name="arrow-up"
            size={24}
            color={styles.scrollToTopIcon.color}
          />
        </Pressable>
      </Animated.View>
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
    fontFamily: fonts.Montserrat_Bold,
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
  scrollToTopButton: {
    position: 'absolute',
    backgroundColor: colors.accent,
    width: (UnistylesRuntime.screen.width * 12) / 100,
    height: (UnistylesRuntime.screen.width * 12) / 100,
    borderRadius: (UnistylesRuntime.screen.width * 12) / 100,
    bottom: UnistylesRuntime.insets.bottom + (UnistylesRuntime.screen.height * 2) / 100,
    right: (UnistylesRuntime.screen.width * 5) / 100,
    elevation: 5,
    shadowColor: colors.card_typography,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  scrollToTopIcon: {
    color: colors.backgroundColor,
    width: (UnistylesRuntime.screen.width * 12) / 100,
    height: (UnistylesRuntime.screen.width * 12) / 100,
    borderRadius: (UnistylesRuntime.screen.width * 12) / 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default LicensesScreen;
