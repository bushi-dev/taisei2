import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateProblem } from '../../util/problemGenerator'
import { useSoundManager } from '../SoundManager'
import { saveTreasure } from '../../util/util'

export const BOSS_COUNT = 4

export const useBattleLogic = () => {
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
  const [backgroundImage, setBackgroundImage] = useState(
    '/taisei2/image/bg1.webp'
  )
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)

  const navigate = useNavigate()
  const { playBgm, playEffect } = useSoundManager()

  // ローカルストレージから設定を取得
  const gameType = localStorage.getItem('gameType') || 'addition'
  const gameDifficulty = localStorage.getItem('gameDifficulty') || 'easy'

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setResult(null), 1000)
      return () => clearTimeout(timer)
    }
  }, [result])

  const handleAnswer = (selected: number) => {
    console.log(selected)
    if (selected === problem.answer) {
      setResult('correct')
      // 敵をフェードアウト
      const enemyElement = document.querySelector('.battle-enemy')
      if (enemyElement) {
        enemyElement.classList.add('fade-out')
      }
      setTimeout(() => {
        playEffect('/sound/seikai.mp3')
        // 1秒後に別の敵に切り替え
        setEnemyImage(Math.floor(Math.random() * 8) + 1)

        if (enemyCount % 5 === BOSS_COUNT) {
          // ボス戦
          setBossLife((prev) => {
            const newLife = prev - 1
            if (newLife == 0) {
              console.log('クリア処理')
              //クリア時の処理

              // battle-questionを非表示にする
              const questionElement = document.querySelector('.battle-question')
              if (questionElement) {
                questionElement.classList.add('fade-out')
              }
              // 達成度を加算
              const progressKey = `${gameType}_progress`
              const currentProgress = parseInt(
                localStorage.getItem(progressKey) || '0'
              )
              let progressToAdd = 1
              if (gameDifficulty === 'medium') {
                progressToAdd = 3
              } else if (gameDifficulty !== 'easy') {
                progressToAdd = 5
              }
              //進捗更新
              const newProgress = Math.min(currentProgress + progressToAdd, 100)
              localStorage.setItem(progressKey, newProgress.toString())
              //クリア遷移
              setBackgroundImage('bg1.webp')
              playEffect('/sound/clear.mp3')
              const treasureNumber = Math.floor(Math.random() * 100) + 1
              saveTreasure(treasureNumber)
              navigate('/taisei2/movie')
              return 0
            }
            return newLife
          })
        } else {
          setEnemyCount((prev) => prev + 1)
        }
      }, 1000)
    } else {
      //失敗時
      setResult('wrong')
      setTimeout(() => {
        playEffect('/sound/sippai.mp3')
        setLife((prev) => {
          if (prev - 1 <= 0) {
            navigate('/taisei2/gameover')
          }
          return prev - 1
        })
      }, 2000)
    }
    setTimeout(() => {
      setProblem(
        generateProblem(gameType, gameDifficulty, enemyCount % 5 === BOSS_COUNT)
      )
    }, 1000)
  }

  // BGM再生
  useEffect(() => {
    playBgm(
      enemyCount % 5 === BOSS_COUNT ? '/sound/bgm4.mp3' : '/sound/bgm3.mp3',
      0.1
    )
  }, [playBgm, enemyCount])

  // 問題生成
  useEffect(() => {
    setProblem(
      generateProblem(gameType, gameDifficulty, enemyCount % 5 === BOSS_COUNT)
    )
    // 戦闘開始時にランダムな背景を選択
    if (enemyCount === 1) {
      const randomBg = Math.floor(Math.random() * 5) + 2 // bg2.webpからbg7.webp
      setBackgroundImage(`/taisei2/image/bg${randomBg}.webp`)
    }
  }, [enemyCount, gameType, gameDifficulty])

  // 敵画像が変更された時に表示
  useEffect(() => {
    const enemyElement = document.querySelector('.battle-enemy')
    if (enemyElement) {
      enemyElement.classList.remove('fade-out')
    }
  }, [enemyImage])

  return {
    problem,
    life,
    enemyCount,
    bossLife,
    bossImage,
    enemyImage,
    backgroundImage,
    result,
    handleAnswer,
  }
}
