import { StyleSheet, Image, useColorScheme } from "react-native";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { View, Text } from "./Themed";
import { songItemType, videoItemType } from "../utils/types";
import { filter } from "../utils/global";

const VideoItem = ({ video }: { video: videoItemType }) => {
	const colorScheme = useColorScheme();
	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor:
						colorScheme === "light" ? COLORS.white : COLORS.black,
				},
			]}
		>
			<View style={styles.imageContainer}>
				<Image
					source={{ uri: video.snippet.thumbnails.high.url }}
					style={{
						flex: 1,
						height: undefined,
						width: undefined,
						alignSelf: "stretch",
					}}
				/>
			</View>
			<View
				style={{
					flexGrow: 1,
					backgroundColor: "transparent",
					justifyContent: "center",
					padding: SIZES.small,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						backgroundColor: "transparent",
						marginTop: 2,
					}}
				>
					<Text>
						38
						<Text style={{ fontFamily: FONT.medium }}>M Views</Text>
					</Text>
					<Text>
						2{" "}
						<Text style={{ fontFamily: FONT.medium }}>
							years ago
						</Text>
					</Text>
				</View>

				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						backgroundColor: "transparent",
						marginTop: 4,
					}}
				>
					<Text style={styles.videoTitle}>
						{filter(video.snippet.title)}
					</Text>
					<Text>3:56</Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						backgroundColor: "transparent",
						marginTop: 2,
					}}
				>
					<Text style={styles.artistTitle}>
						{filter(video.snippet.channelTitle)}
					</Text>
				</View>
			</View>
		</View>
	);
};

export default VideoItem;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		// padding: SIZES.xSmall,
		borderRadius: SIZES.medium,
		// flexDirection: "row",
	},
	imageContainer: {
		height: 180,
		width: "100%",
		borderTopLeftRadius: SIZES.small,
		borderTopRightRadius: SIZES.small,
		overflow: "hidden",
		marginRight: SIZES.xSmall,
	},
	videoTitle: {
		width: "90%",
		fontFamily: FONT.medium,
		fontSize: 18,
	},
	artistTitle: {
		fontFamily: FONT.regular,
		fontSize: 15,
	},
	durationTitle: {
		fontFamily: FONT.regular,
		fontSize: 14,
	},
});
