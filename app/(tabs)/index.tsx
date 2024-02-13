import { StatusBar } from "expo-status-bar";
import { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AudioPlayer from "../../components/Common/AudioPlayer";
import FloatingDialogBox from "../../components/Common/FloatingDialogBox";
// import { View } from "../../components/Common/Themed";
import PrimaryScreen from "../../components/Primary";
import { COLORS, SIZES } from "../../constants/theme";
import { AudioContext } from "../../utils/Contexts/AudioContext";
import { FloatingContext } from "../../utils/Contexts/FloatingContext";
import { SwitchPageContext } from "../../utils/Contexts/SwitchPageContext";

const index = () => {
	const [selectedHeaderButton, setSelectedHeaderButton] =
		useState<string>("0");
	const switchContext = useContext(SwitchPageContext);
	const floatingContext = useContext(FloatingContext);
	const audioContext = useContext(AudioContext);

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
						paddingBottom:
							audioContext?.songInfo["sname"] !== undefined &&
							audioContext.songInfo["sname"] !== ""
								? SIZES.small + 96
								: SIZES.small + 32, // TODO: change this dynamically
					},
				]}
			>
				<StatusBar backgroundColor={COLORS.darkPrimary} />
				<PrimaryScreen
					selectedHeaderButton={selectedHeaderButton}
					setSelectedHeaderButton={setSelectedHeaderButton}
				/>
			</View>
			<AudioPlayer />
		</SafeAreaView>
	);
};

export default index;

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		backgroundColor: COLORS.darkPrimary,
	},
	mainContainer: {
		flex: 1,
		padding: SIZES.medium,
	},
});
