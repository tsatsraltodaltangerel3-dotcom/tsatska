/**
 * YouTube IFrame Player API-д суурилсан дууны дахилт тоглуулагч.
 * Дуу: John Newman - Love Me Again (https://youtu.be/CfihYWRWRTQ)
 * Дахилт хэсэг: 0:49 - 1:25 (49с - 85с) давталттай тоглоно.
 */

const YOUTUBE_VIDEO_ID = 'CfihYWRWRTQ';
const CHORUS_START_SECONDS = 49;
const CHORUS_END_SECONDS = 85;
const CONTAINER_ID = 'yt-chorus-ambient-player';

interface YTPlayerOptions {
  height?: string | number;
  width?: string | number;
  videoId: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: { target: YTPlayerInstance }) => void;
    onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
    onError?: () => void;
  };
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  setVolume: (volume: number) => void;
  unMute: () => void;
  destroy: () => void;
}

interface YTNamespace {
  Player: new (elementId: string, options: YTPlayerOptions) => YTPlayerInstance;
  PlayerState?: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

type PlaybackListener = (playing: boolean) => void;

class AmbientAudioManager {
  private player: YTPlayerInstance | null = null;
  private isPlayerReady = false;
  private isInitializing = false;
  private isAudioPlaying = false;
  private pendingPlay = false;
  private loopTimer: number | null = null;
  private listeners = new Set<PlaybackListener>();

  public subscribe(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.isAudioPlaying));
  }

  public preload() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (this.player || this.isInitializing) return;

    this.isInitializing = true;
    this.ensureContainer();

    if (window.YT && typeof window.YT.Player === 'function') {
      this.createPlayer();
      return;
    }

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === 'function') {
        previousReady();
      }
      this.createPlayer();
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]'
    );
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    }
  }

  private ensureContainer() {
    let container = document.getElementById(CONTAINER_ID);
    if (!container) {
      container = document.createElement('div');
      container.id = CONTAINER_ID;
      container.setAttribute('aria-hidden', 'true');
      container.style.position = 'fixed';
      container.style.bottom = '0';
      container.style.right = '0';
      container.style.width = '200px';
      container.style.height = '200px';
      container.style.opacity = '0.001';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '-1';
      container.style.overflow = 'hidden';
      document.body.appendChild(container);
    }
  }

  private createPlayer() {
    if (this.player || !window.YT || typeof window.YT.Player !== 'function') return;
    this.ensureContainer();

    try {
      this.player = new window.YT.Player(CONTAINER_ID, {
        width: 200,
        height: 200,
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          start: CHORUS_START_SECONDS,
          end: CHORUS_END_SECONDS,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            this.isPlayerReady = true;
            this.isInitializing = false;
            if (this.pendingPlay && this.isAudioPlaying) {
              this.pendingPlay = false;
              this.startChorusPlayback();
            }
          },
          onStateChange: (event) => {
            const endedState = window.YT?.PlayerState?.ENDED ?? 0;
            if (event.data === endedState && this.isAudioPlaying) {
              this.player?.seekTo(CHORUS_START_SECONDS, true);
              this.player?.playVideo();
            }
          },
          onError: () => {
            this.isAudioPlaying = false;
            this.pendingPlay = false;
            this.clearLoopTimer();
            this.notify();
          },
        },
      });
    } catch (e) {
      this.isInitializing = false;
      console.warn('YouTube chorus player init error:', e);
    }
  }

  private startChorusPlayback() {
    if (!this.player || !this.isPlayerReady) return;
    try {
      this.player.unMute();
      this.player.setVolume(85);
      this.player.seekTo(CHORUS_START_SECONDS, true);
      this.player.playVideo();
      this.startLoopTimer();
    } catch (e) {
      console.warn('YouTube chorus playback error:', e);
    }
  }

  private startLoopTimer() {
    this.clearLoopTimer();
    this.loopTimer = window.setInterval(() => {
      if (!this.isAudioPlaying || !this.player || !this.isPlayerReady) return;
      try {
        const current = this.player.getCurrentTime();
        if (current >= CHORUS_END_SECONDS || current < CHORUS_START_SECONDS - 1) {
          this.player.seekTo(CHORUS_START_SECONDS, true);
        }
      } catch {
        // Ignore transient player query errors
      }
    }, 250);
  }

  private clearLoopTimer() {
    if (this.loopTimer !== null) {
      window.clearInterval(this.loopTimer);
      this.loopTimer = null;
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
    this.isAudioPlaying = true;
    this.notify();

    if (!this.player) {
      this.pendingPlay = true;
      this.preload();
      return;
    }

    if (!this.isPlayerReady) {
      this.pendingPlay = true;
      return;
    }

    this.pendingPlay = false;
    this.startChorusPlayback();
  }

  public stop() {
    this.isAudioPlaying = false;
    this.pendingPlay = false;
    this.clearLoopTimer();
    this.notify();

    if (this.player && this.isPlayerReady) {
      try {
        this.player.pauseVideo();
      } catch {
        // Ignore pause error if player is tearing down
      }
    }
  }

  public isPlaying(): boolean {
    return this.isAudioPlaying;
  }
}

export const ambientAudio = new AmbientAudioManager();
