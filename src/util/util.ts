import { RefObject } from 'react'

export const MAX_TREASURES = 6

export const getPath = (src: string) => {
  return '/taisei2' + src
}

export const saveTreasure = (treasureId: number) => {
  const savedTreasures = JSON.parse(localStorage.getItem('treasures') || '[]')
  if (!savedTreasures.includes(treasureId)) {
    savedTreasures.push(treasureId)
    localStorage.setItem('treasures', JSON.stringify(savedTreasures))
  }
}

export const getSavedTreasures = () => {
  return JSON.parse(localStorage.getItem('treasures') || '[]')
}

export const playSound = (
  audioRef: RefObject<HTMLAudioElement | null>,
  seikai: boolean
) => {
  if (audioRef.current) {
    const primarySound = seikai
      ? getPath('/sound/ken1.mp3')
      : getPath('/sound/ken2.mp3')
    const secondarySound = seikai
      ? getPath('/sound/seikai.mp3')
      : getPath('/sound/sippai.mp3')

    const playAudio = (src: string, onEnd?: () => void) => {
      if (!audioRef.current) return

      audioRef.current.src = src
      audioRef.current.load()
      audioRef.current.loop = false

      audioRef.current
        .play()
        .then(() => {
          console.log(`${src} is playing...`)
        })
        .catch(() => {})

      if (onEnd) {
        audioRef.current.addEventListener('ended', function handleEnded() {
          audioRef.current?.removeEventListener('ended', handleEnded)
          onEnd()
        })
      }
    }

    playAudio(primarySound, () => {
      playAudio(secondarySound)
    })
  }
}
