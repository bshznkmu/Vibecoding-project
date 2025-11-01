# 🎮 Tetris - Phaser 3 Edition

Phaser 3 프레임워크를 사용하여 제작된 브라우저 기반 테트리스 게임입니다. Firebase를 통한 실시간 랭킹 시스템을 포함하고 있습니다.

## ✨ 주요 기능

### 게임 기능
- ✅ 7가지 테트로미노 (I, O, T, S, Z, J, L)
- ✅ 블록 회전, 좌우 이동, 하강, 하드 드롭
- ✅ 고스트 피스 (착지 위치 미리보기)
- ✅ 벽 킥 시스템 (회전 시 자동 위치 조정)
- ✅ 줄 완성 시 자동 삭제 및 점수 계산
- ✅ 라인 클리어 애니메이션
- ✅ 레벨 시스템 (10줄마다 레벨 업, 하강 속도 증가)
- ✅ 다음 블록 미리보기
- ✅ 일시정지 기능
- ✅ 게임 오버 감지
- ✅ 부드러운 애니메이션 효과

### 점수 시스템
- 1줄 완성: 100점 × 레벨
- 2줄 완성: 300점 × 레벨
- 3줄 완성: 500점 × 레벨
- 4줄 완성: 800점 × 레벨

### UI/UX
- 반응형 디자인 (PC/모바일 지원)
- 직관적인 Scene 구조
  - MainMenuScene: 메인 메뉴
  - GameScene: 게임 플레이
  - GameOverScene: 게임 종료 및 점수 저장
  - LeaderboardScene: 랭킹 보기
- 현대적이고 세련된 UI/UX
- 부드러운 트윈 애니메이션
- 시각적 피드백 (화면 플래시, 셰이크 등)

### Firebase 연동
- Firestore를 통한 점수 저장
- 상위 10개 랭킹 표시
- 실시간 순위 업데이트
- 플레이어 이름 입력 기능

## 🎯 조작법

| 키 | 기능 |
|---|---|
| ← / → | 좌우 이동 |
| ↓ | 소프트 드롭 (빠른 하강) |
| ↑ | 회전 |
| Space | 하드 드롭 (즉시 착지) |
| P | 일시정지 |

## 🚀 설치 및 실행 방법

### 1. 프로젝트 클론 또는 다운로드

```bash
git clone <repository-url>
cd Tetris
```

### 2. 의존성 확인

이 프로젝트는 Phaser 3를 CDN을 통해 로드하므로 별도의 npm 패키지 설치가 필요하지 않습니다.

### 3. Firebase 설정

#### 3.1 Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 새 프로젝트 생성
3. Firestore Database 활성화
   - 테스트 모드로 시작 (나중에 보안 규칙 설정 가능)

#### 3.2 Firebase 설정 정보 가져오기
1. 프로젝트 설정 → 일반 → 앱 추가 → 웹 앱
2. Firebase SDK 구성 정보 복사

#### 3.3 설정 파일 수정
`src/js/firebase.js` 파일을 열고 Firebase 설정 정보를 입력:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. 로컬 서버 실행

CORS 정책으로 인해 로컬 파일로 직접 열 수 없으므로, 로컬 서버를 실행해야 합니다.

#### 방법 1: Python 사용
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### 방법 2: Node.js http-server 사용
```bash
# http-server 설치 (전역)
npm install -g http-server

# 서버 실행
http-server -p 8000
```

#### 방법 3: VS Code Live Server 확장 사용
1. VS Code에서 Live Server 확장 설치
2. `index.html` 파일에서 우클릭 → "Open with Live Server"

### 5. 브라우저에서 실행

브라우저에서 `http://localhost:8000` 접속

## 📁 프로젝트 구조

```
Tetris/
├── index.html                 # 메인 HTML 파일
├── package.json              # phaser-box2d 의존성 (참고용)
├── README.md                 # 프로젝트 문서
├── QUICK_START.md            # 빠른 시작 가이드
├── .gitignore               # Git 제외 파일
└── src/
    ├── style.css             # 스타일시트
    ├── assets/               # 게임 에셋 (이미지, 사운드)
    │   ├── images/
    │   └── sounds/
    └── js/
        ├── firebase.js       # Firebase 설정 및 함수
        └── scenes/           # Phaser Scene 파일들
            ├── MainMenuScene.js      # 메인 메뉴
            ├── GameScene.js          # 게임 플레이
            ├── GameOverScene.js      # 게임 오버
            └── LeaderboardScene.js   # 랭킹 보드
```

## 🎨 주요 개선 사항

### 게임플레이
1. **고스트 피스**: 블록이 착지할 위치를 반투명하게 미리 표시
2. **벽 킥 시스템**: 벽 근처에서 회전 시 자동으로 최적 위치 찾기
3. **라인 클리어 애니메이션**: 줄이 완성되면 깜빡이는 효과
4. **레벨 업 효과**: 레벨이 오르면 화면 플래시 효과

