/**
 * 금기룰 위반 체크 로직
 */

import { Trade } from "@/types/trade";
import {
  ForbiddenRuleViolation,
  FORBIDDEN_RULES,
  FORBIDDEN_RULE_PARAMS,
} from "@/types/forbidden-rules";

export class ForbiddenRulesChecker {
  /**
   * 새로운 거래에 대해 모든 금기룰을 체크
   */
  static checkTrade(
    newTrade: Trade,
    allTrades: Trade[],
    accountEquity?: number
  ): ForbiddenRuleViolation[] {
    const violations: ForbiddenRuleViolation[] = [];

    // 1. 손절 설정 없음 체크
    if (this.checkNoStopLoss(newTrade)) {
      violations.push(
        this.createViolation("no_stoploss", {
          trade_id: newTrade.id,
          stop_loss: newTrade.stop_loss,
        })
      );
    }

    // 2. 과도한 포지션 사이즈 체크
    if (accountEquity && this.checkOversizedPosition(newTrade, accountEquity)) {
      violations.push(
        this.createViolation("oversized_position", {
          trade_id: newTrade.id,
          position_size: newTrade.quantity * newTrade.entry_price,
          account_equity: accountEquity,
          ratio: (newTrade.quantity * newTrade.entry_price) / accountEquity,
        })
      );
    }

    // 3. 복수 거래 체크
    if (this.checkRevengeTrade(newTrade, allTrades)) {
      violations.push(
        this.createViolation("revenge_trade", {
          trade_id: newTrade.id,
          last_loss_trade: allTrades
            .filter((t) => t.exit_price && this.calculatePnL(t) < 0)
            .sort(
              (a, b) =>
                new Date(b.exit_time || 0).getTime() -
                new Date(a.exit_time || 0).getTime()
            )[0]?.id,
        })
      );
    }

    // 4. 급등 추격 매수 체크 (기본적인 로직)
    if (this.checkChasing(newTrade, allTrades)) {
      violations.push(
        this.createViolation("chasing", {
          trade_id: newTrade.id,
          entry_price: newTrade.entry_price,
        })
      );
    }

    // 5. 과도한 거래 빈도 체크
    if (this.checkOvertrading(newTrade, allTrades)) {
      violations.push(
        this.createViolation("overtrading", {
          trade_id: newTrade.id,
          daily_trade_count: this.getDailyTradeCount(
            newTrade.entry_time,
            allTrades
          ),
        })
      );
    }

    // 6. 계획 없는 물타기 체크
    if (this.checkAverageDownNoplan(newTrade, allTrades)) {
      violations.push(
        this.createViolation("avg_down_no_plan", {
          trade_id: newTrade.id,
          symbol: newTrade.symbol,
        })
      );
    }

    return violations;
  }

  /**
   * 손절 설정 없음 체크
   */
  private static checkNoStopLoss(trade: Trade): boolean {
    return trade.type === "buy" && !trade.stop_loss;
  }

  /**
   * 과도한 포지션 사이즈 체크
   */
  private static checkOversizedPosition(
    trade: Trade,
    accountEquity: number
  ): boolean {
    const positionSize = trade.quantity * trade.entry_price;
    return (
      positionSize > accountEquity * FORBIDDEN_RULE_PARAMS.max_position_ratio
    );
  }

  /**
   * 복수 거래 체크
   */
  private static checkRevengeTrade(
    newTrade: Trade,
    allTrades: Trade[]
  ): boolean {
    // 가장 최근 손실 거래 찾기
    const lastLossTrade = allTrades
      .filter(
        (t) =>
          t.exit_price &&
          this.calculatePnL(t) < 0 &&
          new Date(t.exit_time || 0) < new Date(newTrade.entry_time)
      )
      .sort(
        (a, b) =>
          new Date(b.exit_time || 0).getTime() -
          new Date(a.exit_time || 0).getTime()
      )[0];

    if (!lastLossTrade || !lastLossTrade.exit_time) return false;

    const timeDiff =
      new Date(newTrade.entry_time).getTime() -
      new Date(lastLossTrade.exit_time).getTime();
    const timeDiffMinutes = timeDiff / (1000 * 60);

    return timeDiffMinutes < FORBIDDEN_RULE_PARAMS.revenge_trade_window;
  }

