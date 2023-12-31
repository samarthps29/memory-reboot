import { useCallback, useContext, useEffect, useState } from "react";
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
	// const [showQueue, setShowQueue] = useState<boolean>(false);
	const colorScheme = useColorScheme();
	const [showQueueData, setShowQueueData] = useState<string>("");

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

	const decideQueue = useCallback(() => {
		if (
			audioContext?.userQueue !== undefined &&
			audioContext.userQueue !== null &&
			audioContext.userQueue.queue.length > 0 &&
			audioContext.userQueue.currentIndex !== -1
		)
			return "userqueue";
		else if (
			audioContext?.globalQueue !== undefined &&
			audioContext.globalQueue !== null &&
			audioContext.globalQueue.queue.length > 0 &&
			audioContext.globalQueue.currentIndex !== -1
		)
			return "globalqueue";
		else return "";
	}, [audioContext?.userQueue, audioContext?.globalQueue]);

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
							setShowQueueData("");
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
							{storageContext?.playlistData
								.filter(
									(pitem) =>
										pitem.pid === selectedHeaderButton
								)
								.map(
									(matchingPlaylist) => matchingPlaylist.pname
								)[0] || "All"}
						</Text>
					</Pressable>
					{audioContext?.globalQueue && (
						<Pressable
							onPress={() => {
								setShowQueueData("global");
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
								GQueue
							</Text>
						</Pressable>
					)}
					{audioContext?.userQueue && (
						<Pressable
							onPress={() => {
								setShowQueueData("user");
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
								UQueue
							</Text>
						</Pressable>
					)}
				</View>
				<View
					style={{
						backgroundColor: "transparent",
						flexDirection: "row",
						gap: 12,
					}}
				>
					<Pressable
						onPress={() => {
							const res = decideQueue();
							if (res === "" || res === "globalqueue") {
								audioContext?.setGlobalQueue({
									currentIndex: 0,
									queue: songData,
								});
							}
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
			</View>
			<FlatList
				showsVerticalScrollIndicator={false}
				data={
					showQueueData === "global"
						? audioContext?.globalQueue?.queue
						: showQueueData === "user"
						? audioContext?.userQueue?.queue
						: songData
				}
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
