import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONT, SIZES } from "../../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext } from "react";
import { StorageContext } from "../../utils/Contexts/StorageContext";

const Profile = () => {
	const storageContext = useContext(StorageContext);
	return (
		<SafeAreaView style={styles.mainContainer}>
			<Pressable
				onPress={() => {
					storageContext?.setRefreshToggle(true);
				}}
			>
				<View style={styles.menuItemContainer}>
					<Text style={styles.menuItem}>Refresh Data</Text>
				</View>
			</Pressable>
		</SafeAreaView>
	);
};

export default Profile;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		padding: SIZES.medium,
		backgroundColor: COLORS.darkPrimary,
	},
	menuItemContainer: {
		backgroundColor: COLORS.darkSecondary,
		borderRadius: SIZES.small,
		padding: SIZES.small,
	},
	menuItem: {
		fontFamily: FONT.regular,
		fontSize: SIZES.medium,
		color: COLORS.whitePrimary,
	},
});
