import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import './Statistics.css';
import numeral from 'numeral';

// This component will be used to make the counter at the top above the map to display the new values of either  all countries or the specific country selected. This will be used to break down based off statistic: cases, recovered, deaths

const statColors = {
	cases: 'red',
	recovered: 'green',
	deaths: 'black',
};

function Statistics({ stat, newOf, totalOf, clicked, ...props }) {
	return (
		<Card className={`stats ${clicked && 'clicked'}`} onClick={props.onClick}>
			<CardContent>
				{/* Display the statistic being looked at */}
				<Typography className="stat_type" variant="h4" color="textSecondary">
					{stat}
				</Typography>

				{/* Display the new of that stat for the day */}
				<h2
					style={{ color: statColors[stat.toLowerCase()] }}
					className="stat_new"
				>
					{numeral(newOf).format('+0.0a')} Today
				</h2>

				{/* Display the total of the stat */}
				<Typography color="textSecondary" className="stat_total" variant="h6">
					Total: {numeral(totalOf).format('0.0a')}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default Statistics;
