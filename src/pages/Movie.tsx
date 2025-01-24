import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath, getTreasureLevel, getTreasureRarity } from '../util/util'
import { useSoundManager } from '../components/SoundManager'
import './Movie.css'

const Movie = () => {
  const navigate = useNavigate()

  const { playEffect } = useSoundManager()

  useEffect(() => {
    playEffect('/sound/clear.mp3')

    const timer = setTimeout(() => {
      navigate('/taisei2/clear')
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate, playEffect])

  const treasureNumber = parseInt(
    localStorage.getItem('lastTreasureNumber') || '1'
  )
  const rare = getTreasureRarity(treasureNumber)

  return (
    <div className="movie-container">
      <video
        src={getPath(`/image/get${getTreasureLevel(rare)}.mp4`)}
        autoPlay
        muted
        className="movie-video"
      />
    </div>
  )
}

export default Movie
