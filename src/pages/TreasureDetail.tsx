import { useEffect } from "react";
import { useSoundManager } from "../components/SoundManager";
import { useNavigate, useParams } from "react-router-dom";
import SoundButton from "../components/SoundButton";
import "./TreasureDetail.css";
import { getPath } from "../util/util";

const TreasureDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { playBgm } = useSoundManager();

  useEffect(() => {
    // BGM再生
    playBgm("/sound/bgm1.mp3", 0.1);
  }, [playBgm]);

  return (
    <div className="treasure-detail-container">
      <div className="treasure-content">
        <img
          src={getPath(`/image/takara${id}.png`)}
          className="treasure-detail-image"
        />
        <SoundButton
          onClick={() => navigate("/treasure")}
          className="back-button"
        >
          一覧に戻る
        </SoundButton>
      </div>
    </div>
  );
};

export default TreasureDetail;
