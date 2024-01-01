import dayjs from "dayjs";
import { StorageAccessFramework as SAF } from "expo-file-system";
import { useContext } from "react";
import {
	Image,
	Linking,
	Pressable,
	StyleSheet,
	useColorScheme,
} from "react-native";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import {
	StorageContext,
	checkSubstring,
} from "../../utils/Contexts/StorageContext";
import { filter, ytTemplate } from "../../utils/global";
import { songItemType, videoItemType } from "../../utils/TypeDeclarations";
import { Text, View } from "../Common/Themed";

const VideoItem = ({ video }: { video: videoItemType }) => {
	const colorScheme = useColorScheme();
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
				thumbnail: video.snippet.thumbnails.high.url,
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
			const files = await SAF.readDirectoryAsync(
				storageContext?.directoryUri
			);
			const dataFileUri = checkSubstring("data.txt", files);
			if (dataFileUri !== null) {
				const content = await SAF.readAsStringAsync(dataFileUri);
				await SAF.writeAsStringAsync(
					dataFileUri,
					content + ytTemplate(video.id.videoId) + ";"
				);
			} else {
				const file = await SAF.createFileAsync(
					storageContext?.directoryUri,
					"data.txt",
					"text/plain"
				);
				await SAF.writeAsStringAsync(
					file,
					ytTemplate(video.id.videoId) + ";"
				);
			}
		}
	};

	const checkAvailabilityStatus = (id: string) => {
		const status = storageContext?.vidStatusDict[id];
		if (status === undefined) return "Download";
		else if (status === "pending") return "Will be downloaded";
		else return "Downloaded";
	};

	const checkAge = (date: dayjs.Dayjs) => {
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
		<View
			style={[
				styles.container,
				{
					backgroundColor:
						colorScheme === "light"
							? COLORS.whiteSecondary
							: COLORS.darkSecondary,
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
					<Text
						style={{
							fontFamily: FONT.medium,
							color:
								colorScheme === "light"
									? "black"
									: COLORS.whiteSecondary,
						}}
					>
						{checkAge(dayjs(video.snippet.publishedAt))}
					</Text>
					<Pressable
						onPress={handleDownload}
						disabled={
							checkAvailabilityStatus(video.id.videoId) !==
							"Download"
						}
					>
						<Text
							style={[
								styles.artistTitle,
								{
									color:
										colorScheme === "light"
											? "black"
											: COLORS.whiteSecondary,
								},
							]}
						>
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
						<Text
							style={[
								styles.videoTitle,
								{
									color:
										colorScheme === "light"
											? "black"
											: COLORS.whitePrimary,
								},
							]}
						>
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
								color:
									colorScheme === "light"
										? "black"
										: COLORS.whiteSecondary,
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
