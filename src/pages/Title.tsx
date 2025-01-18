import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'
import SoundButton from '../components/SoundButton'
import './Title.css'

const Title = () => {
  const navigate = useNavigate()

  useEffect(() => {
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
    <div className="title-screen">
      <h1 className="title-screen__heading">たいせい忍者</h1>
      <img
        src={getPath('/image/nin.png')}
        alt="ninja"
        className="title-screen__ninja"
      />

      <SoundButton
        className="title-screen__button start"
        onClick={() => navigate('/taisei2/level')}
      >
        冒険を始める
      </SoundButton>

      <SoundButton
        className="title-screen__button treasure"
        onClick={() => navigate('/taisei2/treasure')}
      >
        秘宝の記録
      </SoundButton>
    </div>
  )
}

export default Title
