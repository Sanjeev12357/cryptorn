import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CryptoRateCard from '../components/CryptoRateCard';
import FilterModal from '../components/FilterModal';
import { fetchCryptoData } from '../services/CryptoService';

const HomeScreen = ({ navigation }) => {
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('market_cap');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  // Filter button text mapping - moved outside to prevent re-creation
  const filterButtonText = useMemo(() => ({
    'market_cap': 'Market Cap',
    'current_price': 'Price',
    'price_change_percentage_24h': '24h Change',
    'total_volume': 'Volume',
    'name': 'Name'
  }), []);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortData();
  }, [cryptoData, searchQuery, sortBy, sortOrder]);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchCryptoData(100);
      const validData = data.filter(item => 
        item && 
        typeof item === 'object' && 
        item.id && 
        item.symbol && 
        item.name &&
        typeof item.current_price === 'number' &&
        !isNaN(item.current_price)
      );
      setCryptoData(validData);
    } catch (error) {
      console.error('Error loading data:', error);
      setCryptoData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterAndSortData = useCallback(() => {
    let filtered = [...cryptoData];

    // Search filter
    if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item =>
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.symbol && item.symbol.toLowerCase().includes(query))
      );
    }

    // Sort data
    filtered = filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'name') {
        aValue = (aValue || '').toLowerCase();
        bValue = (bValue || '').toLowerCase();
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
      
      if (aValue === null || aValue === undefined || isNaN(aValue)) aValue = 0;
      if (bValue === null || bValue === undefined || isNaN(bValue)) bValue = 0;
      
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    setFilteredData(filtered);
  }, [cryptoData, searchQuery, sortBy, sortOrder]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Memoize the render function to prevent re-renders
  const renderCryptoItem = useCallback(({ item, index }) => {
    if (!item || !item.id) return null;
    
    return (
      <CryptoRateCard
        crypto={item}
        onPress={() => navigation.navigate('CryptoDetail', { crypto: item })}
        isFirst={index === 0}
        isLast={index === filteredData.length - 1}
      />
    );
  }, [navigation, filteredData.length]);

  const handleApplyFilter = useCallback((newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setFilterModalVisible(false);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);



  // Memoize the header to prevent re-rendering
  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      <View style={styles.titleContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>₿</Text>
        </View>
        <Text style={styles.appTitle}>Crypto</Text>
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Rates</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="funnel-outline" size={16} color="#8E8E93" />
            <Text style={styles.filterText}>
              {filterButtonText[sortBy]} ({sortOrder === 'asc' ? '↑' : '↓'})
            </Text>
            <Ionicons name="chevron-down" size={16} color="#8E8E93" />
          </TouchableOpacity>
          
          
        </View>
      </View>

     
      
    </View>
  ), [sortBy, sortOrder, filteredData.length, filterButtonText]);

  // Stable keyExtractor
  const keyExtractor = useCallback((item) => item?.id || Math.random().toString(), []);

  return (
    <View style={styles.container}>
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <FlatList
          data={filteredData}
          renderItem={renderCryptoItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
              colors={['#007AFF']}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          // Critical prop to prevent keyboard from closing
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        />
      </View>

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onApplyFilter={handleApplyFilter}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  safeArea: {
    flex: 1,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    marginRight: 8,
    maxWidth: 170,
  },
  filterText: {
    fontSize: 12,
    color: '#8E8E93',
    marginHorizontal: 6,
    flexShrink: 1,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
  },
  newButtonText: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 6,
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
  listContainer: {
    paddingBottom: 20,
  },
});

export default HomeScreen;
