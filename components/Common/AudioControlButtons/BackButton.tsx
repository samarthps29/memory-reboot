import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Pressable, useColorScheme } from "react-native";
import { COLORS } from "../../../constants/theme";
import { AudioContext } from "../../../utils/Contexts/AudioContext";

const BackButton = ({
	handlePress,
	size = 24,
}: {
	handlePress: () => void;
	size?: number;
}) => {
	const audioContext = useContext(AudioContext);
	const colorScheme = useColorScheme();

	return (
		<Pressable
			disabled={
				audioContext?.queueRN === ""
					? audioContext.sound === null ||
					  audioContext.songInfo["loop"] !== "yes"
					: audioContext?.queueRN === "globalqueue"
					? audioContext.globalQueue?.currentIndex === 0
					: audioContext?.userQueue?.currentIndex === 0
			}
			onPress={handlePress}
		>
			<Ionicons
				name="play-skip-back-outline"
				size={size}
				color={
					colorScheme === "light" ? "black" : COLORS.whiteSecondary
				}
			/>
		</Pressable>
	);
};

export default BackButton;
