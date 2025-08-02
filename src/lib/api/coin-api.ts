import { apiClient } from '@/lib/axios';

// 코인 가격 정보 타입 정의
export interface CoinPriceData {
  time: {
    updated: string;
    updatedISO: string;
    updateduk: string;
  };
  disclaimer: string;
  bpi: {
    USD: {
      code: string;
      symbol: string;
      rate: string;
      description: string;
      rate_float: number;
    };
    GBP: {
      code: string;
      symbol: string;
      rate: string;
      description: string;
      rate_float: number;
    };
    EUR: {
      code: string;
      symbol: string;
      rate: string;
      description: string;
      rate_float: number;
    };
  };
}

// API 호출 함수들
export const coinApi = {
  // 비트코인 현재 가격 정보 가져오기
  getCurrentPrice: async (): Promise<CoinPriceData> => {
    try {
      const response = await apiClient.get<CoinPriceData>('/bpi/currentprice.json');
      return response.data;
    } catch (error) {
      console.error('비트코인 가격 정보를 가져오는데 실패했습니다:', error);
      throw new Error('비트코인 가격 정보를 가져오는데 실패했습니다');
    }
  },

  // 특정 날짜의 비트코인 가격 정보 가져오기 (예제용)
  getHistoricalPrice: async (date: string): Promise<CoinPriceData> => {
    try {
      const response = await apiClient.get<CoinPriceData>(
        `/bpi/historical/close.json?start=${date}&end=${date}`
      );
      return response.data;
    } catch (error) {
      console.error('과거 비트코인 가격 정보를 가져오는데 실패했습니다:', error);
      throw new Error('과거 비트코인 가격 정보를 가져오는데 실패했습니다');
    }
  },
};
