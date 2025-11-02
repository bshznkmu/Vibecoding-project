import { saveScore } from '../firebase.js';
import SoundManager from '../SoundManager.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.finalLevel = data.level || 1;
    this.finalLines = data.lines || 0;
    this.maxCombo = data.maxCombo || 0;
  }

  create() {
    const { width, height } = this.cameras.main;
    this.soundManager = new SoundManager(this);
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // --- 기본 상대 값 (기본 스타일) ---
    const paddingY = Math.max(16, height * 0.03); // 화면 상하 여백
    const sidePadding = Math.max(16, width * 0.04);

    // 기본 폰트 사이즈(px) — 필요시 비례로 축소
    let titleFont = Math.round(Math.max(48, width * 0.06));
    let infoFont = Math.round(Math.max(18, width * 0.024));
    let smallInfoFont = Math.round(Math.max(16, width * 0.02));
    let nameFont = Math.round(Math.max(18, width * 0.022));
    let buttonFont = Math.round(Math.max(16, width * 0.02));
    let statusFont = Math.round(Math.max(14, width * 0.018));

    // 요소별 추정 높이 (줄 높이, margin 포함)
    const estimateLineHeight = (font) => Math.round(font * 1.2);
    let titleH = estimateLineHeight(titleFont);
    let infoBlockH = estimateLineHeight(infoFont) + estimateLineHeight(smallInfoFont) * 3 + 8; // score + level/lines/combo
    let gapBetweenTitleInfo = Math.max(12, height * 0.02);
    let nameLabelH = estimateLineHeight(nameFont);
    let inputBoxH = Math.max(48, Math.round(nameFont * 2)); // 입력 박스 높이
    let gapNameToSave = Math.max(12, height * 0.02);
    let saveButtonH = estimateLineHeight(buttonFont) + 12;
    let gapButtons = Math.max(18, height * 0.03);
    let bottomButtonsH = Math.max(estimateLineHeight(buttonFont) + 12, saveButtonH); // 한 줄에 배치될 때 높이
    // 만약 세로로 스택하면 두 개라서 *2 + spacing
    let bottomButtonsStackedH = bottomButtonsH * 2 + 8;
    let statusTextH = estimateLineHeight(statusFont);

    // 총 필요 높이 계산 (최대치: 버튼이 세로 스택이 아닌 경우를 우선)
    let totalNeeded = paddingY + titleH + gapBetweenTitleInfo + infoBlockH + (paddingY / 2)
                      + nameLabelH + inputBoxH + gapNameToSave + saveButtonH + gapButtons + bottomButtonsH + paddingY + statusTextH;

    const availableH = height;

    // 축소 비율 계산: 필요 높이가 가용 높이보다 크면 폰트/요소 축소
    if (totalNeeded > availableH) {
      const scale = (availableH - (paddingY * 3)) / (totalNeeded - (paddingY * 3));
      // 제한: 너무 작아지면 가독성 문제 -> 최소 0.7
      const effectiveScale = Math.max(0.7, scale);

      titleFont = Math.max(28, Math.round(titleFont * effectiveScale));
      infoFont = Math.max(12, Math.round(infoFont * effectiveScale));
      smallInfoFont = Math.max(12, Math.round(smallInfoFont * effectiveScale));
      nameFont = Math.max(12, Math.round(nameFont * effectiveScale));
      buttonFont = Math.max(12, Math.round(buttonFont * effectiveScale));
      statusFont = Math.max(12, Math.round(statusFont * effectiveScale));

      // 재계산
      titleH = estimateLineHeight(titleFont);
      infoBlockH = estimateLineHeight(infoFont) + estimateLineHeight(smallInfoFont) * 3 + 6;
      nameLabelH = estimateLineHeight(nameFont);
      inputBoxH = Math.max(40, Math.round(nameFont * 1.8));
      saveButtonH = estimateLineHeight(buttonFont) + 10;
      bottomButtonsH = Math.max(estimateLineHeight(buttonFont) + 10, saveButtonH);
      bottomButtonsStackedH = bottomButtonsH * 2 + 6;

      totalNeeded = paddingY + titleH + gapBetweenTitleInfo + infoBlockH + (paddingY / 2)
                    + nameLabelH + inputBoxH + gapNameToSave + saveButtonH + gapButtons + bottomButtonsH + paddingY + statusTextH;
    }

    // X 중앙값
    const cx = width / 2;

    // 세로 배치 계산 (버튼이 옆에 들어갈 공간 확인)
    // 하단 버튼 가로 배치 여부 판단
    const buttonTotalWidth = (width * 0.25) * 2 + Math.max(24, width * 0.05); // 추정: 각 버튼 너비 약 25%씩 + 간격
    let buttonsStackVertical = false;
    if (buttonTotalWidth + sidePadding * 2 > width) {
      buttonsStackVertical = true;
    }

    // Y 좌표 계산: 중앙 정렬 대신 상단부터 여유 있게 배치
    let cursorY = paddingY;
    const titleY = cursorY + titleH / 2;
    cursorY += titleH + gapBetweenTitleInfo;

    const infoStartY = cursorY + estimateLineHeight(infoFont) / 2;
    cursorY += infoBlockH + (paddingY / 2);

    const nameLabelY = cursorY + nameLabelH / 2;
    cursorY += nameLabelH + 8;

    const inputBoxY = cursorY + inputBoxH / 2;
    cursorY += inputBoxH + gapNameToSave;

    const saveButtonY = cursorY + saveButtonH / 2;
    cursorY += saveButtonH + gapButtons;

    // 하단 버튼 Y: 화면 하단 근처로 정렬 (또는 스택일 경우 현재 cursorY 사용)
    let bottomButtonsY;
    if (buttonsStackVertical) {
      // 스택: 두 버튼을 cursorY 부터 세로로 쌓음
      bottomButtonsY = cursorY + bottomButtonsH / 2;
    } else {
      // 가로 배치: 하단 고정 위치
      bottomButtonsY = Math.max(cursorY, height - paddingY - bottomButtonsH - statusTextH - 6);
    }

    const statusY = height - paddingY - statusTextH / 2;

    // ---------------- UI 생성 ----------------
    // 타이틀
    const gameOverText = this.add.text(cx, titleY, '게임 오버', {
      fontSize: `${titleFont}px`,
      fontFamily: 'Arial Black',
      color: '#ff0066',
      stroke: '#990033',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.tweens.add({
      targets: gameOverText,
      scale: { from: 0, to: 1 },
      duration: 500,
      ease: 'Back.easeOut'
    });

    // 정보 텍스트 (간격은 estimateLineHeight 기준으로 설정)
    const scoreText = this.add.text(cx, infoStartY, `최종 점수: ${this.finalScore.toLocaleString()}`, {
      fontSize: `${infoFont}px`,
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5).setAlpha(0);

    const infoLineGap = estimateLineHeight(smallInfoFont) * 0.95;
    const levelText = this.add.text(cx, infoStartY + infoLineGap, `레벨: ${this.finalLevel}`, {
      fontSize: `${smallInfoFont}px`,
      fontFamily: 'Arial',
      color: '#aaaaaa'
    }).setOrigin(0.5).setAlpha(0);

    const linesText = this.add.text(cx, infoStartY + infoLineGap * 2, `클리어 라인: ${this.finalLines}`, {
      fontSize: `${smallInfoFont}px`,
      fontFamily: 'Arial',
      color: '#aaaaaa'
    }).setOrigin(0.5).setAlpha(0);

    const comboText = this.add.text(cx, infoStartY + infoLineGap * 3, `최대 콤보: ${this.maxCombo}x`, {
      fontSize: `${smallInfoFont}px`,
      fontFamily: 'Arial',
      color: this.maxCombo >= 10 ? '#ff00ff' : (this.maxCombo >= 5 ? '#ff6600' : '#aaaaaa')
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: [scoreText, levelText, linesText, comboText],
      alpha: 1,
      duration: 400,
      delay: 500,
      ease: 'Power2'
    });

    // 이름 입력 레이블
    const nameLabel = this.add.text(cx, nameLabelY, '이름을 입력하세요:', {
      fontSize: `${nameFont}px`,
      fontFamily: 'Arial',
      color: '#00d9ff'
    }).setOrigin(0.5).setAlpha(0);

    // 입력 박스(너비는 화면 크기의 비율로, 최소/최대)
    const inputBoxWidth = Math.min(720, Math.max(280, width * 0.6));
    const inputBox = this.add.rectangle(cx, inputBoxY, inputBoxWidth, inputBoxH);
    inputBox.setStrokeStyle(2, 0x00d9ff);
    inputBox.setFillStyle(0x16213e);
    inputBox.setAlpha(0);

    this.playerName = '';
    this.nameText = this.add.text(cx, inputBoxY, '', {
      fontSize: `${nameFont}px`,
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5, 0.5).setAlpha(0);

    // 커서 (높이와 폰트에 맞춰)
    this.cursor = this.add.text(cx + inputBoxWidth / 2 - 8, inputBoxY, '|', {
      fontSize: `${nameFont}px`,
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0, 0.5).setAlpha(0);

    this.tweens.add({
      targets: this.cursor,
      alpha: { from: 0, to: 1 },
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    this.tweens.add({
      targets: [nameLabel, inputBox, this.nameText, this.cursor],
      alpha: 1,
      duration: 400,
      delay: 1000,
      ease: 'Power2'
    });

    // 키보드
    this.input.keyboard.on('keydown', this.handleKeyInput, this);

    // 저장 버튼 (입력 박스 아래)
    const saveButton = this.add.text(cx, saveButtonY, '점수 저장', {
      fontSize: `${buttonFont}px`,
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#16213e',
      padding: { x: 26, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setAlpha(0);

    this.tweens.add({
      targets: saveButton,
      alpha: 1,
      duration: 400,
      delay: 1200,
      ease: 'Power2'
    });

    saveButton.on('pointerover', () => {
      saveButton.setStyle({ backgroundColor: '#0f3460' });
      this.tweens.add({ targets: saveButton, scale: 1.04, duration: 100 });
    });
    saveButton.on('pointerout', () => {
      saveButton.setStyle({ backgroundColor: '#16213e' });
      this.tweens.add({ targets: saveButton, scale: 1, duration: 100 });
    });
    saveButton.on('pointerdown', () => {
      if (this.playerName.length > 0) {
        this.soundManager.playMenuSelect();
        this.submitScore();
      }
    });

    // 하단 버튼들: 가로 배치가 가능한지에 따라 위치 결정
    const restartButton = this.add.text(0, 0, '다시 시작', {
      fontSize: `${buttonFont}px`,
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#16213e',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setAlpha(0);

    restartButton.on('pointerover', () => restartButton.setStyle({ backgroundColor: '#0f3460' }));
    restartButton.on('pointerout', () => restartButton.setStyle({ backgroundColor: '#16213e' }));
    restartButton.on('pointerdown', () => {
      this.soundManager.playMenuSelect();
      this.scene.start('GameScene');
    });

    const menuButton = this.add.text(0, 0, '메인 메뉴', {
      fontSize: `${buttonFont}px`,
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#16213e',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setAlpha(0);

    menuButton.on('pointerover', () => menuButton.setStyle({ backgroundColor: '#0f3460' }));
    menuButton.on('pointerout', () => menuButton.setStyle({ backgroundColor: '#16213e' }));
    menuButton.on('pointerdown', () => {
      this.soundManager.playMenuSelect();
      this.scene.start('MainMenuScene');
    });

    // 버튼 배치: 가로 또는 세로 스택
    if (buttonsStackVertical) {
      // 세로 스택: saveButton 위 아래로 정렬될 수 있게 cursorY 사용
      const btnX = cx;
      const firstY = bottomButtonsY;
      restartButton.setPosition(btnX, firstY);
      menuButton.setPosition(btnX, firstY + bottomButtonsH + 8);
    } else {
      // 가로 배치: 좌우로 분리 (화면 너비에 맞게)
      const hSpacing = Math.min(width * 0.18, Math.max(80, width * 0.12));
      restartButton.setPosition(cx - hSpacing, bottomButtonsY);
      menuButton.setPosition(cx + hSpacing, bottomButtonsY);
    }

    // 페이드인
    this.tweens.add({
      targets: [restartButton, menuButton],
      alpha: 1,
      duration: 400,
      delay: 1400,
      ease: 'Power2'
    });

    // 상태 텍스트 (항상 하단에 고정)
    this.statusText = this.add.text(cx, statusY, '', {
      fontSize: `${statusFont}px`,
      fontFamily: 'Arial',
      color: '#ffff00'
    }).setOrigin(0.5);

    // 커서 초기 위치 보정
    this.inputBoxWidth = inputBoxWidth;
    this.nameText.setOrigin(0.5, 0.5);
    this.updateNameDisplay(); // cursor 위치 조정
  }

  handleKeyInput(event) {
    if (event.key === 'Enter' && this.playerName.length > 0) {
      this.submitScore();
    } else if (event.key === 'Backspace') {
      this.playerName = this.playerName.slice(0, -1);
      this.updateNameDisplay();
    } else if (event.key.length === 1 && this.playerName.length < 15) {
      // 영문자, 숫자, 한글만 허용
      if (/^[a-zA-Z0-9가-힣]$/.test(event.key)) {
        this.playerName += event.key;
        this.updateNameDisplay();
      }
    }
  }

  updateNameDisplay() {
    // nameText는 origin 0.5로 가운데 정렬 되어 있음
    this.nameText.setText(this.playerName);

    const camWidth = this.cameras.main.width;
    const cx = camWidth / 2;
    const inputHalf = this.inputBoxWidth / 2;

    // 텍스트 너비의 절반을 더해 커서 위치 계산 (박스 내부에 제한)
    const textWidth = this.nameText.width;
    let cursorOffset = textWidth / 2 + 6;
    const maxOffset = inputHalf - 8;
    if (cursorOffset > maxOffset) cursorOffset = maxOffset;

    const cursorX = cx + cursorOffset;
    // 안전하게 커서 위치 설정
    this.cursor.setX(cursorX);
  }

  async submitScore() {
    this.statusText.setText('점수 저장 중...');
    this.statusText.setColor('#ffff00');

    // 키보드 입력 비활성화
    this.input.keyboard.off('keydown', this.handleKeyInput, this);

    try {
      const success = await saveScore(this.playerName, this.finalScore);

      if (success) {
        this.statusText.setText('점수가 저장되었습니다!');
        this.statusText.setColor('#00ff00');
        this.cameras.main.flash(300, 0, 255, 100);
        this.time.delayedCall(2000, () => {
          this.scene.start('LeaderboardScene');
        });
      } else {
        this.statusText.setText('점수 저장에 실패했습니다. Firebase 설정을 확인하세요.');
        this.statusText.setColor('#ff0000');
        this.time.delayedCall(2000, () => {
          this.statusText.setText('');
          this.input.keyboard.on('keydown', this.handleKeyInput, this);
        });
      }
    } catch (error) {
      console.error('점수 제출 오류:', error);
      this.statusText.setText('오류가 발생했습니다. Firebase 설정을 확인하세요.');
      this.statusText.setColor('#ff0000');
      this.time.delayedCall(2000, () => {
        this.statusText.setText('');
        this.input.keyboard.on('keydown', this.handleKeyInput, this);
      });
    }
  }

  shutdown() {
    // Scene이 종료될 때 이벤트 리스너 제거
    this.input.keyboard.off('keydown', this.handleKeyInput, this);
  }
}
