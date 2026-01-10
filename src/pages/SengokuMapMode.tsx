import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JapanMap from '../components/JapanMap';
import SoundButton from '../components/SoundButton';
import { getPath } from '../util/util';
import './SengokuMapMode.css';

interface WarlordIndex {
    id: number;
    name: string;
    reading: string;
    image?: string;
    relatedPrefectures: string[];
    birthYears?: number[];
    deathYears?: number[];
}

interface Castle {
    name: string;
    reading: string;
    description: string;
}

const provinceMapping: Record<string, string> = {
    "愛知県": "尾張・三河",
    "岐阜県": "美濃・飛騨",
    "静岡県": "駿河・遠江・伊豆",
    "山梨県": "甲斐",
    "長野県": "信濃",
    "新潟県": "越後・佐渡",
    "京都府": "山城・丹波・丹後",
    "大阪府": "河内・和泉・摂津",
    "滋賀県": "近江",
    "三重県": "伊勢・伊賀・志摩",
    "福井県": "越前・若狭",
    "石川県": "加賀・能登",
    "富山県": "越中",
    "兵庫県": "播磨・但馬・淡路・丹波・摂津",
    "奈良県": "大和",
    "和歌山県": "紀伊",
    "広島県": "安芸・備後",
    "岡山県": "備前・備中・美作",
    "山口県": "周防・長門",
    "福岡県": "筑前・筑後・豊前",
    "東京都": "武蔵",
    "神奈川県": "相模・武蔵",
    "埼玉県": "武蔵",
    "千葉県": "安房・上総・下総",
    "茨城県": "常陸",
    "栃木県": "下野",
    "群馬県": "上野",
    "福島県": "岩代・磐城",
    "宮城県": "陸前",
    "山形県": "羽前",
    "秋田県": "羽後",
    "岩手県": "陸中",
    "青森県": "陸奥",
    "北海道": "蝦夷",
    "鹿児島県": "薩摩・大隅",
    "宮崎県": "日向",
    "大分県": "豊後",
    "熊本県": "肥後",
    "長崎県": "肥前・対馬",
    "佐賀県": "肥前",
    "高知県": "土佐",
    "愛媛県": "伊予",
    "香川県": "讃岐",
    "徳島県": "阿波",
    "鳥取県": "因幡・伯耆",
    "島根県": "出雲・石見・隠岐",
};

// 主要な城や古戦場のデータ（代表的なもののみ）
const relatedSitesMapping: Record<string, Castle[]> = {
    "愛知県": [
        { name: "名古屋城", reading: "なごやじょう", description: "尾張徳川家の居城。金の鯱で有名。" },
        { name: "清洲城", reading: "きよすじょう", description: "織田信長が那古野城から移った城。清須会議の舞台。" },
        { name: "岡崎城", reading: "おかざきじょう", description: "徳川家康の生誕地。" },
        { name: "桶狭間古戦場", reading: "おけはざまこせんじょう", description: "織田信長が今川義元を討ち取った合戦の地。" }
    ],
    "岐阜県": [
        { name: "岐阜城", reading: "ぎふじょう", description: "稲葉山城から改名。信長の『天下布武』の拠点。" },
        { name: "大垣城", reading: "おおがきじょう", description: "関ヶ原の戦いで西軍・石田三成の本拠地となった。" },
        { name: "関ヶ原古戦場", reading: "せきがはらこせんじょう", description: "天下分け目の戦いが行われた地。" }
    ],
    "京都府": [
        { name: "二条城", reading: "にじょうじょう", description: "徳川家康が築城。大政奉還の舞台。" },
        { name: "本能寺跡", reading: "ほんのうじあと", description: "明智光秀が織田信長を襲撃した場所。" }
    ],
    "大阪府": [
        { name: "大阪城", reading: "おおさかじょう", description: "豊臣秀吉が築いた巨城。大坂冬の陣・夏の陣の舞台。" }
    ],
    "滋賀県": [
        { name: "安土城跡", reading: "あづちじょうあと", description: "織田信長が築いた豪華絢爛な城。" },
        { name: "彦根城", reading: "ひこねじょう", description: "井伊家の居城。現存天守の一つ。" },
        { name: "姉川古戦場", reading: "あねがわこせんじょう", description: "織田・徳川連合軍と浅井・朝倉連合軍が激突した地。" }
    ],
    "長野県": [
        { name: "松本城", reading: "まつもとじょう", description: "漆黒の天守を持つ国宝の城。" },
        { name: "上田城", reading: "うえだじょう", description: "真田昌幸が築城。徳川軍を二度退けた名城。" },
        { name: "川中島古戦場", reading: "かわなかじまこせんじょう", description: "武田信玄と上杉謙信が数度にわたり激闘を繰り広げた地。" }
    ],
    "山梨県": [
        { name: "躑躅ヶ崎館", reading: "つつじがさきやかた", description: "武田信玄の居館（武田神社）。" }
    ],
    "兵庫県": [
        { name: "姫路城", reading: "ひめじじょう", description: "白鷺城とも呼ばれる世界遺産。羽柴秀吉も城代を務めた。" }
    ],
    "広島県": [
        { name: "広島城", reading: "ひろしまじょう", description: "毛利輝元が築いた城。" },
        { name: "厳島神社", reading: "いつくしまじんじゃ", description: "毛利元就が陶晴賢を破った厳島の戦いの舞台。" }
    ],
    "静岡県": [
        { name: "駿府城", reading: "すんぷじょう", description: "徳川家康が晩年を過ごした城。" },
        { name: "浜松城", reading: "はままつじょう", description: "徳川家康が青壮年期を過ごした「出世城」。" }
    ],
    "神奈川県": [
        { name: "小田原城", reading: "おだわらじょう", description: "難攻不落を誇った北条氏の本拠地。" }
    ],
    "福島県": [
        { name: "会津若松城", reading: "あいづわかまつじょう", description: "鶴ヶ城とも。蒲生氏郷らが整備。" }
    ],
    "宮城県": [
        { name: "仙台城", reading: "せんだいじょう", description: "伊達政宗が築いた青葉城。" }
    ],
    "熊本県": [
        { name: "熊本城", reading: "くまもとじょう", description: "加藤清正が築いた堅牢な名城。" }
    ],
    "福井県": [
        { name: "一乗谷朝倉氏遺跡", reading: "いちじょうだにあさくらしいせき", description: "朝倉氏が栄華を誇った城下町跡。" },
        { name: "北ノ庄城跡", reading: "きたのしょうじょうあと", description: "柴田勝家の居城。" }
    ],
    "石川県": [
        { name: "金沢城", reading: "かなざわじょう", description: "加賀百万石・前田家の居城。" }
    ]
};

