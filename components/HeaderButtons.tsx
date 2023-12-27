import { useContext, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { Text, View } from "./Themed";
import { SwitchPageContext } from "../utils/SwitchPageContext";

const HeaderButtons = ({ optionsArr }: { optionsArr: string[] }) => {
	const [selectedOption, setSelectedOption] = useState(0);
	const switchContext = useContext(SwitchPageContext);
	return (
		<View
			style={{
				flexDirection: "row",
				backgroundColor: "transparent",
				alignItems: "center",
				marginTop: SIZES.gap,
				gap: 6,
			}}
		>
			<View
				style={[styles.buttonContainer, { backgroundColor: "#e6c8ff" }]}
			>
				<Pressable
					onPress={() => {
						switchContext?.setSwitchPage((prev) => !prev);
					}}
				>
					<Text style={styles.userText}>cdz</Text>
				</Pressable>
			</View>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					columnGap: 6,
					alignItems: "center",
					justifyContent: "center",
				}}
				style={{ flexGrow: 1 }}
			>
				{optionsArr.map((item, index) => {
					return (
						<View
							style={[
								styles.buttonContainer,
								{
									backgroundColor:
										index === selectedOption
											? COLORS.secondary
											: COLORS.white,
								},
							]}
							key={index}
						>
							<Pressable onPress={() => setSelectedOption(index)}>
								<Text style={styles.buttonText}>{item}</Text>
							</Pressable>
						</View>
					);
				})}
			</ScrollView>
		</View>
	);
};

export default HeaderButtons;

const styles = StyleSheet.create({
	buttonContainer: {
		borderRadius: SIZES.xLarge,
		// backgroundColor: COLORS.white,
		alignItems: "center",
		justifyContent: "center",
		padding: SIZES.xSmall,
	},
	buttonText: {
		fontFamily: FONT.medium,
		fontSize: 14,
	},
	userText: {
		fontFamily: FONT.bold,
		fontSize: 14,
		color: "#030004",
	},
});
