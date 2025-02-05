import React from "react";
import { getPath } from "../../util/util";

type EnemyProps = {
  enemyImage: number;
  className?: string;
};

export const Enemy: React.FC<EnemyProps> = ({ enemyImage, className = "" }) => {
  return (
    <img
      src={getPath(`/image/teki${enemyImage}.gif`)}
      alt={`敵${enemyImage}`}
      className={`battle-enemy ${className}`}
    />
  );
};
