import { useEffect, useState, useCallback } from 'react';
import { useSoundManager } from '../components/SoundManager';
import { useNavigate } from 'react-router-dom';
import SoundButton from '../components/SoundButton';
import './Title.css';
import { getPath } from '../util/util';

const Title = () => {
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);

  const { playBgm, tryUnlock } = useSoundManager();

  // タップで開始（音声アンロック）
  const handleStart = useCallback(async () => {
    if (isStarted) return;

    // 音声をアンロック
    await tryUnlock();

    // BGM再生
    playBgm('/sound/bgm1.mp3', 0.1);

    setIsStarted(true);
  }, [isStarted, tryUnlock, playBgm]);

  // キー入力でも開始できるように
  useEffect(() => {
    const handleKeyDown = () => {
      handleStart();
    };

    if (!isStarted) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isStarted, handleStart]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://my-cloudflare-worker.ytakeshi-7.workers.dev/list', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Response:', res);
        const text = await res.text();
        console.log('Text:', text);
        localStorage.setItem('treasures', text);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // 開始前はタップ画面を表示
  if (!isStarted) {
    return (
      <div className="title-screen title-screen--start" onClick={handleStart}>
        <h1 className="title-screen__heading">たいせい忍者</h1>
        <img
          src={getPath('/image/nin.png')}
          alt="ninja"
          className="title-screen__ninja title-screen__ninja--bounce"
        />
        <p className="title-screen__tap-text">画面をタップしてね</p>
      </div>
    );
  }

  return (
    <div className="title-screen">
      <h1 className="title-screen__heading">たいせい忍者</h1>
      <img src={getPath('/image/nin.png')} alt="ninja" className="title-screen__ninja" />

      <SoundButton className="title-screen__button start" onClick={() => navigate('/level')}>
        冒険を始める
      </SoundButton>

      <SoundButton className="title-screen__button kuku" onClick={() => navigate('/kuku-level')}>
        九九モード
      </SoundButton>

      <SoundButton
        className="title-screen__button history"
        onClick={() => navigate('/history-level')}
      >
        歴史モード
      </SoundButton>

      <SoundButton className="title-screen__button treasure" onClick={() => navigate('/treasure')}>
        秘宝の記録
      </SoundButton>
    </div>
  );
};

export default Title;
