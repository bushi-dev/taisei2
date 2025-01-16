import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'
import './Clear.css'

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
    // 既に同じ宝物がなければ追加
    if (!savedTreasures.includes(randomTreasure)) {
      savedTreasures.push(randomTreasure)
      localStorage.setItem('treasures', JSON.stringify(savedTreasures))
    }

    // BGM再生
    const bgm = new Audio(getPath('/sound/maou_bgm_fantasy15.mp3'))
    bgm.loop = true
    bgm.play()

    return () => {
      bgm.pause()
    }
  }, [])

  return (
    <div className="clear-container">
      <h1 className="clear-heading">ステージクリア！</h1>

      <h2 className="clear-subheading">獲得した宝物: {treasure}</h2>

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
