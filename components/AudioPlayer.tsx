import { useContext } from "react";
import { COLORS } from "../constants/theme";
import { View, Text } from "./Themed";
import { Pressable, StyleSheet } from "react-native";
import { AudioContext } from "../utils/AudioContext";

const AudioPlayer = () => {
	const audioContext = useContext(AudioContext);
	return (
		<View style={styles.container}>
			<Pressable
				onPress={() => {
					audioContext?.setStatus((prev) => {
						if (prev === "paused") return "playing";
						else return "paused";
					});
				}}
			>
				<Text>
					{audioContext?.status === "paused" ? "Play" : "Pause"}
				</Text>
			</Pressable>
		</View>
	);
};

export default AudioPlayer;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: 60,
		backgroundColor: COLORS.white,
		position: "absolute",
		bottom: 0,
	},
});
