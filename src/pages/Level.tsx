import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'
import SoundButton from '../components/SoundButton'
import './Level.css'

const Level = () => {
  const [type, setType] = useState(
    localStorage.getItem('gameType') || 'addition'
  )
  const [difficulty, setDifficulty] = useState(
    localStorage.getItem('gameDifficulty') || 'easy'
  )
  const navigate = useNavigate()

  useEffect(() => {
    const savedType = localStorage.getItem('gameType')
    const savedDifficulty = localStorage.getItem('gameDifficulty')
    if (savedType) setType(savedType)
    if (savedDifficulty) setDifficulty(savedDifficulty)
  }, [])

  useEffect(() => {
    const bgm = new Audio(getPath('/sound/bgm1.mp3'))
    bgm.volume = 0.1
    bgm.loop = true
    bgm.play()

    return () => {
      bgm.pause()
    }
  }, [])

  const handleStart = () => {
    localStorage.setItem('gameType', type)
    localStorage.setItem('gameDifficulty', difficulty)
    navigate('/taisei2/battle')
  }

  return (
    <div className="level-container">
      <div className="setting-section">
        <h2>種別</h2>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="addition">たし算</option>
          <option value="subtraction">ひき算</option>
          <option value="multiplication">かけ算</option>
          <option value="division">わり算</option>
        </select>
      </div>

      <div className="setting-section">
        <h2>難易度</h2>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">かんたん（1桁と1桁）</option>
          <option value="medium">少し難しい（1桁と2桁）</option>
          <option value="normal">ふつう（2桁と2桁）</option>
          <option value="hard">むずかしい（2桁と3桁）</option>
          <option value="very-hard">とてもむずかしい（3桁と3桁）</option>
          <option value="extreme">最強（4桁と4桁）</option>
        </select>
      </div>

      <SoundButton className="start-button" onClick={handleStart}>
        スタート
      </SoundButton>
    </div>
  )
}

export default Level
