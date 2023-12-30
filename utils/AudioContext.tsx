import { AVPlaybackStatusError, AVPlaybackStatusSuccess, Audio } from "expo-av";
import { createContext, useEffect, useState } from "react";
import { queueType, songItemType } from "./types";

export const AudioContext = createContext<{
	sound: Audio.Sound | null;
	status: string;
	songInfo: Record<string, string>;
	userQueue: queueType | null;
	globalQueue: queueType | null;
	shuffle: boolean;
	skip: boolean;
	audioFinish: boolean;
	toggleQueue: boolean;
	setToggleQueue: React.Dispatch<React.SetStateAction<boolean>>;
	setUserQueue: React.Dispatch<React.SetStateAction<queueType | null>>;
	setGlobalQueue: React.Dispatch<React.SetStateAction<queueType | null>>;
	setSound: React.Dispatch<React.SetStateAction<Audio.Sound | null>>;
	setSongInfo: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	setStatus: React.Dispatch<React.SetStateAction<string>>;
	setSoundUri: React.Dispatch<React.SetStateAction<string>>;
	setShuffle: React.Dispatch<React.SetStateAction<boolean>>;
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
	const [shuffle, setShuffle] = useState<boolean>(false);
	const [toggleQueue, setToggleQueue] = useState<boolean>(false);
	const [skip, setSkip] = useState<boolean>(false);

	const handlePlaybackStatusUpdate = (
		status: AVPlaybackStatusSuccess | AVPlaybackStatusError
	) => {
		if (status.isLoaded && status.didJustFinish) {
			setAudioFinish(true);
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
					};
				});
				setSoundUri(nextSong.itemUri);
			} else {
				setStatus("paused");
				setSongInfo((prev) => {
					return { ...prev, sid: "", sname: "" };
				});
			}
		}
		if (toggleQueue) setToggleQueue(false);
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
					};
				});
				setSoundUri(newSong?.itemUri);
			}
			setSkip(false);
		}
	}, [skip, globalQueue]);

	return (
		<AudioContext.Provider
			value={{
				sound,
				songInfo,
				status,
				userQueue,
				globalQueue,
				shuffle,
				skip,
				toggleQueue,
				audioFinish,
				setUserQueue,
				setGlobalQueue,
				setSound,
				setSongInfo,
				setStatus,
				setSoundUri,
				setShuffle,
				setToggleQueue,
				setSkip,
			}}
		>
			{children}
		</AudioContext.Provider>
	);
};
