import './BattleScreen.css'
import { useBattleLogic, BOSS_COUNT } from '../components/battle/BattleLogic'
import { BattleHeader } from '../components/battle/BattleHeader'
import {
  Enemy as BattleEnemy,
  Boss as BattleBoss,
} from '../components/battle/Enemies'
import { BattleQuestion } from '../components/battle/BattleQuestion'

const BattleScreen = () => {
  const {
    problem,
    life,
    enemyCount,
    bossLife,
    bossImage,
    enemyImage,
    result,
    handleAnswer,
  } = useBattleLogic()

  return (
    <div className="battle-container">
      <BattleHeader
        enemyCount={enemyCount}
        life={life}
        isBoss={enemyCount === BOSS_COUNT}
      />

      {enemyCount % 5 === 4 ? (
        <BattleBoss bossImage={bossImage} bossLife={bossLife} />
      ) : (
        <BattleEnemy enemyImage={enemyImage} bossLife={bossLife} />
      )}

      <BattleQuestion
        question={problem.question}
        options={problem.options}
        result={result}
        handleAnswer={handleAnswer}
      />
    </div>
  )
}

export default BattleScreen
