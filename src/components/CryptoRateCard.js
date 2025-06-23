import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MiniChart from './MiniChart';

const CryptoRateCard = ({ crypto, onPress, isFirst, isLast }) => {
  // Add null checks and default values
  const priceChange = crypto?.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;
  const changeColor = isPositive ? '#34C759' : '#FF3B30';
  
  // Safe access to crypto properties with defaults
  const symbol = crypto?.symbol || 'N/A';
  const name = crypto?.name || 'Unknown';
  const sparklineData = crypto?.sparkline_in_7d?.price || [];
  
  // Generate crypto icon color based on symbol
  const getIconColor = (symbol) => {
    if (!symbol || typeof symbol !== 'string') return '#007AFF';
    const colors = ['#FFF3CD', '#E3F2FD', '#E8F5E8', '#FFEBEE', '#F3E5F5', '#FCE4EC'];
    const index = symbol.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getIconTextColor = (symbol) => {
    if (!symbol || typeof symbol !== 'string') return '#007AFF';
    const colors = ['#FF9500', '#007AFF', '#34C759', '#FF3B30', '#AF52DE', '#FF2D92'];
    const index = symbol.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Format percentage change safely
  const formatPercentage = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '0.0';
    return Math.abs(value).toFixed(1);
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.container,
        isFirst && styles.firstCard,
        isLast && styles.lastCard
      ]}
    >
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: getIconColor(symbol) }]}>
          <Text style={[styles.iconText, { color: getIconTextColor(symbol) }]}>
            {symbol && typeof symbol === 'string' ? symbol.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.amount}>1 {symbol.toUpperCase()}</Text>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.priceContainer}>
          <Text style={[styles.changeText, { color: changeColor }]}>
            {isPositive ? '↑' : '↓'}{formatPercentage(priceChange)}%
          </Text>
        </View>
        
        <MiniChart 
          data={sparklineData}
          color={changeColor}
          isPositive={isPositive}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5, // Subtle divider line
    borderBottomColor: '#E5E5EA',
    // No shadow, no border radius for joined appearance
  },
  firstCard: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  lastCard: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: 0, // Remove bottom border for last card
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8, // Soft square edges
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
    fontWeight: '600',
  },
  infoContainer: {
    flex: 1,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    color: '#8E8E93',
  },
  rightSection: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  priceContainer: {
    marginBottom: 6,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CryptoRateCard;
