/**
 * 전략별 채점 유틸
 */

import { Trade } from '@/types/trade';
import {
  BREAKOUT_WEIGHTS,
  COUNTER_TREND_WEIGHTS,
  StrategyCriterionScore,
  StrategyScoreResult,
  TradeIndicators,
} from '@/types/strategy-scoring';

// 0~1 -> 0~100로 환산
function toWeightedScore(passed: boolean, weight: number): number {
  return passed ? Math.round(100 * weight) : 0;
}

// 안전 클램프
function clampScore(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

export function scoreBreakoutStrategy(
  trade: Trade,
  indicators: TradeIndicators
): StrategyScoreResult {
  const volumeConfirmed =
    indicators.volume !== undefined &&
    indicators.averageVolume !== undefined &&
    indicators.volume > indicators.averageVolume * 1.5; // 거래량 1.5배 이상

  const breakoutValidity =
    indicators.prevRangeHigh !== undefined && trade.entryPrice > indicators.prevRangeHigh; // 명확한 상단 돌파

  // 손절폭 제한: 손절가 존재 + 진입가 대비 2% 이내 손실 제한 or 제공된 boolean
  const pullbackControl =
    indicators.stopLossWithinLimit === true ||
    (trade.stopLoss !== undefined &&
      Math.abs(trade.entryPrice - trade.stopLoss) / trade.entryPrice <= 0.02);

  const criteria: StrategyCriterionScore[] = [
    {
      code: 'volume_confirmed',
      description: '돌파봉 거래량 증가',
      weight: BREAKOUT_WEIGHTS.volume_confirmed,
      passed: !!volumeConfirmed,
      score: toWeightedScore(!!volumeConfirmed, BREAKOUT_WEIGHTS.volume_confirmed),
    },
    {
      code: 'breakout_validity',
      description: '명확한 박스/저항 돌파',
      weight: BREAKOUT_WEIGHTS.breakout_validity,
      passed: !!breakoutValidity,
      score: toWeightedScore(!!breakoutValidity, BREAKOUT_WEIGHTS.breakout_validity),
    },
    {
      code: 'pullback_control',
      description: '돌파 실패 시 손실 제한',
      weight: BREAKOUT_WEIGHTS.pullback_control,
      passed: !!pullbackControl,
      score: toWeightedScore(!!pullbackControl, BREAKOUT_WEIGHTS.pullback_control),
    },
  ];

  const totalScore = clampScore(criteria.reduce((s, c) => s + c.score, 0));
  return { strategy: 'breakout', totalScore, criteria };
}

export function scoreTrendStrategy(trade: Trade, indicators: TradeIndicators): StrategyScoreResult {
  // 상위 TF 추세와 방향 일치: 매수면 up, 매도면 down
  const expected = trade.type === 'buy' ? 'up' : 'down';
  const htfAlignment = indicators.htfTrend === expected;

  const pullbackEntry = indicators.pullbackOk === true;
  const trailStopQuality = indicators.trailStopCorrect === true;

  const criteria: StrategyCriterionScore[] = [
    {
      code: 'htf_alignment',
      description: '상위 TF 추세 일치',
      weight: 0.4,
      passed: !!htfAlignment,
      score: toWeightedScore(!!htfAlignment, 0.4),
    },
    {
      code: 'pullback_entry',
      description: '되돌림 후 진입',
      weight: 0.3,
      passed: !!pullbackEntry,
      score: toWeightedScore(!!pullbackEntry, 0.3),
    },
    {
      code: 'trail_stop_quality',
      description: '트레일링 스탑 품질',
      weight: 0.3,
      passed: !!trailStopQuality,
      score: toWeightedScore(!!trailStopQuality, 0.3),
    },
  ];

  const totalScore = clampScore(criteria.reduce((s, c) => s + c.score, 0));
  return { strategy: 'trend', totalScore, criteria };
}

export function scoreCounterTrendStrategy(
  _trade: Trade,
  indicators: TradeIndicators
): StrategyScoreResult {
  const extremeDeviation = indicators.zscore !== undefined && indicators.zscore > 2;
  const reversionConfirmation = indicators.reversalSignal === true;
  const tightRR = indicators.riskReward !== undefined && indicators.riskReward >= 1.5;

  const criteria: StrategyCriterionScore[] = [
    {
      code: 'extreme_deviation',
      description: '극단 이탈 진입',
      weight: 0.4,
      passed: !!extremeDeviation,
      score: toWeightedScore(!!extremeDeviation, 0.4),
    },
    {
      code: 'reversion_confirmation',
      description: '반전 신호 확인',
      weight: 0.3,
      passed: !!reversionConfirmation,
      score: toWeightedScore(!!reversionConfirmation, 0.3),
    },
    {
      code: 'tight_rr',
      description: '짧은 손절로 RR 확보',
      weight: 0.3,
      passed: !!tightRR,
      score: toWeightedScore(!!tightRR, 0.3),
    },
  ];

  const totalScore = clampScore(criteria.reduce((s, c) => s + c.score, 0));
  return { strategy: 'counter_trend', totalScore, criteria };
}

export function computeStrategyScore(
  trade: Trade,
  indicators: TradeIndicators | undefined
): StrategyScoreResult | null {
  if (!indicators) return null;

  switch (trade.tradingType) {
    case 'breakout':
      return scoreBreakoutStrategy(trade, indicators);
    case 'trend':
      return scoreTrendStrategy(trade, indicators);
    case 'counter_trend':
      return scoreCounterTrendStrategy(trade, indicators);
    default:
      return null;
  }
}
