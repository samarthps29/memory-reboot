import { AVPlaybackStatusError, AVPlaybackStatusSuccess, Audio } from "expo-av";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { queueNameType, queueType } from "../TypeDeclarations";
import { NotificationContext } from "./NotificationContext";
import { filter } from "../global";

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
	showQueue: queueNameType;
	queueRN: queueNameType;
	setShowQueue: React.Dispatch<React.SetStateAction<queueNameType>>;
	setSongDuration: React.Dispatch<React.SetStateAction<number>>;
	setSongPosition: React.Dispatch<React.SetStateAction<number>>;
	setToggleQueue: React.Dispatch<React.SetStateAction<boolean>>;
	setUserQueue: React.Dispatch<React.SetStateAction<queueType | null>>;
	setGlobalQueue: React.Dispatch<React.SetStateAction<queueType | null>>;
	setSound: React.Dispatch<React.SetStateAction<Audio.Sound | null>>;
	setSongInfo: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	setStatus: React.Dispatch<React.SetStateAction<string>>;
	setSoundUri: React.Dispatch<
		React.SetStateAction<{ uri: string; switch: boolean }>
	>;
	setSkip: React.Dispatch<React.SetStateAction<boolean>>;
	setQueueRN: React.Dispatch<React.SetStateAction<queueNameType>>;
	decideQueue: () => queueNameType;
} | null>(null);

