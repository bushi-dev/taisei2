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
  const progress = {
    addition: localStorage.getItem('addition_progress') || '0',
    subtraction: localStorage.getItem('subtraction_progress') || '0',
    multiplication: localStorage.getItem('multiplication_progress') || '0',
    division: localStorage.getItem('division_progress') || '0',
  }
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
    bgm.play().catch(() => {})

    return () => {
      bgm.pause()
    }
  }, [])

  const handleStart = () => {
    localStorage.setItem('gameType', type)
    localStorage.setItem('gameDifficulty', difficulty)
    const clearSound = new Audio(getPath('/sound/battleStart.mp3'))
    clearSound.volume = 0.1
    clearSound.play()
    setTimeout(() => {
      navigate('/taisei2/battle')
    }, 1000)
  }

  return (
    <div className="level-container">
      <div className="setting-section">
        <div className="type-buttons">
          <button
            id="addition"
            className={`type-button ${type === 'addition' ? 'active' : ''}`}
            onClick={() => setType('addition')}
          >
            たし算
            <div className="progress">{progress.addition}%</div>
          </button>
          <button
            id="subtraction"
            className={`type-button ${type === 'subtraction' ? 'active' : ''}`}
            onClick={() => setType('subtraction')}
          >
            ひき算
            <div className="progress">{progress.subtraction}%</div>
          </button>
          <button
            id="multiplication"
            className={`type-button ${
              type === 'multiplication' ? 'active' : ''
            }`}
            onClick={() => setType('multiplication')}
          >
            かけ算
            <div className="progress">{progress.multiplication}%</div>
          </button>
          <button
            id="division"
            className={`type-button ${type === 'division' ? 'active' : ''}`}
            onClick={() => setType('division')}
          >
            わり算
            <div className="progress">{progress.division}%</div>
          </button>
        </div>
      </div>

      <div className="setting-section difficulty-section">
        <h2>むずかしさ</h2>
        <div className="difficulty-stars">
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value)
              new Audio('/sound/click.mp3').play()
            }}
            className="difficulty-select"
          >
            <option value="easy">⭐</option>
            <option value="medium">⭐⭐</option>
            <option value="normal">⭐⭐⭐</option>
            <option value="hard">⭐⭐⭐⭐</option>
            <option value="very-hard">⭐⭐⭐⭐⭐</option>
            <option value="extreme">⭐⭐⭐⭐⭐⭐</option>
          </select>
        </div>
      </div>

      <SoundButton className="start-button" onClick={handleStart}>
        スタート
      </SoundButton>
    </div>
  )
}

export default Level
