import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { COLORS, FONT, SIZES } from "../../constants/theme";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				// tabBarHideOnKeyboard: true,
				headerShown: false,
				tabBarStyle: {
					borderTopWidth: 0,
					shadowOpacity: 0,
					elevation: 0,
					backgroundColor: "#0a0a0a",
					position: "absolute",
					height: 48,
				},
				tabBarIconStyle: {
					alignItems: "center",
					justifyContent: "center",
				},
				tabBarLabelStyle: {
					fontFamily: FONT.regular,
					color: COLORS.whitePrimary,
					fontSize: SIZES.small,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarLabel: ({ focused }) => (
						<Text
							style={[
								styles.iconLabel,
								{
									color: focused
										? COLORS.whitePrimary
										: COLORS.gray,
								},
							]}
						>
							Home
						</Text>
					),
					tabBarIcon: ({ focused }) => (
						<MaterialIcons
							style={styles.icon}
							name="home-filled"
							size={24}
							color={focused ? COLORS.whitePrimary : COLORS.gray}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="Explore"
				options={{
					tabBarLabel: ({ focused }) => (
						<Text
							style={[
								styles.iconLabel,
								{
									color: focused
										? COLORS.whitePrimary
										: COLORS.gray,
								},
							]}
						>
							Explore
						</Text>
					),
					tabBarIcon: ({ focused }) => (
						<MaterialIcons
							style={styles.icon}
							name="explore"
							size={24}
							color={focused ? COLORS.whitePrimary : COLORS.gray}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="Profile"
				options={{
					tabBarLabel: ({ focused }) => (
						<Text
							style={[
								styles.iconLabel,
								{
									color: focused
										? COLORS.whitePrimary
										: COLORS.gray,
								},
							]}
						>
							Profile
						</Text>
					),
					tabBarIcon: ({ focused }) => (
						<MaterialIcons
							style={styles.icon}
							name="settings"
							size={24}
							color={focused ? COLORS.whitePrimary : COLORS.gray}
						/>
					),
				}}
			/>
		</Tabs>
	);
}

const styles = StyleSheet.create({
	icon: {
		marginTop: 4,
	},
	iconLabel: {
		fontFamily: FONT.regular,
		color: COLORS.whitePrimary,
		marginBottom: 4,
		fontSize: SIZES.small,
	},
});
