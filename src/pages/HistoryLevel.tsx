import { useEffect, useState } from 'react';
import { useSoundManager } from '../components/SoundManager';
import { useNavigate } from 'react-router-dom';
import SoundButton from '../components/SoundButton';
import JapanMap from '../components/JapanMap';
import './HistoryLevel.css';
import { getPath } from '../util/util';

interface Warlord {
  id: number;
  name: string;
  reading: string;
  image?: string;
  relatedPrefectures: string[];
}

const HistoryLevel = () => {
  const navigate = useNavigate();
  const { playBgm } = useSoundManager();
  const [warlords, setWarlords] = useState<Warlord[]>([]);
  const [hoveredWarlordId, setHoveredWarlordId] = useState<number | null>(null);

  useEffect(() => {
    // BGM再生
    playBgm('/sound/bgm1.mp3', 0.1);

    // 武将データを読み込み（インデックスファイルから）
    fetch('/json/warlords/index.json')
      .then((res) => res.json())
      .then((data) => {
        setWarlords(data);
      })
      .catch((err) => console.error('Failed to load warlord data:', err));
  }, [playBgm]);

  const handleWarlordSelect = (warlordId: number) => {
    navigate(`/warlord/${warlordId}`);
  };

  // ホバー中の武将の関連都道府県を取得
  const getHighlightedPrefectures = () => {
    if (!hoveredWarlordId) return [];
    const warlord = warlords.find((w) => w.id === hoveredWarlordId);
    return warlord?.relatedPrefectures || [];
  };

  return (
    <div className="history-container">
      <JapanMap
        onPrefectureClick={() => {}}
        selectedPrefecture={null}
        highlightedPrefectures={getHighlightedPrefectures()}
        showLabels={true}
      />

      {/* 武将選択セクション */}
      <div className="warlord-selection-section">
        <div className="warlord-selection-grid">
          {warlords.map((warlord) => (
            <SoundButton
              key={warlord.id}
              onClick={() => handleWarlordSelect(warlord.id)}
              className="warlord-selection-card"
              onMouseEnter={() => setHoveredWarlordId(warlord.id)}
              onMouseLeave={() => setHoveredWarlordId(null)}
            >
              <div className="warlord-card-content">
                {warlord.image && (
                  <img
                    src={getPath(warlord.image)}
                    alt={warlord.name}
                    className="warlord-card-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="warlord-card-info">
                  <div className="warlord-card-name">{warlord.name}</div>
                  <div className="warlord-card-reading">{warlord.reading}</div>
                  <div className="warlord-card-prefectures">
                    {warlord.relatedPrefectures.join('・')}
                  </div>
                </div>
              </div>
            </SoundButton>
          ))}
        </div>
      </div>

      <SoundButton onClick={() => navigate('/')} className="back-button-level">
        <img
          src={getPath('/image/back.png')}
          alt="戻る"
          style={{ width: '45px', height: '45px' }}
        />
      </SoundButton>
    </div>
  );
};

export default HistoryLevel;
