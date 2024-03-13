import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class UserFollowersModel extends BaseModel {
    constructor() {
        super('user_followers');
    }

    async findFollowers(followeeId, lastId, limit) {
        const query = `SELECT ${this.getTableName()}.*, users.username, users.profile_picture FROM ${this.getTableName()}
                        JOIN users
                        ON users.id = ${this.getTableName()}.follower_id
                        WHERE ${this.getTableName()}.user_id = ? AND ${this.getTableName()}.id > ?
                        ORDER BY ${this.getTableName()}.created_at DESC, ${this.getTableName()}.id DESC
                        limit ?`;

        const result = await connection.execute(query, [followeeId, lastId, limit.toString()]); // https://blog.stackademic.com/nodejs-with-mysql2-parameterized-query-with-limit-and-offset-e7091bfe3c47
        return result;
    }

    async findFollower(followeeId) {
        const query = `SELECT * FROM ${this.getTableName()}
                        WHERE ${this.getTableName()}.user_id = ?`;

        const result = await connection.execute(query, [followeeId]);
        return result;
    }

    async findFollowees(followerId, lastId, limit) {
        const query = `SELECT ${this.getTableName()}.*, users.username, users.profile_picture FROM ${this.getTableName()}
                        JOIN users
                        ON users.id = ${this.getTableName()}.user_id
                        WHERE ${this.getTableName()}.follower_id = ? AND ${this.getTableName()}.id > ?
                        ORDER BY ${this.getTableName()}.created_at DESC, ${this.getTableName()}.id DESC
                        limit ?`;

        const result = await connection.execute(query, [followerId, lastId, limit.toString()]); // https://blog.stackademic.com/nodejs-with-mysql2-parameterized-query-with-limit-and-offset-e7091bfe3c47
        return result;
    }

    async findFollowee(followeeId) {
        const query = `SELECT * FROM ${this.getTableName()}
                        WHERE ${this.getTableName()}.follower_id = ?`;

        const result = await connection.execute(query, [followeeId]);
        return result;
    }

    async DeleteFollowStatus(userId1, userId2) {
        const query = `DELETE FROM ${this.getTableName()}
                        WHERE (${this.getTableName()}.user_id = ? AND ${this.getTableName()}.follower_id = ?)
                        OR (${this.getTableName()}.user_id = ? AND ${this.getTableName()}.follower_id = ?)`;

        const result = await connection.execute(query, [userId1, userId2, userId2, userId1,]);
        return result[0];
    }
}
