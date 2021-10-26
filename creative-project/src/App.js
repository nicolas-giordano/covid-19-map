import './App.css';
import React, { useState, useEffect } from 'react';
import {
	MenuItem,
	FormControl,
	Select,
	Card,
	CardContent,
} from '@material-ui/core';
import Statistics from './Statistics';
import Map from './Map';
import CountryList from './CountryList';
import Graph from './Graph';
import 'leaflet/dist/leaflet.css';

const historyUrl = 'https://disease.sh/v3/covid-19/historical/all?lastdays=30';

function App() {
	// variable to store and change countries
	const [countries, setCountries] = useState([]);
	// What Statistic we are looking at
	const [statistic, setStatistic] = useState('cases');
	// Which country is selected; default global
	const [country, setCountry] = useState('global');
	// Country Data For Filtering
	const [countryData, setCountryData] = useState({});
	// Country Data For Making List
	const [listInfo, setListInfo] = useState([]);
	// States for the map
	const [center, setCenter] = useState({ lat: 20, lng: 0 });
	const [zoom, setZoom] = useState(2);
	const [mapData, setMapData] = useState([]);

	// grab global data on first load
	useEffect(() => {
		fetch('https://disease.sh/v3/covid-19/all')
			.then((res) => res.json())
			.then((d) => {
				setCountryData(d);
			});
	}, []);

	// grab countries data from https://disease.sh/v3/covid-19/countries
	useEffect(() => {
		const countriesData = async () => {
			// grab data from site
			await fetch('https://disease.sh/v3/covid-19/countries')
				// get response
				.then((res) => res.json())
				// pull data  from response
				.then((d) => {
					// store country name and abbrev
					const countries = d.map((country) => ({
						name: country.country,
						abbrev: country.countryInfo.iso2,
					}));

					// sort data by cases
					let sortedCountries = d.sort((a, b) => (a.cases > b.cases ? -1 : 1));

					// save to states
					setCountries(countries);
					setMapData(d);
					setListInfo(sortedCountries);
				});
		};
		// call async function
		countriesData();
	}, []);

	const diffCountry = async (e) => {
		console.log(statistic);
		const countryAbbrev = e.target.value;

		// grab data from site used before https://disease.sh/v3/covid-19/countries
		// if global grab from global data https://disease.sh/v3/covid-19/all
		const getData =
			countryAbbrev === 'global'
				? 'https://disease.sh/v3/covid-19/all'
				: `https://disease.sh/v3/covid-19/countries/${countryAbbrev}`;

		await fetch(getData)
			.then((res) => res.json())
			.then((d) => {
				console.log(countryAbbrev);
				setCountry(countryAbbrev);
				setCountryData(d);
				if (countryAbbrev === 'global') {
					setCenter([34.80746, -40.4796]);
					setZoom(2);
				} else {
					setCenter([d.countryInfo.lat, d.countryInfo.long]);
					setZoom(4);
				}
			});
	};

	return (
		<div className="app">
			<div className="column__one">
				<div className="head">
					<h1>COVID-19 Tracker</h1>
					<FormControl className="filter">
						<Select variant="outlined" value={country} onChange={diffCountry}>
							<MenuItem value="global">All countries</MenuItem>
							{/* Add all countries to the filter */}
							{countries.map((d) => (
								<MenuItem value={d.abbrev}>{d.name}</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>

				<div className="info">
					<Statistics
						stat="Cases"
						onClick={(e) => setStatistic('cases')}
						newOf={countryData.todayCases}
						totalOf={countryData.cases}
						clicked={statistic === 'cases'}
					/>
					<Statistics
						stat="Recovered"
						onClick={(e) => setStatistic('recovered')}
						newOf={countryData.todayRecovered}
						totalOf={countryData.recovered}
						clicked={statistic === 'recovered'}
					/>
					<Statistics
						stat="Deaths"
						onClick={(e) => setStatistic('deaths')}
						newOf={countryData.todayDeaths}
						totalOf={countryData.deaths}
						clicked={statistic === 'deaths'}
					/>
				</div>
				<Map data={mapData} center={center} zoom={zoom} statistic={statistic} />
			</div>

			<Card className="column__two">
				<CardContent>
					<CountryList className="country__list" data={listInfo} />
					{/* header title for the graph */}
					<h4 style={{ marginbottom: '10px' }}>
						Global new {statistic} over the past month
					</h4>
					<Graph className="graph" url={historyUrl} statistic={statistic} />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
