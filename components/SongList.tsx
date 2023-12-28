import { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SIZES } from "../constants/theme";
import { StorageContext } from "../utils/StorageContext";
import { songItemType } from "../utils/types";
import SongItem from "./SongItem";
import { View } from "./Themed";

const SongList = () => {
	const storageContext = useContext(StorageContext);
	const [songData, setSongData] = useState<songItemType[]>([]);

	useEffect(() => {
		setSongData(() => {
			return (
				storageContext?.songData.filter((item) => item.downloaded) || []
			);
		});
	}, [storageContext?.songData]);

	return (
		<View style={styles.container}>
			<FlatList
				showsVerticalScrollIndicator={false}
				data={songData}
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
