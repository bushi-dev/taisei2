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

  const handleClick = (level: string, mix: boolean = false) => {
    localStorage.setItem("kuku", level);
    localStorage.setItem("gameDifficulty", "easy");
    localStorage.setItem("gameType", "multiplication");
    localStorage.setItem("mix", mix ? "true" : "false");
    navigate("/battle");
  };

  return (
    <div className="kuku-container">
      <div className="kuku-header">
        <h1 className="kuku-title">九九道場</h1>
        <p className="kuku-subtitle">鍛えたき段を選べ</p>
      </div>

      <div className="kuku-content">
        {/* 全段挑戦ボタン - 中央配置 */}
        <div className="kuku-mix-all-wrapper">
          <SoundButton
            onClick={() => handleClick("mix", true)}
            className="kuku-button kuku-button--mix"
          >
            <span className="kuku-button-icon">⚔️</span>
            <span className="kuku-button-label">全段挑戦</span>
            <span className="kuku-button-desc">一から九までの段が入り乱れる</span>
          </SoundButton>
        </div>

        {/* 各段のグリッド */}
        <div className="kuku-grid">
          {[...Array(9)].map((_, i) => (
            <div className="kuku-card" key={i}>
              <div className="kuku-card-number">{i + 1}</div>
              <div className="kuku-card-title">{i + 1}の段</div>
              <div className="kuku-card-buttons">
                <SoundButton
                  onClick={() => handleClick((i + 1).toString(), false)}
                  className="kuku-card-btn kuku-card-btn--order"
                >
                  順番
                </SoundButton>
                <SoundButton
                  onClick={() => handleClick((i + 1).toString(), true)}
                  className="kuku-card-btn kuku-card-btn--mix"
                >
                  ミックス
                </SoundButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SoundButton onClick={() => navigate("/")} className="back-button-level">
        <img
          src={getPath("/image/back.png")}
          alt="戻る"
        />
      </SoundButton>
    </div>
  );
};

export default KukuLevel;
