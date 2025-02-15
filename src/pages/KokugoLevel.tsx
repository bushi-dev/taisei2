import { useState, useEffect } from "react";
import { useSoundManager } from "../components/SoundManager";
import { useNavigate } from "react-router-dom";
import SoundButton from "../components/SoundButton";
import "./KokugoLevel.css";
import { getPath } from "../util/util";
import DifficultySection from "../components/DifficultySection";

const KokugoLevel = () => {
  const [difficulty, setDifficulty] = useState("easy");
  const navigate = useNavigate();
  const { playBgm } = useSoundManager();

  useEffect(() => {
    // BGM再生
    playBgm("/sound/bgm1.mp3", 0.1);
    localStorage.setItem("kuku", "");
  }, [playBgm]);

  const handleClick = (type: string) => {
    localStorage.setItem("gameType", type);
    navigate("/battle");
  };

  return (
    <div className="kuku-container">
      <DifficultySection
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
      <div className="kuku-row">
        <SoundButton
          onClick={() => handleClick("kanji")}
          className="kuku-button kuku-button--primary"
        >
          漢字
        </SoundButton>
      </div>
      <div className="kuku-row">
        <SoundButton
          onClick={() => handleClick("bun")}
          className="kuku-button kuku-button--secondary"
        >
          ぶんしょう
        </SoundButton>
      </div>
      <div className="kuku-row">
        <SoundButton
          onClick={() => handleClick("kokugo-mix")}
          className="kuku-button kuku-button--primary"
        >
          ミックス
        </SoundButton>
      </div>
      <SoundButton onClick={() => navigate("/")} className="back-button-level">
        <img
          src={getPath("/image/back.png")}
          alt="戻る"
          style={{ width: "55px", height: "55px" }}
        />
      </SoundButton>
    </div>
  );
};

export default KokugoLevel;
