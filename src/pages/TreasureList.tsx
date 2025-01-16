import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'
import './TreasureList.css'

const TreasureList = () => {
  const [treasures, setTreasures] = useState<string[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    // ローカルストレージから宝物データを取得し、画像ファイル名に変換
    const savedTreasures = JSON.parse(localStorage.getItem('treasures') || '[]')
    const formattedTreasures = savedTreasures.map((t: number) =>
      `takara${t}.png`.replace('宝物', '')
    )
    setTreasures(formattedTreasures)

    // BGM再生
    const bgm = new Audio(getPath('/sound/bgm1.mp3'))
    bgm.volume = 0.1
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
              src={getPath(`/image/${treasure}`)}
              alt={treasure}
              className="treasure-image"
            />
            <h3>宝物 {treasure.replace('takara', '').replace('.png', '')}</h3>
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
