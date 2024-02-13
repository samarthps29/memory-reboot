import dayjs from "dayjs";
import { useContext } from "react";
import {
	Image,
	Linking,
	Pressable,
	StyleSheet,
	View,
	Text,
} from "react-native";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import { StorageContext } from "../../utils/Contexts/StorageContext";
import { songItemType, videoItemType } from "../../utils/TypeDeclarations";
import { filter, ytTemplate } from "../../utils/global";
// import { Text, View } from "../Common/Themed";

const VideoItem = ({ video }: { video: videoItemType }) => {
	const storageContext = useContext(StorageContext);
	const handleDownload = async () => {
		if (
			storageContext?.directoryUri &&
			storageContext.directoryUri.trim() !== ""
		) {
			// this song object goes into async storage
			const songObj: songItemType = {
				sid: video.id.videoId,
				sname: video.snippet.title,
				aname: video.snippet.channelTitle,
				// high quality thumbnail or medium quality?
				thumbnail: video.snippet.thumbnails.medium.url,
				itemUri: "",
				duration: "",
				downloaded: false,
				downloadedAt: dayjs(),
				playlists: [],
			};
			storageContext?.setSongData((prev) => {
				return [...prev, songObj];
			});
			storageContext?.setSaveToggle(true);
			storageContext?.setVidStatusDict((prev) => {
				return { ...prev, [video.id.videoId]: "pending" };
			});

			// write the url to data.txt
			storageContext.pullSong(video);
		}
	};

	const checkAvailabilityStatus = (id: string) => {
		const status = storageContext?.vidStatusDict[id];
		if (status === undefined) return "Download";
		else if (status === "pending") return "Will be downloaded";
		else return "Downloaded";
	};

	const checkVideoAge = (date: dayjs.Dayjs) => {
		const currDate = dayjs();
		const dDiff = currDate.diff(date, "days");
		const mDiff = currDate.diff(date, "months");
		const yDiff = currDate.diff(date, "years");
		if (yDiff !== 0) {
			return `${yDiff} years ago`;
		} else if (mDiff !== 0) {
			return `${mDiff} months ago`;
		} else return `${dDiff} days ago`;
	};

	return (
		<View style={styles.container}>
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
					<Text
						style={{
							fontFamily: FONT.medium,
							color: COLORS.whiteSecondary,
						}}
					>
						{checkVideoAge(dayjs(video.snippet.publishedAt))}
					</Text>
					<Pressable
						onPress={handleDownload}
						disabled={
							checkAvailabilityStatus(video.id.videoId) !==
							"Download"
						}
					>
						<Text style={styles.artistTitle}>
							{checkAvailabilityStatus(video.id.videoId)}
						</Text>
					</Pressable>
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						backgroundColor: "transparent",
						marginTop: 6,
					}}
				>
					<Pressable
						onPress={() => {
							Linking.openURL(ytTemplate(video.id.videoId));
						}}
					>
						<Text style={styles.videoTitle}>
							{filter(video.snippet.title)}
						</Text>
					</Pressable>
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						backgroundColor: "transparent",
						marginTop: 2,
					}}
				>
					<Text
						style={[
							styles.artistTitle,
							{
								color: COLORS.whiteSecondary,
							},
						]}
					>
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
		backgroundColor: COLORS.darkSecondary,
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
		// width: "90%",
		color: COLORS.whitePrimary,
		fontFamily: FONT.medium,
		fontSize: 18,
	},
	artistTitle: {
		color: COLORS.whiteSecondary,
		fontFamily: FONT.regular,
		fontSize: 15,
	},
});
