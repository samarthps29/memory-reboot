import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SIZES } from "../constants/theme";
import { View } from "./Themed";
import VideoItem from "./VideoItem";
import { videoItemType } from "../utils/types";

const VideoList = ({ videoData }: { videoData: videoItemType[] }) => {
	return (
		<View style={styles.container}>
			<FlatList
				showsVerticalScrollIndicator={false}
				data={videoData}
				renderItem={({ item }) => <VideoItem video={item} />}
				contentContainerStyle={{ rowGap: SIZES.small }}
				keyExtractor={(item) => item.id.videoId}
			/>
		</View>
	);
};

export default VideoList;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		backgroundColor: "transparent",
		marginTop: SIZES.medium,
	},
});
