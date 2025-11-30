import { useEffect } from 'react';
import { useSoundManager } from '../components/SoundManager';
import { useNavigate } from 'react-router-dom';
import SoundButton from '../components/SoundButton';
import JapanMap from '../components/JapanMap';
import './HistoryLevel.css';
import { getPath } from '../util/util';

const HistoryLevel = () => {
  const navigate = useNavigate();
  const { playBgm } = useSoundManager();

  useEffect(() => {
    // BGM再生
    playBgm('/sound/bgm1.mp3', 0.1);
    localStorage.setItem('historyMode', 'true');
  }, [playBgm]);

  const handlePrefectureClick = (prefectureId: number, prefectureName: string) => {
    localStorage.setItem('selectedPrefecture', prefectureId.toString());
    localStorage.setItem('selectedPrefectureName', prefectureName);
    localStorage.setItem('gameDifficulty', 'easy');
    localStorage.setItem('gameType', 'history');
    navigate('/battle');
  };

  const handleMixClick = () => {
    localStorage.setItem('selectedPrefecture', 'mix');
    localStorage.setItem('selectedPrefectureName', '全国ミックス');
    localStorage.setItem('gameDifficulty', 'easy');
    localStorage.setItem('gameType', 'history');
    navigate('/battle');
  };

  return (
    <div className="history-container">
      <h1 className="history-heading">🏯 戦国時代 都道府県クイズ</h1>
      <p className="history-description">都道府県を選んで、戦国時代に誰が治めていたか当てよう！</p>

      <SoundButton onClick={handleMixClick} className="history-mix-button">
        🎲 全国ミックス
      </SoundButton>

      <JapanMap onPrefectureClick={handlePrefectureClick} />

      <SoundButton onClick={() => navigate('/')} className="back-button-level">
        <img
          src={getPath('/image/back.png')}
          alt="戻る"
          style={{ width: '55px', height: '55px' }}
        />
      </SoundButton>
    </div>
  );
};

export default HistoryLevel;
