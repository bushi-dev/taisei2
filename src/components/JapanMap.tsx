import React from 'react';
import './JapanMap.css';

interface JapanMapProps {
  onPrefectureClick: (prefectureId: number, prefectureName: string) => void;
  selectedPrefecture?: number | null;
}

// 都道府県データ（SVGパスと位置情報）
const prefectures = [
  { id: 1, name: '北海道', x: 82, y: 8, width: 18, height: 15 },
  { id: 2, name: '青森県', x: 78, y: 23, width: 8, height: 6 },
  { id: 3, name: '岩手県', x: 80, y: 29, width: 7, height: 7 },
  { id: 4, name: '宮城県', x: 79, y: 36, width: 6, height: 5 },
  { id: 5, name: '秋田県', x: 75, y: 29, width: 5, height: 7 },
  { id: 6, name: '山形県', x: 74, y: 36, width: 5, height: 6 },
  { id: 7, name: '福島県', x: 74, y: 42, width: 8, height: 5 },
  { id: 8, name: '茨城県', x: 78, y: 47, width: 5, height: 5 },
  { id: 9, name: '栃木県', x: 74, y: 44, width: 5, height: 5 },
  { id: 10, name: '群馬県', x: 69, y: 44, width: 5, height: 5 },
  { id: 11, name: '埼玉県', x: 72, y: 49, width: 4, height: 4 },
  { id: 12, name: '千葉県', x: 77, y: 51, width: 5, height: 6 },
  { id: 13, name: '東京都', x: 73, y: 53, width: 4, height: 3 },
  { id: 14, name: '神奈川県', x: 71, y: 55, width: 4, height: 3 },
  { id: 15, name: '新潟県', x: 65, y: 38, width: 8, height: 8 },
  { id: 16, name: '富山県', x: 58, y: 44, width: 5, height: 4 },
  { id: 17, name: '石川県', x: 54, y: 42, width: 4, height: 7 },
  { id: 18, name: '福井県', x: 51, y: 48, width: 5, height: 5 },
  { id: 19, name: '山梨県', x: 66, y: 52, width: 4, height: 4 },
  { id: 20, name: '長野県', x: 62, y: 46, width: 6, height: 8 },
  { id: 21, name: '岐阜県', x: 56, y: 50, width: 6, height: 6 },
  { id: 22, name: '静岡県', x: 62, y: 56, width: 8, height: 5 },
  { id: 23, name: '愛知県', x: 56, y: 56, width: 6, height: 5 },
  { id: 24, name: '三重県', x: 50, y: 56, width: 6, height: 8 },
  { id: 25, name: '滋賀県', x: 48, y: 52, width: 4, height: 5 },
  { id: 26, name: '京都府', x: 44, y: 50, width: 5, height: 6 },
  { id: 27, name: '大阪府', x: 43, y: 56, width: 3, height: 4 },
  { id: 28, name: '兵庫県', x: 38, y: 52, width: 6, height: 7 },
  { id: 29, name: '奈良県', x: 46, y: 58, width: 4, height: 5 },
  { id: 30, name: '和歌山県', x: 42, y: 62, width: 5, height: 6 },
  { id: 31, name: '鳥取県', x: 34, y: 50, width: 5, height: 4 },
  { id: 32, name: '島根県', x: 26, y: 50, width: 8, height: 5 },
  { id: 33, name: '岡山県', x: 34, y: 54, width: 5, height: 5 },
  { id: 34, name: '広島県', x: 26, y: 54, width: 8, height: 5 },
  { id: 35, name: '山口県', x: 18, y: 54, width: 7, height: 6 },
  { id: 36, name: '徳島県', x: 36, y: 62, width: 5, height: 4 },
  { id: 37, name: '香川県', x: 36, y: 58, width: 4, height: 3 },
  { id: 38, name: '愛媛県', x: 28, y: 60, width: 7, height: 5 },
  { id: 39, name: '高知県', x: 30, y: 65, width: 8, height: 5 },
  { id: 40, name: '福岡県', x: 14, y: 58, width: 6, height: 5 },
  { id: 41, name: '佐賀県', x: 10, y: 60, width: 4, height: 4 },
  { id: 42, name: '長崎県', x: 4, y: 60, width: 6, height: 7 },
  { id: 43, name: '熊本県', x: 10, y: 65, width: 6, height: 7 },
  { id: 44, name: '大分県', x: 16, y: 62, width: 6, height: 5 },
  { id: 45, name: '宮崎県', x: 16, y: 68, width: 5, height: 7 },
  { id: 46, name: '鹿児島県', x: 8, y: 73, width: 8, height: 10 },
  { id: 47, name: '沖縄県', x: 2, y: 88, width: 10, height: 10 },
];

const JapanMap: React.FC<JapanMapProps> = ({ onPrefectureClick, selectedPrefecture }) => {
  return (
    <div className="japan-map-container">
      <svg viewBox="0 0 100 100" className="japan-map-svg" preserveAspectRatio="xMidYMid meet">
        {prefectures.map((pref) => (
          <g key={pref.id} className="prefecture-group">
            <rect
              x={pref.x}
              y={pref.y}
              width={pref.width}
              height={pref.height}
              className={`prefecture-rect ${selectedPrefecture === pref.id ? 'selected' : ''}`}
              onClick={() => onPrefectureClick(pref.id, pref.name)}
              rx="0.5"
              ry="0.5"
            />
            <text
              x={pref.x + pref.width / 2}
              y={pref.y + pref.height / 2}
              className="prefecture-text"
              onClick={() => onPrefectureClick(pref.id, pref.name)}
            >
              {pref.id}
            </text>
          </g>
        ))}
      </svg>

      <div className="prefecture-legend">
        {prefectures.map((pref) => (
          <button
            key={pref.id}
            className={`legend-item ${selectedPrefecture === pref.id ? 'selected' : ''}`}
            onClick={() => onPrefectureClick(pref.id, pref.name)}
          >
            <span className="legend-number">{pref.id}</span>
            <span className="legend-name">{pref.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default JapanMap;
