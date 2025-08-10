from fastapi import APIRouter, HTTPException, Query
from typing import List
from datetime import datetime
from schemas import Trade, CreateTradeRequest, TradesResponse
from scoring import compute_strategy_score, compute_forbidden_points
from market_data import market_service

router = APIRouter()

# 임시 인메모리 저장
TRADES: List[Trade] = []

@router.get('/trades', response_model=TradesResponse)
def list_trades(limit: int = Query(10, ge=1, le=100), offset: int = Query(0, ge=0)):
    ordered = sorted(TRADES, key=lambda t: t.entryTime, reverse=True)
    page = ordered[offset: offset + limit]
    return TradesResponse(trades=page, total=len(ordered), page=(offset // limit) + 1, limit=limit)

@router.post('/trades', response_model=Trade, status_code=201)
def create_trade(req: CreateTradeRequest):
    """거래 생성 및 스코어링 (자동 차트 데이터 연동)"""
    # 심볼 유효성 검사
    if not market_service.validate_symbol(req.symbol):
        raise HTTPException(status_code=400, detail=f"유효하지 않은 심볼입니다: {req.symbol}")
    
    # 자동 기술적 지표 계산 (indicators가 없거나 부분적인 경우)
    auto_indicators = {}
    try:
        auto_indicators = market_service.get_trade_indicators(
            symbol=req.symbol,
            entry_time=req.entryTime,
            entry_price=req.entryPrice
        )
    except Exception as e:
        print(f"기술적 지표 자동 계산 실패: {e}")
    
    # 기존 indicators와 자동 계산된 indicators 병합 (기존 값 우선)
    final_indicators = auto_indicators.copy()
    if req.indicators:
        final_indicators.update({k: v for k, v in req.indicators.dict().items() if v is not None})
    
    # 간단 손익 계산
    pnl = None
    if req.exitPrice is not None:
        pnl = (req.exitPrice - req.entryPrice) * req.quantity if req.type == 'buy' else (req.entryPrice - req.exitPrice) * req.quantity

    trade = Trade(
        id=str(int(datetime.utcnow().timestamp() * 1000)),
        symbol=req.symbol,
        type=req.type,
        tradingType=req.tradingType,
        quantity=req.quantity,
        entryPrice=req.entryPrice,
        exitPrice=req.exitPrice,
        entryTime=req.entryTime,
        exitTime=req.exitTime,
        memo=req.memo,
        pnl=pnl,
        status='closed' if req.exitPrice is not None else 'open',
        stopLoss=req.stopLoss,
        indicators=final_indicators,  # 병합된 indicators 사용
        createdAt=datetime.utcnow(),
        updatedAt=datetime.utcnow(),
    )

    # 전략 60점 + 금기룰 40점
    strategy = compute_strategy_score(trade)
    if strategy:
        trade.strategyScore = strategy
    forbidden_points = compute_forbidden_points()
    trade.forbiddenPenalty = 40 - forbidden_points
    base = strategy.totalScore if strategy else 0
    trade.finalScore = base + forbidden_points

    TRADES.insert(0, trade)
    return trade