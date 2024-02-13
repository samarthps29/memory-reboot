import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
	Menu,
	MenuOption,
	MenuOptions,
	MenuTrigger,
} from "react-native-popup-menu";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import { AudioContext } from "../../utils/Contexts/AudioContext";
import { StorageContext } from "../../utils/Contexts/StorageContext";
import { songItemType } from "../../utils/TypeDeclarations";
import { renderers } from "react-native-popup-menu";
import { reducedTitle } from "../../utils/global";
const { SlideInMenu } = renderers;

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
	return (
		<Menu style={styles.container} renderer={SlideInMenu}>
			<MenuTrigger>
				<Ionicons
					name="reorder-four-outline"
					size={20}
					color={COLORS.whiteSecondary}
				/>
			</MenuTrigger>
			<MenuOptions
				customStyles={{
					optionsContainer: {
						backgroundColor: COLORS.darkSecondary,
						paddingHorizontal: 8,
						paddingVertical: 8,
						borderRadius: 0,
						borderTopLeftRadius: 16,
						borderTopRightRadius: 16,
					},
					optionsWrapper: {
						elevation: 0,
						backgroundColor: "transparent",
						borderWidth: 0,
					},
				}}
			>
				<MenuOption
					customStyles={{
						optionWrapper: [
							styles.menuOption,
							{
								backgroundColor: COLORS.darkSecondary,
								marginBottom: 2,
							},
						],
					}}
					onSelect={() => {
						return false;
					}}
				>
					<Text
						numberOfLines={1}
						style={[
							styles.menuText,
							{
								color:
									audioContext?.songInfo["sid"] === song.sid
										? COLORS.primary
										: COLORS.whitePrimary,
								fontFamily: FONT.bold,
							},
						]}
					>
						{reducedTitle(song.sname, 120)}
					</Text>
				</MenuOption>
				<View
					style={{
						height: 1,
						backgroundColor: COLORS.darkTertiary,
						marginBottom: 4,
					}}
				/>
				{!renderPlaylists && (
					<>
						{storageContext?.playlistData &&
							storageContext?.playlistData?.length > 1 && (
								<MenuOption
									onSelect={() => {
										setRenderPlaylists(true);
										return false;
									}}
									customStyles={{
										optionWrapper: styles.menuOption,
									}}
								>
									<Text style={styles.menuText}>
										Add to Playlist
									</Text>
								</MenuOption>
							)}

						<MenuOption
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
						>
							<Text style={styles.menuText}>Add to Queue</Text>
						</MenuOption>
						{currPlaylist !== "0" && (
							<MenuOption
								customStyles={{
									optionWrapper: styles.menuOption,
								}}
								onSelect={() => {
									storageContext?.setSongData((prev) => {
										return prev.map((item) => {
											if (item.sid === song.sid) {
												const filtered =
													item.playlists.filter(
														(pitem) =>
															pitem !==
															currPlaylist
													);

												return {
													...item,
													playlists: filtered,
												};
											} else return item;
										});
									});
									storageContext?.setSaveToggle(true);
								}}
							>
								<Text style={styles.menuText}>
									Remove from Playlist
								</Text>
							</MenuOption>
						)}
						{audioContext?.showQueue !== "" && (
							<MenuOption
								customStyles={{
									optionWrapper: styles.menuOption,
								}}
								onSelect={() => {
									const selectedQueue =
										audioContext?.showQueue;
									if (
										selectedQueue === "globalqueue" &&
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
															(_, qindex) =>
																qindex !== index
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
															(_, qindex) =>
																qindex !== index
														);
													return prev;
												}
											);
										}
									}
								}}
							>
								<Text style={styles.menuText}>
									Remove from Queue
								</Text>
							</MenuOption>
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
									onSelect={() => {
										storageContext.setSongData((prev) => {
											return prev.map((ssong) => {
												if (song.sid === ssong.sid) {
													ssong.playlists.push(
														item.pid
													);
												}
												return ssong;
											});
										});
										storageContext.setSaveToggle(true);
										setRenderPlaylists(false);
									}}
								>
									<Text style={styles.menuText}>
										{item.pname}
									</Text>
								</MenuOption>
							);
					})}
				<MenuOption
					customStyles={{
						optionWrapper: styles.menuOption,
					}}
					onSelect={() => {
						storageContext?.deleteSong(song.sid);
					}}
				>
					<Text style={styles.menuText}>Remove Permanently</Text>
				</MenuOption>
				<MenuOption
					customStyles={{
						optionWrapper: styles.menuOption,
					}}
					onSelect={() => {
						setRenderPlaylists(false);
					}}
				>
					<Text style={styles.menuText}>Cancel</Text>
				</MenuOption>
			</MenuOptions>
		</Menu>
	);
};

export default FloatingMenu;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "transparent",
	},
	menuOption: {
		paddingVertical: 12,
		paddingHorizontal: SIZES.xSmall,
		backgroundColor: COLORS.darkSecondary,
		overflow: "scroll",
	},
	menuText: {
		color: COLORS.whitePrimary,
		fontFamily: FONT.medium,
		fontSize: 16,
	},
});
