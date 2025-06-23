import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

const chartWidth = 70; // Larger chart width
const chartHeight = 32; // Larger chart height

const MiniChart = ({ data, color, isPositive }) => {
  // Add comprehensive data validation
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <View style={styles.emptyChart} />;
  }

  // Filter out invalid values and ensure we have valid numbers
  const validData = data.filter(value => 
    value !== null && 
    value !== undefined && 
    !isNaN(value) && 
    isFinite(value) &&
    typeof value === 'number'
  );

  // If no valid data after filtering, show empty chart
  if (validData.length === 0) {
    return <View style={styles.emptyChart} />;
  }

  const minValue = Math.min(...validData);
  const maxValue = Math.max(...validData);
  const range = maxValue - minValue;

  // Handle case where all values are the same (range = 0)
  if (range === 0 || !isFinite(range)) {
    return <View style={styles.emptyChart} />;
  }

  try {
    const points = validData.map((value, index) => {
      const x = (index / (validData.length - 1)) * chartWidth;
      const y = chartHeight - ((value - minValue) / range) * chartHeight;
      
      // Ensure x and y are valid numbers
      if (!isFinite(x) || !isFinite(y) || isNaN(x) || isNaN(y)) {
        return null;
      }
      
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).filter(point => point !== null);

    // If no valid points generated, show empty chart
    if (points.length === 0) {
      return <View style={styles.emptyChart} />;
    }

    const pointsString = points.join(' ');

    return (
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          <Polyline
            points={pointsString}
            fill="none"
            stroke={color || '#007AFF'}
            strokeWidth="2" // Thicker line for better visibility
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    );
  } catch (error) {
    console.warn('Error rendering mini chart:', error);
    return <View style={styles.emptyChart} />;
  }
};

const styles = StyleSheet.create({
  chartContainer: {
    width: chartWidth,
    height: chartHeight,
  },
  emptyChart: {
    width: chartWidth,
    height: chartHeight,
    backgroundColor: '#F8F9FA',
    borderRadius: 4,
  },
});

export default MiniChart;
