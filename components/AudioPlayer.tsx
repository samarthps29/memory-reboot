import { useContext } from "react";
import { Pressable, StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { AudioContext } from "../utils/AudioContext";
import { Text, View } from "./Themed";
import { StorageContext } from "../utils/StorageContext";
import { reducedTitle } from "./SongItem";
import { Ionicons } from "@expo/vector-icons";

const AudioPlayer = () => {
	// TODO: KeyboardAvoidingView from react-native
	const audioContext = useContext(AudioContext);
	const storageContext = useContext(StorageContext);
	return (
		<View style={styles.container}>
			<View style={styles.songTitleContainer}>
				<Text style={styles.songText} numberOfLines={1}>
					{audioContext?.songInfo["sname"] === undefined
						? "Play Something"
						: reducedTitle(audioContext?.songInfo["sname"] || "")}
				</Text>
			</View>
			<View style={styles.buttonContainer}>
				<Pressable
					onPress={() => {
						storageContext?.setShouldRefresh(true);
					}}
				>
					<Ionicons name="ios-refresh" size={24} color="black" />
					{/* <ion-icon name="reload-outline"></ion-icon> */}
				</Pressable>
				<Pressable
					onPress={() => {
						// console.log("Loop pressed");
						audioContext?.setSongInfo((prev) => {
							const newLoopValue =
								prev["loop"] === "no" ||
								prev["loop"] === undefined
									? "yes"
									: "no";
							return { ...prev, loop: newLoopValue };
						});
					}}
				>
					<Ionicons name="sync-outline" size={24} color="black" />
				</Pressable>
				<Pressable onPress={() => {}}>
					<Ionicons
						name="play-skip-back-outline"
						size={24}
						color="black"
					/>
				</Pressable>
				<Pressable
					disabled={audioContext?.sound === null}
					onPress={() => {
						audioContext?.setStatus((prev) => {
							if (prev === "paused") return "playing";
							else return "paused";
						});
					}}
				>
					{audioContext?.status === "paused" ? (
						<Ionicons name="play-outline" size={24} color="black" />
					) : (
						<Ionicons
							name="pause-outline"
							size={24}
							color="black"
						/>
					)}
				</Pressable>
				<Pressable onPress={() => {}}>
					<Ionicons
						name="play-skip-forward-outline"
						size={24}
						color="black"
					/>
				</Pressable>
			</View>
		</View>
	);
};

export default AudioPlayer;

const styles = StyleSheet.create({
	container: {
		// width: "95%",
		// height: 50,
		backgroundColor: COLORS.white,
		position: "absolute",
		bottom: 0,
		flexDirection: "row",
		paddingVertical: SIZES.small,
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
		alignItems: "flex-start",
		overflow: "hidden",
	},
	songText: {
		fontFamily: FONT.medium,
		fontSize: 16,
		textAlign: "left",
	},
	buttonContainer: {
		width: "40%",
		backgroundColor: "transparent",
		alignItems: "center",
		justifyContent: "flex-end",
		flexDirection: "row",
		gap: SIZES.gap,
	},
	buttonText: {
		fontFamily: FONT.regular,
		fontSize: 16,
	},
});
