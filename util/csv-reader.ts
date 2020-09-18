import { default as parse } from 'csv-parse/lib/sync';
import * as fs from 'fs';

export class CsvReader {
  static read(
    folderPath = './raw-data',
    readFileCallback?: (filename: string, data: any) => any,
  ): any[] {
    let out: any = [];
    fs.readdirSync(folderPath)
      .filter((file) => file.endsWith('.csv'))
      .forEach((file) => {
        console.log(`Reading ${folderPath}/${file}`);
        const data = parse(fs.readFileSync(`${folderPath}/${file}`));
        if (readFileCallback) {
          readFileCallback(file, data);
        }
        out = out.concat(data);
      });
    return out;
  }
}
