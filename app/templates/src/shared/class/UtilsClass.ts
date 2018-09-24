import { Pagination } from "../interfaces/PaginationInterface";

export default class UtilsClass {
  constructor() { }

  getPaginationFromQueryParams(params: any) {
    let pagination: Pagination = {
      limit: Number(params.limit),
      skip: Number(params.skip)
    }
    if (isNaN(pagination.limit)) {
      delete pagination.limit;
    }
    if (isNaN(pagination.skip)) {
      delete pagination.skip;
    }

    return pagination;
  }

  getParamsFromQueryParams(params: any) {
    let newParams = { ...params };
    if (newParams.skip) {
      delete newParams.skip
    }
    if (newParams.limit) {
      delete newParams.limit;
    }
    delete newParams.sort;

    return newParams;
  }
}