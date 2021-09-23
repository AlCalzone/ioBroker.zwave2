export function arrayEquals(arr1: any[], arr2: any[]): boolean {
	if (arr1.length !== arr2.length) return false;
	return arr1.every((item, index) => item === arr2[index]);
}
