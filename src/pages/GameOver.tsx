import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'
import SoundButton from '../components/SoundButton'
import './GameOver.css'

const GameOver = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // BGM再生
    const bgm = new Audio(getPath('/sound/bgm1.mp3'))
    bgm.volume = 0.1
    bgm.loop = true
    bgm.play().catch(() => {})

    return () => {
      bgm.pause()
    }
  }, [])

  return (
    <div className="game-over-container">
      <h1 className="game-over-heading">ゲームオーバー</h1>

      <div className="game-over-buttons">
        <SoundButton
          onClick={() => navigate('/taisei2/')}
          className="game-over-button game-over-button--primary"
        >
          タイトル
        </SoundButton>

        <SoundButton
          onClick={() => navigate('/taisei2/battle')}
          className="game-over-button game-over-button--secondary"
        >
          リトライ
        </SoundButton>
      </div>
    </div>
  )
}

export default GameOver
