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
  const [bossImage] = useState(Math.floor(Math.random() * 4) + 1)
  const [enemyImage, setEnemyImage] = useState(
    Math.floor(Math.random() * 8) + 1
  )
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setResult(null), 1000)
      return () => clearTimeout(timer)
    }
  }, [result])

  const navigate = useNavigate()

  // ローカルストレージから設定を取得
  const gameType = localStorage.getItem('gameType') || 'addition'
  const gameDifficulty = localStorage.getItem('gameDifficulty') || 'easy'

  const handleAnswer = (selected: number) => {
    if (selected === problem.answer) {
      setResult('correct')

      setTimeout(() => {
        new Audio(getPath('/sound/seikai.mp3')).play()
        // 1秒後に別の敵に切り替え
        setEnemyImage(Math.floor(Math.random() * 8) + 1)

        if (enemyCount % 5 === 4) {
          // ボス戦
          // ボス戦中は画像を変更しない
          setBossLife((prev) => {
            const newLife = prev - 1
            if (newLife <= 0) {
              //クリア時の処理
              setTimeout(() => {
                const clearSound = new Audio(getPath('/sound/clear.mp3'))
                clearSound.volume = 0.3
                clearSound.play()
                setTimeout(() => {
                  navigate('/taisei2/clear')
                  return // クリア時は問題更新しない
                }, 2000)
              }, 500)
              return 0
            }
            return newLife
          })
        } else {
          setEnemyCount((prev) => prev + 1)
        }
      }, 1000)
    } else {
      setResult('wrong')
      setTimeout(() => {
        new Audio(getPath('/sound/sippai.mp3')).play()
        setLife((prev) => {
          if (prev - 1 <= 0) {
            navigate('/taisei2/gameover')
          }
          return prev - 1
        })
      }, 2000)
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
          <h2>HP {'❤️'.repeat(life)}</h2>
        </div>
      </div>

      {enemyCount % 5 === 4 ? (
        <>
          <img
            src={getPath(`/image/boss${bossImage}.png`)}
            alt="ボス"
            className="battle-boss"
          />
          <div className="battle-header">
            <h2>ボス {'💙'.repeat(bossLife)}</h2>
          </div>
        </>
      ) : (
        <img
          src={getPath(`/image/teki${enemyImage}.gif`)}
          alt={`敵${enemyImage}`}
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

        {result && (
          <div
            className="result-marker"
            style={{ color: result === 'correct' ? 'red' : 'blue' }}
          >
            {result === 'correct' ? '○' : '×'}
          </div>
        )}
      </div>
    </div>
  )
}

export default BattleScreen
