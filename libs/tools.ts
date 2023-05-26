class Tools {
  /**
   * 根据controller的queries参数拼接prisma的查询条件
   * @param {*} queries controller的参数
   * @param {*} queryArray 允许查询的参数名数组
   * @return {*} conditions 拼接完成prisma的查询条件
   */
  static getFindConditionsByQueries(queries: any, queryArray: string[]) {
    const conditions = {} as any;
    for (const item in queries) {
      if (typeof queries[item] !== 'undefined') {
        if (queryArray.includes(item) && queries[item] !== '') {
          conditions[item] = { in: queries[item] };
        } else {
          conditions[item] = { contains: queries[item] };
        }
      }
    }
    return conditions;
  }

  /**
   * 子孙树，获取某个ID下的分类
   */
  static sonsTree(arr: any, id: string) {
    const temp: any[] = [];
    let lev = 0;
    const forFn = (arr: any, id: string, lev: number) => {
      for (const value of arr) {
        if ((value.parent === null && id === undefined) || value.parent?.toString() === id) {
          value.deepPath = lev;
          temp.push(value);
          forFn(arr, value.id, lev + 1);
        }
      }
    };
    forFn(arr, id, lev);
    return temp;
  }
}

export default Tools;
