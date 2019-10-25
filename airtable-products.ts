import chalk from 'chalk';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { Airtable } from './airtable';
import { Record } from './architecture/record';

export class AirtableProducts {
  public static async sync(newData: { [name: string]: Record }) {
    const config = YAML.parse(
      fs.readFileSync('./config/products-config.yaml', 'utf8'),
    );
    const groupResponse: Promise<any>[] = [];
    config['product-groups'].forEach(groupName => {
      groupResponse.push(this.syncGroup(groupName, newData));
    });
    return Promise.all(groupResponse);
  }

  private static async syncGroup(
    groupName: string,
    newData: { [name: string]: Record },
  ) {
    console.log(chalk.green(`>>>> Processing ${groupName}`));
    const base = Airtable.base('base-products')(groupName);
    const records = await base
      .select({
        maxRecords: 999,
      })
      .all();
    const updateResponse: Promise<any>[] = [];
    records.forEach(record => {
      const regex = /^\*?(.*)/g;
      const product: string =
        (regex.exec(record.fields['Product']) || [,])[1] || '';
      if (newData[product]) {
        if (newData[product]['min-lv'] === 5) {
          newData[product].fields['Product'] = '*' + product;
        }
        updateResponse.push(
          base.update(
            [
              {
                id: record.id,
                fields: newData[product].fields,
              },
            ],
            function(err) {
              if (err) {
                console.error(err);
              }
            },
          ),
        );
        console.log(`${product} updated`);
      } else {
        console.error(chalk.red.inverse(`${product} not found`));
      }
    });
    await Promise.all(updateResponse);
    console.log(chalk.green(`<<<< ${groupName} processed`));
  }
}
