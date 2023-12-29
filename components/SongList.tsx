import { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SIZES } from "../constants/theme";
import { StorageContext } from "../utils/StorageContext";
import { songItemType } from "../utils/types";
import SongItem from "./SongItem";
import { View } from "./Themed";

const SongList = ({
	searchTerm,
	selectedHeaderButton,
}: {
	searchTerm: string;
	selectedHeaderButton: string;
}) => {
	const storageContext = useContext(StorageContext);
	// local song data
	const [songData, setSongData] = useState<songItemType[]>([]);

	useEffect(() => {
		setSongData(() => {
			return (
				storageContext?.songData.filter(
					(item) =>
						item.downloaded &&
						item.sname
							.toLowerCase()
							.includes(searchTerm.toLowerCase()) &&
						(selectedHeaderButton === "0" ||
							item?.playlists?.includes(selectedHeaderButton))
				) || []
			);
		});
	}, [storageContext?.songData, searchTerm, selectedHeaderButton]);

	return (
		<View style={styles.container}>
			<FlatList
				showsVerticalScrollIndicator={false}
				data={songData}
				renderItem={({ item }) => (
					<SongItem
						song={item}
						selectedPlaylist={selectedHeaderButton}
					/>
				)}
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
