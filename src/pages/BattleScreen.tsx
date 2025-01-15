import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPath } from '../util/util'
import { generateProblem } from '../util/problemGenerator'

const BattleScreen = () => {
  const [problem, setProblem] = useState({
    question: '',
    answer: 0,
    options: [0, 0, 0],
  })
  const [life, setLife] = useState(3)
  const [enemyCount, setEnemyCount] = useState(1)
  const navigate = useNavigate()

  const handleAnswer = (selected: number) => {
    if (selected === problem.answer) {
      new Audio(getPath('/sound/seikai.mp3')).play()
      setEnemyCount((prev) => {
        if (prev % 10 === 0) {
          new Audio(getPath('/sound/maou_bgm_fantasy15.mp3')).play()
        }
        return prev + 1
      })

      if (enemyCount + 1 >= 50) {
        navigate('/taisei2/clear')
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
    setProblem(generateProblem(enemyCount + 1))
  }

  useEffect(() => {
    setProblem(generateProblem(enemyCount))
    const bgm = new Audio(getPath('/sound/maou_bgm_fantasy08.mp3'))
    bgm.volume = 0.1
    bgm.loop = true
    bgm.play()

    return () => {
      bgm.pause()
    }
  }, [])

  return (
    <div
      style={{
        backgroundImage: `url(${getPath('/image/bg.webp')})`,
        backgroundSize: 'cover',
        height: '100vh',
        padding: '2rem',
        color: 'white',
        textShadow: '2px 2px 4px black',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}
      >
        <h2>敵: {enemyCount}体目</h2>
        <h2>ライフ: {'❤️'.repeat(life)}</h2>
      </div>

      {enemyCount % 10 === 0 ? (
        <img
          src={getPath(`/image/boss${Math.floor(Math.random() * 4) + 1}.png`)}
          alt="ボス"
          style={{ width: '200px', margin: '0 auto', display: 'block' }}
        />
      ) : (
        <img
          src={getPath(`/image/teki${Math.random() < 0.5 ? 1 : 2}.gif`)}
          alt={`敵${Math.random() < 0.5 ? 1 : 2}`}
          style={{ width: '100px', display: 'block' }}
        />
      )}

      <div
        style={{
          marginTop: '2rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '3rem' }}>{problem.question}</h1>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          {problem.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.5rem',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
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
