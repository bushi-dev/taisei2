import React from 'react'
import SoundButton from '../SoundButton'

type BattleQuestionProps = {
  question: string
  options: number[]
  result: 'correct' | 'wrong' | null
  handleAnswer: (selected: number) => void
  reading?: string
}

export const BattleQuestion: React.FC<BattleQuestionProps> = ({
  question,
  options,
  result,
  handleAnswer,
  reading,
}) => {
  return (
    <div className="battle-question">
      {reading && <div className="battle-reading">{reading}</div>}
      <div>{question}</div>

      <div className="battle-options">
        {options.map((option, i) => (
          <SoundButton
            key={i}
            onClick={() => handleAnswer(option)}
            className="battle-button"
            isBattleMode={true}
          >
            {option}
          </SoundButton>
        ))}
      </div>

      {result && (
        <div
          className="result-marker"
          style={{ color: result === 'correct' ? 'red' : 'blue' }}
        >
          {result === 'correct' ? '○' : '×'}
        </div>
      )}
    </div>
  )
}
