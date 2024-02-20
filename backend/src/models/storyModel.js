import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class StoryModel extends BaseModel {
    constructor() {
        super('stories');
    }

    async findFeedStories(userId, lastId, limit) {
        const query = `SELECT * FROM ${this.getTableName()}
                        JOIN users AS u
                        ON u.id = ${this.getTableName()}.author_id
                        JOIN user_followers AS f
                        ON f.follower_id = u.id
                        WHERE f.follower_id = ? AND ${this.getTableName()}.id > ? AND ${this.getTableName()}.deleted_at > NOW()
                        ORDER BY ${this.getTableName()}.created_at DESC, ${this.getTableName()}.id DESC
                        limit ?`;

        const result = await connection.execute(query, [userId, lastId, limit.toString()]);
        return result;
    }

    async findUserStories(userId, lastId, limit) {
        const query = `SELECT * FROM ${this.getTableName()} 
                        WHERE author_id = ? AND id > ? 
                        ORDER BY created_at DESC, id DESC 
                        limit ?`;

        const result = await connection.execute(query, [userId, lastId, limit.toString()]);
        return result;
    }

    async findActiveUserStories(userId, lastId, limit) {
        const query = `SELECT * FROM ${this.getTableName()} 
                        WHERE author_id = ? AND id > ? AND deleted_at > NOW()
                        ORDER BY created_at DESC, id DESC 
                        limit ?`;

        const result = await connection.execute(query, [userId, lastId, limit.toString()]);
        return result;
    }
}
