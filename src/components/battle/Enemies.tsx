import React from "react";
import { getPath } from "../../util/util";

type EnemyProps = {
  enemyImage: number;
};

export const Enemy: React.FC<EnemyProps> = ({ enemyImage }) => {
  return (
    <img
      src={getPath(`/image/teki${enemyImage}.gif`)}
      alt={`敵${enemyImage}`}
      className="battle-enemy"
    />
  );
};
