import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const CryptoCard = ({ crypto, onPress }) => {
  const isPositive = crypto.price_change_percentage_24h >= 0;
  const changeColor = isPositive ? '#00C896' : '#FF3B30';
  const changeIcon = isPositive ? 'trending-up' : 'trending-down';

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={['#2C2C2E', '#1C1C1E']}
        style={styles.gradient}
      >
        <View style={styles.leftSection}>
          <View style={styles.symbolContainer}>
            <Text style={styles.symbol}>{crypto.symbol?.toUpperCase()}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {crypto.name}
            </Text>
            <Text style={styles.marketCap}>
              Market Cap: ${crypto.market_cap?.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.price}>
            ${crypto.current_price?.toFixed(crypto.current_price < 1 ? 6 : 2)}
          </Text>
          <View style={styles.changeContainer}>
            <Ionicons name={changeIcon} size={16} color={changeColor} />
            <Text style={[styles.change, { color: changeColor }]}>
              {crypto.price_change_percentage_24h?.toFixed(2)}%
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 8,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00D4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    color: '#000000',
    fontSize: 16,
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
  marketCap: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  price: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default CryptoCard;
