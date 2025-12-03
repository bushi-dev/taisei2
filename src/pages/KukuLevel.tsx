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
      <div className="kuku-header">
        <h1 className="kuku-title">九九を選択</h1>
        <p className="kuku-subtitle">学びたい段を選んでください</p>
      </div>

      <div className="kuku-content">
        <div className="kuku-section">
          <div className="kuku-row kuku-row--full">
            <SoundButton
              onClick={() => handleClick("mix")}
              className="kuku-button kuku-button--mix"
            >
              <span className="kuku-button-icon">🎲</span>
              <span className="kuku-button-label">ミックス</span>
              <span className="kuku-button-desc">全ての段がランダムに出題</span>
            </SoundButton>
          </div>
        </div>

        <div className="kuku-section">
          <h2 className="kuku-section-title">各段を選択</h2>
          {[...Array(9)].map((_, i) => (
            <div className="kuku-row" key={i}>
              <SoundButton
                onClick={() => {
                  handleClick((i + 1).toString());
                  localStorage.setItem("mix", "false");
                }}
                className="kuku-button kuku-button--primary"
              >
                <span className="kuku-button-number">{i + 1}</span>
                <span className="kuku-button-label">{i + 1}の段</span>
              </SoundButton>
              <SoundButton
                onClick={() => {
                  handleClick((i + 1).toString());
                  localStorage.setItem("mix", "true");
                }}
                className="kuku-button kuku-button--secondary"
              >
                <span className="kuku-button-icon">🔀</span>
                <span className="kuku-button-label">ミックス</span>
              </SoundButton>
            </div>
          ))}
        </div>
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

export default KukuLevel;
