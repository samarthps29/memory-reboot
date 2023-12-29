import { SetStateAction, createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageAccessFramework as SAF } from "expo-file-system";
import { songItemType } from "./types";
import { ytTemplate } from "./global";

export const StorageContext = createContext<{
	songData: songItemType[];
	setSongData: React.Dispatch<React.SetStateAction<songItemType[]>>;
	directoryUri: string;
	setDirectoryUri: React.Dispatch<SetStateAction<string>>;
	fileUri: string;
	setFileUri: React.Dispatch<SetStateAction<string>>;
	setSongDataUpdate: React.Dispatch<SetStateAction<boolean>>;
	setShouldRefresh: React.Dispatch<SetStateAction<boolean>>;
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
	const [songData, setSongData] = useState<songItemType[]>([]);
	const [directoryUri, setDirectoryUri] = useState<string>("");
	const [fileUri, setFileUri] = useState<string>("");
	const [songDataUpdate, setSongDataUpdate] = useState<boolean>(false);
	const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
	const [vidStatusDict, setVidStatusDict] = useState<Record<string, string>>(
		{}
	);
	const [playlistData, setPlaylistData] = useState<
		{ pid: string; pname: string }[]
	>([{ pid: "0", pname: "all" }]);

	// TODO: rename songdateupdate to savetoggle and shouldrefresh to refreshtoggle

	const checkDirectoryAccess = async () => {
		const directoryUriStored = await AsyncStorage.getItem("directoryUri");
		// console.log(directoryUriStored);
		if (directoryUriStored === null || directoryUriStored.trim() === "") {
			const permissions = await SAF.requestDirectoryPermissionsAsync();
			if (!permissions.granted) return;
			const { directoryUri: uri } = permissions;
			// console.log(uri);
			setDirectoryUri(uri);
			await AsyncStorage.setItem("directoryUri", uri);
		} else {
			setDirectoryUri(directoryUriStored);
		}
	};

	// const updateDataFile = async () => {
	// 	const files = await SAF.readDirectoryAsync(directoryUri);
	// 	const dataFileUri = checkSubstring("data.txt", files);

	// 	const pulledSongs = songData
	// 		.filter((item) => !item.downloaded)
	// 		.map((item) => item.sid);
	// 	if (dataFileUri !== null) {
	// 		let updatedContent: string = "";
	// 		pulledSongs.forEach((item) => {
	// 			updatedContent = updatedContent + ytTemplate(item) + ";";
	// 		});
	// 		// console.log("upd", updatedContent);
	// 		await SAF.deleteAsync(dataFileUri);
	// 		const file = await SAF.createFileAsync(
	// 			directoryUri,
	// 			"data.txt",
	// 			"text/plain"
	// 		);
	// 		await SAF.writeAsStringAsync(file, updatedContent);
	// 	}
	// };

	const refreshSongs = async () => {
		const files = await SAF.readDirectoryAsync(directoryUri);
		// console.log(files);
		// reduce calculation for setSongData and setVidStatusDict
		setSongData((prev) => {
			return prev.map((item) => {
				const uri = checkSubstring(item.sid, files);
				if (uri !== null) {
					return { ...item, downloaded: true, itemUri: uri };
				} else return item;
			});
		});
		setVidStatusDict((prev) => {
			let dict = prev;
			songData.forEach((item) => {
				const uri = checkSubstring(item.sid, files);
				if (uri !== null) {
					dict[item.sid] = "downloaded";
				}
			});
			return dict;
		});
		// updateDataFile(); this deletes the entire directory ahhhhhhhhhhhh never uncomment
		setShouldRefresh(false);
	};

	const fetchData = () => {
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
				// console.log(res);
				setPlaylistData(JSON.parse(res));
			} else {
				const newPlaylistData = [{ pid: "0", pname: "all" }];
				await AsyncStorage.setItem(
					"playlistData",
					JSON.stringify(newPlaylistData)
				);
			}
		});
	};

	const saveData = async () => {
		await AsyncStorage.setItem("songData", JSON.stringify(songData));
		await AsyncStorage.setItem(
			"vidStatusDict",
			JSON.stringify(vidStatusDict)
		);
		await AsyncStorage.setItem(
			"playlistData",
			JSON.stringify(playlistData)
		);
		setSongDataUpdate(false);
	};

	useEffect(() => {
		checkDirectoryAccess();
		fetchData();
	}, []);

	useEffect(() => {
		if (songDataUpdate && directoryUri !== "") {
			saveData();
		}
	}, [songDataUpdate, songData, vidStatusDict, playlistData, directoryUri]);

	useEffect(() => {
		if (shouldRefresh && directoryUri !== "") {
			refreshSongs();
			setSongDataUpdate(true);
		}
	}, [shouldRefresh, songData, vidStatusDict, playlistData, directoryUri]);

	return (
		<StorageContext.Provider
			value={{
				songData,
				directoryUri,
				fileUri,
				setSongData,
				setDirectoryUri,
				setFileUri,
				setSongDataUpdate,
				setShouldRefresh,
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
