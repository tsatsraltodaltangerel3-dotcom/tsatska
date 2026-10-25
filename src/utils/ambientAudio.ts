/**
 * Web Audio API-д суурилсан бороо ба тайвшруулах хөгжмийн симулятор.
 * Гадны найдвартай бус аудио файл шаардахгүйгээр цэвэр хөгжим тоглоно.
 */

class AmbientAudioManager {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private masterGain: GainNode | null = null;
  private isAudioPlaying = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    if (this.isAudioPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public play() {
    try {
      this.initContext();
      if (!this.ctx) return;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 1.5);
      this.masterGain.connect(this.ctx.destination);

      // Pink noise for rain
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.08;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.masterGain);
      whiteNoise.start();
      this.noiseNode = whiteNoise;

      // Warm blue-hour sine chord (A2 + E3)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, this.ctx.currentTime); // A2
      const oscGain1 = this.ctx.createGain();
      oscGain1.gain.setValueAtTime(0.08, this.ctx.currentTime);
      osc1.connect(oscGain1);
      oscGain1.connect(this.masterGain);
      osc1.start();
      this.droneOsc1 = osc1;

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(164.81, this.ctx.currentTime); // E3
      const oscGain2 = this.ctx.createGain();
      oscGain2.gain.setValueAtTime(0.05, this.ctx.currentTime);
      osc2.connect(oscGain2);
      oscGain2.connect(this.masterGain);
      osc2.start();
      this.droneOsc2 = osc2;

      this.isAudioPlaying = true;
    } catch (e) {
      console.warn("AudioContext playback error:", e);
    }
  }

  public stop() {
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
        setTimeout(() => {
          this.noiseNode?.disconnect();
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.noiseNode = null;
          this.droneOsc1 = null;
          this.droneOsc2 = null;
          this.isAudioPlaying = false;
        }, 600);
      } catch {
        this.isAudioPlaying = false;
      }
    } else {
      this.isAudioPlaying = false;
    }
  }

  public isPlaying(): boolean {
    return this.isAudioPlaying;
  }
}

export const ambientAudio = new AmbientAudioManager();
