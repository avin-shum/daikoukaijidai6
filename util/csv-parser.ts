import * as parse from 'csv-parse/lib/sync';
import * as fs from 'fs';
import { Record } from '../architecture/record';

export class CsvParser {
  constructor(private folderPath: string = './raw-data') {}

  public get data(): { [name: string]: Record } {
    let out = {};
    fs.readdirSync(this.folderPath)
      .filter(file => file.endsWith('.csv'))
      .forEach(file => {
        console.log(`Reading ${this.folderPath}/${file}`);
        out = this.parse(file, out);
      });
    return out;
  }

  private parse(file: string, data: { [name: string]: Record }) {
    const area = file.slice(0, -4);
    parse(fs.readFileSync(`${this.folderPath}/${file}`)).forEach(csvRecord => {
      const [port, ...i] = csvRecord;
      const processedProducts: Set<string> = new Set<string>();

      for (let lv = 1, items = i; items.length >= 3; ++lv) {
        const [product, stock, , ...tempItems] = items;
        const record = this.prepareRecord(data, product, area);
        record.fields[area] += `${
          processedProducts.has(product) ? ',' : port
        }${lv}(${stock})`;
        record['min-lv'] = Math.min(lv, record['min-lv']);
        processedProducts.add(product);
        items = tempItems;
      }

      processedProducts.forEach(product => {
        data[product]['fields'][area] += '\n';
      });
    });
    return data;
  }

  private prepareRecord(
    data: { [name: string]: Record },
    product: string,
    area: string,
  ): Record {
    data[product] = data[product] || {
      product: product,
      fields: {},
      'min-lv': 5,
    };
    data[product]['fields'][area] = data[product]['fields'][area] || '';
    return data[product];
  }
}
