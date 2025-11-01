너는 숙련된 웹 게임 개발자야.  
폴더 안에 설치된 phaser-box2d 프레임워크를 사용해서 **테트리스(Tetris)** 게임을 만들어줘.  
HTML, CSS, JavaScript로 동작하며, Firebase를 이용해 점수 랭킹을 저장하고 표시하는 기능을 포함해야 해.

---

### 🎮 프로젝트 개요
- 브라우저에서 실행되는 **Phaser 기반 테트리스 게임**을 만든다.  
- 물리 처리는 Teteris 폴더 내의 **phaser-box2d** 라이브러리를 사용한다.  
- 게임이 끝나면 점수를 Firebase에 저장하고, 상위 랭킹을 보여주는 화면을 구성한다.

---

### 🧩 주요 기능 요구사항

#### 1. phaser-box2d를 이용한 테트리스 게임 구현
- phaser-box2d 물리엔진으로 블록의 중력, 충돌, 정지 처리 구현
- 기본 테트리스 기능:
  - 7가지 테트로미노(I, O, T, S, Z, J, L) 생성
  - 회전, 좌우 이동, 하강, 하드 드롭 구현
  - 한 줄 이상 완성 시 삭제 + 점수 계산
  - 점수 시스템 (1줄 100점, 2줄 300점, 3줄 500점, 4줄 800점)
  - 레벨 상승에 따라 하강 속도 증가
  - 게임 오버 감지 및 종료 화면 표시
- HUD 표시 요소:
  - 현재 점수
  - 현재 레벨
  - 다음 블록 미리보기
  - “게임 시작 / 다시 시작” 버튼

#### 2. UI / UX
- 반응형 디자인 (PC / 모바일 브라우저 모두 지원)
- Phaser 내 Canvas 크기 동적으로 조정
- 조작 키:
  - ← / → : 좌우 이동
  - ↓ : 소프트 드롭
  - ↑ : 회전
  - Space : 하드 드롭
  - P : 일시정지
- 배경음악 및 사운드 효과 추가 가능
- UI는 Phaser의 Scene 구조로 구성:
  - `MainMenuScene`
  - `GameScene`
  - `GameOverScene`
  - `LeaderboardScene`

#### 3. Firebase 연동
- Firebase Authentication (익명 로그인 또는 이름 입력)
- Firestore(또는 Realtime Database)에 저장할 데이터 구조:
scores: {
playerName: string,
score: number,
timestamp: Date
}
- 게임 종료 시:
- 이름 입력 창 표시
- 점수를 Firebase에 저장
- `LeaderboardScene`에서:
- 상위 10개 점수를 내림차순으로 표시
- 플레이어의 현재 순위 표시

#### 4. 프로젝트 구조 예시
/src
/assets
/images
/sounds
/js
scenes/
MainMenuScene.js
GameScene.js
GameOverScene.js
LeaderboardScene.js
firebase.js
index.html
style.css
- Phaser-box2d 초기화 로직은 별도 모듈로 분리  
- 주요 게임 로직(`GameScene`)에서는 블록 스폰, 물리 충돌, 줄 완성 로직 관리  
- Firebase 통신 로직은 `firebase.js`에 분리  

#### 5. 배포 및 환경 설정
- Firebase 설정 정보(`firebaseConfig`)는 별도 상수로 관리  
- `index.html` 하나로 실행 가능한 구조  
- GitHub Pages로 배포
- `README.md`에 설정 및 실행 방법 명시  

---

### ✅ 결과물 요구사항
- phaser-box2d로 구현된 완전한 테트리스 게임  
- Firebase를 이용한 점수 저장 및 랭킹 기능  
- 모듈형, 유지보수 가능한 코드 구조  
- README.md 포함 (환경 설정 및 실행 방법 명시)