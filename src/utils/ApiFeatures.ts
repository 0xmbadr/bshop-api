import { Document } from 'mongoose';

export default class ApiFeatures {
  mongooseQuery: any;
  queryString: any;
  paginationResult = {};
  constructor(mongooseQuery: any, queryString: any) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludedFields.forEach((field) => delete queryStringObj[field]);
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');

      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    return this;
  }

  search(modelName: string) {
    if (this.queryString.keyword) {
      let query;
      if (modelName === 'Product') {
        query = [
          { title: { $regex: this.queryString.keyword, $options: 'i' } },
          { description: { $regex: this.queryString.keyword, $options: 'i' } },
        ];
      } else {
        query = [{ name: { $regex: this.queryString.keyword, $options: 'i' } }];
      }
      this.mongooseQuery = this.mongooseQuery.or(query);
    }
    return this;
  }

  paginate(documentCounts: number) {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit; // 2 * 10 = 20

    const pagination = {} as {
      currentPage: number;
      limit: number;
      numberOfPages: number;
      next: number;
      prev: number;
    };
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(documentCounts / limit);
    if (endIndex < documentCounts) pagination.next = page + 1;
    if (skip > 0) pagination.prev = page - 1;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}
