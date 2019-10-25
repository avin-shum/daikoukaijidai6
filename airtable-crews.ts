import chalk from 'chalk';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { Airtable } from './airtable';
import { Record } from './architecture/record';

export class AirtableCrews {
  private static readonly dataFile = './dump/crews.yaml';

  public static async sync() {
    const crewsData: any[] = YAML.parse(fs.readFileSync(this.dataFile, 'utf8'));

    console.log(chalk.green(`>>>> Processing Crews...`));
    const base = Airtable.base('base-crews')('Crews');
    const records = await base
      .select({
        maxRecords: 999,
      })
      .all();
    const responses: Promise<any>[] = [];
    crewsData.forEach(record => {
      if (record.id) {
        // Already exists in remote
        responses.push(
          base
            .update([
              {
                id: record.id,
                fields: record.fields,
              },
            ])
            .then(() => {
              console.log(`${record.name} updated`);
            })
            .catch(err => {
              if (err) {
                console.error(err);
              }
            }),
        );
      } else {
        // New record
        responses.push(
          base
            .create([
              {
                fields: record.fields,
              },
            ])
            .then(() => {
              console.log(`${record.name} updated`);
            })
            .catch(err => {
              if (err) {
                console.error(err);
              }
            }),
        );
      }
    });
    console.log(chalk.green(`<<<< Crews processed`));
    return Promise.all(responses);
  }
}
