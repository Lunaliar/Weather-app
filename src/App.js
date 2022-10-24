import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./style.scss";
const apiKey = process.env.REACT_APP_KEY;

function App() {
	const [data, setData] = useState({});
	const [input, setInput] = useState("");
	const [cityData, setCityData] = useState({});
	const [geo, setGeo] = useState({
		name: "",
		units: true,
	});

	const mounted = useRef(false);

	useEffect(() => {
		const cityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${geo.name.toLowerCase()}&limit=1&appid=${apiKey}`;
		const getWeather = () => {
			console.log("step 1");
			axios
				.get(cityUrl)
				.then((res) => {
					console.log("step 2");
					setCityData(res.data);
					return axios.get(
						`https://api.openweathermap.org/data/2.5/weather?lat=${
							res.data[0].lat
						}&lon=${res.data[0].lon}&appid=${apiKey}&units=${
							geo.units ? "imperial" : "metric"
						}`
					);
				})
				.then((res) => {
					console.log("step 3");
					setData(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		};
		if (mounted.current === true) {
			getWeather();
		} else {
			console.log("set mount as true");
			mounted.current = true;
		}
	}, [geo]);

	const handleKey = (e) => {
		if (e.key === "Enter") {
			setGeo({ ...geo, name: input });
			setInput("");
		}
	};
	const getTime = (time) => {
		const unix_timestamp = time;
		// Create a new JavaScript Date object based on the timestamp
		// multiplied by 1000 so that the argument is in milliseconds, not seconds.
		const date = new Date(unix_timestamp * 1000);
		// Hours part from the timestamp
		const hours = date.getHours();
		// Minutes part from the timestamp
		const minutes = "0" + date.getMinutes();
		// Seconds part from the timestamp
		const seconds = "0" + date.getSeconds();

		// Will display time in 10:30:23 format
		const formattedTime =
			hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

		return formattedTime;
	};

	return (
		<div className="App">
			<div className="search">
				<input
					placeholder="Pick a city..."
					type="text"
					onKeyDown={handleKey}
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
			</div>
			{data.main && (
				<div>
					<div className="majorConditions">
						<h1>{data?.name}</h1>
						<h4>{cityData[0]?.state}</h4>
						<h2>{`${data?.main.temp} `}</h2>
						<button
							onClick={() => {
								setGeo({ ...geo, units: !geo.units });
							}}
						>
							{geo.units ? "°F" : "°C"}
						</button>
					</div>
					<img
						src={`http://openweathermap.org/img/wn/${data?.weather[0].icon}@2x.png`}
						alt=""
					/>
					<div className="minorConditions">
						<div title="Sunrise">
							<i class="fa-solid fa-sun" />{" "}
							<span>{getTime(data.sys?.sunrise)}</span> AM
						</div>
						<div title="Sunset">
							{" "}
							<i className="fa-solid fa-moon" />
							<span>{getTime(data.sys?.sunset)}</span> PM
						</div>
						<div>
							<i class="fa-solid fa-temperature-arrow-up" />{" "}
							<span>{data.main?.temp_max}</span>
						</div>
						<div>
							<i class="fa-solid fa-temperature-arrow-down" />{" "}
							<span>{data.main?.temp_min}</span>
						</div>
						<div>
							<i className="fa-solid fa-droplet" />{" "}
							<span>{data.main?.humidity}</span>
						</div>
						<div title="Wind">
							{" "}
							<i className="fa-solid fa-wind" /> <span>{data.wind?.speed}</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
