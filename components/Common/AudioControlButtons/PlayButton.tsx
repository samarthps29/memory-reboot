import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Pressable, useColorScheme } from "react-native";
import { COLORS } from "../../../constants/theme";
import { AudioContext } from "../../../utils/Contexts/AudioContext";

const PlayButton = ({
	size = 24,
	fill = false,
}: {
	size?: number;
	fill?: boolean;
}) => {
	const audioContext = useContext(AudioContext);
	const colorScheme = useColorScheme();

	return (
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
