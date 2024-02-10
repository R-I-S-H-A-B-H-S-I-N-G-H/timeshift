import { useState } from "react";
import style from "./DropDown.module.css";
export function DropDown(props) {
	const { list = [], onSelect = () => {} } = props;
	const [listClickStatus, setListClickStatus] = useState(false);
	const [filter, setFiler] = useState("");

	function listClickHandler(ele) {
		setListClickStatus(false);
		onSelect(ele);
	}
	return (
		<div className={style.dropdown}>
			<label onClick={() => setListClickStatus((prev) => !prev)} className={style.dropdownbtn}>
				<span>TIME ZONES</span>
				<span className={style.arrow}></span>
			</label>

			<div className={!!listClickStatus ? style.listshow : style.listhide} role="menu">
				<div>
					<input name="search" autoComplete="off" onChange={(e) => setFiler(e.target.value)} placeholder="search timezones" />
				</div>
				{list
					.filter((tz) => tz.toUpperCase().includes(filter.toUpperCase()))
					.map((ele) => {
						return (
							<div onClick={() => listClickHandler(ele)} className={style.item}>
								{ele}
							</div>
						);
					})}
			</div>
		</div>
	);
}
