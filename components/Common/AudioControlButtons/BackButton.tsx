import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Pressable, useColorScheme } from "react-native";
import { COLORS } from "../../../constants/theme";
import { AudioContext } from "../../../utils/Contexts/AudioContext";

const BackButton = ({
	handlePress,
	size = 24,
	fill = false,
}: {
	handlePress: () => void;
	size?: number;
	fill?: boolean;
}) => {
	const audioContext = useContext(AudioContext);
	const colorScheme = useColorScheme();

	return (
		<Pressable
			disabled={
				(audioContext?.sound === null ||
					audioContext?.songInfo["loop"] !== "yes") &&
				(audioContext?.queueRN === ""
					? true
					: audioContext?.queueRN === "globalqueue"
					? audioContext.globalQueue?.currentIndex === 0
					: audioContext?.userQueue?.currentIndex === 0)
			}
			onPress={handlePress}
		>
			<Ionicons
				name={fill ? "play-skip-back" : "play-skip-back-outline"}
				size={size}
				color={
					colorScheme === "light" ? "black" : COLORS.whiteSecondary
				}
			/>
		</Pressable>
	);
};

export default BackButton;
