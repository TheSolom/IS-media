import connection from '../configs/database.js';

export default class BaseModel {
  #tableName;

  constructor(tableName) {
    this.#tableName = tableName;
  }

  getTableName() {
    return this.#tableName;
  }

  async find(conditions) {
    let whereClause = '';
    if (conditions) {
      whereClause = 'WHERE ';
      Object.entries(conditions).forEach(([key, value]) => {
        whereClause += `${key} = ${connection.escape(value)} AND `;
      });
      whereClause = whereClause.trim().slice(0, -4); // Remove trailing "AND" if any
    }

    const query = `SELECT * FROM ${this.getTableName()} ${whereClause}`;

    const result = await connection.execute(query);
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

  async update(data, conditions) {
    const setClause = Object.entries(data)
      .map(([key, value]) => `${key} = ${connection.escape(value)}`)
      .join(', ');

    let whereClause = '';
    if (conditions) {
      whereClause = 'WHERE ';
      Object.entries(conditions).forEach(([key, value]) => {
        whereClause += `${key} = ${connection.escape(value)} AND `;
      });
      whereClause = whereClause.trim().slice(0, -4); // Remove trailing "AND"
    }
    const query = `UPDATE ${this.getTableName()} SET ${setClause} ${whereClause}`;

    const result = await connection.execute(query);
    return result[0];
  }

  async delete(conditions) {
    let whereClause = '';
    if (conditions) {
      whereClause = 'WHERE ';
      Object.entries(conditions).forEach(([key, value]) => {
        whereClause += `${key} = ${connection.escape(value)} AND `;
      });
      whereClause = whereClause.trim().slice(0, -4); // Remove trailing "AND"
    }
    const query = `DELETE FROM ${this.getTableName()} ${whereClause}`;

    const result = await connection.execute(query);
    return result[0];
  }
}
