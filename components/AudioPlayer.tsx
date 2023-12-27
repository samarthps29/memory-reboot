import { COLORS } from "../constants/theme";
import { View } from "./Themed";
import { StyleSheet } from "react-native";

const AudioPlayer = () => {
	return <View style={styles.container}></View>;
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
