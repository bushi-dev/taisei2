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
  concertFlag?: boolean;
  hideyoshiBrothersFlag?: boolean;
}

type GroupFilter = 'all' | 'concert' | 'hideyoshi' | 'other';

const groupInfo: Record<GroupFilter, { label: string; icon: string; description: string }> = {
  all: { label: 'すべて', icon: '⚔️', description: '全ての武将' },
  concert: { label: '信長コンチェルト', icon: '🎭', description: '信長コンチェルトに登場する武将' },
  hideyoshi: { label: '秀吉兄弟', icon: '🌅', description: '秀吉兄弟組の武将' },
  other: { label: 'その他', icon: '🏯', description: 'その他の武将' },
};

const HistoryLevel = () => {
  const navigate = useNavigate();
  const { playBgm } = useSoundManager();
  const [warlords, setWarlords] = useState<Warlord[]>([]);
  const [hoveredWarlordId, setHoveredWarlordId] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<GroupFilter>('all');
  const [selectedWarlordId, setSelectedWarlordId] = useState<number | null>(null);

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

  const handleWarlordTap = (warlordId: number) => {
    if (selectedWarlordId === warlordId) {
      // 同じカードをタップしたら選択解除
      setSelectedWarlordId(null);
    } else {
      setSelectedWarlordId(warlordId);
    }
  };

  const handleConfirm = () => {
    if (selectedWarlordId) {
      navigate(`/warlord/${selectedWarlordId}`);
    }
  };

  // ホバー中の武将の関連都道府県を取得
  const getHighlightedPrefectures = () => {
    if (!hoveredWarlordId) return [];
    const warlord = warlords.find((w) => w.id === hoveredWarlordId);
    return warlord?.relatedPrefectures || [];
  };

  // グループでフィルタリング
  const getFilteredWarlords = () => {
    switch (selectedGroup) {
      case 'concert':
        return warlords.filter((w) => w.concertFlag === true);
      case 'hideyoshi':
        return warlords.filter((w) => w.hideyoshiBrothersFlag === true);
      case 'other':
        return warlords.filter((w) => !w.concertFlag && !w.hideyoshiBrothersFlag);
      default:
        return warlords;
    }
  };

  const filteredWarlords = getFilteredWarlords();

  return (
    <div className="history-container">
      <JapanMap
        onPrefectureClick={() => {}}
        selectedPrefecture={null}
        highlightedPrefectures={getHighlightedPrefectures()}
        showLabels={true}
      />

      {/* グループ選択タブ */}
      <div className="warlord-group-tabs">
        {(Object.keys(groupInfo) as GroupFilter[]).map((group) => (
          <SoundButton
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={`warlord-group-tab ${selectedGroup === group ? 'active' : ''}`}
          >
            <span className="tab-icon">{groupInfo[group].icon}</span>
            <span className="tab-label">{groupInfo[group].label}</span>
          </SoundButton>
        ))}
      </div>

      {/* 武将選択セクション */}
      <div className="warlord-selection-section">
        <div className="warlord-selection-grid">
          {filteredWarlords.map((warlord) => (
            <SoundButton
              key={warlord.id}
              onClick={() => handleWarlordTap(warlord.id)}
              className={`warlord-selection-card ${selectedWarlordId === warlord.id ? 'selected' : ''}`}
              onMouseEnter={() => setHoveredWarlordId(warlord.id)}
              onMouseLeave={() => setHoveredWarlordId(null)}
            >
              <div className="warlord-card-content">
                <div className="warlord-card-reading">{warlord.reading}</div>
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
                </div>
              </div>
            </SoundButton>
          ))}
        </div>
      </div>

      {/* 決定ボタン */}
      {selectedWarlordId && (
        <div className="warlord-confirm-container">
          <SoundButton onClick={handleConfirm} className="warlord-confirm-button">
            決定
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
