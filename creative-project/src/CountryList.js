import React from 'react';
import './CountryList.css';
import numeral from 'numeral';

function CountryList({ data }) {
	return (
		<>
			<h4>List of Countries and Their Cases</h4>
			<div className="country__list">
				<br />
				{data.map(({ country, cases }) => (
					<tr>
						<td>{country}</td>
						<td>{numeral(cases).format('0,0')}</td>
					</tr>
				))}
			</div>
		</>
	);
}

export default CountryList;
