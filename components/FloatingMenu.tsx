import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import {
	Menu,
	MenuOption,
	MenuOptions,
	MenuTrigger,
} from "react-native-popup-menu";
import { COLORS, SIZES } from "../constants/theme";
import { StorageContext } from "../utils/Contexts/StorageContext";
import { View } from "./Themed";
import { AudioContext } from "../utils/Contexts/AudioContext";
import { songItemType } from "../utils/TypeDeclarations";

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
						padding: SIZES.gap,
						borderRadius: SIZES.small,
					},
				}}
			>
				{!renderPlaylists && (
					<>
						<MenuOption
							onSelect={() => {
								setRenderPlaylists(true);
								return false;
							}}
							text="Add to Playlist"
							customStyles={{
								optionWrapper: {},
							}}
						/>
						<Divider />
						<MenuOption
							text="Add to Queue"
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
								<Divider />
								<MenuOption
									text="Remove from Queue"
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
																(_, qindex) =>
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
								<Divider />
								<MenuOption
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
									text="Remove from playlist"
									customStyles={{
										optionWrapper: {},
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
									key={item.pid}
									text={item.pname}
									onSelect={() => {
										storageContext.setSongData((prev) => {
											return prev.map((song) => {
												if (song.sid === song.sid) {
													song.playlists.push(
														item.pid
													);

													return song;
												} else return song;
											});
										});
										storageContext.setSaveToggle(true);
										setRenderPlaylists(false);
									}}
								/>
							);
					})}
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
});
