import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { getCryptoPriceHistory } from '../services/CryptoService';
import { addToWatchlist, removeFromWatchlist, getWatchlist } from '../services/StorageService';

const { width } = Dimensions.get('window');

const CryptoDetailScreen = ({ route, navigation }) => {
  const { crypto } = route.params;
  const [priceHistory, setPriceHistory] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadPriceHistory();
    checkWatchlistStatus();
  }, []);

  const loadPriceHistory = async () => {
    try {
      const history = await getCryptoPriceHistory(crypto.id, 7);
      setPriceHistory(history);
    } catch (error) {
      console.error('Error loading price history:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const watchlist = await getWatchlist();
      const exists = watchlist.find(item => item.id === crypto.id);
      setIsInWatchlist(!!exists);
    } catch (error) {
      console.error('Error checking watchlist:', error);
    }
  };

  const toggleWatchlist = async () => {
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(crypto.id);
        setIsInWatchlist(false);
      } else {
        await addToWatchlist(crypto);
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  const formatPriceData = () => {
    if (priceHistory.length === 0) return { labels: [], datasets: [{ data: [] }] };
    
    const labels = priceHistory.map((_, index) => {
      if (index % Math.floor(priceHistory.length / 6) === 0) {
        return `Day ${index + 1}`;
      }
      return '';
    });

    return {
      labels,
      datasets: [{
        data: priceHistory.map(price => price[1]),
        strokeWidth: 3,
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // iOS blue
      }],
    };
  };

  const isPositive = crypto.price_change_percentage_24h >= 0;
  const changeColor = isPositive ? '#34C759' : '#FF3B30';

  // Generate crypto icon color based on symbol
  const getIconColor = (symbol) => {
    if (!symbol || typeof symbol !== 'string') return '#007AFF';
    const colors = ['#FF9500', '#007AFF', '#34C759', '#FF3B30', '#AF52DE', '#FF2D92'];
    const index = symbol.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <View style={styles.container}>
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <View style={[styles.symbolContainer, { backgroundColor: getIconColor(crypto.symbol) }]}>
                <Text style={styles.symbol}>{crypto.symbol?.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.cryptoName}>{crypto.name}</Text>
                <Text style={styles.cryptoSymbol}>{crypto.symbol?.toUpperCase()}</Text>
              </View>
              <TouchableOpacity onPress={toggleWatchlist} style={styles.watchlistButton}>
                <Ionicons 
                  name={isInWatchlist ? 'bookmark' : 'bookmark-outline'} 
                  size={24} 
                  color={isInWatchlist ? '#007AFF' : '#8E8E93'} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Price Info */}
          <View style={styles.priceCard}>
            <Text style={styles.currentPriceLabel}>Current Price</Text>
            <Text style={styles.price}>
              ${crypto.current_price?.toLocaleString()}
            </Text>
            <View style={styles.changeContainer}>
              <Ionicons 
                name={isPositive ? 'trending-up' : 'trending-down'} 
                size={18} 
                color={changeColor} 
              />
              <Text style={[styles.change, { color: changeColor }]}>
                ${Math.abs(crypto.price_change_24h || 0).toFixed(2)} ({crypto.price_change_percentage_24h?.toFixed(2)}%)
              </Text>
            </View>
            <Text style={styles.changeSubtext}>24h Change</Text>
          </View>

          {/* Chart */}
          {!loading && priceHistory.length > 0 && (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>7 Day Price Chart</Text>
              <LineChart
                data={formatPriceData()}
                width={width - 60}
                height={200}
                chartConfig={{
                  backgroundColor: '#FFFFFF',
                  backgroundGradientFrom: '#FFFFFF',
                  backgroundGradientTo: '#F8F9FA',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(28, 28, 30, ${opacity})`,
                  style: {
                    borderRadius: 12,
                  },
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: '#007AFF',
                    fill: '#007AFF',
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: '#E5E5EA',
                    strokeWidth: 1,
                  },
                }}
                style={styles.chart}
                bezier
              />
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Market Statistics</Text>
            
            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <Ionicons name="trending-up-outline" size={20} color="#8E8E93" />
                <Text style={styles.statLabel}>Market Cap</Text>
              </View>
              <Text style={styles.statValue}>
                ${crypto.market_cap?.toLocaleString()}
              </Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <Ionicons name="bar-chart-outline" size={20} color="#8E8E93" />
                <Text style={styles.statLabel}>24h Volume</Text>
              </View>
              <Text style={styles.statValue}>
                ${crypto.total_volume?.toLocaleString()}
              </Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <Ionicons name="medal-outline" size={20} color="#8E8E93" />
                <Text style={styles.statLabel}>Market Cap Rank</Text>
              </View>
              <Text style={styles.statValue}>#{crypto.market_cap_rank}</Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statLeft}>
                <Ionicons name="pie-chart-outline" size={20} color="#8E8E93" />
                <Text style={styles.statLabel}>Circulating Supply</Text>
              </View>
              <Text style={styles.statValue}>
                {crypto.circulating_supply?.toLocaleString()} {crypto.symbol?.toUpperCase()}
              </Text>
            </View>

            {crypto.max_supply && (
              <View style={[styles.statRow, styles.lastStatRow]}>
                <View style={styles.statLeft}>
                  <Ionicons name="infinite-outline" size={20} color="#8E8E93" />
                  <Text style={styles.statLabel}>Max Supply</Text>
                </View>
                <Text style={styles.statValue}>
                  {crypto.max_supply?.toLocaleString()} {crypto.symbol?.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingBottom: 100, // Space for tab bar
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  symbol: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  cryptoName: {
    color: '#1C1C1E',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cryptoSymbol: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  watchlistButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currentPriceLabel: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  price: {
    color: '#1C1C1E',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  change: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  changeSubtext: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chartTitle: {
    color: '#1C1C1E',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statsTitle: {
    color: '#1C1C1E',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  lastStatRow: {
    borderBottomWidth: 0,
  },
  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#1C1C1E',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  statValue: {
    color: '#1C1C1E',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
});

export default CryptoDetailScreen;
