import { SetStateAction, useContext } from "react";
import { Pressable, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { COLORS, FONT, SIZES } from "../constants/theme";
import { FloatingContext } from "../utils/FloatingContext";
import { StorageContext } from "../utils/StorageContext";
import { SwitchPageContext } from "../utils/SwitchPageContext";
import { Text, View } from "./Themed";

const HeaderButtons = ({
	optionsArr,
	selectedHeaderButton,
	setSelectedHeaderButton,
	source,
}: {
	optionsArr: { pname: string; pid: string }[];
	selectedHeaderButton?: string;
	setSelectedHeaderButton?: React.Dispatch<SetStateAction<string>>;
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
				marginTop: SIZES.gap,
				gap: 6,
			}}
		>
			<View
				style={[styles.buttonContainer, { backgroundColor: "#e6c8ff" }]}
			>
				<Pressable
					onPress={() => {
						switchContext?.setSwitchPage((prev) => !prev);
					}}
				>
					<Text style={styles.userText}>cdz</Text>
				</Pressable>
			</View>
			{source === "primary" && (
				<View
					style={[
						styles.buttonContainer,
						{ backgroundColor: COLORS.white },
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
										// console.log(uuidv4());
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
										storageContext?.setSongDataUpdate(true);
										floatingContext?.setFloatDialogToggle(false);
									},
								};
							});
							floatingContext?.setFloatDialogToggle((prev) => !prev);
						}}
					>
						<Text style={styles.buttonText}>Create Playlist</Text>
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
											? COLORS.secondary
											: COLORS.white,
								},
							]}
							key={item.pid}
						>
							<Pressable
								// TODO: fix this
								onPress={() =>
									setSelectedHeaderButton!(item.pid)
								}
							>
								<Text style={styles.buttonText}>
									{item.pname}
								</Text>
							</Pressable>
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
		// backgroundColor: COLORS.white,
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
