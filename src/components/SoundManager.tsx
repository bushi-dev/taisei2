import { useEffect, useRef } from 'react'
import { getPath } from '../util/util'

const SOUND_FILES = [
  '/sound/click.mp3',
  '/sound/seikai.mp3',
  '/sound/sippai.mp3',
  '/sound/bgm1.mp3',
  '/sound/bgm2.mp3',
  '/sound/bgm3.mp3',
  '/sound/bgm4.mp3',
  ...Array.from({ length: 18 }, (_, i) => `/sound/ken${i + 1}.mp3`),
]

export const useSoundManager = () => {
  const sounds = useRef<Record<string, HTMLAudioElement>>({})

  useEffect(() => {
    // 音声ファイルを事前読み込み
    SOUND_FILES.forEach((path) => {
      const audio = new Audio(getPath(path))
      audio.volume = 0.5
      sounds.current[path] = audio
    })
  }, [])

  const playSound = (path: string, volume = 0.5) => {
    const sound = sounds.current[path]
    if (sound) {
      sound.currentTime = 0
      sound.volume = volume
      sound.play().catch(() => {})
    }
  }

  return { playSound }
}
