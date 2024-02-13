import { useContext } from "react";
import {
	ActivityIndicator,
	Alert,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import {
	FlatList,
	TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import { FloatingContext } from "../../utils/Contexts/FloatingContext";
import { StorageContext } from "../../utils/Contexts/StorageContext";
import { SwitchPageContext } from "../../utils/Contexts/SwitchPageContext";
import { videoItemType } from "../../utils/TypeDeclarations";
// import { Text, View } from "../Common/Themed";
import VideoItem from "./VideoItem";

const VideoList = ({
	videoData,
	isLoading,
}: {
	videoData: videoItemType[];
	isLoading: boolean;
}) => {
	const switchContext = useContext(SwitchPageContext);
	const storageContext = useContext(StorageContext);
	const floatingContext = useContext(FloatingContext);
	return (
		<>
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
						color={COLORS.whiteSecondary}
					/>
				</View>
			) : (
				<View style={styles.container}>
					<View style={styles.buttonsContainer}>
						<View
							style={{
								backgroundColor: "transparent",
								flexDirection: "row",
								gap: 12,
							}}
						>
							{!switchContext?.showHeader && (
								<TouchableWithoutFeedback
									onPress={() => {
										switchContext?.setShowHeader(true);
									}}
								>
									<Text style={styles.buttonText}>cdz</Text>
								</TouchableWithoutFeedback>
							)}
							<Pressable
								onPress={() => {
									storageContext?.importData();
								}}
							>
								<Text style={styles.buttonText}>Import</Text>
							</Pressable>
							<Pressable
								onPress={() => {
									storageContext?.exportData();
								}}
							>
								<Text style={styles.buttonText}>Export</Text>
							</Pressable>
						</View>
						<View
							style={{
								backgroundColor: "transparent",
								flexDirection: "row",
								gap: 12,
							}}
						>
							<Pressable
								onPress={() => {
									if (storageContext?.apiKey === null) {
										floatingContext?.setFloatInfo(() => {
											return {
												title: "Enter API Key",
												btnText: "Set",
												placeholder: "API Key",
												handleButtonClick: (
													str: string
												) => {
													storageContext?.setApiKey(
														str
													);
													storageContext?.setSaveToggle(
														true
													);
													floatingContext?.setFloatDialogToggle(
														false
													);
												},
											};
										});
										floatingContext?.setFloatDialogToggle(
											(prev) => !prev
										);
									} else {
										Alert.alert(
											"Clear API Key",
											"Do you want to remove the API Key?",
											[
												{
													text: "Yes",
													onPress: () => {
														storageContext?.setApiKey(
															null
														);
														storageContext?.setSaveToggle(
															true
														);
													},
												},
												{
													text: "No",
													onPress: () => {},
												},
											]
										);
									}
								}}
							>
								<Text style={styles.buttonText}>
									{storageContext?.apiKey === null
										? "Set API Key"
										: "Clear API Key"}
								</Text>
							</Pressable>
						</View>
					</View>

					<FlatList
						showsVerticalScrollIndicator={false}
						data={videoData}
						renderItem={({ item }) => <VideoItem video={item} />}
						contentContainerStyle={{ rowGap: SIZES.small }}
						keyExtractor={(item) => item.id.videoId}
					/>
				</View>
			)}
		</>
	);
};

export default VideoList;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		backgroundColor: "transparent",
		marginTop: SIZES.small, // changed
	},
	buttonsContainer: {
		width: "100%",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: SIZES.small,
		flexDirection: "row",
		gap: SIZES.small,
		paddingHorizontal: 4,
		backgroundColor: "transparent",
	},
	buttonText: {
		fontFamily: FONT.regular,
		color: COLORS.whiteSecondary,
	},
});
