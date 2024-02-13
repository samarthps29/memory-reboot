import Slider from "@react-native-community/slider";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import { AudioContext } from "../../utils/Contexts/AudioContext";
import { NotificationContext } from "../../utils/Contexts/NotificationContext";
import { SwitchPageContext } from "../../utils/Contexts/SwitchPageContext";
import { queueType } from "../../utils/TypeDeclarations";
import { convertToTime, reducedTitle } from "../../utils/global";
import {
	BackButton,
	ForwardButton,
	LoopButton,
	PlayButton,
	RefreshButton,
} from "./AudioControlButtons";
// import { Text, View } from "./Themed";

const AudioPlayer = () => {
	// TODO: KeyboardAvoidingView from react-native
	const audioContext = useContext(AudioContext);
	const [backClickCount, setBackClickCount] = useState<number | null>(null);
	const [expanded, setExpanded] = useState(false);
	const switchContext = useContext(SwitchPageContext);
	const notificationContext = useContext(NotificationContext);

	const updateIndexBack = (queue: queueType) => {
		if (queue.currentIndex === -1) return queue.queue.length - 1;
		else if (queue.currentIndex === 0) return 0;
		else return queue.currentIndex - 1;
	};

	// if it does not work try converting it to a usecallback function
	const handleForward = async () => {
		await audioContext?.sound?.setPositionAsync(audioContext.songDuration);
	};

	const handlePlayPause = () => {
		audioContext?.setStatus((prev) => {
			if (prev === "paused") return "playing";
			else return "paused";
		});
	};

	const handleBackOnce = async () => {
		await audioContext?.sound?.playFromPositionAsync(0);
	};

	const handleBackTwice = () => {
		// check which queue is currently is use then appropriately go back a track
		if (audioContext?.queueRN === "") return;
		audioContext?.queueRN === "globalqueue"
			? audioContext?.setGlobalQueue((prev) => {
					if (prev === null) return null;
					const updatedIndex = updateIndexBack(prev);
					return {
						...prev,
						currentIndex: updatedIndex,
					};
			  })
			: audioContext?.setUserQueue((prev) => {
					if (prev === null) return null;
					return {
						...prev,
						currentIndex: updateIndexBack(prev),
					};
			  });
		audioContext?.setSkip(true);
	};

	const handleBack = () => {
		setBackClickCount((prev) => {
			if (prev === null) return 0;
			else return (prev + 1) % 2;
		});
	};

	useEffect(() => {
		if (backClickCount === 0) {
			handleBackOnce();
		} else if (backClickCount === 1) handleBackTwice();
	}, [backClickCount]);

	useEffect(() => {
		const action = notificationContext?.remoteAction?.action;
		if (action === undefined || action === null || action === "") return;
		if (action === "playButton") {
			handlePlayPause();
		} else if (action === "prevButton") {
			handleBack();
		} else if (action === "nextButton") {
			handleForward();
		}
	}, [notificationContext?.remoteAction]);

	return (
		audioContext?.songInfo["sname"] !== undefined &&
		audioContext.songInfo["sname"] !== "" && (
			<View
				style={[
					styles.container,
					{
						flexDirection: expanded ? "column" : "row",
						paddingVertical: expanded ? SIZES.medium : SIZES.small,
						// borderTopRightRadius: expanded ? SIZES.medium : 0,
						// borderTopLeftRadius: expanded ? SIZES.medium : 0,
					},
				]}
			>
				<View
					style={[
						styles.songTitleContainer,
						{
							alignItems: expanded ? "center" : "flex-start",
							width: expanded ? "95%" : "60%",
							marginBottom: expanded ? 14 : 0,
						},
					]}
				>
					<Pressable
						onPress={() => {
							setExpanded((prev) => !prev);
						}}
					>
						<Text
							style={[
								styles.songText,
								{
									textAlign: expanded ? "center" : "left",
									fontSize: expanded ? 18 : 16,
								},
							]}
							numberOfLines={expanded ? 2 : 1}
						>
							{expanded
								? reducedTitle(
										audioContext?.songInfo["sname"] || "",
										120
								  )
								: reducedTitle(
										audioContext?.songInfo["sname"] || "",
										120
								  )}
						</Text>
					</Pressable>
				</View>
				<View
					style={[
						styles.buttonContainer,
						{
							width: expanded ? "95%" : "40%",
							alignItems: "center",
							justifyContent: expanded ? "center" : "flex-end",
							marginBottom: expanded ? SIZES.large : 0,
						},
					]}
				>
					{!expanded && <RefreshButton />}
					{!expanded && <LoopButton />}
					<BackButton
						handlePress={handleBack}
						size={expanded ? 28 : 24}
						fill={expanded ? true : false}
					/>
					<PlayButton
						size={expanded ? 28 : 24}
						fill={expanded ? true : false}
						handlePress={handlePlayPause}
					/>
					<ForwardButton
						handlePress={handleForward}
						size={expanded ? 28 : 24}
						fill={expanded ? true : false}
					/>
				</View>
				{expanded && (
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
								height: 4,
								marginBottom: SIZES.xxSmall,
							}}
							minimumValue={0}
							maximumValue={audioContext?.songDuration}
							value={audioContext?.songPosition}
							onSlidingComplete={(value: number) => {
								audioContext?.sound?.setPositionAsync(value);
							}}
							minimumTrackTintColor={COLORS.whitePrimary}
							maximumTrackTintColor={COLORS.whiteSecondary}
							thumbTintColor={"white"}
							step={1000}
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
									color: COLORS.whitePrimary,
								}}
							>
								{convertToTime(audioContext?.songPosition || 0)}
							</Text>
							<Text
								style={{
									fontFamily: FONT.regular,
									color: COLORS.whiteSecondary,
								}}
							>
								{convertToTime(audioContext?.songDuration || 0)}
							</Text>
						</View>
					</View>
				)}
			</View>
		)
	);
};

export default AudioPlayer;

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		paddingHorizontal: 14,
		alignItems: "center",
		bottom: 56,
		left: 6,
		right: 6,
		backgroundColor: "#262626",
		borderRadius: SIZES.xxSmall,
	},
	songTitleContainer: {
		backgroundColor: "transparent",
		overflow: "hidden",
	},
	songText: {
		fontFamily: FONT.medium,
		color: COLORS.whitePrimary,
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
