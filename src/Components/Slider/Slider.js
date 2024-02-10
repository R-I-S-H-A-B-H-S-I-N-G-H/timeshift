import styles from "./Slider.module.css";
export default function Slider(props) {
	const { onUpdate = () => {}, val, minVal = 0, maxVal = 100, stepVal = 1 } = props;

	function onUpdateHandler(e) {
		const val = parseInt(e.target.value) || minVal;
		onUpdate(val);
	}

	return <input className={styles.slider} type="range" min={minVal} max={maxVal} step={stepVal} value={val} onChange={onUpdateHandler} />;
}
