import { createContext, useContext } from "react";
import { useSoundManager } from "../components/SoundManager";

const SoundContext = createContext<ReturnType<typeof useSoundManager> | null>(
	null,
);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
	const soundManager = useSoundManager();
	return (
		<SoundContext.Provider value={soundManager}>
			{children}
		</SoundContext.Provider>
	);
};

export const useSound = () => {
	const context = useContext(SoundContext);
	if (!context) {
		throw new Error("useSound must be used within a SoundProvider");
	}
	return context;
};
