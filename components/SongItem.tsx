import { Audio } from "expo-av";
import { useState } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { songItemType } from "../utils/types";
import { Text, View } from "./Themed";

const SongItem = ({ song }: { song: songItemType }) => {
	const videoUri =
		"content://com.android.externalstorage.documents/tree/primary%3ADownload%2FSongs/document/primary%3ADownload%2FSongs%2FBX7exLYSEy8.mp4";

	const [audio, setAudio] = useState<Audio.Sound | null>(null);
	const play = async () => {
		const { sound } = await Audio.Sound.createAsync({ uri: videoUri });
		setAudio(sound);
		await sound.playAsync();
	};

	return (
		<Pressable
			onPress={() => {
				play();
			}}
		>
			<View style={styles.container}>
				<View style={styles.imageContainer}>
					<Image
						source={song.thumbnail}
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
					}}
				>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							backgroundColor: "transparent",
						}}
					>
						<Text style={styles.songTitle}>{song.sname}</Text>
						<Text>{song.duration}</Text>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							backgroundColor: "transparent",
							marginTop: 2,
						}}
					>
						<Text style={styles.artistTitle}>{song.aname}</Text>
					</View>
				</View>
			</View>
		</Pressable>
	);
};

export default SongItem;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		backgroundColor: COLORS.white,
		padding: SIZES.xSmall,
		borderRadius: SIZES.medium,
		flexDirection: "row",
	},
	imageContainer: {
		height: 50,
		width: 50,
		borderRadius: SIZES.small,
		overflow: "hidden",
		marginRight: SIZES.xSmall,
	},
	songTitle: {
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
