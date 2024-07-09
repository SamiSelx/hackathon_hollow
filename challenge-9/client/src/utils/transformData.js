export function transformDate(dateString) {
	const date = new Date(dateString);
	const hours = padZero(date.getHours());
	const minutes = padZero(date.getMinutes());
	return `${hours}:${minutes}`;
}

function padZero(number) {
	return number.toString().padStart(2, "0");
}