### UI/UX
1. **부드러운 애니메이션**: 모든 UI 요소에 트윈 애니메이션 적용
2. **시각적 피드백**: 버튼 호버, 게임 오버 시 화면 셰이크
3. **반응형 디자인**: 다양한 화면 크기에 대응
4. **현대적인 디자인**: 네온 컬러와 그라디언트 사용

### 성능
1. **효율적인 렌더링**: Graphics 객체를 사용한 최적화
2. **키 입력 최적화**: 딜레이를 적용하여 부드러운 조작감
3. **메모리 관리**: Scene 종료 시 이벤트 리스너 정리

## 🔧 Firestore 보안 규칙 (선택사항)

프로덕션 환경에서는 다음과 같은 보안 규칙을 설정하는 것을 권장합니다:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{score} {
      // 누구나 읽을 수 있음
      allow read: if true;
      
      // 점수 생성만 허용 (수정/삭제 불가)
      allow create: if request.resource.data.keys().hasAll(['playerName', 'score', 'timestamp'])
                    && request.resource.data.playerName is string
                    && request.resource.data.playerName.size() > 0
                    && request.resource.data.playerName.size() <= 15
                    && request.resource.data.score is number
                    && request.resource.data.score >= 0
                    && request.resource.data.timestamp is timestamp;
      
      // 수정 및 삭제 불가
      allow update, delete: if false;
    }
  }
}
```

## 🌐 배포 (GitHub Pages)

### 1. GitHub 저장소에 푸시

```bash
git add .
git commit -m "Initial commit: Tetris game"
git push origin main
```

### 2. GitHub Pages 설정

1. GitHub 저장소 → Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / root 선택
4. Save

### 3. 배포 URL 확인

몇 분 후 `https://<username>.github.io/<repository-name>/` 에서 게임 실행 가능

## 🎨 커스터마이징

### 색상 변경
`src/js/scenes/GameScene.js`의 `tetrominoes` 객체에서 각 블록의 색상을 변경할 수 있습니다:

```javascript
this.tetrominoes = {
  'I': { shape: [[1,1,1,1]], color: 0x00f0f0 },  // 시안색
  'O': { shape: [[1,1],[1,1]], color: 0xf0f000 }, // 노란색
  // ... 다른 블록들
};
```

### 게임 난이도 조정
`src/js/scenes/GameScene.js`의 `init()` 메서드에서:

```javascript
this.dropInterval = 1000; // 초기 하강 속도 (밀리초)
```

레벨업 속도 조정은 `checkLines()` 메서드에서:

```javascript
const newLevel = Math.floor(this.linesCleared / 10) + 1; // 10줄마다 레벨업
```

### 키 입력 딜레이 조정
```javascript
this.moveDelay = 150; // 밀리초 단위
```

## 🐛 문제 해결

### Firebase 연결 오류
- Firebase 설정 정보가 올바른지 확인
- Firestore Database가 활성화되어 있는지 확인
- 브라우저 콘솔에서 오류 메시지 확인

### 게임이 로드되지 않음
- 로컬 서버를 통해 실행하고 있는지 확인
- 브라우저 콘솔에서 JavaScript 오류 확인
- Phaser 3 CDN이 로드되는지 확인 (네트워크 연결 확인)

### 모듈 로드 오류
- 브라우저가 ES6 모듈을 지원하는지 확인 (최신 브라우저 사용 권장)
- CORS 정책으로 인해 로컬 파일로 직접 열 수 없으므로 반드시 로컬 서버 사용

### 키 입력이 반응하지 않음
- 게임 영역을 클릭하여 포커스를 맞추세요
- 브라우저의 키보드 접근성 설정을 확인하세요

## 🎯 향후 개선 계획

- [ ] 배경음악 및 효과음 추가
- [ ] 모바일 터치 컨트롤 추가
- [ ] 난이도 선택 기능
- [ ] 최고 점수 로컬 저장 (LocalStorage)
- [ ] 테마 변경 기능
- [ ] 멀티플레이어 모드
- [ ] 특수 블록 및 파워업

## 📝 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 🙏 크레딧

- **Phaser 3**: HTML5 게임 프레임워크 (https://phaser.io)
- **Firebase**: 백엔드 서비스 (https://firebase.google.com)
- **Box2D**: 물리 엔진 참고 라이브러리

## 📧 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 등록해주세요.

---

## 🚀 기술 스택

- **프레임워크**: Phaser 3.70.0
- **언어**: JavaScript (ES6+)
- **백엔드**: Firebase Firestore
- **스타일**: CSS3
- **모듈 시스템**: ES6 Modules

---

즐거운 게임 되세요! 🎮✨
