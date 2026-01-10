import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JapanMap from '../components/JapanMap';
import SoundButton from '../components/SoundButton';
import { getPath } from '../util/util';
import './SengokuMapMode.css';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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

interface ProvinceData {
    name: string;
    reading: string;
}

const provinceMapping: Record<string, ProvinceData> = {
    "愛知": { name: "尾張・三河", reading: "おわり・みかわ" },
    "岐阜": { name: "美濃・飛騨", reading: "みの・ひだ" },
    "静岡": { name: "駿河・遠江・伊豆", reading: "するが・とおとうみ・いず" },
    "山梨": { name: "甲斐", reading: "かい" },
    "長野": { name: "信濃", reading: "しなの" },
    "新潟": { name: "越後・佐渡", reading: "えちご・さど" },
    "京都": { name: "山城・丹波・丹後", reading: "やましろ・たんば・たんご" },
    "大阪": { name: "河内・和泉・摂津", reading: "かわち・いずみ・せっつ" },
    "滋賀": { name: "近江", reading: "おうみ" },
    "三重": { name: "伊勢・伊賀・志摩", reading: "いせ・いが・しま" },
    "福井": { name: "越前・若狭", reading: "えちぜん・わかさ" },
    "石川": { name: "加賀・能登", reading: "かが・のと" },
    "富山": { name: "越中", reading: "えっちゅう" },
    "兵庫": { name: "播磨・但馬・淡路・丹波・摂津", reading: "はりま・たじま・あわじ・たんば・せっつ" },
    "奈良": { name: "大和", reading: "やまと" },
    "和歌山": { name: "紀伊", reading: "きい" },
    "広島": { name: "安芸・備後", reading: "あき・びんご" },
    "岡山": { name: "備前・備中・美作", reading: "びぜん・びっちゅう・みまさか" },
    "山口": { name: "周防・長門", reading: "すおう・ながと" },
    "福岡": { name: "筑前・筑後・豊前", reading: "ちくぜん・ちくご・ぶぜん" },
    "東京": { name: "武蔵", reading: "むさし" },
    "神奈川": { name: "相模・武蔵", reading: "さがみ・むさし" },
    "埼玉": { name: "武蔵", reading: "むさし" },
    "千葉": { name: "安房・上総・下総", reading: "あわ・かずさ・しもうさ" },
    "茨城": { name: "常陸", reading: "ひたち" },
    "栃木": { name: "下野", reading: "しもつけ" },
    "群馬": { name: "上野", reading: "こうずけ" },
    "福島": { name: "岩代・磐城", reading: "いわしろ・いわき" },
    "宮城": { name: "陸前", reading: "りくぜん" },
    "山形": { name: "羽前", reading: "うぜん" },
    "秋田": { name: "羽後", reading: "うご" },
    "岩手": { name: "陸中", reading: "りくちゅう" },
    "青森": { name: "陸奥", reading: "むつ" },
    "北海道": { name: "蝦夷", reading: "えぞ" },
    "鹿児島": { name: "薩摩・大隅", reading: "さつま・おおすみ" },
    "宮崎": { name: "日向", reading: "ひゅうが" },
    "大分": { name: "豊後", reading: "ぶんご" },
    "熊本": { name: "肥後", reading: "ひご" },
    "長崎": { name: "肥前・対馬", reading: "ひぜん・つしま" },
    "佐賀": { name: "肥前", reading: "ひぜん" },
    "高知": { name: "土佐", reading: "とさ" },
    "愛媛": { name: "伊予", reading: "いよ" },
    "香川": { name: "讃岐", reading: "さぬき" },
    "徳島": { name: "阿波", reading: "あわ" },
    "鳥取": { name: "因幡・伯耆", reading: "いなば・ほうき" },
    "島根": { name: "出雲・石見・隠岐", reading: "いずも・いわみ・おき" },
};

