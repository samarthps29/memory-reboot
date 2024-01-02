import he from "he";

export const filter = (str: string) => {
	return he.decode(str).replace(/#(?:\w+)/g, "");
};

export const ytTemplate = (str: string) => {
	return `https://www.youtube.com/watch?v=${str}`;
};

export const reducedTitle = (str: string, reductionParam: number = 40) => {
	const filteredString = filter(str);
	if (filteredString.length > reductionParam) {
		return filteredString.slice(0, reductionParam) + "...";
	} else return filteredString;
};

export const durstenfeldShuffle = (arr: any[]) => {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
};

export const convertToTime = (milliseconds: number) => {
	const timeInSeconds = Math.floor(milliseconds / 1000);
	const minutes = Math.floor(timeInSeconds / 60);
	const seconds = timeInSeconds - minutes * 60;

	return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
