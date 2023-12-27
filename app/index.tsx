import { StatusBar } from "expo-status-bar";
import { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryHeader from "../components/PrimaryHeader";
import SecondaryHeader from "../components/SecondaryHeader";
import SongList from "../components/SongList";
import VideoList from "../components/VideoList";
import { defaultVideoData } from "../constants/VideoData";
import { SIZES } from "../constants/theme";
import { SwitchPageContext } from "../utils/SwitchPageContext";
import { videoItemType } from "../utils/types";
import AudioPlayer from "../components/AudioPlayer";

const index = () => {
	const [videoData, setVideoData] =
		useState<videoItemType[]>(defaultVideoData);
	const switchContext = useContext(SwitchPageContext);
	return (
		<SafeAreaView style={styles.screenContainer}>
			<SafeAreaView style={styles.mainContainer}>
				<StatusBar hidden />
				{!switchContext?.switchPage ? (
					<>
						<PrimaryHeader />
						<SongList />
					</>
				) : (
					<>
						<SecondaryHeader setVideoData={setVideoData} />
						<VideoList videoData={videoData} />
					</>
				)}
			</SafeAreaView>
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
	},
});
