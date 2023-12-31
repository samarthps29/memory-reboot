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
import { StorageContext } from "../utils/StorageContext";
import { View } from "./Themed";
import { AudioContext } from "../utils/AudioContext";

const Divider = () => <View style={styles.divider} />;

const FloatingMenu = ({
	sid,
	currPlaylist,
}: {
	sid: string;
	currPlaylist: string;
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
						sid === audioContext?.songInfo["sid"]
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
							text="Add to playlist"
							customStyles={{
								optionWrapper: {},
							}}
						/>
						{currPlaylist !== "0" && (
							<>
								<Divider />
								<MenuOption
									onSelect={() => {
										storageContext?.setSongData((prev) => {
											return prev.map((item) => {
												if (item.sid === sid) {
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
										storageContext?.setSongDataUpdate(true);
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
												if (song.sid === sid) {
													song.playlists.push(
														item.pid
													);

													return song;
												} else return song;
											});
										});
										storageContext.setSongDataUpdate(true);
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
