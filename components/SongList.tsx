import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SongData } from "../constants/SongData";
import { SIZES } from "../constants/theme";
import SongItem from "./SongItem";
import { View } from "./Themed";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework as SAF } from "expo-file-system";
import { songItemType } from "../utils/types";

// gpt ne diya hai :D
const regex = /(?<=%2F)[0-9a-zA-Z]+(?=\.mp4)/;
export const directoryUri =
	"content://com.android.externalstorage.documents/tree/primary%3ADownload%2FSongs";

const SongList = () => {
	const [dataArr, setDataArr] = useState<songItemType[]>(SongData);
	useEffect(() => {
		const test = async () => {
			// const permissions = await SAF.requestDirectoryPermissionsAsync();
			// if (!permissions.granted) return;
			// const { directoryUri } = permissions;

			const filesInRoot = await SAF.readDirectoryAsync(directoryUri);
			// console.log(filesInRoot);

			// filesInRoot.map((item) => {
			// 	const match = item.match(regex);
			// 	if (match) {
			// 		console.log(match[0]);
			// 	}
			// });
		};
		test();
	}, []);
	return (
		<View style={styles.container}>
			<FlatList
				showsVerticalScrollIndicator={false}
				data={dataArr}
				renderItem={({ item }) => <SongItem song={item} />}
				contentContainerStyle={{ rowGap: 6 }}
			/>
		</View>
	);
};

export default SongList;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		backgroundColor: "transparent",
		marginTop: SIZES.medium,
	},
});
