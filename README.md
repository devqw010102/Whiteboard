# 📌 Real-time Sticky Board (실시간 협업 포스트잇)

사용자들이 실시간으로 메모를 생성하고, 위치를 옮기며 의견을 나눌 수 있는 **협업용 디지털 화이트보드**입니다.

## 🚀 주요 기능

### 1. 실시간 협업 (Real-time Sync)
- **STOMP & WebSocket**: 별도의 새로고침 없이 모든 사용자의 액션(생성, 이동, 수정, 삭제)이 즉시 동기화됩니다.
- **실시간 커서 (Next Step)**: 접속 중인 다른 사용자의 마우스 위치를 실시간으로 확인할 수 있습니다.

### 2. 향상된 UX (User Experience)
- **자유로운 배치**: 드래그 앤 드롭을 통해 보드 위 어디든 포스트잇을 배치할 수 있습니다.
- **색상 커스터마이징**: 5가지 파스텔 톤 팔레트를 제공하여 카테고리별로 메모를 분류할 수 있습니다.
- **우선순위 관리 (Z-Index)**: 마지막에 클릭하거나 수정한 포스트잇이 자동으로 맨 위로 올라와 작업 편의성을 높였습니다.
- **안전한 삭제**: 실수로 데이터를 날리지 않도록 2단계 확인 버튼 UI를 구현했습니다.

### 3. 반응형 편집
- 더블 클릭을 통해 즉시 편집 모드로 진입하며, 포커스를 잃으면(`onBlur`) 자동으로 저장됩니다.

---

## 🛠 기술 스택

### Frontend
- **React 18** (TypeScript)
- **StompJS & SockJS**: 실시간 메시징 처리
- **Axios**: API 통신

### Backend
- **Spring Boot 4.0.2**
- **Spring Message (WebSocket)**: STOMP 기반 메시지 브로커 구현
- **Spring Data JPA**: 데이터 영속성 관리
- **H2 Database**: 가벼운 인메모리 데이터베이스 기반 개발



---

## 🏗 프로젝트 구조

```text
├── backend (Spring Boot)
│   ├── controller      # REST API & WebSocket MessageMapping
│   ├── entity          # PostIt 데이터 모델 (x, y, color, zIndex 등)
│   ├── service         # 비즈니스 로직 및 트랜잭션 관리
│   └── config          # WebSocket & CORS 설정
│
└── frontend (React)
    ├── components      # PostItItem 등 공용 컴포넌트
    ├── hooks           # usePostIts (커스텀 훅, WebSocket 로직 포함)
    └── App.tsx         # 메인 보드 및 이벤트 핸들링
```

## 💡 주요 해결 과제 (Problem Solving)

### 1. 교차 출처 자원 공유 (CORS) 문제 해결
- **문제**: React(Port 3000)와 Spring Boot(Port 8080)의 포트가 달라 브라우저 보안 정책상 API 호출 및 WebSocket 연결이 차단됨.
- **해결**:
    - 일반 API는 `WebMvcConfigurer`를 통해 특정 Origin을 허용하도록 설정.
    - WebSocket의 경우 `registerStompEndpoints` 설정 시 `.setAllowedOriginPatterns("*")`를 추가하여 통신 인프라를 구축함.

### 2. 데이터 타입 불일치 및 Null 처리 (MismatchedInputException)
- **문제**: 포스트잇의 이동(`move`) 메시지 전송 시, 새로 추가된 `zIndex` 필드가 포함되지 않아 서버에서 `null`을 `int`로 매핑하지 못해 에러 발생.
- **해결**:
    - 엔티티의 필드 타입을 기본형(`int`)에서 래퍼 클래스(`Integer`)로 변경하여 `null` 허용.
    - 데이터베이스 수준에서 `default 10` 설정을 추가하고, 프론트엔드 전송 객체에 기본값을 보장하는 로직을 추가하여 런타임 에러를 방지함.

### 3. WebSocket 기반 실시간 동기화 최적화
- **문제**: 여러 사용자가 동시에 데이터를 수정할 때 화면이 깜빡이거나 데이터가 꼬이는 현상 우려.
- **해결**:
    - STOMP의 **Pub/Sub(발행/구독)** 구조를 활용하여 서버는 데이터 브로커 역할만 수행하고, 각 클라이언트는 구독 중인 토픽을 통해 상태를 업데이트하도록 설계함.
    - `setPostIts` 업데이트 시 함수형 업데이트(`prev => ...`)를 사용하여 최신 상태를 보장하고 중복 데이터를 필터링함.

### 4. 사용자 경험(UX) 디테일 개선
- **문제**: 포스트잇이 겹쳤을 때 어떤 것이 최상단인지 구분하기 어렵고, 실수로 인한 삭제가 빈번함.
- **해결**:
    - **Z-Index 동적 관리**: 클릭 이벤트를 감지하여 서버에 우선순위 업데이트 신호를 보내고, 모든 사용자의 화면에서 해당 포스트잇이 맨 위로 올라오도록 구현.
    - **2단계 삭제 확인**: 즉시 삭제 대신 버튼 상태를 변경하여 사용자 확인을 한 번 더 거치도록 유도하는 인라인 확인 UI 도입.