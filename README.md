# 📌 Real-time Sticky Board (실시간 협업 포스트잇)

사용자들이 실시간으로 메모를 생성하고, 위치를 옮기며 의견을 나눌 수 있는 **협업용 디지털 화이트보드**입니다.

## 🚀 주요 기능

### 1. 실시간 협업 (Real-time Sync)
* **STOMP & WebSocket**: 별도의 새로고침 없이 모든 사용자의 액션(생성, 이동, 수정, 삭제)이 즉시 동기화됩니다.
* **실시간 커서 (Live Cursors)**: 접속 중인 다른 사용자의 마우스 위치를 고유한 색상 및 ID와 함께 실시간으로 확인할 수 있습니다.

### 2. 향상된 UX (User Experience)
* **자유로운 배치**: 드래그 앤 드롭을 통해 보드 위 어디든 포스트잇을 자유롭게 배치할 수 있습니다.
* **우선순위 관리 (Z-Index)**: 마지막에 클릭하거나 수정한 포스트잇이 자동으로 최상단으로 올라옵니다.
* **반응형 편집**: 더블 클릭 시 즉시 편집 모드로 진입하며, 포커스를 잃으면(`onBlur`) 자동 저장됩니다.

---

## 🛠 기술 스택

### 🔹 Frontend
* **React 19** (TypeScript)
* **StompJS & SockJS**: 실시간 양방향 메시징
* **Tailwind CSS**: UI 스타일링

### 🔹 Backend
* **Spring Boot 4**
* **Spring Message (WebSocket)**: STOMP 기반 메시지 브로커
* **Spring Data JPA**: 데이터 영속성 관리
* **H2 Database**: 인메모리 DB



---

## 🏗 프로젝트 구조

```text
├── backend (Spring Boot)
│   ├── controller      # WebSocket MessageMapping & API
│   ├── entity          # PostIt 모델
│   ├── service         # 비즈니스 로직 및 트랜잭션 관리
│   └── config          # WebSocket & CORS 설정
│
└── frontend (React)
    ├── components      # PostItItem, UI 컴포넌트
    ├── hooks           # usePostIts, useCursors (커스텀 훅)
    └── App.tsx         # 메인 보드 및 훅 연결 로직
```

## 💡 주요 해결 과제 (Problem Solving)

### 1. 관심사 분리를 통한 가독성 향상
* **문제**: `App.tsx` 하나에 모든 통신과 UI 로직이 섞여 유지보수가 어려워짐.
* **해결**: `usePostIts`(포스트잇 데이터 및 통신 담당)와 `useCursors`(사용자 이벤트 전송 담당) 커스텀 훅으로 로직을 분리. `App.tsx`는 오직 상태를 연결하고 화면을 그리는 역할에만 집중하도록 설계했습니다.

### 2. 실시간 커서 성능 최적화 (Throttling)
* **문제**: 마우스 이동 이벤트(`onMouseMove`)는 초당 수백 번 발생하며, 이를 모두 서버로 전송할 경우 네트워크 부하 및 성능 저하 유발.
* **해결**: `useRef`를 활용해 마지막 전송 시간을 기록하고, **50ms(초당 약 20회) 간격으로 전송을 제한**하는 로직을 구현하여 성능과 실시간성 사이의 균형을 맞췄습니다.

### 3. WebSocket 타입 안정성 확보
* **문제**: DB 초기 데이터나 전송 과정에서 `null` 값이 `int` 타입 필드에 매핑될 때 `MismatchedInputException` 서버 에러 발생.
* **해결**: 백엔드 엔티티의 기본 타입을 래퍼 클래스인 `Integer`로 변경하여 `null` 허용성을 확보하고, 프론트엔드 렌더링 시 Null 병합 연산자(`?? 10`)를 사용하여 안정적인 UI 렌더링을 보장했습니다.

---

## 🏁 시작하기 (Getting Started)

### 1. Backend (Spring Boot)
```bash
cd backend
./gradlew bootRun
```
* 서버 포트 : `8080` (WebSocket Endpoint: `/ws-postits`)

### 2. Frontend (React)
```bash
cd frontend
npm install
npm start
```
* 클라이언트 포트: `3000`