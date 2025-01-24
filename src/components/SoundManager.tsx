import { getPath } from '../util/util'

const BGM_FILES = [
  '/sound/bgm1.mp3',
  '/sound/bgm2.mp3',
  '/sound/bgm3.mp3',
  '/sound/bgm4.mp3',
]

const EFFECT_FILES = [
  '/sound/click.mp3',
  '/sound/seikai.mp3',
  '/sound/sippai.mp3',
  ...Array.from({ length: 5 }, (_, i) => `/sound/ken${i + 1}.mp3`),
]

class SoundManager {
  private static instance: SoundManager
  private bgmAudio: HTMLAudioElement | null = null
  private effectAudios: Record<string, HTMLAudioElement> = {}

  private constructor() {
    // 効果音を事前読み込み
    EFFECT_FILES.forEach((path) => {
      const audio = new Audio(getPath(path))
      audio.volume = 0.5
      this.effectAudios[path] = audio
    })
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  public playBgm(path: string, volume = 0.5) {
    if (!BGM_FILES.includes(path)) return

    // 既に同じBGMが再生中なら何もしない
    if (this.bgmAudio && this.bgmAudio.src.endsWith(path)) return

    // 前のBGMを停止
    if (this.bgmAudio) {
      this.bgmAudio.pause()
      this.bgmAudio.currentTime = 0
    }

    // 新しいBGMを準備
    this.bgmAudio = new Audio(getPath(path))
    this.bgmAudio.volume = volume
    this.bgmAudio.loop = true

    // ユーザー操作後に再生
    const playAfterInteraction = () => {
      this.bgmAudio?.play().catch((err: Error) => {
        console.error('Error playing BGM:', path, err)
      })
      window.removeEventListener('click', playAfterInteraction)
      window.removeEventListener('keydown', playAfterInteraction)
    }

    window.addEventListener('click', playAfterInteraction)
    window.addEventListener('keydown', playAfterInteraction)
  }

  public playEffect(path: string, volume = 0.5) {
    const effect = this.effectAudios[path]
    if (!effect) return

    // 効果音を再生
    effect.volume = volume
    effect.currentTime = 0
    effect.play().catch((err: Error) => {
      console.error('Error playing effect:', path, err)
    })
  }
}

export const useSoundManager = () => {
  const manager = SoundManager.getInstance()
  return {
    playBgm: manager.playBgm.bind(manager),
    playEffect: manager.playEffect.bind(manager),
  }
}
