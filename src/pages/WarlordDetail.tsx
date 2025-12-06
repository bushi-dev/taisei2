import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSoundManager } from '../components/SoundManager';
import SoundButton from '../components/SoundButton';
import JapanMap from '../components/JapanMap';
import './WarlordDetail.css';
import { getPath } from '../util/util';

// Fisher-Yatesシャッフル
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface BiographyStage {
  stage: number;
  year: string;
  title: string;
  description: string;
  locations?: string[];
}

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// index.jsonから読み込む基本情報
interface WarlordIndex {
  id: number;
  name: string;
  reading: string;
  image?: string;
  relatedPrefectures: string[];
}

// 個別ファイルから読み込む詳細情報
interface WarlordDetail {
  id: number;
  biography: BiographyStage[];
  quiz: Quiz[];
}

// 統合された武将情報
interface Warlord extends WarlordIndex {
  biography: BiographyStage[];
  quiz: Quiz[];
}

// 漫画が存在する武将のID一覧（ファイル名はID.pngの形式）
const mangaIds = new Set([1, 2]); // 1: 織田信長, 2: 前田利家

// 漫画パスを取得する関数
const getMangaPath = (id: number) => `/image/manga/${id}.png`;

// 漫画コマの背景位置を計算する関数
// 漫画は5列×2行（上段:1-5, 下段:6-10）
const getMangaPanelPosition = (stage: number): string => {
  const col = (stage - 1) % 5;
  const row = Math.floor((stage - 1) / 5);
  const x = (col / 4) * 100;
  const y = row * 100;
  return `${x}% ${y}%`;
};

type FontSize = 'small' | 'medium' | 'large';

const fontSizeLabels: Record<FontSize, string> = {
  small: '小',
  medium: '中',
  large: '大',
};

