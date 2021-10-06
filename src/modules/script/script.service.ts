import { Injectable } from '@nestjs/common';
import parse from 'csv-parse/lib/sync';
import path from 'path';
import fs from 'fs';
import { CategoryService } from '../category';
import { AddressService } from '../address';

@Injectable()
export class ScriptService {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly addressService: AddressService,
  ) {}
  /**
   * initAddress
   * @param payload
   * @returns
   */
  async initAddress() {
    const self = this;
    let output = '';

    const readStream = fs.createReadStream(
      path.join(__dirname, './csv/initAddress.csv'),
    );

    readStream.on('open', () => {
      console.log('file open');
    });

    readStream.on('data', function (chunk) {
      console.log('chunk', chunk.toString('utf8'));
      output += chunk.toString('utf8');
    });

    readStream.on('end', async function () {
      console.log('file end');
      // write to file here.

      try {
        const records = parse(output, {
          columns: true,
          skip_empty_lines: true,
        });
        for (let index = 0; index < records.length; index++) {
          const element = records[index];
          let category = await self.categoryService.findOne({
            name: element.category,
          });

          if (!category) {
            category = await self.categoryService.create({
              name: element.category,
            });
          }

          await self.addressService.create({
            address: element.address,
            chain_id: element.chain,
            category: category.id,
          });
        }
      } catch (error) {
        console.log('initAddress:error', error);
      }
    });

    return true;
  }
}
