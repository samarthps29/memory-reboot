import { useContext, useEffect, useState } from "react";
import {
	Image,
	Pressable,
	StyleSheet,
	useColorScheme,
	StatusBar,
} from "react-native";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { AudioContext } from "../utils/AudioContext";
import {
	BackButton,
	ForwardButton,
	LoopButton,
	PlayButton,
	RefreshButton,
} from "./AudioControlButtons";
import { reducedTitle } from "./SongItem";
import { Text, View } from "./Themed";
import Slider from "@react-native-community/slider";
import { convertToTime } from "../utils/global";

const AudioPlayer = () => {
	// TODO: KeyboardAvoidingView from react-native
	const audioContext = useContext(AudioContext);
	const [backClickCount, setBackClickCount] = useState<number | null>(null);
	const colorScheme = useColorScheme();
	const [fullScreen, setFullScreen] = useState(false);

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
					width: "100%",
					backgroundColor:
						colorScheme === "light"
							? COLORS.lightWhite
							: COLORS.darkSecondary,
					flexDirection: fullScreen ? "column" : "row",
					paddingVertical: fullScreen ? SIZES.medium : SIZES.small,
					borderTopRightRadius: fullScreen ? SIZES.medium : 0,
					borderTopLeftRadius: fullScreen ? SIZES.medium : 0,
					// backgroundImage: fullScreen
					// 	? audioContext?.songInfo["thumbnail"]
					// 	: undefined,
				},
			]}
		>
			<View
				style={[
					styles.songTitleContainer,
					{
						alignItems: fullScreen ? "center" : "flex-start",
						width: fullScreen ? "95%" : "60%",
						marginBottom: fullScreen ? SIZES.small : 0,
					},
				]}
			>
				<Pressable
					disabled={
						audioContext?.songInfo["sname"] === undefined ||
						audioContext.songInfo["sname"] === ""
					}
					onPress={() => {
						setFullScreen((prev) => !prev);
					}}
				>
					<Text
						style={[
							styles.songText,
							{
								color:
									colorScheme === "light"
										? "black"
										: COLORS.whitePrimary,
								textAlign: fullScreen ? "center" : "left",
								fontSize: fullScreen ? 18 : 16,
							},
						]}
						numberOfLines={fullScreen ? 2 : 1}
					>
						{audioContext?.songInfo["sname"] === undefined ||
						audioContext.songInfo["sname"] === ""
							? "Play Something"
							: fullScreen
							? reducedTitle(
									audioContext?.songInfo["sname"] || "",
									60
							  )
							: reducedTitle(
									audioContext?.songInfo["sname"] || "",
									25
							  )}
					</Text>
				</Pressable>
			</View>
			<View
				style={[
					styles.buttonContainer,
					{
						width: fullScreen ? "95%" : "40%",
						justifyContent: fullScreen ? "center" : "flex-end",
						marginBottom: fullScreen ? SIZES.large : 0,
					},
				]}
			>
				{!fullScreen && <RefreshButton />}
				{!fullScreen && <LoopButton />}
				<BackButton
					handlePress={() => {
						setBackClickCount((prev) => {
							if (prev === null) return 0;
							else return (prev + 1) % 2;
						});
					}}
					size={fullScreen ? 28 : 24}
				/>
				<PlayButton size={fullScreen ? 28 : 24} />
				<ForwardButton
					handlePress={handleForward}
					size={fullScreen ? 28 : 24}
				/>
			</View>
			{fullScreen && (
				<View
					style={{
						width: "100%",
						backgroundColor: "transparent",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Slider
						style={{
							width: "98%",
							height: 8,
							marginBottom: SIZES.small,
						}}
						minimumValue={0}
						maximumValue={audioContext?.songDuration}
						value={audioContext?.songPosition}
						onSlidingComplete={(value: number) => {
							audioContext?.sound?.setPositionAsync(value);
						}}
						minimumTrackTintColor={COLORS.whiteSecondary}
						maximumTrackTintColor={COLORS.whitePrimary}
						thumbTintColor="white"
					/>
					<View
						style={{
							justifyContent: "space-between",
							alignItems: "center",
							width: "95%",
							backgroundColor: "transparent",
							flexDirection: "row",
							paddingHorizontal: 8,
						}}
					>
						<Text
							style={{
								fontFamily: FONT.regular,
								color:
									colorScheme === "light"
										? "black"
										: COLORS.whitePrimary,
							}}
						>
							{convertToTime(audioContext?.songPosition || 0)}
						</Text>
						<Text
							style={{
								fontFamily: FONT.regular,
								color:
									colorScheme === "light"
										? "black"
										: COLORS.whitePrimary,
							}}
						>
							{convertToTime(audioContext?.songDuration || 0)}
						</Text>
					</View>
				</View>
			)}
		</View>
	);
};

export default AudioPlayer;

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		paddingHorizontal: SIZES.small,
		alignItems: "center",
		bottom: 0,
	},
	songTitleContainer: {
		backgroundColor: "transparent",
		overflow: "hidden",
	},
	songText: {
		fontFamily: FONT.medium,
		// fontSize: 16,
	},
	buttonContainer: {
		backgroundColor: "transparent",
		alignItems: "center",
		flexDirection: "row",
		gap: SIZES.gap,
	},
	buttonText: {
		fontFamily: FONT.regular,
		fontSize: 16,
	},
});
