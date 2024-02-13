import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Pressable, View } from "react-native";
import { COLORS } from "../../../constants/theme";
import { AudioContext } from "../../../utils/Contexts/AudioContext";

const LoopButton = () => {
	const audioContext = useContext(AudioContext);

	return (
		<Pressable
			style={{ alignItems: "center", justifyContent: "center" }}
			onPress={() => {
				audioContext?.setSongInfo((prev) => {
					const newLoopValue =
						prev["loop"] === "no" || prev["loop"] === undefined
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
					audioContext?.songInfo["loop"] === "yes"
						? COLORS.primary
						: COLORS.whiteSecondary
				}
			/>
			{audioContext?.songInfo["loop"] === "yes" && (
				<View
					style={{
						height: 3,
						width: 3,
						backgroundColor: COLORS.primary,
						borderRadius: 100,
						position: "absolute",
						bottom: -3,
					}}
				/>
			)}
		</Pressable>
	);
};

export default LoopButton;
