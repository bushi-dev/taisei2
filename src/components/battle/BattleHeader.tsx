import React from 'react'

type Props = {
  enemyCount: number
  life: number
  isBoss?: boolean
}

export const BattleHeader: React.FC<Props> = ({ enemyCount, life, isBoss }) => {
  return (
    <div className="battle-header">
      <h2 style={{ visibility: isBoss ? 'hidden' : 'visible' }}>
        敵: {enemyCount}体目
      </h2>
      <h2>HP {'❤️'.repeat(life)}</h2>
    </div>
  )
}
