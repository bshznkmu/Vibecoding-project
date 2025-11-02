# Firebase Hosting 배포 가이드

이 프로젝트를 Firebase Hosting에 배포하는 방법입니다.

## 사전 준비

1. **Firebase CLI 설치 확인**
   ```bash
   firebase --version
   ```
   이미 설치되어 있습니다 (v14.23.0)

## 배포 단계

### 1단계: Firebase 로그인

브라우저에서 Firebase에 로그인합니다:

```bash
firebase login
```

이 명령어를 실행하면 브라우저가 열리고 Google 계정으로 로그인하라는 창이 나타납니다.
Firebase 프로젝트(`vibetetris`)에 접근 권한이 있는 계정으로 로그인하세요.

### 2단계: 프로젝트 확인

현재 연결된 Firebase 프로젝트를 확인합니다:

```bash
firebase projects:list
```

### 3단계: 배포 실행

모든 파일을 Firebase Hosting에 배포합니다:

```bash
firebase deploy --only hosting
```

### 4단계: 배포 확인

배포가 완료되면 다음과 같은 URL이 표시됩니다:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/vibetetris/overview
Hosting URL: https://vibetetris.web.app
```

## 배포 후 업데이트

코드를 수정한 후 다시 배포하려면:

```bash
firebase deploy --only hosting
```

## 추가 명령어

### 미리보기 (배포 전 테스트)
```bash
firebase hosting:channel:deploy preview
```

### 배포 이력 확인
```bash
firebase hosting:clone --site vibetetris
```

### 이전 버전으로 롤백
```bash
firebase hosting:rollback
```

## 주의사항

- 배포된 사이트는 공개적으로 접근 가능합니다
- Firebase 프로젝트의 Hosting 쿼터에 따라 사용량이 측정됩니다
- Firestore 보안 규칙을 확인하여 점수 저장 기능이 정상 작동하는지 확인하세요

## 문제 해결

### 로그인 오류
```bash
firebase logout
firebase login
```

### 프로젝트 연결 오류
```bash
firebase use --add
```
프로젝트 선택 시 `vibetetris`를 선택하세요.

