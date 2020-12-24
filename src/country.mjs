import { expand, expandFlags, COUNTRY, FIELDS, SUBDIVISION } from './mappers.mjs';

export default function expandCountry(compressed) {
		const expanded = expand(compressed, COUNTRY);
		
		expanded.grid = expanded.grid.map(row => expandFlags(row, FIELDS));
		expanded.subdivisions = expanded.subdivisions.map(([code, name]) => {
			name = name || code;
			return { code, name };
		});
		expanded.labels = expand(expanded.labels, FIELDS);
		expanded.required = expandFlags(expanded.required, FIELDS);
		
		return expanded;
}
