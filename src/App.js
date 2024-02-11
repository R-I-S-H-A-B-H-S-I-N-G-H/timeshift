import { useEffect, useRef, useState } from "react";
import { DateUtil } from "./util/timeUtil/DateUtil";
import Slider from "./Components/Slider/Slider";
import { DropDown } from "./Components/Dropdown/DropDown";
import style from "./App.module.css";
import { toLocalstore } from "./util/Util";

export default function App(params) {
	const [curEpoch, setCurEpoch] = useState(Math.trunc(Date.now() / 1000));
	const [milli, setMilli] = useState(Date.now());
	const [dateList, setDateList] = useState([new DateUtil(milli, "UTC")]);
	const timeUpdateInterval = useRef(null);

	useEffect(() => {
		if (!timeUpdateInterval.current)
			timeUpdateInterval.current = setInterval(() => {
				setCurEpoch(Math.trunc(Date.now() / 1000));
			}, 1000);

		return () => {
			if (timeUpdateInterval.current) clearInterval(timeUpdateInterval.current);
			timeUpdateInterval.current = null;
		};
	}, []);

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

	return (
		<div>
			<h2>The current Unix epoch time is {curEpoch}</h2>
			<div>
				<DropDown list={Object.keys(DateUtil.TIMEZONE_ID_TO_OFFSET)} onSelect={tzSelectHandler} />
				{/* <h2>UTC MILLI {milli}</h2> */}
				<input
					onChange={(e) => {
						let updatedEpoch = parseInt(e.target.value) * 1000;
						if (typeof updatedEpoch != "number" || !updatedEpoch) {
							updatedEpoch = 0;
						}
						updateEpoch(updatedEpoch);
					}}
					type="number"
					value={Math.trunc(milli / 1000)}
				/>
				<Slider stepVal={1000 * 60 * 30} minVal={Date.now() - 1000 * 60 * 60 * 60} maxVal={Date.now() + 1000 * 60 * 60 * 60} val={milli} onUpdate={updateEpoch} />

				{dateList.map((date) => {
					return (
						<div className={style.dateContainer}>
							<div className={style.date}>
								<div className={style.timezone}>{date.getTimezone()}</div>
								<div className={style.time}>
									{date.getHour(12)} : {date.getMinutes()} {date.getAmPm()}
									<div className={DateUtil.getOffsetHr(date.getTimezone()) == 0 ? style.tzOffsetNeut : DateUtil.getOffsetHr(date.getTimezone()) > 0 ? style.tzOffsetPos : style.tzOffsetNeg}>
										{DateUtil.getOffsetHr(date.getTimezone()) >= 0 ? "+" : ""}
										{DateUtil.getOffsetHr(date.getTimezone())}
									</div>
								</div>
								<div className={style.days}>
									{date.getDate()}th {date.getMonthName()} {date.getYear()}
								</div>
							</div>

							<div className={style.deleteDate} onClick={() => deleteDate(date)}>
								x
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
