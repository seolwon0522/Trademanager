'use client';

import { useState } from 'react';
import { Plus, BarChart3, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TradeForm } from '@/components/trades/trade-form';
import { TradesTable } from '@/components/trades/trades-table';

export default function TradesPage() {
  const [showForm, setShowForm] = useState(false);

  const handleFormSuccess = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-full bg-background">
      {/* 페이지 헤더 */}
      <div className="border-b bg-muted/50">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <TrendingUp className="h-8 w-8" />
                매매 기록
              </h1>
              <p className="text-muted-foreground mt-2">
                거래 내역을 체계적으로 기록하고 관리하세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // 통계 페이지로 이동 (향후 구현)
                  console.log('통계 페이지로 이동');
                }}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                통계 보기
              </Button>
              <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                <Plus className="h-4 w-4" />
                {showForm ? '폼 닫기' : '새 기록 추가'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="p-6 space-y-6">
        {/* 입력 폼 (조건부 렌더링) */}
        {showForm && <TradeForm onSuccess={handleFormSuccess} />}

        {/* 거래 테이블 */}
        <TradesTable />

        {/* 도움말 섹션 */}
        {!showForm && (
          <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-dashed">
            <h3 className="text-lg font-semibold mb-2">💡 매매 기록 관리 팁</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-1">📝 상세한 기록</h4>
                <p>진입/청산 이유, 시장 상황, 감정 상태 등을 메모에 기록하세요.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">⏰ 정확한 시간</h4>
                <p>정확한 거래 시간을 기록하여 시장 타이밍을 분석하세요.</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">💰 손익 추적</h4>
                <p>청산가를 입력하면 자동으로 손익이 계산됩니다.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
