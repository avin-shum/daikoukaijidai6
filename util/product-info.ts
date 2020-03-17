import { Record } from '../architecture/record';
import { CsvReader } from './csv-reader';

export class ProductInfo {
  static getData(folderPath = './raw-data'): { [name: string]: Record } {
    const out = {};
    CsvReader.read(folderPath, (file, rawData) => {
      const area = file.slice(0, -4);
      rawData.forEach(csvRecord => {
        const [port, ...i] = csvRecord;
        const processedProducts: Set<string> = new Set<string>();

        for (let lv = 1, items = i; items.length >= 3; ++lv) {
          const [product, stock, , ...tempItems] = items;
          const record = this.prepareRecord(out, product, area);
          record.fields[area] += `${
            processedProducts.has(product) ? ',' : port
          }${lv}(${stock})`;
          record['min-lv'] = Math.min(lv, record['min-lv']);
          processedProducts.add(product);
          items = tempItems;
        }

        processedProducts.forEach(product => {
          out[product]['fields'][area] += '\n';
        });
      });
    });
    return out;
  }

  private static prepareRecord(
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
