# 🚀 빠른 시작 가이드

## 1단계: Firebase 설정 (5분)

### Firebase 프로젝트 생성
1. https://console.firebase.google.com/ 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: tetris-game)
4. Google 애널리틱스는 선택사항 (건너뛰기 가능)

### Firestore 활성화
1. 좌측 메뉴에서 "Firestore Database" 선택
2. "데이터베이스 만들기" 클릭
3. "테스트 모드에서 시작" 선택
4. 위치 선택 (asia-northeast3 - 서울 권장)
5. "사용 설정" 클릭

### 웹 앱 추가 및 설정 정보 복사
1. 프로젝트 개요 옆 톱니바퀴 → "프로젝트 설정"
2. 하단 "내 앱" 섹션에서 웹 아이콘(</>) 클릭
3. 앱 닉네임 입력 (예: tetris-web)
4. "앱 등록" 클릭
5. **Firebase SDK 구성** 정보 복사

### 설정 파일 수정
`src/js/firebase.js` 파일을 열고 다음 부분을 수정:

```javascript
const firebaseConfig = {
  apiKey: "여기에-복사한-API-키",
  authDomain: "여기에-복사한-AUTH-DOMAIN",
  projectId: "여기에-복사한-PROJECT-ID",
  storageBucket: "여기에-복사한-STORAGE-BUCKET",
  messagingSenderId: "여기에-복사한-SENDER-ID",
  appId: "여기에-복사한-APP-ID"
};
```

## 2단계: 로컬 서버 실행

### 방법 A: Python (가장 간단)
```bash
# Tetris 폴더에서 실행
python -m http.server 8000
```

### 방법 B: Node.js
```bash
# http-server 설치 (최초 1회)
npm install -g http-server

# Tetris 폴더에서 실행
http-server -p 8000
```

### 방법 C: VS Code Live Server
1. VS Code 확장에서 "Live Server" 검색 및 설치
2. `index.html` 파일 우클릭
3. "Open with Live Server" 선택

## 3단계: 게임 실행

브라우저에서 http://localhost:8000 접속

## ✅ 체크리스트

- [ ] Firebase 프로젝트 생성 완료
- [ ] Firestore Database 활성화 완료
- [ ] Firebase 설정 정보를 `src/js/firebase.js`에 입력 완료
- [ ] 로컬 서버 실행 완료
- [ ] 브라우저에서 게임 접속 완료

## 🎮 조작법

- **← / →**: 좌우 이동
- **↓**: 빠른 하강
- **↑**: 회전
- **Space**: 즉시 착지
- **P**: 일시정지

## 🎯 게임 팁

1. **고스트 피스 활용**: 반투명한 미리보기를 보고 정확한 위치에 블록을 놓으세요
2. **하드 드롭 사용**: Space 키로 즉시 블록을 떨어뜨려 속도를 높이세요
3. **벽 킥 이해**: 벽 근처에서도 회전이 가능합니다
4. **레벨 전략**: 레벨이 오를수록 점수가 더 많이 오르니 오래 버티세요!

## ⚠️ 문제 해결

### "Firebase is not defined" 오류
→ Firebase 설정 정보를 올바르게 입력했는지 확인

### 페이지가 로드되지 않음
→ 로컬 서버를 통해 실행하고 있는지 확인 (파일을 직접 열면 안됨)

### 점수가 저장되지 않음
→ Firestore Database가 활성화되어 있는지 확인
→ 브라우저 콘솔에서 오류 메시지 확인

### Phaser가 로드되지 않음
→ 인터넷 연결을 확인하세요 (CDN에서 로드됨)

### 키보드 입력이 작동하지 않음
→ 게임 화면을 클릭하여 포커스를 맞추세요

## 📊 점수 시스템

| 라인 수 | 기본 점수 | 실제 점수 |
|---------|-----------|-----------|
| 1줄     | 100점     | 100 × 레벨 |
| 2줄     | 300점     | 300 × 레벨 |
| 3줄     | 500점     | 500 × 레벨 |
| 4줄     | 800점     | 800 × 레벨 |

**예시**: 레벨 5에서 4줄을 완성하면 800 × 5 = 4,000점!

## 🎨 특징

### 시각적 효과
- 💫 부드러운 애니메이션
- 🌈 네온 컬러 디자인
- ✨ 파티클 효과
- 📱 반응형 디자인

### 게임 기능
- 👻 고스트 피스 (착지 위치 미리보기)
- 🔄 벽 킥 시스템
- 🎯 라인 클리어 애니메이션
- 📈 레벨 시스템

---

더 자세한 정보는 `README.md`를 참고하세요!

**문제가 계속되면**: 
1. 브라우저 콘솔 확인 (F12)
2. Firebase 콘솔에서 설정 재확인
3. 최신 브라우저 사용 권장 (Chrome, Firefox, Edge)
