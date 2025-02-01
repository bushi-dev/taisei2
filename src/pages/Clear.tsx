import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SoundButton from "../components/SoundButton";
import { useSoundManager } from "../components/SoundManager";
import "./Clear.css";
import { getPath, increaseDifficulty } from "../util/util";

const Clear = () => {
	const navigate = useNavigate();
	const [treasure, setTreasure] = useState("");

	const { playBgm } = useSoundManager();

	useEffect(() => {
		// ローカルストレージから宝番号を取得 (1〜100)
		const treasureNumber = Number.parseInt(
			localStorage.getItem("lastTreasureNumber") || "1",
		);
		setTreasure(`takara${treasureNumber}.png`);

		// BGM再生
		playBgm("/sound/bgm1.mp3", 0.1);
	}, [playBgm]);

	return (
		<div className="clear-container">
			<h3 className="clear-heading">ステージクリア！</h3>

			<div className="clear-subheading">
				<img
					src={getPath(`/image/${treasure}`)}
					alt="獲得した宝物"
					className="clear-treasure-image"
				/>
				<div className="clear-get-text">GET!</div>
			</div>

			<div className="clear-buttons">
				<div className="clear-buttons-bottom">
					<SoundButton
						onClick={() => navigate("/taisei2/battle")}
						className="clear-button clear-button--secondary"
					>
						次のバトル
					</SoundButton>

					<SoundButton
						onClick={() => {
							increaseDifficulty();
							navigate("/taisei2/battle");
						}}
						className="clear-button clear-button--secondary"
					>
						レベルアップ!
					</SoundButton>
				</div>
				<div className="clear-buttons-top">
					<SoundButton
						onClick={() => navigate("/taisei2/")}
						className="clear-button clear-button--primary"
					>
						タイトルへ
					</SoundButton>
				</div>
			</div>
		</div>
	);
};

export default Clear;
