import he from "he";

export const filter = (str: string) => {
	return he.decode(str).replace(/#(?:\w+)/g, "");
};

export const ytTemplate = (str: string) => {
	return `https://www.youtube.com/watch?v=${str}`;
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

	// Return as a formatted string
	return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
