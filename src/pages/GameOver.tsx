import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'
import './GameOver.css'

const GameOver = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // BGM再生
    const bgm = new Audio(getPath('/sound/maou_bgm_fantasy03.mp3'))
    bgm.loop = true
    bgm.play()

    return () => {
      bgm.pause()
    }
  }, [])

  return (
    <div className="game-over-container">
      <h1 className="game-over-heading">ゲームオーバー</h1>

      <div className="game-over-buttons">
        <button
          onClick={() => navigate('/taisei2/')}
          className="game-over-button game-over-button--primary"
        >
          タイトルに戻る
        </button>

        <button
          onClick={() => navigate('/taisei2/battle')}
          className="game-over-button game-over-button--secondary"
        >
          リトライ
        </button>
      </div>
    </div>
  )
}

export default GameOver
