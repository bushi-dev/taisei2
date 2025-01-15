export interface Problem {
  question: string
  answer: number
  options: number[]
}

export const generateProblem = (enemyCount: number): Problem => {
  // 敵の数に応じて問題の難易度を調整
  let maxNum = 9 // デフォルト値
  let operator = '+'

  if (enemyCount <= 9 || (enemyCount >= 11 && enemyCount <= 19)) {
    // 1-9体、11-19体: 1桁の足し算
    maxNum = 9
    operator = '+'
  } else if (
    enemyCount === 10 ||
    enemyCount === 20 ||
    enemyCount === 30 ||
    (enemyCount >= 31 && enemyCount <= 39) ||
    (enemyCount >= 41 && enemyCount <= 49)
  ) {
    // 10体目、20体目、30体目、31-39体、41-49体: 2桁の足し算
    maxNum = 99
    operator = '+'
  } else if (enemyCount >= 21 && enemyCount <= 29) {
    // 21-29体: 1桁の引き算
    maxNum = 9
    operator = '-'
  } else if (enemyCount === 40 || enemyCount === 50) {
    // 40体目、50体目: 2桁の引き算
    maxNum = 99
    operator = '-'
  }

  let num1 = Math.floor(Math.random() * maxNum) + 1
  let num2 = Math.floor(Math.random() * maxNum) + 1

  let answer
  if (operator === '+') {
    answer = num1 + num2
  } else {
    // 引き算の場合、num1 >= num2 になるように調整
    if (num1 < num2) {
      ;[num1, num2] = [num2, num1]
    }
    answer = num1 - num2
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
