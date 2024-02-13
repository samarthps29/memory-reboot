import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageAccessFramework as SAF } from "expo-file-system";
import {
	SetStateAction,
	createContext,
	useCallback,
	useEffect,
	useState,
} from "react";
import { Alert } from "react-native";
import {
	playlistItemType,
	songItemType,
	videoItemType,
} from "../TypeDeclarations";
import { delimiter, ytTemplate } from "../global";
import { checkSubstring } from "../global";

export const StorageContext = createContext<{
	apiKey: string | null;
	songData: songItemType[];
	setSongData: React.Dispatch<React.SetStateAction<songItemType[]>>;
	directoryUri: string;
	setDirectoryUri: React.Dispatch<SetStateAction<string>>;
	fileUri: string;
	setApiKey: React.Dispatch<SetStateAction<string | null>>;
	setFileUri: React.Dispatch<SetStateAction<string>>;
	setSaveToggle: React.Dispatch<SetStateAction<boolean>>;
	setRefreshToggle: React.Dispatch<SetStateAction<boolean>>;
	vidStatusDict: Record<string, string>;
	setVidStatusDict: React.Dispatch<SetStateAction<Record<string, string>>>;
	playlistData: {
		pid: string;
		pname: string;
	}[];
	setPlaylistData: React.Dispatch<SetStateAction<playlistItemType[]>>;
	exportData: () => Promise<void>;
	importData: () => Promise<void>;
	pullSong: (video: videoItemType) => Promise<void>;
	deleteSong: (sid: string) => Promise<void>;
} | null>(null);

