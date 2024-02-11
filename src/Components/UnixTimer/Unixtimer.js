import { useEffect, useRef, useState } from "react";
import style from "./Unixtimer.module.css";

export default function Unixtimer(props) {
	const { onUpdate = () => {} } = props;
	const [curEpoch, setCurEpoch] = useState(Math.trunc(Date.now() / 1000));
	const timeUpdateInterval = useRef(null);

	useEffect(() => {
		if (!timeUpdateInterval.current)
			timeUpdateInterval.current = setInterval(() => {
				const curEpoch = Math.trunc(Date.now() / 1000);
				setCurEpoch(curEpoch);
				onUpdate(curEpoch);
			}, 1000);

		return () => {
			if (timeUpdateInterval.current) clearInterval(timeUpdateInterval.current);
			timeUpdateInterval.current = null;
		};
	}, []);
	return (
		<div className={style.container}>
			<div className={style.staticText}>The current Unix epoch time is </div>
			<div className={style.epoch}>{curEpoch}</div>
		</div>
	);
}
