
// Audio Synthesizer for UI Sounds
// Uses Web Audio API to generate sounds without external assets

let audioCtx: AudioContext | null = null;
let gainNode: GainNode | null = null;
let isMuted = false;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    // Master Gain to prevent clipping
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.1; // Keep it subtle
    gainNode.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const toggleMute = () => {
    isMuted = !isMuted;
    if (gainNode) {
        gainNode.gain.value = isMuted ? 0 : 0.1;
    }
    return isMuted;
};

export const getMuteState = () => isMuted;

// Generic Tone Generator
const playTone = (freq: number, type: OscillatorType, duration: number, delay = 0) => {
  if (isMuted) return;
  if (!audioCtx || !gainNode) initAudio();
  if (!audioCtx || !gainNode) return;

  const osc = audioCtx.createOscillator();
  const env = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
  
  // Envelope
  env.gain.setValueAtTime(0, audioCtx.currentTime + delay);
  env.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + delay + 0.01);
  env.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);

  osc.connect(env);
  env.connect(gainNode);

  osc.start(audioCtx.currentTime + delay);
  osc.stop(audioCtx.currentTime + delay + duration + 0.1);
};

export const playHover = () => {
  // High pitched short blip
  playTone(800, 'sine', 0.05);
};

export const playClick = () => {
  // Mechanical click
  playTone(300, 'square', 0.05);
  playTone(150, 'sawtooth', 0.05, 0.02);
};

export const playTyping = () => {
    // Soft noise/tick
    playTone(600 + Math.random() * 200, 'triangle', 0.03);
}

export const playAchievement = () => {
  // Major Triad Arpeggio (C Major: C E G C)
  const duration = 0.1;
  const now = 0;
  playTone(523.25, 'sine', 0.3, now);       // C5
  playTone(659.25, 'sine', 0.3, now + 0.1); // E5
  playTone(783.99, 'sine', 0.3, now + 0.2); // G5
  playTone(1046.50, 'square', 0.5, now + 0.3); // C6
};

export const playError = () => {
    playTone(150, 'sawtooth', 0.3);
    playTone(140, 'sawtooth', 0.3, 0.1);
}

export const playPowerUp = () => {
    if (isMuted) return;
    // Sci-fi power up sweep
    if (!audioCtx || !gainNode) initAudio();
    if (!audioCtx || !gainNode) return;
    
    const osc = audioCtx.createOscillator();
    const env = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 1);
    
    env.gain.setValueAtTime(0, audioCtx.currentTime);
    env.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.1);
    env.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
    
    osc.connect(env);
    env.connect(gainNode);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 1);
};

export const playWarp = () => {
    if (isMuted) return;
    if (!audioCtx || !gainNode) initAudio();
    if (!audioCtx || !gainNode) return;

    // Deep rumble rising
    const osc = audioCtx.createOscillator();
    const env = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(50, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 1.5);
    
    env.gain.setValueAtTime(0, audioCtx.currentTime);
    env.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.2);
    env.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);

    osc.connect(env);
    env.connect(gainNode);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 1.5);
}

// Initializer to be called on first user interaction
export const resumeAudioContext = () => {
    initAudio();
};
