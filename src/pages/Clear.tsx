import { useEffect, useState } from 'react'
import { useSoundManager } from '../components/SoundManager'
import { useNavigate } from 'react-router-dom'
import SoundButton from '../components/SoundButton'
import './Clear.css'

const Clear = () => {
  const navigate = useNavigate()
  const [treasure, setTreasure] = useState('')

  const { playBgm } = useSoundManager()

  useEffect(() => {
    // ローカルストレージから宝番号を取得 (1〜100)
    const treasureNumber = parseInt(
      localStorage.getItem('lastTreasureNumber') || '1'
    )
    setTreasure(`takara${treasureNumber}.png`)

    // BGM再生
    playBgm('/sound/bgm1.mp3', 0.1)
  }, [playBgm])

  return (
    <div className="clear-container">
      <h3 className="clear-heading">ステージクリア！</h3>

      <div className="clear-subheading">
        <img
          src={`/image/${treasure}`}
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
