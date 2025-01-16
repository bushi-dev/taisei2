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
  interface Range {
    min1: number
    max1: number
    min2: number
    max2: number
  }

  const difficultyRanges: Record<string, Range> = {
    easy: { min1: 1, max1: 9, min2: 1, max2: 9 },
    medium: { min1: 1, max1: 9, min2: 10, max2: 99 },
    normal: { min1: 10, max1: 99, min2: 10, max2: 99 },
    hard: { min1: 10, max1: 99, min2: 100, max2: 999 },
    very_hard: { min1: 100, max1: 999, min2: 100, max2: 999 },
    extreme: { min1: 1000, max1: 9999, min2: 1000, max2: 9999 },
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

  // 50%の確率で1桁+2桁 or 2桁+1桁を選択
  const shouldSwap = Math.random() < 0.5
  let num1 =
    Math.floor(Math.random() * (range.max1 - range.min1 + 1)) + range.min1
  let num2 =
    Math.floor(Math.random() * (range.max2 - range.min2 + 1)) + range.min2

  if (shouldSwap) {
    ;[num1, num2] = [num2, num1]
  }

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
    num2 =
      Math.floor(Math.random() * (range.max2 - range.min2 + 1)) + range.min2
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
