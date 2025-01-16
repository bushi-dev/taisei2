import { getPath } from '../util/util'

// 最大ken数 (ken1からken100まで再生可能)
const MAX_KEN_COUNT = 24

interface SoundButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  isBattleMode?: boolean
}

const SoundButton = ({
  children,
  onClick,
  className,
  isBattleMode,
}: SoundButtonProps) => {
  const handleClick = () => {
    if (isBattleMode) {
      // バトルモード時はken1からken100までランダム再生
      const randomKen = Math.floor(Math.random() * MAX_KEN_COUNT) + 1
      const soundPath = `/sound/ken${randomKen}.mp3`
      const battleSound = new Audio(getPath(soundPath))
      battleSound.volume = 0.5
      battleSound.play()
    } else {
      // 通常時はクリック音再生
      const clickSound = new Audio(getPath('/sound/click.mp3'))
      clickSound.volume = 0.5
      clickSound.play()
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
