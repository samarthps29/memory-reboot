import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { StorageContext } from "../utils/StorageContext";
import { songItemType } from "../utils/types";
import SongItem from "./SongItem";
import { Text, View } from "./Themed";
import { AudioContext } from "../utils/AudioContext";
import { durstenfeldShuffle } from "../utils/global";

const SongList = ({
	searchTerm,
	selectedHeaderButton,
}: {
	searchTerm: string;
	selectedHeaderButton: string;
}) => {
	const storageContext = useContext(StorageContext);
	const audioContext = useContext(AudioContext);
	// local song data
	const [songData, setSongData] = useState<songItemType[]>([]);
	const [showQueue, setShowQueue] = useState<boolean>(false);
	const colorScheme = useColorScheme();

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

	// useEffect(() => {
	// 	console.log(songData);
	// }, [songData]);

	return (
		<View style={styles.container}>
			<View style={styles.buttonsContainer}>
				<View
					style={{
						backgroundColor: "transparent",
						flexDirection: "row",
						gap: 12,
					}}
				>
					<Pressable
						onPress={() => {
							audioContext?.setGlobalQueue({
								currentIndex: 0,
								queue: songData,
							});
							audioContext?.setToggleQueue(true);
						}}
					>
						<Text
							style={[
								styles.buttonText,
								{
									color:
										colorScheme === "light"
											? "black"
											: COLORS.whitePrimary,
								},
							]}
						>
							Play All
						</Text>
					</Pressable>
					<Pressable
						disabled={
							audioContext?.globalQueue?.queue === undefined ||
							audioContext?.globalQueue?.queue.length === 0
						}
						onPress={() => {
							setShowQueue((prev) => !prev);
						}}
					>
						<Text
							style={[
								styles.buttonText,
								{
									color:
										colorScheme === "light"
											? "black"
											: COLORS.whitePrimary,
								},
							]}
						>
							{showQueue ? "Back" : "Queue"}
						</Text>
					</Pressable>
				</View>
				<Pressable
					onPress={() => {
						let temp = [...songData];
						temp = durstenfeldShuffle(temp);
						audioContext?.setGlobalQueue({
							currentIndex: 0,
							queue: temp,
						});
						audioContext?.setToggleQueue(true);
					}}
				>
					<Text
						style={[
							styles.buttonText,
							{
								color:
									colorScheme === "light"
										? "black"
										: COLORS.whitePrimary,
							},
						]}
					>
						Shuffle
					</Text>
				</Pressable>
			</View>
			<FlatList
				showsVerticalScrollIndicator={false}
				data={showQueue ? audioContext?.globalQueue?.queue : songData}
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
	buttonsContainer: {
		width: "100%",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: SIZES.xxSmall,
		flexDirection: "row",
		gap: SIZES.small,
		paddingHorizontal: 4,
	},
	buttonText: {
		fontFamily: FONT.regular,
	},
});
