import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import {
	Menu,
	MenuOption,
	MenuOptions,
	MenuTrigger,
} from "react-native-popup-menu";
import { COLORS, SIZES } from "../../constants/theme";
import { AudioContext } from "../../utils/Contexts/AudioContext";
import { StorageContext } from "../../utils/Contexts/StorageContext";
import { songItemType } from "../../utils/TypeDeclarations";
import { View } from "./Themed";

const Divider = () => <View style={styles.divider} />;

const FloatingMenu = ({
	song,
	currPlaylist,
	index,
}: {
	song: songItemType;
	currPlaylist: string;
	index: number;
}) => {
	const [renderPlaylists, setRenderPlaylists] = useState(false);
	const storageContext = useContext(StorageContext);
	const audioContext = useContext(AudioContext);
	const colorScheme = useColorScheme();
	return (
		<Menu style={styles.container}>
			<MenuTrigger>
				<Ionicons
					name="reorder-four-outline"
					size={20}
					color={
						colorScheme === "light" ||
						song.sid === audioContext?.songInfo["sid"]
							? "black"
							: COLORS.whiteSecondary
					}
				/>
			</MenuTrigger>
			<MenuOptions
				customStyles={{
					optionsContainer: {
						backgroundColor: "transparent",
						borderWidth: 0,
						elevation: 0,
					},
					optionsWrapper: {
						elevation: 0,
						backgroundColor: "transparent",
						borderWidth: 0,
					},
				}}
			>
				<View
					style={{
						flex: 1,
						width: "90%",
						borderRadius: SIZES.small,
						overflow: "hidden",
						marginTop: 28,
					}}
				>
					{!renderPlaylists && (
						<>
							{storageContext?.playlistData &&
								storageContext?.playlistData?.length > 1 && (
									<MenuOption
										onSelect={() => {
											setRenderPlaylists(true);
											return false;
										}}
										text="Add to Playlist"
										customStyles={{
											optionWrapper: styles.menuOption,
										}}
									/>
								)}

							{/* <Divider /> */}
							<MenuOption
								text="Add to Queue"
								customStyles={{
									optionWrapper: styles.menuOption,
								}}
								onSelect={() => {
									audioContext?.setUserQueue((prev) => {
										if (prev === null)
											return {
												queue: [song],
												currentIndex: 0,
											};
										prev.queue.push(song);
										if (prev.currentIndex === -1)
											prev.currentIndex =
												prev.queue.length - 1;
										return prev;
									});
								}}
							/>
							{audioContext?.showQueue !== "" && (
								<>
									{/* <Divider /> */}
									<MenuOption
										text="Remove from Queue"
										customStyles={{
											optionWrapper: styles.menuOption,
										}}
										onSelect={() => {
											const selectedQueue =
												audioContext?.showQueue;
											if (
												selectedQueue ===
													"globalqueue" &&
												audioContext?.globalQueue
											) {
												if (
													index >
													audioContext.globalQueue
														.currentIndex
												) {
													// remove song from global queue
													audioContext?.setGlobalQueue(
														(prev) => {
															if (prev === null)
																return null;
															prev.queue =
																prev.queue.filter(
																	(
																		_,
																		qindex
																	) =>
																		qindex !==
																		index
																);
															return prev;
														}
													);
												}
											} else if (
												selectedQueue === "userqueue" &&
												audioContext?.userQueue
											) {
												if (
													index >
													audioContext?.userQueue
														?.currentIndex
												) {
													// remove song from user queue
													audioContext.setUserQueue(
														(prev) => {
															if (prev === null)
																return null;
															prev.queue =
																prev.queue.filter(
																	(
																		_,
																		qindex
																	) =>
																		qindex !==
																		index
																);
															return prev;
														}
													);
												}
											}
										}}
									/>
								</>
							)}
							{currPlaylist !== "0" && (
								<>
									{/* <Divider /> */}
									<MenuOption
										text="Remove from Playlist"
										customStyles={{
											optionWrapper: styles.menuOption,
										}}
										onSelect={() => {
											storageContext?.setSongData(
												(prev) => {
													return prev.map((item) => {
														if (
															item.sid ===
															song.sid
														) {
															const filtered =
																item.playlists.filter(
																	(pitem) =>
																		pitem !==
																		currPlaylist
																);

															return {
																...item,
																playlists:
																	filtered,
															};
														} else return item;
													});
												}
											);
											storageContext?.setSaveToggle(true);
										}}
									/>
								</>
							)}
						</>
					)}
					{renderPlaylists &&
						storageContext?.playlistData.map((item) => {
							if (item.pid !== "0")
								return (
									<MenuOption
										customStyles={{
											optionWrapper: styles.menuOption,
										}}
										key={item.pid}
										text={item.pname}
										onSelect={() => {
											storageContext.setSongData(
												(prev) => {
													return prev.map((ssong) => {
														if (
															song.sid ===
															ssong.sid
														) {
															ssong.playlists.push(
																item.pid
															);
														}
														return ssong;
													});
												}
											);
											storageContext.setSaveToggle(true);
											setRenderPlaylists(false);
										}}
									/>
								);
						})}
				</View>
			</MenuOptions>
		</Menu>
	);
};

export default FloatingMenu;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "transparent",
	},
	divider: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: "#7F8487",
	},
	menuOption: {
		paddingVertical: 10,
		paddingHorizontal: SIZES.small,
		backgroundColor: COLORS.whitePrimary,
		overflow: "scroll",
	},
});
