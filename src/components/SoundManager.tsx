import { getPath } from '../util/util';

const BGM_FILES = ['/sound/bgm1.mp3', '/sound/bgm2.mp3', '/sound/bgm3.mp3', '/sound/bgm4.mp3'];

const EFFECT_FILES = [
  '/sound/click.mp3',
  '/sound/seikai.mp3',
  '/sound/sippai.mp3',
  '/sound/battleStart.mp3',
  '/sound/clear.mp3',
  ...Array.from({ length: 5 }, (_, i) => `/sound/ken${i + 1}.mp3`),
];

class SoundManager {
  private static instance: SoundManager;
  private bgmAudio: HTMLAudioElement | null = null;
  private effectAudios: Record<string, HTMLAudioElement> = {};
  private isUnlocked = false;
  private pendingBgm: { path: string; volume: number } | null = null;
  private audioContext: AudioContext | null = null;

  private constructor() {
    // 効果音を事前読み込み
    EFFECT_FILES.forEach((path) => {
      const audio = new Audio(getPath(path));
      audio.volume = 0.5;
      audio.preload = 'auto';
      this.effectAudios[path] = audio;
    });

    // ユーザーインタラクションを検知して音声をアンロック
    this.setupUnlockListener();
  }

  private setupUnlockListener() {
    const unlockAudio = async () => {
      if (this.isUnlocked) return;

      console.log('Attempting to unlock audio...');

      // AudioContextを作成してresumeする（Chromeの要件）
      try {
        if (!this.audioContext) {
          this.audioContext = new (
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
          )();
        }

        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }

        // すべての効果音を一度ロードしてアンロック状態にする
        const unlockPromises = Object.values(this.effectAudios).map(async (audio) => {
          try {
            // 無音で再生してアンロック
            audio.muted = true;
            audio.volume = 0;
            await audio.play();
            audio.pause();
            audio.currentTime = 0;
            audio.muted = false;
            audio.volume = 0.5;
          } catch {
            // エラーは無視（まだアンロックされていない可能性）
          }
        });

        await Promise.all(unlockPromises);

        this.isUnlocked = true;
        console.log('Audio unlocked successfully!');

        // 保留中のBGMがあれば再生
        if (this.pendingBgm) {
          console.log('Playing pending BGM:', this.pendingBgm.path);
          this.playBgmInternal(this.pendingBgm.path, this.pendingBgm.volume);
          this.pendingBgm = null;
        }
      } catch (err) {
        console.error('Failed to unlock audio:', err);
      }
    };

    // 複数のイベントタイプでアンロックを試みる
    const events = ['click', 'touchstart', 'touchend', 'keydown', 'mousedown', 'pointerdown'];

    const handleInteraction = () => {
      unlockAudio();
      // アンロック成功後はリスナーを削除
      if (this.isUnlocked) {
        events.forEach((event) => {
          document.removeEventListener(event, handleInteraction, true);
        });
      }
    };

    events.forEach((event) => {
      document.addEventListener(event, handleInteraction, {
        capture: true,
        passive: true,
      });
    });
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private async playBgmInternal(path: string, volume: number) {
    // 前のBGMを停止
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }

    // 新しいBGMを準備
    this.bgmAudio = new Audio(getPath(path));
    this.bgmAudio.volume = volume;
    this.bgmAudio.loop = true;
    this.bgmAudio.preload = 'auto';

    // 再生を試みる（リトライ機能付き）
    const attemptPlay = async (retries = 3): Promise<void> => {
      try {
        await this.bgmAudio?.play();
        console.log('BGM playing:', path);
      } catch (err) {
        console.warn(`BGM play attempt failed (${retries} retries left):`, err);
        if (retries > 0) {
          // 少し待ってからリトライ
          await new Promise((resolve) => setTimeout(resolve, 100));
          return attemptPlay(retries - 1);
        }
        // リトライ失敗時は保留キューに追加
        console.log('BGM queued for later:', path);
        this.pendingBgm = { path, volume };
      }
    };

    await attemptPlay();
  }

  public playBgm(path: string, volume = 0.5) {
    if (!BGM_FILES.includes(path)) return;

    // 既に同じBGMが再生中なら何もしない
    if (this.bgmAudio && !this.bgmAudio.paused && this.bgmAudio.src.endsWith(path)) {
      return;
    }

    // アンロックされていない場合は保留キューに追加
    if (!this.isUnlocked) {
      console.log('Audio not unlocked yet, queuing BGM:', path);
      this.pendingBgm = { path, volume };

      // それでも試してみる（うまくいく場合もある）
      this.playBgmInternal(path, volume);
      return;
    }

    this.playBgmInternal(path, volume);
  }

  public playEffect(path: string, volume = 0.5) {
    const effect = this.effectAudios[path];
    if (!effect) return;

    // 効果音を再生
    effect.volume = volume;
    effect.currentTime = 0;

    // 再生を試みる
    effect.play().catch((err: Error) => {
      console.warn('Effect play failed:', path, err);
      // 効果音は即座に再生されないと意味がないので、リトライはしない
    });
  }

  // 手動でアンロックを試みるメソッド（クリックハンドラから呼ぶ用）
  public async tryUnlock(): Promise<boolean> {
    if (this.isUnlocked) return true;

    try {
      if (!this.audioContext) {
        this.audioContext = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )();
      }

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.isUnlocked = true;

      // 保留中のBGMがあれば再生
      if (this.pendingBgm) {
        this.playBgmInternal(this.pendingBgm.path, this.pendingBgm.volume);
        this.pendingBgm = null;
      }

      return true;
    } catch {
      return false;
    }
  }

  public getIsUnlocked(): boolean {
    return this.isUnlocked;
  }
}

export const useSoundManager = () => {
  const manager = SoundManager.getInstance();
  return {
    playBgm: manager.playBgm.bind(manager),
    playEffect: manager.playEffect.bind(manager),
    tryUnlock: manager.tryUnlock.bind(manager),
    getIsUnlocked: manager.getIsUnlocked.bind(manager),
  };
};
