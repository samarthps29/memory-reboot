import { Pressable, StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { View, Text } from "./Themed";
import { TextInput } from "react-native-gesture-handler";
import { FloatingContext } from "../utils/FloatingContext";
import { useContext, useState } from "react";

const FloatingDialogBox = () => {
	const floatingContext = useContext(FloatingContext);
	const { title, placeholder, btnText, handleButtonClick } =
		floatingContext?.floatInfo || {};
	const [inputVal, setInputVal] = useState("");
	return (
		<View style={styles.container}>
			<View style={styles.floatContainer}>
				<View style={styles.titleContainer}>
					<Text
						style={{
							fontFamily: FONT.bold,
							textAlign: "left",
							fontSize: 20,
						}}
					>
						{title}
					</Text>
				</View>
				<TextInput
					value={inputVal}
					onChangeText={(text) => {
						setInputVal!(text);
					}}
					style={styles.inputContainer}
					placeholder={placeholder}
				/>
				<View style={styles.buttonContainer}>
					<Pressable
						style={styles.button}
						onPress={() => {
							if (handleButtonClick) {
								handleButtonClick(inputVal);
							}
						}}
					>
						<Text style={styles.buttonText}>{btnText}</Text>
					</Pressable>
					<Pressable
						style={styles.button}
						onPress={() => floatingContext?.setFloatToggle(false)}
					>
						<Text style={styles.buttonText}>Close</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
};

export default FloatingDialogBox;

const styles = StyleSheet.create({
	container: {
		zIndex: 10,
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#00000080",
		position: "absolute",
	},
	floatContainer: {
		width: "80%",
		// height: "40%",
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: SIZES.medium,
		paddingVertical: 40,
	},
	titleContainer: {
		width: "80%",
		marginBottom: SIZES.medium,
	},
	inputContainer: {
		width: "80%",
		padding: SIZES.small,
		borderRadius: SIZES.medium,
		backgroundColor: COLORS.white,
		marginBottom: SIZES.xSmall,
	},
	buttonContainer: {
		width: "80%",
		borderRadius: SIZES.large,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: SIZES.gap,
		flexDirection: "row",
		gap: 6,
		overflow: "hidden",
	},
	button: {
		width: "50%",
		backgroundColor: COLORS.secondary,
		padding: SIZES.small,
		borderRadius: SIZES.large,
		alignItems: "center",
	},
	buttonText: {
		fontFamily: FONT.medium,
		fontSize: 16,
		// margin: SIZES.large,
	},
});
