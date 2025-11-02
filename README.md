# 🎮 프로젝트 제목: 테트리스 웹 게임 Vibe Tetris

웹에서 플레이할 수 있는 테트리스 게임이며, 점수별 랭킹을 통해 경쟁할 수 있습니다.

https://vibetetris.web.app/

---

# 🧩 구현한 기능

* 일반적인 테트리스 기능
* 홀드 및 콤보 시스템, 레벨 시스템
* 각 동작마다 효과음이 있으며, 음소거 가능
* **Firebase Firestore**를 통한 상위 10위 실시간 랭킹 표시
* **Firebase Hosting**으로 온라인 웹에서 플레이 가능
---

# 🚀 실행 방법

아래 링크에서 바로 플레이할 수 있습니다:

👉 **[https://vibetetris.web.app/](https://vibetetris.web.app/)**

또는, 로컬에서 테스트하려면 다음 단계를 따르세요.

```bash
git clone <repository-url>
cd Tetris
python -m http.server 8000
# 또는
npx http-server -p 8000
```

그 후 브라우저에서 `http://localhost:8000` 로 접속하면 됩니다.

---

# 🧠 사용한 기술 스택

* HTML, CSS, JS
* Firebase Storing, Hosting
* Phaser 3 (게임 개발 프레임워크)

---