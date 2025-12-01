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
      {/* 日本地図（武将名オーバーレイ付き） */}
      <div className="warlord-map-container">
        <JapanMap
          selectedPrefecture={null}
          onPrefectureClick={() => {}}
          highlightedPrefectures={warlord.relatedPrefectures}
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

            <SoundButton onClick={handleStartQuiz} className="warlord-quiz-btn">
              🎲 クイズに挑戦
            </SoundButton>

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
    </div>
  );
};

export default WarlordDetail;
