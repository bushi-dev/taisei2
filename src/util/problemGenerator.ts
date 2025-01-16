export interface Problem {
  question: string
  answer: number
  options: number[]
}

export const generateProblem = (
  gameType: string,
  gameDifficulty: string
): Problem => {
  // 難易度に応じた数値範囲を設定
  const difficultyRanges = {
    easy: { min: 1, max: 9 },
    medium: { min: 1, max: 99 },
    normal: { min: 10, max: 99 },
    hard: { min: 10, max: 999 },
    'very-hard': { min: 100, max: 999 },
    extreme: { min: 1000, max: 9999 },
  }

  const range =
    difficultyRanges[gameDifficulty as keyof typeof difficultyRanges] ||
    difficultyRanges.easy

  // 演算子を設定
  const operators = {
    addition: '+',
    subtraction: '-',
    multiplication: '×',
    division: '÷',
  } as const
  const operator = operators[gameType as keyof typeof operators] || '+'

  let num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
  let num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min

  let answer = 0
  if (operator === '+') {
    answer = num1 + num2
  } else if (operator === '-') {
    // 引き算の場合、num1 >= num2 になるように調整
    if (num1 < num2) {
      ;[num1, num2] = [num2, num1]
    }
    answer = num1 - num2
  } else if (operator === '×') {
    answer = num1 * num2
  } else if (operator === '÷') {
    // 割り算の場合、num1がnum2の倍数になるように調整
    num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
    num1 = num2 * (Math.floor(Math.random() * 10) + 1)
    answer = num1 / num2
  }

  const options = [
    answer,
    answer + Math.floor(Math.random() * 5) + 1,
    answer - Math.floor(Math.random() * 5) - 1,
  ].sort(() => Math.random() - 0.5)

  return {
    question: `${num1} ${operator} ${num2}`,
    answer,
    options,
  }
}
