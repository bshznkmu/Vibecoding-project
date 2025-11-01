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
    
    // 사운드 매니저 초기화
    this.soundManager = new SoundManager(this);

    // 배경색
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // 게임 오버 텍스트
    const gameOverText = this.add.text(width / 2, height / 4, '게임 오버', {
      fontSize: '64px',
      fontFamily: 'Arial Black',
      color: '#ff0066',
      stroke: '#990033',
      strokeThickness: 6
    });
    gameOverText.setOrigin(0.5);

    // 애니메이션 효과
    this.tweens.add({
      targets: gameOverText,
      scale: { from: 0, to: 1 },
      duration: 500,
      ease: 'Back.easeOut'
    });

    // 점수 표시
    const scoreText = this.add.text(width / 2, height / 4 + 100, `최종 점수: ${this.finalScore.toLocaleString()}`, {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });
    scoreText.setOrigin(0.5);
    scoreText.setAlpha(0);

    const levelText = this.add.text(width / 2, height / 4 + 140, `레벨: ${this.finalLevel}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#aaaaaa'
    });
    levelText.setOrigin(0.5);
    levelText.setAlpha(0);

    const linesText = this.add.text(width / 2, height / 4 + 170, `클리어 라인: ${this.finalLines}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#aaaaaa'
    });
    linesText.setOrigin(0.5);
    linesText.setAlpha(0);

    const comboText = this.add.text(width / 2, height / 4 + 200, `최대 콤보: ${this.maxCombo}x`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: this.maxCombo >= 10 ? '#ff00ff' : (this.maxCombo >= 5 ? '#ff6600' : '#aaaaaa')
    });
    comboText.setOrigin(0.5);
    comboText.setAlpha(0);

    // 순차적 페이드인
    this.tweens.add({
      targets: [scoreText, levelText, linesText, comboText],
      alpha: 1,
      duration: 400,
      delay: 500,
      ease: 'Power2'
    });

    // 이름 입력 안내
    const nameLabel = this.add.text(width / 2, height / 2 - 20, '이름을 입력하세요:', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#00d9ff'
    });
    nameLabel.setOrigin(0.5);
    nameLabel.setAlpha(0);

    // 이름 입력 박스
    const inputBox = this.add.rectangle(width / 2, height / 2 + 30, 300, 50);
    inputBox.setStrokeStyle(2, 0x00d9ff);
    inputBox.setFillStyle(0x16213e);
    inputBox.setAlpha(0);

    this.playerName = '';
    this.nameText = this.add.text(width / 2, height / 2 + 30, '', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });
    this.nameText.setOrigin(0.5);
    this.nameText.setAlpha(0);

    // 커서 깜빡임
    this.cursor = this.add.text(width / 2, height / 2 + 30, '|', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });
    this.cursor.setOrigin(0, 0.5);
    this.cursor.setAlpha(0);
    
    this.tweens.add({
      targets: this.cursor,
      alpha: { from: 0, to: 1 },
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    // 입력 요소 페이드인
    this.tweens.add({
      targets: [nameLabel, inputBox, this.nameText, this.cursor],
      alpha: 1,
      duration: 400,
      delay: 1000,
      ease: 'Power2'
    });

    // 키보드 입력 처리
    this.input.keyboard.on('keydown', this.handleKeyInput, this);

    // 저장 버튼
    const saveButton = this.add.text(width / 2, height / 2 + 100, '점수 저장', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#16213e',
      padding: { x: 30, y: 15 }
    });
    saveButton.setOrigin(0.5);
    saveButton.setInteractive({ useHandCursor: true });
    saveButton.setAlpha(0);

    this.tweens.add({
      targets: saveButton,
      alpha: 1,
      duration: 400,
      delay: 1200,
      ease: 'Power2'
    });

    saveButton.on('pointerover', () => {
      saveButton.setStyle({ backgroundColor: '#0f3460' });
      this.tweens.add({
        targets: saveButton,
        scale: 1.1,
        duration: 100
      });
    });

    saveButton.on('pointerout', () => {
      saveButton.setStyle({ backgroundColor: '#16213e' });
      this.tweens.add({
        targets: saveButton,
        scale: 1,
        duration: 100
      });
    });

    saveButton.on('pointerdown', () => {
      if (this.playerName.length > 0) {
        this.soundManager.playMenuSelect();
        this.submitScore();
      }
    });

    // 버튼 컨테이너
    const buttonY = height / 2 + 180;
    
    // 다시 시작 버튼
    const restartButton = this.add.text(width / 2 - 100, buttonY, '다시 시작', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#16213e',
      padding: { x: 20, y: 10 }
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive({ useHandCursor: true });
    restartButton.setAlpha(0);

    restartButton.on('pointerover', () => {
      restartButton.setStyle({ backgroundColor: '#0f3460' });
    });

    restartButton.on('pointerout', () => {
      restartButton.setStyle({ backgroundColor: '#16213e' });
    });

    restartButton.on('pointerdown', () => {
      this.soundManager.playMenuSelect();
      this.scene.start('GameScene');
    });

    // 메인 메뉴 버튼
    const menuButton = this.add.text(width / 2 + 100, buttonY, '메인 메뉴', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#16213e',
      padding: { x: 20, y: 10 }
    });
    menuButton.setOrigin(0.5);
    menuButton.setInteractive({ useHandCursor: true });
    menuButton.setAlpha(0);

    menuButton.on('pointerover', () => {
      menuButton.setStyle({ backgroundColor: '#0f3460' });
    });

    menuButton.on('pointerout', () => {
      menuButton.setStyle({ backgroundColor: '#16213e' });
    });

    menuButton.on('pointerdown', () => {
      this.soundManager.playMenuSelect();
      this.scene.start('MainMenuScene');
    });

    // 버튼 페이드인
    this.tweens.add({
      targets: [restartButton, menuButton],
      alpha: 1,
      duration: 400,
      delay: 1400,
      ease: 'Power2'
    });

    // 상태 메시지
    this.statusText = this.add.text(width / 2, height - 50, '', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffff00'
    });
    this.statusText.setOrigin(0.5);
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
    this.nameText.setText(this.playerName);
    const textWidth = this.nameText.width;
    this.cursor.setX(this.cameras.main.width / 2 + textWidth / 2 + 5);
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
        
        // 성공 애니메이션
        this.cameras.main.flash(300, 0, 255, 100);
        
        // 2초 후 랭킹 화면으로 이동
        this.time.delayedCall(2000, () => {
          this.scene.start('LeaderboardScene');
        });
      } else {
        this.statusText.setText('점수 저장에 실패했습니다. Firebase 설정을 확인하세요.');
        this.statusText.setColor('#ff0000');
        
        // 다시 입력 가능하도록
        this.time.delayedCall(2000, () => {
          this.statusText.setText('');
          this.input.keyboard.on('keydown', this.handleKeyInput, this);
        });
      }
    } catch (error) {
      console.error('점수 제출 오류:', error);
      this.statusText.setText('오류가 발생했습니다. Firebase 설정을 확인하세요.');
      this.statusText.setColor('#ff0000');
      
      // 다시 입력 가능하도록
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
