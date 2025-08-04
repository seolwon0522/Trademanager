'use client';

import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ko } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Clock, CheckCircle, Loader2 } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import { useRecentTrades } from '@/hooks/use-trades';
import { Trade } from '@/types/trade';
import { cn } from '@/lib/utils';

// 손익 포맷팅 함수
function formatPnL(pnl: number | undefined): string {
  if (pnl === undefined || pnl === 0) return '-';

  const isPositive = pnl > 0;
  const formattedValue = Math.abs(pnl).toLocaleString('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return `${isPositive ? '+' : '-'}$${formattedValue}`;
}

// 가격 포맷팅 함수
function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
}

// 개별 거래 행 컴포넌트
function TradeRow({ trade }: { trade: Trade }) {
  const isBuy = trade.type === 'buy';
  const isOpen = trade.status === 'open';
  const hasPnL = trade.pnl !== undefined && trade.pnl !== 0;
  const isProfit = trade.pnl && trade.pnl > 0;

  return (
    <TableRow className="hover:bg-muted/50">
      {/* 종목명 */}
      <TableCell className="font-medium">{trade.symbol}</TableCell>

      {/* 거래 유형 */}
      <TableCell>
        <Badge variant={isBuy ? 'default' : 'destructive'} className="gap-1">
          {isBuy ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isBuy ? '매수' : '매도'}
        </Badge>
      </TableCell>

      {/* 수량 */}
      <TableCell className="text-right">
        {trade.quantity.toLocaleString('ko-KR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 8,
        })}
      </TableCell>

      {/* 진입가 */}
      <TableCell className="text-right font-mono text-sm">
        ${formatPrice(trade.entryPrice)}
      </TableCell>

      {/* 청산가 */}
      <TableCell className="text-right font-mono text-sm">
        {trade.exitPrice ? `$${formatPrice(trade.exitPrice)}` : '-'}
      </TableCell>

      {/* 손익 */}
      <TableCell className="text-right">
        {hasPnL ? (
          <span
            className={cn(
              'font-medium',
              isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}
          >
            {formatPnL(trade.pnl)}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>

      {/* 상태 */}
      <TableCell>
        <Badge variant={isOpen ? 'secondary' : 'outline'} className="gap-1">
          {isOpen ? (
            <>
              <Clock className="h-3 w-3" />
              진행중
            </>
          ) : (
            <>
              <CheckCircle className="h-3 w-3" />
              완료
            </>
          )}
        </Badge>
      </TableCell>

      {/* 진입 시간 */}
      <TableCell className="text-sm text-muted-foreground">
        {format(trade.entryTime, 'MM/dd HH:mm', { locale: ko })}
      </TableCell>

      {/* 메모 */}
      <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
        {trade.memo || '-'}
      </TableCell>
    </TableRow>
  );
}

// 빈 상태 컴포넌트
function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={9} className="h-24 text-center">
        <div className="flex flex-col items-center gap-2">
          <TrendingUp className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">매매 기록이 없습니다</p>
            <p className="text-xs text-muted-foreground">첫 번째 거래를 기록해보세요</p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

// 로딩 상태 컴포넌트
function LoadingState() {
  return (
    <TableRow>
      <TableCell colSpan={9} className="h-24 text-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">거래 기록을 불러오는 중...</span>
        </div>
      </TableCell>
    </TableRow>
  );
}

// 에러 상태 컴포넌트
function ErrorState({ error }: { error: Error }) {
  return (
    <TableRow>
      <TableCell colSpan={9} className="h-24 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="text-destructive">
            <p className="text-sm font-medium">데이터를 불러올 수 없습니다</p>
            <p className="text-xs">{error.message}</p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

// 메인 테이블 컴포넌트
interface TradesTableProps {
  selectedMonth?: Date;
}

export function TradesTable({ selectedMonth }: TradesTableProps) {
  const { data, isLoading, error } = useRecentTrades();

  // 선택된 월의 거래만 필터링
  const filteredTrades =
    data?.trades.filter((trade) => {
      if (!selectedMonth) return true;

      const tradeDate = new Date(trade.entryTime);
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);

      return isWithinInterval(tradeDate, { start: monthStart, end: monthEnd });
    }) || [];

  const totalPnL = filteredTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {selectedMonth
              ? `${format(selectedMonth, 'yyyy년 M월', { locale: ko })} 거래 기록`
              : '최근 거래 기록'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {selectedMonth
              ? `${format(selectedMonth, 'yyyy년 M월', { locale: ko })} 거래 내역을 확인하세요`
              : '최근 10건의 거래 내역을 확인하세요'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedMonth && <Badge variant="outline">{filteredTrades.length}건</Badge>}
          {data && <Badge variant="secondary">총 {data.total}건</Badge>}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>종목</TableHead>
              <TableHead>유형</TableHead>
              <TableHead className="text-right">수량</TableHead>
              <TableHead className="text-right">진입가</TableHead>
              <TableHead className="text-right">청산가</TableHead>
              <TableHead className="text-right">손익</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>진입시간</TableHead>
              <TableHead>메모</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <LoadingState />}
            {error && <ErrorState error={error} />}
            {data && filteredTrades.length === 0 && <EmptyState />}
            {filteredTrades.map((trade) => (
              <TradeRow key={trade.id} trade={trade} />
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredTrades.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            {selectedMonth
              ? `${format(selectedMonth, 'yyyy년 M월', { locale: ko })} ${filteredTrades.length}건 표시 중`
              : `최근 ${filteredTrades.length}건 표시 중`}
          </div>
          <div>
            총 손익:{' '}
            <span
              className={cn(
                'font-medium',
                totalPnL > 0
                  ? 'text-green-600 dark:text-green-400'
                  : totalPnL < 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground'
              )}
            >
              {formatPnL(totalPnL)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
