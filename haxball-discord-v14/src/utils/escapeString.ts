export const escapeString = (str: unknown): typeof str => {
	if (typeof str !== "string") return str;

	return str.replace(/"/g, '\\"');
};
