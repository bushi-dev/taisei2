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
