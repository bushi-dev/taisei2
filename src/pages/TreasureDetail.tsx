import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPath } from '../util/util'
import SoundButton from '../components/SoundButton'
import './TreasureDetail.css'

const TreasureDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [treasure, setTreasure] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // ローカルストレージから宝物データを取得
    const savedTreasures = JSON.parse(localStorage.getItem('treasures') || '[]')
    if (id && savedTreasures[Number(id)]) {
      setTreasure(savedTreasures[Number(id)])
    } else {
      navigate('/treasure')
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
      <h1 className="treasure-detail-heading">{treasure} の詳細</h1>

      <div className="treasure-content">
        <img
          src={getPath(`/image/takara${treasure}.png`)}
          alt={treasure}
          className="treasure-detail-image"
        />

        <div className="treasure-description">
          <p>
            これは{treasure}
            の詳細説明です。忍者たちが長年守り続けてきた貴重な宝物です。
            特別な力を持っていると言われています。
          </p>
        </div>
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
