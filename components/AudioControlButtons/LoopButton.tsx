import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Pressable, useColorScheme } from "react-native";
import { COLORS } from "../../constants/theme";
import { AudioContext } from "../../utils/AudioContext";
import { View } from "../Themed";

const LoopButton = () => {
	const audioContext = useContext(AudioContext);
	const colorScheme = useColorScheme();

	return (
		<Pressable
			style={{ alignItems: "center", justifyContent: "center" }}
			onPress={() => {
				// console.log("Loop pressed");
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
					colorScheme === "light" ? "black" : COLORS.whiteSecondary
				}
			/>
			{audioContext?.songInfo["loop"] === "yes" && (
				<View
					style={{
						height: 3,
						width: 3,
						backgroundColor:
							colorScheme === "light"
								? "black"
								: COLORS.whiteSecondary,
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
