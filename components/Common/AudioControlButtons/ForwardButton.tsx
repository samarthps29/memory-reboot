import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Pressable, useColorScheme } from "react-native";
import { COLORS } from "../../../constants/theme";
import { AudioContext } from "../../../utils/Contexts/AudioContext";

const ForwardButton = ({
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
			onPress={handlePress}
			disabled={
				audioContext?.decideQueue() === "" &&
				(audioContext.songInfo["loop"] !== "yes" ||
					audioContext.sound === null)
			}
		>
			<Ionicons
				name={fill ? "play-skip-forward" : "play-skip-forward-outline"}
				size={size}
				color={
					colorScheme === "light" ? "black" : COLORS.whiteSecondary
				}
			/>
		</Pressable>
	);
};

export default ForwardButton;
