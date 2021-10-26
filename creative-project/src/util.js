import React from 'react';
import { Circle, Popup } from 'react-leaflet';
import numeral from 'numeral';

const colorNode = {
	cases: {
		hex: '#CC1034',
		rgb: 'rgb(204,16,52)',
		multipler: 800,
	},
	recovered: {
		hex: '#7dd71d',
		rgb: 'rgb(125,215,29)',
		multipler: 1200,
	},
	deaths: {
		hex: '#fb4443',
		rgb: 'rgb(251,68,67)',
		multipler: 2000,
	},
};
