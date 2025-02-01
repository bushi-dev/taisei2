import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SoundButton from "../components/SoundButton";
import { useSoundManager } from "../components/SoundManager";
import "./GameOver.css";

const GameOver = () => {
	const navigate = useNavigate();

	const { playBgm } = useSoundManager();

	useEffect(() => {
		// BGM再生
		playBgm("/sound/bgm1.mp3", 0.1);
	}, [playBgm]);

	return (
		<div className="game-over-container">
			<h1 className="game-over-heading">ゲームオーバー</h1>

			<div className="game-over-buttons">
				<SoundButton
					onClick={() => navigate("/taisei2/")}
					className="game-over-button game-over-button--primary"
				>
					タイトル
				</SoundButton>

				<SoundButton
					onClick={() => navigate("/taisei2/battle")}
					className="game-over-button game-over-button--secondary"
				>
					リトライ
				</SoundButton>
			</div>
		</div>
	);
};

export default GameOver;
