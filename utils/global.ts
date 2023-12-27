import he from "he";

export const filter = (str: string) => {
	return he.decode(str).replace(/#(?:\w+)/g, "");
};
