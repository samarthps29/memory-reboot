import { SetStateAction, useContext } from "react";
import {
	Pressable,
	StyleSheet,
	TouchableWithoutFeedback,
	Text,
	View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
// import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import { FloatingContext } from "../../utils/Contexts/FloatingContext";
import { StorageContext } from "../../utils/Contexts/StorageContext";
import { SwitchPageContext } from "../../utils/Contexts/SwitchPageContext";
// import { Text, View } from "./Themed";

const HeaderButtons = ({
	optionsArr,
	selectedHeaderButton,
	setSelectedHeaderButton,
	source,
}: {
	optionsArr: { pname: string; pid: string }[];
	selectedHeaderButton: string;
	setSelectedHeaderButton: React.Dispatch<SetStateAction<string>>;
	source: string;
}) => {
	const switchContext = useContext(SwitchPageContext);
	const floatingContext = useContext(FloatingContext);
	const storageContext = useContext(StorageContext);
	return (
		<View
			style={{
				flexDirection: "row",
				backgroundColor: "transparent",
				alignItems: "center",
				// marginTop: SIZES.gap,
				gap: 6,
			}}
		>
			<TouchableWithoutFeedback
				// delayLongPress={250}
				onPress={() => {
					// Vibration.vibrate(100);
					switchContext?.setShowHeader(false);
				}}
				// onPress={() => {
				// 	switchContext?.setSwitchPage((prev) => !prev);
				// }}
			>
				<View
					style={[
						styles.buttonContainer,
						{ backgroundColor: "#e6c8ff" },
					]}
				>
					<Text style={styles.userText}>cdz</Text>
				</View>
			</TouchableWithoutFeedback>
			{source === "primary" && (
				<View
					style={[
						styles.buttonContainer,
						{
							backgroundColor: COLORS.darkSecondary,
						},
					]}
				>
					<Pressable
						onPress={() => {
							floatingContext?.setFloatInfo(() => {
								return {
									title: "Create New Playlist",
									placeholder: "Enter Playlist Name",
									btnText: "Create",
									handleButtonClick: (title: string) => {
										storageContext?.setPlaylistData(
											(prev) => {
												return [
													...prev,
													{
														pid: uuidv4(),
														pname: title,
													},
												];
											}
										);
										storageContext?.setSaveToggle(true);
										floatingContext?.setFloatDialogToggle(
											false
										);
									},
								};
							});
							floatingContext?.setFloatDialogToggle(
								(prev) => !prev
							);
						}}
					>
						<Text
							style={[
								styles.buttonText,
								{
									color: COLORS.whitePrimary,
								},
							]}
						>
							Create Playlist
						</Text>
					</Pressable>
				</View>
			)}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					columnGap: 6,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{optionsArr.map((item) => {
					return (
						<View
							style={[
								styles.buttonContainer,
								{
									backgroundColor:
										item.pid === selectedHeaderButton
											? "#8fd66e"
											: COLORS.darkSecondary,
								},
							]}
							key={item.pid}
						>
							<TouchableWithoutFeedback
								delayLongPress={250}
								onPress={() =>
									setSelectedHeaderButton(item.pid)
								}
								onLongPress={() => {
									// Vibration.vibrate(100);
									floatingContext?.setFloatInfo(() => {
										return {
											title: "Edit Playlist",
											placeholder: item.pname,
											btnText: "Rename",
											handleButtonClick: (
												title: string
											) => {
												storageContext?.setPlaylistData(
													(prev) => {
														return prev.map(
															(pitem) => {
																if (
																	item.pid ===
																	pitem.pid
																) {
																	return {
																		pname: title,
																		pid: pitem.pid,
																	};
																} else
																	return pitem;
															}
														);
													}
												);
												storageContext?.setSaveToggle(
													true
												);
												floatingContext?.setFloatDialogToggle(
													false
												);
											},
											btnSecondaryText: "Delete",
											handleSecondaryButtonClick: () => {
												const playlistID = item.pid;
												if (playlistID === "0") return;
												// removed playlist
												storageContext?.setPlaylistData(
													(prev) =>
														prev.filter(
															(pitem) =>
																pitem.pid !==
																playlistID
														)
												);
												// removed playlist references
												storageContext?.setSongData(
													(prev) => {
														return prev.map(
															(sitem) => {
																if (
																	sitem.playlists.includes(
																		playlistID
																	)
																) {
																	sitem.playlists.filter(
																		(
																			spitem
																		) =>
																			spitem !==
																			playlistID
																	);
																}
																return sitem;
															}
														);
													}
												);
												setSelectedHeaderButton("0");
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
								}}
							>
								<Text
									style={[
										styles.buttonText,
										{
											color:
												selectedHeaderButton ===
												item.pid
													? "black"
													: COLORS.whitePrimary,
										},
									]}
								>
									{item.pname}
								</Text>
							</TouchableWithoutFeedback>
						</View>
					);
				})}
			</ScrollView>
		</View>
	);
};

export default HeaderButtons;

const styles = StyleSheet.create({
	buttonContainer: {
		borderRadius: SIZES.xLarge,
		// backgroundColor: COLORS.whiteSecondary,
		alignItems: "center",
		justifyContent: "center",
		padding: SIZES.xSmall,
	},
	buttonText: {
		fontFamily: FONT.medium,
		fontSize: 14,
	},
	userText: {
		fontFamily: FONT.bold,
		fontSize: 14,
		color: "#030004",
	},
});
