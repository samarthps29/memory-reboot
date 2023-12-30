import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { AudioContext } from "../utils/AudioContext";
import { Text, View } from "./Themed";
import { StorageContext } from "../utils/StorageContext";
import { reducedTitle } from "./SongItem";
import { Ionicons } from "@expo/vector-icons";

function positiveModulo(dividend: number, divisor: number) {
	return ((dividend % divisor) + divisor) % divisor;
}

const AudioPlayer = () => {
	// TODO: KeyboardAvoidingView from react-native
	const audioContext = useContext(AudioContext);
	const storageContext = useContext(StorageContext);
	const [backClickCount, setBackClickCount] = useState<number | null>(null);
	const colorScheme = useColorScheme();

	const handleBackOnce = () => {
		audioContext?.sound?.playFromPositionAsync(0);
	};

	const handleBackTwice = () => {
		// check which queue is currently is use then appropriately go back a track
		audioContext?.setGlobalQueue((prev) => {
			if (prev === null) return null;
			return {
				...prev,
				currentIndex:
					prev.currentIndex === -1
						? prev.queue.length - 1
						: prev.currentIndex === 0
						? 0
						: prev.currentIndex - 1,
			};
		});
		audioContext?.setSkip(true);
	};

	const handleForward = () => {
		// check which queue is currently is use then appropriately go back a track
		audioContext?.setGlobalQueue((prev) => {
			if (prev === null) return null;
			return {
				...prev,
				currentIndex:
					prev.currentIndex === -1
						? 0
						: prev.currentIndex + 1 === prev.queue.length
						? prev.currentIndex
						: prev.currentIndex + 1,
			};
		});
		audioContext?.setSkip(true);
	};

	useEffect(() => {
		if (backClickCount === 0) {
			handleBackOnce();
		} else if (backClickCount === 1) handleBackTwice();
	}, [backClickCount]);

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor:
						colorScheme === "light"
							? COLORS.lightWhite
							: COLORS.darkSecondary,
				},
			]}
		>
			<View style={styles.songTitleContainer}>
				<Text
					style={[
						styles.songText,
						{
							color:
								colorScheme === "light"
									? "black"
									: COLORS.whitePrimary,
						},
					]}
					numberOfLines={1}
				>
					{audioContext?.songInfo["sname"] === undefined ||
					audioContext.songInfo["sname"] === ""
						? "Play Something"
						: reducedTitle(
								audioContext?.songInfo["sname"] || "",
								25
						  )}
				</Text>
			</View>
			<View style={styles.buttonContainer}>
				<Pressable
					onPress={() => {
						storageContext?.setShouldRefresh(true);
					}}
				>
					<Ionicons
						name="ios-refresh"
						size={24}
						color={
							colorScheme === "light"
								? "black"
								: COLORS.whiteSecondary
						}
					/>
				</Pressable>
				<Pressable
					style={{ alignItems: "center", justifyContent: "center" }}
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
					<Ionicons
						name="sync-outline"
						size={24}
						color={
							colorScheme === "light"
								? "black"
								: COLORS.whiteSecondary
						}
					/>
					{audioContext?.songInfo["loop"] === "yes" && (
						<View
							style={{
								height: 3,
								width: 3,
								backgroundColor:
									colorScheme === "light"
										? "black"
										: COLORS.whiteSecondary,
								borderRadius: 100,
								position: "absolute",
								bottom: -3,
							}}
						/>
					)}
				</Pressable>
				<Pressable
					disabled={
						audioContext?.globalQueue?.queue === undefined ||
						audioContext.globalQueue.currentIndex === 0
					}
					onPress={() => {
						setBackClickCount((prev) => {
							if (prev === null) return 0;
							else return (prev + 1) % 2;
						});
					}}
				>
					<Ionicons
						name="play-skip-back-outline"
						size={24}
						color={
							colorScheme === "light"
								? "black"
								: COLORS.whiteSecondary
						}
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
						<Ionicons
							name="play-outline"
							size={24}
							color={
								colorScheme === "light"
									? "black"
									: COLORS.whiteSecondary
							}
						/>
					) : (
						<Ionicons
							name="pause-outline"
							size={24}
							color={
								colorScheme === "light"
									? "black"
									: COLORS.whiteSecondary
							}
						/>
					)}
				</Pressable>
				<Pressable
					onPress={handleForward}
					disabled={
						audioContext?.globalQueue?.queue === undefined ||
						audioContext.globalQueue.queue.length - 1 ===
							audioContext.globalQueue.currentIndex
					}
				>
					<Ionicons
						name="play-skip-forward-outline"
						size={24}
						color={
							colorScheme === "light"
								? "black"
								: COLORS.whiteSecondary
						}
					/>
				</Pressable>
			</View>
		</View>
	);
};

export default AudioPlayer;

const styles = StyleSheet.create({
	container: {
		// backgroundColor: COLORS.whiteSecondary,
		position: "absolute",
		bottom: 0,
		flexDirection: "row",
		paddingVertical: SIZES.small,
		paddingHorizontal: SIZES.small,
		alignItems: "center",
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
