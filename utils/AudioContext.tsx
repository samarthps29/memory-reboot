import { AVPlaybackStatusError, AVPlaybackStatusSuccess, Audio } from "expo-av";
import { createContext, useEffect, useState } from "react";
import { queueType } from "./types";

export const AudioContext = createContext<{
	sound: Audio.Sound | null;
	status: string;
	songInfo: Record<string, string>;
	userQueue: queueType | null;
	globalQueue: queueType | null;
	skip: boolean;
	audioFinish: boolean;
	toggleQueue: boolean;
	songDuration: number;
	songPosition: number;
	setSongDuration: React.Dispatch<React.SetStateAction<number>>;
	setSongPosition: React.Dispatch<React.SetStateAction<number>>;
	setToggleQueue: React.Dispatch<React.SetStateAction<boolean>>;
	setUserQueue: React.Dispatch<React.SetStateAction<queueType | null>>;
	setGlobalQueue: React.Dispatch<React.SetStateAction<queueType | null>>;
	setSound: React.Dispatch<React.SetStateAction<Audio.Sound | null>>;
	setSongInfo: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	setStatus: React.Dispatch<React.SetStateAction<string>>;
	setSoundUri: React.Dispatch<React.SetStateAction<string>>;
	setSkip: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const AudioContextProvider = ({ children }: React.PropsWithChildren) => {
	// implement types for songInfo and maybe merge songInfo and soundUri
	const [songInfo, setSongInfo] = useState<Record<string, string>>({});
	const [soundUri, setSoundUri] = useState<string>("");
	const [sound, setSound] = useState<Audio.Sound | null>(null);
	const [status, setStatus] = useState<string>("paused");
	const [audioFinish, setAudioFinish] = useState<boolean>(false);
	const [userQueue, setUserQueue] = useState<queueType | null>(null);
	const [globalQueue, setGlobalQueue] = useState<queueType | null>(null);
	const [toggleQueue, setToggleQueue] = useState<boolean>(false);
	const [skip, setSkip] = useState<boolean>(false);
	const [songDuration, setSongDuration] = useState<number>(0);
	const [songPosition, setSongPosition] = useState<number>(0);

	const handlePlaybackStatusUpdate = (
		status: AVPlaybackStatusSuccess | AVPlaybackStatusError
	) => {
		if (status.isLoaded) {
			setSongDuration(status.durationMillis || 0);
			setSongPosition(status.positionMillis);
			if (status.didJustFinish) {
				setAudioFinish(true);
			}
		}
	};

	const changeAudio = async () => {
		if (soundUri !== undefined && soundUri !== null && soundUri !== "") {
			await sound?.unloadAsync();
			const { sound: newSound } = await Audio.Sound.createAsync({
				uri: soundUri,
			});
			newSound.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
			setSound(newSound);
			setStatus("playing");
			setAudioFinish(false);
		}
	};

	const toggleAudio = async () => {
		if (sound) {
			if (status === "paused") {
				await sound?.pauseAsync();
			} else {
				await sound?.playAsync();
			}
		}
	};

	const updateIndex = (queue: queueType) => {
		if (queue.currentIndex === queue.queue.length - 1) {
			return -1;
		} else return queue.currentIndex + 1;
	};

	const handleQueueChange = (automaticNextInQueue?: boolean) => {
		if (userQueue && userQueue.queue.length > 0) {
			// use user queue to change audio
		} else if (
			globalQueue &&
			globalQueue.queue.length > 0 &&
			globalQueue.currentIndex !== -1
		) {
			let updatedIndex = globalQueue.currentIndex;
			if (automaticNextInQueue) {
				updatedIndex = updateIndex(globalQueue);
				setGlobalQueue((prev) => {
					if (prev === null) return null;
					return {
						...prev,
						currentIndex: updatedIndex,
					};
				});
			}

			if (updatedIndex !== -1) {
				const nextSong = globalQueue.queue[updatedIndex];
				setSongInfo((prev) => {
					return {
						...prev,
						sid: nextSong.sid,
						sname: nextSong.sname,
						thumbnail: nextSong.thumbnail,
					};
				});
				setSoundUri(nextSong.itemUri);
			} else {
				setStatus("paused");
				setSongInfo((prev) => {
					return { ...prev, sid: "", sname: "", thumbnail: "" };
				});
			}
		}
		if (toggleQueue) setToggleQueue(false);
	};

	const requestAudioMode = async () => {
		await Audio.setAudioModeAsync({
			staysActiveInBackground: true,
			interruptionModeAndroid: 2,
			shouldDuckAndroid: false,
			playThroughEarpieceAndroid: true,
			// allowsRecordingIOS: true,
			// interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			// playsInSilentModeIOS: true,
		});
	};

	useEffect(() => {
		changeAudio();
	}, [soundUri]);

	useEffect(() => {
		toggleAudio();
	}, [status, sound]);

	useEffect(() => {
		if (audioFinish) {
			if (songInfo["loop"] === "yes") changeAudio();
			else if (globalQueue !== null) {
				// continuation of an existing queue
				handleQueueChange(true);
			}
		} else if (globalQueue !== null && toggleQueue) {
			// initialization of a new queue
			handleQueueChange();
		}
	}, [songInfo, globalQueue, userQueue, toggleQueue, audioFinish]);

	useEffect(() => {
		if (skip) {
			console.log(globalQueue?.queue[globalQueue.currentIndex].sname);
			const newSong = globalQueue?.queue[globalQueue.currentIndex];
			if (newSong) {
				setSongInfo((prev) => {
					return {
						...prev,
						sid: newSong?.sid,
						sname: newSong?.sname,
						thumbnail: newSong?.thumbnail,
					};
				});
				setSoundUri(newSong?.itemUri);
			}
			setSkip(false);
		}
	}, [skip, globalQueue]);

	useEffect(() => {
		requestAudioMode();
	}, []);

	return (
		<AudioContext.Provider
			value={{
				sound,
				songInfo,
				status,
				userQueue,
				globalQueue,
				skip,
				songDuration,
				songPosition,
				setSongDuration,
				setSongPosition,
				toggleQueue,
				audioFinish,
				setUserQueue,
				setGlobalQueue,
				setSound,
				setSongInfo,
				setStatus,
				setSoundUri,
				setToggleQueue,
				setSkip,
			}}
		>
			{children}
		</AudioContext.Provider>
	);
};
