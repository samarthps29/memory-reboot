import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { AudioContext } from "../utils/AudioContext";
import { filter } from "../utils/global";
import { songItemType } from "../utils/types";
import { Text, View } from "./Themed";
import { FloatingContext } from "../utils/FloatingContext";
import FloatingMenu from "./FloatingMenu";

export const reducedTitle = (str: string) => {
	const filteredString = filter(str);
	if (filteredString.length > 35) {
		return filteredString.slice(0, 35) + "...";
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
	const floatingContext = useContext(FloatingContext);
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
								? "#c8c3d8"
								: COLORS.white,
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
						<Text style={styles.songTitle}>
							{reducedTitle(song.sname)}
						</Text>
						<View
							style={{
								width: "25%",
								backgroundColor: "transparent",
								paddingTop: 1,
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
						<Text style={styles.artistTitle}>
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
		height: 55,
		width: 55,
		borderRadius: SIZES.small,
		overflow: "hidden",
		marginRight: SIZES.xSmall,
	},
	songTitle: {
		width: "75%",
		fontFamily: FONT.medium,
		fontSize: 18,
		// backgroundColor:"black"
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
