import { Ionicons } from "@expo/vector-icons";
import { Pressable, useColorScheme } from "react-native";
import { COLORS } from "../../../constants/theme";
import { StorageContext } from "../../../utils/Contexts/StorageContext";
import { useContext } from "react";

const RefreshButton = () => {
	const storageContext = useContext(StorageContext);

	return (
		<Pressable
			onPress={() => {
				storageContext?.setRefreshToggle(true);
			}}
		>
			<Ionicons
				name="ios-refresh"
				size={24}
				color={COLORS.whiteSecondary}
			/>
		</Pressable>
	);
};

export default RefreshButton;
