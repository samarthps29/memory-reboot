import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageAccessFramework as SAF } from "expo-file-system";
import { SetStateAction, createContext, useEffect, useState } from "react";
import { songItemType } from "../TypeDeclarations";
import { Alert } from "react-native";

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
	setPlaylistData: React.Dispatch<
		SetStateAction<
			{
				pid: string;
				pname: string;
			}[]
		>
	>;
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
	const [playlistData, setPlaylistData] = useState<
		{ pid: string; pname: string }[]
	>([{ pid: "0", pname: "all songs" }]);

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
			refreshSongs();
			setSaveToggle(true);
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
			}}
		>
			{children}
		</StorageContext.Provider>
	);
};
