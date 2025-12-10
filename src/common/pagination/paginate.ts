import { Model } from 'mongoose';

export interface IMongoosePaginationOptions {
  page: number;
  limit: number;
}

export async function paginateMongoose<T>(
  model: Model<T>,
  options: IMongoosePaginationOptions,
  filter: Record<string, any> = {},
) {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    model.find(filter).skip(skip).limit(limit).exec(),
    model.countDocuments(filter),
  ]);

  return {
    data: items,
    pagination: {
      total,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      hasNextPage: page * limit < total,
    },
  };
}
