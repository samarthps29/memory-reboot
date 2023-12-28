import { useContext } from "react";
import { Pressable, StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { AudioContext } from "../utils/AudioContext";
import { Text, View } from "./Themed";
import { StorageContext } from "../utils/StorageContext";
import { reducedTitle } from "./SongItem";

const AudioPlayer = () => {
	// TODO: KeyboardAvoidingView from react-native
	const audioContext = useContext(AudioContext);
	const storageContext = useContext(StorageContext);
	return (
		<View style={styles.container}>
			<View style={styles.buttonContainer}>
				<Pressable
					style={{ width: "100%", alignItems: "flex-start" }}
					onPress={() => {
						storageContext?.setShouldRefresh(true);
					}}
				>
					<Text style={styles.buttonText}>Refresh</Text>
				</Pressable>
			</View>

			<View style={styles.songTitleContainer}>
				<Text style={styles.songText} numberOfLines={1}>
					{audioContext?.songInfo["sname"] === undefined
						? "Play Something"
						: reducedTitle(audioContext?.songInfo["sname"] || "")}
				</Text>
			</View>
			<View style={styles.buttonContainer}>
				<Pressable
					style={{ width: "100%", alignItems: "flex-end" }}
					disabled={audioContext?.sound === null}
					onPress={() => {
						audioContext?.setStatus((prev) => {
							if (prev === "paused") return "playing";
							else return "paused";
						});
					}}
				>
					<Text style={styles.buttonText}>
						{audioContext?.status === "paused" ? "Resume" : "Pause"}
					</Text>
				</Pressable>
			</View>
		</View>
	);
};

export default AudioPlayer;

const styles = StyleSheet.create({
	container: {
		// width: "95%",
		height: 50,
		backgroundColor: COLORS.white,
		position: "absolute",
		bottom: 0,
		flexDirection: "row",
		paddingVertical: SIZES.medium,
		paddingHorizontal: SIZES.small,
		alignItems: "center",
		// borderTopRightRadius: SIZES.small,
		// borderTopLeftRadius: SIZES.small,
		// left: 16,
		// right: 16,
	},
	songTitleContainer: {
		width: "60%",
		backgroundColor: "transparent",
		alignItems: "center",
		overflow: "hidden",
	},
	songText: {
		fontFamily: FONT.medium,
		fontSize: 16,
		textAlign: "center",
	},
	buttonContainer: {
		width: "20%",
		backgroundColor: "transparent",
		alignItems: "center",
	},
	buttonText: {
		fontFamily: FONT.regular,
		fontSize: 16,
	},
});
