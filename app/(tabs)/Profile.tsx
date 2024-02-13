import { StyleSheet, Text, View } from "react-native";
// import { Text, View } from "../../components/Common/Themed";
import { COLORS, FONT, SIZES } from "../../constants/theme";

const Profile = () => {
	return (
		<View style={styles.mainContainer}>
			<Text style={styles.banner}>COMING SOON</Text>
		</View>
	);
};

export default Profile;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: COLORS.darkPrimary,
	},
	banner: {
		fontFamily: FONT.medium,
		fontSize: SIZES.medium,
		color: "white",
	},
});
