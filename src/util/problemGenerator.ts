export interface Problem {
  question: string;
  answer: number | string;
  options: (number | string)[];
  reading?: string;
}

interface KukuData {
  number: number;
  reading: string;
  formula: string;
  answer: number;
}

interface Lord {
  name: string;
  reading: string;
  description: string;
  image?: string;
}

interface SengokuData {
  id: number;
  prefecture: string;
  lords: Lord[];
}

export const isHistoryMode = (): boolean => {
  const gameType = localStorage.getItem('gameType');
  return gameType === 'history';
};

export const isKukuMode = (gameDifficulty: string): boolean => {
  const kukuValue = localStorage.getItem('kuku');
  return gameDifficulty === 'easy' && !!kukuValue;
};

export const getBossCount = (gameDifficulty: string): number => {
  return isKukuMode(gameDifficulty) ? 9 : 4;
};

export const isBossBattle = (): boolean => {
  return !!window.location.href.match(/boss/);
};

export const generateHistoryProblem = async (enemyCount = 1): Promise<Problem> => {
  try {
    const response = await fetch('/json/sengoku.json');
    const sengokuData: SengokuData[] = await response.json();

    const selectedPrefecture = localStorage.getItem('selectedPrefecture');
    let prefectureData: SengokuData;

    if (selectedPrefecture === 'mix') {
      // ミックスモード: ランダムな都道府県を選択
      const shuffled = sengokuData.slice().sort(() => Math.random() - 0.5);
      prefectureData = shuffled[(enemyCount - 1) % shuffled.length];
    } else {
      // 特定の都道府県
      const prefId = parseInt(selectedPrefecture || '1');
      prefectureData = sengokuData.find((d) => d.id === prefId) || sengokuData[0];
    }

    // この都道府県の大名からランダムに1人選ぶ
    const lords = prefectureData.lords;
    const selectedLord = lords[Math.floor(Math.random() * lords.length)];

    // 選択肢を生成（正解 + 他の都道府県からランダムに2人）
    const otherLords = sengokuData
      .filter((d) => d.id !== prefectureData.id)
      .flatMap((d) => d.lords)
      .map((l) => l.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    const options = [selectedLord.name, ...otherLords].sort(() => Math.random() - 0.5);

    return {
      question: `${prefectureData.prefecture}を治めていたのは？`,
      answer: selectedLord.name,
      options,
      reading: selectedLord.reading,
    };
  } catch (error) {
    console.error('Error loading sengoku data:', error);
    return {
      question: 'エラーが発生しました',
      answer: 'エラー',
      options: ['エラー', '再読込', '戻る'],
      reading: '',
    };
  }
};

export const generateProblem = async (
  gameType: string,
  gameDifficulty: string,
  enemyCount = 1
): Promise<Problem> => {
  // 歴史モードの場合は専用の問題生成を使用
  if (gameType === 'history') {
    return generateHistoryProblem(enemyCount);
  }

  let ans;
  // ボス戦の場合、10%で難易度を一時的に1段階上げる
  //は一旦廃止
  if (isBossBattle() && Math.random() < 0) {
    const difficultyLevels = ['easy', 'medium', 'normal', 'hard', 'very_hard', 'extreme'];
    const currentIndex = difficultyLevels.indexOf(gameDifficulty);
    if (currentIndex < difficultyLevels.length - 1) {
      gameDifficulty = difficultyLevels[currentIndex + 1];
    }
  }
  // 難易度に応じた数値範囲を設定
  interface Range {
    min1: number;
    max1: number;
    min2: number;
    max2: number;
    min3?: number;
    max3?: number;
  }

  const difficultyRanges: Record<string, Range> = {
    easy: { min1: 1, max1: 9, min2: 1, max2: 9 },
    medium: { min1: 1, max1: 9, min2: 1, max2: 9, min3: 1, max3: 9 },
    normal: { min1: 10, max1: 99, min2: 1, max2: 9 },
    hard: { min1: 10, max1: 99, min2: 1, max2: 9, min3: 1, max3: 9 },
    very_hard: { min1: 10, max1: 99, min2: 10, max2: 99 },
    extreme: { min1: 10, max1: 99, min2: 10, max2: 99, min3: 1, max3: 9 },
  };

  const range =
    difficultyRanges[gameDifficulty as keyof typeof difficultyRanges] || difficultyRanges.easy;

  // 演算子を設定
  const operators = {
    addition: '+',
    subtraction: '-',
    multiplication: '×',
    division: '÷',
  } as const;
  const operator = operators[gameType as keyof typeof operators] || '+';

  // 50%の確率で1桁+2桁 or 2桁+1桁を選択
  const shouldSwap = Math.random() < 0.5;
  let num1 = Math.floor(Math.random() * (range.max1 - range.min1 + 1)) + range.min1;
  let num2 = Math.floor(Math.random() * (range.max2 - range.min2 + 1)) + range.min2;
  let num3 =
    range.min3 && range.max3
      ? Math.floor(Math.random() * (range.max3 - range.min3 + 1)) + range.min3
      : 0;

  if (shouldSwap) {
    [num1, num2] = [num2, num1];
  }

  let answer = 0;
  let currentProblemReading: string | undefined;
  const kukuLevel = localStorage.getItem('kuku');

  if (operator === '+') {
    answer = num3 ? num1 + num2 + num3 : num1 + num2;
  } else if (operator === '-') {
    if (num3) {
      if (num1 < num2 + num3) {
        [num1, num2] = [num2 + num3, num1];
      }
      answer = num1 - num2 - num3;
    } else {
      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }
      answer = num1 - num2;
    }
  } else if (operator === '×') {
    if (gameDifficulty === 'easy') {
      console.log('kukujson');
      const kukuValue = localStorage.getItem('kuku');
      try {
        // kuku.jsonからデータを取得
        const response = await fetch('/json/kuku.json');
        const kukuData: KukuData[] = await response.json();

        // 現在の数字に対応するデータをフィルタリング
        const currentNumber = parseInt(kukuLevel || '1');
        let levelData;
        if (kukuValue === 'mix') {
          levelData = kukuData.slice().sort(() => Math.random() - 0.5);
        } else {
          levelData = kukuData.filter((item) => item.number === currentNumber);
          const mix = localStorage.getItem('mix');
          if (mix === 'true') {
            levelData = levelData.slice().sort(() => Math.random() - 0.5);
          }
        }

        if (levelData.length > 0) {
          console.log('Current enemyCount:', enemyCount);
          const index = Math.max(0, Math.min(8, (enemyCount - 1) % 9));
          console.log('Calculated index:', index);

          // 問題データを設定
          num1 = currentNumber;
          num2 = index + 1;
          answer = levelData[index].answer;
          currentProblemReading = levelData[index].reading;
          ans = levelData[index].formula;
          console.log('Set problem data:', {
            num1,
            num2,
            answer,
            reading: currentProblemReading,
          });
        }
      } catch (error) {
        console.error('Error loading kuku data:', error);
      }
    } else if (num3) {
      // 通常の3数演算
      const num3Range = {
        easy: { min: 1, max: 3 },
        medium: { min: 1, max: 5 },
        normal: { min: 1, max: 7 },
        hard: { min: 1, max: 9 },
        very_hard: { min: 2, max: 9 },
        extreme: { min: 3, max: 9 },
      }[gameDifficulty] || { min: 1, max: 9 };

      num3 = Math.floor(Math.random() * (num3Range.max - num3Range.min + 1)) + num3Range.min;
      answer = num1 * num2 * num3;
    } else {
      answer = num1 * num2;
    }
  } else if (operator === '÷') {
    num2 = Math.floor(Math.random() * (range.max2 - range.min2 + 1)) + range.min2;
    if (num3) {
      // num3を1-9の範囲で生成
      num3 = Math.floor(Math.random() * 9) + 1;
      // num1をnum2とnum3の倍数にする
      const multiplier = Math.floor(Math.random() * 9) + 1;
      num1 = num2 * num3 * multiplier;
      answer = multiplier;
    } else {
      num1 = num2 * (Math.floor(Math.random() * 10) + 1);
      answer = num1 / num2;
    }
  }

  const options = [
    answer,
    answer + Math.floor(Math.random() * 5) + 1,
    answer - Math.floor(Math.random() * 5) - 1,
  ].sort(() => Math.random() - 0.5);
  let question;
  question = num3
    ? `${num1} ${operator} ${num2} ${operator} ${num3}`
    : `${num1} ${operator} ${num2}`;
  if (ans) {
    question = ans!;
  }
  return {
    question: question,
    answer,
    options,
    reading: currentProblemReading,
  };
};
