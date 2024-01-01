import { StatusBar } from "expo-status-bar";
import { useContext, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AudioPlayer from "../components/Common/AudioPlayer";
import FloatingDialogBox from "../components/Common/FloatingDialogBox";
import { View } from "../components/Common/Themed";
import PrimaryScreen from "../components/Primary";
import SecondaryScreen from "../components/Secondary";
import { COLORS, SIZES } from "../constants/theme";
import { FloatingContext } from "../utils/Contexts/FloatingContext";
import { SwitchPageContext } from "../utils/Contexts/SwitchPageContext";

const index = () => {
	const [selectedHeaderButton, setSelectedHeaderButton] =
		useState<string>("0");
	const switchContext = useContext(SwitchPageContext);
	const floatingContext = useContext(FloatingContext);
	const colorScheme = useColorScheme();

	return (
		<SafeAreaView style={styles.screenContainer}>
			{floatingContext?.floatDialogToggle && <FloatingDialogBox />}
			<View style={styles.mainContainer}>
				<StatusBar
					backgroundColor={
						colorScheme === "light"
							? COLORS.whitePrimary
							: COLORS.darkPrimary
					}
				/>
				{!switchContext?.switchPage ? (
					<PrimaryScreen
						selectedHeaderButton={selectedHeaderButton}
						setSelectedHeaderButton={setSelectedHeaderButton}
					/>
				) : (
					<SecondaryScreen
						selectedHeaderButton={selectedHeaderButton}
						setSelectedHeaderButton={setSelectedHeaderButton}
					/>
				)}
			</View>
			<AudioPlayer />
		</SafeAreaView>
	);
};

export default index;

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
	},
	mainContainer: {
		flex: 1,
		padding: SIZES.medium,
		paddingBottom: SIZES.small + 50,
	},
});
