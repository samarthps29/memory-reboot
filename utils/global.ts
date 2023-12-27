import he from "he";

export const directoryUri =
	"content://com.android.externalstorage.documents/tree/primary%3ADownload%2FSongs";

export const audioUri =
	"content://com.android.externalstorage.documents/tree/primary%3ADownload%2FSongs/document/primary%3ADownload%2FSongs";

export const filter = (str: string) => {
	return he.decode(str).replace(/#(?:\w+)/g, "");
};
