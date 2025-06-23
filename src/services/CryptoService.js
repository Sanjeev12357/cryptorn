const API_BASE_URL = 'https://api.coingecko.com/api/v3';


export const fetchCryptoData = async (limit = 50) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return [];
  }
};

export const searchCrypto = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?query=${query}`);
    
    if (!response.ok) {
      throw new Error('Failed to search crypto');
    }
    
    const data = await response.json();
    return data.coins || [];
  } catch (error) {
    console.error('Error searching crypto:', error);
    return [];
  }
};

export const getCryptoDetails = async (id) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto details');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching crypto details:', error);
    return null;
  }
};

export const getCryptoPriceHistory = async (id, days = 7) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch price history');
    }
    
    const data = await response.json();
    return data.prices || [];
  } catch (error) {
    console.error('Error fetching price history:', error);
    return [];
  }
};
