import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SoundButton from "../components/SoundButton";
import { useSoundManager } from "../components/SoundManager";
import "./TreasureList.css";
import { getPath } from "../util/util";

const TreasureList = () => {
	const [treasures, setTreasures] = useState<string[]>([]);
	const navigate = useNavigate();

	const { playBgm } = useSoundManager();

	useEffect(() => {
		// ローカルストレージから宝物データを取得し、画像ファイル名に変換
		const savedTreasures = JSON.parse(
			localStorage.getItem("treasures") || "[]",
		);
		const sortedTreasures = [...savedTreasures].sort((a, b) => a - b);
		const formattedTreasures = sortedTreasures.map(
			(t: number) => `takara${t}.png`,
		);
		setTreasures(formattedTreasures);

		// BGM再生
		playBgm("/sound/bgm1.mp3", 0.1);
	}, []);

	return (
		<div className="treasure-list-container">
			<div className="treasure-list-header">
				<h1 className="treasure-list-heading">宝物一覧</h1>
				<SoundButton
					onClick={() => navigate("/taisei2/")}
					className="back-button"
				>
					タイトル
				</SoundButton>
			</div>
			<div className="treasure-grid">
				{treasures.map((treasure, index) => (
					<div
						key={index}
						className="treasure-item"
						onClick={() => {
							const treasureNumber = treasure.match(/\d+/)?.[0] || "0";
							navigate(`/taisei2/treasure/${treasureNumber}`);
						}}
					>
						<img
							src={getPath(`/image/${treasure}`)}
							alt={treasure}
							className="treasure-list-image"
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default TreasureList;
