import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const HoldingCard = ({ holding }) => {
  const currentValue = holding.amount * holding.currentPrice;
  const originalValue = holding.amount * holding.purchasePrice;
  const gainLoss = currentValue - originalValue;
  const gainLossPercentage = (gainLoss / originalValue) * 100;
  const isPositive = gainLoss >= 0;
  const changeColor = isPositive ? '#00C896' : '#FF3B30';

  return (
    <TouchableOpacity style={styles.container}>
      <LinearGradient colors={['#2C2C2E', '#1C1C1E']} style={styles.gradient}>
        <View style={styles.leftSection}>
          <View style={styles.symbolContainer}>
            <Text style={styles.symbol}>{holding.symbol}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{holding.name}</Text>
            <Text style={styles.amount}>
              {holding.amount} {holding.symbol}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.currentValue}>${currentValue.toFixed(2)}</Text>
          <View style={styles.changeContainer}>
            <Ionicons
              name={isPositive ? 'trending-up' : 'trending-down'}
              size={14}
              color={changeColor}
            />
            <Text style={[styles.gainLoss, { color: changeColor }]}>
              {isPositive ? '+' : ''}${Math.abs(gainLoss).toFixed(2)}
            </Text>
            <Text style={[styles.percentage, { color: changeColor }]}>
              ({isPositive ? '+' : ''}{gainLossPercentage.toFixed(2)}%)
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  symbolContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#00D4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  amount: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  currentValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  gainLoss: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default HoldingCard;
