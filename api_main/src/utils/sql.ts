/**
 * TODO extend and customize and use https://github.com/felixfbecker/node-sql-template-strings
 *
 */
const sql = (strs, ...substs): string => substs.reduce(
  (prev, cur, i) => prev + cur + strs[i + 1],
  strs[0],
)

export default sql
