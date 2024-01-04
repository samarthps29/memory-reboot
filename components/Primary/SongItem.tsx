import { useContext } from "react";
import { Image, Pressable, StyleSheet, useColorScheme } from "react-native";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import { AudioContext } from "../../utils/Contexts/AudioContext";
import { songItemType } from "../../utils/TypeDeclarations";
import { reducedTitle } from "../../utils/global";
import FloatingMenu from "../Common/FloatingMenu";
import { Text, View } from "../Common/Themed";

const SongItem = ({
	song,
	selectedPlaylist,
	index,
}: {
	song: songItemType;
	selectedPlaylist: string;
	index: number;
}) => {
	const audioContext = useContext(AudioContext);
	const colorScheme = useColorScheme();
	return (
		<Pressable
			onPress={() => {
				const selectedQueue = audioContext?.showQueue;
				if (selectedQueue === "globalqueue") {
					audioContext?.setGlobalQueue((prev) => {
						if (prev === null) return null;
						return { ...prev, currentIndex: index };
					});
				} else if (selectedQueue === "userqueue") {
					audioContext?.setUserQueue((prev) => {
						if (prev === null) return null;
						return { ...prev, currentIndex: index };
					});
				}
				audioContext?.setSongInfo((prev) => {
					return {
						...prev,
						sid: song.sid,
						sname: song.sname,
						thumbnail: song.thumbnail,
					};
				});
				audioContext?.setSoundUri((prev) => {
					return { uri: song.itemUri, switch: !prev.switch };
				});
			}}
		>
			<View style={styles.container}>
				<View style={styles.imageContainer}>
					<Image
						source={{ uri: song.thumbnail }}
						style={{
							flex: 1,
							height: undefined,
							width: undefined,
							alignSelf: "stretch",
						}}
					/>
				</View>
				<View
					style={{
						flexGrow: 1,
						backgroundColor: "transparent",
						justifyContent: "center",
					}}
				>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							backgroundColor: "transparent",
						}}
					>
						<View
							style={{
								width: "75%",
								backgroundColor: "transparent",
							}}
						>
							<Text
								numberOfLines={1}
								style={[
									styles.songTitle,
									{
										color:
											colorScheme === "light" ||
											audioContext?.songInfo["sid"] ===
												song.sid
												? COLORS.primary
												: COLORS.whitePrimary,
									},
								]}
							>
								{reducedTitle(song.sname, 120)}
							</Text>
						</View>

						<View
							style={{
								width: "25%",
								backgroundColor: "transparent",
								paddingTop: 1,
								paddingLeft: 2,
							}}
						>
							<FloatingMenu
								song={song}
								currPlaylist={selectedPlaylist}
								index={index}
							/>
						</View>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							backgroundColor: "transparent",
							marginTop: 2,
						}}
					>
						<Text
							style={[
								styles.artistTitle,
								{
									color:
										colorScheme === "light"
											? "black"
											: COLORS.whiteTertiary,
								},
							]}
						>
							{reducedTitle(song.aname)}
						</Text>
					</View>
				</View>
			</View>
		</Pressable>
	);
};

export default SongItem;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		paddingHorizontal: SIZES.gap,
		paddingVertical: SIZES.gap,
		borderRadius: SIZES.medium,
		flexDirection: "row",
		backgroundColor: "transparent",
	},
	imageContainer: {
		height: 55,
		width: 55,
		borderRadius: SIZES.small,
		overflow: "hidden",
		marginRight: SIZES.xSmall,
	},
	songTitle: {
		width: "96%",
		fontFamily: FONT.medium,
		fontSize: 16,
	},
	artistTitle: {
		fontFamily: FONT.regular,
		fontSize: 14,
	},
	durationTitle: {
		fontFamily: FONT.regular,
		fontSize: 14,
	},
});
