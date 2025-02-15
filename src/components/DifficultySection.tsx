import React from "react";
import { useSoundManager } from "./SoundManager";
import { getSavedTreasures, MAX_TREASURES } from "../util/util";

interface DifficultySectionProps {
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
}

const DifficultySection: React.FC<DifficultySectionProps> = ({
  difficulty,
  setDifficulty,
}) => {
  const { playEffect } = useSoundManager();

  return (
    <div className="difficulty-sections-container">
      <div className="setting-section difficulty-section">
        <h2 style={{ marginTop: "0", marginBottom: "25px" }}>むずかしさ</h2>
        <div className="difficulty-stars">
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              playEffect("/sound/click.mp3", 0.5);
            }}
            className="difficulty-select"
          >
            <option value="easy">⭐</option>
            <option value="medium">⭐⭐</option>
            <option value="normal">⭐⭐⭐</option>
            <option value="hard">⭐⭐⭐⭐</option>
            <option value="very-hard">⭐⭐⭐⭐⭐</option>
            <option value="extreme">⭐⭐⭐⭐⭐⭐</option>
          </select>
        </div>
      </div>
      <div className="setting-section difficulty-section">
        <h2 style={{ margin: "0" }}>おたから</h2>
        <div className="treasure-count">
          {getSavedTreasures().length}/{MAX_TREASURES}
        </div>
      </div>
    </div>
  );
};

export default DifficultySection;
