import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'

const Clear = () => {
  const navigate = useNavigate()
  const [treasure, setTreasure] = useState('')

  useEffect(() => {
    // ランダムな宝物を選択
    const treasures = ['宝物1', '宝物2', '宝物3', '宝物4', '宝物5']
    const randomTreasure =
      treasures[Math.floor(Math.random() * treasures.length)]
    setTreasure(randomTreasure)

    // ローカルストレージに保存
    const savedTreasures = JSON.parse(localStorage.getItem('treasures') || '[]')
    savedTreasures.push(randomTreasure)
    localStorage.setItem('treasures', JSON.stringify(savedTreasures))

    // BGM再生
    const bgm = new Audio(getPath('/sound/maou_bgm_fantasy15.mp3'))
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
      <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>
        ステージクリア！
      </h1>

      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
        獲得した宝物: {treasure}
      </h2>

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
          次のステージへ
        </button>
      </div>
    </div>
  )
}

export default Clear
