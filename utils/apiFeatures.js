module.exports = class ApiFeatures {
  constructor(dbQuery, queryString) {
    this.dbQuery = dbQuery;
    this.queryString = queryString;
    this.filter();
  }
  // 1) build pagination

  pagination(numberOfDocuments = 0) {
    const { page = 1, limit = 5 } = this.queryString;
    const skip = (page - 1) * limit;
    // pagination result
    const lastPage = Math.ceil(numberOfDocuments / limit);
    const nextPage = page < lastPage ? +page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;
    const paginationResult = {
      currentPage: page,
      limit,
      lastPage,
      nextPage,
      prevPage,
      numberOfDocuments,
    };
    this.paginationResult = paginationResult;
    this.dbQuery = this.dbQuery.skip(skip).limit(limit);
    return this;
  }

  // 2) filter by fields except for our reserved words

  filter() {
    const filterFields = { ...this.queryString };
    ['page', 'limit', 'search', 'sort', 'select'].forEach(
      (field) => delete filterFields[field]
    );
    this.dbQuery = this.dbQuery.find(filterFields);
    return this;
  }

  // 3) sort the items

  sort() {
    const sortBy = this.queryString?.sort
      ? this.queryString.sort.replaceAll(',', ' ')
      : 'createdAt';
    this.dbQuery = this.dbQuery.sort(sortBy);
    return this;
  }

  // 4) select the specific fields from each item

  select() {
    console.log('queryString : ', this.queryString);
    const selectedFields = this.queryString?.select
      ? this.queryString.select.replaceAll(',', ' ')
      : '-__v';
    this.dbQuery = this.dbQuery.select(selectedFields);
    return this;
  }

  // 5) search for keywords in the title and description

  search(fields) {
    const searchQuery = {};
    console.log('search fields : ', fields);
    if (this.queryString.search) {
      searchQuery.$or = fields.map((field) => {
        return {
          [field]: { $regex: this.queryString.search, $options: 'i' },
        };
      });
    }
    console.log('query : ', JSON.stringify(searchQuery));
    this.dbQuery = this.dbQuery.find(searchQuery);
    return this;
  }
};
