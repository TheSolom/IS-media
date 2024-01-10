import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class UserFollowersModel extends BaseModel {
  constructor() {
    super('user_followers');
  }

  async findFollowers(followeeId, id, limit) {
    const query = `SELECT * FROM ${this.getTableName()} 
                    WHERE ${this.getTableName()}.userId = ? AND ${this.getTableName()}.id > ?
                    ORDER BY ${this.getTableName()}.followDate DESC, ${this.getTableName()}.id DESC
                    limit ${limit}`;

    const result = await connection.execute(query, [followeeId, id]); // Putting limit here made an error -BUG-
    return result;
  }

  async findFollowees(followerId, id, limit) {
    const query = `SELECT * FROM ${this.getTableName()} 
                    WHERE ${this.getTableName()}.followerId = ? AND ${this.getTableName()}.id > ?
                    ORDER BY ${this.getTableName()}.followDate DESC, ${this.getTableName()}.id DESC
                    limit ${limit}`;

    const result = await connection.execute(query, [followerId, id]); // Putting limit here made an error -BUG-
    return result;
  }
}
