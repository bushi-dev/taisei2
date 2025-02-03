import { useEffect, useState } from "react";
import { Boss as BattleBoss } from "../components/battle/Boss";
import { BattleQuestion } from "../components/battle/BattleQuestion";
import { useBattleLogic } from "../components/battle/BattleLogic";
import { BattleHeader } from "../components/battle/BattleHeader";
import "./Enemy.css";
import { useSoundManager } from "../components/SoundManager";
import { useNavigate } from "react-router-dom";
import { saveTreasure } from "../util/util";
import { isKukuMode } from "../util/problemGenerator";

const BossPage = () => {
  const [bossImage] = useState(Math.floor(Math.random() * 10) + 1);
  const [backgroundImage] = useState(
    `/taisei2/image/bg${Math.floor(Math.random() * 5) + 2}.webp`
  );

  const [enemyCount, setEnemyCount] = useState(1);
  const [bossLife, setbossLife] = useState(5);
  const { problem, life, result, handleAnswer } = useBattleLogic(
    enemyCount,
    setEnemyCount,
    setbossLife
  );

  const { playBgm, playEffect } = useSoundManager();
  const navigate = useNavigate();

  const gameDifficulty = localStorage.getItem("gameDifficulty") || "easy";

  const handleBossClear = () => {
    // ゲームタイプと難易度を取得
    const gameType = localStorage.getItem("gameType") || "addition";

    // ローカルストレージのクリア
    localStorage.setItem("kuku", "");

    // battle-questionを非表示にする
    const questionElement = document.querySelector(".battle-question");
    if (questionElement) {
      questionElement.classList.add("fade-out");
    }

    // 達成度を加算
    const progressKey = `${gameType}_progress`;
    const currentProgress = parseInt(localStorage.getItem(progressKey) || "0");
    let progressToAdd = 1;
    if (gameDifficulty === "medium") {
      progressToAdd = 3;
    } else if (gameDifficulty !== "easy") {
      progressToAdd = 5;
    }

    // 進捗更新
    const newProgress = Math.min(currentProgress + progressToAdd, 100);
    localStorage.setItem(progressKey, newProgress.toString());

    // クリア音再生
    playEffect("/sound/clear.mp3");

    // ランダムな宝の保存
    const treasureNumber = Math.floor(Math.random() * 100) + 1;
    saveTreasure(treasureNumber);

    // 動画ページに遷移
    navigate("/taisei2/movie");
  };

  useEffect(() => {
    // BGM再生
    playBgm("/sound/bgm4.mp3", 0.1);
  }, []);

  useEffect(() => {
    // クリア画面に遷移
    if (bossLife === 0) {
      handleBossClear();
    }
  }, [enemyCount, navigate]);

  return (
    <div
      className="battle-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <BattleHeader enemyCount={enemyCount} life={life} isBoss={true} />

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

export default BossPage;
