import { Ionicons } from "@expo/vector-icons";
import { Pressable, useColorScheme } from "react-native";
import { COLORS } from "../../constants/theme";
import { StorageContext } from "../../utils/StorageContext";
import { useContext } from "react";

const RefreshButton = () => {
	const storageContext = useContext(StorageContext);
	const colorScheme = useColorScheme();

	return (
		<Pressable
			onPress={() => {
				storageContext?.setShouldRefresh(true);
			}}
		>
			<Ionicons
				name="ios-refresh"
				size={24}
				color={
					colorScheme === "light" ? "black" : COLORS.whiteSecondary
				}
			/>
		</Pressable>
	);
};

export default RefreshButton;
