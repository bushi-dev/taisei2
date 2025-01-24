import { useState, useEffect } from 'react'
import { useSoundManager } from '../components/SoundManager'
import { useNavigate } from 'react-router-dom'
import { getSavedTreasures, MAX_TREASURES } from '../util/util'
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

  const { playBgm, playEffect } = useSoundManager()

  useEffect(() => {
    playBgm('/sound/bgm1.mp3', 0.1)
  }, [playBgm])

  const handleStart = () => {
    localStorage.setItem('gameType', type)
    localStorage.setItem('gameDifficulty', difficulty)
    playEffect('/sound/battleStart.mp3', 0.1)
    setTimeout(() => {
      navigate('/taisei2/battle')
    }, 1000)
  }

  return (
    <div className="level-container">
      <div className="setting-section">
        <div className="type-buttons">
          <SoundButton
            className={`type-button addition ${
              type === 'addition' ? 'active' : ''
            }`}
            onClick={() => setType('addition')}
          >
            ＋<div className="progress">{progress.addition}%</div>
          </SoundButton>
          <SoundButton
            className={`type-button subtraction ${
              type === 'subtraction' ? 'active' : ''
            }`}
            onClick={() => setType('subtraction')}
          >
            −<div className="progress">{progress.subtraction}%</div>
          </SoundButton>
          <SoundButton
            className={`type-button multiplication ${
              type === 'multiplication' ? 'active' : ''
            }`}
            onClick={() => setType('multiplication')}
          >
            ×<div className="progress">{progress.multiplication}%</div>
          </SoundButton>
          <SoundButton
            className={`type-button division ${
              type === 'division' ? 'active' : ''
            }`}
            onClick={() => setType('division')}
          >
            ÷<div className="progress">{progress.division}%</div>
          </SoundButton>
        </div>
      </div>

      <div className="difficulty-sections-container">
        <div className="setting-section difficulty-section">
          <h2 style={{ marginTop: '0', marginBottom: '25px' }}>むずかしさ</h2>
          <div className="difficulty-stars">
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value)
                playEffect('/sound/click.mp3', 0.5)
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
        <div className="setting-section difficulty-section">
          <h2 style={{ margin: '0' }}>おたから</h2>
          <div className="treasure-count">
            {getSavedTreasures().length}/{MAX_TREASURES}
          </div>
        </div>
      </div>

      <SoundButton className="start-button" onClick={handleStart}>
        スタート
      </SoundButton>
    </div>
  )
}

export default Level
