import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { SwitchPageContextProvider } from "../utils/Contexts/SwitchPageContext";
import { AudioContextProvider } from "../utils/Contexts/AudioContext";
import { StorageContextProvider } from "../utils/Contexts/StorageContext";
import { FloatingContextProvider } from "../utils/Contexts/FloatingContext";
import { MenuProvider } from "react-native-popup-menu";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	initialRouteName: "index",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		ageoRegular: require("../assets/fonts/AgeoRegular.ttf"),
		ageoMedium: require("../assets/fonts/AgeoMedium.ttf"),
		ageoBold: require("../assets/fonts/AgeoBold.ttf"),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) SplashScreen.hideAsync();
	}, [loaded]);

	if (!loaded) return null;
	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	return (
		<ThemeProvider
			value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<MenuProvider>
				<StorageContextProvider>
					<FloatingContextProvider>
						<AudioContextProvider>
							<SwitchPageContextProvider>
								<Stack>
									<Stack.Screen
										name="index"
										options={{ headerShown: false }}
									/>
								</Stack>
							</SwitchPageContextProvider>
						</AudioContextProvider>
					</FloatingContextProvider>
				</StorageContextProvider>
			</MenuProvider>
		</ThemeProvider>
	);
}
