import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'
import { generateProblem } from '../util/problemGenerator'
import './BattleScreen.css'

const BattleScreen = () => {
  const [problem, setProblem] = useState({
    question: '',
    answer: 0,
    options: [0, 0, 0],
  })
  const [life, setLife] = useState(3)
  const [enemyCount, setEnemyCount] = useState(1)
  const [bossLife, setBossLife] = useState(5)
  const navigate = useNavigate()

  // ローカルストレージから設定を取得
  const gameType = localStorage.getItem('gameType') || 'addition'
  const gameDifficulty = localStorage.getItem('gameDifficulty') || 'easy'

  const handleAnswer = (selected: number) => {
    if (selected === problem.answer) {
      new Audio(getPath('/sound/seikai.mp3')).play()

      if (enemyCount % 5 === 4) {
        // ボス戦
        setBossLife((prev) => {
          if (prev - 1 <= 0) {
            navigate('/taisei2/clear')
          }
          return prev - 1
        })
      } else {
        setEnemyCount((prev) => prev + 1)
      }
    } else {
      new Audio(getPath('/sound/sippai.mp3')).play()
      setLife((prev) => {
        if (prev - 1 <= 0) {
          navigate('/taisei2/gameover')
        }
        return prev - 1
      })
    }
    setProblem(generateProblem(gameType, gameDifficulty))
  }

  // BGM再生
  useEffect(() => {
    const bgm = new Audio(getPath('/sound/bgm1.mp3'))
    bgm.volume = 0.1
    bgm.loop = true
    bgm.play()

    return () => {
      bgm.pause()
    }
  }, [])

  // 問題生成
  useEffect(() => {
    setProblem(generateProblem(gameType, gameDifficulty))
  }, [enemyCount, gameType, gameDifficulty])

  return (
    <div className="battle-container">
      <div className="battle-header">
        {enemyCount % 5 !== 4 && <h2>敵: {enemyCount}体目</h2>}
        <div>
          <h2>ライフ: {'❤️'.repeat(life)}</h2>
          {enemyCount % 5 === 4 && (
            <h2>ボスのライフ: {'💙'.repeat(bossLife)}</h2>
          )}
        </div>
      </div>

      {enemyCount % 5 === 4 ? (
        <>
          <img
            src={getPath(
              `/image/boss${(Math.floor(enemyCount / 5) % 4) + 1}.png`
            )}
            alt="ボス"
            className="battle-boss"
          />
        </>
      ) : (
        <img
          src={getPath(`/image/teki${Math.random() < 0.5 ? 1 : 2}.gif`)}
          alt={`敵${Math.random() < 0.5 ? 1 : 2}`}
          className="battle-enemy"
        />
      )}

      <div className="battle-question">
        <div>{problem.question}</div>

        <div className="battle-options">
          {problem.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              className="battle-button"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BattleScreen
