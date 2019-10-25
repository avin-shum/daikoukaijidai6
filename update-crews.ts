import { AirtableCrews } from './airtable-crews';

AirtableCrews.sync().then(() => {
  console.log('done');
});
