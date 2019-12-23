import * as fs from 'fs';
import * as YAML from 'yaml';
import { CsvReader } from '../util/csv-reader';

const dest = './dump-csv/dump-max-buy-in.yaml';
const rawData = CsvReader.read();

const dataArray = rawData
  .reduce((acc: any[], item) => {
    acc.push([item[0], +item[2] + +item[5] + +item[8] + +item[11]]);
    return acc;
  }, [])
  .sort((item1, item2) => item1[1] - item2[1]);

const data = dataArray.reduce((acc, item) => {
  acc[item[0]] = item[1];
  return acc;
}, {});

fs.writeFileSync(`${dest}`, YAML.stringify(data));

const count = dataArray.reduce((acc, item) => {
  acc[item[1]] = acc[item[1]] + 1 || 1;
  return acc;
}, {});

console.log(`Count = ${JSON.stringify(count, null, 2)}`);

const avg =
  dataArray.reduce((acc, item) => acc + item[1], 0) / dataArray.length;
console.log(`Avg = ${avg}`);

console.log(`File written to ${dest}`);
