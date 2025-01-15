import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPath } from '../util/util'

const TreasureDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [treasure, setTreasure] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // ローカルストレージから宝物データを取得
    const savedTreasures = JSON.parse(localStorage.getItem('treasures') || '[]')
    if (id && savedTreasures[Number(id)]) {
      setTreasure(savedTreasures[Number(id)])
    } else {
      navigate('/treasure')
    }

    // BGM再生
    const bgm = new Audio(getPath('/sound/maou_bgm_fantasy03.mp3'))
    bgm.loop = true
    bgm.play()

    return () => {
      bgm.pause()
    }
  }, [id, navigate])

  if (!treasure) return null

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
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
        {treasure} の詳細
      </h1>

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          marginBottom: '2rem',
        }}
      >
        <img
          src={getPath('/image/treasure.png')}
          alt={treasure}
          style={{ width: '200px', height: '200px', objectFit: 'cover' }}
        />

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>説明</h2>
          <p style={{ fontSize: '1.2rem' }}>
            これは{treasure}
            の詳細説明です。忍者たちが長年守り続けてきた貴重な宝物です。
            特別な力を持っていると言われています。
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate('/taisei2/treasure')}
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
        一覧に戻る
      </button>
    </div>
  )
}

export default TreasureDetail
