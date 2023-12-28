import { Audio } from "expo-av";
import { createContext, useEffect, useState } from "react";

export const AudioContext = createContext<{
	sound: Audio.Sound | null;
	status: string;
	songName: string;
	setSound: React.Dispatch<React.SetStateAction<Audio.Sound | null>>;
	setSongName: React.Dispatch<React.SetStateAction<string>>;
	setStatus: React.Dispatch<React.SetStateAction<string>>;
	setSoundUri: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

export const AudioContextProvider = ({ children }: React.PropsWithChildren) => {
	const [songName, setSongName] = useState<string>("");
	const [soundUri, setSoundUri] = useState<string>("");
	const [sound, setSound] = useState<Audio.Sound | null>(null);
	const [status, setStatus] = useState<string>("paused");

	const changeAudio = async () => {
		if (soundUri !== "") {
			await sound?.unloadAsync();
			const { sound: newSound } = await Audio.Sound.createAsync({
				uri: soundUri,
			});
			setSound(newSound);
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
			value={{
				sound,
				songName,
				status,
				setSound,
				setSongName,
				setStatus,
				setSoundUri,
			}}
		>
			{children}
		</AudioContext.Provider>
	);
};
