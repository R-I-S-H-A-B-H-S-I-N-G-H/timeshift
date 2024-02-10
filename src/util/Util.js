export function toLocalstore(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

export function fromLocalstore(key, data) {
	return JSON.parse(localStorage.getItem(key));
}
