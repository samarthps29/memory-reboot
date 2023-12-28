import { useContext } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { AudioContext } from "../utils/AudioContext";
import { fileUri, filter } from "../utils/global";
import { songItemType } from "../utils/types";
import { Text, View } from "./Themed";

export const reducedTitle = (str: string) => {
	const filteredString = filter(str);
	if (filteredString.length > 35) {
		return filteredString.slice(0, 35) + "...";
	} else return filteredString;
};

const SongItem = ({ song }: { song: songItemType }) => {
	const audioContext = useContext(AudioContext);

	return (
		<Pressable
			onPress={() => {
				// const uri = fileUri + "%2F" + song.sid + ".mp4";
				// console.log(uri);
				audioContext?.setSongName(song.sname);
				audioContext?.setSoundUri(song.itemUri);
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
						<Text style={styles.songTitle}>
							{reducedTitle(song.sname)}
						</Text>
						<Text>{song.duration}</Text>
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
		backgroundColor: COLORS.white,
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
		width: "80%",
		fontFamily: FONT.medium,
		fontSize: 18,
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
