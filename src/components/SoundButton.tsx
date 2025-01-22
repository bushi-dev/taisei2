import { useRef } from 'react'
import { getPath } from '../util/util'

// 最大ken数 (ken1からken100まで再生可能)
const MAX_KEN_COUNT = 24

interface SoundButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  isBattleMode?: boolean
  id?: string
}

const SoundButton = ({
  children,
  onClick,
  className,
  isBattleMode,
}: SoundButtonProps) => {
  const lastClickTime = useRef(0)

  const handleClick = () => {
    const now = Date.now()
    if (now - lastClickTime.current < 500) {
      return
    }
    lastClickTime.current = now
    if (isBattleMode) {
      // バトルモード時はken1からken100までランダム再生
      const randomKen = Math.floor(Math.random() * MAX_KEN_COUNT) + 1
      const soundPath = `/sound/ken${randomKen}.mp3`
      const battleSound = new Audio(getPath(soundPath))
      battleSound.volume = 0.5
      battleSound.play().catch(() => {})
    } else {
      // 通常時はクリック音再生
      const clickSound = new Audio(getPath('/sound/click.mp3'))
      clickSound.volume = 0.5
      clickSound.play().catch(() => {})
    }

    if (onClick) {
      onClick()
    }
  }

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  )
}

export default SoundButton
