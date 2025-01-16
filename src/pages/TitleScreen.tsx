import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'
import './TitleScreen.css'

const TitleScreen = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // BGM再生
    const bgm = new Audio(getPath('/sound/maou_bgm_fantasy03.mp3'))
    bgm.loop = true
    bgm.play()

    return () => {
      bgm.pause()
    }
  }, [])

  return (
    <div className="title-screen">
      <h1 className="title-screen__heading">TAISEI忍者</h1>

      <button
        className="title-screen__button start"
        onClick={() => navigate('/taisei2/level')}
      >
        スタート
      </button>

      <button
        className="title-screen__button treasure"
        onClick={() => navigate('/taisei2/treasure')}
      >
        宝物一覧
      </button>
    </div>
  )
}

export default TitleScreen
