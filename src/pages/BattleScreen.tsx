import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'
import { generateProblem } from '../util/problemGenerator'
import SoundButton from '../components/SoundButton'
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
  const [bossImage, setBossImage] = useState(1)

  // クリア時にボス画像をリセット
  useEffect(() => {
    if (enemyCount % 5 === 4 && bossLife <= 0) {
      setBossImage(1)
    }
  }, [bossLife, enemyCount])
  const navigate = useNavigate()

  // ローカルストレージから設定を取得
  const gameType = localStorage.getItem('gameType') || 'addition'
  const gameDifficulty = localStorage.getItem('gameDifficulty') || 'easy'

  const handleAnswer = (selected: number) => {
    if (selected === problem.answer) {
      setTimeout(() => {
        new Audio(getPath('/sound/seikai.mp3')).play()

        if (enemyCount % 5 === 4) {
          // ボス戦
          if (bossImage === 0) {
            setBossImage(Math.floor(Math.random() * 4) + 1)
          }
          setBossLife((prev) => {
            if (prev - 1 <= 0) {
              setTimeout(() => {
                const clearSound = new Audio(getPath('/sound/clear.mp3'))
                clearSound.volume = 0.3
                clearSound.play()
                navigate('/taisei2/clear')
              }, 500)
            }
            return prev - 1
          })
        } else {
          setEnemyCount((prev) => prev + 1)
        }
      }, 1000)
    } else {
      setTimeout(() => {
        new Audio(getPath('/sound/sippai.mp3')).play()
        setLife((prev) => {
          if (prev - 1 <= 0) {
            navigate('/taisei2/gameover')
          }
          return prev - 1
        })
      }, 1000)
    }
    setTimeout(() => {
      setProblem(generateProblem(gameType, gameDifficulty))
    }, 1000)
  }

  // BGM再生
  useEffect(() => {
    const bgm = new Audio(getPath('/sound/bgm3.mp3'))
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
            src={getPath(`/image/boss${bossImage}.png`)}
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
            <SoundButton
              key={i}
              onClick={() => handleAnswer(option)}
              className="battle-button"
              isBattleMode={true}
            >
              {option}
            </SoundButton>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BattleScreen
