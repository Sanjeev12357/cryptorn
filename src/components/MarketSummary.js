import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MarketSummary = () => {
  const marketData = [
    { label: 'Total Market Cap', value: '$2.1T', change: '+2.4%' },
    { label: '24h Volume', value: '$89.2B', change: '-1.2%' },
    { label: 'BTC Dominance', value: '42.3%', change: '+0.8%' },
    { label: 'Active Cryptos', value: '13,456', change: '+12' },
  ];

  const renderSummaryItem = (item, index) => (
    <View key={index} style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{item.label}</Text>
      <Text style={styles.summaryValue}>{item.value}</Text>
      <Text
        style={[
          styles.summaryChange,
          { color: item.change.startsWith('+') ? '#00C896' : '#FF3B30' },
        ]}
      >
        {item.change}
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={['#2C2C2E', '#1C1C1E']} style={styles.container}>
      <Text style={styles.title}>Market Overview</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {marketData.map(renderSummaryItem)}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  scrollContainer: {
    paddingRight: 20,
  },
  summaryItem: {
    marginRight: 20,
    alignItems: 'center',
    minWidth: 100,
  },
  summaryLabel: {
    color: '#8E8E93',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  summaryChange: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MarketSummary;
