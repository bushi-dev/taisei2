import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'
import './Clear.css'

const Clear = () => {
  const navigate = useNavigate()
  const [treasure, setTreasure] = useState('')

  useEffect(() => {
    // ランダムな宝物を選択 (1〜5)
    const randomTreasure = Math.floor(Math.random() * 5) + 1
    setTreasure(`takara${randomTreasure}.png`)

    // ローカルストレージに保存
    const savedTreasures = JSON.parse(localStorage.getItem('treasures') || '[]')
    // 既に同じ宝物がなければ追加
    if (!savedTreasures.includes(randomTreasure)) {
      savedTreasures.push(randomTreasure)
      localStorage.setItem('treasures', JSON.stringify(savedTreasures))
    }

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
    <div className="clear-container">
      <h3 className="clear-heading">ステージクリア！</h3>

      <div className="clear-subheading">
        <h2>獲得した宝物:</h2>
        <img
          src={getPath(`/image/${treasure}`)}
          alt="獲得した宝物"
          className="clear-treasure-image"
        />
      </div>

      <div className="clear-buttons">
        <button
          onClick={() => navigate('/taisei2/')}
          className="clear-button clear-button--primary"
        >
          タイトルに戻る
        </button>

        <button
          onClick={() => navigate('/taisei2/battle')}
          className="clear-button clear-button--secondary"
        >
          次のステージへ
        </button>
      </div>
    </div>
  )
}

export default Clear
