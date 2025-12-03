import { Problem } from './problemGenerator';

interface Warlord {
  id: number;
  name: string;
  reading: string;
  image?: string;
  relatedPrefectures: string[];
  biography: any[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export const generateWarlordQuizProblem = async (
  warlordId: number,
  questionIndex: number
): Promise<Problem> => {
  try {
    // 分割ファイルから武将データを読み込み
    const response = await fetch(`/json/warlords/${warlordId}.json`);
    const warlord: Warlord = await response.json();

    if (!warlord) {
      throw new Error(`Warlord with id ${warlordId} not found`);
    }

    // questionIndexが0-9の範囲内であることを確認
    const quizIndex = Math.min(questionIndex, warlord.quiz.length - 1);
    const quizQuestion = warlord.quiz[quizIndex];

    // 選択肢をシャッフル
    const shuffledOptions = quizQuestion.options
      .map((option, index) => ({ option, originalIndex: index }))
      .sort(() => Math.random() - 0.5);

    const correctAnswerIndex = shuffledOptions.findIndex(
      (item) => item.originalIndex === quizQuestion.correctAnswer
    );

    return {
      question: quizQuestion.question,
      answer: correctAnswerIndex,
      options: shuffledOptions.map((item) => item.option),
      reading: warlord.reading,
    };
  } catch (error) {
    console.error('Error generating warlord quiz problem:', error);
    return {
      question: 'エラーが発生しました',
      answer: 0,
      options: ['エラー', '再読込', '戻る'],
      reading: '',
    };
  }
};

export const getWarlordQuizCount = (): number => {
  return 10; // 10問のクイズ
};
