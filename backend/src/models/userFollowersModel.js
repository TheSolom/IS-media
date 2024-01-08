import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class UserFollowersModel extends BaseModel {
  constructor() {
    super('user_followers');
  }

  async findFollowers(followeeId) {
    const query = `SELECT * FROM ${this.getTableName()} 
                    JOIN users 
                    ON users.id = ${this.getTableName()}.userId
                    WHERE ${this.tableName}.userId = ?`;

    const result = await connection.execute(query, [followeeId]);
    return result[0];
  }

  async findFollowees(followerId) {
    const query = `SELECT * FROM ${this.getTableName()} 
                    JOIN users 
                    ON users.id = ${this.getTableName()}.followerId 
                    WHERE ${this.getTableName()}.followerId = ?`;

    const result = await connection.execute(query, [followerId]);
    return result[0];
  }
}
