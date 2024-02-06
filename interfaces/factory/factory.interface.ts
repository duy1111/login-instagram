interface QueryString {
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  eq?: string;
}

// export interface IQuery {
//   sort?: string;
//   limit?: string;
//   page?: string;
//   fields?: string;
//   props?: string;
//   keyword?: string;
//   [key: string]: string | string[] | QueryString | undefined;
// }


export interface IQuery {
  sort?: string;
  limit?: string;
  page?: string;
  fields?: string;
  populate?: string;
  keyword?: { [key: string]: string };
  [key: string]: string | string[] | { [key: string]: string } | undefined;
}