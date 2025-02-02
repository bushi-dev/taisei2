import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Enemy.css";
import { useBattleLogic } from "../components/battle/BattleLogic";
import { isBossBattle } from "../util/problemGenerator";
import { BattleHeader } from "../components/battle/BattleHeader";
import { Enemy as BattleEnemy } from "../components/battle/Enemies";
import { BattleQuestion } from "../components/battle/BattleQuestion";

const Enemy = () => {
  const navigate = useNavigate();
  const [enemyCount, setEnemyCount] = useState(1);
  const [enemyImage] = useState<number[]>(
    Array.from({ length: 20 }, () => Math.floor(Math.random() * 8) + 1)
  );
  const [backgroundImage, setBackgroundImage] = useState(
    "/taisei2/image/bg1.webp"
  );

  // 初期背景設定
  useEffect(() => {
    if (enemyCount === 1) {
      const randomBg = Math.floor(Math.random() * 5) + 2; // bg2.webpからbg7.webp
      setBackgroundImage(`/taisei2/image/bg${randomBg}.webp`);
    }
  }, []);

  useEffect(() => {
    if (enemyCount === 5) {
      sessionStorage.setItem("fromBattle", "true");
      navigate("/taisei2/boss");
    }
  }, [enemyCount, navigate]);

  // ゲームの設定を取得
  const gameDifficulty = localStorage.getItem("gameDifficulty") || "easy";

  const { problem, life, bossLife, result, handleAnswer } = useBattleLogic(
    enemyCount,
    (count) => {
      if (isBossBattle(count, gameDifficulty)) {
        // ボス戦への遷移
        sessionStorage.setItem("fromBattle", "true");
        navigate("/boss");
      } else {
        setEnemyCount(count);
      }
    }
  );

  return (
    <div
      className="battle-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <BattleHeader enemyCount={enemyCount} life={life} isBoss={false} />

      <BattleEnemy
        enemyImage={enemyImage[enemyCount - 1]}
        bossLife={bossLife}
      />

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

export default Enemy;
