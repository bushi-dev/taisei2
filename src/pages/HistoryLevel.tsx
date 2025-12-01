import { useEffect, useState } from 'react';
import { useSoundManager } from '../components/SoundManager';
import { useNavigate } from 'react-router-dom';
import SoundButton from '../components/SoundButton';
import JapanMap, { prefectures } from '../components/JapanMap';
import './HistoryLevel.css';
import { getPath } from '../util/util';

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

interface SelectedInfo {
  id: number;
  name: string;
  lordData?: SengokuData;
}

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
  const [selectedPrefecture, setSelectedPrefecture] = useState<SelectedInfo | null>(null);
  const [sengokuData, setSengokuData] = useState<SengokuData[]>([]);
  const [warlords, setWarlords] = useState<Warlord[]>([]);
  const [hoveredWarlordId, setHoveredWarlordId] = useState<number | null>(null);

  useEffect(() => {
    // BGM再生
    playBgm('/sound/bgm1.mp3', 0.1);
    localStorage.setItem('historyMode', 'true');

    // 戦国データを読み込み
    fetch('/json/sengoku.json')
      .then((res) => res.json())
      .then((data) => setSengokuData(data))
      .catch((err) => console.error('Failed to load sengoku data:', err));

    // 武将データを読み込み
    fetch('/json/sengoku_warlords.json')
      .then((res) => res.json())
      .then((data) => {
        const warlordList = data.map((w: any) => ({
          id: w.id,
          name: w.name,
          reading: w.reading,
          image: w.image,
          relatedPrefectures: w.relatedPrefectures,
        }));
        setWarlords(warlordList);
      })
      .catch((err) => console.error('Failed to load warlord data:', err));
  }, [playBgm]);

  const handlePrefectureClick = (prefectureId: number, prefectureName: string) => {
    const lordData = sengokuData.find((d) => d.id === prefectureId);
    setSelectedPrefecture({ id: prefectureId, name: prefectureName, lordData });
  };

  const handleStartGame = () => {
    // 全国ミックスモードで開始
    localStorage.setItem('selectedPrefecture', 'mix');
    localStorage.setItem('selectedPrefectureName', '全国ミックス');
    localStorage.setItem('gameDifficulty', 'easy');
    localStorage.setItem('gameType', 'history');
    navigate('/battle');
  };

  const handleCancelSelection = () => {
    setSelectedPrefecture(null);
  };

  const handleWarlordSelect = (warlordId: number) => {
    navigate(`/warlord/${warlordId}`);
  };

  // 選択された都道府県の番号を取得（地図のハイライト用）
  const getPrefectureNumber = () => {
    if (!selectedPrefecture) return null;
    const pref = prefectures.find((p) => p.id === selectedPrefecture.id);
    return pref ? pref.id : null;
  };

  // ホバー中の武将の関連都道府県を取得
  const getHighlightedPrefectures = () => {
    if (!hoveredWarlordId) return [];
    const warlord = warlords.find((w) => w.id === hoveredWarlordId);
    return warlord?.relatedPrefectures || [];
  };

  return (
    <div className="history-container">
      <h1 className="history-heading">🏯 戦国時代 都道府県クイズ</h1>

      <JapanMap
        onPrefectureClick={handlePrefectureClick}
        selectedPrefecture={getPrefectureNumber()}
        highlightedPrefectures={getHighlightedPrefectures()}
      />

      {/* 大名情報パネル */}
      {selectedPrefecture && selectedPrefecture.lordData && (
        <div className="lord-info-panel">
          <div className="lord-header">
            <span className="lord-prefecture">{selectedPrefecture.name}</span>
            <SoundButton onClick={handleCancelSelection} className="lord-close-btn">
              ✕
            </SoundButton>
          </div>
          <div className="lord-content">
            <div className="lord-label">有名な大名</div>
            <div className="lords-list">
              {selectedPrefecture.lordData.lords.map((lord, index) => (
                <div key={index} className="lord-item">
                  <div className="lord-item-content">
                    <div className="lord-image-container">
                      <img
                        src={getPath(lord.image || '/image/nin.png')}
                        alt={lord.name}
                        className="lord-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getPath('/image/nin.png');
                        }}
                      />
                    </div>
                    <div className="lord-info">
                      <div className="lord-name-row">
                        <span className="lord-name">{lord.name}</span>
                        <span className="lord-reading">（{lord.reading}）</span>
                      </div>
                      <p className="lord-description">{lord.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <SoundButton onClick={handleStartGame} className="lord-start-btn">
            🎲 クイズに挑戦！
          </SoundButton>
        </div>
      )}

      {/* 選択されていない場合のボタン */}
      {!selectedPrefecture && (
        <div className="history-buttons">
          <SoundButton onClick={handleStartGame} className="history-mix-button">
            🎲 全国ミックスで開始
          </SoundButton>
        </div>
      )}

      {/* 武将選択セクション */}
      <div className="warlord-selection-section">
        <h2 className="warlord-selection-heading">武将を選択して、その一生を学ぼう！</h2>

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