// 主要な城や古戦場のデータ（代表的なもののみ）
const relatedSitesMapping: Record<string, Castle[]> = {
    "愛知": [
        { name: "名古屋城", reading: "なごやじょう", description: "尾張徳川家の居城。金の鯱で有名。" },
        { name: "清洲城", reading: "きよすじょう", description: "織田信長が那古野城から移った城。清須会議の舞台。" },
        { name: "岡崎城", reading: "おかざきじょう", description: "徳川家康の生誕地。" },
        { name: "桶狭間古戦場", reading: "おけはざまこせんじょう", description: "織田信長が今川義元を討ち取った合戦の地。" }
    ],
    "岐阜": [
        { name: "岐阜城", reading: "ぎふじょう", description: "稲葉山城から改名。信長の『天下布武』の拠点。" },
        { name: "大垣城", reading: "おおがきじょう", description: "関ヶ原の戦いで西軍・石田三成の本拠地となった。" },
        { name: "関ヶ原古戦場", reading: "せきがはらこせんじょう", description: "天下分け目の戦いが行われた地。" }
    ],
    "京都": [
        { name: "二条城", reading: "にじょうじょう", description: "徳川家康が築城。大政奉還の舞台。" },
        { name: "本能寺跡", reading: "ほんのうじあと", description: "明智光秀が織田信長を襲撃した場所。" }
    ],
    "大阪": [
        { name: "大阪城", reading: "おおさかじょう", description: "豊臣秀吉が築いた巨城。大坂冬の陣・夏の陣の舞台。" }
    ],
    "滋賀": [
        { name: "安土城跡", reading: "あづちじょうあと", description: "織田信長が築いた豪華絢爛な城。" },
        { name: "彦根城", reading: "ひこねじょう", description: "井伊家の居城。現存天守の一つ。" },
        { name: "姉川古戦場", reading: "あねがわこせんじょう", description: "織田・徳川連合軍と浅井・朝倉連合軍が激突した地。" }
    ],
    "長野": [
        { name: "松本城", reading: "まつもとじょう", description: "漆黒の天守を持つ国宝の城。" },
        { name: "上田城", reading: "うえだじょう", description: "真田昌幸が築城。徳川軍を二度退けた名城。" },
        { name: "川中島古戦場", reading: "かわなかじまこせんじょう", description: "武田信玄と上杉謙信が数度にわたり激闘を繰り広げた地。" }
    ],
    "山梨": [
        { name: "躑躅ヶ崎館", reading: "つつじがさきやかた", description: "武田信玄の居館（武田神社）。" }
    ],
    "兵庫": [
        { name: "姫路城", reading: "ひめじじょう", description: "白鷺城とも呼ばれる世界遺産。羽柴秀吉も城代を務めた。" }
    ],
    "広島": [
        { name: "広島城", reading: "ひろしまじょう", description: "毛利輝元が築いた城。" },
        { name: "厳島神社", reading: "いつくしまじんじゃ", description: "毛利元就が陶晴賢を破った厳島の戦いの舞台。" }
    ],
    "静岡": [
        { name: "駿府城", reading: "すんぷじょう", description: "徳川家康が晩年を過ごした城。" },
        { name: "浜松城", reading: "はままつじょう", description: "徳川家康が青壮年期を過ごした「出世城」。" }
    ],
    "神奈川": [
        { name: "小田原城", reading: "おだわらじょう", description: "難攻不落を誇った北条氏の本拠地。" }
    ],
    "福島": [
        { name: "会津若松城", reading: "あいづわかまつじょう", description: "鶴ヶ城とも。蒲生氏郷らが整備。" }
    ],
    "宮城": [
        { name: "仙台城", reading: "せんだいじょう", description: "伊達政宗が築いた青葉城。" }
    ],
    "熊本": [
        { name: "熊本城", reading: "くまもとじょう", description: "加藤清正が築いた堅牢な名城。" }
    ],
    "福井": [
        { name: "一乗谷朝倉氏遺跡", reading: "いちじょうだにあさくらしいせき", description: "朝倉氏が栄華を誇った城下町跡。" },
        { name: "北ノ庄城跡", reading: "きたのしょうじょうあと", description: "柴田勝家の居城。" }
    ],
    "石川": [
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
                w.relatedPrefectures.some((p) => p.includes(selectedPrefecture.name))
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
            return `【${province.name.split('・')[0]}】${prefectureName}`;
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
                    <TransformWrapper
                        initialScale={1}
                        initialPositionX={0}
                        initialPositionY={0}
                        minScale={1}
                        maxScale={8}
                        centerOnInit={window.innerWidth > 768}
                        wheel={{ step: 0.1 }}
                        pinch={{ step: 5 }}
                    >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                            <>
                                <div className="zoom-controls">
                                    <button onClick={() => zoomIn()}>+</button>
                                    <button onClick={() => zoomOut()}>-</button>
                                    <button onClick={() => resetTransform()}>R</button>
                                </div>
                                <TransformComponent
                                    wrapperStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-start" }}
                                    contentStyle={{ width: "100%", height: "auto" }}
                                >
                                    <JapanMap
                                        onPrefectureClick={handlePrefectureClick}
                                        selectedPrefecture={selectedPrefecture?.id}
                                        showLabels={true}
                                        customLabelFormatter={getLabelWithProvince}
                                    />
                                </TransformComponent>
                            </>
                        )}
                    </TransformWrapper>
                </div>

                <div className={`sengoku-info-panel ${!selectedPrefecture ? '' : ''}`}>
                    {selectedPrefecture ? (
                        <>
                            <h2 className="prefecture-title">{selectedPrefecture.name}</h2>
                            {provinceMapping[selectedPrefecture.name] && (
                                <div className="province-name">
                                    <ruby>
                                        旧国名: {provinceMapping[selectedPrefecture.name].name}
                                        <rt>{provinceMapping[selectedPrefecture.name].reading}</rt>
                                    </ruby>
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
