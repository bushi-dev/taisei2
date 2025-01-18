import React from 'react'
import { getPath } from '../../util/util'

type EnemyProps = {
  enemyImage: number
  bossLife: number
}

export const Enemy: React.FC<EnemyProps> = ({ enemyImage }) => {
  return (
    <img
      src={getPath(`/image/teki${enemyImage}.gif`)}
      alt={`敵${enemyImage}`}
      className="battle-enemy"
    />
  )
}

type BossProps = {
  bossImage: number
  bossLife: number
}

export const Boss: React.FC<BossProps> = ({ bossImage, bossLife }) => {
  return (
    <>
      <img
        src={getPath(`/image/boss${bossImage}.png`)}
        alt="ボス"
        className="battle-boss"
      />
      <h2 style={{ paddingLeft: '20px' }}>ボス {'💙'.repeat(bossLife)}</h2>
    </>
  )
}
