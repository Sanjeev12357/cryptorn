import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const PortfolioSummary = ({ totalValue, totalGainLoss }) => {
  const isPositive = totalGainLoss >= 0;
  const changeColor = isPositive ? '#00C896' : '#FF3B30';
  const changeIcon = isPositive ? 'trending-up' : 'trending-down';
  const gainLossPercentage = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;

  return (
    <LinearGradient colors={['#2C2C2E', '#1C1C1E']} style={styles.container}>
      <View style={styles.totalValueContainer}>
        <Text style={styles.totalLabel}>Total Portfolio Value</Text>
        <Text style={styles.totalValue}>${totalValue.toFixed(2)}</Text>
      </View>

      <View style={styles.changeContainer}>
        <View style={styles.changeItem}>
          <Ionicons name={changeIcon} size={20} color={changeColor} />
          <Text style={[styles.changeValue, { color: changeColor }]}>
            ${Math.abs(totalGainLoss).toFixed(2)}
          </Text>
        </View>
        <Text style={[styles.changePercentage, { color: changeColor }]}>
          ({isPositive ? '+' : '-'}{Math.abs(gainLossPercentage).toFixed(2)}%)
        </Text>
      </View>

      <Text style={styles.timeframe}>24h Change</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  totalValueContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    color: '#8E8E93',
    fontSize: 16,
    marginBottom: 8,
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  changeValue: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 4,
  },
  changePercentage: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeframe: {
    color: '#8E8E93',
    fontSize: 14,
  },
});

export default PortfolioSummary;
