import * as AirtableApi from 'airtable';
import * as fs from 'fs';
import * as YAML from 'yaml';
import { Record } from '../architecture/record';

export class Airtable {
  private static readonly airtableConfig = YAML.parse(
    fs.readFileSync('./config/airtable-config.yaml', 'utf8'),
  );
  public static readonly airtableApi = new AirtableApi({
    apiKey: Airtable.airtableConfig['api-key'],
  });

  public static base(baseName: string): AirtableApi.Base {
    return Airtable.airtableApi.base(Airtable.airtableConfig[baseName]);
  }
}
