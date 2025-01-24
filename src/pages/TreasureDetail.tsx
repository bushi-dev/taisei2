import { useEffect, useState } from 'react'
import { useSoundManager } from '../components/SoundManager'
import { useNavigate, useParams } from 'react-router-dom'
import SoundButton from '../components/SoundButton'
import './TreasureDetail.css'
import { getPath } from '../util/util'

const TreasureDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [treasure, setTreasure] = useState<number | null>(null)
  const navigate = useNavigate()

  const { playBgm } = useSoundManager()

  useEffect(() => {
    // ローカルストレージから宝物データを取得
    const savedTreasures = JSON.parse(localStorage.getItem('treasures') || '[]')
    if (id && savedTreasures[Number(id) - 1]) {
      setTreasure(savedTreasures[Number(id) - 1])
    } else {
      navigate('/taisei2/treasure')
    }

    // BGM再生
    playBgm('/sound/bgm1.mp3', 0.1)
  }, [id, navigate, playBgm])

  if (!treasure) return null

  return (
    <div className="treasure-detail-container">
      <div className="treasure-content">
        <img
          src={getPath(`/image/takara${id}.png`)}
          alt={`宝物${id}`}
          className="treasure-detail-image"
        />
        <SoundButton
          onClick={() => navigate('/taisei2/treasure')}
          className="back-button"
        >
          一覧に戻る
        </SoundButton>
      </div>
    </div>
  )
}

export default TreasureDetail
