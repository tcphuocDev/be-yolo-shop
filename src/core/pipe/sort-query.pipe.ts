import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { isJson } from 'src/helper/string.helper';

@Injectable()
export class SortQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'query') return this.transformQuery(value);

    return value;
  }

  transformQuery(query: any) {
    if (typeof query !== 'object') return query;

    let { sort } = query;
    if (sort) sort = sort.replace(/\\/g, '');

    if (isJson(sort)) {
      const decodedData = decodeURIComponent(sort);
      query.sort = JSON.parse(decodedData);
    }

    return query;
  }
}
