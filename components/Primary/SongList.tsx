import { FlashList } from "@shopify/flash-list";
import { useCallback, useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import { AudioContext } from "../../utils/Contexts/AudioContext";
import { StorageContext } from "../../utils/Contexts/StorageContext";
import { SwitchPageContext } from "../../utils/Contexts/SwitchPageContext";
import { songItemType } from "../../utils/TypeDeclarations";
import { durstenfeldShuffle } from "../../utils/global";
import SongItem from "./SongItem";
// import { Text, View } from "../Common/Themed";

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

	const SongListItem = useCallback(
		({ item, index }: { item: songItemType; index: number }) => (
			<SongItem
				index={index}
				song={item}
				selectedPlaylist={selectedHeaderButton}
			/>
		),
		[selectedHeaderButton]
	);

	const ItemSeparator = useCallback(() => <View style={{ height: 4 }} />, []);

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
						<TouchableWithoutFeedback
							// delayLongPress={250}
							onPress={() => {
								switchContext?.setShowHeader(true);
							}}
						>
							<Text
								style={[
									styles.buttonText,
									{
										color: COLORS.whiteSecondary,
									},
								]}
							>
								cdz
							</Text>
						</TouchableWithoutFeedback>
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
										audioContext?.showQueue === ""
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
								)[0] || "all songs"}
						</Text>
					</Pressable>
					{audioContext?.globalQueue && (
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
											audioContext?.showQueue ===
											"globalqueue"
												? COLORS.whitePrimary
												: COLORS.whiteTertiary,
									},
								]}
							>
								System
							</Text>
						</Pressable>
					)}
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
											audioContext?.showQueue ===
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
						gap: 8,
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
									color: COLORS.whiteSecondary,
								},
							]}
						>
							Play
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
									color: COLORS.whiteSecondary,
								},
							]}
						>
							Shuffle
						</Text>
					</Pressable>
				</View>
			</View>
			<FlashList
				// windowSize={15}
				// initialNumToRender={10}
				// maxToRenderPerBatch={20}
				showsVerticalScrollIndicator={false}
				data={
					audioContext?.showQueue === "globalqueue"
						? audioContext?.globalQueue?.queue
						: audioContext?.showQueue === "userqueue"
						? audioContext?.userQueue?.queue
						: songData
				}
				renderItem={SongListItem}
				ItemSeparatorComponent={ItemSeparator}
				// contentContainerStyle={styles.listItem}
				// getItemLayout={getItemLayout}
				estimatedItemSize={250}
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
		marginTop: SIZES.small, // changed
	},
	buttonsContainer: {
		width: "100%",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: SIZES.small,
		flexDirection: "row",
		gap: SIZES.small,
		paddingHorizontal: 4,
		backgroundColor: "transparent",
	},
	buttonText: {
		fontFamily: FONT.regular,
	},
});
