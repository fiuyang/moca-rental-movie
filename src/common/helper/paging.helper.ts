import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { PagingResponse } from '../interface/web.interface';

export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  filter: { page: number; limit: number },
): Promise<{
  data: T[];
  paging: {
    limit: number;
    page: number;
    total_data: number;
    total_page: number;
  };
}> {
  const totalData = await queryBuilder.getCount();

  const totalPage = Math.ceil(totalData / filter.limit);

  queryBuilder.skip((filter.page - 1) * filter.limit).take(filter.limit);

  const data = await queryBuilder.getMany();

  const paging: PagingResponse = {
    limit: filter.limit,
    page: filter.page,
    total_data: totalData,
    total_page: totalPage,
  };

  return {
    data,
    paging,
  };
}
