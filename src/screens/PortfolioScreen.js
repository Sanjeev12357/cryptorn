import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PortfolioSummary from '../components/PortfolioSummary';
import HoldingCard from '../components/HoldingCard';
import { getPortfolio } from '../services/StorageService';

const PortfolioScreen = ({ navigation }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalGainLoss, setTotalGainLoss] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const data = await getPortfolio();
      setPortfolio(data);
      calculateTotals(data);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    }
  };

  const calculateTotals = (holdings) => {
    let total = 0;
    let gainLoss = 0;
    
    holdings.forEach(holding => {
      const currentValue = holding.amount * holding.currentPrice;
      const originalValue = holding.amount * holding.purchasePrice;
      total += currentValue;
      gainLoss += (currentValue - originalValue);
    });
    
    setTotalValue(total);
    setTotalGainLoss(gainLoss);
  };

  const handleAddHolding = () => {
    navigation.navigate('Search');
  };

  const renderHolding = ({ item, index }) => (
    <HoldingCard 
      holding={item} 
      isFirst={index === 0}
      isLast={index === portfolio.length - 1}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="pie-chart-outline" size={60} color="#8E8E93" />
      </View>
      <Text style={styles.emptyTitle}>No Holdings Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start building your portfolio by adding your cryptocurrency holdings
      </Text>
      <TouchableOpacity style={styles.getStartedButton} onPress={handleAddHolding}>
        <Text style={styles.getStartedButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>₿</Text>
        </View>
        <Text style={styles.appTitle}>Portfolio</Text>
      </View>
      
      <TouchableOpacity style={styles.addButton} onPress={handleAddHolding}>
        <Ionicons name="add" size={20} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  const renderPortfolioStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Total Value</Text>
        <Text style={styles.statValue}>
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </View>
      
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>24h Change</Text>
        <Text style={[
          styles.statValue, 
          { color: totalGainLoss >= 0 ? '#34C759' : '#FF3B30' }
        ]}>
          {totalGainLoss >= 0 ? '+' : ''}${Math.abs(totalGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <FlatList
          ListHeaderComponent={() => (
            <View>
              {renderHeader()}
              {renderPortfolioStats()}
              {portfolio.length > 0 && (
                <View style={styles.holdingsHeader}>
                  <Text style={styles.sectionTitle}>Your Holdings</Text>
                  <Text style={styles.holdingsCount}>
                    {portfolio.length} {portfolio.length === 1 ? 'asset' : 'assets'}
                  </Text>
                </View>
              )}
            </View>
          )}
          data={portfolio}
          renderItem={renderHolding}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContainer,
            portfolio.length === 0 && styles.emptyListContainer
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  holdingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  holdingsCount: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
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
    fontSize: 18,
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
  getStartedButton: {
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
  getStartedButtonText: {
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

export default PortfolioScreen;
