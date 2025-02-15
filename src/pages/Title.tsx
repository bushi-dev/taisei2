import { useEffect } from "react";
import { useSoundManager } from "../components/SoundManager";
import { useNavigate } from "react-router-dom";
import SoundButton from "../components/SoundButton";
import "./Title.css";
import { getPath } from "../util/util";

const Title = () => {
  const navigate = useNavigate();

  const { playBgm } = useSoundManager();

  useEffect(() => {
    // BGM再生
    playBgm("/sound/bgm1.mp3", 0.1);
  }, [playBgm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://my-cloudflare-worker.ytakeshi-7.workers.dev/list",
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Response:", res);
        const text = await res.text();
        console.log("Text:", text);
        localStorage.setItem("treasures", text);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="title-screen">
      <h1 className="title-screen__heading">たいせい忍者</h1>
      <img
        src={getPath("/image/nin.png")}
        alt="ninja"
        className="title-screen__ninja"
      />

      <SoundButton
        className="title-screen__button start"
        onClick={() => navigate("/level")}
      >
        冒険を始める
      </SoundButton>

      <SoundButton
        className="title-screen__button kuku"
        onClick={() => navigate("/kuku-level")}
      >
        九九モード
      </SoundButton>

      {window.location.href.includes("local") && (
        <SoundButton
          className="title-screen__button kokugo"
          onClick={() => navigate("/kokugo-level")}
        >
          国語モード
        </SoundButton>
      )}

      <SoundButton
        className="title-screen__button treasure"
        onClick={() => navigate("/treasure")}
      >
        秘宝の記録
      </SoundButton>
    </div>
  );
};

export default Title;
