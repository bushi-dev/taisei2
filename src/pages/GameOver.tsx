import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'

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
    <div
      style={{
        backgroundImage: `url(${getPath('/image/bg.webp')})`,
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textShadow: '2px 2px 4px black',
      }}
    >
      <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>ゲームオーバー</h1>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
        }}
      >
        <button
          onClick={() => navigate('/taisei2/')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.5rem',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          タイトルに戻る
        </button>

        <button
          onClick={() => navigate('/taisei2/battle')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.5rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          リトライ
        </button>
      </div>
    </div>
  )
}

export default GameOver