export const StorageContextProvider = ({
	children,
}: React.PropsWithChildren) => {
	const [apiKey, setApiKey] = useState<string | null>(null);
	const [songData, setSongData] = useState<songItemType[]>([]);
	const [directoryUri, setDirectoryUri] = useState<string>("");
	const [fileUri, setFileUri] = useState<string>("");
	const [saveToggle, setSaveToggle] = useState<boolean>(false);
	const [refreshToggle, setRefreshToggle] = useState<boolean>(false);
	const [vidStatusDict, setVidStatusDict] = useState<Record<string, string>>(
		{}
	);
	const [playlistData, setPlaylistData] = useState<playlistItemType[]>([
		{ pid: "0", pname: "all songs" },
	]);

	const checkDirectoryAccess = async () => {
		const directoryUriStored = await AsyncStorage.getItem("directoryUri");
		if (directoryUriStored === null || directoryUriStored.trim() === "") {
			const permissions = await SAF.requestDirectoryPermissionsAsync();
			if (!permissions.granted) {
				Alert.alert(
					"Directory Permission not granted. Clear cache and try again."
				);
				return;
			}
			const { directoryUri: uri } = permissions;
			setDirectoryUri(uri);
			await AsyncStorage.setItem("directoryUri", uri);
		} else {
			setDirectoryUri(directoryUriStored);
		}
	};

	const fetchData = () => {
		AsyncStorage.getItem("apiKey").then((res) => {
			if (res !== null) setApiKey(JSON.parse(res));
		});
		AsyncStorage.getItem("songData").then(async (res) => {
			if (res !== null) {
				setSongData(JSON.parse(res));
			} else await AsyncStorage.setItem("songData", "[]");
		});
		AsyncStorage.getItem("vidStatusDict").then(async (res) => {
			if (res !== null) {
				setVidStatusDict(JSON.parse(res));
			} else await AsyncStorage.setItem("vidStatusDict", "{}");
		});
		AsyncStorage.getItem("playlistData").then(async (res) => {
			if (res !== null) {
				setPlaylistData(JSON.parse(res));
			} else {
				const newPlaylistData = [{ pid: "0", pname: "all songs" }];
				await AsyncStorage.setItem(
					"playlistData",
					JSON.stringify(newPlaylistData)
				);
			}
		});
	};

	const refreshSongs = async () => {
		const files = await SAF.readDirectoryAsync(directoryUri);
		let isPulled: Record<string, string> = {};
		songData.forEach((item) => {
			const uri = checkSubstring(item.sid, files);
			if (uri !== null) {
				isPulled[item.sid] = uri;
			} else isPulled[item.sid] = "";
		});

		setSongData((prev) => {
			return prev.map((item) => {
				if (isPulled[item.sid] !== "") {
					return {
						...item,
						downloaded: true,
						itemUri: isPulled[item.sid],
					};
				} else return item;
			});
		});
		setVidStatusDict((prev) => {
			let dict = prev;
			songData.forEach((item) => {
				if (isPulled[item.sid] !== "") {
					dict[item.sid] = "downloaded";
				}
			});
			return dict;
		});
		setRefreshToggle(false);
	};

	const handleRefresh = async () => {
		await refreshSongs();
		setSaveToggle(true);
	};

	const saveData = async () => {
		const apiTask = AsyncStorage.setItem("apiKey", JSON.stringify(apiKey));
		const songTask = AsyncStorage.setItem(
			"songData",
			JSON.stringify(songData)
		);
		const vidStatusTask = AsyncStorage.setItem(
			"vidStatusDict",
			JSON.stringify(vidStatusDict)
		);
		const playlistTask = AsyncStorage.setItem(
			"playlistData",
			JSON.stringify(playlistData)
		);
		await Promise.all([apiTask, songTask, vidStatusTask, playlistTask]);
		setSaveToggle(false);
	};

	const pullSong = async (video: videoItemType) => {
		const files = await SAF.readDirectoryAsync(directoryUri);
		const dataFileUri = checkSubstring("data.txt", files);
		if (dataFileUri !== null) {
			const content = await SAF.readAsStringAsync(dataFileUri);
			await SAF.writeAsStringAsync(
				dataFileUri,
				content + ytTemplate(video.id.videoId) + ";"
			);
		} else {
			const file = await SAF.createFileAsync(
				directoryUri,
				"data.txt",
				"text/plain"
			);
			await SAF.writeAsStringAsync(
				file,
				ytTemplate(video.id.videoId) + ";"
			);
		}
	};

	const markSongForDeletion = async (sid: string) => {
		const files = await SAF.readDirectoryAsync(directoryUri);
		const fileUri = checkSubstring("delete.txt", files);
		if (fileUri !== null) {
			const content = await SAF.readAsStringAsync(fileUri);
			await SAF.writeAsStringAsync(fileUri, content + sid + "\n");
		} else {
			const createdfileUri = await SAF.createFileAsync(
				directoryUri,
				"delete.txt",
				"text/plain"
			);
			await SAF.writeAsStringAsync(createdfileUri, sid + "\n");
		}
	};

	const deleteSong = async (sid: string) => {
		await markSongForDeletion(sid);
		setSongData((prev) => {
			return prev.filter((pitem) => pitem.sid !== sid);
		});
		setVidStatusDict((prev) => {
			if (prev[sid] !== undefined && prev[sid] !== null) delete prev[sid];
			return prev;
		});
		setSaveToggle(true);
	};

	const exportData = async () => {
		const files = await SAF.readDirectoryAsync(directoryUri);
		const fileUri = checkSubstring("exportedData.txt", files);
		console.log(fileUri);
		if (fileUri !== null) {
			Alert.alert(
				"Warning",
				"File 'exportedData.txt' already exists. Remove it and try again."
			);
		} else {
			const exportedDataFileUri = await SAF.createFileAsync(
				directoryUri,
				"exportedData.txt",
				"text/plain"
			);
			// create a new vidStatusDict with all status to be pending
			let newVidStatusDict = vidStatusDict;
			songData.forEach((item) => {
				newVidStatusDict[item.sid] = "pending";
			});

			SAF.writeAsStringAsync(
				exportedDataFileUri,
				JSON.stringify(
					songData.map((item) => ({
						...item,
						downloaded: false,
						itemUri: "",
						// playlists: [],
					}))
				) +
					delimiter +
					// exporting all playlists except the default one
					JSON.stringify(
						playlistData.filter((pitem) => pitem.pid !== "0")
					) +
					delimiter +
					JSON.stringify(newVidStatusDict)
			)
				.then(() => {
					Alert.alert("Data exported successfully.");
				})
				.catch(() => {
					Alert.alert("Could not export data.");
				});
		}
	};

	const handleImportData = useCallback(
		async (dataArr: any[]) => {
			const newSongData: songItemType[] = dataArr[0];
			const newPlaylistData: playlistItemType[] = dataArr[1];
			const newVidStatusDict: Record<string, string> = dataArr[2];

			let toInclude: Record<string, boolean> = {};
			newSongData.forEach((item) => {
				if (vidStatusDict[item.sid] === undefined)
					toInclude[item.sid] = true;
				else toInclude[item.sid] = false;
			});

			setSongData((prev) => {
				return [
					...prev,
					...newSongData.filter((item) => toInclude[item.sid]),
				];
			});

			setPlaylistData((prev) => {
				// it is really unlikely that the uuid of two playlists will be the exact same
				// so avoiding that check
				return [...prev, ...newPlaylistData];
			});

			setVidStatusDict((prev) => {
				newSongData.forEach((item) => {
					if (!toInclude[item.sid]) {
						delete newVidStatusDict[item.sid];
					}
				});
				return { ...prev, ...newVidStatusDict };
			});
			setSaveToggle(true);
		},
		[vidStatusDict]
	);

	const importData = async () => {
		const files = await SAF.readDirectoryAsync(directoryUri);
		const fileUri = checkSubstring("exportedData.txt", files);
		if (fileUri !== null) {
			const content = await SAF.readAsStringAsync(fileUri);
			const data = content
				.split(delimiter)
				.map((item) => JSON.parse(item));
			if (data.length !== 3) Alert.alert("Data format incorrect.");
			else {
				Alert.alert(
					"Confirm",
					"This action will add new songs and playlist. Do you want to continue?",
					[
						{
							text: "Yes",
							onPress: () => {
								handleImportData(data);
							},
						},
						{ text: "No", onPress: () => {} },
					]
				);
			}
		}
	};

	useEffect(() => {
		checkDirectoryAccess();
		fetchData();
	}, []);

	useEffect(() => {
		if (saveToggle && directoryUri !== "") {
			saveData();
		}
	}, [
		saveToggle,
		songData,
		vidStatusDict,
		playlistData,
		apiKey,
		directoryUri,
	]);

	useEffect(() => {
		if (refreshToggle && directoryUri !== "") {
			handleRefresh();
		}
	}, [refreshToggle, songData, vidStatusDict, playlistData, directoryUri]);

	return (
		<StorageContext.Provider
			value={{
				apiKey,
				songData,
				directoryUri,
				fileUri,
				setApiKey,
				setSongData,
				setDirectoryUri,
				setFileUri,
				setSaveToggle,
				setRefreshToggle,
				vidStatusDict,
				setVidStatusDict,
				playlistData,
				setPlaylistData,
				exportData,
				importData,
				pullSong,
				deleteSong,
			}}
		>
			{children}
		</StorageContext.Provider>
	);
};
