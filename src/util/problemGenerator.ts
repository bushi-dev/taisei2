export interface Problem {
  question: string
  answer: number
  options: number[]
}

export const generateProblem = (
  gameType: string,
  gameDifficulty: string,
  isBossBattle = false
): Problem => {
  // ボス戦の場合、10%で難易度を一時的に1段階上げる
  if (isBossBattle && Math.random() < 0.1) {
    const difficultyLevels = [
      'easy',
      'medium',
      'normal',
      'hard',
      'very_hard',
      'extreme',
    ]
    const currentIndex = difficultyLevels.indexOf(gameDifficulty)
    if (currentIndex < difficultyLevels.length - 1) {
      gameDifficulty = difficultyLevels[currentIndex + 1]
    }
  }
  // 難易度に応じた数値範囲を設定
  interface Range {
    min1: number
    max1: number
    min2: number
    max2: number
    min3?: number
    max3?: number
  }

  const difficultyRanges: Record<string, Range> = {
    easy: { min1: 1, max1: 9, min2: 1, max2: 9 },
    medium: { min1: 1, max1: 9, min2: 1, max2: 9, min3: 1, max3: 9 },
    normal: { min1: 10, max1: 99, min2: 1, max2: 9 },
    hard: { min1: 10, max1: 99, min2: 1, max2: 9, min3: 1, max3: 9 },
    very_hard: { min1: 10, max1: 99, min2: 10, max2: 99 },
    extreme: { min1: 10, max1: 99, min2: 10, max2: 99, min3: 1, max3: 9 },
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
  let num3 =
    range.min3 && range.max3
      ? Math.floor(Math.random() * (range.max3 - range.min3 + 1)) + range.min3
      : 0

  if (shouldSwap) {
    ;[num1, num2] = [num2, num1]
  }

  let answer = 0
  if (operator === '+') {
    answer = num3 ? num1 + num2 + num3 : num1 + num2
  } else if (operator === '-') {
    if (num3) {
      if (num1 < num2 + num3) {
        ;[num1, num2] = [num2 + num3, num1]
      }
      answer = num1 - num2 - num3
    } else {
      if (num1 < num2) {
        ;[num1, num2] = [num2, num1]
      }
      answer = num1 - num2
    }
  } else if (operator === '×') {
    if (num3) {
      // num3の範囲を難易度に応じて調整
      const num3Range = {
        easy: { min: 1, max: 3 },
        medium: { min: 1, max: 5 },
        normal: { min: 1, max: 7 },
        hard: { min: 1, max: 9 },
        very_hard: { min: 2, max: 9 },
        extreme: { min: 3, max: 9 },
      }[gameDifficulty] || { min: 1, max: 9 }

      num3 =
        Math.floor(Math.random() * (num3Range.max - num3Range.min + 1)) +
        num3Range.min
      answer = num1 * num2 * num3
    } else {
      answer = num1 * num2
    }
  } else if (operator === '÷') {
    num2 =
      Math.floor(Math.random() * (range.max2 - range.min2 + 1)) + range.min2
    if (num3) {
      // num3を1-9の範囲で生成
      num3 = Math.floor(Math.random() * 9) + 1
      // num1をnum2とnum3の倍数にする
      const multiplier = Math.floor(Math.random() * 9) + 1
      num1 = num2 * num3 * multiplier
      answer = multiplier
    } else {
      num1 = num2 * (Math.floor(Math.random() * 10) + 1)
      answer = num1 / num2
    }
  }

  const options = [
    answer,
    answer + Math.floor(Math.random() * 5) + 1,
    answer - Math.floor(Math.random() * 5) - 1,
  ].sort(() => Math.random() - 0.5)

  return {
    question: num3
      ? `${num1} ${operator} ${num2} ${operator} ${num3}`
      : `${num1} ${operator} ${num2}`,
    answer,
    options,
  }
}
