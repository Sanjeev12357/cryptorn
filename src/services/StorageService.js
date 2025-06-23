import AsyncStorage from '@react-native-async-storage/async-storage';

const WATCHLIST_KEY = 'crypto_watchlist';
const PORTFOLIO_KEY = 'crypto_portfolio';

export const addToWatchlist = async (crypto) => {
  try {
    const watchlist = await getWatchlist();
    const exists = watchlist.find(item => item.id === crypto.id);
    
    if (!exists) {
      const updatedWatchlist = [...watchlist, crypto];
      await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return false;
  }
};

export const removeFromWatchlist = async (cryptoId) => {
  try {
    const watchlist = await getWatchlist();
    const updatedWatchlist = watchlist.filter(item => item.id !== cryptoId);
    await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));
    return true;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return false;
  }
};

export const getWatchlist = async () => {
  try {
    const watchlist = await AsyncStorage.getItem(WATCHLIST_KEY);
    return watchlist ? JSON.parse(watchlist) : [];
  } catch (error) {
    console.error('Error getting watchlist:', error);
    return [];
  }
};

export const addToPortfolio = async (holding) => {
  try {
    const portfolio = await getPortfolio();
    const updatedPortfolio = [...portfolio, holding];
    await AsyncStorage.setItem(PORTFOLIO_KEY, JSON.stringify(updatedPortfolio));
    return true;
  } catch (error) {
    console.error('Error adding to portfolio:', error);
    return false;
  }
};

export const getPortfolio = async () => {
  try {
    const portfolio = await AsyncStorage.getItem(PORTFOLIO_KEY);
    return portfolio ? JSON.parse(portfolio) : [];
  } catch (error) {
    console.error('Error getting portfolio:', error);
    return [];
  }
};

export const updatePortfolioHolding = async (holdingId, updatedHolding) => {
  try {
    const portfolio = await getPortfolio();
    const updatedPortfolio = portfolio.map(holding =>
      holding.id === holdingId ? { ...holding, ...updatedHolding } : holding
    );
    await AsyncStorage.setItem(PORTFOLIO_KEY, JSON.stringify(updatedPortfolio));
    return true;
  } catch (error) {
    console.error('Error updating portfolio holding:', error);
    return false;
  }
};
