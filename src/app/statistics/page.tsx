export default function StatisticsPage() {
  return (
    <div className="min-h-full bg-background">
      <div className="border-b bg-muted/50">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold tracking-tight">통계</h1>
          <p className="text-muted-foreground mt-2">상세한 투자 통계를 분석하세요.</p>
        </div>
      </div>

      <div className="p-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 mb-4">
            NEW
          </div>
          <h3 className="text-lg font-semibold mb-2">새로운 통계 기능</h3>
          <p className="text-muted-foreground">고급 통계 분석 기능이 추가되었습니다!</p>
        </div>
      </div>
    </div>
  );
}
