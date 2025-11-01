import SoundManager from '../SoundManager.js';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // 사운드 매니저 초기화
    this.soundManager = new SoundManager(this);

    // 배경색 설정
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // 타이틀
    const titleText = this.add.text(width / 2, height / 4, 'TETRIS', {
      fontSize: '72px',
      fontFamily: 'Arial Black',
      color: '#00d9ff',
      stroke: '#0066cc',
      strokeThickness: 6
    });
    titleText.setOrigin(0.5);

    // 부제목
    const subtitleText = this.add.text(width / 2, height / 4 + 80, 'Phaser Edition', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });
    subtitleText.setOrigin(0.5);

    // 시작 버튼
    const startButton = this.add.text(width / 2, height / 2, '게임 시작', {
      fontSize: '36px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#16213e',
      padding: { x: 40, y: 20 }
    });
    startButton.setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });

    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#0f3460' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#16213e' });
    });

    startButton.on('pointerdown', () => {
      this.soundManager.playMenuSelect();
      this.scene.start('GameScene');
    });

    // 랭킹 버튼
    const leaderboardButton = this.add.text(width / 2, height / 2 + 80, '랭킹 보기', {
      fontSize: '36px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#16213e',
      padding: { x: 40, y: 20 }
    });
    leaderboardButton.setOrigin(0.5);
    leaderboardButton.setInteractive({ useHandCursor: true });

    leaderboardButton.on('pointerover', () => {
      leaderboardButton.setStyle({ backgroundColor: '#0f3460' });
    });

    leaderboardButton.on('pointerout', () => {
      leaderboardButton.setStyle({ backgroundColor: '#16213e' });
    });

    leaderboardButton.on('pointerdown', () => {
      this.soundManager.playMenuSelect();
      this.scene.start('LeaderboardScene');
    });

    // 조작법 안내
    const controls = [
      '조작법:',
      '← / → : 좌우 이동',
      '↓ : 소프트 드롭',
      '↑ : 회전',
      'Space : 하드 드롭',
      'C : 홀드',
      'P : 일시정지'
    ];

    let yPos = height / 2 + 180;
    controls.forEach(text => {
      const controlText = this.add.text(width / 2, yPos, text, {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: '#aaaaaa'
      });
      controlText.setOrigin(0.5);
      yPos += 25;
    });

    // 애니메이션 효과
    this.tweens.add({
      targets: titleText,
      y: titleText.y + 10,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
}
