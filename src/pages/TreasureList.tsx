import { useEffect, useState } from "react";
import { useSoundManager } from "../components/SoundManager";
import { useNavigate } from "react-router-dom";
import SoundButton from "../components/SoundButton";
import "./TreasureList.css";
import { getPath } from "../util/util";

interface TreasuresByRarity {
  [key: number]: number[];
}

const TreasureList = () => {
  const [treasures, setTreasures] = useState<string[]>([]);
  const [currentRarity, setCurrentRarity] = useState<number | null>(null);
  const [treasuresByRarity, setTreasuresByRarity] = useState<TreasuresByRarity>(
    {
      5: [],
      4: [],
      3: [],
      2: [],
      1: [],
    }
  );
  const navigate = useNavigate();

  const { playBgm } = useSoundManager();

  useEffect(() => {
    const savedTreasures = JSON.parse(
      localStorage.getItem("treasures") || "[]"
    );

    setTreasuresByRarity({
      5: savedTreasures.filter((t: number) => t >= 81 && t <= 100),
      4: savedTreasures.filter((t: number) => t >= 61 && t <= 80),
      3: savedTreasures.filter((t: number) => t >= 41 && t <= 60),
      2: savedTreasures.filter((t: number) => t >= 21 && t <= 40),
      1: savedTreasures.filter((t: number) => t >= 1 && t <= 20),
    });

    const sortedTreasures = [...savedTreasures].sort((a, b) => a - b);
    const formattedTreasures = sortedTreasures.map(
      (t: number) => `takara${t}.png`
    );
    setTreasures(formattedTreasures);

    playBgm("/sound/bgm1.mp3", 0.1);
  }, []);

  return (
    <div className="treasure-list-container">
      <div className="treasure-list-header">
        <h1 className="treasure-list-heading">宝物一覧</h1>
        <SoundButton onClick={() => navigate("/")} className="back-button">
          タイトル
        </SoundButton>
      </div>
      <div className="treasure-list-header">
        <div onClick={() => setCurrentRarity(null)}>ALL</div>
        <div onClick={() => setCurrentRarity(5)}>星1</div>
        <div onClick={() => setCurrentRarity(4)}>星2</div>
        <div onClick={() => setCurrentRarity(3)}>星3</div>
        <div onClick={() => setCurrentRarity(3)}>星4</div>
        <div onClick={() => setCurrentRarity(1)}>星5</div>
      </div>
      <div className="treasure-grid">
        {(currentRarity === null
          ? treasures
          : treasuresByRarity[currentRarity].map((t) => `takara${t}.png`)
        ).map((treasure, index) => (
          <div
            key={index}
            className="treasure-item"
            onClick={() => {
              const treasureNumber = treasure.match(/\d+/)?.[0] || "0";
              navigate(`/treasure/${treasureNumber}`);
            }}
          >
            <img
              src={getPath(`/image/${treasure}`)}
              alt={treasure}
              className="treasure-list-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreasureList;
