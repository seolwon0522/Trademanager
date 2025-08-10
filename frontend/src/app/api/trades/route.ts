import { NextRequest, NextResponse } from 'next/server';
import { createTradeSchema } from '@/schemas/trade';
import { Trade } from '@/types/trade';
import { ForbiddenRulesChecker } from '@/lib/forbidden-rules-checker';
import { z } from 'zod';
import { computeStrategyScore } from '@/lib/strategy-scoring';

// 임시 메모리 저장소 (실제 프로젝트에서는 데이터베이스 사용)
// eslint-disable-next-line prefer-const
let trades: Trade[] = [
  {
    id: '1',
    symbol: 'BTC/USDT',
    type: 'buy',
    tradingType: 'trend',
    quantity: 0.5,
    entryPrice: 45000,
    exitPrice: 47000,
    entryTime: new Date('2024-01-15T10:30:00'),
    exitTime: new Date('2024-01-16T14:20:00'),
    memo: '상승 추세 진입',
    pnl: 1000,
    status: 'closed',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-16T14:20:00'),
  },
  {
    id: '2',
    symbol: 'ETH/USDT',
    type: 'buy',
    tradingType: 'breakout',
    quantity: 2.0,
    entryPrice: 2800,
    entryTime: new Date('2024-01-20T09:15:00'),
    memo: '지지선 반등 기대',
    status: 'open',
    createdAt: new Date('2024-01-20T09:15:00'),
    updatedAt: new Date('2024-01-20T09:15:00'),
  },
  {
    id: '3',
    symbol: 'SOL/USDT',
    type: 'sell',
    tradingType: 'counter_trend',
    quantity: 10,
    entryPrice: 120,
    exitPrice: 115,
    entryTime: new Date('2024-01-18T16:45:00'),
    exitTime: new Date('2024-01-19T11:30:00'),
    memo: '과매수 구간 진입으로 숏 포지션',
    pnl: -50,
    status: 'closed',
    createdAt: new Date('2024-01-18T16:45:00'),
    updatedAt: new Date('2024-01-19T11:30:00'),
  },
];

// 손익 계산 함수
function calculatePnL(trade: Omit<Trade, 'pnl'>): number {
  if (!trade.exitPrice) return 0;

  if (trade.type === 'buy') {
    return (trade.exitPrice - trade.entryPrice) * trade.quantity;
  } else {
    return (trade.entryPrice - trade.exitPrice) * trade.quantity;
  }
}

// GET /api/trades - 거래 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const symbol = searchParams.get('symbol');
    const type = searchParams.get('type') as 'buy' | 'sell' | null;
    const status = searchParams.get('status') as 'open' | 'closed' | null;

    // 필터링
    let filteredTrades = trades;

    if (symbol) {
      filteredTrades = filteredTrades.filter((trade) =>
        trade.symbol.toLowerCase().includes(symbol.toLowerCase())
      );
    }

    if (type) {
      filteredTrades = filteredTrades.filter((trade) => trade.type === type);
    }

    if (status) {
      filteredTrades = filteredTrades.filter((trade) => trade.status === status);
    }

    // 최신순 정렬
    filteredTrades.sort(
      (a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime()
    );

    // 페이지네이션
    const paginatedTrades = filteredTrades.slice(offset, offset + limit);

    return NextResponse.json({
      trades: paginatedTrades,
      total: filteredTrades.length,
      page: Math.floor(offset / limit) + 1,
      limit,
    });
  } catch (error) {
    console.error('거래 조회 에러:', error);
    return NextResponse.json({ error: '거래 목록을 불러오는데 실패했습니다' }, { status: 500 });
  }
}

// POST /api/trades - 새 거래 등록
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 입력 검증
    const validatedData = createTradeSchema.parse(body);

    // 새 거래 생성
    const newTrade: Trade = {
      id: Date.now().toString(), // 실제로는 UUID 사용 권장
      symbol: validatedData.symbol,
      type: validatedData.type,
      tradingType: validatedData.tradingType,
      quantity: validatedData.quantity,
      entryPrice: validatedData.entryPrice,
      exitPrice: validatedData.exitPrice,
      entryTime: new Date(validatedData.entryTime),
      exitTime: validatedData.exitTime ? new Date(validatedData.exitTime) : undefined,
      memo: validatedData.memo,
      stopLoss: validatedData.stopLoss,
      indicators: validatedData.indicators,
      status: validatedData.exitPrice ? 'closed' : 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 손익 계산
    newTrade.pnl = calculatePnL(newTrade);

    // 금기룰 위반 체크
    const forbiddenViolations = ForbiddenRulesChecker.checkTrade(
      newTrade,
      trades,
      100000 // 가상의 계좌 자산 (100,000 USDT로 가정)
    );

    if (forbiddenViolations.length > 0) {
      newTrade.forbiddenViolations = forbiddenViolations;

      // 위반 내용을 로그로 출력 (개발 확인용)
      console.log('⚠️ 금기룰 위반 감지:', {
        trade_id: newTrade.id,
        symbol: newTrade.symbol,
        violations: forbiddenViolations.map((v) => ({
          rule: v.rule_code,
          description: v.description,
          severity: v.severity,
          penalty: v.score_penalty,
        })),
      });
    }

    // 전략 점수 계산 (indicators가 있을 경우)
    const strategyScore = computeStrategyScore(newTrade, validatedData.indicators);
    if (strategyScore) {
      newTrade.strategyScore = strategyScore;
    }

    // 금기룰 차감 점수
    const penalty = newTrade.forbiddenViolations
      ? ForbiddenRulesChecker.calculateTotalPenalty(newTrade.forbiddenViolations)
      : 0;
    newTrade.forbiddenPenalty = penalty;

    // 최종 점수 = (전략 점수 or 0) - 금기룰 차감, 0~100 클램프
    const baseScore = newTrade.strategyScore?.totalScore ?? 0;
    newTrade.finalScore = Math.max(0, Math.min(100, baseScore - penalty));

    // 메모리에 저장 (맨 앞에 추가)
    trades.unshift(newTrade);

    return NextResponse.json(newTrade, { status: 201 });
  } catch (error) {
    console.error('거래 등록 에러:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력값이 올바르지 않습니다', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: '거래 등록에 실패했습니다' }, { status: 500 });
  }
}
