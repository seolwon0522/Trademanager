import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { coinApi, CoinPriceData } from '@/lib/api/coin-api';

// 쿼리 키 상수 정의
export const QUERY_KEYS = {
  COIN_PRICE: 'coinPrice',
  HISTORICAL_PRICE: 'historicalPrice',
} as const;

// 현재 비트코인 가격 정보를 가져오는 hook
export function useCoinPrice(): UseQueryResult<CoinPriceData, Error> {
  return useQuery({
    queryKey: [QUERY_KEYS.COIN_PRICE],
    queryFn: coinApi.getCurrentPrice,
    staleTime: 30 * 1000, // 30초 - 가격 정보는 자주 업데이트되므로 짧게 설정
    refetchInterval: 60 * 1000, // 1분마다 자동 갱신
    retry: 3, // 실패 시 최대 3회 재시도
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수적 백오프
  });
}

// 과거 비트코인 가격 정보를 가져오는 hook
export function useHistoricalCoinPrice(date: string): UseQueryResult<CoinPriceData, Error> {
  return useQuery({
    queryKey: [QUERY_KEYS.HISTORICAL_PRICE, date],
    queryFn: () => coinApi.getHistoricalPrice(date),
    enabled: !!date, // date가 있을 때만 쿼리 실행
    staleTime: 24 * 60 * 60 * 1000, // 24시간 - 과거 데이터는 변하지 않으므로 길게 설정
    retry: 2,
  });
}
