import axios from "axios";
import {useState} from "react";
import "./style.scss";
const apiKey = process.env.REACT_APP_KEY;

// const cityURL = `https://api.openweathermap.org/geo/1.0/direct?q=${geo.name.toLowerCase()}&limit=5&appid=${apiKey}`;

// const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${
// 	geo.units ? "imperial" : "metric"
// }`;

function App() {
	//?State
	const [data, setData] = useState({});
	const [cityNames, setCityNames] = useState({});
	const [input, setInput] = useState("");
	const [geo, setGeo] = useState({
		name: "",
		units: true,
	});
	const [cities, setCities] = useState([]);

	//? Axios callers
	const getCities = (name) => {
		if (name !== "" && name.length >= 1) {
			try {
				axios
					.get(
						`https://api.openweathermap.org/geo/1.0/direct?q=${name.toLowerCase()}&limit=3&appid=${apiKey}`
					)
					.then((res) => {
						setCities(res.data);
					});
			} catch (err) {
				console.log(err);
			}
		} else {
			setCities([]);
			return;
		}
	};

	const getWeather = (lat, lon, cityName, cityState) => {
		setCityNames({});
		axios
			.get(
				`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${
					geo.units ? "imperial" : "metric"
				}`
			)
			.then((res) => {
				setCityNames({name: cityName, state: cityState});
				setCities([]);
				setInput("");
				setData(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	//! Functions

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
		setGeo({...geo, units: !geo.units});
	};

	//? Components

	const minorPairing = (clssnme, first, second) => {
		const minorComponent = (title, icon, data, unit) => {
			return (
				<div title={`${title}`}>
					<i className={`fa-solid fa-${icon}`} />
					<span>{data}</span>
					{unit}
				</div>
			);
		};
		return (
			<div className={clssnme}>
				{minorComponent(first.title, first.icon, first.data, first.unit)}
				{minorComponent(second.title, second.icon, second.data, second.unit)}
			</div>
		);
	};

	const search = () => {
		return (
			<div className="search">
				<input
					required
					value={input}
					type="text"
					onChange={(e) => {
						setInput(e.target.value);
						getCities(e.target.value);
					}}
				/>
				<span>Pick a city...</span>
				{cities && cities.length > 1 ? (
					<div className="search-results">
						{cities.map((c, i) => {
							const result = `${c.name}${
								c.state && c.name !== c.state ? `, ${c.state}` : ""
							}`.substring(0, 27);
							return (
								<div
									className="search-result"
									key={c.name + c.state + i}
									onClick={() => getWeather(c.lat, c.lon, c.name, c.state)}
								>
									{result.length > 25 ? result + "..." : result}
								</div>
							);
						})}
					</div>
				) : (
					""
				)}
			</div>
		);
	};

	const unitButton = () => {
		return (
			<div className="button">
				<button
					className="change-units"
					title="Change Units"
					onClick={handleUnits}
				>
					{geo.units ? "Metric" : "Imperial"} units
				</button>
			</div>
		);
	};

	const mainInfo = () => {
		return (
			<div className="info">
				<span className="city-name">{cityNames?.name}</span>
				{cityNames.name !== cityNames.state && (
					<span className="city-name">{cityNames?.state}</span>
				)}
				<span className="current-temp">{`${data?.main.temp} ${
					geo.units ? "°F" : "°C"
				}`}</span>
			</div>
		);
	};

	const weatherIcon = () => {
		return (
			<div className="type-icon">
				<span className="weather-main">{data.weather[0]?.main}</span>
				<img
					title={data.weather[0]?.main}
					src={`http://openweathermap.org/img/wn/${data?.weather[0].icon}@2x.png`}
					alt="Weather Icon"
				/>
			</div>
		);
	};

	const loader = () => {
		return (
			<div className="loader">
				<i className="fa-solid fa-cloud-sun" />
				<h1>Weather My City?</h1>
				{search()}
			</div>
		);
	};

	//!Data Used
	const componentParams = [
		{
			title: "Sunrise",
			icon: "sun",
			data: getTime(data.sys?.sunrise),
			unit: " AM",
		},
		{
			title: "Sunset",
			icon: "moon",
			data: getTime(data.sys?.sunset),
			unit: " PM",
		},
		{
			title: "Hi-Temp",
			icon: "temperature-arrow-up",
			data: data.main?.temp_max,
			unit: geo.units ? " °F" : " °C",
		},
		{
			title: "Low-Temp",
			icon: "temperature-arrow-down",
			data: data.main?.temp_min,
			unit: geo.units ? " °F" : " °C",
		},
		{
			title: "Humidity",
			icon: "droplet",
			data: data.main?.humidity,
			unit: " %",
		},
		{
			title: "Wind",
			icon: "wind",
			data: data.wind?.speed,
			unit: geo.units ? " mph" : " kmh",
		},
	];

	//? Return
	return (
		<div className="App">
			{data.main ? (
				<div className="main ">
					<div className="major-conditions">
						{unitButton()}
						{mainInfo()}
						{weatherIcon()}
					</div>
					{search()}
					<div className="minor-conditions">
						{minorPairing("left", componentParams[0], componentParams[1])}
						{minorPairing("center", componentParams[2], componentParams[3])}
						{minorPairing("right", componentParams[4], componentParams[5])}
					</div>
				</div>
			) : (
				loader()
			)}
			<div className="footer">Sav © 2022</div>
		</div>
	);
}

export default App;
