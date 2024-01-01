import { ActivityIndicator, StyleSheet, useColorScheme } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { COLORS, SIZES } from "../../constants/theme";
import { videoItemType } from "../../utils/TypeDeclarations";
import { View } from "../Common/Themed";
import VideoItem from "./VideoItem";

const VideoList = ({
	videoData,
	isLoading,
}: {
	videoData: videoItemType[];
	isLoading: boolean;
}) => {
	const colorScheme = useColorScheme();

	return (
		<View style={styles.container}>
			{isLoading ? (
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<ActivityIndicator
						size={32}
						color={
							colorScheme === "light"
								? COLORS.darkSecondary
								: COLORS.whiteSecondary
						}
					/>
				</View>
			) : (
				<FlatList
					showsVerticalScrollIndicator={false}
					data={videoData}
					renderItem={({ item }) => <VideoItem video={item} />}
					contentContainerStyle={{ rowGap: SIZES.small }}
					keyExtractor={(item) => item.id.videoId}
				/>
			)}
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
