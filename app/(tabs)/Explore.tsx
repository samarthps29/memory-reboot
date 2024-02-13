import { StatusBar } from "expo-status-bar";
import { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AudioPlayer from "../../components/Common/AudioPlayer";
import FloatingDialogBox from "../../components/Common/FloatingDialogBox";
import SecondaryScreen from "../../components/Secondary";
import { COLORS, SIZES } from "../../constants/theme";
import { FloatingContext } from "../../utils/Contexts/FloatingContext";
import { SwitchPageContext } from "../../utils/Contexts/SwitchPageContext";

const Explore = () => {
	const [selectedHeaderButton, setSelectedHeaderButton] =
		useState<string>("0");
	const switchContext = useContext(SwitchPageContext);
	const floatingContext = useContext(FloatingContext);

	return (
		<SafeAreaView style={styles.screenContainer}>
			{floatingContext?.floatDialogToggle && <FloatingDialogBox />}
			<View
				style={[
					styles.mainContainer,
					{
						paddingTop: switchContext?.showHeader
							? SIZES.medium
							: 0,
					},
				]}
			>
				<StatusBar backgroundColor={COLORS.darkPrimary} />
				<SecondaryScreen
					selectedHeaderButton={selectedHeaderButton}
					setSelectedHeaderButton={setSelectedHeaderButton}
				/>
			</View>
			<AudioPlayer />
		</SafeAreaView>
	);
};

export default Explore;

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		backgroundColor: COLORS.darkPrimary,
	},
	mainContainer: {
		flex: 1,
		padding: SIZES.medium,
		paddingBottom: SIZES.small + 50,
	},
});
