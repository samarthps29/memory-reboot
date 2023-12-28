import { SetStateAction, createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageAccessFramework as SAF } from "expo-file-system";
import { songItemType } from "./types";

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
} | null>(null);

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

	const checkSubstring = (substring: string, stringArr: string[]) => {
		for (const idx in stringArr) {
			if (stringArr[idx].includes(substring)) return stringArr[idx];
		}
		return null;
	};

	const refreshSongs = async () => {
		const files = await SAF.readDirectoryAsync(
			"content://com.android.externalstorage.documents/tree/primary%3ADownload%2FSongs"
		);
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
	};

	const saveData = async () => {
		await AsyncStorage.setItem("songData", JSON.stringify(songData));
		await AsyncStorage.setItem(
			"vidStatusDict",
			JSON.stringify(vidStatusDict)
		);
		setSongDataUpdate(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (songDataUpdate) {
			saveData();
		}
	}, [songDataUpdate, songData]);

	useEffect(() => {
		if (shouldRefresh) {
			refreshSongs();
			setSongDataUpdate(true);
		}
	}, [shouldRefresh, songData]);

	// useEffect(() => {
	// 		const regex = /(?<=%2F)[0-9a-zA-Z]+(?=\.)/;
	// 	const test = async () => {
	// 		const permissions = await SAF.requestDirectoryPermissionsAsync();
	// 		if (!permissions.granted) return;
	// 		const { directoryUri } = permissions;
	// 		const filesInRoot = await SAF.readDirectoryAsync(directoryUri);
	// 		console.log(filesInRoot);
	// 		console.log(filesInRoot);
	// 		filesInRoot.map((item) => {
	// 			const match = item.match(regex);
	// 			if (match) {
	// 				console.log(match[0]);
	// 			}
	// 		});
	// 	};
	// 	test();
	// }, []);

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
			}}
		>
			{children}
		</StorageContext.Provider>
	);
};
