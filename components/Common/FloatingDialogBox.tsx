import { useContext, useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import { FloatingContext } from "../../utils/Contexts/FloatingContext";
// import { Text, View } from "./Themed";

const FloatingDialogBox = () => {
	const floatingContext = useContext(FloatingContext);
	const {
		title,
		placeholder,
		btnText,
		handleButtonClick,
		btnSecondaryText,
		handleSecondaryButtonClick,
	} = floatingContext?.floatInfo || {};
	const [inputVal, setInputVal] = useState<string>(() => {
		if (btnText && btnText.toLowerCase() === "rename")
			return placeholder || "";
		else return "";
	});
	return (
		<View style={styles.container}>
			<View style={styles.floatContainer}>
				<View style={styles.titleContainer}>
					<Text
						style={{
							fontFamily: FONT.bold,
							textAlign: "left",
							fontSize: 20,
							color: COLORS.whitePrimary,
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
					placeholderTextColor={COLORS.whiteSecondary}
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
					{btnSecondaryText && (
						<Pressable
							style={styles.button}
							onPress={() => {
								if (handleSecondaryButtonClick) {
									handleSecondaryButtonClick();
								}
							}}
						>
							<Text style={styles.buttonText}>
								{btnSecondaryText}
							</Text>
						</Pressable>
					)}
					<Pressable
						style={styles.button}
						onPress={() =>
							floatingContext?.setFloatDialogToggle(false)
						}
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
		marginTop: StatusBar.currentHeight,
		zIndex: 10,
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		backgroundColor: "#00000099",
	},
	floatContainer: {
		width: "80%",
		// height: "40%",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: SIZES.medium,
		paddingVertical: 40,
		backgroundColor: COLORS.darkSecondary,
	},
	titleContainer: {
		width: "80%",
		marginBottom: SIZES.xxSmall,
		backgroundColor: "transparent",
		paddingLeft: 2,
	},
	inputContainer: {
		width: "80%",
		padding: SIZES.small,
		borderRadius: SIZES.medium,
		marginBottom: SIZES.small,
		fontFamily: FONT.regular,
		backgroundColor: COLORS.darkTertiary,
		color: COLORS.whitePrimary,
	},
	buttonContainer: {
		width: "80%",
		borderRadius: SIZES.medium,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: SIZES.gap,
		flexDirection: "row",
		gap: 6,
		backgroundColor: "transparent",
		overflow: "hidden",
	},
	button: {
		flexGrow: 1,
		backgroundColor: COLORS.secondary,
		padding: SIZES.small,
		borderRadius: SIZES.medium,
		alignItems: "center",
	},
	buttonText: {
		fontFamily: FONT.medium,
		fontSize: 16,
		// margin: SIZES.large,
	},
});
