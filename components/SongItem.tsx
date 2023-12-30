import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Image, Pressable, StyleSheet, useColorScheme } from "react-native";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { AudioContext } from "../utils/AudioContext";
import { filter } from "../utils/global";
import { songItemType } from "../utils/types";
import { Text, View } from "./Themed";
import { FloatingContext } from "../utils/FloatingContext";
import FloatingMenu from "./FloatingMenu";

export const reducedTitle = (str: string, reductionParam: number = 40) => {
	const filteredString = filter(str);
	if (filteredString.length > reductionParam) {
		return filteredString.slice(0, reductionParam) + "...";
	} else return filteredString;
};

const SongItem = ({
	song,
	selectedPlaylist,
}: {
	song: songItemType;
	selectedPlaylist: string;
}) => {
	const audioContext = useContext(AudioContext);
	const colorScheme = useColorScheme();
	return (
		<Pressable
			onPress={() => {
				console.log(audioContext?.songInfo);
				audioContext?.setSongInfo((prev) => {
					return { ...prev, sid: song.sid, sname: song.sname };
				});
				audioContext?.setSoundUri(song.itemUri);
			}}
		>
			<View
				style={[
					{
						backgroundColor:
							audioContext?.songInfo["sid"] !== undefined &&
							audioContext.songInfo["sid"] === song.sid
								? colorScheme === "light"
									? "#c8c3d8"
									: "#afa3d8"
								: colorScheme === "light"
								? COLORS.whiteSecondary
								: COLORS.darkSecondary,
					},
					styles.container,
				]}
			>
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
						<Text
							style={[
								styles.songTitle,
								{
									color:
										colorScheme === "light" ||
										audioContext?.songInfo["sid"] ===
											song.sid
											? "black"
											: COLORS.whitePrimary,
								},
							]}
						>
							{reducedTitle(song.sname)}
						</Text>
						<View
							style={{
								width: "30%",
								backgroundColor: "transparent",
								paddingTop: 1,
								paddingLeft: SIZES.small,
							}}
						>
							<FloatingMenu
								sid={song.sid}
								currPlaylist={selectedPlaylist}
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
										colorScheme === "light" ||
										audioContext?.songInfo["sid"] ===
											song.sid
											? "black"
											: COLORS.whiteSecondary,
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
		padding: SIZES.xSmall,
		borderRadius: SIZES.medium,
		flexDirection: "row",
	},
	imageContainer: {
		height: 60,
		width: 60,
		borderRadius: SIZES.small,
		overflow: "hidden",
		marginRight: SIZES.xSmall,
	},
	songTitle: {
		width: "70%",
		fontFamily: FONT.medium,
		fontSize: 17,
	},
	artistTitle: {
		fontFamily: FONT.regular,
		fontSize: 15,
	},
	durationTitle: {
		fontFamily: FONT.regular,
		fontSize: 14,
	},
});
