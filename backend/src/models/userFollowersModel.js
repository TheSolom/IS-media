import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class UserFollowersModel extends BaseModel {
  #userId;

  #followerId;

  constructor(followeeId, followerId) {
    super('user_followers');

    this.#userId = followeeId;
    this.#followerId = followerId;
  }

  async findFollowers(followeeId) {
    const query = `SELECT * FROM ${this.tableName} JOIN user ON user.id = ${this.tableName}.userId WHERE ${this.tableName}.userId = ?`;
    const result = await connection.execute(query, [followeeId]);
    return result;
  }

  async findFollowees(followerId) {
    const query = `SELECT * FROM ${this.tableName} JOIN user ON user.id = ${this.tableName}.followerId WHERE ${this.tableName}.followerId = ?`;
    const result = await connection.execute(query, [followerId]);
    return result;
  }
}
