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

interface Warlord {
  id: number;
  name: string;
  reading: string;
  image?: string;
  relatedPrefectures: string[];
  biography: BiographyStage[];
  quiz: Quiz[];
}

const WarlordDetail = () => {
  const navigate = useNavigate();
  const { warlordId } = useParams<{ warlordId: string }>();
  const { playBgm } = useSoundManager();
  const [warlord, setWarlord] = useState<Warlord | null>(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [warlords, setWarlords] = useState<Warlord[]>([]);

  useEffect(() => {
    // BGM再生
    playBgm('/sound/bgm1.mp3', 0.1);

    // 武将データを読み込み
    fetch('/json/sengoku_warlords.json')
      .then((res) => res.json())
      .then((data) => {
        setWarlords(data);
        const selectedWarlord = data.find((w: Warlord) => w.id === parseInt(warlordId || '1'));
        setWarlord(selectedWarlord || data[0]);
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
    const selected = warlords.find((w) => w.id === selectedWarlordId);
    if (selected) {
      setWarlord(selected);
      setCurrentStage(1);
      navigate(`/warlord/${selectedWarlordId}`);
    }
  };

  if (!warlord) {
    return <div className="warlord-loading">読み込み中...</div>;
  }

  const currentBiography = warlord.biography.find((b) => b.stage === currentStage);

  return (
    <div className="warlord-detail-container">
      <h1 className="warlord-detail-heading">🏯 {warlord.name}編</h1>

      {/* 日本地図 */}
      <div className="warlord-map-container">
        <JapanMap
          selectedPrefecture={null}
          onPrefectureClick={() => {}}
          highlightedPrefectures={warlord.relatedPrefectures}
        />
      </div>

      {/* 生涯情報パネル */}
      {currentBiography && (
        <div className="warlord-biography-panel">
          <div className="warlord-biography-header">
            <div className="warlord-stage-info">
              <span className="warlord-stage-number">ステージ {currentStage}</span>
              <span className="warlord-stage-year">{currentBiography.year}</span>
            </div>
          </div>

          <div className="warlord-biography-content">
            <h2 className="warlord-biography-title">{currentBiography.title}</h2>
            <p className="warlord-biography-description">{currentBiography.description}</p>

            {currentBiography.locations && currentBiography.locations.length > 0 && (
              <div className="warlord-locations">
                <div className="warlord-locations-label">関連地名：</div>
                <div className="warlord-locations-list">
                  {currentBiography.locations.map((location, index) => (
                    <span key={index} className="warlord-location-tag">
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ページネーションボタン */}
          <div className="warlord-pagination">
            <SoundButton
              onClick={handlePrevStage}
              disabled={currentStage === 1}
              className="warlord-pagination-btn prev"
            >
              ← 前へ
            </SoundButton>

            <div className="warlord-pagination-indicator">{currentStage} / 10</div>

            <SoundButton
              onClick={handleNextStage}
              disabled={currentStage === 10}
              className="warlord-pagination-btn next"
            >
              次へ →
            </SoundButton>
          </div>
        </div>
      )}

      {/* クイズ開始ボタン */}
      <div className="warlord-quiz-section">
        <SoundButton onClick={handleStartQuiz} className="warlord-quiz-btn">
          🎲 {warlord.name}編に挑戦する
        </SoundButton>
      </div>

      {/* 武将選択ボタン */}
      <div className="warlord-selector">
        <div className="warlord-selector-label">武将を選択：</div>
        <div className="warlord-selector-buttons">
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
      </div>

      {/* 戻るボタン */}
      <SoundButton onClick={() => navigate('/history-level')} className="back-button-level">
        <img
          src={getPath('/image/back.png')}
          alt="戻る"
          style={{ width: '45px', height: '45px' }}
        />
      </SoundButton>
    </div>
  );
};

export default WarlordDetail;
