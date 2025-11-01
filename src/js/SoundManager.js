// 사운드 매니저 클래스
export default class SoundManager {
  constructor(scene) {
    this.scene = scene;
    this.audioContext = null;
    this.masterGain = null;
    this.isMuted = false;
    
    // 오디오 컨텍스트 초기화
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3; // 기본 볼륨 30%
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  // 회전 사운드
  playRotate() {
    if (this.isMuted || !this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.frequency.value = 600;
    osc.type = 'sine';
    
    gain.gain.value = 0.1;
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.05);
  }

  // 이동 사운드
  playMove() {
    if (this.isMuted || !this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.frequency.value = 400;
    osc.type = 'square';
    
    gain.gain.value = 0.05;
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.03);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.03);
  }

  // 착지 사운드
  playLand() {
    if (this.isMuted || !this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.frequency.value = 200;
    osc.type = 'sine';
    
    gain.gain.value = 0.15;
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  // 라인 클리어 사운드
  playLineClear(lines = 1) {
    if (this.isMuted || !this.audioContext) return;
    
    const baseFreq = 500;
    const notes = [baseFreq, baseFreq * 1.2, baseFreq * 1.5, baseFreq * 2];
    
    for (let i = 0; i < Math.min(lines, 4); i++) {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.frequency.value = notes[i];
      osc.type = 'triangle';
      
      const startTime = this.audioContext.currentTime + i * 0.05;
      gain.gain.value = 0.2;
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
      
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    }
  }

  // 테트리스 (4줄 클리어) 사운드
  playTetris() {
    if (this.isMuted || !this.audioContext) return;
    
    const frequencies = [523, 659, 784, 1047]; // C, E, G, C (한 옥타브 위)
    
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.frequency.value = freq;
      osc.type = 'triangle';
      
      const startTime = this.audioContext.currentTime + i * 0.08;
      gain.gain.value = 0.25;
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  // 레벨업 사운드
  playLevelUp() {
    if (this.isMuted || !this.audioContext) return;
    
    const frequencies = [400, 500, 600, 800, 1000];
    
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.frequency.value = freq;
      osc.type = 'sawtooth';
      
      const startTime = this.audioContext.currentTime + i * 0.06;
      gain.gain.value = 0.15;
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
      
      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
  }

  // 게임 오버 사운드
  playGameOver() {
    if (this.isMuted || !this.audioContext) return;
    
    const frequencies = [400, 350, 300, 250, 200];
    
    frequencies.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.frequency.value = freq;
      osc.type = 'sawtooth';
      
      const startTime = this.audioContext.currentTime + i * 0.1;
      gain.gain.value = 0.2;
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
      
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  // 하드 드롭 사운드
  playHardDrop() {
    if (this.isMuted || !this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.frequency.value = 100;
    osc.type = 'sawtooth';
    
    gain.gain.value = 0.2;
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.15);
  }

  // 홀드 사운드
  playHold() {
    if (this.isMuted || !this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.frequency.value = 700;
    osc.type = 'sine';
    
    gain.gain.value = 0.12;
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.08);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.08);
  }

  // 메뉴 선택 사운드
  playMenuSelect() {
    if (this.isMuted || !this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.frequency.value = 800;
    osc.type = 'sine';
    
    gain.gain.value = 0.1;
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  // 음소거 토글
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
    }
    return this.isMuted;
  }

  // 볼륨 설정 (0.0 ~ 1.0)
  setVolume(volume) {
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  // 정리
  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