  /**
   * 급등 추격 매수 체크 (단순화된 로직)
   */
  private static checkChasing(newTrade: Trade, allTrades: Trade[]): boolean {
    if (newTrade.type !== "buy") return false;

    // 같은 종목의 최근 거래들에서 가격 급등 패턴 확인
    const recentTrades = allTrades
      .filter(
        (t) =>
          t.symbol === newTrade.symbol &&
          new Date(t.entry_time) < new Date(newTrade.entry_time)
      )
      .sort(
        (a, b) =>
          new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
      )
      .slice(0, 5);

    if (recentTrades.length === 0) return false;

    const avgRecentPrice =
      recentTrades.reduce((sum, t) => sum + t.entry_price, 0) /
      recentTrades.length;
    const priceIncrease =
      (newTrade.entry_price - avgRecentPrice) / avgRecentPrice;

    // 최근 평균 대비 5% 이상 높은 가격에 매수하는 경우
    return priceIncrease > 0.05;
  }

  /**
   * 과도한 거래 빈도 체크
   */
  private static checkOvertrading(
    newTrade: Trade,
    allTrades: Trade[]
  ): boolean {
    const dailyCount = this.getDailyTradeCount(newTrade.entry_time, allTrades);
    return dailyCount > FORBIDDEN_RULE_PARAMS.max_daily_trades;
  }

  /**
   * 계획 없는 물타기 체크
   */
  private static checkAverageDownNoplan(
    newTrade: Trade,
    allTrades: Trade[]
  ): boolean {
    if (newTrade.type !== "buy") return false;

    // 같은 종목의 미청산 포지션이 있는지 확인
    const openPositions = allTrades.filter(
      (t) =>
        t.symbol === newTrade.symbol &&
        t.type === "buy" &&
        !t.exit_price &&
        new Date(t.entry_time) < new Date(newTrade.entry_time)
    );

    if (openPositions.length === 0) return false;

    // 기존 포지션들의 평균 진입가보다 낮은 가격에 추가 매수하는 경우
    const avgEntryPrice =
      openPositions.reduce((sum, t) => sum + t.entry_price, 0) /
      openPositions.length;

    // 물타기로 판단되고, 계획적인 물타기인지 확인 (메모에 물타기 계획 언급이 있는지)
    const isAverageDown = newTrade.entry_price < avgEntryPrice;
    const hasPlan =
      newTrade.memo?.toLowerCase().includes("물타기") ||
      newTrade.memo?.toLowerCase().includes("평균단가") ||
      newTrade.memo?.toLowerCase().includes("추가매수");

    return isAverageDown && !hasPlan;
  }

  /**
   * 하루 거래 횟수 계산
   */
  private static getDailyTradeCount(
    entryTime: string,
    allTrades: Trade[]
  ): number {
    const today = new Date(entryTime);
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return (
      allTrades.filter((t) => {
        const tradeDate = new Date(t.entry_time);
        return tradeDate >= today && tradeDate < tomorrow;
      }).length + 1
    ); // +1은 현재 거래 포함
  }

  /**
   * PnL 계산
   */
  private static calculatePnL(trade: Trade): number {
    if (!trade.exit_price) return 0;

    if (trade.type === "buy") {
      return (trade.exit_price - trade.entry_price) * trade.quantity;
    } else {
      return (trade.entry_price - trade.exit_price) * trade.quantity;
    }
  }

  /**
   * 위반 객체 생성
   */
  private static createViolation(
    ruleCode: string,
    details: Record<string, any>
  ): ForbiddenRuleViolation {
    const rule = FORBIDDEN_RULES[ruleCode];
    return {
      rule_code: ruleCode,
      description: rule.description,
      severity: rule.severity,
      score_penalty: rule.score_penalty,
      detected_at: new Date(),
      details,
    };
  }

  /**
   * 위반 점수 총합 계산
   */
  static calculateTotalPenalty(violations: ForbiddenRuleViolation[]): number {
    return violations.reduce(
      (total, violation) => total + violation.score_penalty,
      0
    );
  }

  /**
   * 심각도별 위반 개수 계산
   */
  static getViolationStats(violations: ForbiddenRuleViolation[]) {
    return {
      high: violations.filter((v) => v.severity === "high").length,
      medium: violations.filter((v) => v.severity === "medium").length,
      low: violations.filter((v) => v.severity === "low").length,
      total: violations.length,
      total_penalty: this.calculateTotalPenalty(violations),
    };
  }
}
