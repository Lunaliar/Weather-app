import axios from "axios";
import { useEffect, useState } from "react";
import "./style.scss";
const apiKey = process.env.REACT_APP_KEY;

function App() {
	const [data, setData] = useState({});
	const [isMounted, setMounted] = useState(false);
	const [geo, setGeo] = useState({
		name: "",
		units: true,
	});

	const cityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${geo.name.toLowerCase()}&limit=1&appid=${apiKey}`;

	useEffect(() => {
		if (isMounted) {
			axios
				.get(cityUrl)
				.then((res) => {
					console.log("Getting Coordinates");
					axios
						.get(
							`https://api.openweathermap.org/data/2.5/weather?lat=${
								res.data[0].lat
							}&lon=${res.data[0].lon}&appid=${apiKey}&units=${
								geo.units ? "imperial" : "metric"
							}`
						)
						.then((res) => {
							console.log("Setting Weather");
							setData(res.data);
						})
						.catch((err) => {
							console.log(err);
						});
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			setMounted(true);
		}
	}, [geo]);

	const handleKey = (e) => {
		if (e.key === "Enter") {
			setGeo({ ...geo, name: e.target.value });
		}
	};

	return (
		<div className="App">
			<div className="search">
				<input
					placeholder="Pick a city..."
					type="text"
					onKeyDown={handleKey}
				/>
				<button
					onClick={() => {
						setGeo({ ...geo, units: !geo.units });
					}}
				>
					F/C
				</button>
			</div>
			{data.main && (
				<>
					<h1>{data?.name}</h1>
					<h2>{`${data?.main.temp} ${
						geo.units ? "fahrenheit" : "celcius"
					}`}</h2>
					<img
						src={`http://openweathermap.org/img/wn/${data?.weather[0].icon}@2x.png`}
						alt=""
					/>
				</>
			)}
		</div>
	);
}

export default App;
