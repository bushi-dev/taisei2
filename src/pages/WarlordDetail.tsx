import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSoundManager } from '../components/SoundManager';
import SoundButton from '../components/SoundButton';
import JapanMap from '../components/JapanMap';
import './WarlordDetail.css';
import { getPath } from '../util/util';

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

const WarlordDetail = () => {
  const navigate = useNavigate();
  const { warlordId } = useParams<{ warlordId: string }>();
  const { playBgm } = useSoundManager();
  const [warlord, setWarlord] = useState<Warlord | null>(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [warlords, setWarlords] = useState<Warlord[]>([]);
  const [showManga, setShowManga] = useState(false);

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
        // index.jsonの基本情報と個別ファイルの詳細情報をマージ
        const baseInfo = indexData.find((w: WarlordIndex) => w.id === id);
        if (baseInfo) {
          setWarlord({ ...baseInfo, ...detailData });
        }
      })
      .catch((err) => console.error('Failed to load warlord data:', err));
  }, [warlordId, playBgm]);

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

  return (
    <div className="warlord-detail-container">
      {/* 日本地図（武将名オーバーレイ付き） */}
      <div className="warlord-map-container">
        <JapanMap
          selectedPrefecture={null}
          onPrefectureClick={() => {}}
          highlightedPrefectures={warlord.relatedPrefectures}
          showLabels={true}
        />
        <div className="warlord-name-overlay">🏯 {warlord.name}編</div>
      </div>

      {/* 生涯情報パネル（コンパクト版） */}
      {currentBiography && (
        <div className="warlord-biography-panel">
          <div className="warlord-biography-header">
            <span className="warlord-stage-badge">
              {currentStage}/10 {currentBiography.year}
            </span>
            <h2 className="warlord-biography-title">{currentBiography.title}</h2>
          </div>

          <p className="warlord-biography-description">{currentBiography.description}</p>

          {/* ページネーションボタン */}
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

              {mangaIds.has(warlord.id) && (
                <SoundButton
                  onClick={() => setShowManga(true)}
                  className="warlord-manga-btn"
                >
                  📖 漫画を読む
                </SoundButton>
              )}
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

      {/* 武将選択ボタン */}
      <div className="warlord-selector">
        {warlords.map((w) => (
          <SoundButton
            key={w.id}
            onClick={() => handleSelectWarlord(w.id)}
            className={`warlord-selector-btn ${w.id === warlord.id ? 'active' : ''}`}
          >
            {w.name}
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

      {/* 漫画モーダル */}
      {showManga && mangaIds.has(warlord.id) && (
        <div className="manga-modal-overlay" onClick={() => setShowManga(false)}>
          <div className="manga-modal-content" onClick={(e) => e.stopPropagation()}>
            <SoundButton
              onClick={() => setShowManga(false)}
              className="manga-close-btn"
            >
              ✕
            </SoundButton>
            <div className="manga-image-container">
              <img
                src={getPath(getMangaPath(warlord.id))}
                alt={`${warlord.name}の漫画`}
                className="manga-image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarlordDetail;
