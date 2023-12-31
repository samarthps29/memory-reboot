import { StatusBar } from "expo-status-bar";
import { useContext, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AudioPlayer from "../components/AudioPlayer";
import PrimaryHeader from "../components/PrimaryHeader";
import SecondaryHeader from "../components/SecondaryHeader";
import SongList from "../components/SongList";
import { View } from "../components/Themed";
import VideoList from "../components/VideoList";
import { defaultVideoData } from "../constants/VideoData";
import { COLORS, SIZES } from "../constants/theme";
import { SwitchPageContext } from "../utils/SwitchPageContext";
import { videoItemType } from "../utils/types";
import FloatingDialogBox from "../components/FloatingDialogBox";
import { FloatingContext } from "../utils/FloatingContext";

const index = () => {
	const [videoData, setVideoData] =
		useState<videoItemType[]>(defaultVideoData);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedHeaderButton, setSelectedHeaderButton] =
		useState<string>("0");
	const switchContext = useContext(SwitchPageContext);
	const floatingContext = useContext(FloatingContext);
	const [isLoading, setIsLoading] = useState(false);
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
					<>
						<PrimaryHeader
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
							selectedHeaderButton={selectedHeaderButton}
							setSelectedHeaderButton={setSelectedHeaderButton}
						/>
						<SongList
							searchTerm={searchTerm}
							selectedHeaderButton={selectedHeaderButton}
						/>
					</>
				) : (
					<>
						<SecondaryHeader
							setVideoData={setVideoData}
							selectedHeaderButton={selectedHeaderButton}
							setSelectedHeaderButton={setSelectedHeaderButton}
							setIsLoading={setIsLoading}
						/>
						<VideoList
							videoData={videoData}
							isLoading={isLoading}
						/>
					</>
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
