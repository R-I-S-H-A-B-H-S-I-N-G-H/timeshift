class DateUtil {
	#timezone;
	#date;

	constructor(epoch, timezone) {
		this.#date = new Date(epoch);
		this.#timezone = timezone || DateUtil.getCurrentTimeZone();
	}

	getEpoch() {
		return this.#date.getTime();
	}

	setEpoch(epoch) {
		this.#date.setTime(epoch);
	}

	getDate() {
		return this.#date.getUTCDate();
	}

	getMonth() {
		return this.#date.getUTCMonth() + 1;
	}
	getYear(size = 4) {
		const mod = Math.pow(10, size);
		return this.#date.getUTCFullYear() % mod;
	}

	getHour(type = 24) {
		if (type === 24) return this.#date.getUTCHours();
		return this.#date.getUTCHours() % 12;
	}

	getAmPm() {
		const curHr = this.getHour();
		return curHr < 12 ? "AM" : "PM";
	}

	getMinutes() {
		return this.#date.getUTCMinutes();
	}

	getSeconds() {
		return this.#date.getUTCSeconds();
	}

	getMilliseconds() {
		return this.#date.getUTCMilliseconds();
	}

	getTimezone() {
		return this.#timezone;
	}
	getEpoch() {
		return this.#date.getTime();
	}

	getDayName(name = true) {
		const weekday = this.#date.getUTCDay();
		if (!name) return weekday;
		return DateUtil.WEEK_DAYS[weekday];
	}

	getMonthName(name = true) {
		const month = this.getMonth();
		if (!name) return month;
		return DateUtil.MONTH[month - 1];
	}

	format(formatStr) {
		if (typeof formatStr !== "string") throw new Error("INVALID DATE FORMAT TYPE");
		const { DAY, HOUR, MILI, MINUTE, MONTH, SECOND, YEAR, DAY_NAME, MONTH_NAME, YEAR2 } = DateUtil.DATE_FORMAT_ENUM;
		return formatStr
			.replace(DAY, this.getDate())
			.replace(MONTH, this.getMonth())
			.replace(YEAR, this.getYear())
			.replace(YEAR2, this.getYear(2))
			.replace(HOUR, this.getHour())
			.replace(MINUTE, this.getMinutes())
			.replace(SECOND, this.getSeconds())
			.replace(MILI, this.getMilliseconds())
			.replace(DAY_NAME, this.getDayName())
			.replace(MONTH_NAME, this.getMonthName());
	}

	static initiate(epoch, timezone) {
		return new DateUtil(epoch, timezone);
	}

	static fromUTC(epoch, toTimezone) {
		if (typeof epoch !== "number") throw new Error("EPOCH SHOULD BE A NUMBER");
		if (!toTimezone) throw new Error("INVALID TIMEZONE");
		const offset = DateUtil.getOffsetMill(toTimezone);
		return epoch + offset;
	}

	static toUTC(epoch, fromTimeZone) {
		if (typeof epoch !== "number") throw new Error("EPOCH SHOULD BE A NUMBER");
		if (!fromTimeZone) throw new Error("INVALID TIMEZONE");
		const offset = DateUtil.getOffsetMill(fromTimeZone);
		return epoch - offset;
	}

	static fromUTCDate(dateUtilInstance, toTimezone) {
		if (!dateUtilInstance instanceof DateUtil) throw new Error("NOT INSTANCE OF DATEUTIL CALS");
		const epoch = dateUtilInstance.getEpoch();
		const updatedEpoch = DateUtil.fromUTC(epoch, toTimezone);
		return new DateUtil(updatedEpoch, toTimezone);
	}

	static toUTCDate(dateUtilInstance, fromTimeZone) {
		if (!dateUtilInstance instanceof DateUtil) throw new Error("NOT INSTANCE OF DATEUTIL CALS");
		const epoch = dateUtilInstance.getEpoch();
		const updatedEpoch = DateUtil.toUTC(epoch, fromTimeZone);
		return new DateUtil(updatedEpoch, fromTimeZone);
	}

	static getOffsetHr(_timezoneId) {
		const timezoneid = _timezoneId;
		const timezoneidCaps = _timezoneId?.toUpperCase();
		const offset = DateUtil.TIMEZONE_ID_TO_OFFSET[timezoneid] || DateUtil.TIMEZONE_ID_TO_OFFSET[timezoneidCaps];
		if (offset === undefined) throw new Error(`DOES NOT SUPPORT FOR :: ${timezoneid}  timezoneid`);
		return offset;
	}

	static getOffsetMin(_timezoneId) {
		return DateUtil.getOffsetHr(_timezoneId) * 60;
	}

	static getOffsetSec(_timezoneId) {
		return DateUtil.getOffsetMin(_timezoneId) * 60;
	}

	static getOffsetMill(_timezoneId) {
		return DateUtil.getOffsetSec(_timezoneId) * 1000;
	}

	static now() {
		// return new DateUtil(Date.now());
		let unixTimeInMilliseconds = performance.now() + performance.timeOrigin;
		return unixTimeInMilliseconds;
	}

	static getCurrentTimeZone() {
		return Intl.DateTimeFormat().resolvedOptions().timeZone;
	}

	static DATE_FORMAT_ENUM = {
		DAY: "dd",
		MONTH: "MM",
		YEAR: "YYYY",
		HOUR: "hh",
		MINUTE: "mm",
		SECOND: "ss",
		MILI: "S",
		DAY_NAME: "DAY",
		MONTH_NAME: "MON",
		YEAR2: "YY",
	};

	static TIMEZONE_ID_TO_OFFSET = {
		DST: -12,
		"Dateline Standard Time": -12,
		"Etc/GMT+12": -12,
		U: 12,
		"UTC-11": -11,
		"Etc/GMT+11": -11,
		"Pacific/Midway": -11,
		"Pacific/Niue": -11,
		"Pacific/Pago_Pago": -11,
		HST: -10,
		"Hawaiian Standard Time": -10,
		"Etc/GMT+10": -10,
		"Pacific/Honolulu": -10,
		"Pacific/Johnston": -10,
		"Pacific/Rarotonga": -10,
		"Pacific/Tahiti": -10,
		AKDT: -8,
		"Alaskan Standard Time": -8,
		"America/Anchorage": -8,
		"America/Juneau": -8,
		"America/Nome": -8,
		"America/Sitka": -8,
		"America/Yakutat": -8,
		PDT: -7,
		"Pacific Standard Time (Mexico)": -7,
		"America/Santa_Isabel": -7,
		"Pacific Daylight Time": -7,
		"America/Los_Angeles": -8,
		"America/Tijuana": -8,
		"America/Vancouver": -8,
		PST: -8,
		"Pacific Standard Time": -8,
		PST8PDT: -8,
		UMST: -7,
		"US Mountain Standard Time": -7,
		"America/Creston": -7,
		"America/Dawson": -7,
		"America/Dawson_Creek": -7,
		"America/Hermosillo": -7,
		"America/Phoenix": -7,
		"America/Whitehorse": -7,
		"Etc/GMT+7": -7,
		MDT: 1,
		"Mountain Standard Time (Mexico)": -6,
		"America/Chihuahua": -6,
		"America/Mazatlan": -6,
		"Mountain Standard Time": -6,
		"America/Boise": -6,
		"America/Cambridge_Bay": -6,
		"America/Denver": -6,
		"America/Edmonton": -6,
		"America/Inuvik": -6,
		"America/Ojinaga": -6,
		"America/Yellowknife": -6,
		MST7MDT: -6,
		CAST: 9.5,
		"Central America Standard Time": -6,
		"America/Belize": -6,
		"America/Costa_Rica": -6,
		"America/El_Salvador": -6,
		"America/Guatemala": -6,
		"America/Managua": -6,
		"America/Tegucigalpa": -6,
		"Etc/GMT+6": -6,
		"Pacific/Galapagos": -6,
		CDT: -5,
		"Central Standard Time": -5,
		"America/Chicago": -5,
		"America/Indiana/Knox": -5,
		"America/Indiana/Tell_City": -5,
		"America/Matamoros": -5,
		"America/Menominee": -5,
		"America/North_Dakota/Beulah": -5,
		"America/North_Dakota/Center": -5,
		"America/North_Dakota/New_Salem": -5,
		"America/Rainy_River": -5,
		"America/Rankin_Inlet": -5,
		"America/Resolute": -5,
		"America/Winnipeg": -5,
		CST6CDT: -5,
		"Central Standard Time (Mexico)": -5,
		"America/Bahia_Banderas": -5,
		"America/Cancun": -5,
		"America/Merida": -5,
		"America/Mexico_City": -5,
		"America/Monterrey": -5,
		CCST: -6,
		"Canada Central Standard Time": -6,
		"America/Regina": -6,
		"America/Swift_Current": -6,
		SPST: -5,
		"SA Pacific Standard Time": -5,
		"America/Bogota": -5,
		"America/Cayman": -5,
		"America/Coral_Harbour": -5,
		"America/Eirunepe": -5,
		"America/Guayaquil": -5,
		"America/Jamaica": -5,
		"America/Lima": -5,
		"America/Panama": -5,
		"America/Rio_Branco": -5,
		"Etc/GMT+5": -5,
		EST: 2,
		"Eastern Standard Time": -5,
		"America/Detroit": -4,
		"America/Havana": -4,
		"America/Indiana/Petersburg": -4,
		"America/Indiana/Vincennes": -4,
		"America/Indiana/Winamac": -4,
		"America/Iqaluit": -4,
		"America/Kentucky/Monticello": -4,
		"America/Louisville": -4,
		"America/Montreal": -4,
		"America/Nassau": -4,
		"America/New_York": -4,
		"America/Nipigon": -4,
		"America/Pangnirtung": -4,
		"America/Port-au-Prince": -4,
		"America/Thunder_Bay": -4,
		"America/Toronto": -4,
		EDT: -4,
		"Eastern Daylight Time": -4,
		UEDT: -5,
		"US Eastern Standard Time": -5,
		"America/Indiana/Marengo": -5,
		"America/Indiana/Vevay": -5,
		"America/Indianapolis": -5,
		VST: 11,
		"Venezuela Standard Time": -4.5,
		"America/Caracas": -4.5,
		PYT: -4,
		"Paraguay Standard Time": -4,
		"America/Asuncion": -4,
		ADT: 5,
		"Atlantic Standard Time": -3,
		"America/Glace_Bay": -3,
		"America/Goose_Bay": -3,
		"America/Halifax": -3,
		"America/Moncton": -3,
		"America/Thule": -3,
		"Atlantic/Bermuda": -3,
		CBST: -4,
		"Central Brazilian Standard Time": -4,
		"America/Campo_Grande": -4,
		"America/Cuiaba": -4,
		SWST: -4,
		"SA Western Standard Time": -4,
		"America/Anguilla": -4,
		"America/Antigua": -4,
		"America/Aruba": -4,
		"America/Barbados": -4,
		"America/Blanc-Sablon": -4,
		"America/Boa_Vista": -4,
		"America/Curacao": -4,
		"America/Dominica": -4,
		"America/Grand_Turk": -4,
		"America/Grenada": -4,
		"America/Guadeloupe": -4,
		"America/Guyana": -4,
		"America/Kralendijk": -4,
		"America/La_Paz": -4,
		"America/Lower_Princes": -4,
		"America/Manaus": -4,
		"America/Marigot": -4,
		"America/Martinique": -4,
		"America/Montserrat": -4,
		"America/Port_of_Spain": -4,
		"America/Porto_Velho": -4,
		"America/Puerto_Rico": -4,
		"America/Santo_Domingo": -4,
		"America/St_Barthelemy": -4,
		"America/St_Kitts": -4,
		"America/St_Lucia": -4,
		"America/St_Thomas": -4,
		"America/St_Vincent": -4,
		"America/Tortola": -4,
		"Etc/GMT+4": -4,
		PSST: -4,
		"Pacific SA Standard Time": -4,
		"America/Santiago": -4,
		"Antarctica/Palmer": -4,
		NDT: -2.5,
		"Newfoundland Standard Time": -2.5,
		"America/St_Johns": -2.5,
		ESAST: -3,
		"E. South America Standard Time": -3,
		"America/Sao_Paulo": -3,
		AST: 4.5,
		"Argentina Standard Time": -3,
		"America/Argentina/Buenos_Aires": -3,
		"America/Argentina/Catamarca": -3,
		"America/Argentina/Cordoba": -3,
		"America/Argentina/Jujuy": -3,
		"America/Argentina/La_Rioja": -3,
		"America/Argentina/Mendoza": -3,
		"America/Argentina/Rio_Gallegos": -3,
		"America/Argentina/Salta": -3,
		"America/Argentina/San_Juan": -3,
		"America/Argentina/San_Luis": -3,
		"America/Argentina/Tucuman": -3,
		"America/Argentina/Ushuaia": -3,
		"America/Buenos_Aires": -3,
		"America/Catamarca": -3,
		"America/Cordoba": -3,
		"America/Jujuy": -3,
		"America/Mendoza": -3,
		SEST: -3,
		"SA Eastern Standard Time": -3,
		"America/Araguaina": -3,
		"America/Belem": -3,
		"America/Cayenne": -3,
		"America/Fortaleza": -3,
		"America/Maceio": -3,
		"America/Paramaribo": -3,
		"America/Recife": -3,
		"America/Santarem": -3,
		"Antarctica/Rothera": -3,
		"Atlantic/Stanley": -3,
		"Etc/GMT+3": -3,
		GDT: 3,
		"Greenland Standard Time": -3,
		"America/Godthab": -3,
		MST: 12,
		"Montevideo Standard Time": -3,
		"America/Montevideo": -3,
		BST: 6,
		"Bahia Standard Time": -3,
		"America/Bahia": -3,
		"UTC-02": -2,
		"America/Noronha": -2,
		"Atlantic/South_Georgia": -2,
		"Etc/GMT+2": -2,
		"Mid-Atlantic Standard Time": -1,
		"Azores Standard Time": 0,
		"America/Scoresbysund": 0,
		"Atlantic/Azores": 0,
		CVST: -1,
		"Cape Verde Standard Time": -1,
		"Atlantic/Cape_Verde": -1,
		"Etc/GMT+1": -1,
		"Morocco Standard Time": 1,
		"Africa/Casablanca": 1,
		"Africa/El_Aaiun": 1,
		UTC: 0,
		"America/Danmarkshavn": 0,
		"Etc/GMT": 0,
		GMT: 0,
		"GMT Standard Time": 1,
		"Europe/Isle_of_Man": 1,
		"Europe/Guernsey": 1,
		"Europe/Jersey": 1,
		"Europe/London": 1,
		"British Summer Time": 1,
		"Atlantic/Canary": 1,
		"Atlantic/Faeroe": 1,
		"Atlantic/Madeira": 1,
		"Europe/Dublin": 1,
		"Europe/Lisbon": 1,
		GST: 0,
		"Greenwich Standard Time": 0,
		"Africa/Abidjan": 0,
		"Africa/Accra": 0,
		"Africa/Bamako": 0,
		"Africa/Banjul": 0,
		"Africa/Bissau": 0,
		"Africa/Conakry": 0,
		"Africa/Dakar": 0,
		"Africa/Freetown": 0,
		"Africa/Lome": 0,
		"Africa/Monrovia": 0,
		"Africa/Nouakchott": 0,
		"Africa/Ouagadougou": 0,
		"Africa/Sao_Tome": 0,
		"Atlantic/Reykjavik": 0,
		"Atlantic/St_Helena": 0,
		WEDT: 2,
		"W. Europe Standard Time": 2,
		"Arctic/Longyearbyen": 2,
		"Europe/Amsterdam": 2,
		"Europe/Andorra": 2,
		"Europe/Berlin": 2,
		"Europe/Busingen": 2,
		"Europe/Gibraltar": 2,
		"Europe/Luxembourg": 2,
		"Europe/Malta": 2,
		"Europe/Monaco": 2,
		"Europe/Oslo": 2,
		"Europe/Rome": 2,
		"Europe/San_Marino": 2,
		"Europe/Stockholm": 2,
		"Europe/Vaduz": 2,
		"Europe/Vatican": 2,
		"Europe/Vienna": 2,
		"Europe/Zurich": 2,
		CEDT: 2,
		"Central Europe Standard Time": 2,
		"Europe/Belgrade": 2,
		"Europe/Bratislava": 2,
		"Europe/Budapest": 2,
		"Europe/Ljubljana": 2,
		"Europe/Podgorica": 2,
		"Europe/Prague": 2,
		"Europe/Tirane": 2,
		RDT: 2,
		"Romance Standard Time": 2,
		"Africa/Ceuta": 2,
		"Europe/Brussels": 2,
		"Europe/Copenhagen": 2,
		"Europe/Madrid": 2,
		"Europe/Paris": 2,
		"Central European Standard Time": 2,
		"Europe/Sarajevo": 2,
		"Europe/Skopje": 2,
		"Europe/Warsaw": 2,
		"Europe/Zagreb": 2,
		WCAST: 1,
		"W. Central Africa Standard Time": 1,
		"Africa/Algiers": 1,
		"Africa/Bangui": 1,
		"Africa/Brazzaville": 1,
		"Africa/Douala": 1,
		"Africa/Kinshasa": 1,
		"Africa/Lagos": 1,
		"Africa/Libreville": 1,
		"Africa/Luanda": 1,
		"Africa/Malabo": 1,
		"Africa/Ndjamena": 1,
		"Africa/Niamey": 1,
		"Africa/Porto-Novo": 1,
		"Africa/Tunis": 1,
		"Etc/GMT-1": 1,
		NST: 5.75,
		"Namibia Standard Time": 1,
		"Africa/Windhoek": 1,
		"GTB Standard Time": 3,
		"Asia/Nicosia": 3,
		"Europe/Athens": 3,
		"Europe/Bucharest": 3,
		"Europe/Chisinau": 3,
		MEDT: 3,
		"Middle East Standard Time": 3,
		"Asia/Beirut": 3,
		"Egypt Standard Time": 2,
		"Africa/Cairo": 2,
		SDT: 3,
		"Syria Standard Time": 3,
		"Asia/Damascus": 3,
		EEDT: 3,
		"E. Europe Standard Time": 3,
		"Europe/Helsinki": 3,
		"Europe/Kyiv": 3,
		"Europe/Mariehamn": 3,
		"Europe/Nicosia": 3,
		"Europe/Riga": 3,
		"Europe/Sofia": 3,
		"Europe/Tallinn": 3,
		"Europe/Uzhgorod": 3,
		"Europe/Vilnius": 3,
		"Europe/Zaporozhye": 3,
		SAST: 7,
		"South Africa Standard Time": 2,
		"Africa/Blantyre": 2,
		"Africa/Bujumbura": 2,
		"Africa/Gaborone": 2,
		"Africa/Harare": 2,
		"Africa/Johannesburg": 2,
		"Africa/Kigali": 2,
		"Africa/Lubumbashi": 2,
		"Africa/Lusaka": 2,
		"Africa/Maputo": 2,
		"Africa/Maseru": 2,
		"Africa/Mbabane": 2,
		"Etc/GMT-2": 2,
		FDT: 3,
		"FLE Standard Time": 3,
		TDT: 3,
		"Turkey Standard Time": 3,
		"Europe/Istanbul": 3,
		JDT: 3,
		"Israel Standard Time": 3,
		"Asia/Jerusalem": 3,
		LST: 2,
		"Libya Standard Time": 2,
		"Africa/Tripoli": 2,
		JST: 9,
		"Jordan Standard Time": 3,
		"Asia/Amman": 3,
		"Arabic Standard Time": 3,
		"Asia/Baghdad": 3,
		KST: 9,
		"Kaliningrad Standard Time": 3,
		"Europe/Kaliningrad": 3,
		"Arab Standard Time": 3,
		"Asia/Aden": 3,
		"Asia/Bahrain": 3,
		"Asia/Kuwait": 3,
		"Asia/Qatar": 3,
		"Asia/Riyadh": 3,
		EAST: 10,
		"E. Africa Standard Time": 3,
		"Africa/Addis_Ababa": 3,
		"Africa/Asmera": 3,
		"Africa/Dar_es_Salaam": 3,
		"Africa/Djibouti": 3,
		"Africa/Juba": 3,
		"Africa/Kampala": 3,
		"Africa/Khartoum": 3,
		"Africa/Mogadishu": 3,
		"Africa/Nairobi": 3,
		"Antarctica/Syowa": 3,
		"Etc/GMT-3": 3,
		"Indian/Antananarivo": 3,
		"Indian/Comoro": 3,
		"Indian/Mayotte": 3,
		MSK: 3,
		"Moscow Standard Time": 3,
		"Europe/Kirov": 3,
		"Europe/Moscow": 3,
		"Europe/Simferopol": 3,
		"Europe/Volgograd": 3,
		"Europe/Minsk": 3,
		SAMT: 4,
		"Samara Time": 4,
		"Europe/Astrakhan": 4,
		"Europe/Samara": 4,
		"Europe/Ulyanovsk": 4,
		IDT: 4.5,
		"Iran Standard Time": 4.5,
		"Asia/Tehran": 4.5,
		"Arabian Standard Time": 4,
		"Asia/Dubai": 4,
		"Asia/Muscat": 4,
		"Etc/GMT-4": 4,
		"Azerbaijan Standard Time": 5,
		"Asia/Baku": 5,
		"Mauritius Standard Time": 4,
		"Indian/Mahe": 4,
		"Indian/Mauritius": 4,
		"Indian/Reunion": 4,
		GET: 4,
		"Georgian Standard Time": 4,
		"Asia/Tbilisi": 4,
		CST: 8,
		"Caucasus Standard Time": 4,
		"Asia/Yerevan": 4,
		"Afghanistan Standard Time": 4.5,
		"Asia/Kabul": 4.5,
		WAST: 8,
		"West Asia Standard Time": 5,
		"Antarctica/Mawson": 5,
		"Asia/Aqtau": 5,
		"Asia/Aqtobe": 5,
		"Asia/Ashgabat": 5,
		"Asia/Dushanbe": 5,
		"Asia/Oral": 5,
		"Asia/Samarkand": 5,
		"Asia/Tashkent": 5,
		"Etc/GMT-5": 5,
		"Indian/Kerguelen": 5,
		"Indian/Maldives": 5,
		YEKT: 5,
		"Yekaterinburg Time": 5,
		"Asia/Yekaterinburg": 5,
		PKT: 5,
		"Pakistan Standard Time": 5,
		"Asia/Karachi": 5,
		IST: 5.5,
		"India Standard Time": 5.5,
		"Asia/Kolkata": 5.5,
		"Asia/Calcutta": 5.5,
		SLST: 5.5,
		"Sri Lanka Standard Time": 5.5,
		"Asia/Colombo": 5.5,
		"Nepal Standard Time": 5.75,
		"Asia/Kathmandu": 5.75,
		"Central Asia Standard Time": 6,
		"Antarctica/Vostok": 6,
		"Asia/Almaty": 6,
		"Asia/Bishkek": 6,
		"Asia/Qyzylorda": 6,
		"Asia/Urumqi": 6,
		"Etc/GMT-6": 6,
		"Indian/Chagos": 6,
		"Bangladesh Standard Time": 6,
		"Asia/Dhaka": 6,
		"Asia/Thimphu": 6,
		"Myanmar Standard Time": 6.5,
		"Asia/Rangoon": 6.5,
		"Indian/Cocos": 6.5,
		"SE Asia Standard Time": 7,
		"Antarctica/Davis": 7,
		"Asia/Bangkok": 7,
		"Asia/Hovd": 7,
		"Asia/Jakarta": 7,
		"Asia/Phnom_Penh": 7,
		"Asia/Pontianak": 7,
		"Asia/Saigon": 7,
		"Asia/Vientiane": 7,
		"Etc/GMT-7": 7,
		"Indian/Christmas": 7,
		NCAST: 7,
		"N. Central Asia Standard Time": 7,
		"Asia/Novokuznetsk": 7,
		"Asia/Novosibirsk": 7,
		"Asia/Omsk": 7,
		"China Standard Time": 8,
		"Asia/Hong_Kong": 8,
		"Asia/Macau": 8,
		"Asia/Shanghai": 8,
		NAST: 8,
		"North Asia Standard Time": 8,
		"Asia/Krasnoyarsk": 8,
		MPST: 8,
		"Singapore Standard Time": 8,
		"Asia/Brunei": 8,
		"Asia/Kuala_Lumpur": 8,
		"Asia/Kuching": 8,
		"Asia/Makassar": 8,
		"Asia/Manila": 8,
		"Asia/Singapore": 8,
		"Etc/GMT-8": 8,
		"W. Australia Standard Time": 8,
		"Antarctica/Casey": 8,
		"Australia/Perth": 8,
		TST: 13,
		"Taipei Standard Time": 8,
		"Asia/Taipei": 8,
		UST: 8,
		"Ulaanbaatar Standard Time": 8,
		"Asia/Choibalsan": 8,
		"Asia/Ulaanbaatar": 8,
		NAEST: 8,
		"North Asia East Standard Time": 8,
		"Asia/Irkutsk": 8,
		"Japan Standard Time": 9,
		"Asia/Dili": 9,
		"Asia/Jayapura": 9,
		"Asia/Tokyo": 9,
		"Etc/GMT-9": 9,
		"Pacific/Palau": 9,
		"Korea Standard Time": 9,
		"Asia/Pyongyang": 9,
		"Asia/Seoul": 9,
		"Cen. Australia Standard Time": 9.5,
		"Australia/Adelaide": 9.5,
		"Australia/Broken_Hill": 9.5,
		ACST: 9.5,
		"AUS Central Standard Time": 9.5,
		"Australia/Darwin": 9.5,
		"E. Australia Standard Time": 10,
		"Australia/Brisbane": 10,
		"Australia/Lindeman": 10,
		AEST: 10,
		"AUS Eastern Standard Time": 10,
		"Australia/Melbourne": 10,
		"Australia/Sydney": 10,
		WPST: 10,
		"West Pacific Standard Time": 10,
		"Antarctica/DumontDUrville": 10,
		"Etc/GMT-10": 10,
		"Pacific/Guam": 10,
		"Pacific/Port_Moresby": 10,
		"Pacific/Saipan": 10,
		"Pacific/Truk": 10,
		"Tasmania Standard Time": 10,
		"Australia/Currie": 10,
		"Australia/Hobart": 10,
		YST: 9,
		"Yakutsk Standard Time": 9,
		"Asia/Chita": 9,
		"Asia/Khandyga": 9,
		"Asia/Yakutsk": 9,
		CPST: 11,
		"Central Pacific Standard Time": 11,
		"Antarctica/Macquarie": 11,
		"Etc/GMT-11": 11,
		"Pacific/Efate": 11,
		"Pacific/Guadalcanal": 11,
		"Pacific/Kosrae": 11,
		"Pacific/Noumea": 11,
		"Pacific/Ponape": 11,
		"Vladivostok Standard Time": 11,
		"Asia/Sakhalin": 11,
		"Asia/Ust-Nera": 11,
		"Asia/Vladivostok": 11,
		NZST: 12,
		"New Zealand Standard Time": 12,
		"Antarctica/McMurdo": 12,
		"Pacific/Auckland": 12,
		"UTC+12": 12,
		"Etc/GMT-12": 12,
		"Pacific/Funafuti": 12,
		"Pacific/Kwajalein": 12,
		"Pacific/Majuro": 12,
		"Pacific/Nauru": 12,
		"Pacific/Tarawa": 12,
		"Pacific/Wake": 12,
		"Pacific/Wallis": 12,
		FST: 12,
		"Fiji Standard Time": 12,
		"Pacific/Fiji": 12,
		"Magadan Standard Time": 12,
		"Asia/Anadyr": 12,
		"Asia/Kamchatka": 13,
		"Asia/Magadan": 12,
		"Asia/Srednekolymsk": 12,
		KDT: 13,
		"Kamchatka Standard Time": 13,
		"Tonga Standard Time": 13,
		"Etc/GMT-13": 13,
		"Pacific/Enderbury": 13,
		"Pacific/Fakaofo": 13,
		"Pacific/Tongatapu": 13,
		SST: 13,
		"Samoa Standard Time": 13,
		"Pacific/Apia": 13,
	};

	static WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	static MONTH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
}
window.DateUtil = DateUtil;
