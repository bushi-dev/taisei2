import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JapanMap from '../components/JapanMap';
import SoundButton from '../components/SoundButton'; // Using SoundButton for consistency
import { getPath } from '../util/util';
import './SengokuMapMode.css';

interface WarlordIndex {
    id: number;
    name: string;
    reading: string;
    image?: string;
    relatedPrefectures: string[]; // e.g. ["愛知県", "岐阜県"]
    birthYears?: number[];
    deathYears?: number[];
}

const provinceMapping: Record<string, string> = {
    "愛知県": "尾張・三河 (Owari/Mikawa)",
    "岐阜県": "美濃・飛騨 (Mino/Hida)",
    "静岡県": "駿河・遠江・伊豆 (Suruga/Totomi/Izu)",
    "山梨県": "甲斐 (Kai)",
    "長野県": "信濃 (Shinano)",
    "新潟県": "越後・佐渡 (Echigo/Sado)",
    "京都府": "山城・丹波・丹後 (Yamashiro/Tanba/Tango)",
    "大阪府": "河内・和泉・摂津 (Kawachi/Izumi/Settsu)",
    "滋賀県": "近江 (Omi)",
    "三重県": "伊勢・伊賀・志摩 (Ise/Iga/Shima)",
    "福井県": "越前・若狭 (Echizen/Wakasa)",
    "石川県": "加賀・能登 (Kaga/Noto)",
    "富山県": "越中 (Etchu)",
    "兵庫県": "播磨・但馬・淡路 (Harima/Tajima/Awaji)",
    "奈良県": "大和 (Yamato)",
    "和歌山県": "紀伊 (Kii)",
    "広島県": "安芸・備後 (Aki/Bingo)",
    "岡山県": "備前・備中・美作 (Bizen/Bitchu/Mimasaka)",
    "山口県": "周防・長門 (Suo/Nagato)",
    "福岡県": "筑前・筑後・豊前 (Chikuzen/Chikugo/Buzen)",
    "東京都": "武蔵 (Musashi)",
    "神奈川県": "相模・武蔵 (Sagami/Musashi)",
    "埼玉県": "武蔵 (Musashi)",
    "千葉県": "安房・上総・下総 (Awa/Kazusa/Shimosa)",
    "茨城県": "常陸 (Hitachi)",
    "栃木県": "下野 (Shimotsuke)",
    "群馬県": "上野 (Kozuke)",
    "福島県": "岩代・磐城 (Iwashiro/Iwaki)",
    "宮城県": "陸前 (Rikuzen)",
    "山形県": "羽前 (Uzen)",
    "秋田県": "羽後 (Ugo)",
    "岩手県": "陸中 (Rikuchu)",
    "青森県": "陸奥 (Mutsu)",
    "北海道": "蝦夷 (Ezo)",
    "鹿児島県": "薩摩・大隅 (Satsuma/Osumi)",
    "宮崎県": "日向 (Hyuga)",
    "大分県": "豊後 (Bungo)",
    "熊本県": "肥後 (Higo)",
    "長崎県": "肥前・対馬 (Hizen/Tsushima)",
    "佐賀県": "肥前 (Hizen)",
    "高知県": "土佐 (Tosa)",
    "愛媛県": "伊予 (Iyo)",
    "香川県": "讃岐 (Sanuki)",
    "徳島県": "阿波 (Awa)",
    "鳥取県": "因幡・伯耆 (Inaba/Hoki)",
    "島根県": "出雲・石見・隠岐 (Izumo/Iwami/Oki)",
};

const SengokuMapMode = () => {
    const navigate = useNavigate();
    const [warlords, setWarlords] = useState<WarlordIndex[]>([]);
    const [selectedPrefecture, setSelectedPrefecture] = useState<{ id: number; name: string } | null>(null);
    const [activeWarlords, setActiveWarlords] = useState<WarlordIndex[]>([]);

    useEffect(() => {
        fetch('/json/warlords/index.json')
            .then((res) => res.json())
            .then((data: WarlordIndex[]) => {
                setWarlords(data);
            })
            .catch((err) => console.error('Failed to load warlord data:', err));
    }, []);

    useEffect(() => {
        if (selectedPrefecture) {
            const active = warlords.filter((w) =>
                w.relatedPrefectures.includes(selectedPrefecture.name)
            );
            setActiveWarlords(active);
        } else {
            setActiveWarlords([]);
        }
    }, [selectedPrefecture, warlords]);

    const handlePrefectureClick = (id: number, name: string) => {
        // If clicking the same one, maybe deselect? Or just keep it. Let's keep it simple.
        setSelectedPrefecture({ id, name });
    };

    const handleWarlordClick = (warlordId: number) => {
        navigate(`/warlord/${warlordId}`);
    };

    const provinceName = selectedPrefecture ? provinceMapping[selectedPrefecture.name] : '';

    return (
        <div className="sengoku-map-container">
            <header className="sengoku-header">
                <SoundButton onClick={() => navigate('/')} className="back-button">
                    戻る
                </SoundButton>
                <h1 className="sengoku-title">戦国都道府県モード</h1>
                <div style={{ width: '60px' }}></div> {/* Spacer for centering */}
            </header>

            <div className="sengoku-content">
                <div className="sengoku-map-wrapper">
                    <JapanMap
                        onPrefectureClick={handlePrefectureClick}
                        selectedPrefecture={selectedPrefecture?.id}
                        showLabels={true}
                    />
                </div>

                <div className={`sengoku-info-panel ${!selectedPrefecture ? '' : ''}`}>
                    {selectedPrefecture ? (
                        <>
                            <h2 className="prefecture-title">{selectedPrefecture.name}</h2>
                            {provinceName && (
                                <div className="province-name">旧国名: {provinceName}</div>
                            )}

                            <h3>活躍した武将 ({activeWarlords.length})</h3>

                            {activeWarlords.length > 0 ? (
                                <div className="warlord-list">
                                    {activeWarlords.map((w) => (
                                        <div
                                            key={w.id}
                                            className="warlord-card"
                                            onClick={() => handleWarlordClick(w.id)}
                                        >
                                            {w.image ? (
                                                <img src={getPath(w.image)} alt={w.name} className="warlord-icon" />
                                            ) : (
                                                <div className="warlord-icon" />
                                            )}
                                            <div className="warlord-info">
                                                <div className="warlord-name">{w.name}</div>
                                                <div className="warlord-years">
                                                    {w.birthYears?.[0]} - {w.deathYears?.[0]}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>この都道府県に関連する武将のデータはありません。</p>
                            )}
                        </>
                    ) : (
                        <div className="empty-state">
                            <p>地図上の都道府県を<br />クリックしてください</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SengokuMapMode;
