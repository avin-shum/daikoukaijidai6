import * as fs from 'fs';
import * as YAML from 'yaml';
import { Airtable } from './airtable';
import { Record } from './architecture/record';

const config = YAML.parse(fs.readFileSync('./config/products-config.yaml', 'utf8'));
config['product-groups'].forEach(groupName => {
  Airtable.base('base-products')(groupName)
    .select({
      maxRecords: 999,
    })
    .all()
    .then(records => {
      const dump = records.reduce((acc: Record[], record) => {
        acc.push({
          product: record.fields['Product'],
          id: record.id,
          fields: record.fields,
        });
        return acc;
      }, []);
      // console.log(YAML.stringify(dump));
      fs.writeFileSync(`./dump/${groupName}.yaml`, YAML.stringify(dump));
      console.log(`./dump/${groupName}.yaml written`);
    });
});
