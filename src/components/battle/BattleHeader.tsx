import React from "react";

type Props = {
  enemyCount: number;
  life: number;
  isBoss?: boolean;
};

export const BattleHeader: React.FC<Props> = ({ enemyCount, life, isBoss }) => {
  return (
    <div className="battle-header">
      <h4
        style={{ fontSize: "25px", visibility: isBoss ? "hidden" : "visible" }}
      >
        敵: {enemyCount}体目
      </h4>
      <h4 style={{ fontSize: "25px" }}>HP {"❤️".repeat(life)}</h4>
    </div>
  );
};
