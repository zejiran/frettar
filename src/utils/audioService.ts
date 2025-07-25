import { getFrequency } from './musicTheory';

export interface AudioSettings {
  volume: number;
  sustainTime: number;
  attackTime: number;
  releaseTime: number;
  waveType: OscillatorType;
  enableReverb: boolean;
  reverbAmount: number;
}

export interface AudioServiceInterface {
  playNote: (stringIndex: number, fretNumber: number, duration?: number) => Promise<void>;
  playFrequency: (frequency: number, duration?: number) => Promise<void>;
  playChord: (notes: Array<{ string: number; fret: number }>, duration?: number) => Promise<void>;
  setVolume: (volume: number) => void;
  updateSettings: (settings: Partial<AudioSettings>) => void;
  getSettings: () => AudioSettings;
  isSupported: () => boolean;
  stop: () => void;
}

class AudioService implements AudioServiceInterface {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private activeOscillators: Set<OscillatorNode> = new Set();
  private activeGains: Set<GainNode> = new Set();

  private settings: AudioSettings = {
    volume: 0.3,
    sustainTime: 1.0,
    attackTime: 0.01,
    releaseTime: 0.5,
    waveType: 'sawtooth',
    enableReverb: true,
    reverbAmount: 0.2,
  };

  private async initializeAudioContext(): Promise<void> {
    if (this.audioContext) return;

    try {
      const AudioContextClass = window.AudioContext ||
                               (window as any).webkitAudioContext ||
                               (window as any).mozAudioContext ||
                               (window as any).msAudioContext;

      if (!AudioContextClass) {
        throw new Error('Web Audio API not supported in this browser');
      }

      this.audioContext = new AudioContextClass();

      // Create master gain node
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.settings.volume;

      // Create reverb
      await this.createReverb();

      // Connect master gain to destination
      if (this.settings.enableReverb && this.reverbNode) {
        const reverbGain = this.audioContext.createGain();
        const dryGain = this.audioContext.createGain();

        reverbGain.gain.value = this.settings.reverbAmount;
        dryGain.gain.value = 1 - this.settings.reverbAmount;

        this.masterGain.connect(dryGain);
        this.masterGain.connect(this.reverbNode);
        this.reverbNode.connect(reverbGain);

        dryGain.connect(this.audioContext.destination);
        reverbGain.connect(this.audioContext.destination);
      } else {
        this.masterGain.connect(this.audioContext.destination);
      }

      // Resume context if it's suspended (required for some browsers)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      if (this.audioContext.state === 'closed') {
        throw new Error('Audio context is closed');
      }
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      throw new Error('Web Audio API not supported');
    }
  }

  private async createReverb(): Promise<void> {
    if (!this.audioContext) return;

    this.reverbNode = this.audioContext.createConvolver();

    // Create impulse response for reverb
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * 2; // 2 seconds of reverb
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 2);
        channelData[i] = (Math.random() * 2 - 1) * decay * 0.1;
      }
    }

    this.reverbNode.buffer = impulse;
  }

  private createGuitarOscillator(frequency: number, startTime: number, duration: number): { oscillator: OscillatorNode; gain: GainNode } {
    if (!this.audioContext || !this.masterGain) {
      throw new Error('Audio context not initialized');
    }

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    // Set up oscillator
    oscillator.type = this.settings.waveType;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    // Add slight detuning for a more organic sound
    const detune = this.audioContext.createOscillator();
    const detuneGain = this.audioContext.createGain();
    detune.type = 'sine';
    detune.frequency.setValueAtTime(frequency * 1.002, startTime);
    detuneGain.gain.value = 0.3;

    // Set up filter for guitar-like tone
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, startTime);
    filter.Q.setValueAtTime(1, startTime);

    // ADSR envelope - dynamically adjust based on duration
    const attackTime = Math.min(0.05, duration * 0.1); // Attack is 10% of duration, max 50ms
    const releaseTime = Math.min(0.3, duration * 0.2); // Release is 20% of duration, max 300ms
    const decayTime = Math.min(0.1, duration * 0.1); // Decay is 10% of duration, max 100ms

    const endTime = startTime + duration;
    const releaseStartTime = endTime - releaseTime;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.8, startTime + attackTime);
    gain.gain.linearRampToValueAtTime(0.6, startTime + attackTime + decayTime);
    gain.gain.setValueAtTime(0.6, releaseStartTime);
    gain.gain.linearRampToValueAtTime(0, endTime);

    // Connect nodes
    oscillator.connect(filter);
    detune.connect(detuneGain);
    detuneGain.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    // Schedule start and stop
    oscillator.start(startTime);
    detune.start(startTime);
    oscillator.stop(endTime);
    detune.stop(endTime);

    // Track active nodes
    this.activeOscillators.add(oscillator);
    this.activeOscillators.add(detune);
    this.activeGains.add(gain);

    // Clean up when finished
    oscillator.addEventListener('ended', () => {
      this.activeOscillators.delete(oscillator);
      this.activeOscillators.delete(detune);
      this.activeGains.delete(gain);
    });

    return { oscillator, gain };
  }

  public async playNote(stringIndex: number, fretNumber: number, duration: number = 2): Promise<void> {
    if (!this.isSupported()) {
      console.warn('Audio not supported in this browser');
      return;
    }

    try {
      await this.initializeAudioContext();
      const frequency = getFrequency(stringIndex, fretNumber);
      await this.playFrequency(frequency, duration);
    } catch (error) {
      console.error('Error playing note:', error);
      throw error; // Re-throw to allow caller to handle
    }
  }

  public async playFrequency(frequency: number, duration: number = 2): Promise<void> {
    if (!this.isSupported()) {
      console.warn('Audio not supported in this browser');
      return;
    }

    try {
      await this.initializeAudioContext();

      if (!this.audioContext) {
        throw new Error('Audio context not available');
      }

      const startTime = this.audioContext.currentTime;
      this.createGuitarOscillator(frequency, startTime, duration);
    } catch (error) {
      console.error('Error playing frequency:', error);
      throw error; // Re-throw to allow caller to handle
    }
  }

  public async playChord(notes: Array<{ string: number; fret: number }>, duration: number = 3): Promise<void> {
    if (!this.isSupported()) {
      console.warn('Audio not supported in this browser');
      return;
    }

    try {
      await this.initializeAudioContext();

      if (!this.audioContext) {
        throw new Error('Audio context not available');
      }

      const startTime = this.audioContext.currentTime;

      // Play all notes simultaneously with slight timing variation for realism
      notes.forEach((note, index) => {
        const frequency = getFrequency(note.string, note.fret);
        const noteStartTime = startTime + (index * 0.02); // 20ms stagger
        this.createGuitarOscillator(frequency, noteStartTime, duration);
      });
    } catch (error) {
      console.error('Error playing chord:', error);
      throw error; // Re-throw to allow caller to handle
    }
  }

  public setVolume(volume: number): void {
    this.settings.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.settings.volume, this.audioContext?.currentTime || 0);
    }
  }

  public updateSettings(newSettings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...newSettings };

    if (this.masterGain && newSettings.volume !== undefined) {
      this.masterGain.gain.setValueAtTime(this.settings.volume, this.audioContext?.currentTime || 0);
    }
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  public isSupported(): boolean {
    return !!(window.AudioContext ||
             (window as any).webkitAudioContext ||
             (window as any).mozAudioContext ||
             (window as any).msAudioContext);
  }

  public stop(): void {
    // Stop all active oscillators
    this.activeOscillators.forEach(oscillator => {
      try {
        oscillator.stop();
      } catch (error) {
        // Oscillator might already be stopped
      }
    });

    // Clear sets
    this.activeOscillators.clear();
    this.activeGains.clear();

    // Close audio context if exists
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
      this.masterGain = null;
      this.reverbNode = null;
    }
  }
}

export const audioService = new AudioService();

export const playNoteByName = async (noteName: string, octave: number = 4, duration: number = 2): Promise<void> => {
  const noteFrequencies: Record<string, number> = {
    'C': 261.63,
    'C#': 277.18,
    'D': 293.66,
    'D#': 311.13,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'G': 392.00,
    'G#': 415.30,
    'A': 440.00,
    'A#': 466.16,
    'B': 493.88,
  };

  const baseFrequency = noteFrequencies[noteName];
  if (!baseFrequency) {
    throw new Error(`Invalid note name: ${noteName}`);
  }

  // Calculate frequency for the specified octave (4 is the base octave)
  const frequency = baseFrequency * Math.pow(2, octave - 4);
  await audioService.playFrequency(frequency, duration);
};

export const preloadAudio = async (): Promise<void> => {
  try {
    if (audioService.isSupported()) {
      // Initialize audio context on user interaction
      await audioService.playFrequency(0, 0);
    }
  } catch (error) {
    console.warn('Audio preload failed:', error);
  }
};
