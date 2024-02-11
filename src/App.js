import { useEffect, useRef, useState } from "react";
import Slider from "./Components/Slider/Slider";
import { DropDown } from "./Components/Dropdown/DropDown";
import style from "./App.module.css";
import { toLocalstore } from "./util/Util";
import Timeslider from "./Components/Timeslider/Timeslider";
import Unixtimer from "./Components/UnixTimer/Unixtimer";

export default function App(params) {
	const [curEpoch, setCurEpoch] = useState(Math.trunc(Date.now() / 1000));
	const [milli, setMilli] = useState(Date.now());
	const [dateList, setDateList] = useState([new DateUtil(milli, "UTC")]);

	function tzSelectHandler(timezone) {
		if (!timezone) return;
		for (const dateObj of dateList) if (dateObj.getTimezone() === timezone) return;

		const tzEpoc = DateUtil.fromUTC(milli, timezone);
		updateDateList([...dateList, new DateUtil(tzEpoc, timezone)]);
	}

	function updateDateList(newDateList) {
		toLocalstore("dateList", newDateList);
		setDateList(newDateList);
	}

	function updateEpoch(utcEpoch) {
		setMilli(utcEpoch);
		const newDateList = dateList.map((ele) => {
			const updatedEpoch = DateUtil.fromUTC(utcEpoch, ele.getTimezone());
			ele.setEpoch(updatedEpoch);
			return ele;
		});
		updateDateList(newDateList);
	}

	function deleteDate(date) {
		const newDateList = dateList.filter((ele) => ele != date);
		updateDateList(newDateList);
	}

	function addOffsetToEpoch(offset) {
		const newDateList = dateList.map((ele) => {
			const updatedEpoch = ele.getEpoch() + offset;
			ele.setEpoch(updatedEpoch);
			return ele;
		});
		setDateList(newDateList);
	}

	return (
		<div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
			<Unixtimer onUpdate={setCurEpoch} />
			<div style={{ flex: "1", width: "80%" }}>
				<DropDown list={Object.keys(DateUtil.TIMEZONE_ID_TO_OFFSET)} onSelect={tzSelectHandler} />

				{dateList.map((date) => {
					return (
						<Timeslider
							onUpdate={(offset) => {
								addOffsetToEpoch(offset);
							}}
							minVal={curEpoch * 1000 - 1000 * 60 * 60 * 24 * 2}
							maxVal={curEpoch * 1000 + 1000 * 60 * 60 * 24 * 2}
							date={date}
							onCross={deleteDate}
						/>
					);
				})}
			</div>
		</div>
	);
}
