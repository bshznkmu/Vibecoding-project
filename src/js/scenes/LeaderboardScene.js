import { getTopScores } from '../firebase.js';

export default class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LeaderboardScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // 배경색
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // 타이틀
    const titleText = this.add.text(width / 2, 50, '랭킹', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      color: '#00d9ff',
      stroke: '#0066cc',
      strokeThickness: 4
    });
    titleText.setOrigin(0.5);

    // 애니메이션
    this.tweens.add({
      targets: titleText,
      scale: { from: 0.8, to: 1 },
      duration: 300,
      ease: 'Back.easeOut'
    });

    // 로딩 메시지
    const loadingText = this.add.text(width / 2, height / 2, '랭킹 불러오는 중...', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });
    loadingText.setOrigin(0.5);

    // 로딩 애니메이션
    this.tweens.add({
      targets: loadingText,
      alpha: { from: 0.3, to: 1 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // 랭킹 불러오기
    this.loadLeaderboard(loadingText);

    // 뒤로 가기 버튼
    const backButton = this.add.text(width / 2, height - 80, '메인 메뉴', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#16213e',
      padding: { x: 30, y: 15 }
    });
    backButton.setOrigin(0.5);
    backButton.setInteractive({ useHandCursor: true });
    backButton.setAlpha(0);

    this.tweens.add({
      targets: backButton,
      alpha: 1,
      duration: 400,
      delay: 500,
      ease: 'Power2'
    });

    backButton.on('pointerover', () => {
      backButton.setStyle({ backgroundColor: '#0f3460' });
      this.tweens.add({
        targets: backButton,
        scale: 1.1,
        duration: 100
      });
    });

    backButton.on('pointerout', () => {
      backButton.setStyle({ backgroundColor: '#16213e' });
      this.tweens.add({
        targets: backButton,
        scale: 1,
        duration: 100
      });
    });

    backButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
  }

  async loadLeaderboard(loadingText) {
    try {
      const scores = await getTopScores(10);
      
      this.tweens.killTweensOf(loadingText);
      loadingText.destroy();
      
      if (scores.length === 0) {
        const emptyText = this.add.text(
          this.cameras.main.width / 2, 
          this.cameras.main.height / 2, 
          '아직 등록된 점수가 없습니다.\n\nFirebase 설정을 확인하세요.', 
          {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#aaaaaa',
            align: 'center'
          }
        );
        emptyText.setOrigin(0.5);
        
        this.tweens.add({
          targets: emptyText,
          alpha: { from: 0, to: 1 },
          duration: 400
        });
        
        return;
      }

      this.displayRankings(scores);
      
    } catch (error) {
      console.error('랭킹 로드 오류:', error);
      this.tweens.killTweensOf(loadingText);
      loadingText.setText('랭킹을 불러올 수 없습니다.\n\nFirebase 설정을 확인하세요.');
      loadingText.setColor('#ff0000');
      loadingText.setStyle({ align: 'center' });
    }
  }

  displayRankings(scores) {
    const width = this.cameras.main.width;
    const startY = 130;
    const lineHeight = 50;

    // 랭킹 배경 패널
    const panelHeight = scores.length * lineHeight + 100;
    const panel = this.add.rectangle(
      width / 2,
      startY + panelHeight / 2,
      600,
      panelHeight,
      0x16213e,
      0.5
    );
    panel.setStrokeStyle(2, 0x00d9ff, 0.3);
    panel.setAlpha(0);

    this.tweens.add({
      targets: panel,
      alpha: 1,
      duration: 400,
      delay: 200
    });

    // 헤더
    const headerY = startY + 20;
    
    const rankHeader = this.add.text(width / 2 - 220, headerY, '순위', {
      fontSize: '20px',
      fontFamily: 'Arial Bold',
      color: '#00d9ff'
    });
    rankHeader.setAlpha(0);

    const nameHeader = this.add.text(width / 2 - 80, headerY, '이름', {
      fontSize: '20px',
      fontFamily: 'Arial Bold',
      color: '#00d9ff'
    });
    nameHeader.setAlpha(0);

    const scoreHeader = this.add.text(width / 2 + 100, headerY, '점수', {
      fontSize: '20px',
      fontFamily: 'Arial Bold',
      color: '#00d9ff'
    });
    scoreHeader.setAlpha(0);

    // 헤더 페이드인
    this.tweens.add({
      targets: [rankHeader, nameHeader, scoreHeader],
      alpha: 1,
      duration: 400,
      delay: 400
    });

    // 구분선
    const line = this.add.graphics();
    line.lineStyle(2, 0x00d9ff, 0.5);
    line.beginPath();
    line.moveTo(width / 2 - 250, headerY + 35);
    line.lineTo(width / 2 + 250, headerY + 35);
    line.strokePath();
    line.setAlpha(0);

    this.tweens.add({
      targets: line,
      alpha: 1,
      duration: 400,
      delay: 600
    });

    // 랭킹 데이터
    const dataStartY = headerY + 50;
    
    scores.forEach((scoreData, index) => {
      const y = dataStartY + index * lineHeight;
      const rank = index + 1;
      
      // 순위 색상
      let rankColor = '#ffffff';
      let bgAlpha = 0;
      
      if (rank === 1) {
        rankColor = '#ffd700'; // 금색
        bgAlpha = 0.2;
      } else if (rank === 2) {
        rankColor = '#c0c0c0'; // 은색
        bgAlpha = 0.15;
      } else if (rank === 3) {
        rankColor = '#cd7f32'; // 동색
        bgAlpha = 0.1;
      }

      // 순위 배경
      if (bgAlpha > 0) {
        const rankBg = this.add.rectangle(
          width / 2,
          y,
          580,
          lineHeight - 5,
          Phaser.Display.Color.HexStringToColor(rankColor).color,
          bgAlpha
        );
        rankBg.setAlpha(0);
        
        this.tweens.add({
          targets: rankBg,
          alpha: 1,
          duration: 400,
          delay: 700 + index * 50
        });
      }

      // 순위
      const rankText = this.add.text(width / 2 - 220, y, `${rank}`, {
        fontSize: '22px',
        fontFamily: 'Arial Bold',
        color: rankColor
      });
      rankText.setOrigin(0, 0.5);
      rankText.setAlpha(0);

      // 트로피 이모지
      if (rank <= 3) {
        const trophies = ['🥇', '🥈', '🥉'];
        const trophy = this.add.text(width / 2 - 250, y, trophies[rank - 1], {
          fontSize: '24px'
        });
        trophy.setOrigin(0.5);
        trophy.setAlpha(0);
        
        this.tweens.add({
          targets: trophy,
          alpha: 1,
          scale: { from: 0, to: 1 },
          duration: 400,
          delay: 700 + index * 50,
          ease: 'Back.easeOut'
        });
      }

      // 이름
      const displayName = scoreData.playerName.length > 12 
        ? scoreData.playerName.substring(0, 12) + '...' 
        : scoreData.playerName;
      
      const nameText = this.add.text(width / 2 - 80, y, displayName, {
        fontSize: '20px',
        fontFamily: 'Arial',
        color: '#ffffff'
      });
      nameText.setOrigin(0, 0.5);
      nameText.setAlpha(0);

      // 점수
      const scoreText = this.add.text(width / 2 + 100, y, scoreData.score.toLocaleString(), {
        fontSize: '20px',
        fontFamily: 'Arial Mono',
        color: '#ffffff'
      });
      scoreText.setOrigin(0, 0.5);
      scoreText.setAlpha(0);

      // 순차 페이드인
      this.tweens.add({
        targets: [rankText, nameText, scoreText],
        alpha: 1,
        x: '+=10',
        duration: 400,
        delay: 700 + index * 50,
        ease: 'Power2'
      });
    });

    // 통계 표시
    if (scores.length > 0) {
      const totalPlayers = scores.length;
      const highScore = scores[0].score;
      
      const statsY = dataStartY + scores.length * lineHeight + 30;
      
      const statsText = this.add.text(width / 2, statsY, 
        `총 ${totalPlayers}명 참여  •  최고 점수: ${highScore.toLocaleString()}`, {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#888888'
      });
      statsText.setOrigin(0.5);
      statsText.setAlpha(0);
      
      this.tweens.add({
        targets: statsText,
        alpha: 1,
        duration: 400,
        delay: 1000 + scores.length * 50
      });
    }
  }
}
