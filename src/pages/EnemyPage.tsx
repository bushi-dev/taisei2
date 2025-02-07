import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Enemy.css";
import { useBattleLogic } from "../components/battle/BattleLogic";
import { BattleHeader } from "../components/battle/BattleHeader";
import { Enemy as BattleEnemy } from "../components/battle/Enemies";
import { BattleQuestion } from "../components/battle/BattleQuestion";
import { useSoundManager } from "../components/SoundManager";
import { isKukuMode } from "../util/problemGenerator";
import { useBattleContext } from "../context/BattleContext";

const EnemyPage = () => {
  const navigate = useNavigate();
  const { enemyCount } = useBattleContext();
  //戦闘処理
  const { problem, life, result, handleAnswer } = useBattleLogic();

  const [enemyImage] = useState<number[]>(
    Array.from({ length: 20 }, () => Math.floor(Math.random() * 8) + 1)
  );
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (result === "correct") {
      setIsFading(true);
      setTimeout(() => setIsFading(false), 1000);
    }
  }, [result]);
  const [backgroundImage, setBackgroundImage] = useState("/image/bg1.webp");
  const { playBgm } = useSoundManager();

  useEffect(() => {
    // BGM再生
    playBgm("/sound/bgm3.mp3", 0.1);
  }, []);

  // 初期背景設定
  useEffect(() => {
    const randomBg = Math.floor(Math.random() * 5) + 2; // bg2.webpからbg7.webp
    setBackgroundImage(`/image/bg${randomBg}.webp`);
  }, []);

  useEffect(() => {
    //bossに遷移
    const gameDifficulty = localStorage.getItem("gameDifficulty") || "easy";
    const MOVE_BOSS_COUNT = isKukuMode(gameDifficulty) ? 5 : 2;
    if (enemyCount === MOVE_BOSS_COUNT) {
      navigate("/boss");
    }

    // enemyCountをログに表示
    console.log("Enemy Page - Enemy Count:", enemyCount);
  }, [enemyCount, navigate]);

  return (
    <div
      className="battle-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <BattleHeader enemyCount={enemyCount} life={life} isBoss={false} />

      <BattleEnemy
        enemyImage={enemyImage[enemyCount - 1]}
        className={isFading ? "fade" : ""}
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

export default EnemyPage;
