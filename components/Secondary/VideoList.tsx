import {
	ActivityIndicator,
	Alert,
	Pressable,
	StyleSheet,
	useColorScheme,
} from "react-native";
import {
	FlatList,
	TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import { videoItemType } from "../../utils/TypeDeclarations";
import { View, Text } from "../Common/Themed";
import VideoItem from "./VideoItem";
import { useContext } from "react";
import { SwitchPageContext } from "../../utils/Contexts/SwitchPageContext";
import { StorageContext } from "../../utils/Contexts/StorageContext";
import { FloatingContext } from "../../utils/Contexts/FloatingContext";

const VideoList = ({
	videoData,
	isLoading,
}: {
	videoData: videoItemType[];
	isLoading: boolean;
}) => {
	const colorScheme = useColorScheme();
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
						color={
							colorScheme === "light"
								? COLORS.darkSecondary
								: COLORS.whiteSecondary
						}
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
									// delayLongPress={250}
									onPress={() => {
										switchContext?.setShowHeader(true);
									}}
								>
									<Text
										style={[
											styles.buttonText,
											{
												color:
													colorScheme === "light"
														? "black"
														: COLORS.whiteSecondary,
											},
										]}
									>
										cdz
									</Text>
								</TouchableWithoutFeedback>
							)}
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
								<Text
									style={[
										styles.buttonText,
										{
											color:
												colorScheme === "light"
													? "black"
													: COLORS.whiteSecondary,
										},
									]}
								>
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
		marginTop: SIZES.medium,
	},
	buttonsContainer: {
		width: "100%",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: SIZES.xxSmall,
		flexDirection: "row",
		gap: SIZES.small,
		paddingHorizontal: 4,
	},
	buttonText: {
		fontFamily: FONT.regular,
	},
});
