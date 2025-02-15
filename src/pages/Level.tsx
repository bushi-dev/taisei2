import { useState, useEffect } from "react";
import { useSoundManager } from "../components/SoundManager";
import { useNavigate } from "react-router-dom";
import { getPath } from "../util/util";
import SoundButton from "../components/SoundButton";
import "./Level.css";
import DifficultySection from "../components/DifficultySection";

const Level = () => {
  const [type, setType] = useState(
    localStorage.getItem("gameType") || "addition"
  );
  const [difficulty, setDifficulty] = useState(
    localStorage.getItem("gameDifficulty") || "easy"
  );
  const progress = {
    addition: localStorage.getItem("addition_progress") || "0",
    subtraction: localStorage.getItem("subtraction_progress") || "0",
    multiplication: localStorage.getItem("multiplication_progress") || "0",
    division: localStorage.getItem("division_progress") || "0",
  };
  const navigate = useNavigate();

  useEffect(() => {
    const savedType = localStorage.getItem("gameType");
    const savedDifficulty = localStorage.getItem("gameDifficulty");
    if (savedType) setType(savedType);
    if (savedDifficulty) setDifficulty(savedDifficulty);
    localStorage.setItem("kuku", "");
  }, []);

  const { playBgm } = useSoundManager();

  useEffect(() => {
    playBgm("/sound/bgm1.mp3", 0.1);
  }, [playBgm]);

  const handleStart = () => {
    localStorage.setItem("gameType", type);
    localStorage.setItem("gameDifficulty", difficulty);
    if (type === "multiplication") {
      localStorage.setItem("kuku", "mix");
    }
    navigate("/battle");
  };

  return (
    <div className="level-container">
      <div className="setting-section">
        <div className="type-buttons">
          <SoundButton
            className={`type-button addition ${
              type === "addition" ? "active" : ""
            }`}
            onClick={() => setType("addition")}
          >
            ＋<div className="progress">{progress.addition}%</div>
          </SoundButton>
          <SoundButton
            className={`type-button subtraction ${
              type === "subtraction" ? "active" : ""
            }`}
            onClick={() => setType("subtraction")}
          >
            −<div className="progress">{progress.subtraction}%</div>
          </SoundButton>
          <SoundButton
            className={`type-button multiplication ${
              type === "multiplication" ? "active" : ""
            }`}
            onClick={() => setType("multiplication")}
          >
            ×<div className="progress">{progress.multiplication}%</div>
          </SoundButton>
          <SoundButton
            className={`type-button division ${
              type === "division" ? "active" : ""
            }`}
            onClick={() => setType("division")}
          >
            ÷<div className="progress">{progress.division}%</div>
          </SoundButton>
        </div>
      </div>

      <DifficultySection
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <SoundButton className="start-button" onClick={handleStart}>
          スタート
        </SoundButton>
        <SoundButton
          onClick={() => navigate("/")}
          className="back-button-level"
        >
          <img
            src={getPath("/image/back.png")}
            alt="戻る"
            style={{ width: "55px", height: "55px" }}
          />
        </SoundButton>
      </div>
    </div>
  );
};

export default Level;
