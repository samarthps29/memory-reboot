import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { createContext, useEffect, useState } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

async function registerForPushNotificationsAsync() {
	let token;

	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
			audioAttributes: {
				contentType: 2,
				usage: 1,
			},
		});
	}

	if (Device.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			alert("Failed to get push token for push notification!");
			return;
		}
		token = (await Notifications.getDevicePushTokenAsync()).data;
	}
	return token;
}

const configureNotificationCategory = async () => {
	Notifications.setNotificationCategoryAsync("trackControl", [
		{
			buttonTitle: "Prev",
			identifier: "prevButton",
			options: { opensAppToForeground: false },
		},
		{
			buttonTitle: "Play | Pause",
			identifier: "playButton",
			options: { opensAppToForeground: false },
		},
		{
			buttonTitle: "Next",
			identifier: "nextButton",
			options: { opensAppToForeground: false },
		},
	]);
};

const schedulePushNotification = async (title: string) => {
	await Notifications.scheduleNotificationAsync({
		content: {
			title: title,
			categoryIdentifier: "trackControl",
			sticky: true,
			priority: "MAX",
		},
		trigger: null,
	});
};

const dismissPushNotification = async () => {
	await Notifications.dismissAllNotificationsAsync();
};

const initialize = async () => {
	await registerForPushNotificationsAsync();
	await configureNotificationCategory();
};

const finalize = async () => {
	await dismissPushNotification();
};

export const NotificationContext = createContext<{
	schedulePushNotification: (title: string) => Promise<void>;
	dismissPushNotification: () => Promise<void>;
	remoteAction: { action: string; switch: boolean } | null;
} | null>(null);

export const NotificationProvider = ({ children }: React.PropsWithChildren) => {
	const [remoteAction, setRemoteAction] = useState<{
		action: string;
		switch: boolean;
	} | null>(null);
	useEffect(() => {
		const notificationListener =
			Notifications.addNotificationReceivedListener(() => {});
		const responseListener =
			Notifications.addNotificationResponseReceivedListener(
				(notification) => {
					setRemoteAction((prev) => ({
						action: notification.actionIdentifier,
						switch: !prev?.switch,
					}));
				}
			);

		initialize();

		return () => {
			notificationListener.remove();
			responseListener.remove();
			finalize();
		};
	}, []);

	return (
		<NotificationContext.Provider
			value={{
				schedulePushNotification,
				dismissPushNotification,
				remoteAction,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
};
