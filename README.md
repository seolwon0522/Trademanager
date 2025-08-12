# CryptoTradeManager

> 🚀 **AI 기반 암호화폐 자동매매 및 분석 플랫폼**  
> Binance API 연동을 통한 실시간 거래 분석, 성과 평가, 자동매매 통합 솔루션

[![Java](https://img.shields.io/badge/Java-17-orange)](https://openjdk.org/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.4-brightgreen)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yourusername/CryptoTradeManager)

---

## 📋 목차

- [🎯 프로젝트 소개](#-프로젝트-소개)
- [📊 현재 진척 상황](#-현재-진척-상황)
- [✨ 구현된 기능](#-구현된-기능)
- [🛠 기술 스택](#-기술-스택)
- [🚀 설치 및 실행](#-설치-및-실행)
- [📁 프로젝트 구조](#-프로젝트-구조)
- [⚙️ 개발 환경 설정](#️-개발-환경-설정)
- [📖 API 문서](#-api-문서)
- [🗺 개발 로드맵](#-개발-로드맵)
- [🤝 기여하기](#-기여하기)

---

## 🎯 프로젝트 소개

**CryptoTradeManager**는 암호화폐 트레이더의 거래 분석 및 성과 관리를 위한 통합 플랫폼입니다.  
Binance API 연동을 통해 실시간 거래 데이터를 수집하고, AI 기반 분석으로 매매 성과를 평가하며,  
전략 기반 자동매매를 제공하여 24/7 거래 기회를 활용할 수 있도록 지원합니다.

### 🎯 비즈니스 목표
- **주요 목표**: 암호화폐 트레이더의 거래 분석 및 성과 관리 효율성 향상
- **부가 목표**: AI 기반 매매 피드백을 통한 트레이딩 스킬 개선 지원  
- **확장 목표**: 자동매매를 통한 24/7 거래 기회 활용 및 체계적인 리스크 관리

---

## 📊 현재 진척 상황

### 🟢 완료된 기능 (Phase 1 - 기본 인프라)

| 영역 | 상태 | 완성도 | 설명 |
|------|------|--------|------|
| **프로젝트 구조** | ✅ 완료 | 95% | Spring Boot 3.5.4 기반 멀티 모듈 구조 설정 |
| **인증 시스템** | ✅ 완료 | 90% | JWT + OAuth2 기반 사용자 인증 구현 |
| **데이터베이스** | ✅ 완료 | 85% | PostgreSQL 연동 및 기본 엔티티 설계 |
| **보안 설정** | ✅ 완료 | 80% | Spring Security 설정 및 비밀번호 암호화 |
| **API 문서화** | ✅ 완료 | 90% | Swagger UI 연동 및 기본 API 스펙 |

### 🟡 진행 중인 작업

| 영역 | 상태 | 예상 완료 | 설명 |
|------|------|-----------|------|
| **패키지 구조 정리** | 🔄 진행중 | 1주 | `com.example.trading_bot` → `com.cryptotrademanager` 마이그레이션 |
| **Binance API 연동** | 🔄 진행중 | 2주 | REST API v3 기본 연동 구현 |
| **사용자 관리 API** | 🔄 진행중 | 1주 | 회원가입, 로그인, 프로필 관리 API 완성 |

### 🔴 계획된 기능 (향후 개발)

| Phase | 기능 | 예상 기간 | 우선순위 |
|-------|------|-----------|----------|
| **Phase 2** | 거래 내역 관리 시스템 | 3주 | 높음 |
| **Phase 3** | 실시간 대시보드 | 4주 | 높음 |
| **Phase 4** | AI 분석 엔진 | 6주 | 중간 |
| **Phase 5** | 자동매매 시스템 | 8주 | 중간 |
| **Phase 6** | 프론트엔드 개발 | 10주 | 낮음 |

---

## ✨ 구현된 기능

### 🔐 사용자 인증 시스템
- **JWT 토큰 기반 인증**: Access Token (30분) + Refresh Token (7일)
- **OAuth2 소셜 로그인**: Google, Apple 로그인 준비 완료
- **비밀번호 암호화**: BCrypt 해싱 적용
- **사용자 역할 관리**: USER, ADMIN 역할 구분

### 🏗 기본 인프라
- **Spring Boot 3.5.4**: 최신 버전 프레임워크 적용
- **PostgreSQL 연동**: JPA/Hibernate 기반 데이터 관리
- **예외 처리**: 글로벌 예외 핸들러 구현
- **설정 관리**: 환경별(dev/prod) 설정 분리

### 📚 API 문서화
- **Swagger UI**: 자동 API 문서 생성
- **OpenAPI 3.0**: 표준 API 스펙 준수

---

## 🛠 기술 스택

### 🏗 Backend (구현 완료)
| 기술 | 버전 | 상태 | 용도 |
|------|------|------|------|
| **Java** | 17 | ✅ | 메인 프로그래밍 언어 |
| **Spring Boot** | 3.5.4 | ✅ | 백엔드 프레임워크 |
| **Spring Security** | 6.0+ | ✅ | 인증 및 보안 |
| **Spring Data JPA** | - | ✅ | 데이터베이스 ORM |
| **Lombok** | - | ✅ | 코드 간소화 |
| **JWT** | 0.12.3 | ✅ | 토큰 기반 인증 |

### 🗄 Database (구현 완료)
| 기술 | 버전 | 상태 | 용도 |
|------|------|------|------|
| **PostgreSQL** | 16 | ✅ | 메인 데이터베이스 |

### 🌐 Frontend (계획)
| 기술 | 버전 | 상태 | 용도 |
|------|------|------|------|
| **React** | 18 | 📋 계획 | 프론트엔드 프레임워크 |
| **TypeScript** | 4.9+ | 📋 계획 | 타입 안전성 |
| **Material-UI** | v5 | 📋 계획 | UI 컴포넌트 라이브러리 |

### 🔌 External APIs (계획)
- **Binance REST API v3**: 거래소 데이터 조회 및 주문 실행 (진행중)
- **Binance WebSocket**: 실시간 가격 및 거래 데이터 (계획)

---

## 🚀 설치 및 실행

### 📋 사전 요구사항

- **Java 17** 이상
- **PostgreSQL** 16 이상
- **Git**

### 🔧 빠른 시작

1. **프로젝트 클론**
```bash
git clone https://github.com/yourusername/CryptoTradeManager.git
cd CryptoTradeManager
```

2. **데이터베이스 설정**
```sql
-- PostgreSQL 데이터베이스 생성
CREATE DATABASE trading_bot;
CREATE USER trading_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE trading_bot TO trading_user;
```

3. **환경 설정**
```yaml
# src/main/resources/application.yaml 수정
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/trading_bot
    username: trading_user
    password: your_password

jwt:
  secret: your-super-secret-jwt-key-minimum-256-bits-long
```

4. **애플리케이션 실행**
```bash
# 권한 부여 (Linux/macOS)
chmod +x gradlew

# 애플리케이션 빌드 및 실행
./gradlew bootRun

# Windows
gradlew.bat bootRun
```

5. **접속 확인**
```bash
# 애플리케이션 상태 확인
curl http://localhost:8080/actuator/health

# Swagger API 문서 확인
open http://localhost:8080/swagger-ui.html
```

---

## 📁 프로젝트 구조

### 현재 구조 (수정 필요)
```
src/main/java/com/example/trading_bot/
├── TradingBotApplication.java      # 메인 애플리케이션 클래스
├── auth/                          # 🟢 인증 및 권한 관리 (90% 완료)
│   ├── config/                    # Spring Security 설정
│   ├── controller/                # 인증 관련 API 컨트롤러
│   ├── dto/                       # 요청/응답 DTO
│   ├── entity/                    # User, Role 엔티티
│   ├── jwt/                       # JWT 토큰 처리
│   ├── repository/                # 사용자 데이터 리포지토리
│   ├── security/                  # Spring Security 설정
│   └── service/                   # 인증 비즈니스 로직
├── common/                        # 🟢 공통 컴포넌트 (80% 완료)
│   ├── dto/                       # 공통 응답 DTO
│   ├── entity/                    # BaseTimeEntity
│   └── exception/                 # 글로벌 예외 처리
├── exchange/                      # 🔴 거래소 연동 (0% 완료)
├── trading/                       # 🔴 거래 관리 (0% 완료)
├── strategy/                      # 🔴 전략 관리 (0% 완료)
├── bot/                          # 🔴 자동매매 봇 (0% 완료)
├── analysis/                     # 🔴 AI 분석 (0% 완료)
├── dashboard/                    # 🔴 대시보드 (0% 완료)
└── notification/                 # 🔴 알림 시스템 (0% 완료)
```

### 목표 구조 (패키지 이름 변경 필요)
```
src/main/java/com/cryptotrademanager/
└── (위와 동일한 구조)
```

---

## ⚙️ 개발 환경 설정

### 🔧 IDE 설정 

#### IntelliJ IDEA 권장 설정
```bash
# Lombok 플러그인 설치 필수
# Settings > Build > Compiler > Annotation Processors > Enable annotation processing 체크

# 패키지 구조 문제 해결
# File > Project Structure > Modules에서 소스 폴더 확인
```

### 🗄 데이터베이스 설정

#### PostgreSQL 설치
```bash
# macOS
brew install postgresql
brew services start postgresql
createdb trading_bot

# Ubuntu
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
sudo -u postgres createdb trading_bot
```

### ⚙️ 환경 변수 설정

현재 `application.yaml`에 하드코딩된 설정을 환경 변수로 분리 필요:

```env
# .env 파일 예시 (향후 적용)
DATABASE_URL=jdbc:postgresql://localhost:5432/trading_bot
DATABASE_USERNAME=trading_user
DATABASE_PASSWORD=your_password

JWT_SECRET=your-super-secret-jwt-key-minimum-256-bits-long
JWT_ACCESS_TOKEN_VALIDITY=1800
JWT_REFRESH_TOKEN_VALIDITY=604800

GOOGLE_CLIENT_ID=your_google_client_id
APPLE_CLIENT_ID=your_apple_client_id

LOG_LEVEL=INFO
```

---

## 📖 API 문서

### 🌐 Swagger UI
개발 서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:

- **Local**: http://localhost:8080/swagger-ui.html
- **API Docs JSON**: http://localhost:8080/v3/api-docs

### 🔑 현재 구현된 API 엔드포인트

#### 인증 API (구현 완료)
```http
POST   /api/v1/auth/register     # 회원가입
POST   /api/v1/auth/login        # 로그인  
POST   /api/v1/auth/refresh      # 토큰 갱신
POST   /api/v1/auth/logout       # 로그아웃
GET    /api/v1/auth/oauth2/google # Google OAuth2 로그인
```

#### 향후 구현 예정 API
```http
# 거래 내역 API (Phase 2)
GET    /api/v1/trades            # 거래 내역 조회
POST   /api/v1/trades            # 수동 거래 등록

# 자동매매 봇 API (Phase 5)  
GET    /api/v1/bots              # 봇 목록 조회
POST   /api/v1/bots              # 봇 생성

# 전략 관리 API (Phase 4)
GET    /api/v1/strategies        # 전략 목록
POST   /api/v1/strategies        # 전략 생성
```

---

## 🗺 개발 로드맵

### 📅 Phase 1: 기본 인프라 (완료 - Week 1-2)
- [x] Spring Boot 프로젝트 초기 설정
- [x] PostgreSQL 데이터베이스 연동
- [x] JWT 기반 인증 시스템 구현
- [x] Spring Security 설정
- [x] Swagger API 문서화 설정
- [ ] 패키지 구조 정리 (`com.example.trading_bot` → `com.cryptotrademanager`)

### 📅 Phase 2: 거래소 연동 (진행중 - Week 3-5)
- [ ] Binance REST API v3 기본 연동
- [ ] API 키 관리 시스템 구현
- [ ] 계정 정보 조회 기능
- [ ] 거래 내역 수집 기능
- [ ] 실시간 가격 정보 수집

### 📅 Phase 3: 거래 관리 시스템 (계획 - Week 6-8)
- [ ] 거래 내역 CRUD API
- [ ] 손익 계산 로직
- [ ] 거래 통계 분석
- [ ] 태그 및 메모 기능
- [ ] 필터링 및 검색 기능

### 📅 Phase 4: 대시보드 백엔드 (계획 - Week 9-12)
- [ ] 포트폴리오 현황 API
- [ ] 실시간 성과 지표 API
- [ ] 시장 정보 수집 및 제공
- [ ] WebSocket 실시간 통신

### 📅 Phase 5: AI 분석 시스템 (계획 - Week 13-18)
- [ ] 거래 성과 점수화 알고리즘
- [ ] AI 피드백 생성 엔진
- [ ] 패턴 분석 시스템
- [ ] 개인화된 조언 시스템

### 📅 Phase 6: 자동매매 시스템 (계획 - Week 19-26)
- [ ] 전략 관리 시스템
- [ ] 백테스트 엔진
- [ ] 자동매매 봇 엔진
- [ ] 리스크 관리 시스템

### 📅 Phase 7: 프론트엔드 개발 (계획 - Week 27-36)
- [ ] React 프로젝트 설정
- [ ] 사용자 인증 UI
- [ ] 대시보드 UI
- [ ] 거래 관리 UI
- [ ] 봇 관리 UI

---

## 🐛 알려진 이슈 및 기술 부채

### 🔴 Critical Issues
1. **패키지 구조 불일치**: `com.example.trading_bot` vs `com.cryptotrademanager`
   - 영향: 프로젝트 문서와 실제 코드 구조 불일치
   - 해결 계획: Week 3에 전체 패키지 리팩토링

2. **하드코딩된 설정**: `application.yaml`에 민감 정보 노출
   - 영향: 보안 리스크 및 환경별 배포 어려움
   - 해결 계획: 환경 변수 및 외부 설정 파일로 분리

### 🟡 Medium Issues
1. **테스트 코드 부족**: 현재 테스트 커버리지 부족
   - 영향: 코드 품질 및 안정성 저하
   - 해결 계획: 각 Phase 개발 시 테스트 코드 병행 작성

2. **API 응답 표준화 미흡**: 일관된 응답 형식 필요
   - 영향: 프론트엔드 연동 시 복잡성 증가
   - 해결 계획: `ApiResponse` 클래스 확장 및 표준화

### 🟢 Low Priority Issues
1. **Lombok 의존성**: 일부 IDE에서 설정 복잡
   - 영향: 개발 환경 설정 복잡성
   - 해결 계획: 문서화 개선 및 설정 가이드 제공

---

## 🧪 테스트 실행

### 현재 테스트 상태
```bash
# 기본 테스트 실행 (현재 Spring Boot 기본 테스트만 존재)
./gradlew test

# 테스트 리포트 확인
open build/reports/tests/test/index.html
```

### 향후 테스트 계획
- **Unit Tests**: 각 서비스 클래스별 단위 테스트
- **Integration Tests**: API 엔드포인트 통합 테스트  
- **Security Tests**: 인증 및 권한 테스트
- **Performance Tests**: API 응답 시간 테스트

---

## 🤝 기여하기

CryptoTradeManager 프로젝트에 기여해주셔서 감사합니다! 

### 📝 기여 가이드라인

1. **이슈 확인**: [GitHub Issues](https://github.com/yourusername/CryptoTradeManager/issues)에서 기존 이슈 확인
2. **Fork & Branch**: 프로젝트 Fork 후 feature 브랜치 생성
3. **개발**: 코딩 컨벤션 준수하여 개발
4. **테스트**: 단위 테스트 및 통합 테스트 작성
5. **Pull Request**: 상세한 설명과 함께 PR 생성

### 🔍 코딩 컨벤션

#### Java 코딩 스타일
```java
// ✅ Good
@Service
@RequiredArgsConstructor
@Slf4j
public class TradingService {
    
    private final TradingRepository tradingRepository;
    
    @Transactional(readOnly = true)
    public List<TradeDto> findTradesByUserId(String userId) {
        return tradingRepository.findByUserId(userId)
            .stream()
            .map(this::convertToDto)
            .collect(toList());
    }
}

// ❌ Bad  
public class tradingservice {
    @Autowired TradingRepository repo;
    public List<TradeDto> getTrades(String id){/*...*/}
}
```

#### Commit 메시지 컨벤션
```bash
# 형식: type(scope): subject

feat(auth): JWT 토큰 기반 인증 시스템 구현
fix(trading): 수수료 계산 오류 수정
docs(readme): API 문서 업데이트
test(bot): 자동매매 봇 단위 테스트 추가
refactor(strategy): 전략 실행 로직 리팩토링
```

---

## 📄 라이선스

이 프로젝트는 **MIT License** 하에 배포됩니다.  
자세한 내용은 [LICENSE](LICENSE) 파일을 참고해주세요.

---

## 📞 문의 및 지원

- **GitHub Issues**: [프로젝트 이슈 트래커](https://github.com/yourusername/CryptoTradeManager/issues)
- **개발진 이메일**: dev@cryptotrademanager.com
- **보안 이슈**: security@cryptotrademanager.com

---

*마지막 업데이트: 2025년 8월 12일*