const WarlordDetail = () => {
  const navigate = useNavigate();
  const { warlordId } = useParams<{ warlordId: string }>();
  const { playBgm } = useSoundManager();
  const [warlord, setWarlord] = useState<Warlord | null>(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [warlords, setWarlords] = useState<Warlord[]>([]);
  const [shuffledWarlords, setShuffledWarlords] = useState<Warlord[]>([]);
  const selectorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('mangaFontSize');
    return (saved as FontSize) || 'medium';
  });

  // 選択中の武将を中央にスクロールする関数
  const scrollToCenter = useCallback((targetId: number) => {
    if (!selectorRef.current) return;
    
    const container = selectorRef.current;
    const buttons = container.querySelectorAll('.warlord-selector-btn');
    const targetIndex = shuffledWarlords.findIndex(w => w.id === targetId);
    
    if (targetIndex >= 0 && buttons[targetIndex]) {
      const button = buttons[targetIndex] as HTMLElement;
      const containerWidth = container.offsetWidth;
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;
      
      // ボタンを中央に配置するスクロール位置
      const scrollLeft = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [shuffledWarlords]);

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem('mangaFontSize', size);
  };

  useEffect(() => {
    // BGM再生
    playBgm('/sound/bgm1.mp3', 0.1);

    // 武将データを読み込み（index.json + 個別ファイル）
    const id = parseInt(warlordId || '1');
    Promise.all([
      fetch('/json/warlords/index.json').then((res) => res.json()),
      fetch(`/json/warlords/${id}.json`).then((res) => res.json())
    ])
      .then(([indexData, detailData]: [WarlordIndex[], WarlordDetail]) => {
        setWarlords(indexData as Warlord[]);
        
        // sessionStorageからシャッフル順序を取得、なければ新規作成
        const savedOrder = sessionStorage.getItem('warlordShuffleOrder');
        let shuffled: Warlord[];
        
        if (savedOrder) {
          // 保存された順序でソート
          const orderIds: number[] = JSON.parse(savedOrder);
          shuffled = orderIds
            .map(id => indexData.find((w: WarlordIndex) => w.id === id))
            .filter((w): w is WarlordIndex => w !== undefined) as Warlord[];
        } else {
          // 新規シャッフル
          shuffled = shuffleArray(indexData as Warlord[]);
          sessionStorage.setItem('warlordShuffleOrder', JSON.stringify(shuffled.map(w => w.id)));
        }
        setShuffledWarlords(shuffled);
        
        // index.jsonの基本情報と個別ファイルの詳細情報をマージ
        const baseInfo = indexData.find((w: WarlordIndex) => w.id === id);
        if (baseInfo) {
          setWarlord({ ...baseInfo, ...detailData });
        }
      })
      .catch((err) => console.error('Failed to load warlord data:', err));
  }, [warlordId, playBgm]);

  // 武将が変わったら中央にスクロール
  useEffect(() => {
    if (warlord && shuffledWarlords.length > 0) {
      // 少し遅延させてDOMが更新されてからスクロール
      setTimeout(() => scrollToCenter(warlord.id), 100);
    }
  }, [warlord, shuffledWarlords, scrollToCenter]);

  const handleNextStage = () => {
    if (currentStage < 10) {
      setCurrentStage(currentStage + 1);
    }
  };

  const handlePrevStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const handleStartQuiz = () => {
    if (warlord) {
      localStorage.setItem('selectedWarlord', JSON.stringify(warlord));
      localStorage.setItem('gameType', 'warlord_quiz');
      navigate('/battle');
    }
  };

  const handleSelectWarlord = (selectedWarlordId: number) => {
    // 個別ファイルから詳細データを読み込み、index.jsonの基本情報とマージ
    fetch(`/json/warlords/${selectedWarlordId}.json`)
      .then((res) => res.json())
      .then((detailData: WarlordDetail) => {
        const baseInfo = warlords.find((w) => w.id === selectedWarlordId);
        if (baseInfo) {
          setWarlord({ ...baseInfo, ...detailData });
        }
        setCurrentStage(1);
        navigate(`/warlord/${selectedWarlordId}`);
      })
      .catch((err) => console.error('Failed to load warlord data:', err));
  };

  if (!warlord) {
    return <div className="warlord-loading">読み込み中...</div>;
  }

  const currentBiography = warlord.biography.find((b) => b.stage === currentStage);
  const hasManga = mangaIds.has(warlord.id);

  return (
    <div className="warlord-detail-container">
      {hasManga ? (
        /* 漫画版レイアウト */
        <>
          {/* 漫画コマ */}
          <div className="warlord-map-container">
            <div
              className="manga-panel"
              style={{
                backgroundImage: `url(${getPath(getMangaPath(warlord.id))})`,
                backgroundPosition: getMangaPanelPosition(currentStage),
              }}
            />
          </div>

          {/* 説明文とナビゲーション */}
          {currentBiography && (
            <div className="manga-biography-panel">
              <p className={`manga-description manga-description-${fontSize}`}>{currentBiography.description}</p>

              <div className="warlord-pagination">
                <SoundButton
                  onClick={handlePrevStage}
                  disabled={currentStage === 1}
                  className="warlord-pagination-btn"
                >
                  ←
                </SoundButton>

                <div className="warlord-action-buttons">
                  <span className="warlord-stage-badge">
                    {currentStage}/10
                  </span>
                  <SoundButton onClick={handleStartQuiz} className="warlord-quiz-btn">
                    🎲 クイズに挑戦
                  </SoundButton>
                </div>

                <SoundButton
                  onClick={handleNextStage}
                  disabled={currentStage === 10}
                  className="warlord-pagination-btn"
                >
                  →
                </SoundButton>
              </div>
            </div>
          )}
        </>
      ) : (
        /* 通常版レイアウト（地図あり） */
        <>
          {/* 日本地図 */}
          <div className="warlord-map-container">
            <JapanMap
              selectedPrefecture={null}
              onPrefectureClick={() => {}}
              highlightedPrefectures={warlord.relatedPrefectures}
              showLabels={true}
            />
            <div className="warlord-name-overlay">🏯 {warlord.name}編</div>
          </div>

          {/* 生涯情報パネル */}
          {currentBiography && (
            <div className="warlord-biography-panel">
              <div className="warlord-biography-header">
                <span className="warlord-stage-badge">
                  {currentStage}/10 {currentBiography.year}
                </span>
                <h2 className="warlord-biography-title">{currentBiography.title}</h2>
              </div>

              <p className={`warlord-biography-description warlord-biography-description-${fontSize}`}>{currentBiography.description}</p>

              <div className="warlord-pagination">
                <SoundButton
                  onClick={handlePrevStage}
                  disabled={currentStage === 1}
                  className="warlord-pagination-btn"
                >
                  ←
                </SoundButton>

                <div className="warlord-action-buttons">
                  <SoundButton onClick={handleStartQuiz} className="warlord-quiz-btn">
                    🎲 クイズに挑戦
                  </SoundButton>
                </div>

                <SoundButton
                  onClick={handleNextStage}
                  disabled={currentStage === 10}
                  className="warlord-pagination-btn"
                >
                  →
                </SoundButton>
              </div>
            </div>
          )}
        </>
      )}

      {/* 武将選択ボタン */}
      <div className="warlord-selector" ref={selectorRef}>
        {shuffledWarlords.map((w) => (
          <SoundButton
            key={w.id}
            onClick={() => handleSelectWarlord(w.id)}
            className={`warlord-selector-btn ${w.id === warlord.id ? 'active' : ''}`}
          >
            {w.name}
          </SoundButton>
        ))}
      </div>

      {/* 文字サイズ選択ボタン（右下） */}
      <div className="font-size-selector">
        <span className="font-size-label">文字</span>
        {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
          <SoundButton
            key={size}
            onClick={() => handleFontSizeChange(size)}
            className={`font-size-btn ${fontSize === size ? 'active' : ''}`}
          >
            {fontSizeLabels[size]}
          </SoundButton>
        ))}
      </div>

      {/* 戻るボタン */}
      <SoundButton onClick={() => navigate('/history-level')} className="back-button-level">
        <img
          src={getPath('/image/back.png')}
          alt="戻る"
          style={{ width: '40px', height: '40px' }}
        />
      </SoundButton>
    </div>
  );
};

export default WarlordDetail;
