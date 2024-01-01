import { useCallback, useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import { StorageContext } from "../../utils/Contexts/StorageContext";
import { songItemType } from "../../utils/TypeDeclarations";
import SongItem from "./SongItem";
import { Text, View } from "../Common/Themed";
import { AudioContext } from "../../utils/Contexts/AudioContext";
import { durstenfeldShuffle } from "../../utils/global";
import { SwitchPageContext } from "../../utils/Contexts/SwitchPageContext";

const SongList = ({
	searchTerm,
	selectedHeaderButton,
}: {
	searchTerm: string;
	selectedHeaderButton: string;
}) => {
	const storageContext = useContext(StorageContext);
	const audioContext = useContext(AudioContext);
	const switchContext = useContext(SwitchPageContext);
	// local song data
	const [songData, setSongData] = useState<songItemType[]>([]);
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
					{!switchContext?.showHeader && (
						<Pressable
							onPress={() => {
								switchContext?.setShowHeader(true);
							}}
						>
							<Text
								style={[
									styles.buttonText,
									{
										color:
											colorScheme === "light"
												? audioContext?.showQueue === ""
													? "black"
													: COLORS.darkSecondary
												: audioContext?.showQueue === ""
												? COLORS.whitePrimary
												: COLORS.whiteTertiary,
									},
								]}
							>
								cdz
							</Text>
						</Pressable>
					)}
					<Pressable
						onPress={() => {
							audioContext?.setShowQueue("");
						}}
					>
						<Text
							style={[
								styles.buttonText,
								{
									color:
										colorScheme === "light"
											? audioContext?.showQueue === ""
												? "black"
												: COLORS.darkSecondary
											: audioContext?.showQueue === ""
											? COLORS.whitePrimary
											: COLORS.whiteTertiary,
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
					{/* {audioContext?.globalQueue && (
						<Pressable
							onPress={() => {
								audioContext?.setShowQueue("globalqueue");
							}}
						>
							<Text
								style={[
									styles.buttonText,
									{
										color:
											colorScheme === "light"
												? audioContext?.showQueue ===
												  "globalqueue"
													? "black"
													: COLORS.darkSecondary
												: audioContext?.showQueue ===
												  "globalqueue"
												? COLORS.whitePrimary
												: COLORS.whiteTertiary,
									},
								]}
							>
								System
							</Text>
						</Pressable>
					)} */}
					{audioContext?.userQueue && (
						<Pressable
							onPress={() => {
								audioContext?.setShowQueue("userqueue");
							}}
						>
							<Text
								style={[
									styles.buttonText,
									{
										color:
											colorScheme === "light"
												? audioContext?.showQueue ===
												  "userqueue"
													? "black"
													: COLORS.darkSecondary
												: audioContext?.showQueue ===
												  "userqueue"
												? COLORS.whitePrimary
												: COLORS.whiteTertiary,
									},
								]}
							>
								Queue
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
					audioContext?.showQueue === "globalqueue"
						? audioContext?.globalQueue?.queue
						: audioContext?.showQueue === "userqueue"
						? audioContext?.userQueue?.queue
						: songData
				}
				renderItem={({ item, index }) => (
					<SongItem
						index={index}
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
