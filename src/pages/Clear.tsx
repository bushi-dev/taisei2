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
    return value !== null && /\S/.test(value); // 空白のみの文字列を除外
  })();
  const navigate = useNavigate();
  const [treasure, setTreasure] = useState("");

  const { playBgm } = useSoundManager();

  useEffect(() => {
    // ローカルストレージから宝番号を取得 (1〜100)
    const treasureNumber = parseInt(
      localStorage.getItem("lastTreasureNumber") || "1"
    );
    setTreasure(`takara${treasureNumber}.png`);

    // BGM再生
    playBgm("/sound/bgm1.mp3", 0.1);
  }, [playBgm]);

  useEffect(() => {
    //初期化処理
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
      <h3 className="clear-heading">ステージクリア！</h3>

      <div className="clear-subheading">
        <img
          src={getPath(`/image/${treasure}`)}
          alt="獲得した宝物"
          className="clear-treasure-image"
        />
        <div className="clear-get-text">GET!</div>
      </div>

      <div className="clear-buttons">
        <div className="clear-buttons-bottom">
          {isKukuMode ? (
            <span>
              <SoundButton
                onClick={() => navigate("/battle")}
                className="clear-button clear-button--secondary"
              >
                次の問題へ!
              </SoundButton>

              <SoundButton
                onClick={() => {
                  increaseDifficulty();
                  navigate("/kuku-level");
                }}
                className="clear-button clear-button--primary"
              >
                問題をえらぶ
              </SoundButton>
            </span>
          ) : (
            <SoundButton
              onClick={() => navigate("/battle")}
              className="clear-button clear-button--secondary"
            >
              次の問題へ!
            </SoundButton>
          )}
        </div>
        <div className="clear-buttons-top">
          <SoundButton
            onClick={() => navigate("/")}
            className="clear-button clear-button--primary"
          >
            タイトルへ
          </SoundButton>
        </div>
      </div>
    </div>
  );
};

export default Clear;
