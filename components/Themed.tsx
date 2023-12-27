/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
	Text as DefaultText,
	useColorScheme,
	View as DefaultView,
} from "react-native";

import Colors from "../constants/Colors";

type ThemeProps = {
	lightColor?: string;
	darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
	props: { light?: string; dark?: string },
	colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
	const theme = useColorScheme() ?? "light";
	const colorFromProps = props[theme];

	if (colorFromProps) {
		return colorFromProps;
	} else {
		return Colors[theme][colorName];
	}
}

// TODO: ask gpt how does this work
export function Text(props: TextProps & { swap?: boolean }) {
	const {
		style,
		lightColor,
		darkColor,
		swap: swapProp = false,
		...otherProps
	} = props;
	const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
	if (swapProp) {
		return <DefaultText style={[{ color }, style]} {...otherProps} />;
	} else {
		return <DefaultText style={[style]} {...otherProps} />;
	}
}

export function View(props: ViewProps) {
	const { style, lightColor, darkColor, ...otherProps } = props;
	const backgroundColor = useThemeColor(
		{ light: lightColor, dark: darkColor },
		"background"
	);

	return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
