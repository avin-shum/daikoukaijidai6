import * as fs from 'fs';
import * as YAML from 'yaml';
import { ProductInfo } from '../util/product-info';

const dest = './dump-csv/dump-csv.yaml';
fs.writeFileSync(`${dest}`, YAML.stringify(ProductInfo.getData()));
console.log(`File written to ${dest}`);
