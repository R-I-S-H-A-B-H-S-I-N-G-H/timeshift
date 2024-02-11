import Slider from "../Slider/Slider";
import style from "./Timeslider.module.css";
export default function Timeslider(props) {
	const { date, onUpdate, minVal, maxVal, onCross } = props;
	const curMili = date.getEpoch();

	function onUpdateHandler(newMili) {
		const diff = newMili - curMili;
		onUpdate(diff);
	}
	return (
		<div className={style.container}>
			<Slider stepVal={1000 * 60 * 30} minVal={minVal} maxVal={maxVal} val={date.getEpoch()} onUpdate={onUpdateHandler} />
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

				<div className={style.deleteDate} onClick={() => onCross(date)}>
					x
				</div>
			</div>
		</div>
	);
}
