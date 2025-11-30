import React from 'react';
import SoundButton from '../SoundButton';

type BattleQuestionProps = {
  question: string;
  options: (number | string)[];
  result: 'correct' | 'wrong' | null;
  handleAnswer: (selected: number | string) => void;
  reading?: string;
};

export const BattleQuestion: React.FC<BattleQuestionProps> = ({
  question,
  options,
  result,
  handleAnswer,
  reading,
}) => {
  // 文字列の選択肢があるかどうかを判定（歴史モード）
  const isTextMode = options.some((opt) => typeof opt === 'string');

  return (
    <div className="battle-question">
      {reading && <div className="battle-reading">{reading}</div>}
      <div>{question}</div>

      <div className={`battle-options ${isTextMode ? 'text-mode' : ''}`}>
        {options.map((option, i) => (
          <SoundButton
            key={i}
            onClick={() => handleAnswer(option)}
            className={`battle-button ${isTextMode ? 'text-button' : ''}`}
            isBattleMode={true}
          >
            {option}
          </SoundButton>
        ))}
      </div>

      {result && (
        <div className="result-marker" style={{ color: result === 'correct' ? 'red' : 'blue' }}>
          {result === 'correct' ? '○' : '×'}
        </div>
      )}
    </div>
  );
};
