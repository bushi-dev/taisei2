import React, { useState } from 'react';
import Japan from '@svg-maps/japan';
import './JapanMap.css';

interface Location {
  id: string;
  name: string;
  path: string;
}

interface JapanMapProps {
  onPrefectureClick: (prefectureId: number, prefectureName: string) => void;
  selectedPrefecture?: number | null;
}

// 都道府県データ（日本語名とID）
export const prefectures = [
  { id: 1, name: '北海道', englishId: 'hokkaido' },
  { id: 2, name: '青森県', englishId: 'aomori' },
  { id: 3, name: '岩手県', englishId: 'iwate' },
  { id: 4, name: '宮城県', englishId: 'miyagi' },
  { id: 5, name: '秋田県', englishId: 'akita' },
  { id: 6, name: '山形県', englishId: 'yamagata' },
  { id: 7, name: '福島県', englishId: 'fukushima' },
  { id: 8, name: '茨城県', englishId: 'ibaraki' },
  { id: 9, name: '栃木県', englishId: 'tochigi' },
  { id: 10, name: '群馬県', englishId: 'gunma' },
  { id: 11, name: '埼玉県', englishId: 'saitama' },
  { id: 12, name: '千葉県', englishId: 'chiba' },
  { id: 13, name: '東京都', englishId: 'tokyo' },
  { id: 14, name: '神奈川県', englishId: 'kanagawa' },
  { id: 15, name: '新潟県', englishId: 'niigata' },
  { id: 16, name: '富山県', englishId: 'toyama' },
  { id: 17, name: '石川県', englishId: 'ishikawa' },
  { id: 18, name: '福井県', englishId: 'fukui' },
  { id: 19, name: '山梨県', englishId: 'yamanashi' },
  { id: 20, name: '長野県', englishId: 'nagano' },
  { id: 21, name: '岐阜県', englishId: 'gifu' },
  { id: 22, name: '静岡県', englishId: 'shizuoka' },
  { id: 23, name: '愛知県', englishId: 'aichi' },
  { id: 24, name: '三重県', englishId: 'mie' },
  { id: 25, name: '滋賀県', englishId: 'shiga' },
  { id: 26, name: '京都府', englishId: 'kyoto' },
  { id: 27, name: '大阪府', englishId: 'osaka' },
  { id: 28, name: '兵庫県', englishId: 'hyogo' },
  { id: 29, name: '奈良県', englishId: 'nara' },
  { id: 30, name: '和歌山県', englishId: 'wakayama' },
  { id: 31, name: '鳥取県', englishId: 'tottori' },
  { id: 32, name: '島根県', englishId: 'shimane' },
  { id: 33, name: '岡山県', englishId: 'okayama' },
  { id: 34, name: '広島県', englishId: 'hiroshima' },
  { id: 35, name: '山口県', englishId: 'yamaguchi' },
  { id: 36, name: '徳島県', englishId: 'tokushima' },
  { id: 37, name: '香川県', englishId: 'kagawa' },
  { id: 38, name: '愛媛県', englishId: 'ehime' },
  { id: 39, name: '高知県', englishId: 'kochi' },
  { id: 40, name: '福岡県', englishId: 'fukuoka' },
  { id: 41, name: '佐賀県', englishId: 'saga' },
  { id: 42, name: '長崎県', englishId: 'nagasaki' },
  { id: 43, name: '熊本県', englishId: 'kumamoto' },
  { id: 44, name: '大分県', englishId: 'oita' },
  { id: 45, name: '宮崎県', englishId: 'miyazaki' },
  { id: 46, name: '鹿児島県', englishId: 'kagoshima' },
  { id: 47, name: '沖縄県', englishId: 'okinawa' },
];

// 英語IDから日本語の都道府県データを取得
const getPrefectureByEnglishId = (englishId: string) => {
  return prefectures.find((p) => p.englishId === englishId);
};

// 都道府県IDから英語IDを取得
const getEnglishIdByPrefectureId = (prefectureId: number) => {
  const pref = prefectures.find((p) => p.id === prefectureId);
  return pref?.englishId;
};

// 地方の色分け
const getRegionClass = (englishId: string): string => {
  const hokkaido = ['hokkaido'];
  const tohoku = ['aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima'];
  const kanto = ['ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa'];
  const chubu = [
    'niigata',
    'toyama',
    'ishikawa',
    'fukui',
    'yamanashi',
    'nagano',
    'gifu',
    'shizuoka',
    'aichi',
  ];
  const kinki = ['mie', 'shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama'];
  const chugoku = ['tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi'];
  const shikoku = ['tokushima', 'kagawa', 'ehime', 'kochi'];
  const kyushu = [
    'fukuoka',
    'saga',
    'nagasaki',
    'kumamoto',
    'oita',
    'miyazaki',
    'kagoshima',
    'okinawa',
  ];

  if (hokkaido.includes(englishId)) return 'hokkaido-region';
  if (tohoku.includes(englishId)) return 'tohoku-region';
  if (kanto.includes(englishId)) return 'kanto-region';
  if (chubu.includes(englishId)) return 'chubu-region';
  if (kinki.includes(englishId)) return 'kinki-region';
  if (chugoku.includes(englishId)) return 'chugoku-region';
  if (shikoku.includes(englishId)) return 'shikoku-region';
  if (kyushu.includes(englishId)) return 'kyushu-region';
  return '';
};

const JapanMap: React.FC<JapanMapProps> = ({ onPrefectureClick, selectedPrefecture }) => {
  const [hoveredPrefecture, setHoveredPrefecture] = useState<string | null>(null);

  const handleClick = (englishId: string) => {
    const pref = getPrefectureByEnglishId(englishId);
    if (pref) {
      onPrefectureClick(pref.id, pref.name);
    }
  };

  const handleMouseEnter = (englishId: string) => {
    const pref = getPrefectureByEnglishId(englishId);
    if (pref) {
      setHoveredPrefecture(pref.name);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPrefecture(null);
  };

  const selectedEnglishId = selectedPrefecture
    ? getEnglishIdByPrefectureId(selectedPrefecture)
    : null;

  return (
    <div className="japan-map-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={Japan.viewBox} className="japan-map-svg">
        {Japan.locations.map((location: Location) => (
          <path
            key={location.id}
            id={location.id}
            d={location.path}
            className={`prefecture-path ${getRegionClass(location.id)} ${
              selectedEnglishId === location.id ? 'selected' : ''
            }`}
            onClick={() => handleClick(location.id)}
            onMouseEnter={() => handleMouseEnter(location.id)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </svg>
      {hoveredPrefecture && <div className="prefecture-tooltip">{hoveredPrefecture}</div>}
    </div>
  );
};

export default JapanMap;
