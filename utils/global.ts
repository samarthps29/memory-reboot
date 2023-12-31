import dayjs from "dayjs";
import he from "he";

export const directoryUri =
	"content://com.android.externalstorage.documents/tree/primary%3ADownload%2FSongs";

export const fileUri =
	"content://com.android.externalstorage.documents/tree/primary%3ADownload%2FSongs/document/primary%3ADownload%2FSongs";

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
	const minutes = Math.floor(milliseconds / 60000);
	const seconds = Math.floor((milliseconds % 60000) / 1000);

	// Return as a formatted string
	return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
