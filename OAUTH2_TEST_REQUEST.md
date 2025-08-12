# 🔐 Google OAuth2.0 인증 시스템 테스트 요청

## 📋 테스트 요청 개요

CryptoTradeManager의 Google OAuth2.0 인증 시스템이 구현 완료되어 테스트를 요청드립니다.

## 🚀 프로젝트 현황

### ✅ 완료된 작업
- **완전한 Gradle 독립 프로젝트 구조 리팩토링**
- **Spring Boot 3.5.4 + Java 17 최적화**
- **commons-logging 충돌 문제 해결**
- **JWT + Google OAuth2.0 인증 시스템 구현**

### 🏗️ 인증 시스템 구조
```
📁 backend/src/main/java/com/example/trading_bot/auth/
├── 🔧 config/
│   ├── SecurityConfig.java          # Spring Security 설정
│   ├── OAuth2Properties.java       # OAuth2 설정 프로퍼티
│   └── HttpClientConfig.java       # HTTP 클라이언트 설정
├── 🎯 controller/
│   ├── AuthController.java         # 기본 인증 (회원가입/로그인)
│   └── OAuth2Controller.java       # Google OAuth2 인증
├── 🔑 jwt/
│   └── JwtTokenProvider.java       # JWT 토큰 생성/검증
├── 📦 service/
│   ├── AuthService.java            # 인증 비즈니스 로직
│   ├── OAuth2Service.java          # OAuth2 비즈니스 로직
│   └── UserService.java            # 사용자 관리
└── 🗄️ entity/
    ├── User.java                   # 사용자 엔티티
    ├── RefreshToken.java           # 리프레시 토큰
    └── ProviderType.java           # 로그인 제공자 (LOCAL/GOOGLE)
```

## 🧪 테스트 항목

### 1. 기본 인증 시스템
- [x] **회원가입** `POST /api/auth/register`
- [x] **로그인** `POST /api/auth/login`  
- [x] **토큰 갱신** `POST /api/auth/refresh`
- [x] **로그아웃** `POST /api/auth/logout`

### 2. Google OAuth2.0 인증 🎯
- [ ] **Google 로그인** `POST /api/oauth2/google/login`
- [ ] **Google 토큰 검증** 
- [ ] **사용자 정보 자동 생성**
- [ ] **JWT 토큰 발급**
- [ ] **기존 계정과의 연동**

### 3. 보안 테스트
- [ ] **JWT 토큰 검증**
- [ ] **만료된 토큰 처리**
- [ ] **잘못된 Google 토큰 처리**
- [ ] **중복 계정 처리**

## 🔑 Google OAuth2.0 설정 요구사항

### 환경변수 설정 필요:
```yaml
# application.yaml
oauth2:
  google:
    client-id: ${GOOGLE_CLIENT_ID}
    client-secret: ${GOOGLE_CLIENT_SECRET}
    redirect-uri: ${GOOGLE_REDIRECT_URI:http://localhost:8080/api/oauth2/google/callback}
```

### Google Cloud Console 설정:
1. **프로젝트 생성** 또는 기존 프로젝트 사용
2. **OAuth 2.0 클라이언트 ID 생성**
3. **승인된 리디렉션 URI** 추가
4. **클라이언트 ID/Secret** 환경변수 설정

## 🚀 테스트 실행 방법

### 1. 프로젝트 빌드 및 실행
```bash
# 프로젝트 클론
git clone https://github.com/heysep/coin_trading_journal.git
cd coin_trading_journal

# 빌드 및 실행 (Windows)
verify.bat    # 전체 검증
build.bat     # 빌드
run.bat       # 실행

# 빌드 및 실행 (Linux/Mac)
./gradlew clean :backend:build
./gradlew :backend:bootRun
```

### 2. API 테스트 엔드포인트
```
🌐 애플리케이션: http://localhost:8080
📚 API 문서: http://localhost:8080/swagger-ui.html
🔍 Health Check: http://localhost:8080/actuator/health
```

### 3. Google OAuth2.0 테스트 시나리오

#### 시나리오 1: 새로운 Google 계정 로그인
```bash
POST /api/oauth2/google/login
Content-Type: application/json

{
  "accessToken": "GOOGLE_ACCESS_TOKEN",
  "email": "test@gmail.com",
  "name": "테스트 사용자"
}
```

#### 시나리오 2: 기존 Google 계정 재로그인
```bash
# 같은 이메일로 다시 로그인 시 기존 계정 인식
```

#### 시나리오 3: 잘못된 토큰 처리
```bash
# 유효하지 않은 Google Access Token 전송 시 오류 처리
```

## 📊 예상 결과

### ✅ 성공 케이스
```json
{
  "success": true,
  "message": "Google OAuth2 로그인 성공",
  "data": {
    "accessToken": "JWT_ACCESS_TOKEN",
    "refreshToken": "JWT_REFRESH_TOKEN",
    "user": {
      "id": 1,
      "email": "test@gmail.com",
      "name": "테스트 사용자",
      "provider": "GOOGLE"
    }
  }
}
```

### ❌ 실패 케이스
```json
{
  "success": false,
  "message": "유효하지 않은 Google 토큰",
  "errorCode": "INVALID_OAUTH_TOKEN"
}
```

## 🐛 알려진 이슈 및 주의사항

1. **데이터베이스 연결**: PostgreSQL 연결이 필요합니다
2. **Google API 할당량**: 테스트 시 API 호출 제한 고려
3. **CORS 설정**: 프론트엔드 연동 시 CORS 설정 필요
4. **환경변수**: Google 클라이언트 ID/Secret 필수 설정

## 🆘 문제 발생 시

### 로그 확인 위치:
- **애플리케이션 로그**: 콘솔 출력
- **에러 로그**: `backend/logs/` (설정된 경우)
- **Swagger UI**: API 테스트 및 문서 확인

### 일반적인 문제 해결:
```bash
# 포트 충돌 시
netstat -ano | findstr :8080
taskkill /PID [PID번호] /F

# 빌드 문제 시
gradlew.bat clean
gradlew.bat :backend:build --refresh-dependencies

# 데이터베이스 연결 문제 시
# application.yaml의 데이터베이스 설정 확인
```

## 📞 연락처

테스트 중 문제가 발생하거나 추가 정보가 필요하시면 이슈를 생성해 주세요.

**테스트 완료 후 리포트 요청 항목:**
- [ ] 각 API 엔드포인트별 테스트 결과
- [ ] Google OAuth2.0 로그인 플로우 성공/실패 여부  
- [ ] 발견된 버그나 개선사항
- [ ] 보안 관련 피드백
- [ ] 사용자 경험 개선 제안

---

🙏 **테스트에 참여해 주셔서 감사합니다!**

더 나은 CryptoTradeManager를 만들기 위해 소중한 피드백을 기다리고 있습니다.