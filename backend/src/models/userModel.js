import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  async findByEmail(email) {
    const query = `SELECT * FROM ${this.getTableName()} WHERE email = ?`;

    const result = await connection.execute(query, [email]);
    return result[0];
  }

  async findByUsername(username) {
    const query = `SELECT * FROM ${this.getTableName()} WHERE username = ?`;

    const result = await connection.execute(query, [username]);
    return result[0];
  }
}