export const AudioContextProvider = ({ children }: React.PropsWithChildren) => {
	const notificationContext = useContext(NotificationContext);
	// TODO: implement types for songInfo and maybe merge songInfo and soundUri
	const [songInfo, setSongInfo] = useState<Record<string, string>>({});
	const [soundUri, setSoundUri] = useState<{ uri: string; switch: boolean }>({
		uri: "",
		switch: false,
	});
	const [sound, setSound] = useState<Audio.Sound | null>(null);
	const [status, setStatus] = useState<string>("paused");
	const [audioFinish, setAudioFinish] = useState<boolean>(false);
	const [userQueue, setUserQueue] = useState<queueType | null>(null);
	const [globalQueue, setGlobalQueue] = useState<queueType | null>(null);
	const [toggleQueue, setToggleQueue] = useState<boolean>(false);
	const [skip, setSkip] = useState<boolean>(false);
	const [songDuration, setSongDuration] = useState<number>(0);
	const [songPosition, setSongPosition] = useState<number>(0);
	const [showQueue, setShowQueue] = useState<queueNameType>("");

	const decideQueue = useCallback(() => {
		if (
			userQueue !== undefined &&
			userQueue !== null &&
			userQueue.queue.length > 0 &&
			userQueue.currentIndex !== -1
		)
			return "userqueue";
		else if (
			globalQueue !== undefined &&
			globalQueue !== null &&
			globalQueue.queue.length > 0 &&
			globalQueue.currentIndex !== -1
		)
			return "globalqueue";
		else return "";
	}, [userQueue, globalQueue]);

	const [queueRN, setQueueRN] = useState<queueNameType>(decideQueue());

	const requestAudioMode = async () => {
		await Audio.setAudioModeAsync({
			staysActiveInBackground: true,
			interruptionModeAndroid: 2,
			shouldDuckAndroid: false,
			playThroughEarpieceAndroid: false,
			playsInSilentModeIOS: true,
			// allowsRecordingIOS: true,
			// interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
		});
	};

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
		if (
			soundUri !== undefined &&
			soundUri !== null &&
			soundUri.uri !== ""
		) {
			await sound?.unloadAsync();
			const { sound: newSound } = await Audio.Sound.createAsync({
				uri: soundUri.uri,
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

	const updateQueueIndex = (queue: queueType) => {
		if (queue.currentIndex === -1) return -1;
		if (queue.currentIndex === queue.queue.length - 1) {
			return -1;
		} else return queue.currentIndex + 1;
	};

	const removeSong = async () => {
		// if something does not work try remove this line
		// or try to call it synchronously
		if (sound) await sound.unloadAsync();
		setSound(null);
		setStatus("paused");
		setAudioFinish(false);
		setSongDuration(0);
		setSongPosition(0);
		setSongInfo((prev) => {
			return { ...prev, sid: "", sname: "", thumbnail: "" };
		});
		await notificationContext?.dismissPushNotification();
	};

	const handleQueueChange = (automaticNextInQueue?: boolean) => {
		if (
			userQueue &&
			userQueue.queue.length > 0 &&
			userQueue.currentIndex !== -1
		) {
			let updatedIndex = userQueue.currentIndex;
			if (automaticNextInQueue) {
				updatedIndex = updateQueueIndex(userQueue);
				setUserQueue((prev) => {
					if (prev === null) return null;
					return {
						...prev,
						currentIndex: updatedIndex,
					};
				});
			}

			if (updatedIndex !== -1) {
				const nextSong = userQueue.queue[updatedIndex];
				setSongInfo((prev) => {
					return {
						...prev,
						sid: nextSong.sid,
						sname: nextSong.sname,
						thumbnail: nextSong.thumbnail,
					};
				});
				setSoundUri((prev) => {
					return { uri: nextSong.itemUri, switch: !prev.switch };
				});
				setAudioFinish(false);
			}
		} else if (
			globalQueue &&
			globalQueue.queue.length > 0 &&
			globalQueue.currentIndex !== -1
		) {
			let updatedIndex = globalQueue.currentIndex;
			if (automaticNextInQueue) {
				updatedIndex = updateQueueIndex(globalQueue);
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
				setSoundUri((prev) => {
					return { uri: nextSong.itemUri, switch: !prev.switch };
				});
				setAudioFinish(false);
			}
		} else {
			removeSong();
		}
		if (toggleQueue) setToggleQueue(false);
	};

	const handleNotification = async () => {
		await notificationContext?.dismissPushNotification();
		await notificationContext?.schedulePushNotification(
			filter(songInfo["sname"])
		);
	};

	useEffect(() => {
		requestAudioMode();
	}, []);

	useEffect(() => {
		changeAudio();
	}, [soundUri]);

	useEffect(() => {
		toggleAudio();
	}, [status, sound]);

	useEffect(() => {
		if (songInfo["sname"] !== undefined && songInfo["sname"] !== "") {
			handleNotification();
		}
	}, [songInfo]);

	useEffect(() => {
		if (audioFinish) {
			if (songInfo["loop"] === "yes") changeAudio();
			else if (globalQueue !== null || userQueue !== null) {
				const queueRNLocal = decideQueue();
				if (queueRNLocal === "") {
					removeSong();
					return;
				}
				if (queueRNLocal === queueRN) {
					// continue normally
					handleQueueChange(true);
				} else {
					// increase the currIndex of queueRN
					const updatedIndex = updateQueueIndex(
						queueRN === "globalqueue" ? globalQueue! : userQueue!
					);
					queueRN === "globalqueue"
						? setGlobalQueue((prev) => {
								if (prev === null) return null;
								return { ...prev, currentIndex: updatedIndex };
						  })
						: setUserQueue((prev) => {
								if (prev === null) return null;
								return { ...prev, currentIndex: updatedIndex };
						  });
					setQueueRN(queueRNLocal);
					handleQueueChange();
				}
			} else {
				removeSong();
			}
		} else if (
			toggleQueue ||
			(queueRN !== decideQueue() &&
				(sound === null || sound === undefined))
		) {
			// initialization of a new queue or a queue switch
			setQueueRN(decideQueue());
			handleQueueChange();
		}
	}, [songInfo, globalQueue, userQueue, toggleQueue, audioFinish, queueRN]);

	useEffect(() => {
		if (skip) {
			const selectedQueue =
				queueRN === "globalqueue" ? globalQueue : userQueue;
			if (selectedQueue?.currentIndex === -1) return;
			const newSong = selectedQueue?.queue[selectedQueue?.currentIndex];
			if (newSong) {
				setSongInfo((prev) => {
					return {
						...prev,
						sid: newSong?.sid,
						sname: newSong?.sname,
						thumbnail: newSong?.thumbnail,
					};
				});
				setSoundUri((prev) => {
					return { uri: newSong?.itemUri, switch: !prev.switch };
				});
				setAudioFinish(false);
			}
			setSkip(false);
		}
	}, [skip, globalQueue, userQueue, queueRN]);

	return (
		<AudioContext.Provider
			value={{
				sound,
				songInfo,
				showQueue,
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
				queueRN,
				setQueueRN,
				setShowQueue,
				setUserQueue,
				setGlobalQueue,
				setSound,
				setSongInfo,
				setStatus,
				setSoundUri,
				setToggleQueue,
				setSkip,
				decideQueue,
			}}
		>
			{children}
		</AudioContext.Provider>
	);
};
