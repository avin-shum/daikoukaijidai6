import { Airtable } from './util/airtable';
import { ProductInfo } from './util/product-info';

// 1. Parse from raw data
const data = ProductInfo.getData();

// 2. Sync to Airtable
Airtable.sync(data).then(() => {
  console.log('done');
});
