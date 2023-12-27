import { Audio } from "expo-av";
import { createContext, useEffect, useState } from "react";

export const AudioContext = createContext<{
	sound: Audio.Sound | null;
	status: string;
	setSound: React.Dispatch<React.SetStateAction<Audio.Sound | null>>;
	setStatus: React.Dispatch<React.SetStateAction<string>>;
	setSoundUri: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

export const AudioContextProvider = ({ children }: React.PropsWithChildren) => {
	const [soundUri, setSoundUri] = useState<string>("");
	const [sound, setSound] = useState<Audio.Sound | null>(null);
	const [status, setStatus] = useState<string>("paused");

	const changeAudio = async () => {
		if (soundUri !== "") {
			const { sound } = await Audio.Sound.createAsync({ uri: soundUri });
			setSound(sound);
			setStatus("playing");
		}
	};

	const toggleAudio = async () => {
		if (status === "paused") {
			await sound?.pauseAsync();
		} else {
			await sound?.playAsync();
		}
	};

	useEffect(() => {
		changeAudio();
	}, [soundUri]);

	useEffect(() => {
		toggleAudio();
	}, [status, sound]);

	return (
		<AudioContext.Provider
			value={{ sound, status, setSound, setStatus, setSoundUri }}
		>
			{children}
		</AudioContext.Provider>
	);
};
