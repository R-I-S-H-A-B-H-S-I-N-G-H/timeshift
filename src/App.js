import { useState } from "react";
import { DateUtil } from "./util/timeUtil/DateUtil";
import Slider from "./Components/Slider/Slider";
import { DropDown } from "./Components/Dropdown/DropDown";

export default function App(params) {
	const [epoch, setEpoch] = useState(Date.now());
	const UTCDATE = new DateUtil(epoch, "UTC");
	const ISTDATE = DateUtil.fromUTCDate(UTCDATE, "IST");
	const [dateList, setDateList] = useState([UTCDATE]);

	function tzSelectHandler(timezone) {
		console.log(timezone);
		setDateList((prev) => [...prev, DateUtil.fromUTCDate(UTCDATE, timezone)]);
	}

	function updateEpoch(utcEpoch) {
		setEpoch(utcEpoch);
		setDateList((prevList) =>
			prevList.map((ele) => {
				const updatedEpoch = DateUtil.fromUTC(utcEpoch, ele.getTimezone());
				ele.setEpoch(updatedEpoch);
				return ele;
			}),
		);
	}

	return (
		<div>
			<div>
				<DropDown list={Object.keys(DateUtil.TIMEZONE_ID_TO_OFFSET)} onSelect={tzSelectHandler} />
				<h2>UTC Epoch {epoch}</h2>
				<Slider stepVal={1000 * 60 * 30} minVal={Date.now() - 1000 * 60 * 60 * 60} maxVal={Date.now() + 1000 * 60 * 60 * 60} val={epoch} onUpdate={updateEpoch} />

				{dateList.map((date) => {
					return (
						<div>
							DATE IN {date.getTimezone()} :: {date.format("dd DAY , MON, YYYY  hh:mm:ss")} offset : {DateUtil.getOffsetHr(date.getTimezone())}
						</div>
					);
				})}
			</div>
		</div>
	);
}
