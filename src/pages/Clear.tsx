import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'
import SoundButton from '../components/SoundButton'
import './Clear.css'

const Clear = () => {
  const navigate = useNavigate()
  const [treasure, setTreasure] = useState('')

  useEffect(() => {
    // ローカルストレージから宝番号を取得 (1〜100)
    const treasureNumber = parseInt(
      localStorage.getItem('lastTreasureNumber') || '1'
    )
    setTreasure(`takara${treasureNumber}.png`)

    // BGM再生
    const bgm = new Audio(getPath('/sound/bgm1.mp3'))
    bgm.volume = 0.1
    bgm.loop = true
    bgm.play().catch(() => {})

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
