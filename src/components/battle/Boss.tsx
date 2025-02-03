import React from "react";
import { getPath } from "../../util/util";

type BossProps = {
  bossImage: number;
  bossLife: number;
};

export const Boss: React.FC<BossProps> = ({ bossImage, bossLife }) => {
  return (
    <>
      <img
        src={getPath(`/image/boss${bossImage}.png`)}
        alt="BOSS"
        className="battle-enemy"
      />
      <h2 style={{ paddingLeft: "20px", fontSize: "30px", margin: "0" }}>
        BOSS {"💙".repeat(bossLife)}
      </h2>
    </>
  );
};
