import React, { useState } from 'react';
import './Map.css';
import { Map as MapContainer, TileLayer } from 'react-leaflet';
import { Circle, Tooltip } from 'react-leaflet';
import numeral from 'numeral';
import Modal from 'react-modal';
import Graph from './Graph';

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};

const statColor = {
	cases: {
		color: 'red',
		scale: 0.05,
	},
	recovered: {
		color: 'green',
		scale: 0.05,
	},
	deaths: {
		color: 'black',
		scale: 3,
	},
};

function Map({ center, zoom, data, statistic }) {
	const test = async (d) => {
		console.log(d);
		setCountryGraph(true);
	};
	const [countryGraph, setCountryGraph] = useState(false);
	const [info, setInfo] = useState({
		country: '',
		url: '',
	});
	return (
		<div className="world__view">
			<MapContainer center={center} zoom={zoom} doubleClickZoom={false}>
				{/* This template map is provided by leaflet and is just taken straight from their website to create the map. */}
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>
				{data.map((d) => (
					<Circle
						onclick={() => {
							test(d);
							setInfo({
								country: d.country,
								url: `https://disease.sh/v3/covid-19/historical/${d.countryInfo.iso2}?lastdays=60`,
							});
						}}
						center={[d.countryInfo.lat, d.countryInfo.long]}
						color={statColor[statistic].color}
						radius={d[statistic] * statColor[statistic].scale}
						fillcolor="red"
					>
						<Tooltip>
							<div className="tooltip--header">
								<h1>{d.country}</h1>
								<img
									src={d.countryInfo.flag}
									alt={d.country + ' Flag'}
									className="flag"
								/>
							</div>
							<div>
								<h3>COVID-19 Cases: {numeral(d.cases).format('0,0')}</h3>
							</div>
							<div>
								<h3>Recovered: {numeral(d.recovered).format('0,0')}</h3>
							</div>
							<div>
								<h3>Deaths: {numeral(d.deaths).format('0,0')}</h3>
							</div>
						</Tooltip>
					</Circle>
				))}
			</MapContainer>
			<Modal
				isOpen={countryGraph}
				onRequestClose={() => setCountryGraph(false)}
				style={customStyles}
			>
				<h1>{info.country}</h1>
				<h4 className="graph--text">
					{'Graph of ' + statistic + ' over past 2 months'}
				</h4>
				<Graph className="graph" url={info.url} statistic={statistic} />
			</Modal>
		</div>
	);
}

export default Map;
