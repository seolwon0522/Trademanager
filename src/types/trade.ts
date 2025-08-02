// 거래 관련 타입 정의
export interface Trade {
  id: string;
  symbol: string; // 종목명
  type: 'buy' | 'sell'; // 매수/매도
  quantity: number; // 수량
  entryPrice: number; // 진입가
  exitPrice?: number; // 청산가 (선택적)
  entryTime: Date; // 진입 시간
  exitTime?: Date; // 청산 시간 (선택적)
  memo?: string; // 메모
  pnl?: number; // 손익 (계산됨)
  status: 'open' | 'closed'; // 거래 상태
  createdAt: Date;
  updatedAt: Date;
}

// 새 거래 생성 시 사용하는 타입
export interface CreateTradeRequest {
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  entryTime: string; // ISO string
  exitTime?: string; // ISO string
  memo?: string;
}

// API 응답 타입
export interface TradesResponse {
  trades: Trade[];
  total: number;
  page: number;
  limit: number;
}

// 거래 필터링/정렬 옵션
export interface TradeFilters {
  symbol?: string;
  type?: 'buy' | 'sell';
  status?: 'open' | 'closed';
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'entryTime' | 'symbol' | 'pnl';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
