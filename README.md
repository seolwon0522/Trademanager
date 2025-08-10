# 코인 거래 저널 - 모노레포

암호화폐 거래 기록을 관리하고 분석하는 풀스택 애플리케이션입니다.

## 프로젝트 구조

```
coin_trading_journal/
├── frontend/              # Next.js 프론트엔드
│   ├── src/              # React 컴포넌트 및 페이지
│   ├── public/           # 정적 파일
│   └── package.json      # 프론트엔드 의존성
├── backend/              # Spring Boot 메인 백엔드 (예정)
│   ├── src/              # Java 소스 코드
│   ├── build.gradle      # Gradle 설정
│   └── README.md         # 백엔드 문서
├── trading-engine/       # Python 매매평가 엔진 (예정)
│   ├── app/              # FastAPI 애플리케이션
│   ├── requirements.txt  # Python 의존성
│   └── docker-compose.yml # 컨테이너 설정
└── package.json          # 모노레포 루트 설정
```

## 기술 스택

### 프론트엔드 (frontend/)

- **Next.js 15** - React 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 스타일링
- **React Query** - 서버 상태 관리
- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증
- **Recharts** - 차트 라이브러리

### 메인 백엔드 (backend/)

- **Java** - 백엔드 언어
- **Spring Boot** - 웹 프레임워크
- **Spring Data JPA** - 데이터베이스 ORM
- **PostgreSQL** - 메인 데이터베이스
- **Gradle** - 빌드 도구

### 매매평가 엔진 (trading-engine/)

- **Python** - 분석 및 알고리즘
- **FastAPI** - 고성능 API 프레임워크
- **Pandas** - 데이터 분석
- **Docker** - 컨테이너화

## 개발 환경 설정

### 필수 요구사항

- Node.js 18.0.0 이상
- Java 17 이상
- Python 3.9 이상
- Docker (선택사항)

### 전체 설치 및 실행

1. **모든 의존성 설치**

   ```bash
   npm install
   ```

2. **프론트엔드 개발 서버 실행**

   ```bash
   npm run dev:frontend
   ```

3. **백엔드 서버 실행** (예정)

   ```bash
   npm run dev:backend
   ```

4. **매매평가 엔진 실행** (예정)
   ```bash
   npm run dev:trading
   ```

## 사용 가능한 스크립트

### 프론트엔드

- `npm run dev` - 프론트엔드 개발 서버 실행
- `npm run build` - 프론트엔드 프로덕션 빌드
- `npm run lint` - 프론트엔드 코드 린팅

### 통합 스크립트

- `npm run dev:all` - 모든 서비스 동시 실행
- `npm run build:all` - 모든 서비스 빌드
- `npm run docker:up` - Docker로 전체 스택 실행
- `npm run docker:down` - Docker 스택 종료

### Docker 명령어

- `docker-compose up -d` - 프로덕션 모드로 실행
- `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up` - 개발 모드로 실행

## 마이그레이션 현황

1. ✅ **1단계**: 프론트엔드를 frontend/ 폴더로 이동 완료
2. ✅ **2단계**: Trademanager 백엔드를 backend/ 폴더로 통합 완료
3. ✅ **3단계**: coin_trading Python 엔진을 trading-engine/ 폴더로 통합 완료
4. ✅ **4단계**: 통합 개발환경 구성 (Docker Compose 등) 완료

## 아키텍처

```
[ 프론트엔드 ]  ←→  [ 메인 백엔드 ]  ←→  [ 매매평가 엔진 ]
   Next.js              Spring Boot          FastAPI
   포트: 3000           포트: 8080           포트: 8000
```

## 실행 방법

### 1. FastAPI 백엔드 (주간 패턴 분석)

#### 사전 준비

```bash
# PostgreSQL 설치 및 데이터베이스 생성
psql -U postgres -h localhost
CREATE DATABASE trading_journal ENCODING 'UTF8' TEMPLATE template0;
CREATE ROLE journal WITH LOGIN PASSWORD 'journal123';
GRANT ALL PRIVILEGES ON DATABASE trading_journal TO journal;
ALTER DATABASE trading_journal OWNER TO journal;
```

#### 환경 변수 설정

```bash
export DATABASE_URL="postgresql://journal:journal123@localhost:5432/trading_journal"
export OPENAI_API_KEY="your_openai_api_key"  # GPT 패턴 분석용 (선택사항)
```

#### 서버 실행

```bash
cd trading-engine/app
pip install fastapi "uvicorn[standard]" sqlalchemy psycopg2-binary openai pydantic python-dotenv
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### API 문서 (Swagger)

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

#### 주요 엔드포인트

- `GET /`: 서버 상태 확인
- `GET /health`: 헬스 체크
- `POST /trades`: 거래 생성 (스코어링 포함)
- `GET /trades`: 거래 목록 조회
- `POST /patterns/weekly/analyze`: 주간 패턴 분석 (GPT-4o mini)
- `GET /patterns/history`: 패턴 히스토리 조회

### 2. Next.js 프론트엔드

#### 환경 변수 설정

```bash
cd frontend
echo "BACKEND_BASE_URL=http://localhost:8000" >> .env.local
```

#### 서버 실행

```bash
npm install
npm run dev
```

#### 접속

- **프론트엔드**: http://localhost:3000
- **백엔드 연동**: 자동으로 FastAPI와 연결됨

### 3. 전체 시스템 실행 순서

1. **PostgreSQL 시작**: 데이터베이스 서버 실행
2. **FastAPI 실행**:
   ```bash
   cd trading-engine/app
   export DATABASE_URL="postgresql://journal:journal123@localhost:5432/trading_journal"
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
3. **프론트엔드 실행**:
   ```bash
   cd frontend
   npm run dev
   ```

### 4. 테스트

#### FastAPI 테스트

```bash
curl http://localhost:8000/health
```

#### 주간 패턴 분석 테스트

```bash
curl -X POST "http://localhost:8000/patterns/weekly/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user",
    "start": "2024-01-01",
    "end": "2024-01-07"
  }'
```

## 라이센스

MIT
