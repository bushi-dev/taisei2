import "./Battle.css";
import { BattleHeader } from "../components/battle/BattleHeader";
import { useBattleLogic } from "../components/battle/BattleLogic";
import { BattleQuestion } from "../components/battle/BattleQuestion";
import { Boss as BattleBoss } from "../components/battle/Boss";
import { Enemy as BattleEnemy } from "../components/battle/Enemies";

const Battle = () => {
	const {
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
	} = useBattleLogic();

	return (
		<div
			className="battle-container"
			style={{ backgroundImage: `url(${backgroundImage})` }}
		>
			<BattleHeader
				enemyCount={enemyCount}
				life={life}
				isBoss={enemyCount === BOSS_COUNT}
			/>

			{enemyCount === BOSS_COUNT ? (
				<BattleBoss bossImage={bossImage} bossLife={bossLife} />
			) : (
				<BattleEnemy enemyImage={enemyImage} bossLife={bossLife} />
			)}

			<BattleQuestion
				question={problem.question}
				options={problem.options}
				result={result}
				handleAnswer={handleAnswer}
				reading={problem.reading}
			/>
		</div>
	);
};

export default Battle;
