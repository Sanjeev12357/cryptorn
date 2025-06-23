import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoRateCard from '../components/CryptoRateCard';
import { fetchCryptoData } from '../services/CryptoService';

const RECENT_SEARCHES_KEY = 'recent_searches';

// Isolated SearchInput component to prevent re-renders
const SearchInput = React.memo(({ searchQuery, onChangeText, onClear }) => {
  const inputRef = React.useRef(null);
  
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
      <TextInput
        ref={inputRef}
        style={styles.searchInput}
        placeholder="Search cryptocurrencies..."
        placeholderTextColor="#8E8E93"
        value={searchQuery}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        keyboardShouldPersistTaps="handled"
        blurOnSubmit={false}
        autoFocus={false}
        clearButtonMode="never"
        enablesReturnKeyAutomatically={false}
        onSubmitEditing={() => {
          inputRef.current?.focus();
        }}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color="#8E8E93" />
        </TouchableOpacity>
      )}
    </View>
  );
});

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popularCryptos, setPopularCryptos] = useState([]);
  const [allCryptos, setAllCryptos] = useState([]); // Store all crypto data for searching
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadRecentSearches();
    loadAllCryptos();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length > 0) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadRecentSearches = useCallback(async () => {
    try {
      const storedSearches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, []);

  const loadAllCryptos = useCallback(async () => {
    try {
      // Load more cryptos for better search results
      const data = await fetchCryptoData(250); // Increased from 10 to 250
      setAllCryptos(data);
      // Set first 10 as popular
      setPopularCryptos(data.slice(0, 10));
    } catch (error) {
      console.error('Error loading cryptos:', error);
    }
  }, []);

  const saveRecentSearch = useCallback(async (query) => {
    try {
      setRecentSearches(prev => {
        const updatedSearches = [query, ...prev.filter(item => item !== query)];
        const limitedSearches = updatedSearches.slice(0, 10);
        AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(limitedSearches));
        return limitedSearches;
      });
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  }, []);

  const performSearch = useCallback(async () => {
    setLoading(true);
    try {
      // Search within the loaded crypto data
      const query = searchQuery.toLowerCase().trim();
      const results = allCryptos.filter(crypto => 
        crypto.name.toLowerCase().includes(query) ||
        crypto.symbol.toLowerCase().includes(query)
      );
      
      setSearchResults(results);
      
      if (searchQuery.trim()) {
        await saveRecentSearch(searchQuery.trim());
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, allCryptos, saveRecentSearch]);

  // Memoized handlers to prevent re-creation
  const handleSearchChange = useCallback((text) => {
    setSearchQuery(text);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleCryptoPress = useCallback((crypto) => {
    navigation.navigate('CryptoDetail', { crypto });
  }, [navigation]);

  const handleRecentSearchPress = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const clearRecentSearches = useCallback(async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }, []);

  const renderRecentSearch = useCallback(({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.recentSearchItem,
        index === recentSearches.length - 1 && styles.lastRecentItem
      ]}
      onPress={() => handleRecentSearchPress(item)}
    >
      <View style={styles.recentSearchLeft}>
        <Ionicons name="time-outline" size={18} color="#8E8E93" />
        <Text style={styles.recentSearchText}>{item}</Text>
      </View>
      <Ionicons name="arrow-up-outline" size={16} color="#8E8E93" style={styles.rotateIcon} />
    </TouchableOpacity>
  ), [recentSearches.length, handleRecentSearchPress]);

  const renderSearchResult = useCallback(({ item, index }) => (
    <CryptoRateCard
      crypto={item}
      onPress={() => handleCryptoPress(item)}
      isFirst={index === 0}
      isLast={index === searchResults.length - 1}
    />
  ), [handleCryptoPress, searchResults.length]);

  const renderPopularCrypto = useCallback(({ item, index }) => (
    <CryptoRateCard
      crypto={item}
      onPress={() => handleCryptoPress(item)}
      isFirst={index === 0}
      isLast={index === popularCryptos.length - 1}
    />
  ), [handleCryptoPress, popularCryptos.length]);

  const headerComponent = useMemo(() => (
    <View style={styles.headerContainer}>
      <View style={styles.titleContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>₿</Text>
        </View>
        <Text style={styles.appTitle}>Search Cryptocurrencies</Text>
      </View>

      <SearchInput
        searchQuery={searchQuery}
        onChangeText={handleSearchChange}
        onClear={handleSearchClear}
      />

      {searchQuery.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.searchResultsText}>
            {loading ? 'Searching...' : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`}
          </Text>
        </View>
      )}
    </View>
  ), [searchQuery, loading, searchResults.length, handleSearchChange, handleSearchClear]);

  const keyExtractor = useCallback((item, index) => item?.id || index.toString(), []);

  const renderEmptySearch = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={60} color="#8E8E93" />
      <Text style={styles.emptyTitle}>No Results Found</Text>
      <Text style={styles.emptySubtitle}>
        Try searching for a different cryptocurrency name or symbol
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        {searchQuery.length > 0 ? (
          // Search Results
          <FlatList
            ListHeaderComponent={headerComponent}
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none"
            contentContainerStyle={styles.resultsContainer}
            removeClippedSubviews={false}
            nestedScrollEnabled={false}
            ListEmptyComponent={!loading ? renderEmptySearch : null}
          />
        ) : (
          // Default Content
          <FlatList
            ListHeaderComponent={headerComponent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none"
            contentContainerStyle={styles.scrollContainer}
            removeClippedSubviews={false}
            nestedScrollEnabled={false}
            ListFooterComponent={() => (
              <View style={styles.defaultContent}>
                {recentSearches.length > 0 && (
                  <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Recent Searches</Text>
                      <TouchableOpacity onPress={clearRecentSearches}>
                        <Text style={styles.clearAllText}>Clear All</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.recentSearchesContainer}>
                      <FlatList
                        data={recentSearches}
                        renderItem={renderRecentSearch}
                        keyExtractor={keyExtractor}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        keyboardShouldPersistTaps="handled"
                        removeClippedSubviews={false}
                      />
                    </View>
                  </View>
                )}

                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Popular Cryptocurrencies</Text>
                  <FlatList
                    data={popularCryptos}
                    renderItem={renderPopularCrypto}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    keyboardShouldPersistTaps="handled"
                    removeClippedSubviews={false}
                  />
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

// ... styles remain the same

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  clearButton: {
    marginLeft: 8,
  },
  searchResultsContainer: {
    paddingTop: 10,
  },
  searchResultsText: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  defaultContent: {
    flex: 1,
    paddingBottom: 100,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  clearAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  recentSearchesContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recentSearchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  lastRecentItem: {
    borderBottomWidth: 0,
  },
  recentSearchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recentSearchText: {
    color: '#1C1C1E',
    fontSize: 16,
    marginLeft: 12,
  },
  rotateIcon: {
    transform: [{ rotate: '45deg' }],
  },
  resultsContainer: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SearchScreen;
