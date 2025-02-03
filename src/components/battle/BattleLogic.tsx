import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  generateProblem,
  Problem,
  getBossCount,
} from "../../util/problemGenerator";
import { useSoundManager } from "../SoundManager";

export const useBattleLogic = (
  enemyCount: number,
  setEnemyCount: (count: number) => void,
  setbossLife?: React.Dispatch<React.SetStateAction<number>>
) => {
  // ローカルストレージから設定を取得
  const gameType = localStorage.getItem("gameType") || "addition";
  const gameDifficulty = localStorage.getItem("gameDifficulty") || "easy";

  // ボスカウントをutilから取得
  const BOSS_COUNT = getBossCount(gameDifficulty);

  const [problem, setProblem] = useState<Problem>({
    question: "",
    answer: 0,
    options: [0, 0, 0],
    reading: undefined,
  });
  const [life, setLife] = useState(3);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const navigate = useNavigate();
  const { playEffect } = useSoundManager();

  // 正解/不正解の結果表示を1秒後に自動的にクリアするuseEffect
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setResult(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleAnswer = async (selected: number) => {
    if (selected === problem.answer) {
      setResult("correct");
      setTimeout(async () => {
        playEffect("/sound/seikai.mp3");

        // ボス戦でも問題を更新する
        try {
          const nextCount = enemyCount + 1;
          const newProblem = await generateProblem(
            gameType,
            gameDifficulty,
            nextCount
          );
          console.log("Generated new problem:", newProblem);
          setProblem(newProblem);

          setEnemyCount(nextCount);

          // ボスのライフを減らす処理を追加
          if (setbossLife) {
            setbossLife((prevLife) => Math.max(0, prevLife - 1));
          }
        } catch (error) {
          console.error("Error generating problem:", error);
        }
      }, 1000);
    } else {
      //失敗時
      setResult("wrong");
      setTimeout(() => {
        playEffect("/sound/sippai.mp3");
        setLife((prev) => {
          if (prev - 1 <= 0) {
            navigate("/taisei2/gameover");
            localStorage.setItem("kuku", "");
          }
          return prev - 1;
        });
      }, 2000);
    }
  };

  // 初期問題生成
  useEffect(() => {
    const initializeGame = async () => {
      if (enemyCount === 1) {
        try {
          console.log("Initializing first problem");
          const newProblem = await generateProblem(gameType, gameDifficulty, 1);
          console.log("Initial problem:", newProblem);
          setProblem(newProblem);
        } catch (error) {
          console.error("Error initializing game:", error);
        }
      }
    };

    initializeGame();
  }, []);

  return {
    problem,
    life,
    enemyCount,
    result,
    handleAnswer,
    BOSS_COUNT,
  };
};
