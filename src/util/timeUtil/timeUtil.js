import { getTimezoneIdToOffsetMill } from "./timezoneIdToOffset";

export function toUTCMillis(mills, _fromTimezoneId) {
	if (!mills) throw new Error("INVALID MILLS");
	if (!_fromTimezoneId) throw new Error("INVALID TIMEZONE");
	const offset = getTimezoneIdToOffsetMill(_fromTimezoneId);
	return mills - offset;
}

export function fromUTCMills(mills, _toTimezoneId) {
	const offset = getTimezoneIdToOffsetMill(_toTimezoneId);
	return mills + offset;
}

export function toUTCDate(date, _fromTimezoneId) {
	const milis = date.getTime();
	const convertedMili = toUTCMillis(milis, _fromTimezoneId);
	return new Date(convertedMili);
}

export function fromUTCDate(date, _toTimezoneId) {
	const milis = date.getTime();
	const convertedMili = fromUTCMills(milis, _toTimezoneId);
	return new Date(convertedMili);
}

export const DATE_FORMAT_ENUM = {
	DAY: "dd",
	MONTH: "MM",
	YEAR: "YYYY",
	HOUR: "hh",
	MINUTE: "mm",
	SECOND: "ss",
	MILI: "S",
};

export function dateToMill(_date) {
	return _date.getTime();
}

export function milisToDate(_milis) {
	return new Date(_milis);
}

export function formatDate(_date, _formatStr) {
	// if (typeof _date !== typeof Date) throw new Error("INVALID DATE TYPE");
	if (typeof _formatStr !== "string") throw new Error("INVALID DATE FORMAT TYPE");
	const { DAY, HOUR, MILI, MINUTE, MONTH, SECOND, YEAR } = DATE_FORMAT_ENUM;
	return _formatStr
		.replace(DAY, _date.getDay())
		.replace(MONTH, _date.getMonth())
		.replace(YEAR, _date.getFullYear())
		.replace(HOUR, _date.getHours())
		.replace(MINUTE, _date.getMinutes())
		.replace(SECOND, _date.getSeconds())
		.replace(MILI, _date.getMilliseconds());
}
