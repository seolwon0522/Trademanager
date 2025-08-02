export default function SettingsPage() {
  return (
    <div className="min-h-full bg-background">
      <div className="border-b bg-muted/50">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold tracking-tight">설정</h1>
          <p className="text-muted-foreground mt-2">애플리케이션 설정을 관리하세요.</p>
        </div>
      </div>

      <div className="p-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">설정 메뉴</h3>
          <p className="text-muted-foreground">프로필, 알림, 보안 설정을 관리할 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
}
