import React from 'react'
import SoundButton from '../SoundButton'

type BattleQuestionProps = {
  question: string
  options: number[]
  result: 'correct' | 'wrong' | null
  handleAnswer: (selected: number) => void
}

export const BattleQuestion: React.FC<BattleQuestionProps> = ({
  question,
  options,
  result,
  handleAnswer,
}) => {
  return (
    <div className="battle-question">
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
