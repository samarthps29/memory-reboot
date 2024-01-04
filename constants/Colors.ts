import { COLORS } from "./theme";

const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export default {
	light: {
		text: "#000",
		background: COLORS.lightWhite,
		tint: tintColorLight,
		tabIconDefault: "#ccc",
		tabIconSelected: tintColorLight,
	},
	dark: {
		text: "#fff",
		background: "#121212",
		tint: tintColorDark,
		tabIconDefault: "#ccc",
		tabIconSelected: tintColorDark,
	},
};
