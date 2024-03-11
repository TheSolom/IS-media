import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class PostModel extends BaseModel {
    constructor() {
        super('posts');
    }

    async findFeedPosts(userId, lastId, limit) {
        const query = `SELECT ${this.getTableName()}.*, u.username, u.profile_picture FROM ${this.getTableName()}
                        JOIN users AS u
                        ON u.id = ${this.getTableName()}.author_id
                        JOIN user_followers AS f
                        ON f.user_id = u.id
                        WHERE ${this.getTableName()}.author_id != ? AND f.follower_id = ? AND ${this.getTableName()}.id > ?
                        ORDER BY ${this.getTableName()}.created_at DESC, ${this.getTableName()}.id DESC
                        LIMIT ?`;

        const result = await connection.execute(query, [userId, userId, lastId, limit.toString()]);
        return result;
    }

    async findUserPosts(userId, lastId, limit) {
        const query = `SELECT ${this.getTableName()}.*, u.username, u.profile_picture FROM ${this.getTableName()}
                        JOIN users AS u
                        ON u.id = ${this.getTableName()}.author_id
                        WHERE ${this.getTableName()}.author_id = ? AND ${this.getTableName()}.id > ? 
                        ORDER BY ${this.getTableName()}.created_at DESC, ${this.getTableName()}.id DESC 
                        limit ?`;

        const result = await connection.execute(query, [userId, lastId, limit.toString()]);
        return result;
    }
}