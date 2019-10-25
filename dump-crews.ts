import * as fs from 'fs';
import * as YAML from 'yaml';
import { Airtable } from './airtable';

const config = YAML.parse(
  fs.readFileSync('./config/crews-config.yaml', 'utf8'),
);
const fieldOrder: string[] = config['field-order'];

Airtable.base('base-crews')('Crews')
  .select({
    maxRecords: 999,
  })
  .all()
  .then(records => {
    const dump = records.reduce((acc: any[], record) => {
      const fields = {};
      fieldOrder.forEach(fieldName => {
        fields[fieldName] = record.fields[fieldName];
      });

      acc.push({
        name: record.fields['中文名'],
        id: record.id,
        fields: fields,
      });
      return acc;
    }, []);
    fs.writeFileSync(`./dump/crews.yaml`, YAML.stringify(dump));
    console.log(`./dump/crews.yaml written`);
  });
