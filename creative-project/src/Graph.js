import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

// color for the graph depending on which statistic is being displayed
const statColors = {
	cases: {
		rgba: 'rgba(255,0,0,0.5)',
		color: 'red',
	},
	recovered: {
		rgba: 'rgba(0,255,0,0.5)',
		color: 'green',
	},
	deaths: {
		rgba: 'rgba(0,0,0,0.5)',
		color: 'black',
	},
};

// formating of the graph which was constructed using documentation from Chart.js and examples they provided.
const options = {
	legend: {
		display: false,
	},
	elements: {
		point: {
			radius: 0,
		},
	},
	maintainAspectRatio: false,
	tooltips: {
		mode: 'index',
		intersect: false,
		callbacks: {
			label: function (tooltipItem, data) {
				return numeral(tooltipItem.value).format('+0,0');
			},
		},
	},
	scales: {
		xAxes: [
			{
				type: 'time',
				time: {
					format: 'MM/DD/YY',
					tooltipFormat: 'll',
				},
			},
		],
		yAxes: [
			{
				gridLines: {
					display: false,
				},
				ticks: {
					callback: function (value, index, values) {
						return numeral(value).format('0a');
					},
				},
			},
		],
	},
};

function Graph({ statistic, url, ...props }) {
	console.log(url);
	console.log('https://disease.sh/v3/covid-19/historical/all?lastdays=30');
	const [data, setData] = useState({});

	// grab historical data of the past half of the year
	// this should be recalled everytime the statistic is changed.
	useEffect(() => {
		const getHistory = async () => {
			await fetch(url)
				.then((res) => res.json())
				.then((d) => {
					console.log(d);
					let graphData = getData(d, statistic);
					setData(graphData);
				});
		};

		getHistory();
	}, [statistic]);

	// function created to parse the data and format it in a way where it calculates new statistic from day to day
	// take today and subtract from previous day
	// must be formated into x and y components to make use of Chart.js data styling
	const getData = (data, statistic) => {
		const graphData = [];
		let prev;

		if (data['country'] === undefined) {
			for (let date in data[statistic]) {
				console.log(date);
				if (prev) {
					const newCases = {
						x: date,
						y: data[statistic][date] - prev,
					};
					graphData.push(newCases);
				}
				prev = data[statistic][date];
			}
		} else {
			for (let date in data['timeline'][statistic]) {
				console.log(date);
				if (prev) {
					const newCases = {
						x: date,
						y: data['timeline'][statistic][date] - prev,
					};
					graphData.push(newCases);
				}
				prev = data['timeline'][statistic][date];
			}
		}

		return graphData;
	};
	return (
		<>
			{/* graph created using Chart.js documentation */}
			<div className={props.className}>
				{/* check if we have any data, if we do display it */}
				{data?.length > 0 && (
					<Line
						options={options}
						data={{
							datasets: [
								{
									borderColor: statColors[statistic].color,
									backgroundColor: statColors[statistic].rgba,
									data: data,
								},
							],
						}}
					/>
				)}
			</div>
		</>
	);
}

export default Graph;
