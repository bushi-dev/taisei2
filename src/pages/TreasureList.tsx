import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'

const TreasureList = () => {
  const [treasures, setTreasures] = useState<string[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    // ローカルストレージから宝物データを取得
    const savedTreasures = JSON.parse(localStorage.getItem('treasures') || '[]')
    setTreasures(savedTreasures)

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
        minHeight: '100vh',
        padding: '2rem',
        color: 'white',
        textShadow: '2px 2px 4px black',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>宝物一覧</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {treasures.map((treasure, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              textAlign: 'center',
            }}
            onClick={() => navigate(`/taisei2/treasure/${index}`)}
          >
            <img
              src={getPath('/image/treasure.png')}
              alt={treasure}
              style={{ width: '100px', marginBottom: '0.5rem' }}
            />
            <h3>{treasure}</h3>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/taisei2/')}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
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
    </div>
  )
}

export default TreasureList
