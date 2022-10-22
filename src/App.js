import { computeHeadingLevel } from "@testing-library/react";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
	const [geo, setName] = useState({
		city:"Charlottesville",
		state:'va'
	});
	const [data, setData] = useState({});
	const cityUrl =
		`http://api.openweathermap.org/geo/1.0/direct?q=${geo.city.toLowerCase()},${geo.state.toLowerCase}&limit=1&appid=${API key}`
	const weatherUrl = "";

	useEffect(() => {
		console.log("using that effect!");
		axios.get;
	}, []);
	return (
		<div className="App">
			<h1></h1>
		</div>
	);
}

export default App;
