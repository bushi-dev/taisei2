import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'
import './TreasureList.css'

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
    <div className="treasure-list-container">
      <h1 className="treasure-list-heading">宝物一覧</h1>

      <div className="treasure-grid">
        {treasures.map((treasure, index) => (
          <div
            key={index}
            className="treasure-item"
            onClick={() => navigate(`/taisei2/treasure/${index}`)}
          >
            <img
              src={getPath('/image/treasure.png')}
              alt={treasure}
              className="treasure-image"
            />
            <h3>{treasure}</h3>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/taisei2/')} className="back-button">
        タイトルに戻る
      </button>
    </div>
  )
}

export default TreasureList
