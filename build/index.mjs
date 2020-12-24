#!/usr/bin/env node --no-warnings

import { Buffer } from 'buffer';
import getCountries from './get-countries.mjs';
import getCountry from './get-country.mjs';
import { COUNTRY, expand, expandFlags, FIELDS } from '../src/mappers.mjs';

async function run() {
	const countries = await getCountries();
	
	const all_compressed = [], all_expanded = [];
	
	for (const country_code of countries) {
		try {
			const country = await getCountry(country_code);
			const compressed = country.compress();
			const expanded = expand(compressed, COUNTRY);
			expanded.grid = expanded.grid.map(row => expandFlags(row, FIELDS));
			
			all_compressed.push(compressed);
			all_expanded.push(expanded);
			
		} catch (e) {
			console.error(e);
		}
	}
	
	const expanded_bytes = Buffer.byteLength(JSON.stringify(all_expanded), 'utf8');
	const expanded_kb = Math.round(expanded_bytes / 1000);
	
	const compressed_bytes = Buffer.byteLength(JSON.stringify(all_compressed), 'utf8');
	const compressed_kb = Math.round(compressed_bytes / 1000);
	
	console.log(JSON.stringify(all_compressed));
	console.log('');
	
	console.log(`Expanded:   ${expanded_kb} K`);
	console.log(`Compressed: ${compressed_kb} K`);
	console.log('');
}

// What we need:
//  - Country Code
//  - Country Name
//  - Grid
//  - Labels
//  - Validation
//  - Required
//  - Drop-Down Values

function debug(country) {
	const compressed = country.compress();
	const expanded = expand(compressed, COUNTRY);
	expanded.grid = expanded.grid.map(row => expandFlags(row, FIELDS));
	console.log('Original:');
	console.log(JSON.stringify(country, null, 2));
	console.log('');
	console.log('Compressed:');
	console.log(JSON.stringify(compressed, null, 2));
	console.log('');
	console.log('Expanded:');
	console.log(JSON.stringify(expanded, null, 2));
	console.log('\n\n--------------------\n\n');
}

run();
