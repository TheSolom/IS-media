import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class UserModel extends BaseModel {
  constructor() {
    super('user');
  }

  async findByEmail(email) {
    const query = `SELECT * FROM ${this.tableName} WHERE email = ?`;
    const result = await connection.execute(query, [email]);
    return result;
  }

  async findByUsername(username) {
    const query = `SELECT * FROM ${this.tableName} WHERE username = ?`;
    const result = await connection.execute(query, [username]);
    return result;
  }

  async updateByEmail(email, data) {
    const query = `UPDATE ${this.tableName} SET ? WHERE email = ?`;
    const result = await connection.execute(query, [data, email]);
    return result.affectedRows;
  }

  async updateByUsername(username, data) {
    const query = `UPDATE ${this.tableName} SET ? WHERE username = ?`;
    const result = await connection.execute(query, [data, username]);
    return result.affectedRows;
  }
}
