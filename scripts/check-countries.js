const data = require('../public/data/countries.json');

const codes = data.map(c => c.geo_id).sort();
console.log('Total countries in data:', data.length);
console.log('First 20 codes:', codes.slice(0, 20).join(', '));

const mapCountries = ['US', 'CA', 'MX', 'BR', 'AR', 'GB', 'FR', 'DE', 'ES', 'IT', 'EG', 'ZA', 'NG', 'SA', 'AE', 'CN', 'IN', 'JP', 'KR', 'ID', 'TH', 'VN', 'SG', 'AU', 'NZ'];

const missing = mapCountries.filter(c => !codes.includes(c));
const found = mapCountries.filter(c => codes.includes(c));

console.log('\nMap countries FOUND in data:', found.join(', '));
console.log('Map countries MISSING from data:', missing.join(', '));
