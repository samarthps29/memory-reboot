import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageAccessFramework as SAF } from "expo-file-system";
import { SetStateAction, createContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { playlistItemType, songItemType } from "../TypeDeclarations";
import { delimiter } from "../global";

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
} | null>(null);

export const checkSubstring = (substring: string, stringArr: string[]) => {
	for (const idx in stringArr) {
		if (stringArr[idx].includes(substring)) return stringArr[idx];
	}
	return null;
};

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

	const exportData = async () => {
		const files = await SAF.readDirectoryAsync(directoryUri);
		const fileUri = checkSubstring("exportedData.txt", files);
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
			SAF.writeAsStringAsync(
				exportedDataFileUri,
				JSON.stringify(
					songData.map((item) => ({
						...item,
						downloaded: false,
						itemUri: "",
					}))
				) +
					delimiter +
					JSON.stringify(playlistData) +
					delimiter +
					JSON.stringify(vidStatusDict)
			)
				.then(() => {
					Alert.alert("Data exported successfully.");
				})
				.catch(() => {
					Alert.alert("Could not export data.");
				});
		}
	};

	const handleImportData = async (dataArr: any[]) => {
		setSongData(dataArr[0]);
		setPlaylistData(dataArr[1]);
		setVidStatusDict(dataArr[2]);
		setSaveToggle(true);
	};

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
					"This action is irreversible and all your current songs and playlists will be replaced. Do you want to continue?",
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
			}}
		>
			{children}
		</StorageContext.Provider>
	);
};
