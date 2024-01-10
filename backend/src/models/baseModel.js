import connection from '../configs/database.js';

export default class BaseModel {
  #tableName;

  constructor(tableName) {
    this.#tableName = tableName;
  }

  getTableName() {
    return this.#tableName;
  }

  async findById(id) {
    const query = `SELECT * FROM ${this.getTableName()} WHERE id = ?`;

    const result = await connection.execute(query, [id]);
    return result[0];
  }

  async create(data) {
    const columns = Object.keys(data)
      .map((key) => `\`${key}\``)
      .join(', ');
    const values = Object.values(data)
      .map(() => '?')
      .join(', ');

    const query = `INSERT INTO ${this.getTableName()} (${columns}) VALUES (${values})`;

    const result = await connection.execute(query, Object.values(data));
    return result[0];
  }

  async updateById(id, data) {
    const keyValuePairs = Object.entries(data);
    const setClause = keyValuePairs
      .map(([key, value]) => `${key} = ${connection.escape(value)}`)
      .join(', ');

    const query = `UPDATE ${this.getTableName()} SET ${setClause} WHERE id = ?`;

    const result = await connection.execute(query, [id]);
    return result[0];
  }

  async deleteById(id) {
    const query = `DELETE FROM ${this.getTableName()} WHERE id = ?`;

    const result = await connection.execute(query, [id]);
    return result[0];
  }
}
