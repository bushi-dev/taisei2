import { Problem } from './problemGenerator';

// index.jsonの基本情報
interface WarlordIndex {
  id: number;
  name: string;
  reading: string;
  image?: string;
  relatedPrefectures: string[];
}

// 個別ファイルの詳細情報
interface WarlordDetail {
  id: number;
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
    // index.jsonと個別ファイルを並行して読み込み
    const [indexResponse, detailResponse] = await Promise.all([
      fetch('/json/warlords/index.json'),
      fetch(`/json/warlords/${warlordId}.json`)
    ]);
    const indexData: WarlordIndex[] = await indexResponse.json();
    const detailData: WarlordDetail = await detailResponse.json();

    // index.jsonからreadingを取得
    const warlordBase = indexData.find((w) => w.id === warlordId);
    if (!warlordBase || !detailData) {
      throw new Error(`Warlord with id ${warlordId} not found`);
    }

    // questionIndexが0-9の範囲内であることを確認
    const quizIndex = Math.min(questionIndex, detailData.quiz.length - 1);
    const quizQuestion = detailData.quiz[quizIndex];

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
      reading: warlordBase.reading,
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
