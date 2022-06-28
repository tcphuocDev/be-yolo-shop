import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { isJson } from 'src/helper/string.helper';

@Injectable()
export class FilterQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'query') return this.transformQuery(value);

    return value;
  }

  transformQuery(query: any) {
    if (typeof query !== 'object') return query;

    let { filter } = query;
    if (filter) filter = filter.replace(/\\/g, '');
    if (isJson(filter)) {
      const decodedData = decodeURIComponent(filter);
      query.filter = JSON.parse(decodedData);
    }

    return query;
  }
}
