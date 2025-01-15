import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'

const TitleScreen = () => {
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
      className="title-screen"
      style={{
        backgroundImage: `url(${getPath('/image/bg.webp')})`,
        backgroundSize: 'cover',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '4rem',
          color: 'white',
          textShadow: '2px 2px 4px black',
          marginBottom: '2rem',
        }}
      >
        TAISEI忍者
      </h1>

      <button
        onClick={() => navigate('/taisei2/battle')}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.5rem',
          backgroundColor: '#ff5722',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        スタート
      </button>

      <button
        onClick={() => navigate('/taisei2/treasure')}
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
        宝物一覧
      </button>
    </div>
  )
}

export default TitleScreen
