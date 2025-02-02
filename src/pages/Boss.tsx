import { useState } from "react";
import { Boss as BattleBoss } from "../components/battle/Boss";
import { BattleQuestion } from "../components/battle/BattleQuestion";
import { useBattleLogic } from "../components/battle/BattleLogic";
import { BattleHeader } from "../components/battle/BattleHeader";
import "./Boss.css";

const Boss = () => {
  const [bossImage] = useState(Math.floor(Math.random() * 10) + 1);
  const [backgroundImage] = useState(
    `/taisei2/image/bg${Math.floor(Math.random() * 5) + 2}.webp`
  );

  const initialBossCount = 20; // 仮の値として20を設定
  const { problem, life, bossLife, result, handleAnswer, BOSS_COUNT } =
    useBattleLogic(initialBossCount, () => {});

  return (
    <div
      className="boss-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <BattleHeader enemyCount={BOSS_COUNT} life={life} isBoss={true} />

      <BattleBoss bossImage={bossImage} bossLife={bossLife} />

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

export default Boss;
