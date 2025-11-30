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

const HistoryLevel = () => {
  const navigate = useNavigate();
  const { playBgm } = useSoundManager();
  const [selectedPrefecture, setSelectedPrefecture] = useState<SelectedInfo | null>(null);
  const [sengokuData, setSengokuData] = useState<SengokuData[]>([]);

  useEffect(() => {
    // BGM再生
    playBgm('/sound/bgm1.mp3', 0.1);
    localStorage.setItem('historyMode', 'true');

    // 戦国データを読み込み
    fetch('/json/sengoku.json')
      .then((res) => res.json())
      .then((data) => setSengokuData(data))
      .catch((err) => console.error('Failed to load sengoku data:', err));
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

  // 選択された都道府県の番号を取得（地図のハイライト用）
  const getPrefectureNumber = () => {
    if (!selectedPrefecture) return null;
    const pref = prefectures.find((p) => p.id === selectedPrefecture.id);
    return pref ? pref.id : null;
  };

  return (
    <div className="history-container">
      <h1 className="history-heading">🏯 戦国時代 都道府県クイズ</h1>

      <JapanMap
        onPrefectureClick={handlePrefectureClick}
        selectedPrefecture={getPrefectureNumber()}
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
                  <div className="lord-name-row">
                    <span className="lord-name">{lord.name}</span>
                    <span className="lord-reading">（{lord.reading}）</span>
                  </div>
                  <p className="lord-description">{lord.description}</p>
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
