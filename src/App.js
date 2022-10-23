import axios from "axios";
import { useEffect, useState } from "react";
const apiKey = process.env.REACT_APP_KEY;

function App() {
	const [data, setData] = useState({});
	const [isMounted, setMounted] = useState(false);
	const [geo, setGeo] = useState({
		name: "",
		lon: "",
		lat: "",
		units: true,
	});

	const url = {
		city: `http://api.openweathermap.org/geo/1.0/direct?q=${geo.name.toLowerCase()}&limit=1&appid=${apiKey}`,
		weather: `https://api.openweathermap.org/data/2.5/weather?lat=${
			geo.lat
		}&lon=${geo.lon}&appid=${apiKey}&units=${
			geo.units ? "imperial" : "metric"
		}`,
	};

	//? Default set for geo state
	// useEffect(() => {
	// 	axios
	// 		.get(url.city)
	// 		.then((res) => {
	// 			console.log("SettingGeo");
	// 			setGeo({ ...geo, lat: res.data[0].lat, lon: res.data[0].lon });
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// 	return () => {
	// 		axios
	// 			.get(url.weather)
	// 			.then((res) => {
	// 				setData(res.data);
	// 			})
	// 			.catch((err) => {
	// 				console.log(err);
	// 			});
	// 	};
	// }, []);
	//? update data based on changes in geo state
	useEffect(() => {
		if (isMounted) {
			axios
				.get(url.city)
				.then((res) => {
					console.log("Setting Geo");
					setGeo({ ...geo, lat: res.data[0].lat, lon: res.data[0].lon });
				})
				.catch((err) => {
					console.log(err);
				});
			return () => {
				axios
					.get(url.weather)
					.then((res) => {
						console.log("Setting Weather");
						setData(res.data);
						setMounted(false);
					})
					.catch((err) => {
						console.log(err);
					});
			};
		}
	}, [geo]);

	const handleKey = (e) => {
		if (e.key === "Enter") {
			setMounted(true);
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
			</div>
			{data.main && (
				<>
					<h1>Name:{data?.name}</h1>
					<h2>{`Temp: ${data?.main.temp} ${
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
