import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateProblem, Problem, getBossCount, isBossBattle } from '../../util/problemGenerator'
import { useSoundManager } from '../SoundManager'
import { saveTreasure } from '../../util/util'

export const useBattleLogic = () => {
  // ローカルストレージから設定を取得
  const gameType = localStorage.getItem('gameType') || 'addition'
  const gameDifficulty = localStorage.getItem('gameDifficulty') || 'easy'
  
  // ボスカウントをutilから取得
  const BOSS_COUNT = getBossCount(gameDifficulty)

  const [problem, setProblem] = useState<Problem>({
    question: '',
    answer: 0,
    options: [0, 0, 0],
    reading: undefined
  })
  const [life, setLife] = useState(3)
  const [enemyCount, setEnemyCount] = useState(1)
  const [bossLife, setBossLife] = useState(5)
  const [bossImage] = useState(Math.floor(Math.random() * 9) + 1)
  const [enemyImage, setEnemyImage] = useState(
    Math.floor(Math.random() * 8) + 1
  )
  const [backgroundImage, setBackgroundImage] = useState(
    '/taisei2/image/bg1.webp'
  )
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)

  const navigate = useNavigate()
  const { playBgm, playEffect } = useSoundManager()

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setResult(null), 1000)
      return () => clearTimeout(timer)
    }
  }, [result])

  const handleAnswer = async (selected: number) => {
    console.log(selected)
    if (selected === problem.answer) {
      setResult('correct')
      // 敵をフェードアウト
      const enemyElement = document.querySelector('.battle-enemy')
      if (enemyElement) {
        enemyElement.classList.add('fade-out')
      }
      setTimeout(async () => {
        playEffect('/sound/seikai.mp3')
        // 1秒後に別の敵に切り替え
        setEnemyImage(Math.floor(Math.random() * 8) + 1)

        if (isBossBattle(enemyCount, gameDifficulty)) {
          // ボス戦
          setBossLife((prev) => {
            const newLife = prev - 1
            if (newLife == 0) {
              console.log('クリア処理')
              //クリア時の処理
              localStorage.setItem('kuku', '')

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
          // enemyCountの更新を同期的に処理
          const nextCount = enemyCount + 1;
          console.log('Updating enemyCount to:', nextCount);
          setEnemyCount(nextCount);
          
          // 新しい問題を生成
          try {
            const newProblem = await generateProblem(
              gameType,
              gameDifficulty,
              isBossBattle(nextCount, gameDifficulty),
              nextCount
            );
            console.log('Generated new problem:', newProblem);
            setProblem(newProblem);
          } catch (error) {
            console.error('Error generating problem:', error);
          }
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
            localStorage.setItem('kuku', '')
          }
          return prev - 1
        })
      }, 2000)
    }
  }

  // BGM再生
  useEffect(() => {
    playBgm(
      isBossBattle(enemyCount, gameDifficulty) ? '/sound/bgm4.mp3' : '/sound/bgm3.mp3',
      0.1
    )
  }, [playBgm, enemyCount])

  // 初期問題生成と背景設定
  useEffect(() => {
    const initializeGame = async () => {
      if (enemyCount === 1) {
        try {
          console.log('Initializing first problem');
          const newProblem = await generateProblem(
            gameType,
            gameDifficulty,
            false,
            1
          );
          console.log('Initial problem:', newProblem);
          setProblem(newProblem);

          // 戦闘開始時にランダムな背景を選択
          const randomBg = Math.floor(Math.random() * 5) + 2 // bg2.webpからbg7.webp
          setBackgroundImage(`/taisei2/image/bg${randomBg}.webp`)
        } catch (error) {
          console.error('Error initializing game:', error);
        }
      }
    };

    initializeGame();
  }, [])

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
    BOSS_COUNT,
  }
}
