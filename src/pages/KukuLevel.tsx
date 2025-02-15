import { useEffect } from "react";
import { useSoundManager } from "../components/SoundManager";
import { useNavigate } from "react-router-dom";
import SoundButton from "../components/SoundButton";
import "./KukuLevel.css";
import { getPath } from "../util/util";

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
    navigate("/battle");
  };

  return (
    <div className="kuku-container">
      <div className="kuku-row">
        <SoundButton
          onClick={() => handleClick("mix")}
          className="kuku-button kuku-button--primary"
        >
          ミックス
        </SoundButton>
      </div>
      {[...Array(9)].map((_, i) => (
        <div className="kuku-row" key={i}>
          <SoundButton
            onClick={() => {
              handleClick((i + 1).toString());
              localStorage.setItem("mix", "false");
            }}
            className="kuku-button kuku-button--primary"
          >
            {i + 1}の段
          </SoundButton>
          <SoundButton
            onClick={() => {
              handleClick((i + 1).toString());
              localStorage.setItem("mix", "true");
            }}
            className="kuku-button kuku-button--secondary"
          >
            ミックス
          </SoundButton>
        </div>
      ))}
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

export default KukuLevel;
