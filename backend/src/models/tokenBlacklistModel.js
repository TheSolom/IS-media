import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class TokenBlacklistModel extends BaseModel {
  constructor() {
    super('blacklisted_tokens');
  }

  async findByToken(token) {
    const query = `SELECT * FROM ${this.getTableName()} WHERE token = ?`;

    const result = await connection.execute(query, [token]);
    return result[0];
  }

  async create(token, exp) {
    const query = `INSERT INTO ${this.getTableName()} (token, expiration_timestamp) VALUES (?, ?)`;

    const result = await connection.execute(query, [token, exp]);
    return result[0];
  }
}
