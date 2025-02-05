import { useEffect } from "react";
import { useSoundManager } from "../components/SoundManager";
import { useNavigate } from "react-router-dom";
import SoundButton from "../components/SoundButton";
import "./KukuLevel.css";

const KukuLevel = () => {
  const navigate = useNavigate();
  const { playBgm } = useSoundManager();

  useEffect(() => {
    // BGM再生
    playBgm("/sound/bgm1.mp3", 0.1);
    localStorage.setItem("kuku", "");
  }, [playBgm]);

  const handleClick = (level: string) => {
    localStorage.setItem("kuku", level);
    localStorage.setItem("gameDifficulty", "easy");
    localStorage.setItem("gameType", "multiplication");
    navigate("/taisei2/battle");
  };

  return (
    <div className="kuku-container">
      <SoundButton
        onClick={() => handleClick("mix")}
        className="kuku-button kuku-button--primary"
      >
        ミックス
      </SoundButton>
      {[...Array(9)].map((_, i) => (
        <SoundButton
          key={i + 1}
          onClick={() => handleClick((i + 1).toString())}
          className={`kuku-button ${
            i % 2 === 0 ? "kuku-button--primary" : "kuku-button--secondary"
          }`}
        >
          {i + 1}の段
        </SoundButton>
      ))}
    </div>
  );
};

export default KukuLevel;
