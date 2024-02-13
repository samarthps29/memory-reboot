import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Pressable } from "react-native";
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

	return (
		<Pressable
			disabled={audioContext?.sound === null}
			onPress={handlePress}
		>
			{audioContext?.status === "paused" ? (
				<Ionicons
					name={fill ? "play" : "play-outline"}
					size={size}
					color={COLORS.whiteSecondary}
				/>
			) : (
				<Ionicons
					name={fill ? "pause" : "pause-outline"}
					size={size}
					color={COLORS.whiteSecondary}
				/>
			)}
		</Pressable>
	);
};

export default PlayButton;
