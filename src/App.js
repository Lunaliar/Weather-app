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
			axios
				.get(cityUrl)
				.then((res) => {
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
					setData(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		};
		if (mounted.current === true) {
			getWeather();
		} else {
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
		// Will display time in 10:30:23 format
		const formattedTime = hours + ":" + minutes.substr(-2);

		return formattedTime;
	};
	const handleUnits = () => {
		setGeo({ ...geo, units: !geo.units });
	};

	const search = () => {
		return (
			<div className="search">
				<input
					required
					type="text"
					onKeyDown={handleKey}
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				<span>Pick a city...</span>
			</div>
		);
	};
	return (
		<div className="App">
			{data.main ? (
				<div className="main ">
					{search()}

					<div className="major-conditions">
						<div className="button">
							<button
								className="change-units"
								title="Change Units"
								onClick={handleUnits}
							>
								{geo.units ? "Metric" : "Imperial"} units
							</button>
						</div>
						<div className="info">
							<span className="city-name">{data?.name}</span>
							<span className="state-name">{cityData[0]?.state}</span>
							<span className="current-temp">{`${data?.main.temp} ${
								geo.units ? "°F" : "°C"
							}`}</span>
						</div>
					</div>

					<div className="type-icon">
						<span className="weather-main">{data.weather[0]?.main}</span>
						<img
							title={data.weather[0]?.main}
							src={`http://openweathermap.org/img/wn/${data?.weather[0].icon}@2x.png`}
							alt="Weather Icon"
						/>
					</div>

					<div className="minor-conditions">
						<div className="left">
							<div
								className="sunrise"
								title="Sunrise"
							>
								<i className="fa-solid fa-sun" />
								<span>{getTime(data.sys?.sunrise)}</span>
							</div>
							<div
								className="sunset"
								title="Sunset"
							>
								<i className="fa-solid fa-moon" />
								<span>{getTime(data.sys?.sunset)}</span>
							</div>
						</div>

						<div className="center">
							<div
								className="hi-temp"
								title="Hi-Temp"
							>
								<i className="fa-solid fa-temperature-arrow-up" />
								<span>{data.main?.temp_max}</span>
								{geo.units ? " °F" : " °C"}
							</div>
							<div
								className="low-temp"
								title="Low-Temp"
							>
								<i className="fa-solid fa-temperature-arrow-down" />
								<span>{data.main?.temp_min}</span>
								{geo.units ? " °F" : " °C"}
							</div>
						</div>
						<div className="right">
							<div
								className="humiditity"
								title="Humidity"
							>
								<i className="fa-solid fa-droplet" />
								<span>{data.main?.humidity}</span>
								{" %"}
							</div>
							<div
								className="wind"
								title="Wind"
							>
								<i className="fa-solid fa-wind" />
								<span>{data.wind?.speed}</span>
								{geo.units ? " mph" : " km/h"}
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="loader">
					<h1>Sav's Wonderous Weather App</h1>
					<i className="fa-solid fa-cloud-sun" />
					{search()}
				</div>
			)}
			<div className="footer">Sav Costabile © 2022</div>
		</div>
	);
}

export default App;
