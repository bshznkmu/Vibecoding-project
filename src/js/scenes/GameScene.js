export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init() {
    // 게임 상태 초기화
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.gameOver = false;
    this.isPaused = false;
    
    // 게임 보드 설정
    this.COLS = 10;
    this.ROWS = 20;
    this.BLOCK_SIZE = 30;
    this.BOARD_X = 100;
    this.BOARD_Y = 50;
    
    // 테트로미노 정의
    this.tetrominoes = {
      'I': { 
        shape: [[1,1,1,1]], 
        color: 0x00f0f0,
        name: 'I'
      },
      'O': { 
        shape: [[1,1],[1,1]], 
        color: 0xf0f000,
        name: 'O'
      },
      'T': { 
        shape: [[0,1,0],[1,1,1]], 
        color: 0xa000f0,
        name: 'T'
      },
      'S': { 
        shape: [[0,1,1],[1,1,0]], 
        color: 0x00f000,
        name: 'S'
      },
      'Z': { 
        shape: [[1,1,0],[0,1,1]], 
        color: 0xf00000,
        name: 'Z'
      },
      'J': { 
        shape: [[1,0,0],[1,1,1]], 
        color: 0x0000f0,
        name: 'J'
      },
      'L': { 
        shape: [[0,0,1],[1,1,1]], 
        color: 0xf0a000,
        name: 'L'
      }
    };
    
    this.tetrominoTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    
    // 게임 보드 (0: 빈칸, 1: 블록)
    this.board = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(0));
    this.boardColors = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(0));
    
    // 현재 블록
    this.currentPiece = null;
    this.currentX = 0;
    this.currentY = 0;
    this.currentRotation = 0;
    
    // 다음 블록
    this.nextPiece = null;
    
    // 타이머
    this.dropTimer = 0;
    this.dropInterval = 1000; // 1초
    
    // 키 입력 딜레이
    this.moveDelay = 150;
    this.lastMoveTime = 0;
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // 배경색
    this.cameras.main.setBackgroundColor('#0f0f1e');
    
    // 게임 보드 배경
    const boardBg = this.add.rectangle(
      this.BOARD_X,
      this.BOARD_Y,
      this.COLS * this.BLOCK_SIZE,
      this.ROWS * this.BLOCK_SIZE,
      0x1a1a2e
    );
    boardBg.setOrigin(0);
    
    // 게임 보드 테두리
    const boardBorder = this.add.rectangle(
      this.BOARD_X,
      this.BOARD_Y,
      this.COLS * this.BLOCK_SIZE,
      this.ROWS * this.BLOCK_SIZE
    );
    boardBorder.setOrigin(0);
    boardBorder.setStrokeStyle(3, 0x00d9ff);
    boardBorder.setFillStyle(0x000000, 0);
    
    // 그리드 라인
    this.boardGraphics = this.add.graphics();
    this.drawGrid();
    
    // 블록 그래픽 컨테이너
    this.blockGraphics = this.add.graphics();
    
    // UI 텍스트
    const uiX = this.BOARD_X + this.COLS * this.BLOCK_SIZE + 50;
    
    const scoreLabel = this.add.text(uiX, 50, '점수', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#00d9ff'
    });
    
    this.scoreText = this.add.text(uiX, 80, '0', {
      fontSize: '32px',
      fontFamily: 'Arial Bold',
      color: '#ffffff'
    });
    
    const levelLabel = this.add.text(uiX, 150, '레벨', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#00d9ff'
    });
    
    this.levelText = this.add.text(uiX, 180, '1', {
      fontSize: '32px',
      fontFamily: 'Arial Bold',
      color: '#ffffff'
    });
    
    const linesLabel = this.add.text(uiX, 250, '라인', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#00d9ff'
    });
    
    this.linesText = this.add.text(uiX, 280, '0', {
      fontSize: '32px',
      fontFamily: 'Arial Bold',
      color: '#ffffff'
    });
    
    const nextLabel = this.add.text(uiX, 350, '다음 블록', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#00d9ff'
    });
    
    // 다음 블록 미리보기 영역
    this.nextPieceGraphics = this.add.graphics();
    this.nextPieceX = uiX;
    this.nextPieceY = 390;
    
    // 일시정지 오버레이
    this.pauseOverlay = this.add.rectangle(
      width / 2, 
      height / 2, 
      width, 
      height, 
      0x000000, 
      0.7
    );
    this.pauseOverlay.setVisible(false);
    
    // 일시정지 텍스트
    this.pauseText = this.add.text(width / 2, height / 2, '일시정지\n\nP 키를 눌러 계속', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      color: '#ffffff',
      align: 'center'
    });
    this.pauseText.setOrigin(0.5);
    this.pauseText.setVisible(false);
    
    // 키보드 입력 설정
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    
    // 키 이벤트 리스너
    this.input.keyboard.on('keydown-P', this.togglePause, this);
    this.input.keyboard.on('keydown-SPACE', () => {
      if (!this.gameOver && !this.isPaused) {
        this.hardDrop();
      }
    });
    
    // 게임 시작
    this.spawnPiece();
  }

  update(time, delta) {
    if (this.gameOver || this.isPaused) return;
    
    // 자동 하강
    this.dropTimer += delta;
    if (this.dropTimer >= this.dropInterval) {
      this.moveDown();
      this.dropTimer = 0;
    }
    
    // 키 입력 처리 (딜레이 적용)
    const currentTime = time;
    if (currentTime - this.lastMoveTime > this.moveDelay) {
      if (this.cursors.left.isDown) {
        this.moveLeft();
        this.lastMoveTime = currentTime;
      } else if (this.cursors.right.isDown) {
        this.moveRight();
        this.lastMoveTime = currentTime;
      } else if (this.cursors.down.isDown) {
        this.moveDown();
        this.dropTimer = 0;
        this.lastMoveTime = currentTime;
      }
    }
    
    // 회전 (한 번만 입력)
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.rotate();
    }
    
    // 화면 그리기
    this.drawBoard();
    this.drawCurrentPiece();
    this.drawNextPiece();
  }

  drawGrid() {
    this.boardGraphics.clear();
    this.boardGraphics.lineStyle(1, 0x2a2a3e, 0.5);
    
    for (let row = 0; row <= this.ROWS; row++) {
      this.boardGraphics.beginPath();
      this.boardGraphics.moveTo(this.BOARD_X, this.BOARD_Y + row * this.BLOCK_SIZE);
      this.boardGraphics.lineTo(this.BOARD_X + this.COLS * this.BLOCK_SIZE, this.BOARD_Y + row * this.BLOCK_SIZE);
      this.boardGraphics.strokePath();
    }
    
    for (let col = 0; col <= this.COLS; col++) {
      this.boardGraphics.beginPath();
      this.boardGraphics.moveTo(this.BOARD_X + col * this.BLOCK_SIZE, this.BOARD_Y);
      this.boardGraphics.lineTo(this.BOARD_X + col * this.BLOCK_SIZE, this.BOARD_Y + this.ROWS * this.BLOCK_SIZE);
      this.boardGraphics.strokePath();
    }
  }

  drawBoard() {
    this.blockGraphics.clear();
    
    for (let row = 0; row < this.ROWS; row++) {
      for (let col = 0; col < this.COLS; col++) {
        if (this.board[row][col]) {
          const x = this.BOARD_X + col * this.BLOCK_SIZE;
          const y = this.BOARD_Y + row * this.BLOCK_SIZE;
          const color = this.boardColors[row][col];
          
          // 메인 블록
          this.blockGraphics.fillStyle(color, 1);
          this.blockGraphics.fillRect(x + 1, y + 1, this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);
          
          // 하이라이트
          this.blockGraphics.fillStyle(0xffffff, 0.3);
          this.blockGraphics.fillRect(x + 2, y + 2, this.BLOCK_SIZE - 4, 4);
          
          // 쉐도우
          this.blockGraphics.fillStyle(0x000000, 0.3);
          this.blockGraphics.fillRect(x + 2, y + this.BLOCK_SIZE - 6, this.BLOCK_SIZE - 4, 4);
        }
      }
    }
  }

  drawCurrentPiece() {
    if (!this.currentPiece) return;
    
    const shape = this.getCurrentShape();
    const color = this.tetrominoes[this.currentPiece].color;
    
    // 고스트 피스 (미리보기) 그리기
    let ghostY = this.currentY;
    while (!this.checkCollision(this.currentX, ghostY + 1, shape)) {
      ghostY++;
    }
    
    // 고스트 피스
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = this.BOARD_X + (this.currentX + col) * this.BLOCK_SIZE;
          const y = this.BOARD_Y + (ghostY + row) * this.BLOCK_SIZE;
          
          this.blockGraphics.lineStyle(2, color, 0.3);
          this.blockGraphics.strokeRect(x + 2, y + 2, this.BLOCK_SIZE - 4, this.BLOCK_SIZE - 4);
        }
      }
    }
    
    // 실제 블록
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = this.BOARD_X + (this.currentX + col) * this.BLOCK_SIZE;
          const y = this.BOARD_Y + (this.currentY + row) * this.BLOCK_SIZE;
          
          // 메인 블록
          this.blockGraphics.fillStyle(color, 1);
          this.blockGraphics.fillRect(x + 1, y + 1, this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);
          
          // 하이라이트
          this.blockGraphics.fillStyle(0xffffff, 0.4);
          this.blockGraphics.fillRect(x + 2, y + 2, this.BLOCK_SIZE - 4, 4);
          
          // 쉐도우
          this.blockGraphics.fillStyle(0x000000, 0.4);
          this.blockGraphics.fillRect(x + 2, y + this.BLOCK_SIZE - 6, this.BLOCK_SIZE - 4, 4);
        }
      }
    }
  }

  drawNextPiece() {
    this.nextPieceGraphics.clear();
    
    if (!this.nextPiece) return;
    
    const shape = this.tetrominoes[this.nextPiece].shape;
    const color = this.tetrominoes[this.nextPiece].color;
    
    const offsetX = this.nextPieceX;
    const offsetY = this.nextPieceY;
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = offsetX + col * this.BLOCK_SIZE;
          const y = offsetY + row * this.BLOCK_SIZE;
          
          // 메인 블록
          this.nextPieceGraphics.fillStyle(color, 1);
          this.nextPieceGraphics.fillRect(x, y, this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);
          
          // 하이라이트
          this.nextPieceGraphics.fillStyle(0xffffff, 0.3);
          this.nextPieceGraphics.fillRect(x + 1, y + 1, this.BLOCK_SIZE - 4, 4);
        }
      }
    }
  }

  spawnPiece() {
    if (!this.nextPiece) {
      this.nextPiece = this.getRandomTetromino();
    }
    
    this.currentPiece = this.nextPiece;
    this.nextPiece = this.getRandomTetromino();
    this.currentRotation = 0;
    
    const shape = this.getCurrentShape();
    this.currentX = Math.floor(this.COLS / 2) - Math.floor(shape[0].length / 2);
    this.currentY = 0;
    
    // 게임 오버 체크
    if (this.checkCollision(this.currentX, this.currentY, shape)) {
      this.endGame();
    }
  }

  getRandomTetromino() {
    return this.tetrominoTypes[Math.floor(Math.random() * this.tetrominoTypes.length)];
  }

  getCurrentShape() {
    const shape = this.tetrominoes[this.currentPiece].shape;
    return this.rotateShape(shape, this.currentRotation);
  }

  rotateShape(shape, rotation) {
    let rotated = shape;
    for (let i = 0; i < rotation; i++) {
      rotated = this.rotateMatrix(rotated);
    }
    return rotated;
  }

  rotateMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        rotated[col][rows - 1 - row] = matrix[row][col];
      }
    }
    
    return rotated;
  }

  checkCollision(x, y, shape) {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;
          
          // 경계 체크
          if (newX < 0 || newX >= this.COLS || newY >= this.ROWS) {
            return true;
          }
          
          // 보드 충돌 체크
          if (newY >= 0 && this.board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  moveLeft() {
    const shape = this.getCurrentShape();
    if (!this.checkCollision(this.currentX - 1, this.currentY, shape)) {
      this.currentX--;
    }
  }

  moveRight() {
    const shape = this.getCurrentShape();
    if (!this.checkCollision(this.currentX + 1, this.currentY, shape)) {
      this.currentX++;
    }
  }

  moveDown() {
    const shape = this.getCurrentShape();
    if (!this.checkCollision(this.currentX, this.currentY + 1, shape)) {
      this.currentY++;
      return true;
    } else {
      this.lockPiece();
      return false;
    }
  }

  rotate() {
    const newRotation = (this.currentRotation + 1) % 4;
    const shape = this.rotateShape(this.tetrominoes[this.currentPiece].shape, newRotation);
    
    // 벽 킥 시도
    const kicks = [
      { x: 0, y: 0 },   // 기본 위치
      { x: -1, y: 0 },  // 왼쪽으로 이동
      { x: 1, y: 0 },   // 오른쪽으로 이동
      { x: 0, y: -1 },  // 위로 이동
      { x: -1, y: -1 }, // 왼쪽 위
      { x: 1, y: -1 }   // 오른쪽 위
    ];
    
    for (const kick of kicks) {
      if (!this.checkCollision(this.currentX + kick.x, this.currentY + kick.y, shape)) {
        this.currentX += kick.x;
        this.currentY += kick.y;
        this.currentRotation = newRotation;
        return;
      }
    }
  }

  hardDrop() {
    const shape = this.getCurrentShape();
    while (!this.checkCollision(this.currentX, this.currentY + 1, shape)) {
      this.currentY++;
    }
    this.lockPiece();
  }

  lockPiece() {
    const shape = this.getCurrentShape();
    const color = this.tetrominoes[this.currentPiece].color;
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const boardY = this.currentY + row;
          const boardX = this.currentX + col;
          
          if (boardY >= 0) {
            this.board[boardY][boardX] = 1;
            this.boardColors[boardY][boardX] = color;
          }
        }
      }
    }
    
    // 줄 완성 체크
    this.checkLines();
    
    // 다음 블록 생성
    this.spawnPiece();
  }

  checkLines() {
    let linesCleared = 0;
    const clearedRows = [];
    
    for (let row = this.ROWS - 1; row >= 0; row--) {
      if (this.board[row].every(cell => cell === 1)) {
        clearedRows.push(row);
        linesCleared++;
      }
    }
    
    if (linesCleared > 0) {
      // 라인 클리어 애니메이션
      this.flashLines(clearedRows, () => {
        // 줄 삭제
        clearedRows.sort((a, b) => a - b);
        for (const row of clearedRows) {
          this.board.splice(row, 1);
          this.board.unshift(Array(this.COLS).fill(0));
          this.boardColors.splice(row, 1);
          this.boardColors.unshift(Array(this.COLS).fill(0));
        }
        
        this.updateScore(linesCleared);
        this.linesCleared += linesCleared;
        this.linesText.setText(this.linesCleared.toString());
        
        // 레벨 업 (10줄마다)
        const newLevel = Math.floor(this.linesCleared / 10) + 1;
        if (newLevel > this.level) {
          this.level = newLevel;
          this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
          this.levelText.setText(this.level.toString());
          
          // 레벨 업 효과
          this.cameras.main.flash(200, 0, 217, 255);
        }
      });
    }
  }

  flashLines(rows, callback) {
    let flashCount = 0;
    const maxFlashes = 3;
    
    const flashTimer = this.time.addEvent({
      delay: 100,
      callback: () => {
        flashCount++;
        
        // 깜빡임 효과
        for (const row of rows) {
          for (let col = 0; col < this.COLS; col++) {
            if (flashCount % 2 === 0) {
              this.boardColors[row][col] = 0xffffff;
            } else {
              this.board[row][col] = 0;
            }
          }
        }
        
        if (flashCount >= maxFlashes * 2) {
          flashTimer.remove();
          callback();
        }
      },
      repeat: maxFlashes * 2 - 1
    });
  }

  updateScore(linesCleared) {
    const points = [0, 100, 300, 500, 800];
    this.score += points[linesCleared] * this.level;
    this.scoreText.setText(this.score.toString());
  }

  togglePause() {
    if (this.gameOver) return;
    
    this.isPaused = !this.isPaused;
    this.pauseOverlay.setVisible(this.isPaused);
    this.pauseText.setVisible(this.isPaused);
    
    if (this.isPaused) {
      // 일시정지 효과
      this.tweens.add({
        targets: this.pauseText,
        scale: { from: 0.9, to: 1.1 },
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    } else {
      this.tweens.killTweensOf(this.pauseText);
      this.pauseText.setScale(1);
    }
  }

  endGame() {
    this.gameOver = true;
    this.cameras.main.shake(500, 0.01);
    this.time.delayedCall(500, () => {
      this.scene.start('GameOverScene', { 
        score: this.score, 
        level: this.level,
        lines: this.linesCleared
      });
    });
  }
}
