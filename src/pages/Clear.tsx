import { useEffect, useState } from "react";
import { useSoundManager } from "../components/SoundManager";
import { useNavigate } from "react-router-dom";
import SoundButton from "../components/SoundButton";
import "./Clear.css";
import { getPath, increaseDifficulty } from "../util/util";
import { useBattleContext } from "../context/BattleContext";

const Clear = () => {
  const isKukuMode = (() => {
    const value = localStorage.getItem("kuku");
    return value !== null && /\S/.test(value);
  })();
  const navigate = useNavigate();
  const [treasure, setTreasure] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);

  const { playBgm } = useSoundManager();

  useEffect(() => {
    const treasureNumber = parseInt(
      localStorage.getItem("lastTreasureNumber") || "1"
    );
    setTreasure(`takara${treasureNumber}.png`);
    playBgm("/sound/bgm1.mp3", 0.1);
  }, [playBgm]);

  useEffect(() => {
    contextReset();
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://my-cloudflare-worker.ytakeshi-7.workers.dev/add/" +
            localStorage.getItem("lastTreasureNumber") || "",
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response:", res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const { reset: contextReset } = useBattleContext();

  return (
    <div className="clear-container">
      {/* 背景エフェクト */}
      <div className="clear-bg-flash"></div>
      <div className="clear-bg-burst"></div>
      
      {/* 花火エフェクト */}
      <div className="clear-fireworks">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="firework" style={{ '--fw': i } as React.CSSProperties}>
            {[...Array(12)].map((_, j) => (
              <div key={j} className="firework-particle" style={{ '--fp': j } as React.CSSProperties}></div>
            ))}
          </div>
        ))}
      </div>

      {/* キラキラ星 */}
      <div className="clear-stars">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="star" style={{ '--s': i } as React.CSSProperties}>✦</div>
        ))}
      </div>

      {/* 紙吹雪 */}
      <div className="clear-confetti">
        {[...Array(40)].map((_, i) => (
          <div key={i} className="confetti-piece" style={{ '--j': i } as React.CSSProperties}></div>
        ))}
      </div>

      {/* メインコンテンツ */}
      <div className="clear-content">
        {/* 勝利バナー */}
        <div className="clear-banner">
          <span className="clear-banner-text">勝利</span>
          <div className="clear-banner-glow"></div>
        </div>

        {/* 宝物表示エリア */}
        <div className="clear-treasure-area">
          <div 
            className="clear-treasure-frame"
            onClick={() => setIsZoomed(true)}
          >
            <img
              src={getPath(`/image/${treasure}`)}
              alt="獲得した宝物"
              className="clear-treasure-image"
            />
            <div className="clear-zoom-hint">タップで拡大</div>
          </div>
          {/* GET!スタンプ */}
          <div className="clear-stamp">GET!</div>
          <div className="clear-treasure-label">
            <span className="label-deco">★</span>
            戦利品を手に入れた！
            <span className="label-deco">★</span>
          </div>
        </div>

        {/* ボタンエリア */}
        <div className="clear-actions">
          {isKukuMode ? (
            <>
              <SoundButton
                onClick={() => navigate("/battle")}
                className="clear-btn clear-btn--primary"
              >
                次の問題へ!
              </SoundButton>

              <SoundButton
                onClick={() => {
                  increaseDifficulty();
                  navigate("/kuku-level");
                }}
                className="clear-btn clear-btn--secondary"
              >
                問題をえらぶ
              </SoundButton>
            </>
          ) : (
            <SoundButton
              onClick={() => navigate("/battle")}
              className="clear-btn clear-btn--primary"
            >
              次の問題へ!
            </SoundButton>
          )}

          <SoundButton
            onClick={() => navigate("/")}
            className="clear-btn clear-btn--back"
          >
            タイトルへ
          </SoundButton>
        </div>
      </div>

      {/* 拡大モーダル */}
      {isZoomed && (
        <div className="clear-zoom-modal" onClick={() => setIsZoomed(false)}>
          <div className="clear-zoom-content">
            <img
              src={getPath(`/image/${treasure}`)}
              alt="獲得した宝物"
              className="clear-zoom-image"
            />
            <div className="clear-zoom-close">タップで閉じる</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clear;
