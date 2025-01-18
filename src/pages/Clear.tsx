import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath, saveTreasure } from '../util/util'
import SoundButton from '../components/SoundButton'
import './Clear.css'

const Clear = () => {
  const navigate = useNavigate()
  const [treasure, setTreasure] = useState('')

  useEffect(() => {
    // ランダムな宝物を選択 (1〜5)
    const randomTreasure = Math.floor(Math.random() * 5) + 1
    setTreasure(`takara${randomTreasure}.png`)

    // ローカルストレージに保存
    saveTreasure(randomTreasure)

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
        <img
          src={getPath(`/image/${treasure}`)}
          alt="獲得した宝物"
          className="clear-treasure-image"
        />
        <div className="clear-get-text">GET!</div>
      </div>

      <div className="clear-buttons">
        <SoundButton
          onClick={() => navigate('/taisei2/')}
          className="clear-button clear-button--primary"
        >
          タイトル
        </SoundButton>

        <SoundButton
          onClick={() => navigate('/taisei2/battle')}
          className="clear-button clear-button--secondary"
        >
          次へ
        </SoundButton>
      </div>
    </div>
  )
}

export default Clear
