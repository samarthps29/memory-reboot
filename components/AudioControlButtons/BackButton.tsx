import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Pressable, useColorScheme } from "react-native";
import { COLORS } from "../../constants/theme";
import { AudioContext } from "../../utils/AudioContext";

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
				audioContext?.globalQueue?.queue === undefined ||
				audioContext.globalQueue.currentIndex === 0
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
