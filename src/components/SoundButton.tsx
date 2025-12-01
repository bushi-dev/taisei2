import { useRef } from 'react';
import { useSound } from '../context/SoundContext';

const MAX_KEN_COUNT = 5;

interface SoundButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isBattleMode?: boolean;
  id?: string;
  disabled?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const SoundButton = ({
  children,
  onClick,
  className,
  isBattleMode,
  disabled,
  onMouseEnter,
  onMouseLeave,
}: SoundButtonProps) => {
  const lastClickTime = useRef(0);
  const { playEffect, tryUnlock } = useSound();

  const handleClick = async () => {
    const now = Date.now();
    if (now - lastClickTime.current < 500) {
      return;
    }
    lastClickTime.current = now;

    // まず音声をアンロック（Chromeのオートプレイポリシー対策）
    await tryUnlock();

    if (isBattleMode) {
      const randomKen = Math.floor(Math.random() * MAX_KEN_COUNT) + 1;
      playEffect(`/sound/ken${randomKen}.mp3`);
    } else {
      // 通常時はクリック音再生
      playEffect('/sound/click.mp3');
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`sound-button ${className}`}
      onClick={handleClick}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </button>
  );
};

export default SoundButton;
