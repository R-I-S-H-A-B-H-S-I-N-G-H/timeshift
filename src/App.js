import { useEffect, useRef, useState } from "react";
import { DateUtil } from "./util/timeUtil/DateUtil";
import Slider from "./Components/Slider/Slider";
import { DropDown } from "./Components/Dropdown/DropDown";
import style from "./App.module.css";
import { toLocalstore } from "./util/Util";

export default function App(params) {
	const [epoch, setEpoch] = useState(Date.now());
	const [dateList, setDateList] = useState([new DateUtil(epoch, "UTC")]);

	function tzSelectHandler(timezone) {
		if (!timezone) return;
		for (const dateObj of dateList) if (dateObj.getTimezone() === timezone) return;

		const tzEpoc = DateUtil.fromUTC(epoch, timezone);
		updateDateList([...dateList, new DateUtil(tzEpoc, timezone)]);
	}

	function updateDateList(newDateList) {
		toLocalstore("dateList", newDateList);
		setDateList(newDateList);
	}

	function updateEpoch(utcEpoch) {
		setEpoch(utcEpoch);
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
			<div>
				<DropDown list={Object.keys(DateUtil.TIMEZONE_ID_TO_OFFSET)} onSelect={tzSelectHandler} />
				<h2>UTC Epoch {epoch}</h2>
				<Slider stepVal={1000 * 60 * 30} minVal={Date.now() - 1000 * 60 * 60 * 60} maxVal={Date.now() + 1000 * 60 * 60 * 60} val={epoch} onUpdate={updateEpoch} />

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
