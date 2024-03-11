import connection from '../configs/database.js';
import BaseModel from './baseModel.js';

export default class ConversationModel extends BaseModel {
    constructor() {
        super('user_blocklist');
    }

    async findBlocks(blockerId, lastId, limit) {
        const query = `SELECT ${this.getTableName()}.*, users.username, users.profile_picture FROM ${this.getTableName()}
                        JOIN users
                        ON users.id = ${this.getTableName()}.blocked_id
                        WHERE ${this.getTableName()}.user_id = ? AND ${this.getTableName()}.id > ?
                        ORDER BY ${this.getTableName()}.created_at DESC, ${this.getTableName()}.id DESC
                        limit ${limit}`;

        const result = await connection.execute(query, [blockerId, lastId.toString()]);
        return result;
    }

    async findUserBlockStatus(userId1, userId2) {
        const query = `SELECT * FROM ${this.getTableName()}
                        WHERE (${this.getTableName()}.user_id = ? AND ${this.getTableName()}.blocked_id = ?)
                        OR (${this.getTableName()}.user_id = ? AND ${this.getTableName()}.blocked_id = ?)`;

        const result = await connection.execute(query, [userId1, userId2, userId2, userId1]);
        return result;
    }
}