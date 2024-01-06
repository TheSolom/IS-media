import connection from '../configs/database.js';

export default class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async findAll() {
    const query = `SELECT * FROM ${this.tableName}`;
    const result = await connection.execute(query);
    return result;
  }

  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const result = await connection.execute(query, [id]);
    return result;
  }

  async create(data) {
    const columns = Object.keys(data)
      .map((key) => `\`${key}\``)
      .join(', ');
    const values = Object.values(data)
      .map(() => '?')
      .join(', ');
    // console.log(columns, values); // `firstname`, `lastname`, `username`, `email`, `password`, `isAdmin` ?, ?, ?, ?, ?, ?
    const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${values})`;
    const result = await connection.execute(query, Object.values(data));
    return result[0];
  }

  async updateById(id, data) {
    const keyValuePairs = Object.entries(data);
    const setClause = keyValuePairs
      .map(([key, value]) => `${key} = ${connection.escape(value)}`)
      .join(', ');

    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    const result = await connection.execute(query, [id]);
    return result[0];
  }

  async deleteById(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await connection.execute(query, [id]);
    return result.affectedRows;
  }
}
