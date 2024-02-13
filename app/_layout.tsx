import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import { AudioContextProvider } from "../utils/Contexts/AudioContext";
import { FloatingContextProvider } from "../utils/Contexts/FloatingContext";
import { NotificationProvider } from "../utils/Contexts/NotificationContext";
import { StorageContextProvider } from "../utils/Contexts/StorageContext";
import { SwitchPageContextProvider } from "../utils/Contexts/SwitchPageContext";

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
		<MenuProvider>
			<NotificationProvider>
				<StorageContextProvider>
					<FloatingContextProvider>
						<AudioContextProvider>
							<SwitchPageContextProvider>
								<Stack>
									<Stack.Screen
										name="(tabs)"
										options={{ headerShown: false }}
									/>
								</Stack>
							</SwitchPageContextProvider>
						</AudioContextProvider>
					</FloatingContextProvider>
				</StorageContextProvider>
			</NotificationProvider>
		</MenuProvider>
	);
}
