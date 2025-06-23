import React, { useState, useEffect,useCallback  } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CryptoRateCard from '../components/CryptoRateCard';
import { getWatchlist, removeFromWatchlist } from '../services/StorageService';

const WatchlistScreen = ({ navigation }) => {
  const [watchlist, setWatchlist] = useState([]);
   const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadWatchlist();
  }, []);
   useFocusEffect(
    useCallback(() => {
      loadWatchlist();
    }, [])
  );

  const loadWatchlist = async () => {
    try {
      const data = await getWatchlist();
      setWatchlist(data);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  };
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWatchlist();
    setRefreshing(false);
  }, []);
  const handleRemoveFromWatchlist = async (cryptoId) => {
    try {
      await removeFromWatchlist(cryptoId);
    setWatchlist(prev => prev.filter(item => item.id !== cryptoId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const handleCryptoPress = (crypto) => {
    navigation.navigate('CryptoDetail', { crypto });
  };

  const handleExplorePress = () => {
    navigation.navigate('Search');
  };

  const renderWatchlistItem = ({ item, index }) => (
    <View style={styles.watchlistItem}>
      <View style={styles.cryptoCardContainer}>
        <CryptoRateCard 
          crypto={item} 
          onPress={() => handleCryptoPress(item)}
          isFirst={index === 0}
          isLast={index === watchlist.length - 1}
        />
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFromWatchlist(item.id)}
      >
        <Ionicons name="close-circle" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="bookmark-outline" size={60} color="#8E8E93" />
      </View>
      <Text style={styles.emptyTitle}>No Watchlist Items</Text>
      <Text style={styles.emptySubtitle}>
        Add cryptocurrencies to your watchlist to track their performance
      </Text>
      <TouchableOpacity style={styles.exploreButton} onPress={handleExplorePress}>
        <Text style={styles.exploreButtonText}>Explore Cryptocurrencies</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>₿</Text>
        </View>
        <Text style={styles.appTitle}>My Watchlist</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{watchlist.length}</Text>
          <Text style={styles.statLabel}>
            {watchlist.length === 1 ? 'Item' : 'Items'}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {watchlist.filter(item => item.price_change_percentage_24h >= 0).length}
          </Text>
          <Text style={styles.statLabel}>Gaining</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {watchlist.filter(item => item.price_change_percentage_24h < 0).length}
          </Text>
          <Text style={styles.statLabel}>Losing</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <FlatList
          ListHeaderComponent={renderHeader}
          data={watchlist}
          renderItem={renderWatchlistItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
              colors={['#007AFF']}
            />
          }
          contentContainerStyle={[
            styles.listContainer,
            watchlist.length === 0 && styles.emptyListContainer
          ]}
        />
      </View>
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
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 10,
  },
  watchlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cryptoCardContainer: {
    flex: 1,
  },
  removeButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    marginRight: 8,
    borderRadius: 8,
    marginVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 280,
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 100, // Space for tab bar
  },
  emptyListContainer: {
    flexGrow: 1,
  },
});

export default WatchlistScreen;
