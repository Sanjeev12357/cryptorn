import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterModal = ({ visible, onClose, sortBy, sortOrder, onApplyFilter }) => {
  const [tempSortBy, setTempSortBy] = useState(sortBy);
  const [tempSortOrder, setTempSortOrder] = useState(sortOrder);

  // Update temp values when props change
  useEffect(() => {
    setTempSortBy(sortBy);
    setTempSortOrder(sortOrder);
  }, [sortBy, sortOrder, visible]);

  const sortOptions = [
    { key: 'market_cap', label: 'Market Cap' },
    { key: 'current_price', label: 'Price' },
    { key: 'price_change_percentage_24h', label: '24h Change' },
    { key: 'total_volume', label: 'Volume' },
    { key: 'name', label: 'Name' },
  ];

  const handleApply = () => {
    onApplyFilter(tempSortBy, tempSortOrder);
  };

  const handleReset = () => {
    setTempSortBy('market_cap');
    setTempSortOrder('desc');
  };

  const handleClose = () => {
    // Reset to original values if user cancels
    setTempSortBy(sortBy);
    setTempSortOrder(sortOrder);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Filter & Sort</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetButton}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sort By</Text>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.optionRow,
                  tempSortBy === option.key && styles.selectedOption
                ]}
                onPress={() => setTempSortBy(option.key)}
              >
                <Text style={[
                  styles.optionText,
                  tempSortBy === option.key && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
                {tempSortBy === option.key && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order</Text>
            <TouchableOpacity
              style={[
                styles.optionRow,
                tempSortOrder === 'desc' && styles.selectedOption
              ]}
              onPress={() => setTempSortOrder('desc')}
            >
              <Text style={[
                styles.optionText,
                tempSortOrder === 'desc' && styles.selectedOptionText
              ]}>
                Descending (High to Low)
              </Text>
              {tempSortOrder === 'desc' && (
                <Ionicons name="checkmark" size={20} color="#007AFF" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionRow,
                tempSortOrder === 'asc' && styles.selectedOption
              ]}
              onPress={() => setTempSortOrder('asc')}
            >
              <Text style={[
                styles.optionText,
                tempSortOrder === 'asc' && styles.selectedOptionText
              ]}>
                Ascending (Low to High)
              </Text>
              {tempSortOrder === 'asc' && (
                <Ionicons name="checkmark" size={20} color="#007AFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filter</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  resetButton: {
    fontSize: 16,
    color: '#FF3B30',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: 'uppercase',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  selectedOption: {
    backgroundColor: '#F0F8FF',
  },
  optionText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterModal;
