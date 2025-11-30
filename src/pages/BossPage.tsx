import { useEffect, useState } from 'react';
import { Boss as BattleBoss } from '../components/battle/Boss';
import { BattleQuestion } from '../components/battle/BattleQuestion';
import { useBattleLogic } from '../components/battle/BattleLogic';
import { BattleHeader } from '../components/battle/BattleHeader';
import './Enemy.css';
import { useSoundManager } from '../components/SoundManager';
import { useNavigate } from 'react-router-dom';
import { saveTreasure, getPath } from '../util/util';
import { useBattleContext } from '../context/BattleContext';

const BossPage = () => {
  const [bossImage] = useState(Math.floor(Math.random() * 10) + 1);
  const [backgroundImage] = useState(`/image/bg${Math.floor(Math.random() * 5) + 2}.webp`);

  const { enemyCount, bossLife } = useBattleContext();
  //戦闘処理
  const { problem, life, result, handleAnswer } = useBattleLogic();

  const { playBgm, playEffect } = useSoundManager();
  const navigate = useNavigate();

  //⭐️クリア処理start
  const handleBossClear = () => {
    // battle-questionを非表示にする
    const questionElement = document.querySelector('.battle-question');
    if (questionElement) {
      questionElement.classList.add('fade-out');
    }

    // 達成度を加算
    // const gameDifficulty = localStorage.getItem("gameDifficulty") || "easy";
    // const gameType = localStorage.getItem("gameType") || "addition";

    // const progressKey = `${gameType}_progress`;
    // const currentProgress = parseInt(localStorage.getItem(progressKey) || "0");
    // let progressToAdd = 1;
    // if (gameDifficulty === "medium") {
    //   progressToAdd = 3;
    // } else if (gameDifficulty !== "easy") {
    //   progressToAdd = 5;
    // }

    // 進捗更新
    // const newProgress = Math.min(currentProgress + progressToAdd, 100);
    // localStorage.setItem(progressKey, newProgress.toString());

    // クリア音再生
    playEffect('/sound/clear.mp3');

    // ランダムな宝の保存
    let treasureNumber: number = Math.floor(Math.random() * 100) + 1;
    if (treasureNumber === 1) {
      const savedTreasures: number[] = JSON.parse(localStorage.getItem('treasures') || '[]');

      const targetNumbers = [2, 3, 4, 5, 6, 7, 8, 9, 10]; // 必要な数字リスト
      let count = 0;

      for (const num of savedTreasures) {
        if (targetNumbers.includes(num)) {
          count++;
        }
      }

      if (count === targetNumbers.length) {
        do {
          treasureNumber = Math.floor(Math.random() * 100) + 1;
        } while (treasureNumber === 1); // 1 が出たら再抽選
      }
    }
    saveTreasure(treasureNumber);

    // 動画ページに遷移
    navigate('/movie');
  }; //⭐️クリア処理end

  useEffect(() => {
    // BGM再生
    playBgm('/sound/bgm4.mp3', 0.1);
  }, []);

  useEffect(() => {
    // クリア画面に遷移
    if (bossLife === 0) {
      handleBossClear();
    }

    // enemyCountをログに表示
    console.log('Boss Page - Enemy Count:', enemyCount);
  }, [enemyCount, navigate]);

  return (
    <div
      className="battle-container"
      style={{ backgroundImage: `url(${getPath(backgroundImage)})` }}
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
