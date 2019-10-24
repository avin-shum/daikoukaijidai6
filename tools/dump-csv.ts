import * as fs from 'fs';
import * as YAML from 'yaml';
import { CsvParser } from '../util/csv-parser';

const parser = new CsvParser();
const dest = './dump-csv/dump-csv.yaml';
fs.writeFileSync(`${dest}`, YAML.stringify(parser.data));
console.log(`File written to ${dest}`);
