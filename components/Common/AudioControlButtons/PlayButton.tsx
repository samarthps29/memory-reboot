import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Pressable, useColorScheme } from "react-native";
import { COLORS } from "../../../constants/theme";
import { AudioContext } from "../../../utils/Contexts/AudioContext";

const PlayButton = ({
	size = 24,
	fill = false,
	handlePress,
}: {
	size?: number;
	fill?: boolean;
	handlePress: () => void;
}) => {
	const audioContext = useContext(AudioContext);
	const colorScheme = useColorScheme();

	return (
		<Pressable
			disabled={audioContext?.sound === null}
			onPress={handlePress}
		>
			{audioContext?.status === "paused" ? (
				<Ionicons
					name={fill ? "play" : "play-outline"}
					size={size}
					color={
						colorScheme === "light"
							? "black"
							: COLORS.whiteSecondary
					}
				/>
			) : (
				<Ionicons
					style={{ left: 1 }}
					name={fill ? "pause" : "pause-outline"}
					size={size}
					color={
						colorScheme === "light"
							? "black"
							: COLORS.whiteSecondary
					}
				/>
			)}
		</Pressable>
	);
};

export default PlayButton;
