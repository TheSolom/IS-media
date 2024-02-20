import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class UserFollowersModel extends BaseModel {
    constructor() {
        super('user_followers');
    }

    async findFollowers(followeeId, lastId, limit) {
        const query = `SELECT * FROM ${this.getTableName()} 
                        WHERE ${this.getTableName()}.user_id = ? AND ${this.getTableName()}.id > ?
                        ORDER BY ${this.getTableName()}.created_at DESC, ${this.getTableName()}.id DESC
                        limit ?`;

        const result = await connection.execute(query, [followeeId, lastId, limit.toString()]); // https://blog.stackademic.com/nodejs-with-mysql2-parameterized-query-with-limit-and-offset-e7091bfe3c47
        return result;
    }

    async findFollowees(followerId, lastId, limit) {
        const query = `SELECT * FROM ${this.getTableName()} 
                        WHERE ${this.getTableName()}.follower_id = ? AND ${this.getTableName()}.id > ?
                        ORDER BY ${this.getTableName()}.created_at DESC, ${this.getTableName()}.id DESC
                        limit ?`;

        const result = await connection.execute(query, [followerId, lastId, limit.toString()]); // https://blog.stackademic.com/nodejs-with-mysql2-parameterized-query-with-limit-and-offset-e7091bfe3c47
        return result;
    }
}