const SengokuMapMode = () => {
    const navigate = useNavigate();
    const [warlords, setWarlords] = useState<WarlordIndex[]>([]);
    const [selectedPrefecture, setSelectedPrefecture] = useState<{ id: number; name: string } | null>(null);
    const [activeWarlords, setActiveWarlords] = useState<WarlordIndex[]>([]);
    const [activeSites, setActiveSites] = useState<Castle[]>([]);

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
            const sites = relatedSitesMapping[selectedPrefecture.name] || [];
            setActiveSites(sites);
        } else {
            setActiveWarlords([]);
            setActiveSites([]);
        }
    }, [selectedPrefecture, warlords]);

    const handlePrefectureClick = (id: number, name: string) => {
        setSelectedPrefecture({ id, name });
    };

    const handleWarlordClick = (warlordId: number) => {
        navigate(`/warlord/${warlordId}`);
    };

    // 都道府県名と旧国名を結合してラベルを作成
    const getLabelWithProvince = (prefectureName: string) => {
        const province = provinceMapping[prefectureName];
        if (province) {
            // "尾張・三河" -> "尾張" (最初のひとつをとる、あるいは短くするなどの調整)
            // ここではそのまま表示するが、改行を入れるなどの工夫が必要かもしれない
            // Map上での表示用に整形
            return `【${province.split('・')[0]}】${prefectureName}`;
        }
        return prefectureName;
    };

    return (
        <div className="sengoku-map-container">
            <header className="sengoku-header">
                <SoundButton onClick={() => navigate('/')} className="back-button">
                    戻る
                </SoundButton>
                <h1 className="sengoku-title">戦国都道府県モード</h1>
                <div style={{ width: '60px' }}></div>
            </header>

            <div className="sengoku-content">
                <div className="sengoku-map-wrapper">
                    <JapanMap
                        onPrefectureClick={handlePrefectureClick}
                        selectedPrefecture={selectedPrefecture?.id}
                        showLabels={true}
                        customLabelFormatter={getLabelWithProvince}
                    />
                </div>

                <div className={`sengoku-info-panel ${!selectedPrefecture ? '' : ''}`}>
                    {selectedPrefecture ? (
                        <>
                            <h2 className="prefecture-title">{selectedPrefecture.name}</h2>
                            {provinceMapping[selectedPrefecture.name] && (
                                <div className="province-name">
                                    旧国名: {provinceMapping[selectedPrefecture.name]}
                                </div>
                            )}

                            <div className="info-section">
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
                                    <p className="no-data-msg">この都道府県に関連する武将のデータはありません。</p>
                                )}
                            </div>

                            {activeSites.length > 0 && (
                                <div className="info-section">
                                    <h3>ゆかりの地・古戦場</h3>
                                    <div className="site-list">
                                        {activeSites.map((site, index) => (
                                            <div key={index} className="site-card">
                                                <div className="site-name">
                                                    {site.name} <span className="site-reading">({site.reading})</span>
                                                </div>
                                                <div className="site-description">{site.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
