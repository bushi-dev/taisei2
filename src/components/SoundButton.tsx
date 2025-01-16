import { getPath } from '../util/util'

interface SoundButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const SoundButton = ({ children, onClick, className }: SoundButtonProps) => {
  const handleClick = () => {
    // クリック音再生
    const clickSound = new Audio(getPath('/sound/click.mp3'))
    clickSound.volume = 0.5
    clickSound.play()

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
