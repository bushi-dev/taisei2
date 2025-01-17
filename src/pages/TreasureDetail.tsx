import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPath } from '../util/util'
import SoundButton from '../components/SoundButton'
import './TreasureDetail.css'

const TreasureDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [treasure, setTreasure] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // ローカルストレージから宝物データを取得
    const savedTreasures = JSON.parse(localStorage.getItem('treasures') || '[]')
    if (id && savedTreasures[Number(id) - 1]) {
      setTreasure(savedTreasures[Number(id) - 1])
    } else {
      navigate('/taisei2/treasure')
    }

    // BGM再生
    const bgm = new Audio(getPath('/sound/bgm1.mp3'))
    bgm.volume = 0.1
    bgm.loop = true
    bgm.play()

    return () => {
      bgm.pause()
    }
  }, [id, navigate])

  if (!treasure) return null

  return (
    <div className="treasure-detail-container">
      <h1 className="treasure-detail-heading">宝物{treasure} の詳細</h1>

      <div className="treasure-content">
        <img
          src={getPath(`/image/takara${id}.png`)}
          alt={`宝物${id}`}
          className="treasure-detail-image"
        />
      </div>

      <SoundButton
        onClick={() => navigate('/taisei2/treasure')}
        className="back-button"
      >
        一覧に戻る
      </SoundButton>
    </div>
  )
}

export default TreasureDetail
